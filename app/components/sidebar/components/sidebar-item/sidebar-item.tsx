'use client';

import React from 'react';
import { Flex, Text, Icon, Link, Menu, MenuButton } from '@chakra-ui/react';
import { SidebarItemModel } from '../../models/sidebar-item';
import { NavLink } from 'react-router-dom';

import classes from './sidebar-item.module.css';

/* eslint-disable-next-line */
export interface SidebarItemProps {
  item: SidebarItemModel;
  isSmallSize: boolean;
}

export function SidebarItem(props: SidebarItemProps) {
  return (
    <NavLink to={props?.item.link} style={{ width: '100%' }}>
      <Flex
        mt={30}
        flexDirection="column"
        w="100%"
        justifyContent="center"
        alignItems="center"
        onClick={props?.item?.onClick}
      >
        <Menu placement="right">
          <Link
            //backgroundColor={props?.isActive ? '#AEC8CA' : ''}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#AEC8CA' }}
            w={!props?.isSmallSize ? '100%' : ''}
          >
            <MenuButton w="100%">
              <Flex>
                <Icon
                  as={props?.item?.icon}
                  fontSize="xl"
                  //color={props?.isActive ? '#82AAAD' : 'gray.500'}
                />
                <Text ml={5} display={props?.isSmallSize ? 'none' : 'flex'}>
                  {props?.item?.title}
                </Text>
              </Flex>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
    </NavLink>
  );
}

export default SidebarItem;
