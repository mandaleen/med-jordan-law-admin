"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog compound components must be used within a <Dialog />");
  }
  return context;
}

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open: controlledOpen, onOpenChange: setControlledOpen, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const onOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (setControlledOpen) {
        setControlledOpen(nextOpen);
      }
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
    },
    [isControlled, setControlledOpen]
  );

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props?.onClick?.(e);
        onOpenChange(true);
      },
    });
  }

  return (
    <button type="button" onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

const emptySubscribe = () => () => {};

export function DialogPortal({ children }: { children: React.ReactNode }) {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
  overlayClassName?: string;
}

export function DialogContent({
  className,
  overlayClassName,
  children,
  onClose,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  const { open, onOpenChange } = useDialog();
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
    onClose?.();
  }, [onOpenChange, onClose]);

  // Lock body scroll and handle Escape key + focus trapping
  React.useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "Tab" && contentRef.current) {
        const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus into modal
    const timer = setTimeout(() => {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }, 30);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <DialogPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      >
        {/* Backdrop Scrim */}
        <div
          className={cn("fixed inset-0 bg-navy-950/50 backdrop-blur-sm transition-opacity", overlayClassName)}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal Window */}
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className={cn(
            "relative w-full max-w-lg bg-white rounded-3xl shadow-[0_30px_80px_-20px_rgba(17,26,48,0.45)] border border-navy-900/10 overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] outline-none",
            className
          )}
          {...props}
        >
          {showCloseButton && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute end-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {children}
        </div>
      </div>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 pt-6 pb-4 border-b border-navy-900/[0.06] flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold text-navy-950 tracking-tight leading-none", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-gray-500 leading-relaxed", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-4 bg-navy-50/50 border-t border-navy-900/[0.06] flex items-center justify-end gap-2.5", className)}
      {...props}
    />
  );
}
