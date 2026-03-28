/**
 * Optional LLM enhancement layer.
 * When OPENAI_API_KEY or GEMINI_API_KEY is present, this module provides
 * richer text generation for concept decomposition and fusion descriptions.
 * Without any key, all functions return null and callers fall back to rule-based logic.
 */

type LLMProvider = 'openai' | 'gemini' | null

function detectProvider(): LLMProvider {
  if (process.env.OPENAI_API_KEY) return 'openai'
  if (process.env.GEMINI_API_KEY) return 'gemini'
  return null
}

export const LLM_AVAILABLE = detectProvider() !== null

/**
 * Ask the LLM a question and return the text response, or null on failure.
 */
async function askLLM(prompt: string): Promise<string | null> {
  const provider = detectProvider()
  if (!provider) return null

  try {
    if (provider === 'openai') {
      return await askOpenAI(prompt)
    } else {
      return await askGemini(prompt)
    }
  } catch (e) {
    console.error('[llm] request failed, falling back to rule-based:', e)
    return null
  }
}

async function askOpenAI(prompt: string): Promise<string | null> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
      temperature: 0.8,
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? null
}

async function askGemini(prompt: string): Promise<string | null> {
  const model = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 512, temperature: 0.8 },
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null
}

/**
 * Try to enrich a fusion description via LLM.
 * Returns null if LLM is unavailable or the call fails.
 */
export async function enrichFusionDescription(
  conceptA: string,
  conceptB: string,
  pattern: string,
  baseDescription: string,
  mode: string,
): Promise<{ description: string; catchcopy: string; problemSolved: string; targetUsers: string } | null> {
  const prompt = `あなたは発明アイデアライターです。以下の発明案を、より魅力的な日本語で表現してください。

概念A: ${conceptA}
概念B: ${conceptB}
融合パターン: ${pattern}
モード: ${mode}
元の説明: ${baseDescription}

以下のJSON形式のみで回答してください（他のテキストは不要）:
{
  "description": "100字以内の発明説明",
  "catchcopy": "20字以内のキャッチコピー",
  "problemSolved": "この発明が解決する問題（50字以内）",
  "targetUsers": "ターゲットユーザー（30字以内）"
}`

  const raw = await askLLM(prompt)
  if (!raw) return null

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    const parsed = JSON.parse(jsonMatch[0])
    if (parsed.description && parsed.catchcopy && parsed.problemSolved && parsed.targetUsers) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

/**
 * Try to decompose an unknown concept into 9-axis attributes via LLM.
 * Returns null if LLM is unavailable, the concept is in the dictionary, or the call fails.
 */
export async function llmDecomposeConcept(raw: string): Promise<Record<string, string[]> | null> {
  const prompt = `あなたは概念分析AIです。「${raw}」という概念を9つの軸で分析してください。

以下のJSON形式のみで回答してください（他のテキストは不要）:
{
  "物理的特徴": ["特徴1", "特徴2"],
  "感情的特徴": ["特徴1", "特徴2"],
  "用途": ["用途1", "用途2"],
  "対象": ["対象1", "対象2"],
  "状態変化": ["変化1", "変化2"],
  "周辺イメージ": ["イメージ1", "イメージ2"],
  "制約": ["制約1", "制約2"],
  "逆説性": ["逆説1"],
  "functions_emotions": ["感情1", "感情2"]
}`

  const raw_response = await askLLM(prompt)
  if (!raw_response) return null

  try {
    const jsonMatch = raw_response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0])
  } catch {
    return null
  }
}
