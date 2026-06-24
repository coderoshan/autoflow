const { createClient: createSupabaseClient } = require("@supabase/supabase-js");

function createClient() {
  return createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );
}

module.exports = { createClient };
