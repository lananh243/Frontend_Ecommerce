import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 10,
      staleTime: 1000 * 60 * 5,
    } as any,
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
