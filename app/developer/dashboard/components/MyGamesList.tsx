"use client"

import { useEffect, useState } from "react"
import { getMyGames, deleteGame } from "@/lib/api"
import type { Game } from "@/lib/types"
import { GameCard } from "@/components/game-card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { EditGameDialog } from "./EditGameDialog"

export function MyGamesList() {
  const [myGames, setMyGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchMyGames()
  }, [])

  const fetchMyGames = async () => {
    setLoading(true)
    try {
      const games = await getMyGames()
      setMyGames(games)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch your games.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (game: Game) => {
    setEditingGame(game)
  }

  const handleDelete = async (gameId: number) => {
    if (!confirm("Are you sure you want to delete this game? This action cannot be undone.")) {
      return
    }

    try {
      await deleteGame(gameId)
      toast({
        title: "Success",
        description: "Game deleted successfully.",
      })
      fetchMyGames() // Refresh the list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete game.",
      })
    }
  }

  const handleGameUpdated = () => {
    setEditingGame(null)
    fetchMyGames() // Refresh the list
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">My Uploaded Games</h2>
      {myGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              showStatus={true}
              showActions={true}
              onEdit={() => handleEdit(game)}
              onDelete={() => handleDelete(game.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">You haven't uploaded any games yet.</p>
      )}

      {editingGame && (
        <EditGameDialog
          game={editingGame}
          open={!!editingGame}
          onClose={() => setEditingGame(null)}
          onGameUpdated={handleGameUpdated}
        />
      )}
    </div>
  )
}
