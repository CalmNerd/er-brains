import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { AiSuggestRequest, AiSuggestResponse } from "@/lib/ai/types"

export async function suggestTask(
  input: AiSuggestRequest,
  signal?: AbortSignal
): Promise<AiSuggestResponse> {
  return apiRequest<AiSuggestResponse>(endpoints.ai.suggest, {
    method: "POST",
    data: input,
    signal,
  })
}
