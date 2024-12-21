import { getItemFromLocalStorage } from "../common/storage.ts";
import { StorageItems } from "../../constants/app.ts";

function useAuth() {
  const user = getItemFromLocalStorage(StorageItems.USER_INFO, "object");
  return {
    user,
  };
}

export default useAuth;
