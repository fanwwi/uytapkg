import { supabase } from "../config/db.js";

// =======================================================
// 1. Получение списка ЖК (GET /api/complexes)
// =======================================================
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

// =======================================================
// 2. Получение конкретного ЖК по ID (GET /api/complexes/:id)
// =======================================================
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

// =======================================================
// 3. Получение собственных ЖК застройщика (GET /api/complexes/my)
// =======================================================
export const getMyComplexes = async (req, res) => {
  try {
    const { data: developer } = await supabase
      .from("developers")
      .select("id")
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (!developer) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const { data: complexes, error } = await supabase
      .from("residential_complexes")
      .select(`
        *,
        developers (id, company_name, logo_url, is_verified),
        complex_layouts (*)
      `)
      .eq("developer_id", developer.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get My Complexes Error:", error);
      return res.status(500).json({
        success: false,
        message: "Ошибка при получении списка ваших жилых комплексов",
      });
    }

    return res.json({
      success: true,
      data: complexes || [],
    });
  } catch (error) {
    console.error("Get My Complexes Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении жилых комплексов",
    });
  }
};

// =======================================================
// 4. Создание жилого комплекса (POST /api/complexes)
// =======================================================
export const createComplex = async (req, res) => {
  try {
    // Проверяем тип аккаунта
    if (req.user.account_type !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Только пользователи с аккаунтом застройщика могут создавать ЖК",
      });
    }

    // Ищем id застройщика по user_id
    let { data: developer, error: devError } = await supabase
      .from("developers")
      .select("id")
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (devError) {
      console.error("Error fetching developer profile:", devError);
    }

    if (!developer) {
      // Автоматически создаем запись в developers, если ее нет
      const { data: newDev, error: createDevError } = await supabase
        .from("developers")
        .insert({
          user_id: req.user.id,
          company_name: req.user.companyName || req.user.profile?.company_name || "Новый застройщик",
        })
        .select()
        .single();

      if (createDevError || !newDev) {
        return res.status(400).json({
          success: false,
          message: "Не удалось создать профиль застройщика",
        });
      }
      developer = newDev;
    }

    const {
      name,
      description,
      region,
      city,
      address,
      status,
      class: housingClass,
      completionDate,
      floors,
      apartments,
      parking,
      area,
      amenities,
      images,
    } = req.body;

    // Мапинг статусов
    let completion_status = "construction";
    if (status === "Проект" || status === "planning") completion_status = "planning";
    if (status === "Строительство" || status === "construction") completion_status = "construction";
    if (status === "Сдан" || status === "completed") completion_status = "completed";

    const cover_photo = Array.isArray(images) && images.length > 0 ? images[0] : null;

    const complexData = {
      developer_id: developer.id,
      name: name || "Без названия",
      description: description || "",
      region: region || city || "Бишкек",
      city: city || "Бишкек",
      address: address || "",
      completion_status,
      completion_date: completionDate || "",
      housing_class: housingClass || "Комфорт",
      cover_photo,
      features: {
        floors: floors || null,
        apartments: apartments || null,
        parking: parking || null,
        area: area || null,
        amenities: amenities || [],
        images: images || [],
      },
    };

    const { data: newComplex, error: complexError } = await supabase
      .from("residential_complexes")
      .insert([complexData])
      .select()
      .single();

    if (complexError) {
      console.error("Create Complex Error:", complexError);
      return res.status(400).json({
        success: false,
        message: "Ошибка при создании жилого комплекса: " + complexError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Жилой комплекс успешно создан",
      data: newComplex,
    });
  } catch (error) {
    console.error("Create Complex Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при создании жилого комплекса",
    });
  }
};

// =======================================================
// 5. Обновление жилого комплекса (PUT /api/complexes/:id)
// =======================================================
export const updateComplex = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем тип аккаунта
    if (req.user.account_type !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Только застройщики могут редактировать ЖК",
      });
    }

    // Ищем id застройщика по user_id
    const { data: developer } = await supabase
      .from("developers")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (!developer) {
      return res.status(403).json({
        success: false,
        message: "Профиль застройщика не найден",
      });
    }

    // Проверяем существование ЖК и его владельца
    const { data: complex, error: fetchError } = await supabase
      .from("residential_complexes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !complex) {
      return res.status(404).json({
        success: false,
        message: "Жилой комплекс не найден",
      });
    }

    if (complex.developer_id !== developer.id) {
      return res.status(403).json({
        success: false,
        message: "Вы не являетесь владельцем этого жилого комплекса",
      });
    }

    const {
      name,
      description,
      region,
      city,
      address,
      status,
      class: housingClass,
      completionDate,
      floors,
      apartments,
      parking,
      area,
      amenities,
    } = req.body;

    // ТЗ ТРЕБОВАНИЕ: Изображения редактировать нельзя!
    const cover_photo = complex.cover_photo;
    const oldImages = complex.features?.images || [];

    let completion_status = complex.completion_status;
    if (status) {
      if (status === "Проект" || status === "planning") completion_status = "planning";
      if (status === "Строительство" || status === "construction") completion_status = "construction";
      if (status === "Сдан" || status === "completed") completion_status = "completed";
    }

    const updateData = {
      name: name || complex.name,
      description: description !== undefined ? description : complex.description,
      region: region || city || complex.region,
      city: city || complex.city,
      address: address || complex.address,
      completion_status,
      completion_date: completionDate !== undefined ? completionDate : complex.completion_date,
      housing_class: housingClass || complex.housing_class,
      features: {
        floors: floors !== undefined ? floors : complex.features?.floors,
        apartments: apartments !== undefined ? apartments : complex.features?.apartments,
        parking: parking !== undefined ? parking : complex.features?.parking,
        area: area !== undefined ? area : complex.features?.area,
        amenities: amenities || complex.features?.amenities || [],
        images: oldImages, // Неизменяемые картинки
      },
    };

    const { data: updatedComplex, error: updateError } = await supabase
      .from("residential_complexes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Update Complex Error:", updateError);
      return res.status(400).json({
        success: false,
        message: "Ошибка при обновлении жилого комплекса",
      });
    }

    return res.json({
      success: true,
      message: "Жилой комплекс успешно обновлен",
      data: updatedComplex,
    });
  } catch (error) {
    console.error("Update Complex Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при обновлении жилого комплекса",
    });
  }
};

// =======================================================
// 6. Удаление жилого комплекса (DELETE /api/complexes/:id)
// =======================================================
export const deleteComplex = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем тип аккаунта
    if (req.user.account_type !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Только застройщики могут удалять ЖК",
      });
    }

    // Ищем id застройщика по user_id
    const { data: developer } = await supabase
      .from("developers")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (!developer) {
      return res.status(403).json({
        success: false,
        message: "Профиль застройщика не найден",
      });
    }

    // Проверяем существование ЖК и его владельца
    const { data: complex, error: fetchError } = await supabase
      .from("residential_complexes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !complex) {
      return res.status(404).json({
        success: false,
        message: "Жилой комплекс не найден",
      });
    }

    if (complex.developer_id !== developer.id) {
      return res.status(403).json({
        success: false,
        message: "Вы не являетесь владельцем этого жилого комплекса",
      });
    }

    // Удаляем планировки
    await supabase.from("complex_layouts").delete().eq("complex_id", id);

    // Удаляем сам комплекс
    const { error: deleteError } = await supabase
      .from("residential_complexes")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete Complex Error:", deleteError);
      return res.status(400).json({
        success: false,
        message: "Ошибка при удалении жилого комплекса",
      });
    }

    return res.json({
      success: true,
      message: "Жилой комплекс успешно удален",
    });
  } catch (error) {
    console.error("Delete Complex Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при удалении жилого комплекса",
    });
  }
};
