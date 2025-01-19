"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Lock, User, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.string().optional(), // User type can be optional
});

type FormData = z.infer<typeof formSchema>;

export function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Set value programmatically if needed
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFormSubmit = async (data: {
    email: string;
    password: string;
    userType?: string;
  }): Promise<void> => {
    setError(null);
    setIsLoading(true);
    console.log("Form Data:", data);
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
            userType: data.userType,
          }),
        });
        const responseBody = await response.json();

        if (!response.ok) {
          throw new Error(`Login failed: ${responseBody?.message}`);
        }

        if (
          responseBody?.data?.role === "MiniAdmin" ||
          responseBody?.data?.role === "Admin"
        ) {
          router.push("/pasaydan/admin");
        } else {
          router.push("/pasaydan/com");
        }
      } else {
        const response = await fetch("/api/auth/sign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userType: data.userType,
            email: data.email,
            password: data.password,
          }),
        });
        const responseBody = await response.json();

        if (!response.ok) {
          throw new Error(
            `Signup failed: ${responseBody?.message || response.statusText}`
          );
        }
        setIsLogin(true);
      }
    } catch (err) {
      setError(
        (err as Error).message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            {isLogin ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Enter your information to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label
                  className="text-left w-full flex justify-start"
                  htmlFor="userType"
                >
                  User Type
                </Label>
                <Select onValueChange={(value) => setValue("userType", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select your user type"
                      {...register("userType")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userType && (
                  <p className="text-sm text-red-500">
                    {errors.userType.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2 w-full">
              <Label
                className="text-left w-full flex justify-start"
                htmlFor="email"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                className="text-left w-full flex justify-start"
                htmlFor="password"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-gray-600 hover:text-blue-600"
                  onClick={() => router.push("/pasaydan/auth/forgotPassword")}
                >
                  Forgot password?
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Please wait...</span>
                </div>
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </Button>

            <div className="text-center text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold hover:text-blue-600"
                onClick={() => setIsLogin((prev) => !prev)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
