import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { loginApi } from "../../shared/services/api/user.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addItemToLocalstorage } from "../../shared/utilities/common/storage.ts";
import { StorageItems } from "../../shared/constants/app.ts";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [wrongCred, setWrongCred] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Use React Query's useMutation for login
  const { mutate, isPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data: any) => {
      if (data) {
        addItemToLocalstorage(StorageItems.USER_INFO, data);
        navigate("/");
      }
      console.log("Login successful:", data); // Store token or navigate on success
    },
    onError: (error: any) => {
      if (error?.data?.errorCode == "ERR_003") {
        setWrongCred(true);
        console.error("Login failed:", error); // Handle errors
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log();
    // Call mutate to trigger the login API
    mutate(data);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-lg w-80"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full mb-2 p-3 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full p-3 mb-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-2 top-4 text-gray-500"
            >
              {passwordVisible ? (
                <EyeSlashIcon className="size-5" />
              ) : (
                <EyeIcon className="size-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md"
            disabled={isPending}
          >
            {isPending ? "Logging In..." : "Login"}
          </button>

          {wrongCred && (
            <p className="text-red-500 text-center mt-4 text-sm">
              Wrong credentials
            </p>
          )}
        </form>
        <span className="mt-4">
          Dont have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            SIgnup here
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
