
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import {
  getCurrentOffer,
  getEffectivePrice,
} from "../services/pricingService.js";




const router = express.Router();

router.post("/checkout", authMiddleware, async (req, res) => {
  const reservedProducts = [];
  let createdOrder = null;

  try {
    const {
      checkoutType,
      productId,
      quantity,
      shippingAddress,
    } = req.body;

    // Validate checkout type.
    if (!["cart", "buyNow"].includes(checkoutType)) {
      return res.status(400).json({
        success: false,
        message: 'checkoutType must be "cart" or "buyNow"',
      });
    }

    // Validate Buy Now input.
    if (
      checkoutType === "buyNow" &&
      (
        typeof productId !== "string" ||
        !mongoose.isValidObjectId(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid productId and positive integer quantity are required",
      });
    }

    // Validate shipping address.
    if (
      !shippingAddress ||
      typeof shippingAddress !== "object" ||
      Array.isArray(shippingAddress)
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const addressFields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    for (const field of addressFields) {
      if (
        typeof shippingAddress[field] !== "string" ||
        !shippingAddress[field].trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const cleanAddress = Object.fromEntries(
      addressFields.map((field) => [
        field,
        shippingAddress[field].trim(),
      ])
    );
    //////////////



    const country = cleanAddress.country
  .toLowerCase()
  .replace(/[.\s]/g, "");

const isIndia = [
  "india",
  "india,",
  "bharat",
].includes(country);

if (!isIndia) {
  return res.status(400).json({
    success: false,
    message:
      "International shipping is not available through website checkout. Please contact us on WhatsApp to place your order.",
    whatsappNumber: "917356854339",
  });
}


    // 4. Get checkout items from the database.
    let cartItems;

    if (checkoutType === "buyNow") {
      cartItems = [{ product: productId, quantity }];
    } else {
      const user = await User.findById(req.user.userId).select("cart");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.cart.length) {
        return res.status(400).json({
          success: false,
          message: "Your cart is empty",
        });
      }

      cartItems = user.cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));
    }

    // 5. Validate products and calculate prices from MongoDB.
    const orderItems = [];
    let totalAmount = 0;
    const offer = await getCurrentOffer();

    for (const item of cartItems) {
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "A product in your checkout could not be found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`,
        });
      }

    const price = getEffectivePrice(product, offer);

orderItems.push({
  product: product._id,
  title: product.title,
  image: product.images[0],
  quantity: item.quantity,
  price,
});

totalAmount += price * item.quantity;
}

    // 6. Ensure the amount is valid for Razorpay.
    const amountInPaise = Math.round(totalAmount * 100);

    if (
      !Number.isSafeInteger(amountInPaise) ||
      amountInPaise <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // 7. Reserve stock atomically, one product at a time.
    // A reservation succeeds only if sufficient stock remains.
    for (const item of orderItems) {
      const reservedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      if (!reservedProduct) {
        throw new Error(
          `STOCK_UNAVAILABLE:${item.title}`
        );
      }

      reservedProducts.push({
        productId: item.product,
        quantity: item.quantity,
      });
    }

    // 8. Save the pending order in MongoDB.
    createdOrder = await Order.create({
      user: req.user.userId,
      items: orderItems,
      shippingAddress: cleanAddress,
      totalAmount,
      currency: "INR",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      orderStatus: "pending",
      inventoryStatus: "reserved",
      reservationExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    // 9. Create the corresponding Razorpay test/live order.
    // The amount comes from our server calculation, never the client.
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: createdOrder._id.toString(),
    });

    createdOrder.razorpayOrderId = razorpayOrder.id;
    await createdOrder.save();

    // 10. Return only the information needed by the frontend.
    return res.status(201).json({
      success: true,
      message: "Order created. Payment is pending.",
      order: {
        id: createdOrder._id,
        items: createdOrder.items,
        totalAmount: createdOrder.totalAmount,
        currency: createdOrder.currency,
        paymentStatus: createdOrder.paymentStatus,
        orderStatus: createdOrder.orderStatus,
        inventoryStatus: createdOrder.inventoryStatus,
        razorpayOrderId: razorpayOrder.id,
        razorpayAmount: razorpayOrder.amount,
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    // 11. If any step fails, restore stock reserved by this request.
    for (const item of reservedProducts.reverse()) {
      try {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } }
        );
      } catch (rollbackError) {
        console.error(
          "CRITICAL: Stock rollback failed:",
          item.productId.toString(),
          rollbackError.message
        );
      }
    }

    if (createdOrder) {
      try {
        await Order.deleteOne({ _id: createdOrder._id });
      } catch (cleanupError) {
        console.error(
          "Order cleanup failed:",
          cleanupError.message
        );
      }
    }

    if (error.message.startsWith("STOCK_UNAVAILABLE:")) {
      return res.status(409).json({
        success: false,
        message: "Stock changed during checkout. Please refresh your cart and try again.",
      });
    }

    console.error("Checkout failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not create checkout order",
    });
  }
});


/////////////////


router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 1. Validate the callback fields.
    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid Razorpay payment details are required",
      });
    }

    // 2. Find the order belonging to this customer.
    const order = await Order.findOne({
      user: req.user.userId,
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 3. Verify the signature using the order ID stored in our DB.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest();

    const receivedSignature = Buffer.from(
      razorpay_signature,
      "hex"
    );

    if (
      expectedSignature.length !== receivedSignature.length ||
      !crypto.timingSafeEqual(
        expectedSignature,
        receivedSignature
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // 4. An already verified payment must not change stock again.
    if (order.paymentStatus === "paid") {
      if (order.razorpayPaymentId !== razorpay_payment_id) {
        return res.status(409).json({
          success: false,
          message: "Order has already been paid with a different payment",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment was already verified",
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      });
    }

   if (
  order.paymentStatus !== "pending" ||
  order.inventoryStatus !== "reserved" ||
  !order.reservationExpiresAt ||
  order.reservationExpiresAt <= new Date()
) {
  return res.status(409).json({
    success: false,
    message: "This order has expired or is not eligible for payment confirmation",
  });
}

    // 5. Fetch the payment from Razorpay to verify its actual status.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== order.razorpayOrderId ||
      payment.amount !== Math.round(order.totalAmount * 100) ||
      payment.currency !== order.currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details do not match the order",
      });
    }

    // Only a captured payment is treated as paid.
    if (payment.status !== "captured") {
      return res.status(409).json({
        success: false,
        message: "Payment is not captured yet",
        paymentStatus: payment.status,
      });
    }

    // 6. Atomically commit this payment only once.
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        paymentStatus: "pending",
        inventoryStatus: "reserved",
        reservationExpiresAt: { $gt: new Date() },
      },
      {
        $set: {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          inventoryStatus: "committed",
          razorpayPaymentId: razorpay_payment_id,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      // Another request may have completed verification first.
      const latestOrder = await Order.findById(order._id);

      if (
        latestOrder?.paymentStatus === "paid" &&
        latestOrder.razorpayPaymentId === razorpay_payment_id
      ) {
        return res.status(200).json({
          success: true,
          message: "Payment was already verified",
          orderId: latestOrder._id,
          paymentStatus: latestOrder.paymentStatus,
        });
      }

      return res.status(409).json({
        success: false,
        message: "Order changed during payment verification",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed",
      orderId: updatedOrder._id,
      paymentStatus: updatedOrder.paymentStatus,
      orderStatus: updatedOrder.orderStatus,
    });
  } catch (error) {
    console.error("Payment verification failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Payment verification could not be completed",
    });
  }
});





router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 5);

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 20",
      });
    }

    const filter = {
      user: req.user.userId,
    };

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "_id items totalAmount currency paymentStatus orderStatus createdAt"
        )
        .lean(),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Customer order history failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve your orders",
    });
  }
});



router.get(
  "/my-orders/:orderId",
  authMiddleware,
  async (req, res) => {
    try {
      const { orderId } = req.params;

      if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      const order = await Order.findOne({
        _id: orderId,
        user: req.user.userId,
      })
       .select(
  "_id items shippingAddress totalAmount currency paymentMethod paymentStatus orderStatus deliveryPartner trackingId createdAt"
)
        .lean();

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Customer order details failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not retrieve order details",
      });
    }
  }
);






//admin apis

router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination values",
      });
    }

    const filter = {};

    const search = String(req.query.search || "").trim();
    const startDate = String(req.query.startDate || "").trim();
    const endDate = String(req.query.endDate || "").trim();

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (
      (startDate && !datePattern.test(startDate)) ||
      (endDate && !datePattern.test(endDate)) ||
      (startDate && Number.isNaN(Date.parse(startDate))) ||
      (endDate && Number.isNaN(Date.parse(endDate))) ||
      (startDate && endDate && startDate > endDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    // Filter by India-local calendar dates.
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(
          `${startDate}T00:00:00+05:30`
        );
      }

      if (endDate) {
        const exclusiveEnd = new Date(
          `${endDate}T00:00:00+05:30`
        );

        exclusiveEnd.setUTCDate(
          exclusiveEnd.getUTCDate() + 1
        );

        filter.createdAt.$lt = exclusiveEnd;
      }
    }

    if (search) {
      const escaped = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const matchingUsers = await User.find({
        fullName: {
          $regex: escaped,
          $options: "i",
        },
      })
        .select("_id")
        .lean();

      const userIds = matchingUsers.map(
        (user) => user._id
      );

      const idQuery = search.replace(/^#/, "");

      filter.$or = [
        { user: { $in: userIds } },
      ];

      if (mongoose.isValidObjectId(idQuery)) {
        filter.$or.push({ _id: idQuery });
      }
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate("user", "fullName email phone")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          "user items totalAmount currency paymentStatus orderStatus inventoryStatus createdAt"
        )
        .lean(),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        limit,
      },
    });
  } catch (error) {
    console.error(
      "Admin order listing failed:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Could not retrieve orders",
    });
  }
});



// router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const page = Number.parseInt(req.query.page, 10) || 1;
//     const limit = Number.parseInt(req.query.limit, 10) || 10;

//     if (
//       !Number.isInteger(page) ||
//       !Number.isInteger(limit) ||
//       page < 1 ||
//       limit < 1 ||
//       limit > 50
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Page must be positive and limit must be between 1 and 50",
//       });
//     }

//     const skip = (page - 1) * limit;

//     const [orders, totalOrders] = await Promise.all([
//       Order.find()
//         .populate("user", "fullName email phone")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .select(
//           "user items totalAmount currency paymentStatus orderStatus inventoryStatus createdAt"
//         )
//         .lean(),
//       Order.countDocuments(),
//     ]);

//     return res.status(200).json({
//       success: true,
//       orders,
//       pagination: {
//         totalOrders,
//         currentPage: page,
//         totalPages: Math.ceil(totalOrders / limit),
//         limit,
//       },
//     });
//   } catch (error) {
//     console.error("Admin order listing failed:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Could not retrieve orders",
//     });
//   }
// });

////////////


router.get(
  "/admin/:orderId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { orderId } = req.params;

      if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      const order = await Order.findById(orderId)
        .populate("user", "fullName email phone")
        .populate("items.product", "title images category materialType")
        .lean();

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Admin order details failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not retrieve order details",
      });
    }
  }
);



router.put(
  "/admin/:orderId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const {
        orderStatus,
        deliveryPartner,
        trackingId,
        adminNote,
      } = req.body;

      if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      const allowedStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ];

      if (
        orderStatus !== undefined &&
        !allowedStatuses.includes(orderStatus)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      if (
        deliveryPartner !== undefined &&
        (typeof deliveryPartner !== "string" ||
          deliveryPartner.trim().length > 100)
      ) {
        return res.status(400).json({
          success: false,
          message: "Delivery partner must be text with at most 100 characters",
        });
      }

      if (
        trackingId !== undefined &&
        (typeof trackingId !== "string" ||
          trackingId.trim().length > 100)
      ) {
        return res.status(400).json({
          success: false,
          message: "Tracking ID must be text with at most 100 characters",
        });
      }

      if (
        adminNote !== undefined &&
        (typeof adminNote !== "string" ||
          adminNote.trim().length > 1000)
      ) {
        return res.status(400).json({
          success: false,
          message: "Admin note must be text with at most 1000 characters",
        });
      }

      const updates = {};

      if (orderStatus !== undefined) {
        updates.orderStatus = orderStatus;
      }

      if (deliveryPartner !== undefined) {
        updates.deliveryPartner = deliveryPartner.trim();
      }

      if (trackingId !== undefined) {
        updates.trackingId = trackingId.trim();
      }

      if (adminNote !== undefined) {
        updates.adminNote = adminNote.trim();
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Provide at least one field to update",
        });
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: updates },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("user", "fullName email phone")
        .populate("items.product", "title images category materialType")
        .lean();

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order updated successfully",
        order,
      });
    } catch (error) {
      console.error("Admin order update failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not update order",
      });
    }
  }
);



export default router;
