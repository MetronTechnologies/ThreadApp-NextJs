'use client'
import React from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ThreadValidation} from "@/lib/validations/thread";
import * as z from 'zod';
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {usePathname, useRouter} from "next/navigation";
import {createThread} from "@/lib/actions/thread.actions";
import {fetchUser} from "@/lib/actions/user.actions";
import {useOrganization} from "@clerk/nextjs";

const PostThread = ({userId}: {userId: string}) => {
    const router = useRouter();
    const pathname = usePathname();
    const {organization} = useOrganization();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    });

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        const user = await fetchUser(userId);
        await createThread({
            text: values.thread,
            author: user._id,
            communityId: organization ? organization.id : null,
            path: pathname
        });

        router.push('/');
    }

    // noinspection TypeScriptValidateTypes
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={'mt-10 flex flex-col justify-start gap-10'}
            >
                <FormField
                    control={form.control}
                    name={'thread'}
                    render={
                        ({field}) => (
                            <FormItem className={'flex flex-col gap-3 w-full'}>
                                <FormLabel className={'text-base-semibold text-light-2'}>
                                    Content
                                </FormLabel>
                                <FormControl className={'no-focus border border-dark-4 bg-dark-3 text-light-1'}>
                                    <Textarea
                                        rows={15}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }
                />
                <Button
                    type={'submit'}
                    className={'bg-primary-500'}
                >
                    Post Thread
                </Button>
            </form>
        </Form>
    )


}

export default PostThread;