import { supabase } from "@/lib/supabase";

export async function getKnowledgeData() {
  const { data } = await supabase.from("knowledge_base").select("*")
  return data;
}

export async function doesUrlExist(url: string) {
  const { data } = await supabase.from("knowledge_base").select("id").eq("website_url", url).maybeSingle()
  console.log(data)

  if (data) {
    return true
  } else return false;
}