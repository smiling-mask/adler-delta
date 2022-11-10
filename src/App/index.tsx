import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppContainer } from './styles';

import Home from '../pages/Home';

import { Path, TimeFormat } from '../constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: TimeFormat.second * 1,
      staleTime: TimeFormat.second * 5,
      cacheTime: TimeFormat.minutes(30),
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        console.info('API Request has Success (Queries) :: [Success]', data);
      },
      onError: (error) => {
        console.info('API Request has failed (Queries) :: [Error]', error);
      },
    },
    mutations: {
      retry: 1,
      retryDelay: TimeFormat.second * 1,
      cacheTime: TimeFormat.minutes(30),
      useErrorBoundary: true,
      onMutate: (variables) => {
        console.info('API Request has mutated (Mutations) :: [Mutate]', variables);
      },
      onSuccess: (data) => {
        console.info('API Request has Success (Mutations) :: [Success]', data);
      },
      onError: (error) => {
        console.info('API Request has failed (Mutations) :: [Error]', error);
      },
    },
  },
});

function App(): JSX.Element {
  return (
    <AppContainer>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path={Path.home} element={<Home />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AppContainer>
  );
}

export default App;
