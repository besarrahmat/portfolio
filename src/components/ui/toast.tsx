"use client";

import { Toast as Base } from "@base-ui/react/toast";
import type { ReactNode } from "react";
import { Icon } from "./icon";

// Save notices in manage. Toasts are announced politely and pause while hovered or focused (Base UI Toast).
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Base.Provider timeout={5000}>
      {children}
      <Base.Portal>
        <Base.Viewport className="ui-toast-viewport">
          <ToastList />
        </Base.Viewport>
      </Base.Portal>
    </Base.Provider>
  );
}

function ToastList() {
  const { toasts } = Base.useToastManager();
  return toasts.map((toast) => (
    <Base.Root key={toast.id} toast={toast} className="ui-toast">
      <Base.Content className="ui-toast__content">
        <Base.Title className="ui-toast__title" />
        <Base.Description className="ui-toast__description" />
      </Base.Content>
      <Base.Close
        className="ui-button ui-button--quiet ui-button--icon"
        aria-label="Dismiss"
      >
        <Icon name="close" size="sm" />
      </Base.Close>
    </Base.Root>
  ));
}

// const toast = useToast(); toast.add({ title: "Saved", description: "SOBAT-PS is published." })
export const useToast = Base.useToastManager;
