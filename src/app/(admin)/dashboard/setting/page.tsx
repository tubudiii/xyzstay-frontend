"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useUpdateProfileMutation } from "@/services/auth.service";
import { useToast } from "@/components/atomics/use-toast"; // ⬅️ pakai toast

export default function SettingPage() {
  const { data: session, update } = useSession();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { toast } = useToast(); // ⬅️ init toast
  const [isEditing, setIsEditing] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState<null | {
    title: string;
    desc?: string;
  }>(null); // ⬅️ modal opsional
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const { setUser } = useUser();

  // ambil user dari backend
  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/user/${session.user.id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        const user = res.data?.data || res.data?.user || {};
        setForm((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
        }));
        setUser(user);
      } catch {
        setForm((prev) => ({
          ...prev,
          name: session.user.name || "",
          email: session.user.email || "",
          phone_number: session.user.phone_number || "",
        }));
        setUser(session.user);
      }
    };
    fetchUser();
  }, [session, setUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (session?.user) {
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
        phone_number: session.user.phone_number || "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast({
        title: "User not found",
        description: "Silakan login ulang lalu coba lagi.",
        variant: "destructive",
      });
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      toast({
        title: "Konfirmasi password tidak cocok",
        description: "Pastikan password dan konfirmasi sama persis.",
        variant: "destructive",
      });
      return;
    }

    const payload: any = {
      id: session.user.id,
      name: form.name,
      email: form.email,
      phone_number: form.phone_number,
    };
    if (form.password) payload.password = form.password;

    try {
      await updateProfile(payload).unwrap();

      // jika user mengganti password, tampilkan modal info
      if (form.password) {
        setIsEditing(false);
        setShowInfoModal({
          title: "Profile updated, please log in again",
          desc: "For security reasons, please log in again with your new password.",
        });
        return;
      }

      // refresh profil setelah update
      const userRes = await axios.get(
        `http://127.0.0.1:8000/api/user/${session.user.id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      const user = userRes.data?.data || userRes.data?.user || {};

      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        password: "",
        confirmPassword: "",
      }));
      setUser(user);

      // sinkron ke session
      await update({
        user: {
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
        },
      });

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated.",
      });
    } catch (err: any) {
      if (err?.errors) {
        const msg = Object.values(err.errors).join("\n");
        toast({
          title: "Failed to update account",
          description: msg,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to update account",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Card container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Account Settings
            </h2>
            <p className="text-sm text-gray-500">
              Manage your account information and settings.
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                form="settings-form"
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: profile preview */}
            <section className="lg:col-span-1">
              <div className="flex flex-col items-center gap-4">
                <div className="h-28 w-28 rounded-full ring-1 ring-gray-200 overflow-hidden bg-gray-50">
                  <img
                    src={session?.user?.avatar || "/images/avatar.webp"}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <div className="text-base font-medium text-gray-900">
                    {form.name || "—"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {form.email || "—"}
                  </div>
                </div>
              </div>
            </section>

            {/* Right: form/details */}
            <section className="lg:col-span-2">
              {!isEditing ? (
                <div className="space-y-5">
                  <FieldDisplay label="Name" value={form.name} />
                  <FieldDisplay label="Email" value={form.email} />
                  <FieldDisplay
                    label="Phone Number"
                    value={form.phone_number}
                  />
                </div>
              ) : (
                <form
                  id="settings-form"
                  onSubmit={handleSave}
                  className="space-y-5"
                >
                  <FieldInput
                    label="Name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <FieldInput
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <FieldInput
                    label="Phone Number"
                    name="phone_number"
                    type="text"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                  />

                  <div className="pt-2">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Security
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldInput
                        label="New Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        minLength={6}
                        placeholder="••••••"
                      />
                      <FieldInput
                        label="Password Confirmation"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        minLength={6}
                        placeholder="••••••"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Leave blank if you don't want to change the password.
                    </p>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Info Modal (opsional) */}
      {showInfoModal && (
        <InfoModal
          title={showInfoModal.title}
          desc={showInfoModal.desc}
          onClose={() => setShowInfoModal(null)}
        />
      )}
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function FieldDisplay({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        <div className="mt-1 text-gray-900">{value || "—"}</div>
      </div>
    </div>
  );
}

function FieldInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  minLength,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition
                   placeholder:text-gray-400
                   focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
      />
    </label>
  );
}

/** Modal info sederhana (Tailwind) */
function InfoModal({
  title,
  desc,
  onClose,
}: {
  title: string;
  desc?: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {desc && <p className="px-5 py-4 text-sm text-gray-600">{desc}</p>}
        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
