import { supabase } from "../supabase";

export async function fetchDevMessages() {
  const { data, error } = await supabase.from("dev").select("*");

  if (error) throw error;
  return data;
}

export async function insertDevMessages({ role, content, status }) {
  const { data, error } = await supabase
    .from("dev")
    .insert({ role, content, status })
    .select("*")
    .single();

  if (error) {
    console.log("SUPABASE INSERT ERROR:", error);
    throw error;
  }
  return data; // 새로 만들어진 room row
}
