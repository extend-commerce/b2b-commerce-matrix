import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { FEATURES } from '../data/features';

interface UseAIAnalysisReturn {
  analyze: (description: string) => Promise<string[]>;
  loading: boolean;
  resultCount: number | null;
  error: string | null;
}

const VALID_IDS = new Set(FEATURES.map((f) => f.id));

const SYSTEM_PROMPT = `You are a B2B commerce feature analyst. A merchant will describe their business and requirements in natural language. Your job is to identify which features from the provided feature list they are likely to need, based on what they describe.

Return ONLY a valid JSON array of feature IDs — no explanation, no markdown, no extra text.

Here is the complete feature list:
${JSON.stringify(FEATURES)}

Rules:
- Only return IDs from the list above. Do not invent new ones.
- Be liberal but not excessive — if a feature is clearly implied by what they describe, include it.
- If they mention ERP integration, include all ERP-related features.
- If they mention reps or a sales team, include rep-related features.
- If they mention multiple locations or buyer companies, include multi-location and company hierarchy features.
- If they mention custom pricing or contracts, include the relevant pricing features.
- Aim for 10–25 features for a typical description. More is fine if the description is detailed.

Return format:
["cat_1", "ord_4", "acc_6", ...]`;

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (description: string): Promise<string[]> => {
    setLoading(true);
    setError(null);
    setResultCount(null);

    try {
      const client = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: description,
          },
        ],
      });

      const rawText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      // Strip backtick code blocks if present
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed: unknown = JSON.parse(cleaned);

      if (!Array.isArray(parsed)) {
        throw new Error('Response was not an array');
      }

      const validIds = (parsed as unknown[]).filter(
        (id): id is string => typeof id === 'string' && VALID_IDS.has(id)
      );

      setResultCount(validIds.length);
      return validIds;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Could not analyze — please select features manually`);
      console.error('AI analysis error:', message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, resultCount, error };
}
