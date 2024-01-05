import Loader from "@/components/shared/Loader";
import { useGetCurrentUser, useGetRecentGrupos } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import GrupoCard from "@/components/shared/GrupoCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useParams } from "react-router-dom";


const Grupo = () => {
  const { data: grupos, isPending: isGrupoLoading } = useGetRecentGrupos();
  const { data: user } = useGetCurrentUser();
  const { id } = useParams();
  let profOuAluno = user?.docente ? 'Professor' : 'Aluno';
  return (
    <div className="flex flex-1">
      <div className="home-container p-2">
        <div className="post_details-card ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/disciplina/${id}/criar-grupo/`} className={`${profOuAluno == 'Aluno'  && 'hidden'}`}>
                <img src="/assets/icons/create.png" alt="create" width={40} height={40} /> 
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="small-medium lg:base-medium">Criar Grupo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
        <div className="home-creator">
          <h2 className="h3-bold md:h2-bold text-left w-full">Todos os Grupos</h2>
          {isGrupoLoading && !grupos ? (
            <Loader />
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {grupos?.documents.map((grupo: Models.Document) => (
                <GrupoCard grupo={grupo} key={grupo.nome} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grupo;
