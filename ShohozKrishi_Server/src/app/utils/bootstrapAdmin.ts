import bcrypt from 'bcryptjs';
import config from '../config';
import { User } from '../modules/user/user.model';

/**
 * One-time superadmin bootstrap for a fresh deployment.
 *
 * When BOOTSTRAP_SUPERADMIN_EMAIL and BOOTSTRAP_SUPERADMIN_PASSWORD are set and
 * the database has no superadmin yet, create one so the owner can sign in and
 * set the site up. It never touches an existing superadmin, so it is safe to
 * leave the variables in place — once a superadmin exists it does nothing.
 *
 * Mirrors the staff upsert in demo-data.ts: hash with bcryptjs + the configured
 * salt rounds, write with updateOne (the model's pre-save hashing is for save()).
 */
export async function bootstrapSuperadmin(): Promise<void> {
    const email = (process.env.BOOTSTRAP_SUPERADMIN_EMAIL || '').trim().toLowerCase();
    const password = process.env.BOOTSTRAP_SUPERADMIN_PASSWORD || '';
    if (!email || !password) return;

    try {
        const existing = await User.findOne({ role: 'superadmin', isDeleted: { $ne: true } }).select('_id').lean();
        if (existing) return;

        const hash = await bcrypt.hash(password, config.bcrypt_salt_rounds);
        await User.updateOne(
            { email },
            {
                $set: {
                    email,
                    password: hash,
                    firstName: 'Super',
                    lastName: 'Admin',
                    role: 'superadmin',
                    status: 'active',
                    isEmailVerified: true,
                    isDeleted: false,
                    updatedAt: new Date(),
                },
                $setOnInsert: { createdAt: new Date() },
            },
            { upsert: true },
        );
        console.log(`✅ Bootstrap superadmin ensured: ${email}`);
    } catch (err) {
        // Never block startup on this.
        console.error('Bootstrap superadmin failed:', err instanceof Error ? err.message : err);
    }
}
