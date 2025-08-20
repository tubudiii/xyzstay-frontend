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
            toast({
              title: "Pembayaran Berhasil",
              description: "Transaksi berhasil diproses.",
              variant: "default",
            });
            onSuccess?.(result);
          },
          onPending: (result) => {
            toast({
              title: "Pembayaran Pending",
              description: "Transaksi sedang diproses.",
              variant: "default",
            });
            onPending?.(result);
          },
          onError: (error) => {
            toast({
              title: "Pembayaran Gagal",
              description: "Terjadi kesalahan pada transaksi.",
              variant: "destructive",
            });
            onError?.(error);
          },
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
