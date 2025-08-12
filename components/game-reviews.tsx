"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, User } from "lucide-react"
import { getGameReviews, submitReview, getCurrentUser } from "@/lib/api"
import type { Review, User as UserType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface GameReviewsProps {
  gameId: number
}

export function GameReviews({ gameId }: GameReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [hasReviewed, setHasReviewed] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadReviews()
    loadCurrentUser()
  }, [gameId])

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Failed to load current user:", error)
    }
  }

  const loadReviews = async () => {
    try {
      setLoading(true)
      const reviewsData = await getGameReviews(gameId)
      setReviews(reviewsData)

      // Check if current user has already reviewed
      const user = await getCurrentUser()
      if (user) {
        const userReview = reviewsData.find((review) => review.playerId === user.id)
        setHasReviewed(!!userReview)
      }
    } catch (error) {
      console.error("Failed to load reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review",
        variant: "destructive",
      })
      return
    }

    if (currentUser.role !== "PLAYER") {
      toast({
        title: "Access Denied",
        description: "Only players can submit reviews",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await submitReview({
        gameId,
        rating,
        comment,
      })

      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully! You earned 20 points!",
      })

      // Reset form and reload reviews
      setRating(0)
      setComment("")
      setHasReviewed(true)
      loadReviews()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (currentRating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading reviews...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Review Form */}
          {currentUser && currentUser.role === "PLAYER" && !hasReviewed && (
            <form onSubmit={handleSubmitReview} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold">Write a Review</h3>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="mt-1">{renderStars(rating, true)}</div>
              </div>

              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this game..."
                  className="mt-1"
                  maxLength={1000}
                />
                <div className="text-sm text-gray-500 mt-1">{comment.length}/1000 characters</div>
              </div>

              <Button type="submit" disabled={submitting || rating === 0}>
                {submitting ? "Submitting..." : "Submit Review (+20 points)"}
              </Button>
            </form>
          )}

          {hasReviewed && currentUser?.role === "PLAYER" && (
            <div className="mb-6 p-4 border rounded-lg bg-green-50">
              <p className="text-green-700">You have already reviewed this game.</p>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{review.playerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-700 mt-2">{review.comment}</p>}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
