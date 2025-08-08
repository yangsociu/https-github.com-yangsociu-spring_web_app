"use client";

import { Leaderboard } from "@/components/leaderboard";
import { PageHeader } from "@/components/layout/page-header";

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Leaderboard"
        description="Top players ranked by total points earned"
      />
      <div className="mt-8">
        <Leaderboard />
      </div>
    </div>
  );
}
