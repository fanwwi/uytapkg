import { supabase } from "../config/db.js";
import { createListingSchema, updateListingSchema } from "../utils/validation.js";
import { removeImageFromStorage } from "../utils/storage.js";

// =======================================================
// 1. Получение списка объявлений с фильтрами
// =======================================================
export const getListings = async (req, res) => {
  try {
    const {
      country,
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

    // Фильтрация по региону / городу / району / стране
    if (country) {
      const cLower = String(country).toLowerCase();
      if (cLower === "turkey" || cLower === "турция") {
        query = query.or("region.ilike.%TURKEY%,region.ilike.%Турция%,city.ilike.%Турция%,city.ilike.%Turkey%");
      }
    } else if (region) {
      const rLower = String(region).toLowerCase();
      if (rLower === "turkey" || rLower === "турция") {
        query = query.or("region.ilike.%TURKEY%,region.ilike.%Турция%,city.ilike.%Турция%,city.ilike.%Turkey%");
      } else {
        query = query.ilike("region", `%${region}%`);
      }
    }

    if (city && city !== "Все") query = query.ilike("city", `%${city}%`);
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

    query = query.order("created_at", { ascending: false });

    const { data: listings, count, error } = await query;

    if (error) {
      console.error("Error fetching listings:", error);
      return res.status(500).json({ success: false, message: "Ошибка загрузки объявлений" });
    }

    // Вспомогательная функция приоритета: vip (0) -> urgent (1) -> top (2) -> regular (3)
    const getListingPriority = (item) => {
      if (item.promotion_status === "vip") return 0;
      if (item.is_urgent) return 1;
      if (item.promotion_status === "top") return 2;
      return 3;
    };

    // Точная сортировка объявлений по требуемому приоритету
    let filteredListings = (listings || []).sort((a, b) => {
      const prioA = getListingPriority(a);
      const prioB = getListingPriority(b);
      if (prioA !== prioB) return prioA - prioB;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // ТЗ Правило: В блок "Популярные" на главной не попадают объявления без фотографий!
    if (onlyPopular === "true") {
      filteredListings = filteredListings.filter(
        (item) => item.listing_photos && item.listing_photos.length > 0
      );
    }

    // Применение пагинации после точной сортировки
    const paginatedListings = filteredListings.slice(from, to + 1);

    return res.json({
      success: true,
      data: paginatedListings,
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
        users (id, email, phone, is_verified, account_type, user_profiles (first_name, last_name, company_name, avatar_url, about))
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
    // Валидация входящих данных через Zod
    const validationResult = createListingSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Ошибка валидации данных",
        errors: validationResult.error.errors.map((e) => e.message),
      });
    }

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
      resortFilters = {},
      features = {},
      photos = [],
      listingType,
      beachDistanceFrom,
      beachDistanceTo,
      developerOrComplex,
    } = validationResult.data;

    // Мапинг типа размещения (standard, vip, urgent, top)
    let promotion_status = "regular";
    let is_urgent = false;

    if (listingType === "vip") {
      promotion_status = "vip";
    } else if (listingType === "top") {
      promotion_status = "top";
    } else if (listingType === "urgent") {
      is_urgent = true;
    }

    // Сборка комплексного объекта курортных фильтров
    const mergedResortFilters = {
      ...resortFilters,
      beachDistanceFrom: beachDistanceFrom || resortFilters?.beachDistanceFrom || null,
      beachDistanceTo: beachDistanceTo || resortFilters?.beachDistanceTo || null,
      developerOrComplex: developerOrComplex || resortFilters?.developerOrComplex || null,
    };

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
          resort_filters: mergedResortFilters,
          features: features || {},
          status: "active",
          promotion_status,
          is_urgent,
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

// =======================================================
// 4. Получение объявлений текущего пользователя ("Мои объявления")
// =======================================================
export const getMyListings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      status,
      page = 1,
      limit = 20,
    } = req.query;

    let query = supabase
      .from("listings")
      .select(
        `
        *,
        listing_photos (id, url, is_main, display_order)
      `,
        { count: "exact" }
      )
      .eq("user_id", userId);

    if (status) {
      query = query.eq("status", status);
    }

    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    query = query
      .order("created_at", { ascending: false })
      .range(from, to);

    const { data: listings, count, error } = await query;

    if (error) {
      console.error("Error fetching my listings:", error);
      return res
        .status(500)
        .json({ success: false, message: "Ошибка загрузки ваших объявлений" });
    }

    return res.json({
      success: true,
      data: listings || [],
      pagination: {
        total: count || (listings ? listings.length : 0),
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get My Listings Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Ошибка сервера при получении ваших объявлений" });
  }
};

// =======================================================
// 5. Редактирование объявления (PUT /api/listings/:id)
// =======================================================
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Поиск существующего объявления
    const { data: existingListing, error: fetchError } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingListing) {
      return res.status(404).json({ success: false, message: "Объявление не найдено" });
    }

    // 2. Проверка прав: только владелец или admin
    if (existingListing.user_id !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Вы не являетесь владельцем этого объявления" });
    }

    // 3. Валидация входящих данных через Zod
    const validationResult = updateListingSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Ошибка валидации данных",
        errors: validationResult.error.errors.map((e) => e.message),
      });
    }

    const data = validationResult.data;

    // Игнорируем/запрещаем изменение user_id — владелец остаётся неизменным
    delete data.userId;
    delete data.user_id;

    // Формируем объект обновлений для базы данных (маппинг полей)
    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.propertyType !== undefined) updates.property_type = data.propertyType;
    if (data.dealType !== undefined) updates.deal_type = data.dealType;
    if (data.rentPeriod !== undefined) updates.rent_period = data.rentPeriod;
    if (data.region !== undefined) updates.region = data.region;
    if (data.city !== undefined) updates.city = data.city;
    if (data.district !== undefined) updates.district = data.district;
    if (data.microdistrict !== undefined) updates.microdistrict = data.microdistrict;
    if (data.address !== undefined) updates.address = data.address;
    if (data.latitude !== undefined) updates.latitude = data.latitude;
    if (data.longitude !== undefined) updates.longitude = data.longitude;
    if (data.price !== undefined) updates.price = data.price;
    if (data.currency !== undefined) updates.currency = data.currency;
    if (data.area !== undefined) updates.area = data.area;
    if (data.rooms !== undefined) updates.rooms = data.rooms;
    if (data.floor !== undefined) updates.floor = data.floor;
    if (data.totalFloors !== undefined) updates.total_floors = data.totalFloors;
    if (data.isResort !== undefined) updates.is_resort = data.isResort;
    if (data.resortFilters !== undefined) updates.resort_filters = data.resortFilters;
    if (data.features !== undefined) updates.features = data.features;
    if (data.status !== undefined) updates.status = data.status;
    if (data.promotionStatus !== undefined) updates.promotion_status = data.promotionStatus;
    if (data.isUrgent !== undefined) updates.is_urgent = data.isUrgent;

    // 4. Обновление записи в таблице listings
    const { data: updatedListing, error: updateError } = await supabase
      .from("listings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updatedListing) {
      console.error("Listing Update Error:", updateError);
      return res.status(500).json({ success: false, message: "Ошибка обновления объявления" });
    }

    // 5. Если переданы фотографии — обновим в таблице listing_photos
    if (data.photos && Array.isArray(data.photos)) {
      await supabase.from("listing_photos").delete().eq("listing_id", id);

      if (data.photos.length > 0) {
        const photosData = data.photos.map((url, idx) => ({
          listing_id: id,
          url,
          is_main: idx === 0,
          display_order: idx,
        }));
        await supabase.from("listing_photos").insert(photosData);
      }
    }

    return res.json({
      success: true,
      message: "Объявление успешно обновлено",
      data: updatedListing,
    });
  } catch (error) {
    console.error("Update Listing Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Ошибка сервера при обновлении объявления" });
  }
};

// =======================================================
// 6. Удаление объявления (DELETE /api/listings/:id)
// =======================================================
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Поиск существующего объявления с вложенными фото
    const { data: existingListing, error: fetchError } = await supabase
      .from("listings")
      .select("*, listing_photos(*)")
      .eq("id", id)
      .single();

    if (fetchError || !existingListing) {
      return res.status(404).json({ success: false, message: "Объявление не найдено" });
    }

    // 2. Проверка прав: только владелец или admin
    if (existingListing.user_id !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Вы не являетесь владельцем этого объявления" });
    }

    // 3. Удаление ассоциированных фотографий из Supabase Storage
    if (existingListing.listing_photos && existingListing.listing_photos.length > 0) {
      for (const photo of existingListing.listing_photos) {
        if (photo.url) {
          await removeImageFromStorage(photo.url);
        }
      }
    }

    // 4. Удаление объявления из базы данных (каскадно удалит строки в listing_photos)
    const { error: deleteError } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Listing Delete Error:", deleteError);
      return res.status(500).json({ success: false, message: "Ошибка удаления объявления" });
    }

    return res.json({
      success: true,
      message: "Объявление успешно удалено",
    });
  } catch (error) {
    console.error("Delete Listing Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Ошибка сервера при удалении объявления" });
  }
};



