"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, Download, TrendingUp } from "lucide-react"
import { Leaderboard } from "@/components/leaderboard"
import { getCurrentUser } from "@/lib/api"
import type { User } from "@/lib/types"

export default function PlayerDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Failed to load current user:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Player Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.fullName || currentUser?.email}! Browse the{" "}
          <a href="/" className="text-primary underline">
            home page
          </a>{" "}
          to discover new games.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Player Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentUser?.totalPoints || 0}</div>
            <p className="text-xs text-muted-foreground">Earn points by downloading games and writing reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">How to Earn Points</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Download Game
                </span>
                <span className="font-medium text-green-600">+10 pts</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Write Review
                </span>
                <span className="font-medium text-green-600">+20 pts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a href="/" className="block text-sm text-blue-600 hover:text-blue-800 underline">
                Browse Games
              </a>
              <a href="/leaderboard" className="block text-sm text-blue-600 hover:text-blue-800 underline">
                View Full Leaderboard
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Leaderboard />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Your recent activity will appear here</p>
              <p className="text-sm mt-2">Download games and write reviews to see your activity</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
