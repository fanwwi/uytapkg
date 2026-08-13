const API_URL = "/api";

// 1. Регистрация
export async function registerUser(formData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || !data.success) {
    const errorMsg = Array.isArray(data.errors)
      ? data.errors.join(", ")
      : data.message || "Ошибка при регистрации";
    throw new Error(errorMsg);
  }

  return data;
}

// 2. Вход по Email / Телефону
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка при попытке входа");
  }

  return data;
}

// 3. Отправка и проверка WhatsApp / SMS кода
export async function sendOtpCode(phone) {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  return response.json();
}

export async function verifyOtpCode(phone, code) {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });
  return response.json();
}

// 4. Поиск и получение объявлений
export async function getListings(params = {}) {
  const mappedParams = { ...params };
  if (params.category) {
    mappedParams.propertyType = params.category;
    delete mappedParams.category;
  }
  if (params.priceFrom) {
    mappedParams.minPrice = params.priceFrom;
    delete mappedParams.priceFrom;
  }
  if (params.priceTo) {
    mappedParams.maxPrice = params.priceTo;
    delete mappedParams.priceTo;
  }
  if (params.rentalPeriod) {
    mappedParams.rentPeriod = params.rentalPeriod;
    delete mappedParams.rentalPeriod;
  }

  const query = new URLSearchParams(mappedParams).toString();
  const response = await fetch(`${API_URL}/listings?${query}`);
  return response.json();
}

export async function createListing(token, payload) {
  const response = await fetch(`${API_URL}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка создания объявления");
  }

  return data;
}

// 5. Жилые комплексы
export async function getComplexes() {
  const response = await fetch(`${API_URL}/complexes`);
  return response.json();
}

// 6. Умный AI поиск
export async function aiSearchQuery(prompt) {
  const response = await fetch(`${API_URL}/smart-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}

export async function generateDescription(details) {
  const response = await fetch(`${API_URL}/ai/generate-description`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ details }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка генерации описания");
  }
  return data.generatedText;
}

// 7. Профиль
export async function getMe(token) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Ошибка получения пользователя");
  }

  return data.user;
}

export async function updateMe(token, payload) {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка обновления профиля");
  }

  return data.user;
}

// 8. Загрузка картинок и аватаров
export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: form,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка при загрузке изображения");
  }
  return data.url;
}

export async function uploadAvatar(token, file) {
  const form = new FormData();
  form.append("avatar", file);

  const response = await fetch(`${API_URL}/auth/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка при загрузке аватара");
  }
  return data;
}

export async function deleteAvatar(token) {
  const response = await fetch(`${API_URL}/auth/avatar`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка при удалении аватара");
  }
  return data;
}