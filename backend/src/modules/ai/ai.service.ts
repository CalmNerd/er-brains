import { generateTaskSuggestion } from "./providers/groq.provider.js";
import type { AiSuggestRequest } from "./ai.validation.js";

export async function suggestTask(input: AiSuggestRequest) {
  return generateTaskSuggestion(input.title);
}
