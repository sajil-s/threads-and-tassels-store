
import cron from "node-cron";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

let cleanupRunning = false;

export async function releaseExpiredReservations() {
  if (cleanupRunning) return;

  cleanupRunning = true;
  const now = new Date();

  try {
    const expiredOrders = await Order.find({
      paymentStatus: "pending",
      inventoryStatus: "reserved",
      reservationExpiresAt: { $lte: now, $ne: null },
    }).select("_id");

    for (const expiredOrder of expiredOrders) {
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          // Claim the order only if it is still eligible for release.
          const order = await Order.findOneAndUpdate(
            {
              _id: expiredOrder._id,
              paymentStatus: "pending",
              inventoryStatus: "reserved",
              reservationExpiresAt: { $lte: now, $ne: null },
            },
            {
              $set: {
                inventoryStatus: "released",
                orderStatus: "cancelled",
                paymentStatus: "failed",
              },
            },
            {
              new: true,
              session,
            }
          );

          // Another process may have handled this order already.
          if (!order) return;

          // Restore all item quantities in the same transaction.
          for (const item of order.items) {
            const result = await Product.updateOne(
              { _id: item.product },
              { $inc: { stock: item.quantity } },
              { session }
            );

            if (result.matchedCount !== 1) {
              throw new Error(
                `Product not found while restoring stock: ${item.product}`
              );
            }
          }
        });

        console.log(
          `Reservation cleanup checked order ${expiredOrder._id}`
        );
      } catch (error) {
        console.error(
          `Reservation cleanup failed for order ${expiredOrder._id}:`,
          error.message
        );
      } finally {
        await session.endSession();
      }
    }
  } catch (error) {
    console.error("Reservation cleanup job failed:", error.message);
  } finally {
    cleanupRunning = false;
  }
}

export function startReservationCleanup() {
  cron.schedule("* * * * *", releaseExpiredReservations);
  console.log("Reservation cleanup scheduled every minute.");
}
