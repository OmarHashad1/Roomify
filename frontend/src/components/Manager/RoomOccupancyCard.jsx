function OccupancyBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">
          {count}{" "}
          <span className="text-muted-foreground font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function RoomOccupancyCard({ totalRooms, bookedRooms }) {
  const available = Math.max(0, totalRooms - bookedRooms);

  return (
    <div className="bg-white border border-border rounded-lg p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Room Occupancy</h3>
        <p className="text-xs text-muted-foreground">Current room status overview</p>
      </div>

      <div className="flex items-center justify-around mb-6 py-3 bg-muted/40 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{totalRooms}</p>
          <p className="text-xs text-muted-foreground">Total Rooms</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{bookedRooms}</p>
          <p className="text-xs text-muted-foreground">Booked</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{available}</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </div>
      </div>

      <div className="space-y-4">
        <OccupancyBar
          label="Booked rooms"
          count={bookedRooms}
          total={totalRooms}
          color="#3b82f6"
        />
        <OccupancyBar
          label="Available rooms"
          count={available}
          total={totalRooms}
          color="#10b981"
        />
      </div>
    </div>
  );
}

export default RoomOccupancyCard;
