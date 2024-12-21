import { removeItemFromLocalstorage } from "./storage.ts";
import { decodeJWT } from "./encryption.ts";
import { StorageItems } from "../../constants/app.ts";

export const isLoggedIn = (user: any) => {
  console.log("user", user);
  if (user && user.id && user?.accessToken) {
    const decoded: any = decodeJWT(user.accessToken);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token is expired
    if (decoded.exp < currentTime) {
      // Token expired, clear user data
      removeItemFromLocalstorage(StorageItems.USER_INFO);
      return false;
    }

    // Token is valid
    return true;
  }
  return false;
};
