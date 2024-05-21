'use client'

import {redirect, usePathname, useRouter} from "next/navigation";
import React, {ChangeEvent, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CommunityValidation} from "@/lib/validations/community";
import * as z from "zod";
import {isBase64Image} from "@/lib/utils";
import {SingleUserProps} from "@/types";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import Image from "next/image";
import {createCommunity} from "@/lib/actions/community.actions";
import {Textarea} from "@/components/ui/textarea";
import {useUploadThing} from "@/lib/uploadthing";

const CommunityCreation = ({user}: SingleUserProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [files, setFiles] = useState<File[]>([]);
    const {startUpload} = useUploadThing("media");


    const form = useForm({
        resolver: zodResolver(CommunityValidation),
        defaultValues: {
            community_photo: "",
            name: '',
            slug: '',
            bio: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof CommunityValidation>) => {
        const blob = values.community_photo;
        const hasImageChanged = isBase64Image(blob);
        if (hasImageChanged) {
            const imgRes  = await startUpload(files);
            if(imgRes && imgRes[0].url){
                values.community_photo = imgRes[0].url;
            }
        }
        // await createCommunity({
        //     name: values.name,
        //     username: values.slug,
        //     image: values.community_photo,
        //     bio: values.bio,
        //     createdById: user.id
        // })
        if(pathname === '/community/edit'){
            router.back();
        } else {
            router.push('/communities');
        }
    }

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();
        const fileReader = new FileReader();
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target?.files[0];
            setFiles(Array.from(e.target?.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    // noinspection TypeScriptValidateTypes
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={'flex flex-col justify-start gap-10'}
            >
                <FormField
                    control={form.control}
                    name='community_photo'
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt='community_photo'
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-contain'
                                    />
                                ) : (
                                    <Image
                                        src='/assets/profile.svg'
                                        alt='community_photo'
                                        width={24}
                                        height={24}
                                        className='object-contain'
                                    />
                                )}
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Add community photo'
                                    className='account-form_image-input'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'name'}
                    render={
                        ({field}) => (
                            <FormItem className={'flex flex-col gap-3 w-full'}>
                                <FormLabel className={'text-base-semibold text-light-2'}>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className={'account-form_input no-focus'}
                                        type={'text'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }
                />
                <FormField
                    control={form.control}
                    name={'slug'}
                    render={
                        ({field}) => (
                            <FormItem className={'flex flex-col gap-3 w-full'}>
                                <FormLabel className={'text-base-semibold text-light-2'}>
                                    Slug
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className={'account-form_input no-focus'}
                                        type={'text'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }
                />
                <FormField
                    control={form.control}
                    name={'bio'}
                    render={
                        ({field}) => (
                            <FormItem className={'flex flex-col gap-3 w-full'}>
                                <FormLabel className={'text-base-semibold text-light-2'}>
                                    Bio
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className={'account-form_input no-focus'}
                                        rows={10}
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
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default CommunityCreation;