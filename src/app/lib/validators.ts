
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional().nullable(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional().nullable(),
  travelInterests: z.array(z.string()).optional(),
  visitedCountries: z.array(z.string()).optional(),
  currentLocation: z.string().max(200, "Location must be less than 200 characters").optional().nullable(),
  gallery: z.array(z.string().url("Invalid gallery image URL")).optional(),
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const travelPlanSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    destinationCountry: z.string().min(2, "Destination country is required"),
    destinationCity: z.string().min(2, "Destination city is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budgetMin: z.number().min(0, "Minimum budget must be 0 or greater"),
    budgetMax: z.number().min(0, "Maximum budget must be 0 or greater"),
    travelType: z.enum(["FRIENDS", "FAMILY", "SOLO", "COUPLES", "BUSINESS"], {
      message: "Please select a valid travel type",
    }),
    description: z.string().min(10, "Description must be at least 10 characters"),
    groupChatLink: z
      .union([z.string().url("Invalid URL"), z.literal("")])
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    contact: z.string().min(1, "Contact information is required"),
    images: z.array(z.string().url("Invalid image URL")).optional(),
    tags: z.array(z.string()).optional(),
    isPublic: z.boolean().default(true),
    maxParticipants: z.number().min(1, "Maximum participants must be at least 1"),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budgetMax"],
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// 👇 input = before defaults (role is optional)
// 👇 output = after defaults (role is required)
export type RegisterFormValues = z.input<typeof registerSchema>;
export type RegisterData = z.output<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type TravelPlanInput = z.input<typeof travelPlanSchema>;
