import { hotelModel } from "../../../models/Hotel/hotel.model.js";
import { hotelStatuses } from "../../../enums/hotel.enums.js";
import { makeError } from "../../../utils/errorMaker.util.js";

export const listHotels = async ({ status } = {}) => {
  if (status && !Object.values(hotelStatuses).includes(status)) {
    throw makeError(
      `Invalid status. Must be one of: ${Object.values(hotelStatuses).join(", ")}`,
      400,
    );
  }

  const filter = status ? { status } : {};

  const hotels = await hotelModel
    .find(filter)
    .populate("owner", "firstName lastName email phone")
    .sort({ createdAt: -1 });

  const all = await hotelModel.find({});
  const summary = {
    total: all.length,
    active: all.filter((h) => h.status === hotelStatuses.ACTIVE).length,
    suspended: all.filter((h) => h.status === hotelStatuses.SUSPENDED).length,
  };

  return { hotels, summary };
};

export const getHotelById = async (id) => {
  const hotel = await hotelModel
    .findById(id)
    .populate("owner", "firstName lastName email phone");

  if (!hotel) throw makeError("Hotel not found", 404);

  return hotel;
};

export const updateHotelStatus = async (id, { status }) => {
  if (!Object.values(hotelStatuses).includes(status)) {
    throw makeError(
      `Invalid status. Must be one of: ${Object.values(hotelStatuses).join(", ")}`,
      400,
    );
  }

  const hotel = await hotelModel
    .findByIdAndUpdate(id, { status }, { new: true, runValidators: false })
    .populate("owner", "firstName lastName email phone");

  if (!hotel) throw makeError("Hotel not found", 404);

  return hotel;
};
