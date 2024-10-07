import {
    AGE_BRACKETS,
    DEGREES,
    GENDERS,
    STUDENT_STATUSES,
    STUDENT_TYPES,
} from '@/constants/student-info';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const memberTable = sqliteTable('members', {
    id: text('id')
        .$defaultFn(() => nanoid())
        .primaryKey(),

    email: text('email').notNull().unique(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),

    passwordHash: text('password_hash').notNull(),
    provider: text('provider').default('credentials'),
    providerId: text('provider_id'),

    studentStatus: text('student_status', { enum: STUDENT_STATUSES }),
    studentId: text('student_id'),
    gender: text('gender', { enum: GENDERS }),
    ageBracket: text('age_bracket', { enum: AGE_BRACKETS }),
    degree: text('degree', { enum: [...DEGREES, ''] }),
    studentType: text('student_type', { enum: [...STUDENT_TYPES, ''] }),

    emailPreferences: text('email_preferences', { mode: 'json' }),

    membershipExpiresAt: integer('membership_expires_at', { mode: 'timestamp' }),

    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: text('updated_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});
