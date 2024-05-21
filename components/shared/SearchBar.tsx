'use client'
import {Input} from "@/components/ui/input";
import {SearchBarProps} from "@/types";
import Image from "next/image";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";


const SearchBar = ({routeType}: SearchBarProps) => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                router.push(`/${routeType}?key=` + search);
            } else {
                router.push(`/${routeType}`);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, routeType]);
    return (
        <div className='searchbar'>
            <Image
                src='/assets/search-gray.svg'
                alt='search'
                width={24}
                height={24}
                className='object-contain'
            />
            <Input
                id='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`${
                    routeType !== "search" ? "Search communities" : "Search creators"
                }`}
                className='no-focus searchbar_input'
            />
        </div>
    );
};

export default SearchBar;