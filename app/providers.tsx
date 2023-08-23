'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import Dashboard from './pages';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Index from './page';
import MergeRequestDetail from './pages/merge-request-detail/merge-request-detail';
import { loader as rootLoader } from './page';
import { loader as dashboardLoader } from './pages/dashboard/dashboard';
import { useRefreshMutation } from './store/slices/api/authApiSlice';
import { Login } from './pages/login/login';

export function Providers({ children }: { children: React.ReactNode }) {
  const [refresh] = useRefreshMutation();
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Index></Index>,
      loader: rootLoader(refresh),
      children: [
        {
          index: true,
          element: <Dashboard></Dashboard>,
          loader: dashboardLoader,
        },
        {
          path: '/mergerequestdetail/:mergeRequestId',
          element: <MergeRequestDetail></MergeRequestDetail>,
        },
      ],
    },
    {
      path: '/login',
      element: <Login></Login>,
    },
  ]);

  return (
    <CacheProvider>
      <ChakraProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
