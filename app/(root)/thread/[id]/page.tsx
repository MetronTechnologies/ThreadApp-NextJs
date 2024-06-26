import React from 'react';
import ThreadCard from "@/components/cards/ThreadCard";
import {currentUser} from "@clerk/nextjs/server";
import {fetchUser} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import {fetchThreadById} from "@/lib/actions/thread.actions";
import Comments from "@/components/forms/Comments";

const Page = async ({params}: { params: { id: string } }) => {
    if (!params.id) return null;
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding');
    const thread = await fetchThreadById(params.id)
    return (
        <section className={'relative'}>
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ''}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
            <div className="mt-7">
                <Comments
                    threadId={thread.id}
                    currentUserImage={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className="mt-10">
                {
                    thread.children.map(
                        (child: any) => (
                            <ThreadCard
                                key={child._id}
                                id={child._id}
                                currentUserId={user?.id || ''}
                                parentId={child.parentId}
                                content={child.text}
                                author={child.author}
                                community={child.community}
                                createdAt={child.createdAt}
                                comments={child.children}
                                isComment
                            />
                        )
                    )
                }
            </div>
        </section>
    );
};

export default Page;