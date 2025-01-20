const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig"); // Import Cloudinary config

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce-products", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Allow only specific formats
  },
});

const upload = multer({ storage: storage });

async function UploadProductController(req, res) {
  try {
    const sessionUserId = req.userId;

    // Check user permission
    if (!uploadProductPermission(sessionUserId)) {
      return res.status(403).json({
        message: "Permission denied",
        error: true,
        success: false,
      });
    }

    // Extract image URLs from uploaded files
    const uploadedFilePaths = req.files.map((file) => file.path);

    // Create product data object
    const productData = {
      ...req.body,
      productImage: uploadedFilePaths, // Store Cloudinary URLs in the database
    };

    // Save product to the database
    const newProduct = new productModel(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product uploaded successfully",
      error: false,
      success: true,
      data: savedProduct,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: err.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}
module.exports = { upload, UploadProductController };
