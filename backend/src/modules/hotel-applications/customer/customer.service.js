import { create, findOne } from "../../../db/db.repo.js";
import { hotelApplicationModel } from "../../../models/HotelApplication/hotelApplication.mode.js";
import { logger } from "../../../utils/winston.utils.js";
import { logActorTypes } from "../../../enums/log.enums.js";
import { emailEventEmitter } from "../../../events/emails.event.js";
import { EMAIL_EVENTS } from "../../../enums/email.enums.js";

export const submitApplication = async ({
  firstName,
  lastName,
  email,
  phone,
  hotelName,
  stars,
  address,
  numberOfRooms,
  description,
  documents,
}) => {
  const existing = await findOne({
    model: hotelApplicationModel,
    filter: { email },
  });
  if (existing) {
    throw new Error("An application with this email already exists");
  }

  let application;
  try {
    ({ data: application } = await create({
      model: hotelApplicationModel,
      data: {
        firstName,
        lastName,
        email,
        phone,
        hotelName,
        stars,
        address,
        numberOfRooms,
        description,
        documents,
      },
    }));
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("An application with this email already exists");
    }
    throw err;
  }

  logger.info(
    `Hotel application submitted: ${email} (id: ${application._id})`,
    {
      action: "APPLICATION_SUBMITTED",
      targetId: application._id.toString(),
      actor: { type: logActorTypes.SYSTEM },
    },
  );

  emailEventEmitter.emit(EMAIL_EVENTS.HOTEL_APPLICATION_SUBMITTED, {
    to: email,
    firstName,
    hotelName,
    stars,
    address,
    numberOfRooms,
  });

  return application;
};
