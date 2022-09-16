// React + Redux + Functionality
import React, { ReactNode, useState } from 'react';

import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export type Props = {
  title?: string;
  description?: string;
  action: any;
  actionParameter?: [];
  buttonProps?: any;
  children: ReactNode;
};
const AreYouSureButton = ({
  title,
  description,
  action,
  actionParameter = [],
  buttonProps,
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Button {...buttonProps} onClick={() => setIsOpen(true)}>
        {children}
      </Button>
      <Dialog open={isOpen} keepMounted onClose={() => setIsOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{description}</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Never Mind</Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              action(...actionParameter);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

AreYouSureButton.defaultProps = {
  title: 'Are you sure?',
  description: 'Are you sure you want to do this? This action is irreversible',
  actionParameter: [],
  buttonProps: {},
};

export default AreYouSureButton;
