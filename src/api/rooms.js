import { supabase } from "../supabase";

// export async function fetchRooms() {
//   const res = await fetch("/api/rooms");

//   if (!res.ok) {
//     let body = {};
//     try {
//       body = await res.json();
//     } catch {
//       body = {};
//     }
//     throw new Error(body.message || "Failed to fetch rooms");
//   }

//   const data = await res.json();
//   return data.rooms;
// }

export async function fetchRooms() {
  const { data, error } = await supabase.from("Rooms").select("*");

  if (error) throw error;
  return data;
}

export async function createRooms({ name }) {
  const { data, error } = await supabase
    .from("Rooms")
    .insert({ name })
    .select("*")
    .single();

  if (error) throw error;
  return data; // 새로 만들어진 room row
}
