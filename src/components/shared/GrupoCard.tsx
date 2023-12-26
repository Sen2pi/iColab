
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom";
import { useGetCurrentUser, useGetRecentInscricoes, useGetRecentUsers } from "@/lib/react-query/queriesAndMutations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import Loader from "./Loader";
import UserCard from "./UserCard";
import GrupoSave from "./GrupoSave";

type GrupoCardProps = {
  grupo: Models.Document;
}
const GrupoCard = ({ grupo }: GrupoCardProps) => {
  const { data: inscricoes, isPending: isSaveLoading } = useGetRecentInscricoes();
  const { data: user } = useGetCurrentUser();
  const { id: id } = useParams();
  return (
    <div className="post-card">
      <Link to={`/disciplina/${id}/grupo/${grupo.$id}`}>
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <Link to={`/disciplina/${id}/grupo/${grupo.$id}`}>
            </Link>
            <p className="base-medium lg:body-bold text-light-1">
              {grupo.nome}
            </p>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatDateString(grupo.$createdAt)}

              </p>
            </div>
            <hr className="border w-full border-dark-4/80" />
            {grupo.tema}
          </div>

        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/disciplina/${id}/editar-grupo/${grupo.$id}`} className={`${user?.$id !== grupo.disciplina.professor.$id && "hidden"}`}>
                <img src={'/assets/icons/edit.svg'} alt="edit" className=" py-4 px-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="small-medium lg:base-medium">Editar Grupo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="small-medium lg:base-medium py-5">
        <p>
          {grupo.descricao}
        </p>
      </div>
      <div className="post_details-card">
        <div className='flex-between flex-col w-full items-center '>
          <h2 className='h4-bold md:h3-bold text-left p-2'>Alunos</h2>
          {isSaveLoading && !inscricoes?
            (<Loader />) : (
              <ul className="profile-inner_container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {inscricoes?.documents.map((inscrito: Models.Document) => (
                  user?.$id === inscrito.inscrito.$id && grupo.$id === inscrito.grupo.$id && (
                    <UserCard user={inscrito.inscrito} key={inscrito.$createdAt} />
                  )
                ))}
              </ul>
            )}
        </div>
      </div>
      </Link>
      <GrupoSave grupo={grupo} userId={user?.$id || ""} />
    </div >
  );
};

export default GrupoCard