import {ClerkProvider, UserButton} from "@clerk/nextjs";
import {fetchThreads} from "@/lib/actions/thread.actions";
import {threadResult} from "@/types";
import {currentUser} from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";


export default async function Home(){
    const user = await currentUser();

    const result = await fetchThreads(1, 30);

    const apiKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    return (
        <>
            <h1 className={'head-text text-left'}>
                Home
            </h1>
            <section className="mt-9 flex flex-col gap-10">
                {
                    result.threads.length === 0 ? (
                        <p className="no-result">No threads found</p>
                    ) : (
                        <>
                            {
                                result.threads.map(
                                    (thread) => (
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
                                    )
                                )
                            }
                        </>
                    )
                }
            </section>
        </>
    )
}




