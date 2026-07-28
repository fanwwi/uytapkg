const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
