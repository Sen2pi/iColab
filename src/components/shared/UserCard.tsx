import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";




type UserCardProps = {
    user: Models.Document;
}

const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="profile-inner_container">
            <div className="flex-between flex-center text-purple-400 text-left w-full">
                <Link to={`/profile/${user?.$id}`} className="flex-center px-2 gap-2 items-center">
                    <div className="flex-center gap-2">
                        <img
                            src={user?.imageUrl || '/assets/images/profile-default.png'}
                            alt="profile"
                            className="h-16 w-16 rounded-full"
                        />
                        <div className="flex flex-col">
                            <p className="body-bold">{user?.name}</p>
                            <p className="small-regular text-light-3">{user?.email}</p>
                            <p className="small-regular text-light-3">{user?.numero}</p>
                            <p className="small-regular text-light-3">{user?.curso}</p>
                        </div>
                    </div>
                </Link>
                
            </div>
        </div>
    );
};

export default UserCard