import multer from "multer";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import fs from "fs";
import { hotelModel } from "../models/Hotel/hotel.model.js";
import { roomTypeModel } from "../models/RoomType/roomType.model.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = join(__dirname, "../uploads");

const APPLICATIONS_BASE_DIR = join(UPLOADS_ROOT, "hotel-applications");
const HOTELS_BASE_DIR       = join(UPLOADS_ROOT, "hotels");
const ROOM_TYPES_BASE_DIR   = join(UPLOADS_ROOT, "room-type-photos");

const toRelativePath = (p) =>
p.replaceAll("\\", "/").replace(/^.*\/uploads\//, "uploads/");
fs.mkdirSync(APPLICATIONS_BASE_DIR, { recursive: true });
fs.mkdirSync(HOTELS_BASE_DIR, { recursive: true });
fs.mkdirSync(ROOM_TYPES_BASE_DIR, { recursive: true });

const sanitizeSegment = (value = "") =>
  value
    .toString()
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

const buildFolderName = ({ id, name, fallbackName }) => {
  const safeId = sanitizeSegment(id) || crypto.randomUUID().split("-")[0];
  const safeName = sanitizeSegment(name) || sanitizeSegment(fallbackName) || "unknown";
  return `${safeId}_${safeName}`;
};

const documentsStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    if (!req.uploadDir) {
      const folderName = buildFolderName({
        id: crypto.randomUUID().split("-")[0],
        name: req.body.hotelName,
        fallbackName: "hotel_application",
      });
      req.uploadDir = path.join(APPLICATIONS_BASE_DIR, folderName);
    }
    fs.mkdirSync(req.uploadDir, { recursive: true });
    cb(null, req.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, and PNG files are allowed"));
  }
};

const imageFileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG and PNG image files are allowed"));
  }
};

export const uploadDocuments = multer({
  storage: documentsStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
}).array("documents");

const hotelPhotosStorage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    try {
      if (!req.uploadDir) {
        const hotelId = req.params.id || req.body.hotelId;
        const hotel = hotelId
          ? await hotelModel.findById(hotelId).select("name")
          : null;

        const folderName = buildFolderName({
          id: hotelId,
          name: hotel?.name,
          fallbackName: "hotel",
        });
        req.uploadDir = path.join(HOTELS_BASE_DIR, folderName);
      }

      fs.mkdirSync(req.uploadDir, { recursive: true });
      cb(null, req.uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const uploadHotelPhotos = multer({
  storage: hotelPhotosStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
}).array("photos");

const roomTypePhotosStorage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    try {
      if (!req.uploadDir) {
        const roomTypeId = req.params.id || req.body.roomTypeId;
        const roomType = roomTypeId
          ? await roomTypeModel.findById(roomTypeId).select("hotel")
          : null;

        const hotelId = roomType?.hotel?.toString() || req.body.hotel;
        const hotel = hotelId ? await hotelModel.findById(hotelId).select("name") : null;

        const folderName = buildFolderName({
          id: roomTypeId,
          name: hotel?.name,
          fallbackName: "room_type",
        });
        req.uploadDir = path.join(ROOM_TYPES_BASE_DIR, folderName);
      }

      fs.mkdirSync(req.uploadDir, { recursive: true });
      cb(null, req.uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const uploadRoomTypePhotos = multer({
  storage: roomTypePhotosStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
}).array("photos");

export { toRelativePath };
