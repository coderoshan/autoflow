import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zsaclgythzwxqnmynsma.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DaTg2weQnAK_otD0ctG0Ow_SdFBsw6t";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
