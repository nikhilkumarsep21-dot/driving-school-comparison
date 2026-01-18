import { UserDetails } from "./types";

const USER_DETAILS_COOKIE = "user_details";
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60;

export function getUserDetailsFromCookie(): UserDetails | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${USER_DETAILS_COOKIE}=`)
  );

  if (!userCookie) return null;

  try {
    const value = userCookie.split("=")[1];
    const decoded = decodeURIComponent(value);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to parse user details cookie:", error);
    return null;
  }
}

export function saveUserDetailsToCookie(userDetails: UserDetails): void {
  if (typeof window === "undefined") return;

  try {
    const encoded = encodeURIComponent(JSON.stringify(userDetails));
    const expires = new Date();
    expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);

    document.cookie = `${USER_DETAILS_COOKIE}=${encoded}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to save user details cookie:", error);
  }
}

export function clearUserDetailsCookie(): void {
  if (typeof window === "undefined") return;

  document.cookie = `${USER_DETAILS_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function updateCurrentVehicleType(vehicleType: string): void {
  if (typeof window === "undefined") return;

  const currentDetails = getUserDetailsFromCookie();
  if (currentDetails) {
    saveUserDetailsToCookie({
      ...currentDetails,
      currentVehicleType: vehicleType,
    });
  }
}

export function getCurrentVehicleType(): string | null {
  if (typeof window === "undefined") return null;

  const userDetails = getUserDetailsFromCookie();
  return userDetails?.currentVehicleType || null;
}
