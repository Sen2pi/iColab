import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useGetCurrentUser, useGetGrupoById, useGetRecentInscricoes } from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import UserCard from "@/components/shared/UserCard";
import { Models } from "appwrite";

const GrupoDetalhe = () => {
  const { data: inscricoes, isPending: isSaveLoading } = useGetRecentInscricoes();
  const { id: id, id_g: id_g} = useParams();
  const { data: user } = useGetCurrentUser();
  const { data: grupo, isPending } = useGetGrupoById(id_g || " ");
  const handleDeleteGrupo = () => { }
  let profOuAluno = user?.docente ? 'Professor' : 'Aluno';
  return (
    <div className="post_details-container">
      <div className="post_details-card ">
        <div className="flex-center w-full h-full items-center   text-violet-400">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
             
                <Link to={`/disciplina/${id}/grupo/${id_g}/chat/${grupo?.chats.$id}`} className="py-2 px-8">
                  <img src="/assets/icons/chat.svg" width={50} height={50} />
                  <p>Chat</p>
                </Link>
    
              </TooltipTrigger>
              <TooltipContent>
                <p className="subtle-semibold lg:small-regular">Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  <Link to={`/disciplina/${id}/grupo/${id_g}/historicos`} className="py-2 px-8">
                    <img src="/assets/icons/history.png"  width={50} height={50}  />
                    <p>Histórico</p>
                  </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="subtle-semibold lg:small-regular">Histórico</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/disciplina/${id}/grupo/${id_g}/ficheiros`} className={`${profOuAluno == 'Professor' && 'hidden'} py-2 px-8`}>
                  <img src="/assets/icons/ficheiros.png" width={50} height={50} />
                  <p>Ficheiros</p>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="subtle-semibold lg:small-regular">Ficheiros</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/disciplina/${id}/grupo/${id_g}/tarefas`} className={`${profOuAluno == 'Professor' && 'hidden'} py-2 px-8`}>
                  <img src="/assets/icons/tarefas.png" width={50} height={50} 
                   />
                  <p>Tarefas</p>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="subtle-semibold lg:small-regular">Tarefas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/disciplina/${id}/grupo/${id_g}/Notas`} >
                  <img src="/assets/icons/grades.png" width={50} height={50}  />
                  <p>Notas</p>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="subtle-semibold lg:small-regular">Notas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          <div className="post_details-info">
            <div className="flex-ln w-full">
              <div className="flex-ln items-center text-light-3 text-2xl">
                <h2>
                  {grupo?.nome}
                </h2>
              </div>
              <div className="flex-col items-center text-justify mb-4 mt-1 ">
                {grupo?.descricao}
              </div>
              <hr className="border w-full border-dark-4/80" />
              <div className="flex gap-6 items-center">
                  <div className='w-full items-center '>
                    <h2 className='h4-bold md:h3-bold text-left p-2'>Alunos</h2>
                    {isSaveLoading && !inscricoes ?
                      (<Loader />) : (
                        <ul className="grid grid-cols-1 md">
                          {inscricoes?.documents.map((inscrito: Models.Document) => (
                             id_g === inscrito.grupo.$id && (
                              <UserCard user={inscrito.inscrito} key={inscrito.inscrito} />
                            )
                          ))}
                        </ul>
                      )}
                  </div>
                  <div className="flex-center ml-5 mt-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                            <img src="/assets/icons/edit.svg" width={24} height={24} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="small-medium lg:base-medium">Editar Grupo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleDeleteGrupo}
                            variant="ghost"
                            className={`ghost_details-delete_btn ${user?.$id !== grupo?.disciplina.professor.$id && 'hidden'}`}>
                            <img src="/assets/icons/delete.svg" width={60} height={60}/>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="small-medium lg:base-medium">Remover Grupo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="post_details-card">
        <div className='flex flex-col w-full items-center gap-3'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`criar-modulo-grupo/${id}`} className={`${user?.$id !== grupo?.disciplina.professor.$id && "hidden"}`}>
                  <img className="flex mb-5" src="/assets/icons/create.png" width={35} height={35} aria-placeholder="Criar" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="small-medium lg:base-medium">Criar Módulo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

    </div>
  )
}

export default GrupoDetalhe