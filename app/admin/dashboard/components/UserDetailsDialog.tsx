"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"

interface UserDetailsDialogProps {
  user: User
  open: boolean
  onClose: () => void
}

export function UserDetailsDialog({ user, open, onClose }: UserDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registration Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-sm">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Role</label>
            <div className="mt-1">
              <Badge variant="outline">{user.role}</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <p className="text-sm">{user.fullName || "Not provided"}</p>
          </div>

          {user.role === "DESIGNER" && (
            <div>
              <label className="text-sm font-medium text-gray-600">Portfolio URL</label>
              <p className="text-sm">
                {user.portfolioUrl ? (
                  <a
                    href={user.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.portfolioUrl}
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            </div>
          )}

          {user.role === "DEVELOPER" && (
            <div>
              <label className="text-sm font-medium text-gray-600">Experience Years</label>
              <p className="text-sm">{user.experienceYears || "Not provided"}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div className="mt-1">
              <Badge
                variant={
                  user.status === "APPROVED" ? "default" : user.status === "PENDING" ? "secondary" : "destructive"
                }
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
