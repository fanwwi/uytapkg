import { supabase } from "../config/db.js";
import {
  createListingSchema,
  updateListingSchema,
  promoteWithTariffSchema,
} from "../utils/validation.js";
import { removeImageFromStorage } from "../utils/storage.js";
import { resolvePromotionExpiry, grantPromotion } from "../services/promotionsService.js";
import { createInstagramRequest } from "../utils/instagramRequests.js";
import {
  consumeTariffBoost,
  refundTariffBoost,
  getActiveListingsLimit,
} from "../services/subscriptionsService.js";
import { verifyAllOwnedBy } from "../utils/uploadOwnership.js";

// Считает текущие активные (status="active") объявления пользователя и
// сравнивает с лимитом его тарифа — общая проверка для создания
// объявления и для возврата объявления в статус "active" из PUT.
// Возвращает null, если лимит не превышен, иначе готовый объект ответа
// 403 для немедленного return.
//
// countIncludesNewRow: false (по умолчанию) — проверка ДО вставки, лимит
// нарушен, если count уже >= limit (вставлять больше нельзя). true —
// повторная проверка ПОСЛЕ вставки (см. createListing), когда сам новый
// ряд уже учтён в count — тогда нарушение только при count > limit,
// иначе последний разрешённый ряд (count === limit) ошибочно откатывался
// бы сам на себя.
async function checkActiveListingsLimit(userId, accountType, { countIncludesNewRow = false } = {}) {
  const limit = await getActiveListingsLimit(userId, accountType);

  const { count, error } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    console.error("Active Listings Limit Count Error:", error);
    return {
      status: 500,
      body: { success: false, message: "Ошибка проверки лимита активных объявлений" },
    };
  }

  const isOverLimit = countIncludesNewRow ? (count || 0) > limit : (count || 0) >= limit;

  if (isOverLimit) {
    return {
      status: 403,
      body: {
        success: false,
        message:
          limit === 0
            ? "Для публикации объявлений необходим активный тариф UyTap PRO"
            : `Достигнут лимит активных объявлений по вашему тарифу (${limit}). Повысьте тариф или скройте/удалите другое объявление.`,
      },
    };
  }

  return null;
}

// Купленное продвижение (VIP/ТОП/Срочно) действует ограниченный срок, но
// в БД нет job'а, который бы его снимал по истечении — вместо cron'а
// каждый read-путь маскирует уже истёкшее продвижение прямо в ответе (см.
// resolvePromotionExpiry). Возвращает тот же объект, если ничего не
// изменилось — лишний спред не нужен.
function maskExpiredPromotion(listing) {
  const resolved = resolvePromotionExpiry(listing);
  if (!resolved.changed) return listing;

  return {
    ...listing,
    promotion_status: resolved.promotionStatus,
    is_urgent: resolved.isUrgent,
  };
}

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

    // Маскируем истёкшее продвижение ДО сортировки по приоритету — иначе
    // объявление с уже закончившимся сроком VIP всё ещё показывалось бы
    // первым.
    const maskedListings = (listings || []).map(maskExpiredPromotion);

    // Точная сортировка объявлений по требуемому приоритету
    let filteredListings = maskedListings.sort((a, b) => {
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

    return res.json({ success: true, data: maskExpiredPromotion(listing) });
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

    const limitError = await checkActiveListingsLimit(userId, req.user.account_type);
    if (limitError) {
      return res.status(limitError.status).json(limitError.body);
    }

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
      latitude,
      longitude,
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
      days,
      beachDistanceFrom,
      beachDistanceTo,
      developerOrComplex,
      residentialComplexId,
    } = validationResult.data;

    // Каждое фото должно быть реально загружено ЭТИМ пользователем через
    // /api/upload/listing-photo (иначе фото не прошло бы через водяной
    // знак) — trustedImageUrl в схеме проверяет только хост ссылки, а не
    // то, кто и как файл загрузил. Без этой проверки можно было бы
    // подставить публичный URL чужого фото (обход водяного знака и,
    // отдельно, IDOR на удаление — см. removeImageFromStorage в
    // deleteListing: она выполняется с сервисными правами и стёрла бы
    // чужой файл из Storage при удалении/обновлении ЭТОГО объявления).
    if (!(await verifyAllOwnedBy(photos, userId))) {
      return res.status(400).json({
        success: false,
        message: "Все фото должны быть загружены вами через форму загрузки объявления",
      });
    }

    // Объявление ВСЕГДА вставляется как обычное (regular/не срочное) —
    // клиентский listingType никогда не пишется в promotion_status/is_urgent
    // напрямую (иначе любой пользователь мог бы бесплатно и без срока
    // действия присвоить себе платный статус). VIP/ТОП/Срочно применяются
    // отдельным вызовом grantPromotion НИЖЕ, только после того, как это
    // подтверждено сервером — списанием поднятия с тарифа (consumeTariffBoost)
    // либо (для остальных случаев) реальной оплатой через O!Dengi, для
    // которой объявление создаётся статусом "draft" и становится "active"
    // только после подтверждения платежа (см. paymentsController.js
    // reconcilePaymentStatus → promotionsService.applyPromotion →
    // grantPromotion, который сам переводит "draft"/"hidden" в "active").
    const promotion_status = "regular";
    const is_urgent = false;
    const boostDays = Number.isInteger(days) ? days : 7;

    // Платное продвижение, покрытое лимитом тарифа, списывается ДО
    // вставки строки — если тарифа/лимита нет, объявление создаётся
    // "draft" и ждёт оплаты, а не публикуется бесплатно.
    let tariffGrant = null; // { serviceType, days, remaining } если списано с тарифа
    let initialStatus = "active";

    if (listingType === "vip" || listingType === "top") {
      const consumption = await consumeTariffBoost(userId, listingType);
      if (consumption.granted) {
        tariffGrant = { serviceType: listingType, days: boostDays, remaining: consumption.remaining };
      } else {
        initialStatus = "draft";
      }
    } else if (listingType === "urgent") {
      // "Срочно" не входит в лимиты тарифа — всегда только платно.
      initialStatus = "draft";
    }

    // Сборка комплексного объекта курортных фильтров
    const mergedResortFilters = {
      ...resortFilters,
      beachDistanceFrom: beachDistanceFrom || resortFilters?.beachDistanceFrom || null,
      beachDistanceTo: beachDistanceTo || resortFilters?.beachDistanceTo || null,
      developerOrComplex: developerOrComplex || resortFilters?.developerOrComplex || null,
    };

    // Проверяем, что указанный ЖК реально существует — иначе через тело
    // запроса можно было бы привязать объявление к произвольному/несуществующему
    // ID и оно "подделанно" отображалось бы в чужом жилом комплексе. Значение
    // берём только из проверенного результата, а не из сырого features
    // клиента, чтобы его нельзя было подменить в обход этой проверки.
    let verifiedComplexId = null;
    if (residentialComplexId) {
      const { data: complexRow } = await supabase
        .from("residential_complexes")
        .select("id")
        .eq("id", residentialComplexId)
        .maybeSingle();

      if (!complexRow) {
        return res.status(400).json({
          success: false,
          message: "Указанный жилой комплекс не найден",
        });
      }

      verifiedComplexId = complexRow.id;
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
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          price: Number(price),
          currency: currency || "KGS",
          area: area ? Number(area) : null,
          rooms: rooms ? Number(rooms) : null,
          floor: floor ? Number(floor) : null,
          total_floors: totalFloors ? Number(totalFloors) : null,
          is_resort: Boolean(isResort),
          resort_filters: mergedResortFilters,
          features: { ...(features || {}), residentialComplexId: verifiedComplexId },
          status: initialStatus,
          promotion_status,
          is_urgent,
        },
      ])
      .select()
      .single();

    if (createError || !newListing) {
      console.error("Listing Create Error:", createError);

      // Тариф уже списан выше — раз объявление не создалось, возвращаем
      // поднятие обратно, иначе пользователь теряет его без результата.
      if (tariffGrant) {
        await refundTariffBoost(userId, tariffGrant.serviceType);
      }

      return res.status(500).json({ success: false, message: "Ошибка создания объявления" });
    }

    // Повторная проверка лимита ПОСЛЕ вставки — сама по себе она не
    // делает операцию полностью атомарной (между двумя параллельными
    // запросами возможна гонка: оба проходят первую проверку до того, как
    // друг друга увидят), но резко сужает окно: пока не появится
    // Postgres-функция с блокировкой на уровне БД, это не позволяет
    // превысить лимит больше чем на количество реально одновременных
    // запросов, а не бесконечно. "draft" (ждущие оплаты) в лимит не
    // входят — перепроверять их нет смысла.
    if (initialStatus === "active") {
      const raceCheck = await checkActiveListingsLimit(userId, req.user.account_type, {
        countIncludesNewRow: true,
      });
      if (raceCheck) {
        console.warn(
          "Create Listing: active listings limit race detected, rolling back",
          newListing.id
        );

        await supabase.from("listings").delete().eq("id", newListing.id);

        if (tariffGrant) {
          await refundTariffBoost(userId, tariffGrant.serviceType);
        }

        return res.status(raceCheck.status).json(raceCheck.body);
      }
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

    // Тип размещения "instagram" публикует объявление как обычное (оплата
    // услуги пока не реализована), но создаёт заявку для админки — там её
    // подтверждают вручную после фактической публикации в Instagram UyTap.
    if (listingType === "instagram") {
      try {
        await createInstagramRequest({ listingId: newListing.id, userId });
      } catch (instagramError) {
        console.error("Instagram Request Create Error:", instagramError);
      }
    }

    let finalListing = newListing;

    // Поднятие уже списано с тарифа (до вставки строки) — применяем
    // продвижение сразу, объявление публикуется с ним же, без отдельного
    // шага оплаты.
    if (tariffGrant) {
      const applied = await grantPromotion({
        listingId: newListing.id,
        serviceType: tariffGrant.serviceType,
        days: tariffGrant.days,
      });

      if (applied) {
        const { data: refreshed } = await supabase
          .from("listings")
          .select("*")
          .eq("id", newListing.id)
          .single();
        if (refreshed) finalListing = refreshed;
      } else {
        // Само объявление уже создано (активно как обычное) — не роняем
        // ответ клиенту, но возвращаем поднятие, раз применить его не
        // получилось, чтобы пользователь не терял его впустую.
        console.error("Create Listing: grantPromotion failed after tariff consumption", newListing.id);
        await refundTariffBoost(userId, tariffGrant.serviceType);
      }
    }

    return res.status(201).json({
      success: true,
      message:
        initialStatus === "draft"
          ? "Объявление создано и ждёт оплаты продвижения"
          : "Объявление успешно создано",
      data: finalListing,
      // needsPayment/promotion — подсказка фронтенду, что дальше нужно
      // создать оплату (см. front-end/src/app/add-product/page.jsx) —
      // объявление в статусе "draft" не публикуется, пока не пройдёт
      // POST /api/payments/promotion/create → успешная оплата.
      needsPayment: initialStatus === "draft",
      promotion:
        initialStatus === "draft" ? { serviceType: listingType, days: boostDays } : null,
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

    // Реальное кол-во добавлений в избранное по каждому объявлению —
    // раньше на фронте вместо этого ошибочно показывался views_count.
    const listingIds = (listings || []).map((l) => l.id);
    const favoritesCountMap = new Map();

    if (listingIds.length > 0) {
      const { data: favoriteRows, error: favoritesError } = await supabase
        .from("favorites")
        .select("listing_id")
        .in("listing_id", listingIds);

      if (favoritesError) {
        console.error("Error fetching favorites counts:", favoritesError);
      } else {
        for (const row of favoriteRows || []) {
          favoritesCountMap.set(
            row.listing_id,
            (favoritesCountMap.get(row.listing_id) || 0) + 1
          );
        }
      }
    }

    // Маскируем истёкшее продвижение в ответе и заодно фиксируем это в БД:
    // владелец регулярно открывает свои объявления, так что это удобное
    // место, чтобы "самоисцелять" запись без отдельной cron-задачи (см.
    // maskExpiredPromotion выше).
    const expiredIds = [];
    const maskedListings = (listings || []).map((l) => {
      const masked = maskExpiredPromotion(l);
      if (masked !== l) expiredIds.push(l.id);
      return masked;
    });

    if (expiredIds.length > 0) {
      Promise.all(
        maskedListings
          .filter((l) => expiredIds.includes(l.id))
          .map((l) =>
            supabase
              .from("listings")
              .update({ promotion_status: l.promotion_status, is_urgent: l.is_urgent })
              .eq("id", l.id)
          )
      ).catch((err) => console.error("Downgrade expired promotion error:", err));
    }

    const listingsWithFavorites = maskedListings.map((l) => ({
      ...l,
      favorites_count: favoritesCountMap.get(l.id) || 0,
    }));

    return res.json({
      success: true,
      data: listingsWithFavorites,
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

    // Та же проверка владельца файла, что и при создании (см. createListing
    // выше) — без неё в photos при обновлении можно было бы подставить чужое
    // фото в обход водяного знака и подготовить IDOR на удаление файла.
    // Admin исключён — модерация может редактировать чужое объявление, и
    // фото в нём по определению загружены не им.
    if (
      userRole !== "admin" &&
      data.photos !== undefined &&
      !(await verifyAllOwnedBy(data.photos, userId))
    ) {
      return res.status(400).json({
        success: false,
        message: "Все фото должны быть загружены вами через форму загрузки объявления",
      });
    }

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

    // ЖК квартиры хранится внутри features.residentialComplexId — как и при
    // создании, не доверяем сырому значению внутри присланного features (его
    // легко подделать в обход проверки), а валидируем отдельное поле
    // residentialComplexId и подставляем в features только проверенный ID.
    if (data.features !== undefined || data.residentialComplexId !== undefined) {
      const nextFeatures =
        data.features !== undefined
          ? { ...data.features }
          : { ...(existingListing.features || {}) };

      if (data.residentialComplexId !== undefined) {
        if (data.residentialComplexId === null) {
          nextFeatures.residentialComplexId = null;
        } else {
          const { data: complexRow } = await supabase
            .from("residential_complexes")
            .select("id")
            .eq("id", data.residentialComplexId)
            .maybeSingle();

          if (!complexRow) {
            return res.status(400).json({
              success: false,
              message: "Указанный жилой комплекс не найден",
            });
          }

          nextFeatures.residentialComplexId = complexRow.id;
        }
      } else {
        // Поле явно не передавали — сохраняем прежнюю привязку к ЖК, а не
        // то, что клиент мог прислать внутри самого features.
        nextFeatures.residentialComplexId = existingListing.features?.residentialComplexId ?? null;
      }

      updates.features = nextFeatures;
    }

    // promotionStatus/isUrgent отражают ОПЛАЧЕННОЕ продвижение (см.
    // services/promotionsService.js grantPromotion) — владелец не может
    // выставлять их напрямую, иначе получал бы платный VIP/ТОП/Срочно
    // бесплатно через обычный PUT. По той же причине владелец не может
    // самостоятельно снять объявление со статуса "moderation" (или
    // отправить его туда) — это решает только модератор/admin.
    if (userRole !== "admin") {
      if (data.promotionStatus !== undefined || data.isUrgent !== undefined) {
        return res.status(403).json({
          success: false,
          message:
            "Изменение VIP/ТОП/Срочно доступно только через оплату продвижения или тариф",
        });
      }

      if (
        (data.status !== undefined && data.status === "moderation") ||
        existingListing.status === "moderation"
      ) {
        return res.status(403).json({
          success: false,
          message: "Статус модерации может изменить только администратор",
        });
      }
    }

    // Возврат объявления в "active" (например, из "hidden"/"draft")
    // увеличивает число активных объявлений так же, как и создание нового
    // — проверяем тот же лимит тарифа, иначе его можно обойти, скрывая и
    // показывая объявления вместо реального удаления лишних.
    const isReactivating =
      userRole !== "admin" &&
      data.status === "active" &&
      existingListing.status !== "active";

    if (isReactivating) {
      const limitError = await checkActiveListingsLimit(userId, req.user.account_type);
      if (limitError) {
        return res.status(limitError.status).json(limitError.body);
      }
    }

    if (data.status !== undefined) updates.status = data.status;
    if (userRole === "admin") {
      if (data.promotionStatus !== undefined) updates.promotion_status = data.promotionStatus;
      if (data.isUrgent !== undefined) updates.is_urgent = data.isUrgent;
    }

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

    // Та же повторная проверка после записи, что и в createListing — сужает
    // окно гонки при параллельной реактивации нескольких объявлений сразу.
    if (isReactivating) {
      const raceCheck = await checkActiveListingsLimit(userId, req.user.account_type, {
        countIncludesNewRow: true,
      });
      if (raceCheck) {
        console.warn(
          "Update Listing: active listings limit race detected, reverting status",
          updatedListing.id
        );

        await supabase
          .from("listings")
          .update({ status: existingListing.status })
          .eq("id", id);

        return res.status(raceCheck.status).json(raceCheck.body);
      }
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

// =======================================================
// 7. Бесплатное поднятие в VIP/ТОП за счёт лимита тарифа
//    (POST /api/listings/:id/promote-with-tariff)
//
// Если у пользователя есть активный тариф (дефолтный или индивидуальный) с
// доступным лимитом VIP/TOP-поднятий — списывает одно поднятие и сразу
// применяет продвижение к объявлению, без оплаты через O!Dengi. Если
// лимита нет (тариф не активен/лимит исчерпан) — возвращает granted:false
// и фронтенд должен перейти к обычной платной покупке
// (POST /api/payments/promotion/create).
// =======================================================
export const promoteListingWithTariff = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = promoteWithTariffSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message || "Некорректные данные запроса",
      });
    }

    const { serviceType, days } = result.data;

    const { data: listing, error: fetchError } = await supabase
      .from("listings")
      .select("id, user_id")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !listing) {
      return res.status(404).json({ success: false, message: "Объявление не найдено" });
    }

    if (listing.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Вы можете продвигать только свои объявления",
      });
    }

    const consumption = await consumeTariffBoost(userId, serviceType);

    if (!consumption.granted) {
      return res.json({ success: true, data: { granted: false, reason: consumption.reason } });
    }

    const applied = await grantPromotion({ listingId: id, serviceType, days });

    if (!applied) {
      return res.status(500).json({
        success: false,
        message: "Не удалось применить продвижение",
      });
    }

    return res.json({
      success: true,
      data: { granted: true, remaining: consumption.remaining },
    });
  } catch (error) {
    console.error("Promote Listing With Tariff Error:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при применении тарифа",
    });
  }
};



