
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address")
      .refine(
        (email) => {
          // More strict email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) return false;
          
          // Check for valid domain structure
          const parts = email.split("@");
          if (parts.length !== 2) return false;
          
          const [localPart, domain] = parts;
          // Local part should not be empty and domain should have at least one dot
          if (!localPart || localPart.length === 0) return false;
          if (!domain || !domain.includes(".")) return false;
          
          // Domain should have valid TLD (at least 2 characters after last dot)
          const domainParts = domain.split(".");
          const tld = domainParts[domainParts.length - 1];
          if (!tld || tld.length < 2) return false;
          
          return true;
        },
        {
          message: "Please enter a valid email address (e.g., user@example.com)",
        }
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true; // Allow empty for optional field
        return val.length >= 2;
      },
      {
        message: "Name must be at least 2 characters",
      }
    )
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        return val.length <= 100;
      },
      {
        message: "Name must be less than 100 characters",
      }
    ),
  phone: z
    .string()
    .nullish()
    .superRefine((val, ctx) => {
      if (!val || val.trim() === "") return; // Allow empty/null
      
      // Remove common formatting
      const cleaned = val.replace(/[\s\-\(\)]/g, "");
      
      // E.164 format: +[country code][number] (7-15 digits after +)
      const phoneRegex = /^\+[1-9]\d{6,14}$/;
      if (!phoneRegex.test(cleaned)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be in international format (e.g., +1234567890 or +8801700000000)",
        });
      }
    }),
  image: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true; // Allow empty/null
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Image must be a valid URL",
      }
    ),
  bio: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Allow null/empty
        if (val.length > 1000) return false;
        return true;
      },
      {
        message: "Bio must be less than 1000 characters",
      }
    ),
  travelInterests: z.array(z.string()).optional(),
  visitedCountries: z.array(z.string()).optional(),
  currentLocation: z.string().min(1, "Current location is required"),
  gallery: z
    .array(
      z
        .string()
        .refine(
          (val) => {
            try {
              new URL(val);
              return true;
            } catch {
              return false;
            }
          },
          {
            message: "Gallery image must be a valid URL",
          }
        )
    )
    .max(10, "Maximum 10 gallery images allowed")
    .optional(),
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

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
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
// RegisterData excludes confirmPassword as it's only for validation
export type RegisterFormValues = z.input<typeof registerSchema>;
export type RegisterData = Omit<z.output<typeof registerSchema>, "confirmPassword">;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type TravelPlanInput = z.input<typeof travelPlanSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
