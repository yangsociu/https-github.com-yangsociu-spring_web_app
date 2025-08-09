"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Users, Trophy } from "lucide-react"
import { getGameById, trackDownloadAndGetUrl, getCurrentUser } from "@/lib/api"
import { GameReviews } from "@/components/game-reviews"
import type { Game, User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function GameDetailPage() {
  const params = useParams()
  const gameId = Number.parseInt(params.id as string)
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (gameId) {
      loadGame()
      loadCurrentUser()
    }
  }, [gameId])

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Failed to load current user:", error)
    }
  }

  const loadGame = async () => {
    try {
      setLoading(true)
      const gameData = await getGameById(gameId)
      setGame(gameData)
    } catch (error) {
      console.error("Failed to load game:", error)
      toast({
        title: "Error",
        description: "Failed to load game details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to download games",
        variant: "destructive",
      })
      return
    }

    if (currentUser.role !== "PLAYER") {
      toast({
        title: "Access Denied",
        description: "Only players can download games",
        variant: "destructive",
      })
      return
    }

    try {
      setDownloading(true)

      // Track download and get APK URL
      const apkUrl = await trackDownloadAndGetUrl(currentUser.id, gameId)

      // Show success message
      toast({
        title: "Download Started",
        description: game?.supportPoints ? "Download started! You earned 10 points!" : "Download started!",
      })

      // Trigger download
      window.open(apkUrl, "_blank")
    } catch (error: any) {
      console.error("Download failed:", error)
      toast({
        title: "Download Failed",
        description: error.message || "Failed to start download",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading game details...</div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Game not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{game.name}</CardTitle>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">{game.status}</Badge>
                    {game.supportPoints && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Points Enabled
                      </Badge>
                    )}
                    {game.supportLeaderboard && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Leaderboard
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                <Image
                  src={game.previewImageUrl || "/stylized-game-scene.png"}
                  alt={game.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{game.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">System Requirements</h3>
                  <p className="text-gray-700">{game.requirements}</p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleDownload}
                    disabled={downloading || !currentUser || currentUser.role !== "PLAYER"}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloading ? "Starting Download..." : "Download Game"}
                    {game.supportPoints && currentUser?.role === "PLAYER" && " (+10 points)"}
                  </Button>

                  {!currentUser && (
                    <p className="text-sm text-gray-500 mt-2">Please log in as a player to download games</p>
                  )}

                  {currentUser && currentUser.role !== "PLAYER" && (
                    <p className="text-sm text-gray-500 mt-2">Only players can download games</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Game Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Developer ID:</span>
                <span className="font-medium">{game.developerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={game.status === "APPROVED" ? "default" : "secondary"}>{game.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Points System:</span>
                <span className={game.supportPoints ? "text-green-600" : "text-gray-400"}>
                  {game.supportPoints ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Leaderboard:</span>
                <span className={game.supportLeaderboard ? "text-green-600" : "text-gray-400"}>
                  {game.supportLeaderboard ? "Enabled" : "Disabled"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Points Info for Players */}
          {currentUser?.role === "PLAYER" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {game.supportPoints ? (
                  <>
                    <div className="flex justify-between">
                      <span>Download Game:</span>
                      <span className="font-medium text-green-600">+10 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Write Review:</span>
                      <span className="font-medium text-green-600">+20 points</span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">This game doesn't support points</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <GameReviews gameId={gameId} />
      </div>
    </div>
  )
}
