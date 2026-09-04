import { useMutation } from "@tanstack/react-query";
import { putMethod } from "../../lib/RequestMethods";

type UsePutConfig = {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
};

export const usePut = (
  url: string,
  requestConfig?: any,
  config?: UsePutConfig,
) => {
  return useMutation<any, unknown, Record<string, any>>({
    mutationFn: async (body: object) => {
      const response = await putMethod(url, body, requestConfig);
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
