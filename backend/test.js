
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import { releaseExpiredReservations } from "./services/reservationCleanup.js";

async function testReservationCleanup() {
  let testOrderId;

  try {
    await connectDB();

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const product = await Product.findOne({ stock: { $gte: 1 } }).session(session);

        if (!product) {
          throw new Error("No test product with stock available was found.");
        }

        const originalStock = product.stock;
        const quantity = 1;

        const reservedProduct = await Product.findOneAndUpdate(
          { _id: product._id, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { new: true, session }
        );

        if (!reservedProduct) {
          throw new Error("Could not reserve test product stock.");
        }

        const [order] = await Order.create(
          [
            {
              user: new mongoose.Types.ObjectId(),
              items: [
                {
                  product: product._id,
                  title: product.title,
                  image: product.images[0],
                  quantity,
                  price: product.discountPrice,
                },
              ],
              shippingAddress: {
                fullName: "Cleanup Test",
                phone: "9876543210",
                addressLine: "Test Address",
                city: "Test City",
                state: "Test State",
                postalCode: "000000",
                country: "India",
              },
              totalAmount: product.discountPrice,
              currency: "INR",
              paymentMethod: "razorpay",
              paymentStatus: "pending",
              orderStatus: "pending",
              inventoryStatus: "reserved",
              reservationExpiresAt: new Date(Date.now() - 60_000),
            },
          ],
          { session }
        );

        testOrderId = order._id;
        console.log("Test order created:", testOrderId.toString());
        console.log("Original stock:", originalStock);
      });
    } finally {
      await session.endSession();
    }

    await releaseExpiredReservations();

    const orderAfterCleanup = await Order.findById(testOrderId);
    const productAfterCleanup = await Product.findById(
      orderAfterCleanup.items[0].product
    );

    console.log("Order inventory status:", orderAfterCleanup.inventoryStatus);
    console.log("Order payment status:", orderAfterCleanup.paymentStatus);
    console.log("Stock after cleanup:", productAfterCleanup.stock);

    if (
      orderAfterCleanup.inventoryStatus !== "released" ||
      orderAfterCleanup.paymentStatus !== "failed"
    ) {
      throw new Error("FAIL: The expired reservation was not released.");
    }

    const stockAfterFirstCleanup = productAfterCleanup.stock;

    await releaseExpiredReservations();

    const productAfterSecondCleanup = await Product.findById(
      orderAfterCleanup.items[0].product
    );

    if (productAfterSecondCleanup.stock !== stockAfterFirstCleanup) {
      throw new Error("FAIL: Stock changed again during the second cleanup.");
    }

    console.log("PASS: Expired reservation released; second cleanup did not restore stock again.");
  } finally {
    if (testOrderId) {
      await Order.deleteOne({ _id: testOrderId });
      console.log("Temporary test order removed.");
    }

    await mongoose.disconnect();
  }
}

testReservationCleanup().catch((error) => {
  console.error("Reservation cleanup test failed:", error.message);
  process.exitCode = 1;
});
