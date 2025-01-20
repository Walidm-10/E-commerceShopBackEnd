const expressFileUpload = require("express-fileupload");
const path = require("path");
const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

// Middleware for file uploads
const fileUploadMiddleware = expressFileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "../../tmp"),
});

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

    // Check if files are included
    if (!req.files || !req.files.productImage) {
      return res.status(400).json({
        message: "No files uploaded",
        error: true,
        success: false,
      });
    }

    //
    const baseUrl = "https://e-commerceshopbackend-production.up.railway.app";

    const files = req.files.productImage;
    const uploadedFilePaths = [];

    // Handle single or multiple files
    const fileArray = Array.isArray(files) ? files : [files];

    for (const file of fileArray) {
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(__dirname, "../../uploads", uniqueFileName);

      // Move file to uploads directory
      await file.mv(uploadPath);

      //
      const fileUrl = `${baseUrl}/uploads/${uniqueFileName}`;
      uploadedFilePaths.push(fileUrl); //

      // uploadedFilePaths.push(uploadPath);
    }

    // Create product data object
    const productData = {
      ...req.body,
      productImage: uploadedFilePaths, // Add file paths
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

module.exports = { fileUploadMiddleware, UploadProductController };
