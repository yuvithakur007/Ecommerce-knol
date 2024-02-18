const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.getUserCart = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, "knolskape");
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract and return the user's cart items
    const cartItems = user.cart;
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching user cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedTeken = jwt.verify(token, "knolskape");
    const userId = decodedTeken.userId;
    const user = await User.findById(userId);
    if (!user.cart.includes(req.body.id)) {
      user.cart.push(req.body.id);
      await user.save();

      res.status(200).json({
        ok: true,
        message: "Product added to cart",
      });
    } else {
      console.log("ID already present in the cart. Not adding again.");

      res.status(200).json({
        ok: true,
        message: "ID already present in the cart. Not adding again.",
      })
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
};


exports.deleteFromCart = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, "knolskape");
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    const itemId = req.params.id; 

    // Check if the user's cart includes the item
    const index = user.cart.indexOf(itemId);
    if (index !== -1) {
      user.cart.splice(index, 1);
      await user.save();
      res.status(200).json({ ok: true, message: "Product removed from cart"});
    } else {
      res.status(404).json({ ok: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
};









// Place order (move all items from cart to orders)
// exports.placeOrder = async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     const decodedToken = jwt.verify(token, "knolskape");
//     const userId = decodedToken.userId;
//     // Find the user by ID
//     const user = await User.findById(userId);

//     // Move all items from cart to orders
//     user.orders = user.orders.concat(user.cart);
//     user.cart = [];
//     await user.save();
    
//     res.json({ message: 'Order placed successfully' });
//   } catch (error) {
//     console.error('Error placing order:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };