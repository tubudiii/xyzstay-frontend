import { useEffect, useRef } from "react";

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

export function MidtransTrigger({
  clientKey,
  transactionToken,
  onSuccess,
  onPending,
  onError,
  onClose,
}: MidtransPaymentProps) {
  const hasRun = useRef(false);

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
          onSuccess: (result) => onSuccess?.(result),
          onPending: (result) => onPending?.(result),
          onError: (error) => onError?.(error),
          onClose: () => onClose?.(),
        });
      } else {
        console.error("Midtrans snap not loaded");
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [clientKey, transactionToken]);

  return null;
}
    