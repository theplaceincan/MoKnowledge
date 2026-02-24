'use server'

import { KnowledgeBase } from "@/app/types";
import { supabase } from "@/lib/supabase";

export async function saveKnowledge(data: KnowledgeBase) {
  console.log(`Saving data: ${data}`)
  const {error} = await supabase.from('knowledge_base').insert({
    company_name: data.companyFoundation.name,
    website_url: data.companyFoundation.websiteUrl,
    data: data
  })
  if (error) console.log(`Error saving knowledge: ${error}`)
}