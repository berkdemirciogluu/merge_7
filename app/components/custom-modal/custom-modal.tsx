import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

export type Options<T = any> = Partial<{
  id: string;
  modalClass: string;
  modalTitle: string;
  modalSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  confirm: (data?: T) => void;
  close: (data?: T) => void;
  cancel: (data?: T) => void;
  modalHeaderClass: string;
  modalBodyClass: string;
  modalAnimation: 'slideInBottom' | 'slideInRight' | 'none';
  scrollBehavior: 'inside' | 'outside';
}>;

export type ModalHooks<T = any> = {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  onToggle?: () => void;
  isControlled?: boolean;
  getButtonProps?: (T?: any) => any;
  getDisclosureProps?: (T?: any) => any;
};

export interface CustomModalProps<T = any> {
  modalHeader?: () => void | string;
  modalBody?: () => void | string;
  modalFooter?: () => void | string;
  config?: Options;
  data?: T;
  modalHooks: ModalHooks;
}

export function CustomModal(props: CustomModalProps) {
  return (
    <Modal
      isCentered
      onClose={props.modalHooks.onClose}
      isOpen={props.modalHooks.isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props?.config?.modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button>Close</Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CustomModal;
