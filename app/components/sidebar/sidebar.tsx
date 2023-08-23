'use client';

import { Flex, Text, Heading, IconButton, Icon } from '@chakra-ui/react';
import { FiHome, FiMenu, FiLayers, FiLogOut, FiGitMerge } from 'react-icons/fi';

import React, { useState } from 'react';
import { SidebarItemModel } from './models/sidebar-item';
import { Avatar, Divider } from 'antd';
import SidebarItem from './components/sidebar-item/sidebar-item';
import useMenu from '../../hooks/use-modal/use-modal';
import { redirect, useNavigate } from 'react-router-dom';

/* eslint-disable-next-line */
export interface SidebarProps {}

export function Sidebar(props: SidebarProps) {
  const navigate = useNavigate();
  const { modalHooks, CustomModal } = useMenu();
  const [isSmallSize, changeNavSize] = useState(false);
  const navSizeHandler = (): void => {
    isSmallSize ? changeNavSize(false) : changeNavSize(true);
  };

  const logoutHandler = (): void => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const items: SidebarItemModel[] = [
    { title: 'Dashboard', icon: FiHome, link: '/' },
    {
      title: 'New Merge Request',
      link: '/login',
      icon: FiGitMerge,
    },
    { title: 'Logout', icon: FiLogOut, link: '', onClick: logoutHandler },
  ];

  return (
    <Flex
      as="aside"
      w={isSmallSize ? '75px' : '350px'}
      h="full"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      maxW={350}
      bg="white"
      borderRadius="3xl"
      padding={6}
    >
      <CustomModal isOpen={modalHooks.isOpen} onClose={modalHooks.onClose}>
        Berk
      </CustomModal>
      <Flex
        p="5%"
        flexDirection="column"
        w="100%"
        justifyContent="center"
        alignItems={isSmallSize ? 'center' : 'flex-start'}
      >
        <Flex
          w="full"
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row"
        >
          {!isSmallSize && (
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Icon as={FiLayers}></Icon>
              <Text fontWeight="bold" fontSize={16}>
                Merge Request App
              </Text>
            </Flex>
          )}
          <Flex flexDirection="column" alignItems="flex-start" as="nav">
            <IconButton
              aria-label="menu-toogle"
              background="none"
              _hover={{ background: 'none' }}
              icon={<FiMenu></FiMenu>}
              onClick={navSizeHandler}
            ></IconButton>
          </Flex>
        </Flex>
        <Divider></Divider>
      </Flex>

      <Flex
        p="5%"
        flexDirection="column"
        w="100%"
        justifyContent="center"
        alignItems={isSmallSize ? 'center' : 'flex-start'}
        as="nav"
      >
        {items.map((item, index) => (
          <SidebarItem
            item={item}
            key={index}
            isSmallSize={isSmallSize}
          ></SidebarItem>
        ))}
      </Flex>

      <Flex
        p="5%"
        flexDirection="column"
        w="100%"
        alignItems={isSmallSize ? 'center' : 'flex-start'}
        mb={4}
      >
        <Divider></Divider>
        <Flex mt={4} align="center">
          <Avatar size="large"></Avatar>
          <Flex
            flexDirection="column"
            ml={4}
            display={isSmallSize ? 'none' : 'flex'}
          >
            <Heading as="h3" size="sm">
              Berk Demircioglu
            </Heading>
            <Text color="gray">Admin</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
