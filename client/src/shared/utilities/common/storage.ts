import { StorageItems } from "../../constants/app.ts";
import { decodeFromBase64, encodeToBase64 } from "./encryption.ts";

export const addItemToLocalstorage = (
  key: StorageItems,
  value: string | Record<string, any>,
) => {
  localStorage.setItem(
    encodeToBase64(key),
    encodeToBase64(typeof value === "string" ? value : JSON.stringify(value)),
  );
};

export const getItemFromLocalStorage = <T extends "string" | "object">(
  key: StorageItems,
  itemType: T,
): (T extends "string" ? string : Record<string, any>) | null => {
  const item = localStorage.getItem(encodeToBase64(key));
  if (!item) return null;

  return itemType === "string"
    ? decodeFromBase64(item)
    : JSON.parse(decodeFromBase64(item));
};

export const removeItemFromLocalstorage = (key: StorageItems) => {
  localStorage.removeItem(encodeToBase64(key));
};
