'use client';

import React from 'react';
import {CommentProps} from "@/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {usePathname, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CommentValidation} from "@/lib/validations/thread";
import * as z from "zod";
import {fetchUser} from "@/lib/actions/user.actions";
import {addCommentToThread, createThread} from "@/lib/actions/thread.actions";
import {Input} from "@/components/ui/input";
import Image from "next/image";

const Comments = ({threadId, currentUserImage, currentUserId}: CommentProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        const user = await fetchUser(currentUserId!);
        await addCommentToThread(threadId!, values.thread, JSON.parse(currentUserId!), pathname);
        form.reset();
    }

    // noinspection TypeScriptValidateTypes
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={'comment-form'}
            >
                <FormField
                    control={form.control}
                    name={'thread'}
                    render={
                        ({field}) => (
                            <FormItem className={'flex items-center gap-3 w-full'}>
                                <FormLabel>
                                    <Image
                                        src={currentUserImage}
                                        alt={'current user profile'}
                                        width={48}
                                        height={48}
                                        className={'rounded-full object-cover'}
                                    />
                                </FormLabel>
                                <FormControl className={'border-none bg-transparent'}>
                                    <Input
                                        type={'text'}
                                        placeholder={'Comment...'}
                                        className={'no-focus text-light-1 outline-none'}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )
                    }
                />
                <Button
                    type={'submit'}
                    className={'comment-form_btn'}
                >
                    Reply
                </Button>
            </form>
        </Form>
    );
};

export default Comments;