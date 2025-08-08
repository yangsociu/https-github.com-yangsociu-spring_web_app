import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/lib/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  showStatus?: boolean;
}

export function GameCard({ game, showStatus = false }: GameCardProps) {
  const getStatusClasses = (status: Game["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const imageUrl = game.previewImageUrl || "/stylized-game-scene.png";

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/games/${game.id}`} className="block h-full">
        <Card className="flex flex-col h-full bg-white border border-gray-200 hover:border-blue-400 transition-all duration-300 overflow-hidden rounded-xl shadow-md hover:shadow-xl">
          <div className="relative aspect-video w-full">
            <Image
              src={imageUrl}
              alt={`Preview for ${game.name}`}
              fill
              className="object-cover rounded-t-xl"
            />
          </div>
          <CardContent className="p-4 flex-1">
            <h3 className="font-bold text-lg text-gray-800">{game.name}</h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {game.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            {showStatus ? (
              <div className="w-full">
                <Badge className={cn("w-full justify-center font-semibold", getStatusClasses(game.status))}>
                  {game.status}
                </Badge>
              
              </div>
            ) : (
              <div className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                View Details &rarr;
              </div>
            )}
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}