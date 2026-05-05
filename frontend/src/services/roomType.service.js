import api from "../utils/axios.js";
import { assetUrl } from "../utils/assetUrl.js";

const ASSET_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

// Convert a displayable URL back to the backend-stored relative path so the
// service-side diff (`existing === incoming`) detects equality correctly.
const toStoredPath = (url) => {
  if (!url) return "";
  if (ASSET_BASE && url.startsWith(`${ASSET_BASE}/`))
    return url.slice(ASSET_BASE.length + 1);
  return url;
};

const MANAGER_HOTEL_ID_KEY = "managerHotelId";

const resolveManagedHotelId = async () => {
  const cached = localStorage.getItem(MANAGER_HOTEL_ID_KEY);
  if (cached) return cached;
  const { data } = await api.get("/hotels/mine");
  const hotels = data?.data || [];
  const hotelId = hotels[0]?._id;
  if (!hotelId) throw new Error("No managed hotel found for this account");
  localStorage.setItem(MANAGER_HOTEL_ID_KEY, hotelId);
  return hotelId;
};

const normalizeRoomType = (room) => ({
  id: room._id,
  type: room.type ?? "",
  description: room.description ?? "",
  view: room.view ?? "",
  bedroom: room.bedroomCount ?? 1,
  pricePerNight: room.pricePerNight ?? 0,
  maxGuests: room.maxGuests ?? 1,
  smokingAllowed: !!room.smokingAllowed,
  status: room.status ?? "active",
  amenities: Array.isArray(room.amenities) ? room.amenities : [],
  mainPhoto: assetUrl(room.mainPhoto ?? ""),
  photos: Array.isArray(room.photos) ? room.photos.map(assetUrl) : [],
  createdAt: room.createdAt ?? "",
  updatedAt: room.updatedAt ?? "",
});

export const getMyHotelRoomTypes = async () => {
  const hotelId = await resolveManagedHotelId();
  const { data } = await api.get(
    `/hotels/room-types/manager/hotels/room-types/hotel/${hotelId}`,
  );
  return (data?.data || []).map(normalizeRoomType);
};

export const getRoomTypeById = async (id) => {
  const { data } = await api.get(`/hotels/room-types/${id}`);
  return normalizeRoomType(data?.data);
};

const MANAGER_BASE = "/hotels/room-types/manager/hotels/room-types";

export const createRoomType = async ({
  type,
  description,
  view,
  bedroom,
  pricePerNight,
  maxGuests,
  smokingAllowed,
  amenities,
  status,
  mainPhotoFile,
  photoFiles,
}) => {
  const hotel = await resolveManagedHotelId();
  const formData = new FormData();
  formData.append("hotel", hotel);
  formData.append("type", type);
  formData.append("description", description);
  if (view) formData.append("view", view);
  formData.append("bedroomCount", String(bedroom));
  formData.append("pricePerNight", String(pricePerNight));
  formData.append("maxGuests", String(maxGuests));
  formData.append("smokingAllowed", String(!!smokingAllowed));
  formData.append("amenities", JSON.stringify(amenities || []));
  if (status) formData.append("status", status);

  if (mainPhotoFile) formData.append("photos", mainPhotoFile);
  (photoFiles || []).forEach((file) => formData.append("photos", file));

  const { data } = await api.post(MANAGER_BASE, formData);
  return data?.data;
};

const fetchAsFile = async (url, fallbackName = "main") => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch existing main photo");
  const blob = await res.blob();
  const ext = (blob.type.split("/")[1] || "jpg").split("+")[0];
  return new File([blob], `${fallbackName}.${ext}`, {
    type: blob.type || "image/jpeg",
  });
};

export const updateRoomType = async (id, payload) => {
  const {
    type,
    description,
    view,
    bedroom,
    pricePerNight,
    maxGuests,
    smokingAllowed,
    amenities,
    status,
    mainPhoto,
    photos,
    mainPhotoFile,
    photoFiles,
  } = payload;

  const hasFiles = mainPhotoFile || (photoFiles && photoFiles.length > 0);

  if (hasFiles) {
    let resolvedMainFile = mainPhotoFile;
    if (!resolvedMainFile && mainPhoto) {
      try {
        resolvedMainFile = await fetchAsFile(mainPhoto);
      } catch {
        // fall through — backend will use first additional as main (existing behavior)
      }
    }

    // Preserve existing additional photos (URLs already on the server) by
    // re-fetching them as Files. New uploads (object URLs from File objects)
    // are sent separately via photoFiles, so skip them here.
    const existingPhotoUrls = (photos || []).filter(
      (p) => typeof p === "string" && !p.startsWith("blob:"),
    );
    const existingPhotoFiles = [];
    for (let i = 0; i < existingPhotoUrls.length; i++) {
      try {
        existingPhotoFiles.push(
          await fetchAsFile(existingPhotoUrls[i], `photo-${i}`),
        );
      } catch {
        // skip any that fail
      }
    }

    const formData = new FormData();
    if (type !== undefined) formData.append("type", type);
    if (description !== undefined) formData.append("description", description);
    if (view !== undefined && view !== null) formData.append("view", view);
    if (bedroom !== undefined)
      formData.append("bedroomCount", String(bedroom));
    if (pricePerNight !== undefined)
      formData.append("pricePerNight", String(pricePerNight));
    if (maxGuests !== undefined)
      formData.append("maxGuests", String(maxGuests));
    if (smokingAllowed !== undefined)
      formData.append("smokingAllowed", String(!!smokingAllowed));
    if (amenities !== undefined)
      formData.append("amenities", JSON.stringify(amenities || []));
    if (status) formData.append("status", status);
    if (resolvedMainFile) formData.append("photos", resolvedMainFile);
    existingPhotoFiles.forEach((file) => formData.append("photos", file));
    (photoFiles || []).forEach((file) => formData.append("photos", file));

    const { data } = await api.patch(`${MANAGER_BASE}/${id}`, formData);
    return data?.data;
  }

  const body = {
    type,
    description,
    view,
    bedroomCount: bedroom,
    pricePerNight,
    maxGuests,
    smokingAllowed: !!smokingAllowed,
    amenities: amenities || [],
    status,
    mainPhoto: toStoredPath(mainPhoto),
    photos: (photos || [])
      .filter((p) => typeof p === "string" && !p.startsWith("blob:"))
      .map(toStoredPath),
  };
  const { data } = await api.patch(`${MANAGER_BASE}/${id}`, body);
  return data?.data;
};

export const setRoomTypeStatus = async (id, status) => {
  const { data } = await api.patch(`${MANAGER_BASE}/${id}/status`, { status });
  return data?.data;
};
