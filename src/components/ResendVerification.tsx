import { useState } from "react";

export default function ResendVerification({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/email/verification-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage("Email verifikasi telah dikirim ulang. Silakan cek email Anda.");
      } else {
        setMessage("Gagal mengirim ulang email verifikasi.");
      }
    } catch {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button type="button" onClick={handleResend} disabled={loading} className="bg-primary text-white px-4 py-2 rounded">
        {loading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
      </button>
      {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
    </div>
  );
}
