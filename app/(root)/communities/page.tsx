import {currentUser, User} from "@clerk/nextjs/server";
import {fetchUser, fetchUsers, fetchUserThreads} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import UserCard from "@/components/cards/UserCard";
import {fetchCommunities} from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";
import SearchBar from "@/components/shared/SearchBar";


const Page = async ({searchParams}: {searchParams: { key: string | undefined }}) => {

    const user = await currentUser();
    if (!user) {
        return null;
    }
    const {id} = user;
    const userInfo  = await fetchUser(id);
    if(!userInfo?.onboarded){
        redirect('/onboarding');
    }

    const result = await fetchCommunities({
        searchString: searchParams.key,
        pageNumber: 1,
        pageSize: 25,
        sortBy: "desc"
    })


    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
            <SearchBar routeType={'communities'} />
            <div className="mt-14 flex flex-col gap-9">
                {
                    result.communities.length === 0 ? (
                        <p className={'no-result'}>No Communities</p>
                    ) : (
                        <>
                            {
                                result.communities.map(
                                    (community) => (
                                        <CommunityCard
                                            key={community.id}
                                            id={community.id}
                                            name={community.name}
                                            username={community.username}
                                            imgUrl={community.image}
                                            bio={community.bio}
                                            members={community.members}
                                        />
                                    )
                                )
                            }
                        </>
                    )
                }
            </div>
        </section>
    );
};

export default Page;