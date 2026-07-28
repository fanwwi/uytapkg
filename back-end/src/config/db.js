import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://kakiuqgjhcunyaxydopx.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || process.env.JWT_SECRET;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Ошибка: SUPABASE_URL или SUPABASE_KEY не определены в файле .env!");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
