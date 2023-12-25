import DisciplinaForm from "@/components/forms/DisciplinaForm"
import Loader from "@/components/shared/Loader";
import { useGetDisciplinaById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const EditarDisciplina = () => {
  const { id } = useParams();
  const {data: disciplina, isPending} = useGetDisciplinaById( id || '');
  if( isPending) return <Loader/>

  return (
    <div className="flex flex-1">
       <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img src="/assets/icons/add-post.svg" width={36} height={36} alt="add" />
            <h2 className="h3-bold md:h2-bold text-left w-full">Editar Disciplina</h2>
          </div>
          <DisciplinaForm  disciplina={disciplina} action="Update"/>
       </div>
    </div>
  )
}

export default EditarDisciplina