import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ManageRoomHeroBanner from "@/components/Manager/ManageRoomHeroBanner";
import RoomFormSection from "@/components/Manager/RoomFormSection";
import AmenitiesSelector from "@/components/Manager/AmenitiesSelector";
import RoomPhotoUpload from "@/components/Manager/RoomPhotoUpload";
import {
  createRoomType,
  getRoomTypeById,
  updateRoomType,
} from "@/services/roomType.service";
import { RoomTypeContext } from "@/context/roomType/RoomTypeContext";

// ── Constants ─────────────────────────────────────────────────────────────────
const VIEW_OPTIONS = [
  "City View",
  "Nile View",
  "Pool & City View",
  "Garden View",
  "Sea View",
  "Mountain View",
  "Courtyard View",
  "No View",
];

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildDefaultForm(room) {
  if (room) {
    return {
      type: room.type ?? "",
      bedroom: room.bedroom ?? 1,
      view: room.view ?? "",
      description: room.description ?? "",
      pricePerNight: room.pricePerNight ?? "",
      maxGuests: room.maxGuests ?? 1,
      smokingAllowed: room.smokingAllowed ?? false,
      status: room.status ?? "active",
      amenities: room.amenities ?? [],
      mainPhoto: room.mainPhoto ?? "",
      photos: room.photos ?? [],
      mainPhotoFile: null,
      photoFiles: [],
    };
  }
  return {
    type: "",
    bedroom: 1,
    view: "",
    description: "",
    pricePerNight: "",
    maxGuests: 1,
    smokingAllowed: false,
    status: "active",
    amenities: [],
    mainPhoto: "",
    photos: [],
    mainPhotoFile: null,
    photoFiles: [],
  };
}

function inputClass() {
  return "w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground";
}


// ── Page ─────────────────────────────────────────────────────────────────────
function ManageRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { refresh } = useContext(RoomTypeContext);

  const [room, setRoom] = useState(null);
  const [form, setForm] = useState(() => buildDefaultForm(null));
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getRoomTypeById(id)
      .then((data) => {
        if (cancelled) return;
        setRoom(data);
        setForm(buildDefaultForm(data));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || err.message || "Failed to load room");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset() {
    setForm(buildDefaultForm(room));
    toast.info("Form reset to original values.");
  }

  function validate() {
    if (!form.type.trim()) {
      toast.error("Please enter a room type name.");
      return false;
    }
    if (!form.description.trim()) {
      toast.error("Please enter a description.");
      return false;
    }
    if (!form.pricePerNight || Number(form.pricePerNight) <= 0) {
      toast.error("Please enter a valid price per night.");
      return false;
    }
    if (!form.maxGuests || Number(form.maxGuests) < 1) {
      toast.error("Max guests must be at least 1.");
      return false;
    }
    if (!isEdit && !form.mainPhotoFile) {
      toast.error("Please upload a main photo.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await updateRoomType(id, form);
        toast.success("Room updated successfully.");
      } else {
        await createRoomType(form);
        toast.success("Room created successfully.");
      }
      await refresh?.();
      navigate("/manager/rooms");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to save room",
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
      <form onSubmit={handleSubmit} noValidate>
        <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-10 space-y-6">
          {/* ── Hero Banner ── */}
          <ManageRoomHeroBanner
            isEdit={isEdit}
            room={room}
            onBack={() => navigate("/manager/rooms")}
          />

          {/* ── Basic Information ── */}
          <RoomFormSection
            title="Basic Information"
            description="Set the core details that define this room."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standard, Deluxe, Suite…"
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className={inputClass()}
                />
              </div>

              {/* Bedrooms */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Bedrooms <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.bedroom}
                  onChange={(e) => handleChange("bedroom", Number(e.target.value))}
                  className={inputClass()}
                >
                  {BEDROOM_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} Bedroom{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* View */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  View <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="view-options"
                  placeholder="e.g. City View, Nile View…"
                  value={form.view}
                  onChange={(e) => handleChange("view", e.target.value)}
                  className={inputClass()}
                />
                <datalist id="view-options">
                  {VIEW_OPTIONS.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>

              {/* Price Per Night */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Price Per Night ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 150"
                  value={form.pricePerNight}
                  onChange={(e) => handleChange("pricePerNight", e.target.value)}
                  className={inputClass()}
                />
              </div>

              {/* Max Guests */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Max Guests <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.maxGuests}
                  onChange={(e) => handleChange("maxGuests", Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
            </div>
          </RoomFormSection>

          {/* ── Room Details ── */}
          <RoomFormSection
            title="Room Details"
            description="Describe the room and configure its policies and status."
          >
            <div className="space-y-4">
              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the room – furnishings, ambiance, unique features…"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`${inputClass()} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Smoking Policy */}
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-foreground">
                    Smoking Policy
                  </p>
                  <div className="flex gap-3">
                    {[
                      { value: false, label: "No Smoking" },
                      { value: true, label: "Smoking Allowed" },
                    ].map(({ value, label }) => {
                      const isActive = form.smokingAllowed === value;
                      return (
                        <label
                          key={String(value)}
                          className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-colors text-sm flex-1 ${
                            isActive
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-foreground"
                              : "border-border bg-background text-muted-foreground hover:border-[var(--color-primary)]/50"
                          }`}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            checked={isActive}
                            onChange={() => handleChange("smokingAllowed", value)}
                          />
                          <span
                            className={`size-3 rounded-full border-2 shrink-0 transition-colors ${
                              isActive
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                                : "border-border"
                            }`}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Room Status */}
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-foreground">
                    Room Status
                  </p>
                  <div className="flex gap-3">
                    {[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ].map(({ value, label }) => {
                      const isActive = form.status === value;
                      const activeStyle =
                        value === "active"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-red-400 bg-red-50 text-red-600";
                      const dotStyle =
                        value === "active"
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-red-400 bg-red-400";
                      return (
                        <label
                          key={value}
                          className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-colors text-sm flex-1 ${
                            isActive
                              ? activeStyle
                              : "border-border bg-background text-muted-foreground hover:border-muted-foreground/50"
                          }`}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            checked={isActive}
                            onChange={() => handleChange("status", value)}
                          />
                          <span
                            className={`size-3 rounded-full border-2 shrink-0 transition-colors ${
                              isActive ? dotStyle : "border-border"
                            }`}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </RoomFormSection>

          {/* ── Amenities ── */}
          <RoomFormSection
            title="Amenities"
            description="Select all amenities available in this room."
          >
            <AmenitiesSelector
              selected={form.amenities}
              onChange={(amenities) => handleChange("amenities", amenities)}
            />
          </RoomFormSection>

          {/* ── Photos ── */}
          <RoomFormSection
            title="Room Photos"
            description="Add a main photo and additional images to showcase the room."
          >
            <RoomPhotoUpload
              mainPhoto={form.mainPhoto}
              photos={form.photos}
              photoFiles={form.photoFiles}
              onMainPhotoChange={(v) => handleChange("mainPhoto", v)}
              onMainPhotoFileChange={(file) => handleChange("mainPhotoFile", file)}
              onPhotosChange={(v) => handleChange("photos", v)}
              onPhotoFilesChange={(files) => handleChange("photoFiles", files)}
            />
          </RoomFormSection>

          {/* ── Form Actions ── */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/manager/rooms")}
            >
              Cancel
            </Button>
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
                  {isEdit ? "Save Changes" : "Create Room"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ManageRoom;
