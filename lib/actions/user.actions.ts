'use server';

import {connectToDB} from "@/lib/mongoose.ts";
import User from "@/lib/models/user.model";
import {revalidatePath} from "next/cache";
import {FetchUserProps, UpdateParams, UserModel} from "@/types";
import {parse} from "node:url";
import Thread from "@/lib/models/thread.model";
import {FilterQuery} from "mongoose";
import Community from "@/lib/models/community.model";


export async function fetchUser(userId: string) {
    try {
        await connectToDB();
        let user = await User
            .findOne({
                id: userId
            })
            .populate({
                path: "communities",
                model: Community,
            })
            .exec();
        return JSON.parse(JSON.stringify(user));
    } catch (e) {
        throw new Error(`Failed to fetch user : ${e.message}`)
    }
}


export async function fetchUserThreads(userId: string) {
    try {
        await connectToDB();
        return await User
            .findOne({id: userId})
            .populate({
                path: 'threads',
                model: Thread,
                populate: [
                    {
                        path: "community",
                        model: Community,
                        select: "name id image _id",
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: {
                            path: "author",
                            model: User,
                            select: "name image id",
                        },
                    },
                ],
            })
            .exec();
    } catch (e) {
        throw new Error(`Failed to fetch user threads: ${e.message}`)
    }
}


export async function fetchUsers({
                                     userId,
                                     searchString = "",
                                     pageNumber = 1,
                                     pageSize = 20,
                                     sortBy = 'desc'
                                 }: FetchUserProps) {
    try {
        await connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize
        const regex = new RegExp(searchString!, "i");
        const query: FilterQuery<typeof User> = {
            id: {$ne: userId}
        }
        if (searchString!.trim() !== '') {
            query.$or = [
                {username: {$regex: regex}},
                {name: {$regex: regex}}
            ]
        }
        const sortOptions = {createdAt: sortBy};
        const usersQuery = User
            .find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        const totalUsersCount = await User.countDocuments(query);
        const users = await usersQuery.exec();
        const isNext = totalUsersCount > skipAmount + users.length;
        return {
            users, isNext
        }
    } catch (e) {
        throw new Error(`Failed to fetch users: ${e.message}`)
    }
}


export async function getActivity(userId: string) {
    try {
        await connectToDB();
        const userThreads = await Thread
            .find(
                {
                    author: userId
                }
            )
            .exec();

        let childrenThreads = [];
        userThreads.forEach(
            (userThread) => {
                let children = userThread.children;
                children.forEach(
                    (child) => {
                        childrenThreads.push(child);
                    }
                )
                return childrenThreads;
            }
        )


        /*As at the time of writing this code, i didn't fully understand the power of reduce in js. I did not fully know how to use it to better my code. But this few line of codes in this comment gives the same result as the foreach code above.


        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

         */

        const replies = await Thread
            .find({
                _id: {
                    $in: childrenThreads
                },
                author: {
                    $ne: userId
                },
            }).populate({
                path: "author",
                model: User,
                select: "name image _id",
            }).exec();
        return replies;
    } catch (e) {
        throw new Error(`Failed to fetch user's activity: ${e.message}`)
    }
}


export async function updateUser({userId, bio, name, path, username, image}: Params): Promise<void> {
    try {
        await connectToDB();
        await User
            .findOneAndUpdate(
                {
                    id: userId
                },
                {
                    username: username.toLowerCase(),
                    name,
                    bio,
                    image,
                    onboarded: true,
                },
                {
                    upsert: true
                }
            )
            .exec();

        if (path === "/profile/edit") {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}

