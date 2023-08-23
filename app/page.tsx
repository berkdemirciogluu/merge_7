'use client';

import { Flex, HStack, Image, SlideFade, Spinner } from '@chakra-ui/react';
import Sidebar from './components';
import { Outlet, redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getAuthToken,
  getRefreshToken,
  setUserCredentials,
} from './utils/auth';
import { Auth } from './models/auth';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

export default function Index() {
  const [render, setRender] = useState(false);
  const isSomeQueryPending = useSelector((state: RootState) =>
    Object.values(state.api.queries).some((query) => query.status === 'pending')
  );

  useEffect(() => setRender(true), []);
  return render ? (
    <HStack w="full" h="100vh" bg="gray.100" padding={3}>
      <SlideFade in={true} style={{ width: 'auto', height: '100%' }}>
        <Sidebar></Sidebar>
      </SlideFade>
      {/*       {isSomeQueryPending ? (
        <div>
          <img src="/gifs/loading_animation.gif" alt="loading" />
        </div>
      ) : (
        <Outlet></Outlet>
      )} */}
      {isSomeQueryPending ? (
        <Flex
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : (
        <Outlet></Outlet>
      )}
    </HStack>
  ) : null;
}

export const loader = (refresh) => async () => {
  const refreshTokenReq: Auth.RefreshRequest = {
    refresh_token: getRefreshToken(),
  };

  const token: string | null = getAuthToken();

  if (!token) return redirect('/login');

  setInterval(async () => {
    const response = await refresh(refreshTokenReq);
    setUserCredentials(
      response?.data?.access_token,
      response?.data?.refresh_token
    );
  }, 290000);
  return null;
};
