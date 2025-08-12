// Component giao diện người dùng cho trang đăng nhập, 
// xử lý nhập email/mật khẩu, gọi hàm đăng nhập từ AuthContext, 
// hiển thị thông báo và chuyển hướng dựa trên vai trò người dùng.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login({ email, password });
      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting you to your dashboard...`,
      });
      const role = data.role.toLowerCase();
      router.push(`/${role}/dashboard`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <Card className="mx-auto max-w-md w-full bg-white border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">Login to GameAssetHub</CardTitle>
          <CardDescription className="text-gray-600 text-base mt-1">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-800 text-sm font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-800 text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}