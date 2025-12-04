export default function HostEventPage() {
  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-background/70 p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-primary/80">Traveler action</p>
        <h1 className="text-3xl font-semibold text-foreground">Host an event</h1>
        <p className="text-sm text-muted-foreground">
          Only signed-in users can launch meetups. Build out the actual event form here once the backend flow
          is ready.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground">
        Replace this placeholder with your event form UI.
      </div>
    </div>
  )
}

