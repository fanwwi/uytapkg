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
    const errorMsg = data.errors
      ? data.errors.join(", ")
      : data.message || "Ошибка при регистрации";

    throw new Error(errorMsg);
  }

  return data;
}

// 2. Вход
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

// 3. OTP
export async function sendOtpCode(phone) {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  return response.json();
}

export async function verifyOtpCode(phone, code) {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, code }),
  });

  return response.json();
}

// 4. Объявления
export async function getListings(params = {}) {
  const query = new URLSearchParams(params).toString();

  const response = await fetch(`${API_URL}/listings?${query}`);

  return response.json();
}

// 5. ЖК
export async function getComplexes() {
  const response = await fetch(`${API_URL}/complexes`);

  return response.json();
}

// 6. AI поиск
export async function aiSearchQuery(prompt) {
  const response = await fetch(`${API_URL}/ai/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  return response.json();
}

// 7. Генерация описания
export async function generateDescription(details) {
  const response = await fetch(`${API_URL}/ai/generate-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ details }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка генерации описания");
  }

  return data.generatedText;
}

// Получить текущего пользователя
export async function getMe(token) {
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("GET ME RESPONSE:", text);
    throw new Error(`Сервер вернул не JSON. HTTP ${response.status}`);
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Ошибка получения пользователя");
  }

  return data.user;
}

export async function updateMe(token, payload) {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("UPDATE ME RESPONSE:", text);
    throw new Error(`Сервер вернул не JSON. HTTP ${response.status}`);
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.errors?.join(", ") || data.message || "Ошибка обновления профиля",
    );
  }

  return data.user;
}
