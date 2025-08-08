"use client";

import { useEffect, useState } from "react";
import { GameCard } from "@/components/game-card";
import { getPublicGames } from "@/lib/api";
import type { Game } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/components/layout/hero-section";
import { motion } from "framer-motion";

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const publicGames = await getPublicGames();
        setGames(publicGames);
      } catch (error) {
        console.error("Failed to fetch public games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 py-12 sm:py-16 bg-gradient-to-b from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl mb-8 text-center">
            Latest Game Assets
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[225px] w-full rounded-xl bg-blue-100/50" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-blue-100/50" />
                    <Skeleton className="h-4 w-1/2 bg-blue-100/50" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
          {games.length === 0 && !loading && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-800">No Assets Found</h2>
              <p className="text-gray-500 mt-2">It looks like there are no approved assets to show right now. Check back later!</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
