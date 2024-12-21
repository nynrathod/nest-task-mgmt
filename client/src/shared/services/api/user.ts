import Network from "../network";
import Config from "./PathConfig.ts";
import { SignupFormData } from "../../../view/pages/Signup.tsx";
import { LoginFormData } from "../../../view/pages/Login.tsx";

export const loginApi = async (data: LoginFormData) => {
  const { email, password } = data;
  return await Network.post({
    url: `auth/login`,
    body: {
      email,
      password,
    },
  });
};

// API function
export const SignupApi = async (data: SignupFormData) => {
  const { firstName, lastName, email, password } = data;

  return await Network.post({
    url: Config.api.auth.signup,
    body: {
      email,
      password,
      firstName: firstName,
      lastName: lastName,
    },
  });
};

export const GetUsers = async () => {
  return await Network.get({
    url: Config.api.auth.users,
  });
};
