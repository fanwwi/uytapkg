import { supabase } from "../config/db.js";

// Получение списка ЖК
export const getComplexes = async (req, res) => {
  try {
    const { data: complexes, error } = await supabase
      .from("residential_complexes")
      .select(`
        *,
        developers (id, company_name, logo_url, is_verified),
        complex_layouts (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: "Ошибка загрузки жилых комплексов" });
    }

    return res.json({ success: true, data: complexes });
  } catch (error) {
    console.error("Get Complexes Error:", error);
    return res.status(500).json({ success: false, message: "Ошибка сервера при загрузке ЖК" });
  }
};

// Получение конкретного ЖК по ID
export const getComplexById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: complex, error } = await supabase
      .from("residential_complexes")
      .select(`
        *,
        developers (*),
        complex_layouts (*)
      `)
      .eq("id", id)
      .single();

    if (error || !complex) {
      return res.status(404).json({ success: false, message: "Жилой комплекс не найден" });
    }

    return res.json({ success: true, data: complex });
  } catch (error) {
    console.error("Get Complex By ID Error:", error);
    return res.status(500).json({ success: false, message: "Ошибка сервера при загрузке ЖК" });
  }
};
