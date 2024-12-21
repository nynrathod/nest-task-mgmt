import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { SignupApi } from "../../shared/services/api/user";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userExits, setUserExits] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: SignupApi,
    onSuccess: () => {
      navigate("/login");
      reset();
    },
    onError: (error: any) => {
      if (error?.data?.errorCode == "ERR_001") {
        setUserExits(true);
      }
    },
  });

  const onSubmit = (data: SignupFormData) => {
    mutate(data);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-lg w-80"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

          <input
            type="text"
            placeholder="First Name"
            {...register("firstName")}
            className="w-full p-3 mb-4 border rounded-md"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}

          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName")}
            className="w-full p-3 mb-4 border rounded-md"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-3 mb-4 border rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full p-3 mb-4 border rounded-md"
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
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          {userExits && (
            <p className="text-red-500 text-center mt-4 text-sm">
              User already exits
            </p>
          )}
        </form>

        <span className="mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-blue-500">
            Login here
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
