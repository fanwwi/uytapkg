import { supabase } from "../config/db.js";

// =======================================================
// 1. Получение списка объявлений с фильтрами
// =======================================================
export const getListings = async (req, res) => {
  try {
    const {
      region,
      city,
      district,
      propertyType,
      dealType,
      rentPeriod,
      minPrice,
      maxPrice,
      rooms,
      isResort,
      onlyPopular, // Флаг для блока популярных объявлений
      page = 1,
      limit = 20,
    } = req.query;

    let query = supabase
      .from("listings")
      .select(`
        *,
        listing_photos (id, url, is_main, display_order),
        users!inner (id, is_verified, account_type)
      `, { count: "exact" })
      .eq("status", "active");

    // Фильтрация по региону / городу / району
    if (region) query = query.ilike("region", `%${region}%`);
    if (city) query = query.ilike("city", `%${city}%`);
    if (district) query = query.ilike("district", `%${district}%`);

    // Фильтрация по типу недвижимости и сделки
    if (propertyType) query = query.eq("property_type", propertyType);
    if (dealType) query = query.eq("deal_type", dealType);
    if (rentPeriod) query = query.eq("rent_period", rentPeriod);

    // Цена
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));

    // Количественные параметры
    if (rooms) query = query.eq("rooms", Number(rooms));
    if (isResort !== undefined) query = query.eq("is_resort", isResort === "true");

    // Пагинация и сортировка
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    query = query.order("promotion_status", { ascending: false }).order("created_at", { ascending: false }).range(from, to);

    const { data: listings, count, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error);
      return res.status(500).json({ success: false, message: "Ошибка загрузки объявлений" });
    }

    // ТЗ Правило: В блок "Популярные" на главной не попадают объявления без фотографий!
    let filteredListings = listings || [];
    if (onlyPopular === "true") {
      filteredListings = filteredListings.filter(
        (item) => item.listing_photos && item.listing_photos.length > 0
      );
    }

    return res.json({
      success: true,
      data: filteredListings,
      pagination: {
        total: count || filteredListings.length,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Listings Get Error:", error);
    return res.status(500).json({ success: false, message: "Ошибка сервера при поиске объявлений" });
  }
};

// =======================================================
// 2. Получение одного объявления по ID
// =======================================================
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: listing, error } = await supabase
      .from("listings")
      .select(`
        *,
        listing_photos (*),
        users (id, email, phone, is_verified, account_type, user_profiles (*))
      `)
      .eq("id", id)
      .single();

    if (error || !listing) {
      return res.status(404).json({ success: false, message: "Объявление не найдено" });
    }

    // Увеличение счетчика просмотров
    await supabase
      .from("listings")
      .update({ views_count: (listing.views_count || 0) + 1 })
      .eq("id", id);

    return res.json({ success: true, data: listing });
  } catch (error) {
    console.error("Get Listing By ID Error:", error);
    return res.status(500).json({ success: false, message: "Ошибка сервера при получении объявления" });
  }
};

// =======================================================
// 3. Создание нового объявления
// =======================================================
export const createListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      propertyType,
      dealType,
      rentPeriod,
      region,
      city,
      district,
      microdistrict,
      address,
      price,
      currency,
      area,
      rooms,
      floor,
      totalFloors,
      isResort,
      resortFilters,
      features,
      photos = [],
    } = req.body;

    if (!title || !propertyType || !dealType || !region || !price) {
      return res.status(400).json({ success: false, message: "Заполните все обязательные поля" });
    }

    const { data: newListing, error: createError } = await supabase
      .from("listings")
      .insert([
        {
          user_id: userId,
          title,
          description,
          property_type: propertyType,
          deal_type: dealType,
          rent_period: dealType === "rent" ? rentPeriod : null,
          region,
          city,
          district,
          microdistrict,
          address,
          price: Number(price),
          currency: currency || "KGS",
          area: area ? Number(area) : null,
          rooms: rooms ? Number(rooms) : null,
          floor: floor ? Number(floor) : null,
          total_floors: totalFloors ? Number(totalFloors) : null,
          is_resort: Boolean(isResort),
          resort_filters: resortFilters || {},
          features: features || {},
          status: "active",
        },
      ])
      .select()
      .single();

    if (createError || !newListing) {
      console.error("Listing Create Error:", createError);
      return res.status(500).json({ success: false, message: "Ошибка создания объявления" });
    }

    // Сохранение фото
    if (photos && photos.length > 0) {
      const photosData = photos.map((url, idx) => ({
        listing_id: newListing.id,
        url,
        is_main: idx === 0,
        display_order: idx,
      }));
      await supabase.from("listing_photos").insert(photosData);
    }

    return res.status(201).json({
      success: true,
      message: "Объявление успешно создано",
      data: newListing,
    });
  } catch (error) {
    console.error("Create Listing Error:", error);
    return res.status(500).json({ success: false, message: "Ошибка сервера при создании объявления" });
  }
};
