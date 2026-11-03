
import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import validateProductInput from "../utils/validateProductInput.js";
import {
  getCurrentOffer,
  getEffectivePrice,
} from "../services/pricingService.js";




const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 12)
    );

    const search = req.query.search?.trim();
    const category = req.query.category?.trim();

    const filter = {};

if (category) {
  filter.category = {
    $regex: `^${category}$`,
    $options: "i",
  };
}

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { materialType: { $regex: search, $options: "i" } },
      ];
    }

    const totalProducts = await Product.countDocuments(filter);

    // const products = await Product.find(filter)
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(limit);

const products = await Product.find(filter)
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

const offer = await getCurrentOffer();

const productsWithOfferPrice = products.map((product) => {
  const productData = product.toObject();

  return {
    ...productData,
    discountPrice: getEffectivePrice(product, offer),
    offerPercentage: offer.isActive ? offer.percentage : 0,
  };
});




    /////////////

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products: productsWithOfferPrice,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});





router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const page = Math.max(
        1,
        parseInt(req.query.page, 10) || 1
      );

      const limit = Math.min(
        50,
        Math.max(
          1,
          parseInt(req.query.limit, 10) || 10
        )
      );

      const search = String(req.query.search || "").trim();

      const sort = req.query.sort || "newest";

      const filter = {};

      if (search) {
        const escapedSearch = search.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

        filter.$or = [
          {
            title: {
              $regex: escapedSearch,
              $options: "i",
            },
          },
          {
            category: {
              $regex: escapedSearch,
              $options: "i",
            },
          },
          {
            materialType: {
              $regex: escapedSearch,
              $options: "i",
            },
          },
        ];
      }

      const sortOptions = {
        newest: { createdAt: -1, _id: -1 },
        oldest: { createdAt: 1, _id: 1 },
        priceLow: { discountPrice: 1, _id: 1 },
        priceHigh: { discountPrice: -1, _id: -1 },
        stockLow: { stock: 1, _id: 1 },
        stockHigh: { stock: -1, _id: -1 },
      };

      const selectedSort =
        sortOptions[sort] || sortOptions.newest;

      const [products, totalProducts] = await Promise.all([
        Product.find(filter)
          .sort(selectedSort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),

        Product.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        count: products.length,
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        products,
      });
    } catch (error) {
      console.error(
        "Admin products fetch failed:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin products",
      });
    }
  }
);

// GET trending products for homepage

// GET trending products for homepage
router.get("/trending", async (req, res) => {
  try {
    const products = await Product.find({
      isTrending: true,
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const offer = await getCurrentOffer();

    const productsWithOfferPrice = products.map((product) => ({
      ...product,
      discountPrice: getEffectivePrice(product, offer),
      offerPercentage: offer.isActive ? offer.percentage : 0,
    }));

    return res.status(200).json({
      success: true,
      count: productsWithOfferPrice.length,
      products: productsWithOfferPrice,
    });
  } catch (error) {
    console.error("Fetch trending products failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending products",
    });
  }
});
///////////////////////////


// GET all categories with their latest product image
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $match: {
          category: { $type: "string", $ne: "" },
        },
      },
      {
        $sort: {
          createdAt: -1,
          _id: -1,
        },
      },
      {
        $group: {
          _id: "$category",
          image: { $first: { $arrayElemAt: ["$images", 0] } },
          productCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          image: 1,
          productCount: 1,
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Fetch categories failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
});



/////////////////////////


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // res.status(200).json({
    //   success: true,
    //   product,
    // });



const offer = await getCurrentOffer();
const productData = product.toObject();

return res.status(200).json({
  success: true,
  product: {
    ...productData,
    discountPrice: getEffectivePrice(product, offer),
    offerPercentage: offer.isActive ? offer.percentage : 0,
  },
});





    ///////////////
  } catch (error) {
    console.error("Failed to fetch product:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});


//after midleware


router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {

    const validation = validateProductInput(req.body);

if (!validation.valid) {
  return res.status(400).json({
    success: false,
    message: validation.message,
  });
}

const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create product failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
});



router.get(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      console.error("Admin product fetch failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch product",
      });
    }
  }
);





router.patch("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const validation = validateProductInput(req.body, {
      partial: true,
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const finalActualPrice =
      req.body.actualPrice ?? existingProduct.actualPrice;

    const finalDiscountPrice =
      req.body.discountPrice ?? existingProduct.discountPrice;

    if (finalDiscountPrice > finalActualPrice) {
      return res.status(400).json({
        success: false,
        message: "Discount price cannot exceed actual price",
      });
    }

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       {
//   returnDocument: "after",
//   runValidators: true,
// }
//     );
const product=existingProduct.set(req.body);

await existingProduct.save();

return res.status(200).json({
  success: true,
  message: "Product updated successfully",
  product: existingProduct,
});




    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update product failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
});


router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    console.error("Delete product failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
});





export default router;
