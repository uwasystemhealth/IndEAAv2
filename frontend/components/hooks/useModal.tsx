import { useState } from 'react';

export interface ModalStateType {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const useModal = (): ModalStateType => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  return {
    isOpen,
    handleOpen,
    handleClose,
  };
};

export default useModal;
