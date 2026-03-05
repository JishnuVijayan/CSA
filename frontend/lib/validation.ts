import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{3}-?\d{3}-?\d{4}$/, 'Invalid phone number'),
  streetAddress: z.string().min(1, 'Street address is required'),
  apartmentUnit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  dobDay: z.string().min(1, 'Day is required'),
  dobMonth: z.string().min(1, 'Month is required'),
  dobYear: z.string().min(1, 'Year is required'),
  reasonForApplication: z.string().min(1, 'Reason is required'),
  additionalInfo: z.string().optional(),
}).refine((data) => {
  // Validate date of birth is a valid date
  const day = parseInt(data.dobDay);
  const month = parseInt(data.dobMonth);
  const year = parseInt(data.dobYear);
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1;
}, {
  message: 'Invalid date of birth',
  path: ['dobDay'],
});
