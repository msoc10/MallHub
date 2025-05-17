import { z } from "zod";

const fileSchema = z.union([z
    .instanceof(File) // Ensure the input is a File object
    .refine(
        (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
        "File size must be less than 5MB"
    )
    .refine(
        (file) => file.type.startsWith("image/"), // Ensure it's an image
        "Only image files are allowed"
    ).optional().nullable(), z.string().optional().nullable()]);


// #region Category
export const insertCategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
})

export const updateCategorySchema = insertCategorySchema.extend({
    id: z.number().min(1, 'Id is required'),
})
// #endregion 

// #region Product
export const insertProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    //category: z.coerce.number().min(1, 'Category is required'),
    category: z.coerce.number().min(1, "Category is required"),
    price: z.coerce.number().gt(0, 'Price is required'),
    image: fileSchema,
    is_pre_order: z.boolean().optional().default(false),
});

export const updateProductSchema = insertProductSchema.extend({
    id: z.number().min(1, 'Id is required'),
})
// #endregion 

// #region Store
export const insertStoreSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    section: z.coerce.number().min(1, "Section is required"),
    categories: z.coerce.number().min(1, "Category is required"),
    logo: fileSchema,
});

export const updateStoreSchema = insertStoreSchema.extend({
    id: z.number().min(1, "Id is required"),
});
// #endregion

// #region Sections
export const insertSectionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
});

export const updateSectionSchema = insertSectionSchema.extend({
    id: z.number().min(1, "Id is required"),
});
// #endregion


// #region profile
export const updateProfileSchema = z.object({
    address: z.string().min(1, "Address is required"),
    phone_number: z.string().min(1, "Phone Number is required"),
})
// #endregion


export const checkoutSchema = z.object({
    card_number: z.string().min(1, "Card Number is required").max(16),
    expiry_month: z.string().min(1, "Expiry Month is required"),
    expiry_year: z.string().min(1, "Expiry Year is required"),
    cvv: z.string().min(1, "CVV is required"),
})