import { ButtonProps, ModalProps } from '@chakra-ui/react';

export namespace Modal {
  export type Options<T = any> = Partial<{
    modalHeaderClass?: string;
    modalBodyClass?: string;
    modalFooterClass?: string;
    modalTitle: string;
    isCloseButtonActive: boolean;
    leftButtonProps: {
      props?: ButtonProps;
      title?: string;
      isActive: boolean;
      onClick?: (data?: T | any) => void;
    };
    rightButtonProps: {
      props?: ButtonProps;
      title?: string;
      isActive: boolean;
      onClick?: (data?: T | any) => void;
    };
  }>;

  export interface ModalProperties<T = any> extends ModalProps {
    config?: Options<T>;
  }

  export type ModalHooks<T = any> = {
    isOpen: boolean;
    onOpen?: () => void;
    onClose: () => void;
    onToggle?: () => void;
    isControlled?: boolean;
    getButtonProps?: (T?: any) => any;
    getDisclosureProps?: (T?: any) => any;
  };
}
