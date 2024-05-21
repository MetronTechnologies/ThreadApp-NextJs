import mongoose, {SortOrder} from "mongoose";

export interface AccountProfileProps {
    user: UserProps;
    btnTitle: string;
}

export interface UserProps{
    image: string | undefined;
    name: string;
    bio: string;
    id: string;
    objectId: string | undefined;
    username: string | null | undefined;
    onboarded: boolean
}

export interface SingleUserProps{
    user: UserProps;
}

export interface UpdateParams{
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}

export interface UserModel{
    _id: string,
    id: string,
    username: string,
    name: string,
    image: string,
    bio: string,
    threads: string[]
    onboarded: boolean,
    communities: string[],
    __v: string
}

export interface CreateThreadProps{
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export interface ThreadProps{
    id: string,
    currentUserId: string,
    content: string,
    author: UserModel,
    community: CommunityProps | null,
    createdAt: string,
    parentId: string | null,
    comments: CommentProps[],
    isComment?: boolean
}

export interface CommunityProps{
    id: string,
    name: string,
    image: string
}

export interface CommentProps{
    author?: UserModel,
    threadId?: string,
    currentUserImage?: string,
    currentUserId?: string
}

export interface ProfileHeaderProps{
    accountId: string,
    authUserId: string,
    name: string,
    username: string,
    imgUrl: string,
    bio: string,
    type?: 'User' | 'Community'
}
export interface ThreadTabProps {
    currentUserId: string,
    accountId: string,
    accountType: string
}

export interface FetchUserProps{
    userId: string,
    searchString: string,
    pageNumber?: number,
    pageSize: number,
    sortBy: SortOrder
}

export interface UserCardProps {
    id: string,
    name: string,
    username: string,
    imageUrl: string,
    personType: string
}

export interface FetchCommunityProps{
    searchString: string;
    pageNumber: number;
    pageSize: number;
    sortBy: SortOrder;
}

export interface CreateCommunityProps{
    name: string,
    username: string,
    image: string,
    bio: string,
    createdById: string
}

export interface CommunityCardProps{
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    members: {
        image: string;
    }[];
}



