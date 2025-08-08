 // Component giao diện người dùng cho trang đăng ký, 
 // xử lý nhập thông tin người dùng (email, mật khẩu, vai trò, và thông tin bổ sung cho vai trò deisgner/developer), 
 // gửi yêu cầu đăng ký, hiển thị thông báo và chuyển hướng đến trang đăng nhập.
 
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { registerUser } from "@/lib/api";
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PLAYER");
  const [fullName, setFullName] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isProfessionalRole = role === "DEVELOPER" || role === "DESIGNER";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const registrationData: any = {
      email,
      password,
      role,
    };

    if (isProfessionalRole) {
      registrationData.fullName = fullName;
      registrationData.portfolioUrl = portfolioUrl;
      registrationData.experienceYears = Number(experienceYears);
    }

    try {
      await registerUser(registrationData);
      if (isProfessionalRole) {
        toast({
          title: "Registration Submitted",
          description: "Your account is pending approval from an administrator. You will be notified upon approval.",
        });
        router.push("/login");
      } else {
        toast({
          title: "Registration Successful",
          description: "You can now log in with your new account.",
        });
        router.push("/login");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
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
          <CardTitle className="text-3xl font-bold text-gray-800">Sign Up for GameAssetHub</CardTitle>
          <CardDescription className="text-gray-600 text-base mt-1">
            Create an account to start exploring game assets
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
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-gray-800 text-sm font-semibold">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="border-gray-200 bg-white text-gray-800 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-800 rounded-lg shadow-lg">
                  <SelectItem value="PLAYER">Player</SelectItem>
                  <SelectItem value="DEVELOPER">Developer</SelectItem>
                  <SelectItem value="DESIGNER">Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isProfessionalRole && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-gray-800 text-sm font-semibold">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="portfolioUrl" className="text-gray-800 text-sm font-semibold">Portfolio URL</Label>
                  <Input
                    id="portfolioUrl"
                    placeholder="https://your-portfolio.com"
                    required
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="experienceYears" className="text-gray-800 text-sm font-semibold">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    placeholder="3"
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}