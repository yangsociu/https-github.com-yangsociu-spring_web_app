// Component hiển thị danh sách các trò chơi đã tải lên bởi người dùng, lấy dữ liệu từ API, 
// hiển thị dưới dạng lưới thẻ trò chơi với trạng thái, và thông báo lỗi nếu không lấy được dữ liệu.

"use client";

import { useEffect, useState } from "react";
import { getMyGames } from "@/lib/api";
import type { Game } from "@/lib/types";
import { GameCard } from "@/components/game-card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

export function MyGamesList() {
  const [myGames, setMyGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMyGames = async () => {
      setLoading(true);
      try {
        const games = await getMyGames();
        setMyGames(games);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch your games.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMyGames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">My Uploaded Games</h2>
      {myGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myGames.map((game) => (
            <GameCard key={game.id} game={game} showStatus={true} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">You haven't uploaded any games yet.</p>
      )}
    </div>
  );
}