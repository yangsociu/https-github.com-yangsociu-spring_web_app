// Component hiển thị chi tiết một trò chơi dựa trên ID, lấy dữ liệu từ API, 
// hiển thị hình ảnh xem trước, thông tin mô tả, yêu cầu hệ thống, tính năng và liên kết tải xuống, với hiệu ứng chuyển động và xử lý trạng thái tải/lỗi.

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getGameById } from "@/lib/api";
import type { Game } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, HardDrive, Info } from 'lucide-react';
import { motion } from "framer-motion";

export default function GameDetailPage() {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const gameId = Number(params.id);
    if (isNaN(gameId)) {
      setError("Invalid game ID.");
      setLoading(false);
      return;
    }

    const fetchGame = async () => {
      try {
        const fetchedGame = await getGameById(gameId);
        setGame(fetchedGame);
      } catch (err) {
        setError("Failed to load game details. It might not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl bg-gradient-to-b from-blue-50 to-white">
        <Skeleton className="h-[450px] w-full rounded-xl mb-8 bg-gray-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-96 w-full bg-gray-200" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full bg-gray-200" />
          </div>
        </div>
        <div className="text-center">
          <span className="text-blue-600 font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-8 text-center bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">An Error Occurred</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const imageUrl = game.previewImageUrl || "/stylized-game-scene.png";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-blue-50 to-white p-6"
    >
      <div className="relative h-[300px] md:h-[450px] w-full rounded-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Banner for ${game.name}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 pb-12 -mt-24 relative z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{game.name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Game Details</CardTitle>
                  <p className="text-gray-600">Developed by: User {game.developerId}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{game.description || "No description provided."}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800"><HardDrive className="mr-3 h-5 w-5 text-blue-600" />System Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{game.requirements || "No requirements specified."}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800"><Info className="mr-3 h-5 w-5 text-blue-600" />Features</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {game.supportLeaderboard ? <Badge variant="secondary">Leaderboard</Badge> : <Badge variant="outline">No Leaderboard</Badge>}
                  {game.supportPoints ? <Badge variant="secondary">Points System</Badge> : <Badge variant="outline">No Points System</Badge>}
                </CardContent>
              </Card>
              <Button 
                size="lg" 
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                asChild
              >
                <a href={game.apkFileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-5 w-5" />
                  <span>Download Now</span>
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}