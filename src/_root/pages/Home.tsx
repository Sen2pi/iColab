import Loader from "@/components/shared/Loader";
import { useGetCurrentUser, useGetRecentDisciplinas } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import DisciplinaCard from "@/components/shared/DisciplinaCard";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const { data: disciplinas, isPending: isDisciplinaLoading } = useGetRecentDisciplinas();
  const { data: user } = useGetCurrentUser();
  let profOuAluno = user?.docente ? 'Professor' : 'Aluno';
  const navigate = useNavigate();
  return (
    <div className="flex flex-1">
      <div className="home-container p-2">
      <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost"  onClick={() => navigate('/criar-disciplina')} className={`${profOuAluno == 'Aluno'  && 'hidden'}`}>
                <img src="/assets/icons/create.png" alt="create" width={40} height={40} /> <p className="text-primary-600 subtle-semibold lg:small-regular">Nova Disciplina</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="small-medium lg:base-medium">Criar Disciplina</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="home-creator">
          <h2 className="h3-bold md:h2-bold text-left w-full">Todas as Disciplinas</h2>
          {isDisciplinaLoading && !disciplinas ? (
            <Loader />
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {disciplinas?.documents.map((disciplina: Models.Document) => (
                <DisciplinaCard disciplina={disciplina} key={disciplina.nome} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
