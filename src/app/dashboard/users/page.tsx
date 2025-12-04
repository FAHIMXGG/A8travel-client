export default function UsersPage() {
  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-background/70 p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-primary/80">Admin only</p>
        <h1 className="text-3xl font-semibold text-foreground">Traveler directory</h1>
        <p className="text-sm text-muted-foreground">
          This is a placeholder listing for every registered traveler. Replace with real user data when
          the backend endpoint is ready.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground">
        Hook up your admin API to render actual users here.
      </div>
    </div>
  )
}

