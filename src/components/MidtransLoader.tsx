import { useEffect, useRef } from "react";
import { useToast } from "@/components/atomics/use-toast";

export interface MidtransPaymentProps {
  clientKey: string;
  transactionToken: string;

  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (error: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export function MidtransTrigger(props: MidtransPaymentProps) {
  const {
    clientKey,
    transactionToken,
    onSuccess,
    onPending,
    onError,
    onClose,
  } = props;
  const hasRun = useRef(false);
  const { toast } = useToast();

  // Keep stable refs to callbacks so they can be safely used in effect deps
  const onSuccessRef = useRef(onSuccess);
  const onPendingRef = useRef(onPending);
  const onErrorRef = useRef(onError);
  const onCloseRef = useRef(onClose);
  const toastRef = useRef(toast);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onPendingRef.current = onPending;
    onErrorRef.current = onError;
    onCloseRef.current = onClose;
    toastRef.current = toast;
  }, [onSuccess, onPending, onError, onClose, toast]);

  useEffect(() => {
    if (!transactionToken || hasRun.current) return;

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    script.onload = () => {
      if (window.snap) {
        hasRun.current = true;
        window.snap.pay(transactionToken, {
          onSuccess: (result) => {
            toastRef.current?.({
              title: "Transaction Successful",
              description: "Transaction has been successfully processed.",
              variant: "default",
            });
            onSuccessRef.current?.(result);
          },
          onPending: (result) => {
            toastRef.current?.({
              title: "Transaction Pending",
              description: "Transaction is being processed.",
              variant: "default",
            });
            onPendingRef.current?.(result);
          },
          onError: (error) => {
            toastRef.current?.({
              title: "Transaction Failed",
              description: "An error occurred during the transaction.",
              variant: "destructive",
            });
            onErrorRef.current?.(error);
          },
          onClose: () => onCloseRef.current?.(),
        });
      } else {
        console.error("Midtrans snap not loaded");
      }
    };

    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [clientKey, transactionToken]);

  return null;
}
