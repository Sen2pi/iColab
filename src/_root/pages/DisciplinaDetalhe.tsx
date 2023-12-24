import Loader from "@/components/shared/Loader";
import ModuloCard from "@/components/shared/ModuloCard";
import { Button } from "@/components/ui/button";
import { useGetCurrentUser, useGetDisciplinaById, useGetRecentModulos } from "@/lib/react-query/queriesAndMutations";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom"

const DisciplinaDetalhe = () => {
  const { data: modulos, isPending: isModuloLoading } = useGetRecentModulos();
  const { id } = useParams();
  const { data: user } = useGetCurrentUser();
  const { data: disciplina, isPending } = useGetDisciplinaById(id as string);
  const handleDeleteDisciplina = () => { }
  return (
    <div className="post_details-container">
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
                  <hr className="border w-full border-dark-4/80"/>
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
                    <Link to={`/editar-disciplina/${disciplina?.$id}`} className={`${user?.$id !== disciplina?.professor.$id && 'hidden'}`}>
                      <img src="/assets/icons/edit.svg" width={24} height={24} />
                    </Link>
                    <Button onClick={handleDeleteDisciplina}
                      variant="ghost"
                      className={`ghost_details-delete_btn ${user?.$id !== disciplina?.professor.$id && 'hidden'}`}>
                      <img src="/assets/icons/delete.svg" alt="" />
                    </Button>
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
          <Link to={`criar-modulo-disciplina/${id}`} className={`${user?.$id !== disciplina?.professor.$id && "hidden"}`}>
            <img className="flex mb-5" src="/assets/icons/edit.svg" width={35} height={35} />
          </Link>
        </div>
      </div>

    </div>
  )
}

export default DisciplinaDetalhe