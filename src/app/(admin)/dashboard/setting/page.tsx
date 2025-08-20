"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useUpdateProfileMutation } from "@/services/auth.service";

export default function SettingPage() {
  const { data: session, update } = useSession(); // ✅ pakai update dari next-auth
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
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
      if (session?.user?.id) {
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
      }
    };
    fetchUser();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ fungsi edit & cancel
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
      alert("User tidak ditemukan");
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      alert("Password dan konfirmasi tidak sama");
      return;
    }

    const payload: any = {
      id: session.user.id,
      name: form.name,
      email: form.email,
      phone_number: form.phone_number,
    };
    if (form.password) {
      payload.password = form.password;
    }

    try {
      const res = await updateProfile(payload).unwrap();
      if (form.password) {
        setIsEditing(false);
        alert("Password berhasil diubah, silakan login ulang.");
      } else {
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
        }));
        setUser(user);

        // ✅ update session agar sinkron
        await update({
          user: {
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
          },
        });

        setIsEditing(false);
        alert("Berhasil update akun");
      }
    } catch (err: any) {
      if (err?.errors) {
        alert(Object.values(err.errors).join("\n"));
      } else {
        alert("Gagal update akun");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Pengaturan Akun</h2>
      {!isEditing ? (
        <div>
          <div className="mb-4">
            <span className="font-semibold">Nama:</span> {form.name}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Email:</span> {form.email}
          </div>
          <div className="mb-4">
            <span className="font-semibold">No Telpon:</span>{" "}
            {form.phone_number}
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">No Telpon</label>
            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Password Baru</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              minLength={6}
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              minLength={6}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={handleCancel}
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
