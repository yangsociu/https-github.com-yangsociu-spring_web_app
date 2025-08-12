"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { updateGame } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { Game } from "@/lib/types"

interface EditGameDialogProps {
  game: Game
  open: boolean
  onClose: () => void
  onGameUpdated: () => void
}

export function EditGameDialog({ game, open, onClose, onGameUpdated }: EditGameDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requirements: "",
    apkFileUrl: "",
    supportLeaderboard: false,
    supportPoints: false,
  })
  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        description: game.description,
        requirements: game.requirements,
        apkFileUrl: game.apkFileUrl,
        supportLeaderboard: game.supportLeaderboard,
        supportPoints: game.supportPoints,
      })
    }
  }, [game])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("description", formData.description)
      data.append("requirements", formData.requirements)
      data.append("apkFileUrl", formData.apkFileUrl)
      data.append("supportLeaderboard", formData.supportLeaderboard.toString())
      data.append("supportPoints", formData.supportPoints.toString())

      if (previewImage) {
        data.append("previewImage", previewImage)
      }

      await updateGame(game.id, data)

      toast({
        title: "Success",
        description: "Game updated successfully!",
      })

      onGameUpdated()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update game.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Game Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="edit-requirements">System Requirements</Label>
            <Textarea
              id="edit-requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="edit-previewImage">Preview Image (leave empty to keep current)</Label>
            <Input
              id="edit-previewImage"
              type="file"
              accept="image/*"
              onChange={(e) => setPreviewImage(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label htmlFor="edit-apkFileUrl">APK Download URL *</Label>
            <Input
              id="edit-apkFileUrl"
              type="url"
              value={formData.apkFileUrl}
              onChange={(e) => setFormData({ ...formData, apkFileUrl: e.target.value })}
              placeholder="https://example.com/game.apk"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-supportLeaderboard"
                checked={formData.supportLeaderboard}
                onCheckedChange={(checked) => setFormData({ ...formData, supportLeaderboard: checked as boolean })}
              />
              <Label htmlFor="edit-supportLeaderboard">Support Leaderboard</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-supportPoints"
                checked={formData.supportPoints}
                onCheckedChange={(checked) => setFormData({ ...formData, supportPoints: checked as boolean })}
              />
              <Label htmlFor="edit-supportPoints">Support Points System</Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Game"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
