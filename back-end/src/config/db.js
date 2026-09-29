import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://kakiuqgjhcunyaxydopx.supabase.co";
if (!process.env.SUPABASE_KEY) {
  console.error("❌ CRITICAL ERROR: SUPABASE_KEY environment variable is missing!");
  throw new Error("SUPABASE_KEY environment variable is not defined in .env");
}

const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
