import { useMutation } from "@tanstack/react-query";
import { postMethod } from "../../lib/RequestMethods";

type UsePostConfig = {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
};

export const usePost = (
  url: string,
  requestConfig?: any,
  config?: UsePostConfig,
) => {
  return useMutation<any, unknown, Record<string, any>>({
    mutationFn: async (body: object) => {
      const response = await postMethod(url, body, requestConfig);
      return response;
    },
    onSuccess: (data) => {
      config?.onSuccess?.(data);
    },
    onError: (error: any) => {
      config?.onError?.(error);
    },
  });
};
