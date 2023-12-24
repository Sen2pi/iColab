import Loader from "@/components/shared/Loader";
import ModuloCard from "@/components/shared/ModuloCard";
import { useGetCurrentUser, useGetDisciplinaById, useGetRecentModulos } from "@/lib/react-query/queriesAndMutations";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom"

const DisciplinaDetalhe = () => {
  const { data: modulos, isPending: isModuloLoading } = useGetRecentModulos();
  const { id } = useParams();
  const { data: user } = useGetCurrentUser();
  const { data: disciplina, isPending } = useGetDisciplinaById(id as string);
  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : (
        <div className="post_details-card gap-4">
          <div className="
          flex flex-col items-center gap-5 w-full">
            {disciplina?.nome}
          </div>
          <img src={disciplina?.imageUrl} alt="post" className="post_details-img" />
          {disciplina?.descricao}
          <div className="flex flex-line items-center gap-2">
            <Link to={`/profile/${disciplina?.professor.$id}`}>
              <img src={disciplina?.professor?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="professor" className="rounded-full w-12 lg:h-12" />
            </Link>
            <div className="flex flex-ln gap-5">
              <p className="base-medium lg:body-bold text-light-1">
                {disciplina?.professor.name}
              </p>
              <div className="flex-center gap-5 text-light-3">
                <p className="subtle-semibold lg:small-regular">
                  {formatDateString(disciplina ? disciplina.$createdAt : "")}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
      <div className=' flex flex-col '>
        <h2 className='h3-bold md:h2-bold text-left w-full'>Modúlos</h2>
        {isModuloLoading && !modulos ?
          (<Loader />) : (
            <ul className="flex flex-ln gap-5 w-full">
              {modulos?.documents.map((modulo: Models.Document) => {
               try {
               if(modulo.disciplinas.$id == id)
                  return <ModuloCard modulo={modulo} key={modulo.nome} />;
               } catch (error) {}
              })}

            </ul>
          )}
        <Link to={`criar-modulo-disciplina/${id}`} className={`${user?.$id !== disciplina?.professor.$id && "hidden"}`}>
          <img className="" src="/assets/icons/edit.svg" width={60} height={60} />
        </Link>
        <div>
        </div>
      </div>

    </div>
  )
}

export default DisciplinaDetalhe