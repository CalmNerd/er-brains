import Groq from "groq-sdk";

import { env } from "../../../config/env.js";
import { AppError } from "../../../utils/app-error.js";
import type { AiSuggestRequest } from "../ai.validation.js";
import { aiSuggestResponseSchema } from "../ai.validation.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an assistant for a task management app.

Given a rough task title and/or description, generate:
- a clear, concise, professional task title
- a concise professional description (1-2 sentences)
- a priority level

Title rules:
- Keep the same intent as the user's rough input
- Use proper capitalization and grammar
- Be short and actionable (roughly 3-10 words)
- If only a description is provided, infer an appropriate title from it

Description rules:
- Expand on the title with actionable context
- If only a title is provided, write a helpful description based on it

Priority rules:
- Urgent: production outages, security incidents, blocking issues
- High: major bugs, important deadlines, critical features
- Medium: normal feature work, standard improvements
- Low: cleanup, documentation, nice-to-have work

Return valid JSON only with this exact shape:
{
  "title": "string",
  "description": "string",
  "priority": "Urgent" | "High" | "Medium" | "Low"
}`;

const RETRY_PROMPT = `${SYSTEM_PROMPT}

IMPORTANT: Respond with JSON only. No markdown, no prose, no code fences.`;

function buildUserMessage(input: AiSuggestRequest): string {
  const parts: string[] = [];

  if (input.title) {
    parts.push(`Title: ${input.title}`);
  }

  if (input.description) {
    parts.push(`Description: ${input.description}`);
  }

  return parts.join("\n");
}

async function callGroq(
  userMessage: string,
  systemPrompt: string
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new AppError("AI generation failed", 502, "AI_GENERATION_FAILED");
  }

  return content;
}

function parseAndValidate(content: string) {
  const parsed: unknown = JSON.parse(content);
  return aiSuggestResponseSchema.parse(parsed);
}

export async function generateTaskSuggestion(input: AiSuggestRequest) {
  const userMessage = buildUserMessage(input);

  try {
    const content = await callGroq(userMessage, SYSTEM_PROMPT);
    return parseAndValidate(content);
  } catch (firstError) {
    try {
      const content = await callGroq(userMessage, RETRY_PROMPT);
      return parseAndValidate(content);
    } catch {
      console.error("AI suggestion failed:", firstError);
      throw new AppError("AI generation failed", 502, "AI_GENERATION_FAILED");
    }
  }
}
