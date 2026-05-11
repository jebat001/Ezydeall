"use client";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

type U = { id: string; email: string; name: string | null; role: string; verified: boolean; createdAt: string };

export function StaffTable({ users: initial }: { users: U[] }) {
  const [users, setUsers] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function setRole(id: string, role: string) {
    setBusy(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });
    setBusy(null);
    if (res.ok) setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-white/5 text-left text-white/60 uppercase text-xs tracking-wider">
        <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Verified</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Actions</th></tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id} className="border-t border-white/5">
            <td className="px-4 py-3">
              <div className="font-semibold">{u.name || "—"}</div>
              <div className="text-xs text-white/60">{u.email}</div>
            </td>
            <td className="px-4 py-3"><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">{u.role}</span></td>
            <td className="px-4 py-3 text-white/70">{u.verified ? "Yes" : "No"}</td>
            <td className="px-4 py-3 text-white/60">{formatDate(u.createdAt)}</td>
            <td className="px-4 py-3">
              <select defaultValue={u.role} disabled={busy === u.id}
                onChange={(e) => setRole(u.id, e.target.value)}
                className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-sm">
                <option value="USER">USER</option>
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
                <option value="DEVELOPER">DEVELOPER</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
