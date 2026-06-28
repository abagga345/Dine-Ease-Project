// IMAGE DELETE
// IMAGE UPLOAD ROUTES LEFT

const cloudinary1 = require("cloudinary").v2;
import { logger } from "../../logger";

export const connect = () => {
  try {
    cloudinary1.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });
    logger.info("Cloudinary configured successfully");
  } catch (error) {
    logger.error({ err: error }, "Error configuring Cloudinary");
  }
};
