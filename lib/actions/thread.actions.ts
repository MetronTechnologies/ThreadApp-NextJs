'use server';

import {CreateThreadProps} from "@/types";
import {connectToDB} from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import {revalidatePath} from "next/cache";
import * as module from "module";

export async function createThread({text, author, communityId, path}: CreateThreadProps) {
    try {
        await connectToDB();
        const userId = author.trim();
        const createdThread = await Thread.create({
            text,
            author: userId,
            community: null,
            parentId: null
        });
        await User.findByIdAndUpdate(
            author, {
                $push: {
                    threads: createdThread._id
                }
            }
        );
        revalidatePath(path);
    } catch (e) {
        throw new Error(`Error when creating thread: ${e}`)
    }
}


export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    try {
        await connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;

        const threadQuery = Thread
            .find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "author",
                model: User,
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
    try{
        await connectToDB();
        const thread = await Thread
            .findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
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
                            select : '_id id name parentId image'
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
    try{
        await connectToDB();
        const originalThread = await Thread.findById(threadId).exec();
        if(!originalThread) {
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