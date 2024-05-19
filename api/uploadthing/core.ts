import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";
import {currentUser} from "@clerk/nextjs/server";

const f = createUploadthing();

const getUser = async () => await currentUser();

export const ourFileRouter = {
    media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async ({ req, res }) => {
            const user = await getUser();
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("file url", file.url);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;