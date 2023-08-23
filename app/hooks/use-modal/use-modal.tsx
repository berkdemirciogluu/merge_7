'use client';

import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { Modal as CustModal } from '../../models/modal';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseModal {
  CustomModal: React.FC<CustModal.ModalProperties>;
  modalHooks: CustModal.ModalHooks;
}

export function useModal(): UseModal {
  const { ...modalHooks } = useDisclosure();

  const CustomModal = React.useMemo(() => {
    const ModalComponent: React.FC<CustModal.ModalProperties> = ({
      children,
      config,
      ...props
    }) => {
      return (
        <Modal {...modalHooks} {...props}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className={config?.modalHeaderClass}>
              {config?.modalTitle}
            </ModalHeader>
            {config?.isCloseButtonActive && <ModalCloseButton />}
            <ModalBody className={config?.modalBodyClass}>{children}</ModalBody>
            <ModalFooter className={config?.modalFooterClass}>
              {config?.leftButtonProps?.isActive && (
                <Button
                  {...config?.leftButtonProps?.props}
                  mr={3}
                  onClick={config?.leftButtonProps.onClick}
                >
                  {config?.leftButtonProps?.title}
                </Button>
              )}
              {config?.rightButtonProps?.isActive && (
                <Button
                  {...config?.rightButtonProps?.props}
                  onClick={config.rightButtonProps.onClick}
                >
                  {config?.rightButtonProps?.title}
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    };
    return ModalComponent;
  }, [modalHooks]);

  return { CustomModal, modalHooks };
}

export default useModal;
