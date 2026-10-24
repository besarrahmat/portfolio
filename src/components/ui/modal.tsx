import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog } from "@base-ui/react/dialog";
import type { ReactElement, ReactNode } from "react";
import { Icon } from "./icon";

type ModalProps = {
  trigger: ReactElement;
  title: string;
  description?: string;
  children: ReactNode;
  /** Buttons for the footer; wrap the closing one in <ModalClose>. */
  actions?: ReactNode;
};

// Dialog for a task that needs protected focus (import preview). Focus is trapped and returns to the trigger.
export function Modal({
  trigger,
  title,
  description,
  children,
  actions,
}: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={trigger} />
      <Dialog.Portal>
        <Dialog.Backdrop className="ui-backdrop" />
        <Dialog.Viewport className="ui-modal-viewport">
          <Dialog.Popup className="ui-modal">
            <div className="ui-modal__head">
              <Dialog.Title className="ui-modal__title">{title}</Dialog.Title>
              <Dialog.Close
                className="ui-button ui-button--quiet ui-button--icon"
                aria-label="Close"
              >
                <Icon name="close" />
              </Dialog.Close>
            </div>
            {description && (
              <Dialog.Description className="ui-modal__description">
                {description}
              </Dialog.Description>
            )}
            <div className="ui-modal__body">{children}</div>
            {actions && <div className="ui-modal__actions">{actions}</div>}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const ModalClose = Dialog.Close;

type ConfirmDialogProps = {
  trigger: ReactElement;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
};

// Confirmation before an irreversible step (archive a record). Esc and the backdrop do not confirm.
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={trigger} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="ui-backdrop" />
        <AlertDialog.Viewport className="ui-modal-viewport">
          <AlertDialog.Popup className="ui-modal ui-modal--alert">
            <AlertDialog.Title className="ui-modal__title">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className="ui-modal__description">
              {description}
            </AlertDialog.Description>
            <div className="ui-modal__actions">
              <AlertDialog.Close className="ui-button ui-button--secondary">
                Cancel
              </AlertDialog.Close>
              <AlertDialog.Close
                className="ui-button ui-button--primary"
                onClick={onConfirm}
              >
                {confirmLabel}
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
