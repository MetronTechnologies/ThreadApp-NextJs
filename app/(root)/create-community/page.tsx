
import React, {ChangeEvent, useState} from 'react';
import {redirect, usePathname, useRouter} from "next/navigation";
import {useUploadThing} from "@/lib/uploadThing";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserValidation} from "@/lib/validations/user";
import {CommunityValidation} from "@/lib/validations/community";
import * as z from "zod";
import {isBase64Image} from "@/lib/utils";
import {fetchUser, updateUser} from "@/lib/actions/user.actions";
import {currentUser} from "@clerk/nextjs/server";
import AccountProfile from "@/components/forms/AccountProfile";
import CommunityCreation from "@/components/forms/CommunityCreation";
import {UserProps} from "@/types";

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
    return (
        <main className={'mx-auto flex max-w-3xl flex-col justify-start'}>
            <h1 className={'head-text'}>Community Creation</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Create a community. Others can also join
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <CommunityCreation
                    user={userInfo}
                />
            </section>
        </main>
    )
};

export default Page;