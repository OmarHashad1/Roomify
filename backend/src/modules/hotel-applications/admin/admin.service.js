import crypto from "crypto";
import { create, findOne } from "../../../db/db.repo.js";
import { userModel } from "../../../models/User/user.model.js";
import { userRoles } from "../../../enums/user.enums.js";
import { hotelApplicationModel } from "../../../models/HotelApplication/hotelApplication.mode.js";
import { applicationStatuses, hotelStatuses } from "../../../enums/hotel.enums.js";
import { hotelModel } from "../../../models/Hotel/hotel.model.js";
import { hash } from "../../../utils/security/argon.util.js";
import { makeError } from "../../../utils/errorMaker.util.js";
import { EMAIL_EVENTS } from "../../../enums/email.enums.js";
import { emailEventEmitter } from "../../../events/emails.event.js";

const generateUniqueManagerEmail = async (firstName) => {
  if (!firstName)
    throw makeError("Applicant's first name is required to generate manager email", 400);

  const normalizedFirstName = String(firstName).trim().toLowerCase();
  let managerEmail;

  do {
    const sixDigits = crypto.randomInt(100000, 1000000);
    managerEmail = `${normalizedFirstName}_${sixDigits}@roomify.com`;
  } while (await findOne({ model: userModel, filter: { email: managerEmail } }));

  return managerEmail;
};

const makeTemporaryPassword = () => {
  return `Rmfy@${crypto.randomInt(100000, 1000000)}`;
};

export const listApplications = async ({ status } = {}) => {
  if (status && !Object.values(applicationStatuses).includes(status)) {
    throw makeError(
      `Invalid status. Must be one of: ${Object.values(applicationStatuses).join(", ")}`,
      400,
    );
  }

  const allApplications = await hotelApplicationModel
    .find({})
    .sort({ createdAt: -1 });

  const summary = {
    total: allApplications.length,
    under_review: allApplications.filter(
      (a) => a.status === applicationStatuses.UNDER_REVIEW,
    ).length,
    approved: allApplications.filter(
      (a) => a.status === applicationStatuses.APPROVED,
    ).length,
    rejected: allApplications.filter(
      (a) => a.status === applicationStatuses.REJECTED,
    ).length,
  };

  const applications = status
    ? allApplications.filter((a) => a.status === status)
    : allApplications;

  return { applications, summary };
};

export const getApplicationById = async (id) => {
  const application = await hotelApplicationModel.findById(id);

  if (!application) throw makeError("Application not found", 404);

  return application;
};

export const updateApplicationStatus = async (
  id,
  { status, rejectionReason, adminId },
) => {
  if (!Object.values(applicationStatuses).includes(status)) {
    throw makeError(
      `Invalid status. Must be one of: ${Object.values(applicationStatuses).join(", ")}`,
      400,
    );
  }

  const application = await hotelApplicationModel.findById(id);
  if (!application) throw makeError("Application not found", 404);

  const currentStatus = String(application.status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (currentStatus === applicationStatuses.APPROVED) {
    throw makeError(
      "Application is already approved and can't be updated",
      400,
    );
  }

  if (![applicationStatuses.UNDER_REVIEW, "pending"].includes(currentStatus)) {
    throw makeError(
      "Application status can only be updated if it's currently under review",
      400,
    );
  }

  let managerEmail;
  let temporaryPassword;

  if (status === applicationStatuses.APPROVED) {
    const phoneAlreadyUsed = await findOne({
      model: userModel,
      filter: { phone: application.phone },
    });

    managerEmail = await generateUniqueManagerEmail(application.firstName);
    temporaryPassword = makeTemporaryPassword();
    const hashedPassword = await hash({ password: temporaryPassword });

    const managerData = {
      firstName: application.firstName,
      lastName: application.lastName,
      email: managerEmail,
      password: hashedPassword,
      role: userRoles.HotelManager,
    };

    if (!phoneAlreadyUsed) {
      managerData.phone = application.phone;
    }

    const { data: manager } = await create({
      model: userModel,
      data: managerData,
    });

    await create({
      model: hotelModel,
      data: {
        owner: manager._id,
        status: hotelStatuses.SUSPENDED,

        name: application.hotelName,
        description: application.description,
        stars: application.stars,
        ...(!phoneAlreadyUsed && { phone: application.phone }),
        email: managerEmail,
        address: application.address,
        numberOfRooms: application.numberOfRooms,
      },
    });
  }

  application.status = status;
  application.reviewedAt = new Date();
  application.reviewedBy = adminId;

  if (status === applicationStatuses.REJECTED) {
    if (!rejectionReason?.trim())
      throw makeError("Rejection reason is required", 400);
    application.rejectionReason = rejectionReason.trim();
  } else {
    application.rejectionReason = null;
  }

  await application.save();

  if (status === applicationStatuses.APPROVED) {
    emailEventEmitter.emit(EMAIL_EVENTS.HOTEL_APPLICATION_APPROVED, {
      to: application.email,
      firstName: application.firstName,
      hotelName: application.hotelName,
      email: managerEmail,
      password: temporaryPassword,
    });
  }

  if (status === applicationStatuses.REJECTED) {
    emailEventEmitter.emit(EMAIL_EVENTS.HOTEL_APPLICATION_REJECTED, {
      to: application.email,
      firstName: application.firstName,
      hotelName: application.hotelName,
      rejectionReason: application.rejectionReason,
    });
  }

  return application;
};
