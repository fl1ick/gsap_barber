import { supabase } from "./supabase";

export async function uploadImage(file, folder = "general") {
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
}