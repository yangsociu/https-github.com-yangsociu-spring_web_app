// Component hiển thị danh sách người dùng và trò chơi cho admin, 
// với giao diện tab để chuyển đổi giữa hai danh sách, 
// lấy dữ liệu từ API và hiển thị trạng thái bằng badge.

"use client"

import { useEffect, useState } from "react"
import { getAdminAllUsers, getAdminAllGames, deleteUser } from "@/lib/api"
import type { User, Game } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Trash2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UserDetailsDialog } from "./UserDetailsDialog"

const getStatusVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default"
    case "PENDING":
      return "secondary"
    case "REJECTED":
      return "destructive"
    default:
      return "outline"
  }
}

function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAdminAllUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      await deleteUser(userId)
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
      fetchUsers() // Refresh the list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user.",
      })
    }
  }

  const handleViewDetails = (user: User) => {
    if (user.role === "DESIGNER" || user.role === "DEVELOPER") {
      setSelectedUser(user)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {user.role}
                  {(user.role === "DESIGNER" || user.role === "DEVELOPER") && (
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)} className="p-1 h-auto">
                      <Info className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>{user.fullName || "N/A"}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <UserDetailsDialog user={selectedUser} open={!!selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </>
  )
}

function GameList() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminAllGames()
      .then(setGames)
      .catch(() => console.error("Failed to fetch games"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Game Name</TableHead>
          <TableHead>Developer ID</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.id}>
            <TableCell>{game.name}</TableCell>
            <TableCell>{game.developerId}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(game.status)}>{game.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function ApprovedLists() {
  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Directory</h2>
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="games">All Games</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">User Directory</h3>
          <UserList />
        </TabsContent>
        <TabsContent value="games">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">Game Directory</h3>
          <GameList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
