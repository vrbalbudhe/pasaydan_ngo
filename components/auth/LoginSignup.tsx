"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFormSubmit = async (data: {
    email: string;
    password: string;
    userType?: string;
  }): Promise<void> => {
    console.log(data);
    setError(null);
    try {
      if (isLogin) {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });
        const responseBody = await response.json();

        if (!response.ok) {
          const errorMessage = responseBody?.message;
          throw new Error(`Login failed: ${errorMessage}`);
        }
        console.log(responseBody);
        router.push("/pasaydan/com");
      } else {
        const response = await fetch("/api/auth/sign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const responseBody = await response.json();

        if (!response.ok) {
          const errorMessage = responseBody?.message || response.statusText;
          throw new Error(`Signup failed: ${errorMessage}`);
        }

        setIsLogin(true);
        console.log(responseBody);
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Something went wrong. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md border-2 border-slate-200 overflow-hidden mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {!isLogin && (
          <div className="mb-4">
            <Label htmlFor="userType">User Type</Label>
            <select
              id="userType"
              className="mt-2 border-2 w-full px-3 py-2 rounded"
              {...register("userType")}
            >
              <option value="">Select your user type</option>
              <option value="individual">Individual</option>
              <option value="organisation">Organisation</option>
            </select>
            {errors.userType && (
              <p className="text-red-500 text-sm">{errors.userType.message}</p>
            )}
          </div>
        )}

        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="mt-2 border-2"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="mt-2 border-2"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-600 text-white hover:bg-blue-700"
        >
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin((prev) => !prev)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
