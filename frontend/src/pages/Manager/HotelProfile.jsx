import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BedDouble,
  Building2,
  ImagePlus,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import AmenitiesSelector, {
  normalizeAmenitiesSelection,
} from "@/components/Manager/AmenitiesSelector";
import StarRating from "@/components/Manager/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  getManagedHotelProfile,
  updateManagedHotel,
} from "@/services/manager.service";
import hotelPlaceholder from "@/static/placeholders/hotel-photo-placeholder.jpg";

const EMPTY_HOTEL = {
  id: "",
  name: "",
  description: "",
  city: "",
  address: "",
  country: "Egypt",
  phone: "",
  email: "",
  rating: 1,
  amenities: [],
  numberOfRooms: 1,
  status: "",
  image: "",
  photos: [],
};

const INPUT_CLASSES =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

const TEXTAREA_CLASSES = `${INPUT_CLASSES} min-h-28 resize-y`;

const areListsEqual = (first = [], second = []) =>
  JSON.stringify(first) === JSON.stringify(second);

function HotelProfile() {
  const [hotel, setHotel] = useState(EMPTY_HOTEL);
  const [initialHotel, setInitialHotel] = useState(EMPTY_HOTEL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const photoInputRef = useRef(null);

  const loadHotel = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const payload = await getManagedHotelProfile();
      const nextHotel = {
        ...EMPTY_HOTEL,
        ...payload,
        amenities: normalizeAmenitiesSelection(payload?.amenities),
      };
      setHotel(nextHotel);
      setInitialHotel(nextHotel);
      setSelectedPhotoFile(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load hotel profile.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHotel();
  }, [loadHotel]);

  const hasChanges = useMemo(() => {
    return (
      hotel.name !== initialHotel.name ||
      hotel.description !== initialHotel.description ||
      hotel.city !== initialHotel.city ||
      hotel.address !== initialHotel.address ||
      hotel.country !== initialHotel.country ||
      hotel.phone !== initialHotel.phone ||
      hotel.email !== initialHotel.email ||
      Number(hotel.rating) !== Number(initialHotel.rating) ||
      Number(hotel.numberOfRooms) !== Number(initialHotel.numberOfRooms) ||
      !areListsEqual(hotel.amenities, initialHotel.amenities) ||
      Boolean(selectedPhotoFile)
    );
  }, [hotel, initialHotel, selectedPhotoFile]);

  const selectedAmenitiesCount = useMemo(
    () => normalizeAmenitiesSelection(hotel.amenities).length,
    [hotel.amenities],
  );

  function updateField(field, value) {
    if (field === "amenities") {
      setHotel((prev) => ({
        ...prev,
        amenities: normalizeAmenitiesSelection(value),
      }));
      return;
    }

    setHotel((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    setHotel(initialHotel);
    setSelectedPhotoFile(null);
    setEditing(false);
  }

  function handlePhotoSelection(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedPhotoFile(file);
    setHotel((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    event.target.value = "";
  }

  async function handleSave() {
    const payload = {};

    if (hotel.name !== initialHotel.name) payload.name = hotel.name.trim();
    if (hotel.description !== initialHotel.description) {
      payload.description = hotel.description.trim();
    }
    if (hotel.phone !== initialHotel.phone) payload.phone = hotel.phone.trim();
    if (hotel.email !== initialHotel.email) payload.email = hotel.email.trim();

    const nextStars = Number(hotel.rating);
    if (nextStars !== Number(initialHotel.rating)) payload.stars = nextStars;

    const nextNumberOfRooms = Number(hotel.numberOfRooms);
    if (nextNumberOfRooms !== Number(initialHotel.numberOfRooms)) {
      payload.numberOfRooms = nextNumberOfRooms;
    }

    if (!areListsEqual(hotel.amenities, initialHotel.amenities)) {
      payload.amenities = hotel.amenities;
    }

    const addressChanged =
      hotel.address !== initialHotel.address ||
      hotel.city !== initialHotel.city ||
      hotel.country !== initialHotel.country;

    if (addressChanged) {
      payload.address = {
        street: hotel.address.trim(),
        city: hotel.city.trim(),
        country: hotel.country.trim() || "Egypt",
      };
    }

    const hasPayloadChanges = Object.keys(payload).length > 0;
    const hasPhotoChange = Boolean(selectedPhotoFile);

    if (!hasPayloadChanges && !hasPhotoChange) {
      toast.info("No changes to save.");
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      await updateManagedHotel(
        hasPhotoChange
          ? { ...payload, photoFiles: [selectedPhotoFile] }
          : payload,
      );
      await loadHotel();
      toast.success(`Changes to ${hotel.name} saved successfully.`);
      setEditing(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update hotel profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  const statusLabel = hotel.status
    ? hotel.status.replaceAll("_", " ").replace(/\b\w/g, (ch) => ch.toUpperCase())
    : "Not set";

  return (
    <div className="bg-muted/30 min-h-full">
      <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-10 space-y-6">
        <div
          className="rounded-2xl p-5 sm:p-6"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {hotel.name || "Hotel Profile"}
                </h1>
                <Badge variant="secondary">{statusLabel}</Badge>
              </div>
              <p className="text-sm text-white/80">
                Edit your hotel details, contact info, amenities, and profile
                settings from one place.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {[hotel.city, hotel.country].filter(Boolean).join(", ") || "Location not set"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="size-4" />
                  {hotel.numberOfRooms || 0} rooms
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {editing ? (
                <>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X className="size-4" />
                    Cancel
                  </Button>
                  <Button
                    className="bg-white text-[var(--color-primary)] hover:bg-white/90"
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                  >
                    {saving ? <Spinner className="size-4" /> : <Save className="size-4" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-white text-[var(--color-primary)] hover:bg-white/90"
                  onClick={() => setEditing(true)}
                  disabled={loading || Boolean(error)}
                >
                  <PencilLine className="size-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="py-10">
            <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
              <Spinner className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading hotel profile...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-8 text-center space-y-3">
              <p className="text-sm text-red-500">{error}</p>
              <div>
                <Button variant="outline" onClick={loadHotel}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="size-4 text-[var(--color-primary)]" />
                  Hotel details
                </CardTitle>
                <CardDescription>
                  Main profile data visible across manager and booking workflows.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Hotel name</label>
                    {editing ? (
                      <input
                        value={hotel.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className={INPUT_CLASSES}
                        placeholder="Hotel name"
                      />
                    ) : (
                      <p className="text-sm text-foreground">{hotel.name || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Stars</label>
                    {editing ? (
                      <select
                        value={Number(hotel.rating) || 1}
                        onChange={(e) => updateField("rating", Number(e.target.value))}
                        className={INPUT_CLASSES}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <option key={star} value={star}>
                            {star} star{star > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <StarRating rating={Number(hotel.rating) || 0} />
                        <span className="text-sm text-muted-foreground">
                          {Number(hotel.rating) || 0}/5
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Description</label>
                    {editing ? (
                      <textarea
                        value={hotel.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className={TEXTAREA_CLASSES}
                        placeholder="Add a short hotel description (minimum 20 characters)."
                      />
                    ) : (
                      <p className="text-sm text-foreground leading-relaxed">
                        {hotel.description || "No description provided."}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Street</label>
                    {editing ? (
                      <input
                        value={hotel.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className={INPUT_CLASSES}
                        placeholder="Street address"
                      />
                    ) : (
                      <p className="text-sm text-foreground">{hotel.address || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">City</label>
                    {editing ? (
                      <input
                        value={hotel.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className={INPUT_CLASSES}
                        placeholder="City"
                      />
                    ) : (
                      <p className="text-sm text-foreground">{hotel.city || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Country</label>
                    {editing ? (
                      <input
                        value={hotel.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        className={INPUT_CLASSES}
                        placeholder="Country"
                      />
                    ) : (
                      <p className="text-sm text-foreground">{hotel.country || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Number of rooms
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        min={1}
                        value={Number(hotel.numberOfRooms) || 1}
                        onChange={(e) => updateField("numberOfRooms", Number(e.target.value))}
                        className={INPUT_CLASSES}
                      />
                    ) : (
                      <p className="text-sm text-foreground">
                        {Number(hotel.numberOfRooms) || 0}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile image</CardTitle>
                  <CardDescription>
                    This image appears as the main hotel photo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                    <img
                        src={hotel.image || hotelPlaceholder}
                        alt={hotel.name || "Hotel image"}
                        onError={(e) => { e.currentTarget.src = hotelPlaceholder; }}
                        className="w-full h-52 object-cover"
                      />
                  </div>
                  {editing && (
                    <div className="mt-3">
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        className="hidden"
                        onChange={handlePhotoSelection}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={saving}
                      >
                        <ImagePlus className="size-4" />
                        {selectedPhotoFile ? "Change selected photo" : "Upload photo"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    {editing ? (
                      <>
                        <label className="text-xs font-medium text-muted-foreground">Phone</label>
                        <input
                          value={hotel.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className={INPUT_CLASSES}
                          placeholder="+201234567890"
                        />
                      </>
                    ) : (
                      <div className="rounded-md border border-border/60 bg-muted/20 px-3 py-2.5">
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="size-4" />
                            Phone
                          </span>
                          <p className="text-sm font-medium text-foreground sm:text-right">
                            {hotel.phone || "Not set"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {editing ? (
                      <>
                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                        <input
                          value={hotel.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className={INPUT_CLASSES}
                          placeholder="hotel@email.com"
                        />
                      </>
                    ) : (
                      <div className="rounded-md border border-border/60 bg-muted/20 px-3 py-2.5">
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="size-4" />
                            Email
                          </span>
                          <p className="text-sm font-medium text-foreground break-all sm:text-right">
                            {hotel.email || "Not set"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="xl:col-span-3">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>
                  Select amenities to improve search visibility and guest expectations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <AmenitiesSelector
                    selected={hotel.amenities}
                    onChange={(nextAmenities) => updateField("amenities", nextAmenities)}
                  />
                ) : hotel.amenities.length ? (
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No amenities set yet.</p>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-muted-foreground">
                  {selectedAmenitiesCount} amenit{selectedAmenitiesCount === 1 ? "y" : "ies"} selected
                </span>
                {editing && (
                  <Button onClick={handleSave} disabled={saving || !hasChanges}>
                    {saving ? <Spinner className="size-4" /> : <Save className="size-4" />}
                    Save
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelProfile;
