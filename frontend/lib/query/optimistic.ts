import type { QueryClient, QueryKey } from "@tanstack/react-query"

type OptimisticContext<TData> = {
  previousData: TData | undefined
}

export async function runOptimisticUpdate<TData>({
  queryClient,
  queryKey,
  updater,
}: {
  queryClient: QueryClient
  queryKey: QueryKey
  updater: (current: TData | undefined) => TData | undefined
}): Promise<OptimisticContext<TData>> {
  await queryClient.cancelQueries({ queryKey })

  const previousData = queryClient.getQueryData<TData>(queryKey)

  queryClient.setQueryData<TData>(queryKey, updater(previousData))

  return { previousData }
}

export function revertOptimisticUpdate<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  context?: OptimisticContext<TData>
) {
  if (context?.previousData !== undefined) {
    queryClient.setQueryData(queryKey, context.previousData)
  }
}
