const addToCartModel = require("../../models/cartProduct");

const deleteItemsCart = async (req, res) => {
  try {
    const currentUserId = req.userId;
    console.log(currentUserId);
    const deleteProduct = await addToCartModel.deleteMany({
      userId: currentUserId,
    });

    res.json({
      message: "Products Deleted From Cart",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = deleteItemsCart;
