"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (!user) return "/";
    return `/${user.role.toLowerCase()}/dashboard`;
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-gray-200",
      pathname === '/' ? "bg-gradient-to-r from-blue-100 to-purple-100" : "bg-white/90 backdrop-blur-sm"
    )}>
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Gamepad2 className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg text-gray-800">GameAssetHub</span>
        </Link>
        <div className="flex flex-1 items-center" />
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50" asChild>
                <Link href={getDashboardLink()}>Dashboard</Link>
              </Button>
              <Button onClick={logout} variant="secondary" className="bg-gray-200 text-gray-800 hover:bg-gray-300">Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}