import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "Name must be atleast 3 characters long." })
    .max(50, { message: "Name cannot be more than 50 characters" })
    .nonempty({ message: "Name is required" }),
  description: z
    .string({ invalid_type_error: "Description must be a string." })
    .max(100, { message: "Description cannot be more than 100 characters" })
    .optional(),
});

export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;
