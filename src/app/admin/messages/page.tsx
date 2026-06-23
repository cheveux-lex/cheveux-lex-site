"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MessageRow } from "@/lib/supabase/messages";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";

const statusStyles: Record<string, string> = {
  new: "bg-amber-50/80 text-amber-700",
  read: "bg-beige/20 text-taupe",
  replied: "bg-green-50/80 text-green-700",
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState<MessageRow | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setMessages((data ?? []) as MessageRow[]);
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [supabase]);

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    const { error: updateError } = await supabase
      .from("messages")
      .update({ status })
      .eq("id", id);
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      if (viewing?.id === id) setViewing((prev) => prev ? { ...prev, status } : null);
    }
  }, [supabase, viewing]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (viewing?.id === id) setViewing(null);
    }
  }, [supabase, viewing]);

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description="Client inquiries received through the website."
      />

      {error && (
        <p className="mb-4 text-xs font-medium text-red-500">{error}</p>
      )}

      <AdminCard>
        {loading ? (
          <p className="text-sm text-taupe">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-taupe/60">No messages yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-beige/15">
                  <th className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">Name</th>
                  <th className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">Email</th>
                  <th className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">Phone</th>
                  <th className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">Service</th>
                  <th className="hidden whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70 md:table-cell">Message</th>
                  <th className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">Date</th>
                  <th className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">Status</th>
                  <th className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="border-b border-beige/8 transition-colors hover:bg-cream/30"
                  >
                    <td className="px-3 py-3 font-medium text-charcoal">{msg.name}</td>
                    <td className="px-3 py-3 text-taupe">{msg.email}</td>
                    <td className="px-3 py-3 text-taupe">{msg.phone || "—"}</td>
                    <td className="px-3 py-3 text-taupe">{msg.service || "—"}</td>
                    <td className="hidden max-w-[200px] truncate px-3 py-3 text-taupe/80 md:table-cell">
                      {msg.message}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-taupe/60">
                      {formatDate(msg.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] ${
                          statusStyles[msg.status] || "text-taupe"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewing(msg)}
                          className="text-[9px] font-medium uppercase tracking-[0.12em] text-gold transition-colors hover:text-charcoal focus:outline-none"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="text-[9px] font-medium uppercase tracking-[0.12em] text-red-400 transition-colors hover:text-red-600 focus:outline-none"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setViewing(null); }}
        >
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-sm bg-offwhite p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-charcoal">{viewing.name}</h3>
                <p className="text-xs text-taupe">{viewing.email}{viewing.phone ? ` · ${viewing.phone}` : ""}</p>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-taupe/60 transition-colors hover:bg-beige/20 hover:text-charcoal focus:outline-none"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {viewing.service && (
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">{viewing.service}</p>
            )}

            <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-charcoal">{viewing.message}</p>

            <p className="mb-4 text-[10px] text-taupe/50">{formatDate(viewing.created_at)}</p>

            <div className="flex items-center justify-between border-t border-beige/15 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/70">Status:</span>
                <select
                  value={viewing.status}
                  onChange={(e) => handleStatusChange(viewing.id, e.target.value)}
                  className="rounded-[2px] border border-beige/25 bg-cream/40 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-charcoal focus:border-gold/50 focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
              <button
                onClick={() => handleDelete(viewing.id)}
                className="text-[9px] font-medium uppercase tracking-[0.12em] text-red-400 transition-colors hover:text-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
