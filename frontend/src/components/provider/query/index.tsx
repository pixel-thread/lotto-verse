import { useAuth } from '@clerk/clerk-expo';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const RNQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();

  const queryClient = new QueryClient({
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
    defaultOptions: {
      queries: { enabled: isSignedIn, networkMode: 'offlineFirst' },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
