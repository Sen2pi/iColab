import Loader from "@/components/shared/Loader";
import ModuloCard from "@/components/shared/ModuloCard";
import { Button } from "@/components/ui/button";
import { useGetCurrentUser, useGetDisciplinaById, useGetRecentModulos, useGetSaveById, useGetSaveByUserAndDisciplinaId } from "@/lib/react-query/queriesAndMutations";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { deleteDisciplina } from "@/lib/appwrite/api";

const DisciplinaDetalhe = () => {
  const { data: modulos, isPending: isModuloLoading } = useGetRecentModulos();
  const { id: id } = useParams();
  const navigate = useNavigate()
  const { data: user } = useGetCurrentUser();
  const { data: disciplina, isPending } = useGetDisciplinaById(id as string);
  const saveId = useGetSaveByUserAndDisciplinaId(user?.$id || " ", disciplina?.$id || " ");
  const {data: save} = useGetSaveById(saveId.data || " "); 
  console.log(save)
  const handleDeleteDisciplina = async () => {
    try {
      await deleteDisciplina(disciplina?.$id || " ", disciplina?.imageId);
      // Atualiza a página
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`${!save && 'hidden' && navigate('/') || save?.users.$id !== user?.$id && disciplina?.$id !== save?.disciplina.$id && 'hidden' && navigate('/') } post_details-container`}>
      <div className="post_details-card ">
        <div className="flex-center w-full h-full items-center   text-violet-400">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/disciplina/${id}/grupos`} className="py-2 px-8">
                  <img src="/assets/icons/people.svg" width={50} height={50} aria-placeholder="Criar" />
                  <p>Grupos</p>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="subtle-semibold lg:small-regular">Grupos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`disciplina/${id}/notas`} >
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
          <img src={disciplina?.imageUrl}
            alt="post"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-ln w-full">
              <div className="flex-ln items-center text-light-3 text-2xl">
                {disciplina?.nome}
              </div>
              <div className="flex-col items-center text-justify mb-4 mt-1 ">
                {disciplina?.descricao}
              </div>
              <hr className="border w-full border-dark-4/80" />
              <div className="flex gap-6 items-center">
                <Link to={`/profile/${disciplina?.professor.$id}`} className="flex ">
                  <img src={disciplina?.professor?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                    alt="professor"
                    className="flex rounded-full w-8 h-8 lg:w-12 lg:h-12  mt-2" />
                  <p className=" flex base-medium lg:body-bold text-light-1 ml-2 mt-5">
                    {disciplina?.professor.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3 mt-3 ml-10">
                    <p className="subtle-semibold lg:small-regular">
                      {formatDateString(disciplina ? disciplina.$createdAt : "")}
                    </p>
                  </div>
                  <div className="flex-center ml-5 mt-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to={`/editar-disciplina/${disciplina?.$id}`} className={`${user?.$id !== disciplina?.professor.$id && 'hidden'}`}>
                            <img src="/assets/icons/edit.svg" width={24} height={24} />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="small-medium lg:base-medium">Editar Disciplina</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleDeleteDisciplina}
                            variant="ghost"
                            className={`ghost_details-delete_btn ${user?.$id !== disciplina?.professor.$id && 'hidden'}`}>
                            <img src="/assets/icons/delete.svg" alt="" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="small-medium lg:base-medium">Remover Disciplina</p>
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
                    if (modulo.disciplinas.$id == id)
                      return <ModuloCard modulo={modulo} key={modulo.nome} />;
                  } catch (error) { }
                })}
              </ul>
            )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`criar-modulo-disciplina/${id}`} className={`${user?.$id !== disciplina?.professor.$id && "hidden"}`}>
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

export default DisciplinaDetalhe