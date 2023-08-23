'use client';

import { Button, Flex, Input, Text, VStack, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { Form, ActionFunctionArgs, redirect } from 'react-router-dom';
import { setAuthToken, setRefreshToken } from '../../utils/auth';
import { useLoginMutation } from '../../store/slices/api/authApiSlice';
import { Auth } from '../../models/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/other/authSlice';

/* eslint-disable-next-line */
export interface LoginProps {}

export function Login(props: LoginProps) {
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res: Auth.Response = await login(loginForm).unwrap();
    dispatch(
      setCredentials({
        access_token: res.access_token,
        refresh_token: res.refresh_token,
      })
    );
    navigate('/', { replace: true });
  };

  return (
    <VStack
      w="full"
      h="100vh"
      backgroundImage="/images/EtiyaBg1NoHeader.png"
      backgroundRepeat="round"
      alignItems="center"
      justifyContent="center"
      gap={8}
    >
      <Image src="/images/EtiyaLogo2_white.png" alt="Etiya Logo"></Image>
      <Flex
        bg="white"
        borderRadius="3xl"
        pt={10}
        pb={10}
        pr={10}
        pl={10}
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={8}
      >
        <Text fontSize="20pt" fontWeight={700}>
          WELCOME
        </Text>
        <Form method="post">
          <Input
            required
            name="username"
            placeholder="Username"
            type="text"
            mb={2}
            onChange={onChange}
            fontSize="10pt"
            _placeholder={{ color: 'gray.500' }}
            _hover={{
              bg: 'white',
              border: '1px solid',
              borderColor: 'blue.500',
            }}
            _focus={{
              outline: 'none',
              bg: 'white',
              border: '1px solid',
              borderColor: 'blue.500',
            }}
            bg="gray.50"
          ></Input>
          <Input
            required
            name="password"
            placeholder="Password"
            type="password"
            mb={2}
            onChange={onChange}
            fontSize="10pt"
            _placeholder={{ color: 'gray.500' }}
            _hover={{
              bg: 'white',
              border: '1px solid',
              borderColor: 'blue.500',
            }}
            _focus={{
              outline: 'none',
              bg: 'white',
              border: '1px solid',
              borderColor: 'blue.500',
            }}
            bg="gray.50"
          ></Input>
          <Button
            type="submit"
            width="100%"
            height="36px"
            mt={2}
            mb={2}
            bg="orange.300"
            color="white"
            onClick={handleSubmit}
          >
            Log In
          </Button>
        </Form>
      </Flex>
    </VStack>
  );
}

export default Login;

/* export const action = (login) => async (args: ActionFunctionArgs) => {
  const data = await args.request.formData();
  const authData: Auth.LoginRequest = {
    username: data.get('username')?.toString(),
    password: data.get('password')?.toString(),
  };

  const res: Auth.Response = await login(authData).unwrap();
  setAuthToken(res.access_token);
  setRefreshToken(res.refresh_token);
  return redirect('/');
}; */
