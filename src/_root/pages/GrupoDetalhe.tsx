import Loader from "@/components/shared/Loader";
import ModuloCard from "@/components/shared/ModuloCard";
import { Button } from "@/components/ui/button";
import { useGetCurrentUser, useGetGrupoById, useGetRecentModulos } from "@/lib/react-query/queriesAndMutations";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const GrupoDetalhe = () => {
  const { data: modulos, isPending: isModuloLoading } = useGetRecentModulos();
  const { id: id , id_g: id_g, id_c: id_c} = useParams();
  const { data: user } = useGetCurrentUser();
  const { data: grupo, isPending } = useGetGrupoById(id as string);
  const handleDeleteGrupo = () => { }
  return (
    <div className="post_details-container">
      <div className="post_details-card ">
        <div className="flex-center w-full h-full items-center   text-violet-400">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/disciplina/${id}/grupo/${id_g}/chat/${id_c}`} className="py-2 px-8">
                <img src="/assets/icons/chat.svg" width={50} height={50} aria-placeholder="Criar" />
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
              <Link to={`/disciplina/${id}/grupo/${id_g}/ficheiros`} className="py-2 px-8">
                <img src="/assets/icons/ficheiros.png" width={50} height={50} aria-placeholder="Criar" />
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
              <Link to={`/disciplina/${id}/grupo/${id_g}/tarefas`} className="py-2 px-8">
                <img src="/assets/icons/tarefas.png" width={50} height={50} aria-placeholder="Criar" />
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
                <img src="/assets/icons/grades.png" width={50} height={50} aria-placeholder="Criar" />
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
          <img src="/assets/icons/people.svg"
            alt="post"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-ln w-full">
              <div className="flex-ln items-center text-light-3 text-2xl">
                {grupo?.nome}
              </div>
              <div className="flex-col items-center text-justify mb-4 mt-1 ">
                {grupo?.descricao}
              </div>
              <hr className="border w-full border-dark-4/80" />
              <div className="flex gap-6 items-center">
                <Link to={`/profile/${grupo?.professor.$id}`} className="flex ">
                  <img src={grupo?.professor?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                    alt="professor"
                    className="flex rounded-full w-8 h-8 lg:w-12 lg:h-12  mt-2" />
                  <p className=" flex base-medium lg:body-bold text-light-1 ml-2 mt-5">
                    {grupo?.professor.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3 mt-3 ml-10">
                    <p className="subtle-semibold lg:small-regular">
                      {formatDateString(grupo ? grupo.$createdAt : "")}
                    </p>
                  </div>
                  <div className="flex-center ml-5 mt-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to={`/editar-grupo/${grupo?.$id}`} className={`${user?.$id !== grupo?.professor.$id && 'hidden'}`}>
                            <img src="/assets/icons/edit.svg" width={24} height={24} />
                          </Link>
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
                            className={`ghost_details-delete_btn ${user?.$id !== grupo?.professor.$id && 'hidden'}`}>
                            <img src="/assets/icons/delete.svg" alt="" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="small-medium lg:base-medium">Remover Grupo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="post_details-card">
        <div className='flex flex-col w-full items-center gap-3'>
          <h2 className='h3-bold md:h2-bold text-left p-2'>Modúlos</h2>
          {isModuloLoading && !modulos ?
            (<Loader />) : (
              <ul className="flex flex-col gap-5 p-2">
                {modulos?.documents.map((modulo: Models.Document) => {
                  try {
                    if (modulo.grupos.$id == id)
                      return <ModuloCard modulo={modulo} key={modulo.nome} />;
                  } catch (error) { }
                })}
              </ul>
            )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`criar-modulo-grupo/${id}`} className={`${user?.$id !== grupo?.professor.$id && "hidden"}`}>
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