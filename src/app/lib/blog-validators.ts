import { z } from "zod";

const urlReq = z.string().url({ message: "Valid URL required" });

// Strip HTML and collapse whitespace to validate real text from rich editor
const stripHtml = (s: string) =>
  (s || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const blogCreateSchema = z.object({
  title: z.string().min(3, "Title is required"),

  // Required + custom messages after stripping HTML
  content: z.string().superRefine((val, ctx) => {
    const text = stripHtml(val);
    if (!text) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Content is required",
      });
      return;
    }
    if (text.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Content is too short (min 10 characters)",
      });
    }
  }),

  excerpt: z.string().min(1, "Excerpt is required"),
  isFeatured: z.boolean().default(false),
  thumbnailUrl: urlReq,

  // tags OPTIONAL
  tags: z.array(z.string().trim().min(1)).optional(),

  // categories REQUIRED
  categories: z
    .array(z.string().trim().min(1))
    .min(1, "At least one category is required"),
});

// Update: all fields optional, but keep min rules when provided
export const blogUpdateSchema = blogCreateSchema.partial().extend({
  title: z.string().min(3).optional(),
});

export type BlogCreateFormValues = z.input<typeof blogCreateSchema>;
export type BlogCreateValues = z.output<typeof blogCreateSchema>;
export type BlogUpdateFormValues = z.input<typeof blogUpdateSchema>;
export type BlogUpdateValues = z.infer<typeof blogUpdateSchema>;
