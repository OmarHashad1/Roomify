import { ArrowLeft, BedDouble, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function ManageRoomHeroBanner({ isEdit, room, onBack }) {
  return (
    <div
      className="rounded-2xl px-5 py-6 sm:px-8 sm:py-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-full bg-white/20 p-3 shrink-0">
          {isEdit ? (
            <BedDouble className="size-6" />
          ) : (
            <Plus className="size-6" />
          )}
        </div>
        <div>
          <p className="text-white/70 text-sm font-medium">
            {isEdit ? `Room ID: ${room.id}` : "New Room"}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold">
            {isEdit ? "Edit Room" : "Create New Room"}
          </h1>
          <p className="text-white/70 text-sm mt-0.5">
            {isEdit
              ? "Update the room details and save your changes."
              : "Fill in the details below to add a new room to your hotel."}
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onBack}
        className="text-white border-white/40 hover:bg-white/20 hover:text-white bg-transparent shrink-0 self-start sm:self-auto"
      >
        <ArrowLeft className="size-4" />
        Back to Rooms
      </Button>
    </div>
  );
}

export default ManageRoomHeroBanner;
