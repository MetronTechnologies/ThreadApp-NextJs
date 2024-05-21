import * as z from 'zod';

export const CommunityValidation = z.object({
    community_photo: z.string().url().nonempty(),
    name: z.string().min(3, {message: 'MINIMUM OF 3 CHARACTERS'}).max(30),
    slug: z.string().min(3, {message: 'MINIMUM OF 3 CHARACTERS'}).max(30),
    bio: z.string().min(3, {message: 'MINIMUM OF 3 CHARACTERS'}).max(1000),
});