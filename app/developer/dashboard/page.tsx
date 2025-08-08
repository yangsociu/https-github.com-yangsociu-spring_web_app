// Component giao diện chính của bảng điều khiển dành cho deverloper

"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GameUploadForm } from "./components/GameUploadForm";
import { MyGamesList } from "./components/MyGamesList";

export default function DeveloperDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Developer Dashboard</h1>
        <p className="text-gray-600 text-base mt-1">Manage your game submissions and view their status.</p>
      </div>
      <Tabs defaultValue="my-games" className="mt-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-100">
          <TabsTrigger value="my-games" className="rounded-lg">My Games</TabsTrigger>
          <TabsTrigger value="upload-game" className="rounded-lg">Upload New Game</TabsTrigger>
        </TabsList>
        <TabsContent value="my-games">
          <MyGamesList />
        </TabsContent>
        <TabsContent value="upload-game">
          <GameUploadForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}