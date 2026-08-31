-- =======================================================
-- UyTap Database Schema (PostgreSQL / Supabase)
-- Полная схема данных для поддержки всех разделов UyTap
-- =======================================================

-- 1. Таблица пользователей (универсальная аутентификация)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('personal', 'realtor', 'agency', 'developer')),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблица детальных профилей пользователей
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    inn VARCHAR(50),
    office_address TEXT,
    about TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Таблица заявок на верификацию продавцов
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    passport_front TEXT NOT NULL,
    passport_back TEXT,
    reject_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Единая таблица объявлений (Listings)
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'house', 'land', 'commercial', 'room', 'garage')),
    deal_type VARCHAR(20) NOT NULL CHECK (deal_type IN ('sale', 'rent')),
    rent_period VARCHAR(20) CHECK (rent_period IN ('hourly', 'daily', 'weekly', 'monthly', 'long_term')),
    
    -- Иерархическая локация
    region VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    microdistrict VARCHAR(100),
    address TEXT,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    
    -- Характеристики
    price NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'KGS' CHECK (currency IN ('KGS', 'USD')),
    area NUMERIC(10, 2),
    rooms INT,
    floor INT,
    total_floors INT,
    
    -- Флаг Иссык-Куля и курортные фильтры
    is_resort BOOLEAN DEFAULT FALSE,
    resort_filters JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '{}'::jsonb,
    
    -- Статусы
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'draft', 'moderation')),
    promotion_status VARCHAR(20) DEFAULT 'regular' CHECK (promotion_status IN ('regular', 'vip', 'top')),
    is_urgent BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Фотографии объявлений
CREATE TABLE IF NOT EXISTS listing_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Застройщики
CREATE TABLE IF NOT EXISTS developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website TEXT,
    registry_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Жилые Комплексы (ЖК)
CREATE TABLE IF NOT EXISTS residential_complexes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    region VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    completion_status VARCHAR(50) CHECK (completion_status IN ('building', 'completed')),
    completion_date VARCHAR(50),
    housing_class VARCHAR(50),
    registry_link TEXT,
    cover_photo TEXT,
    features JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Планировки и квартиры в ЖК
CREATE TABLE IF NOT EXISTS complex_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complex_id UUID NOT NULL REFERENCES residential_complexes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    rooms INT NOT NULL,
    area NUMERIC(10, 2) NOT NULL,
    price NUMERIC(14, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Избранное
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

-- 10. Рекламные баннеры
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    clicks_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Тарифные подписки пользователей (активный PRO-тариф)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tariff_id VARCHAR(30) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Платежи через O!Dengi (QR Pay)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id VARCHAR(64) UNIQUE NOT NULL,
    invoice_id VARCHAR(20),
    trans_id VARCHAR(20),
    tariff_id VARCHAR(30) NOT NULL,
    months INT NOT NULL,
    amount INT NOT NULL, -- сумма в копейках (100 = 1.00 сом)
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'approved', 'canceled', 'failed')),
    qr_url TEXT,
    paylink_url TEXT,
    link_app TEXT,
    provider_response JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- 14. Юристы (раздел «Юристы», управляется из админ-панели)
CREATE TABLE IF NOT EXISTS lawyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    specialization VARCHAR(255) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lawyers_is_active ON lawyers(is_active);

-- 11. Индексы для сверхбыстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_listings_region ON listings(region);
CREATE INDEX IF NOT EXISTS idx_listings_property_type ON listings(property_type);
CREATE INDEX IF NOT EXISTS idx_listings_promotion ON listings(promotion_status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

-- ============================================================
-- Storage (аватарки): создать вручную в Supabase Dashboard
-- Storage → New bucket → имя: avatars → Public bucket: ON
-- Путь файлов: avatars/{userId}/{timestamp}.{ext}
-- URL пишется в user_profiles.avatar_url
-- ============================================================
