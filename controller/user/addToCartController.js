const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req?.body;
    const { quantity } = req?.body;
    const currentUser = req.userId;

    const isProductAvailable = await addToCartModel.findOne({
      userId: currentUser,
      productId: productId,
    });

    console.log("isProductAvailabl   ", isProductAvailable);

    if (isProductAvailable) {
      return res.json({
        message: "Already exits in Add to cart",
        success: false,
        error: true,
        product: isProductAvailable,
      });
    }

    const payload = {
      productId: productId,
      quantity: quantity,
      userId: currentUser,
    };

    const newAddToCart = new addToCartModel(payload);
    const saveProduct = await newAddToCart.save();

    return res.json({
      data: saveProduct,
      message: "Product Added in Cart",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = addToCartController;
