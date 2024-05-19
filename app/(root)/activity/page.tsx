import React from 'react';
import {currentUser} from "@clerk/nextjs/server";
import {fetchUser, getActivity} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
    const user = await currentUser();
    if (!user) {
        return null;
    }
    const {id} = user;
    const userInfo  = await fetchUser(id);
    if(!userInfo?.onboarded){
        redirect('/onboarding');
    }
    const activities = await getActivity(userInfo._id);
    // console.log(activities)
    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>
            <section className="mt-10 flex flex-col gap-5">
                {
                    activities.length > 0 ? (
                        <>
                            {
                                activities.map(
                                    (activity) => (
                                        <Link
                                            href={`/thread/${activity.parentId}`}
                                            key={activity._id}
                                        >
                                            <article className={'activity-card'}>
                                                <Image
                                                    src={activity.author.image}
                                                    alt={'profile pic'}
                                                    width={20}
                                                    height={20}
                                                    className={'rounded-full object-cover'}
                                                />
                                                <p className={'!text-small-regular text-light-1'}>
                                                    <span className={'mr-1 text-primary-500'}>
                                                        {activity.author.name}
                                                    </span>
                                                    {" "}replied to your thread
                                                </p>
                                            </article>
                                        </Link>
                                    )
                                )
                            }
                        </>
                    ) : (
                        <p className={'!text-base-regular text-light-3'}>
                            No activity yet
                        </p>
                    )
                }
            </section>
        </section>
    );
};

export default Page;