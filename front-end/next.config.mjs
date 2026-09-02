/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Список конкретных хостов вместо "**" — next/image проксирует
    // и скачивает изображения на сервере, поэтому разрешение любого
    // хоста ("**") открывает SSRF через оптимизатор изображений, если
    // где-то в данных окажется ссылка на внутренний адрес. Хосты ниже —
    // наше собственное Storage и жёстко закодированные заглушки-плейсхолдеры,
    // используемые в коде (см. mapListingData.js, mapComplexData.js и т.д.).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kakiuqgjhcunyaxydopx.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
