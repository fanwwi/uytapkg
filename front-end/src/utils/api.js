const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// 1. Регистрация
export async function registerUser(formData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data.errors ? data.errors.join(", ") : data.message || "Ошибка при регистрации";
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
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/listings?${query}`);
  return response.json();
}

// 5. Жилые комплексы
export async function getComplexes() {
  const response = await fetch(`${API_URL}/complexes`);
  return response.json();
}

// 6. Умный AI поиск
export async function aiSearchQuery(prompt) {
  const response = await fetch(`${API_URL}/ai/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return response.json();
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