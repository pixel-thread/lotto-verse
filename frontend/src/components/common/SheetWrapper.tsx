import { Sheet } from '@tamagui/sheet';
import React, { ReactNode } from 'react';

type SheetWrapperProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  snapPoints?: number[];
  zIndex?: number;
  dismissOnSnapToBottom?: boolean;
};

export const SheetWrapper = ({
  open,
  setOpen,
  children,
  snapPoints = [65, 50, 25],
  zIndex = 100_000,
  dismissOnSnapToBottom = false,
}: SheetWrapperProps) => {
  const [position, setPosition] = React.useState(0);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal
      open={open}
      onOpenChange={setOpen}
      snapPoints={snapPoints}
      snapPointsMode={'percent'}
      dismissOnSnapToBottom={dismissOnSnapToBottom}
      position={position}
      onPositionChange={setPosition}
      zIndex={zIndex}
      animation="bouncy">
      <Sheet.Overlay
        animation="lazy"
        bg="$black5"
        disabled={dismissOnSnapToBottom}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame p="$4" gap="$5">
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};
