import {currentUser, User} from "@clerk/nextjs/server";
import {fetchUser, fetchUsers, fetchUserThreads} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import UserCard from "@/components/cards/UserCard";


const Page = async ({params}: {params: {id: string}}) => {

    const user = await currentUser();
    if (!user) {
        return null;
    }
    const {id} = user;
    const userInfo  = await fetchUser(id);
    if(!userInfo?.onboarded){
        redirect('/onboarding');
    }

    const result = await fetchUsers({
        userId: id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
        sortBy: 'desc'
    })


    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
            <div className="mt-14 flex flex-col gap-9">
                {
                    result.users.length === 0 ? (
                        <p className={'no-result'}>No result</p>
                    ) : (
                        <>
                            {
                                result.users.map(
                                    (person) => (
                                        <UserCard
                                            key={person.id}
                                            id={person.id}
                                            name={person.name}
                                            username={person.username}
                                            imageUrl={person.image}
                                            personType={'User'}
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