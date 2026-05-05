import eventEmitter from "events";
import path from "path";
import { fileURLToPath } from "url";
import { signupEmailTemplate } from "../templates/auth/signup.template.js";
import { credentialsChangedEmailTemplate } from "../templates/auth/credentialsChanged.template.js";
import { reviewSubmittedEmailTemplate } from "../templates/reviews/reviewSubmitted.template.js";
import { applicationSubmittedEmailTemplate } from "../templates/hotelApplications/applicationSubmitted.template.js";
import { applicationApprovedEmailTemplate } from "../templates/hotelApplications/applicationApproved.template.js";
import { applicationRejectedEmailTemplate } from "../templates/hotelApplications/applicationRejected.template.js";
import { sendMail } from "../utils/security/mail.util.js";
import { EMAIL_EVENTS, CREDENTIAL_CHANGE_TYPES } from "../enums/email.enums.js";
import { logger } from "../utils/winston.utils.js";
import { logActorTypes } from "../enums/log.enums.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoPath = path.resolve(__dirname, "../assets/logo.jpeg");

export const emailEventEmitter = new eventEmitter();

emailEventEmitter.on(EMAIL_EVENTS.SIGNUP, async ({ email, firstName }) => {
  try {
    const htmlContent = signupEmailTemplate({ firstName });
    await sendMail({
      to: email,
      subject: "Welcome to Roomify!",
      html: htmlContent,
      attachments: [
        {
          filename: "logo.jpeg",
          path: logoPath,
          cid: "roomify-logo",
        },
      ],
    });
  } catch (err) {
    logger.error(`Failed to send signup email to ${email}: ${err.message}`, { action: "EMAIL_SEND_FAILED", actor: { type: logActorTypes.SYSTEM } });
  }
});

emailEventEmitter.on(EMAIL_EVENTS.CREDENTIALS_CHANGED, async ({ to, firstName, type, newEmail }) => {
  try {
    const htmlContent = credentialsChangedEmailTemplate({ firstName, type, newEmail });
    const subject =
      type === CREDENTIAL_CHANGE_TYPES.EMAIL
        ? "Your Roomify email was changed"
        : "Your Roomify password was changed";
    await sendMail({
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.jpeg",
          path: logoPath,
          cid: "roomify-logo",
        },
      ],
    });
  } catch (err) {
    logger.error(`Failed to send credentials-changed email to ${to}: ${err.message}`, { action: "EMAIL_SEND_FAILED", actor: { type: logActorTypes.SYSTEM } });
  }
});

emailEventEmitter.on(EMAIL_EVENTS.REVIEW_SUBMITTED, async ({ to, firstName, hotelName, rating, comment }) => {
  try {
    const htmlContent = reviewSubmittedEmailTemplate({ firstName, hotelName, rating, comment });
    await sendMail({
      to,
      subject: `Thanks for reviewing ${hotelName}`,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.jpeg",
          path: logoPath,
          cid: "roomify-logo",
        },
      ],
    });
  } catch (err) {
    logger.error(`Failed to send review-submitted email to ${to}: ${err.message}`, { action: "EMAIL_SEND_FAILED", actor: { type: logActorTypes.SYSTEM } });
  }
});

emailEventEmitter.on(EMAIL_EVENTS.HOTEL_APPLICATION_SUBMITTED, async ({ to, firstName, hotelName, stars, address, numberOfRooms }) => {
  try {
    const htmlContent = applicationSubmittedEmailTemplate({ firstName, hotelName, stars, address, numberOfRooms });
    await sendMail({
      to,
      subject: `We've received your Roomify application for ${hotelName}`,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.jpeg",
          path: logoPath,
          cid: "roomify-logo",
        },
      ],
    });
  } catch (err) {
    logger.error(`Failed to send application-submitted email to ${to}: ${err.message}`, { action: "EMAIL_SEND_FAILED", actor: { type: logActorTypes.SYSTEM } });
  }
});

emailEventEmitter.on(EMAIL_EVENTS.HOTEL_APPLICATION_APPROVED, async ({ to, firstName, hotelName, email, password }) => {
  try {
    const htmlContent = applicationApprovedEmailTemplate({
      firstName,
      hotelName,
      email,
      password,
    });
    await sendMail({
      to,
      subject: `Your Roomify application for ${hotelName} was approved`,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.jpeg",
          path: logoPath,
          cid: "roomify-logo",
        },
      ],
    });
  } catch (err) {
    logger.error(`Failed to send application-approved email to ${to}: ${err.message}`, {
      action: "EMAIL_SEND_FAILED",
      actor: { type: logActorTypes.SYSTEM },
    });
  }
});

emailEventEmitter.on(EMAIL_EVENTS.HOTEL_APPLICATION_REJECTED, async ({ to, firstName, hotelName, rejectionReason }) => {
  try {
    const htmlContent = applicationRejectedEmailTemplate({
      firstName,
      hotelName,
      rejectionReason,
    });
    await sendMail({
      to,
      subject: `Your Roomify application for ${hotelName} was not approved`,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.jpeg",
          path: logoPath,
          cid: "roomify-logo",
        },
      ],
    });
  } catch (err) {
    logger.error(`Failed to send application-rejected email to ${to}: ${err.message}`, {
      action: "EMAIL_SEND_FAILED",
      actor: { type: logActorTypes.SYSTEM },
    });
  }
});
