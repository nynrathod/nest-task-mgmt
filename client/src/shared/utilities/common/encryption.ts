import { decode, encode } from "js-base64";
import { jwtDecode } from "jwt-decode";

export const encodeToBase64 = (value: string) => encode(value);
export const decodeFromBase64 = (value: string) => decode(value);

export const decodeJWT = (token: string): string => jwtDecode(token);
