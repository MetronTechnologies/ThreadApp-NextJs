import React from 'react';
import {currentUser, User} from "@clerk/nextjs/server";
import {fetchUser} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import ProfileHeader from "@/components/shared/ProfileHeader";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {profileTabs} from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

const Page = async ({params} : {params: {id: string}}) => {
    const user = await currentUser();
    const cUser = JSON.stringify(user);
    const finalUser:User = JSON.parse(cUser);

    if (!user) {
        return null;
    }
    const userInfo  = await fetchUser(params.id);
    if(!userInfo?.onboarded){
        redirect('/onboarding');
    }
    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />
            <div className="mt-9">
                <Tabs defaultValue={'threads'} className={'w-full'}>
                    <TabsList className={'tab'}>
                        {
                            profileTabs.map(
                                (tab) => (
                                    <TabsTrigger
                                        value={tab.value}
                                        key={tab.label}
                                        className={'tab'}
                                    >
                                        <Image
                                            src={tab.icon}
                                            alt={tab.label}
                                            width={24}
                                            height={24}
                                            className={'object-contain'}
                                        />
                                        <p className={'max-sm:hidden'}>
                                            {tab.label}
                                        </p>
                                        {
                                            tab.label === 'Threads' && (
                                                <p className={'ml-1 rounded-sm px-2 py-1 bg-light-4 !text-tiny-medium text-light-2'}>
                                                    {userInfo?.threads.length}
                                                </p>
                                            )
                                        }
                                    </TabsTrigger>
                                )
                            )
                        }
                    </TabsList>
                    {
                        profileTabs.map(
                            (ptab) => (
                                <TabsContent
                                    value={ptab.value}
                                    key={`content-${ptab.label}`}
                                    className={'w-full text-light-1'}
                                >
                                    <ThreadsTab
                                        currentUserId={user.id}
                                        accountId={userInfo.id}
                                        accountType={"User"}
                                    />
                                </TabsContent>
                            )
                        )
                    }
                </Tabs>
            </div>
        </section>
    );
};

export default Page;