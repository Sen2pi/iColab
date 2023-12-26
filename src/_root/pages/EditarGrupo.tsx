import GrupoForm from "@/components/forms/GrupoForm"
import { useGetGrupoById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom"

const EditarGrupo = () => {
  const { id_g: id_g} = useParams();
  const{ data: grupo} = useGetGrupoById(id_g || "");
  return (
    <div className="flex flex-1">
       <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img src="/assets/icons/edit.svg" width={36} height={36} alt="edit" />
            <h2 className="h3-bold md:h2-bold text-left w-full">Editar Grupo</h2>
          </div>
          <GrupoForm  grupo={grupo} action='Update'/>
       </div>
    </div>
  ) 
}

export default EditarGrupo