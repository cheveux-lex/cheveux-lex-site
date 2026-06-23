import { createClient } from "./client";

export interface MessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export async function createMessage(data: CreateMessageData): Promise<MessageRow> {
  const supabase = createClient();
  const { data: inserted, error } = await supabase
    .from("messages")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      service: data.service || null,
      message: data.message,
    })
    .select()
    .single();
  if (error) throw error;
  return inserted as MessageRow;
}

export async function getMessages(): Promise<MessageRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MessageRow[];
}

export async function getMessagesCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function getNewMessagesCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");
  if (error) throw error;
  return count ?? 0;
}

export async function updateMessageStatus(id: string, status: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("messages")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
