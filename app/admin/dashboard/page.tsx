// Component giao diện chính của bảng điều khiển admin, 
// cung cấp các tab để quản lý phê duyệt người dùng, phê duyệt trò chơi và xem danh sách đã được phê duyệt.

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserApproval } from "./components/UserApproval";
import { GameApproval } from "./components/GameApproval";
import { ApprovedLists } from "./components/ApprovedLists";

export default function AdminDashboardPage() {
return (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
    <Tabs defaultValue="user-approval">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="user-approval">User Approvals</TabsTrigger>
        <TabsTrigger value="game-approval">Game Approvals</TabsTrigger>
        <TabsTrigger value="approved-lists">Approved Lists</TabsTrigger>
      </TabsList>
      <TabsContent value="user-approval">
        <UserApproval />
      </TabsContent>
      <TabsContent value="game-approval">
        <GameApproval />
      </TabsContent>
      <TabsContent value="approved-lists">
        <ApprovedLists />
      </TabsContent>
    </Tabs>
  </div>
);
}
