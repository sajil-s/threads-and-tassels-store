



const allowedFields = new Set([
  "title",
  "description",
  "category",
  "materialType",
  "color",
  "actualPrice",
  "discountPrice",
  "stock",
  "images",
  "isTrending",
]);

const requiredFields = [
  "title",
  "description",
  "category",
  "materialType",
  "color",
  "actualPrice",
  "discountPrice",
  "stock",
  "images",
];

const validateProductInput = (body, { partial = false } = {}) => {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return { valid: false, message: "Invalid request body" };
  }

  const keys = Object.keys(body);

  if (keys.some((key) => !allowedFields.has(key))) {
    return {
      valid: false,
      message: "Unknown product field supplied",
    };
  }

  if (keys.length === 0) {
    return {
      valid: false,
      message: "No product fields supplied",
    };
  }

  if (!partial) {
    const missing = requiredFields.filter(
      (field) => body[field] === undefined
    );

    if (missing.length > 0) {
      return {
        valid: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      };
    }
  }

  const textFields = [
    "title",
    "description",
    "category",
    "materialType",
    "color",
  ];

  for (const field of textFields) {
    if (body[field] !== undefined) {
      if (
        typeof body[field] !== "string" ||
        !body[field].trim()
      ) {
        return {
          valid: false,
          message: `${field} must be a non-empty string`,
        };
      }
    }
  }

  const numericFields = [
    "actualPrice",
    "discountPrice",
    "stock",
  ];

  for (const field of numericFields) {
    if (body[field] !== undefined) {
      if (
        typeof body[field] !== "number" ||
        !Number.isFinite(body[field]) ||
        body[field] < 0
      ) {
        return {
          valid: false,
          message: `${field} must be a non-negative number`,
        };
      }
    }
  }

  if (
    body.stock !== undefined &&
    !Number.isInteger(body.stock)
  ) {
    return {
      valid: false,
      message: "Stock must be a whole number",
    };
  }

  if (
    body.actualPrice !== undefined &&
    body.discountPrice !== undefined &&
    body.discountPrice > body.actualPrice
  ) {
    return {
      valid: false,
      message: "Discount price cannot exceed actual price",
    };
  }

  if (
    body.images !== undefined &&
    (
      !Array.isArray(body.images) ||
      body.images.length < 1 ||
      body.images.length > 3 ||
      body.images.some(
        (image) =>
          typeof image !== "string" ||
          !image.trim()
      )
    )
  ) {
    return {
      valid: false,
      message: "Provide between 1 and 3 valid image URLs",
    };
  }

  if (
    body.isTrending !== undefined &&
    typeof body.isTrending !== "boolean"
  ) {
    return {
      valid: false,
      message: "isTrending must be true or false",
    };
  }

  return { valid: true };
};

export default validateProductInput;






