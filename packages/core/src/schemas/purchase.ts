import { z } from 'zod'

export const PurchaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  templateId: z.string(),
  amount: z.number().int().nonnegative(),
  currency: z.string().length(3),
  stripePaymentId: z.string(),
  licenseKey: z.string(),
  createdAt: z.date(),
})

export type Purchase = z.infer<typeof PurchaseSchema>
