/**
 * Zod validators for Organization Bodies API
 */

import { z } from 'zod';

// Forum validators
export const createForumSchema = z.object({
  forumCode: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  forumName: z.string().min(3).max(255),
  adminUserId: z.string().uuid(),
  establishedDate: z.coerce.date(),
});

export const updateForumSchema = z.object({
  forumName: z.string().min(3).max(255).optional(),
  establishedDate: z.coerce.date().optional(),
});

export const assignForumAdminSchema = z.object({
  newAdminUserId: z.string().uuid(),
});

// Area validators
export const createAreaSchema = z.object({
  forumId: z.string().uuid(),
  areaCode: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  areaName: z.string().min(3).max(255),
  adminUserId: z.string().uuid(),
  establishedDate: z.coerce.date(),
});

export const updateAreaSchema = z.object({
  areaName: z.string().min(3).max(255).optional(),
  establishedDate: z.coerce.date().optional(),
});

export const assignAreaAdminSchema = z.object({
  newAdminUserId: z.string().uuid(),
});

// Unit validators
export const createUnitSchema = z.object({
  areaId: z.string().uuid(),
  unitCode: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  unitName: z.string().min(3).max(255),
  adminUserId: z.string().uuid(),
  establishedDate: z.coerce.date(),
});

export const updateUnitSchema = z.object({
  unitName: z.string().min(3).max(255).optional(),
  establishedDate: z.coerce.date().optional(),
});

export const assignUnitAdminSchema = z.object({
  newAdminUserId: z.string().uuid(),
});

export type CreateForumDTO = z.infer<typeof createForumSchema>;
export type UpdateForumDTO = z.infer<typeof updateForumSchema>;
export type AssignForumAdminDTO = z.infer<typeof assignForumAdminSchema>;

export type CreateAreaDTO = z.infer<typeof createAreaSchema>;
export type UpdateAreaDTO = z.infer<typeof updateAreaSchema>;
export type AssignAreaAdminDTO = z.infer<typeof assignAreaAdminSchema>;

export type CreateUnitDTO = z.infer<typeof createUnitSchema>;
export type UpdateUnitDTO = z.infer<typeof updateUnitSchema>;
export type AssignUnitAdminDTO = z.infer<typeof assignUnitAdminSchema>;
