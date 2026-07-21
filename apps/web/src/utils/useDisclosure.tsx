import { useCallback, useState } from "react";

type UseDisclosureCallbacks = {
  onOpen?: () => void;
  onClose?: () => void;
};

type UseDisclosureHandlers = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

/**
 * Mantine-like disclosure hook for managing boolean state
 * (modals, drawers, popovers, collapsibles).
 *
 * const [opened, { open, close, toggle }] = useDisclosure();
 *
 * Callbacks only fire when the state actually changes
 * (e.g. calling open() while already open does not re-fire onOpen).
 */
export default function useDisclosure(
  initialState = false,
  { onOpen, onClose }: UseDisclosureCallbacks = {},
): [boolean, UseDisclosureHandlers] {
  const [opened, setOpened] = useState(initialState);

  const open = useCallback(() => {
    setOpened((isOpened) => {
      if (!isOpened) {
        onOpen?.();
        return true;
      }
      return isOpened;
    });
  }, [onOpen]);

  const close = useCallback(() => {
    setOpened((isOpened) => {
      if (isOpened) {
        onClose?.();
        return false;
      }
      return isOpened;
    });
  }, [onClose]);

  const toggle = useCallback(() => {
    setOpened((isOpened) => {
      if (isOpened) {
        onClose?.();
      } else {
        onOpen?.();
      }
      return !isOpened;
    });
  }, [onOpen, onClose]);

  return [opened, { open, close, toggle }];
}
