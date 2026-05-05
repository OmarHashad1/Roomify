import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CalendarCheck, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getRoomTypeById } from "@/services/roomType.service";
import { RoomAvailabilityContext } from "@/context/roomAvailability/RoomAvailabilityContext";

function inputClass() {
  return "w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground";
}

function RoomAvailability() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createAvailability, updateAvailability } = useContext(
    RoomAvailabilityContext,
  );

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const [count, setCount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getRoomTypeById(id)
      .then((data) => {
        if (!cancelled) setRoom(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err.response?.data?.message || err.message || "Failed to load room",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    if (!date) {
      toast.error("Please pick a date.");
      return;
    }
    const availableCount = Number(count);
    if (!Number.isFinite(availableCount) || availableCount < 0) {
      toast.error("Please enter a non-negative count.");
      return;
    }

    setSaving(true);
    try {
      try {
        await createAvailability({ roomType: id, date, availableCount });
        toast.success("Availability set for this date.");
      } catch (err) {
        if (err.response?.status === 409) {
          await updateAvailability(date, { roomType: id, availableCount });
          toast.success("Availability updated for this date.");
        } else {
          throw err;
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to save availability",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 opacity-40" />
        <p className="text-sm">Loading room...</p>
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
      <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-10 space-y-6 max-w-3xl">
        <div
          className="rounded-2xl px-5 py-6 sm:px-8 sm:py-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-full bg-white/20 p-3 shrink-0">
              <CalendarCheck className="size-6" />
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium">
                Room: {room?.type || "—"}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold">
                Manage Availability
              </h1>
              <p className="text-white/70 text-sm mt-0.5">
                Set or update how many of this room are available on a given
                date.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/manager/rooms")}
            className="text-white border-white/40 hover:bg-white/20 hover:text-white bg-transparent shrink-0 self-start sm:self-auto"
          >
            <ArrowLeft className="size-4" />
            Back to Rooms
          </Button>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-lg border border-border bg-white p-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass()}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Available Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="e.g. 5"
                className={inputClass()}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="text-white hover:opacity-90"
            >
              {saving ? (
                <>
                  <Spinner className="size-4" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomAvailability;
