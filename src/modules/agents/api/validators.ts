/**
 * Zod validators for Agents API
 */

import { z } from "zod";

// Enums
const RegistrationStatusEnum = z.enum([
  "Draft",
  "PendingApproval",
  "Approved",
  "Rejected",
]);

const AgentStatusEnum = z.enum([
  "Active",
  "Inactive",
  "Suspended",
  "Terminated",
]);

const GenderEnum = z.enum(["Male", "Female", "Other"]);

// Helper: Age validation (>= 18 years)
const dateOfBirthSchema = z.coerce.date().refine(
  (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
  },
  {
    message: "Agent must be at least 18 years old",
  }
);

// Agent code: alphanumeric with hyphens/underscores
const agentCodeSchema = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-zA-Z0-9_-]+$/);

// Start Agent Registration
export const startAgentRegistrationSchema = z.object({
  unitId: z.string().uuid(),
  areaId: z.string().uuid(),
  forumId: z.string().uuid(),
  agentCode: agentCodeSchema,
  firstName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100),
  dateOfBirth: dateOfBirthSchema,
  gender: GenderEnum,
  contactNumber: z.string().min(10).max(20),
  alternateContactNumber: z.string().min(10).max(20).optional(),
  email: z.string().email(),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  joinedDate: z.coerce.date(),
});

// Update Agent Draft
export const updateAgentDraftSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  dateOfBirth: dateOfBirthSchema.optional(),
  gender: GenderEnum.optional(),
  contactNumber: z.string().min(10).max(20).optional(),
  alternateContactNumber: z.string().min(10).max(20).optional(),
  email: z.string().email().optional(),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
});

// Update Agent (approved)
export const updateAgentSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  contactNumber: z.string().min(10).max(20).optional(),
  alternateContactNumber: z.string().min(10).max(20).optional(),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
});

// Terminate Agent
export const terminateAgentSchema = z.object({
  terminationReason: z.string().min(10).max(500),
});

// Type exports
export type StartAgentRegistrationDTO = z.infer<
  typeof startAgentRegistrationSchema
>;
export type UpdateAgentDraftDTO = z.infer<typeof updateAgentDraftSchema>;
export type UpdateAgentDTO = z.infer<typeof updateAgentSchema>;
export type TerminateAgentDTO = z.infer<typeof terminateAgentSchema>;
