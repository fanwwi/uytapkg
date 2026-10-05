const TOKEN_KEY = "uytap_token";
const USER_KEY = "uytap_user";

export function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveAuth({ token, user }) {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  window.dispatchEvent(new Event("uytap:auth-changed"));

  window.dispatchEvent(new Event("uytap:user-updated"));
}

export function saveUser(user) {
  if (typeof window === "undefined") return;

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }

  window.dispatchEvent(new Event("uytap:user-updated"));
}

/*
|--------------------------------------------------------------------------
| DELETE COOKIES
|--------------------------------------------------------------------------
*/

function deleteAllCookies() {
  if (typeof document === "undefined") return;

  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();

    if (!cookieName) return;

    /*
     * Удаляем cookie для текущего path
     */
    document.cookie = `${cookieName}=; Max-Age=0; path=/`;

    /*
     * Дополнительно через expires
     */
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

    /*
     * На случай cookie с domain
     */
    document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
  });
}

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export function logout() {
  if (typeof window === "undefined") return;

  /*
   * LocalStorage
   */
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  /*
   * Cookies
   */
  deleteAllCookies();

  /*
   * Уведомляем приложение
   */
  window.dispatchEvent(new Event("uytap:auth-changed"));

  window.dispatchEvent(new Event("uytap:user-updated"));
}

/*
|--------------------------------------------------------------------------
| CLEAR AUTH
|--------------------------------------------------------------------------
*/

export function clearAuth() {
  logout();
}

/*
|--------------------------------------------------------------------------
| AUTH CHECK
|--------------------------------------------------------------------------
*/

export function isAuthenticated() {
  return Boolean(getToken());
}
