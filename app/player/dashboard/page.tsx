"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, Download, TrendingUp, Calendar } from "lucide-react"
import { Leaderboard } from "@/components/leaderboard"
import { getCurrentUser, getPlayerPoints, getPlayerTransactions } from "@/lib/api"
import type { User, PointTransaction } from "@/lib/types"

export default function PlayerDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [playerPoints, setPlayerPoints] = useState<number>(0)
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [user, points, transactionHistory] = await Promise.all([
        getCurrentUser(),
        getPlayerPoints(),
        getPlayerTransactions(), // Thêm việc lấy lịch sử giao dịch
      ])

      setCurrentUser(user)
      setPlayerPoints(points)
      setTransactions(transactionHistory)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "DOWNLOAD_GAME":
        return <Download className="w-4 h-4 text-blue-500" />
      case "WRITE_REVIEW":
        return <Star className="w-4 h-4 text-yellow-500" />
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />
    }
  }

  const formatActionType = (actionType: string) => {
    switch (actionType) {
      case "DOWNLOAD_GAME":
        return "Downloaded Game"
      case "WRITE_REVIEW":
        return "Wrote Review"
      default:
        return actionType
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
            <div className="text-2xl font-bold text-blue-600">{playerPoints}</div>
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
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
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
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getActionIcon(transaction.actionType)}
                      <div>
                        <p className="font-medium text-sm">{formatActionType(transaction.actionType)}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{transaction.points} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your recent activity will appear here</p>
                <p className="text-sm mt-2">Download games and write reviews to see your activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
