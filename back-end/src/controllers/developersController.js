import { supabase } from "../config/db.js";

// =======================================================
// 1. Получить список всех застройщиков с их ЖК (GET /api/developers)
// =======================================================
export const getDevelopers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("developers")
      .select(`
        *,
        residential_complexes (*)
      `)
      .order("company_name", { ascending: true });

    if (error) {
      console.error("Get Developers Error:", error);
      return res.status(500).json({
        success: false,
        message: "Ошибка при получении списка застройщиков",
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get Developers Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении застройщиков",
    });
  }
};

// =======================================================
// 2. Получить одного застройщика по ID с его ЖК (GET /api/developers/:id)
// =======================================================
export const getDeveloperById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("developers")
      .select(`
        *,
        residential_complexes (*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Get Developer By Id Error:", error);
      return res.status(500).json({
        success: false,
        message: "Ошибка при получении данных застройщика",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Застройщик не найден",
      });
    }

    return res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Get Developer By Id Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении застройщика",
    });
  }
};
