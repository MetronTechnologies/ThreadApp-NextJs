import React from 'react';
import {currentUser, User} from "@clerk/nextjs/server";
import {fetchUser} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import PostThread from "@/components/forms/PostThread";

const Page = async () => {
    const user = await currentUser();
    const cUser = JSON.stringify(user);
    const finalUser:User = JSON.parse(cUser);

    if (!user) {
        return null;
    }
    const userInfo  = await fetchUser(finalUser.id);
    if(!userInfo?.onboarded){
        redirect('/onboarding');
    }
    return (
        <>
            <h1 className={'head-text'}>Create Thread</h1>
            <PostThread
                userId={userInfo.id}
            />
        </>

    );
};

export default Page;