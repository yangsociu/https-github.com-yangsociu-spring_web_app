// Component giao diện chính của bảng điều khiển dành cho player

export default function PlayerDashboardPage() {
return (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Player Dashboard</h1>
    <p className="text-muted-foreground">Welcome, Player! Browse the <a href="/" className="text-primary underline">home page</a> to discover new games.</p>
  </div>
);
}
