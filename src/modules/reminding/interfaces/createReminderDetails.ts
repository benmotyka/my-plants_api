import { ReminderType } from '@prisma/client';

export interface CreateReminderDetails {
  frequencyDays: number;
  type: ReminderType;
  userId: string;
  plantId: string;
}
