'use server';

import {CreateThreadProps} from "@/types";
import {connectToDB} from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import {revalidatePath} from "next/cache";
import * as module from "module";
import Community from "@/lib/models/community.model";

export async function createThread({text, author, communityId, path}: CreateThreadProps) {
    try {
        await connectToDB();
        const communityIdObject = await Community
            .findOne(
                {
                    id: communityId
                },
                {
                    _id: 1
                }
            )
            .exec();
        const userId = author.trim();
        const createdThread = await Thread.create({
            text,
            author: userId,
            community: communityIdObject,
            parentId: null
        });
        await User
            .findByIdAndUpdate(
                author, {
                    $push: {
                        threads: createdThread._id
                    }
                }
            )
            .exec();
        if (communityIdObject) {
            await Community
                .findByIdAndUpdate(
                    communityIdObject,
                    {
                        $push: {
                            threads: createdThread._id
                        },
                    }
                )
                .exec();
        }
        revalidatePath(path);
    } catch (e) {
        throw new Error(`Error when creating thread: ${e}`)
    }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
    const childThreads = await Thread
        .find(
            {
                parentId: threadId
            }
        )
        .exec();

    const descendantThreads = [];
    for (const childThread of childThreads) {
        const descendants = await fetchAllChildThreads(childThread._id);
        descendantThreads.push(childThread, ...descendants);
    }
    return descendantThreads;
}


export async function deleteThread(id: string, path: string): Promise<void> {
    try {
        await connectToDB();
        const mainThread = await Thread
            .findById(id)
            .populate("author community")
            .exec();

        if (!mainThread) {
            throw new Error("Thread not found");
        }
        const descendantThreads = await fetchAllChildThreads(id);
        const descendantThreadIds = [
            id,
            ...descendantThreads.map(
                (thread) => thread._id
            ),
        ];
        const uniqueAuthorIds = new Set(
            [
                ...descendantThreads.map(
                    (thread) => thread.author?._id?.toString()
                ),
                mainThread.author?._id?.toString(),
            ]
                .filter(
                    (id) => id !== undefined
                )
        );

        const uniqueCommunityIds = new Set(
            [
                ...descendantThreads.map(
                    (thread) => thread.community?._id?.toString()
                ),
                mainThread.community?._id?.toString(),
            ].filter(
                (id) => id !== undefined
            )
        );

        await Thread
            .deleteMany(
                {
                    _id: {
                        $in: descendantThreadIds
                    }
                }
            )
            .exec();

        await User
            .updateMany(
                {
                    _id: {
                        $in: Array.from(uniqueAuthorIds)
                    }
                },
                {
                    $pull: {
                        threads: {
                            $in: descendantThreadIds
                        }
                    }
                }
            )
            .exec();

        await Community
            .updateMany(
                {
                    _id: {
                        $in: Array.from(uniqueCommunityIds)
                    }
                },
                {
                    $pull: {
                        threads: {
                            $in: descendantThreadIds
                        }
                    }
                }
            )
            .exec();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete thread: ${error.message}`);
    }
}


export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    try {
        await connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;

        const threadQuery = Thread
            .find({parentId: {$in: [null, undefined]}})
            .sort({createdAt: "desc"})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "author",
                model: User,
            })
            .populate({
                path: "community",
                model: Community,
            })
            .populate({
                path: "children",
                populate: {
                    path: "author",
                    model: User,
                    select: "_id name parentId image",
                },
            });


        const threads = await threadQuery.exec();

        const totalPostsCount = await Thread
            .countDocuments({
                parentId: {
                    $in: [null, undefined]
                }
            })
        const isNext = totalPostsCount > skipAmount + threads.length;

        return {
            threads,
            isNext
        }

    } catch (e) {
        console.log("Error ---> " + e)
    }
}


export async function fetchThreadById(id: string) {
    try {
        await connectToDB();
        const thread = await Thread
            .findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }).exec();
        return thread;

    } catch (e: any) {
        throw new Error(`Error fetching thread: ${e.message}`)
    }
}


export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
    try {
        await connectToDB();
        const originalThread = await Thread.findById(threadId).exec();
        if (!originalThread) {
            throw new Error("Thread not found")
        }
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        });
        const saveCommentThread = await commentThread.save();
        originalThread.children.push(saveCommentThread._id);
        await originalThread.save();
        revalidatePath(path);
    } catch (e) {
        throw new Error(`Error reply to thread: ${e.message}`)
    }
}