import { createClient as createClientBrowser } from "@/lib/supabase/client"

// Change this to use the browser client instead of server client
export async function getRadioInfo() {
  const supabase = createClientBrowser()

  const { data, error } = await supabase.from("radio_info").select("*").single()

  if (error) {
    console.error("Error fetching radio info:", error)
    return null
  }

  return data
}

