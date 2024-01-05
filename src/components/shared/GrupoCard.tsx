
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom";
import { useGetCurrentUser, useGetInscricaoById, useGetInscricaoByUserAndGrupoId, useGetRecentInscricoes } from "@/lib/react-query/queriesAndMutations";
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
  const inscricaoId = useGetInscricaoByUserAndGrupoId(user?.$id || " ", grupo?.$id || " ");
  const { data: inscricao } = useGetInscricaoById(inscricaoId.data || "")
  let profOuAluno = user?.docente ? 'Professor' : 'Aluno';
  const { id: id } = useParams();
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            {inscricao?.inscrito.$id !== user?.$id && profOuAluno == 'Aluno' ? (
              <span style={{ color: 'gray', cursor: 'not-allowed' }}>
                <p className=" text-purple-700 base-medium lg:body-bold">
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
                <p className="small-medium lg:base-medium py-5">
                  {grupo.descricao}
                </p>
                <p>
                  Subscreva para aceder
                </p>
              </span>
            ) : (
              <div>

                <Link to={`/disciplina/${id}/grupo/${grupo.$id}`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="base-medium lg:body-bold text-purple-700">
                          {grupo.nome}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="small-medium lg:base-medium bg-purple-700 py-2 px-2 ">Entrar no Grupo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <hr className="border w-full border-dark-4/80" />
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {formatDateString(grupo.$createdAt)}

                    </p>
                  </div>
                  <hr className="border w-full border-dark-4/80" />
                  {grupo.tema}
                  <p className="small-medium lg:base-medium py-5">
                    {grupo.descricao}
                  </p>
                </Link>
              </div>
            )}
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
      <div className="message--wrapper">
        <div className='w-full h-full '>
          <div className="text-center h4-bold md:h3-bold p-2">
            <h2>Alunos</h2>
            <hr className="border w-full border-dark-4/80" />
          </div>
          <div className="room--container">
            {isSaveLoading && !inscricoes ?
              (<Loader />) : (
                <ul >
                  {inscricoes?.documents.map((inscrito: Models.Document) => (

                    grupo.$id === inscrito.grupo.$id && !inscrito.inscrito.docente && (
                      <UserCard user={inscrito.inscrito} key={inscrito.$createdAt} />
                    )
                  ))}
                </ul>
              )}
          </div>
        </div>
      </div>
      <GrupoSave grupo={grupo} userId={user?.$id || ""} />
    </div >
  );
};

export default GrupoCard