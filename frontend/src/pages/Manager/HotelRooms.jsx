import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import RoomsHeroBanner from "@/components/Manager/RoomsHeroBanner";
import RoomFilters from "@/components/Manager/RoomFilters";
import RoomsTable from "@/components/Manager/RoomsTable";
import RoomDetailsModal from "@/components/Manager/RoomDetailsModal";
import { RoomTypeContext } from "@/context/roomType/RoomTypeContext";
import { setRoomTypeStatus } from "@/services/roomType.service";

const DEFAULT_FILTERS = {
  search: "",
  status: "",
  bedroom: "",
};

function HotelRooms() {
  const navigate = useNavigate();
  const {
    rooms: fetchedRooms,
    loading,
    error,
    refresh,
  } = useContext(RoomTypeContext);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setRooms(fetchedRooms);
  }, [fetchedRooms]);

  // ── Filtering ──
  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !(r.view || "").toLowerCase().includes(q) &&
          !(r.description || "").toLowerCase().includes(q) &&
          !(r.id || "").toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.status && r.status !== filters.status) return false;
      if (filters.bedroom && r.bedroom !== Number(filters.bedroom)) return false;
      return true;
    });
  }, [rooms, filters]);

  // ── Sorting ──
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const aComp = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const bComp = typeof bVal === "string" ? bVal.toLowerCase() : bVal;
      if (aComp < bComp) return sortDir === "asc" ? -1 : 1;
      if (aComp > bComp) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function handleToggleStatus(room) {
    const newStatus = room.status === "active" ? "inactive" : "active";
    try {
      await setRoomTypeStatus(room.id, newStatus);
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, status: newStatus } : r)),
      );
      setSelectedRoom((prev) =>
        prev?.id === room.id ? { ...prev, status: newStatus } : prev,
      );
      if (newStatus === "active") {
        toast.success(`Room is now active.`);
      } else {
        toast.error(`Room has been deactivated.`);
      }
      await refresh?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update status",
      );
    }
  }

  function handleEdit(room) {
    navigate(`/manager/manage-room/${room.id}`);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 opacity-40" />
        <p className="text-sm">Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-full">
      <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-10 space-y-6">
        {/* Hero Banner */}
        <RoomsHeroBanner rooms={rooms} />

        {/* Filters + Add button */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full">
            <RoomFilters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
          <Button
            className="shrink-0 bg-[#2297CE] hover:bg-[#1b7fb0] text-white"
            onClick={() => navigate("/manager/manage-room")}
          >
            <Plus className="size-4" />
            Add Room
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{sorted.length}</span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{rooms.length}</span>{" "}
          room{rooms.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <RoomsTable
          rooms={sorted}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onViewDetails={setSelectedRoom}
          onEdit={handleEdit}
        />
      </div>

      {/* Room details side panel */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default HotelRooms;
