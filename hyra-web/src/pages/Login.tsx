/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import userService from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const { data, setData } = useAuthStore()
  

  useEffect(() => {

    const exchangeTokenForOauth2 = async (authorizationCode: string) => {
      try {
        const response = await userService.loginWithGoogle(authorizationCode)

        if (response && response.code === 200) {
          setData({
            accessToken: response.result.accessToken,
            refreshToken: response.result.refreshToken,
            name: response.result.name,
            email: response.result.email,
            avatarUrl: response.result.image,
          })
          toast.success('Đăng nhập thành công bằng Google')
          navigate('/')
        } else {
          toast.error(response.message)
        }
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error((error as any)?.response.data.message || 'Có lỗi trong quá trình xử lý')
      }
    }

    if (code) {
      exchangeTokenForOauth2(code)
    }
  }, [code])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    }
  });

  const rememberMe = watch("rememberMe");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  //handle login with google
  const handleLoginWithGoogle = () => {
    try {
      const authUri = import.meta.env.VITE_GOOGLE_AUTH_URI as string
      const callbackUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI as string
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

      const targetUrl = `${authUri}?redirect_uri=${encodeURIComponent(
        callbackUri
      )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`

      window.location.href = targetUrl
    } catch (error: unknown) {
      toast.error(error?.toString() || 'Có lỗi trong quá trình xử lý' )
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        toast.success(result.message);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="quy@student.edu"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setValue("rememberMe", checked as boolean)
                  }
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <Button type="button" variant='destructive' className="w-full" disabled={isLoading} onClick={handleLoginWithGoogle}>
              <FaGoogle className="mr-2" />
              {isLoading ? "Signing in..." : "Sign In with Google"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

          <div className="mt-6 rounded-md bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs font-mono">quy@student.edu / password123</p>
            <p className="text-xs font-mono">student@example.edu / abc123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
