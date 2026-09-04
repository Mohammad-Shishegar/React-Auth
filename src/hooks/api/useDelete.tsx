import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMethod } from "../../lib/RequestMethods";

export const useDelete = (
  url: string,
  queryKey: string[],
  requestConfig?: any,
  ...config: any
) => {
  const queryClient = useQueryClient();
  return useMutation<any, unknown, string>({
    mutationFn: async (id: string) => {
      const finalURL = `${url}?id=${id}`;
      const response = await deleteMethod(finalURL, requestConfig);
      return response;
    },
    onSuccess: (data) => {
      queryKey?.map((item: string) =>
        queryClient.invalidateQueries({ queryKey: [item] }),
      );
      config?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Delete request failed", error);
      config.onError?.(error);
    },
    ...config,
  });
};
