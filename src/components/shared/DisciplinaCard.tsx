import { useUserContext } from "@/context/AuthContext";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

type DisciplinaCardProps = {
    disciplina: Models.Document;
}
const DisciplinaCard = ({disciplina}: DisciplinaCardProps) => {
    const {user}= useUserContext();
    if(!disciplina.professor) return;
  return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${disciplina.professor.$id}`}>
                <img src={disciplina?.professor?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="professor" className="rounded-full w-12 lg:h-12"/>
                </Link>
                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {disciplina.professor.name}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                        <p className="subtle-semibold lg:small-regular">
                            {formatDateString(disciplina.$createdAt)}
                        </p>
                    </div>
                </div>
            </div>
            <Link to={`/editar-disciplina/${disciplina.$id}`} className={`${user.id !== disciplina.professor.$id && "hidden"}`}>
                <img src={'/assets/icons/edit.svg'} alt="edit" className="w-12 lg:h-12"/>
            </Link>
        </div>
        <Link to={`/disciplina/${disciplina.$id}`}>
            <div className="small-medium lg:base-medium py-5">
                <p>
                    {disciplina.descricao}
                </p>

            </div>
        </Link>
        <div>
            <img src={disciplina.imageUrl || '/assets/icons/profile-placeholder.svg'} className="post-card_img" alt="post image" />
        </div>
    </div>
  )
}

export default DisciplinaCard