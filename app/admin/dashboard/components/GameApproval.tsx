// Component hiển thị danh sách trò chơi đang chờ phê duyệt cho admin, 
// cho phép phê duyệt hoặc từ chối trò chơi, 
// cập nhật danh sách sau khi thực hiện hành động, và hiển thị thông báo kết quả.

"use client";

import { useEffect, useState } from "react";
import { getPendingGames, approveGame } from "@/lib/api";
import type { Game } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';

export function GameApproval() {
  const [pendingGames, setPendingGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGames = async () => {
    setLoading(true);
    try {
      const games = await getPendingGames();
      setPendingGames(games);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch pending games.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleApproval = async (gameId: number, status: "APPROVED" | "REJECTED") => {
    try {
      await approveGame(gameId, status);
      toast({
        title: "Success",
        description: `Game has been ${status.toLowerCase()}.`,
      });
      fetchGames();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update game status.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Pending Game Approvals</h2>
      {pendingGames.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game Name</TableHead>
              <TableHead>Developer ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingGames.map((game) => (
              <TableRow key={game.id}>
                <TableCell>{game.name}</TableCell>
                <TableCell>{game.developerId}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{game.status}</Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={() => handleApproval(game.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={() => handleApproval(game.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-600 text-center">No pending game approvals.</p>
      )}
    </div>
  );
}