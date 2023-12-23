import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useGetDisciplinaById } from "@/lib/react-query/queriesAndMutations";
import { formatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom"

const DisciplinaDetalhe = () => {
  const { id }  = useParams();
  const {data: disciplina, isPending} = useGetDisciplinaById(id || '');
  const navigate = useNavigate();
  return (
    <div className="post_details-container">
      {isPending ? <Loader/> : (
          <div className="post_details-card">
            <img src={disciplina?.imageUrl} alt="post" className="post_details-img" />
            {disciplina?.descricao}
            <div className="flex items-center gap-3">
                <Link to={`/profile/${disciplina?.professor.$id}`}> Docente: 
                <img src={disciplina?.professor?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="professor" className="rounded-full w-12 lg:h-12"/>
                </Link>
                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {disciplina?.professor.name}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                        <p className="subtle-semibold lg:small-regular">
                            {formatDateString(disciplina? disciplina.$createdAt:"")}
                        </p>
                    </div>
                </div>
            </div>
            
          </div>
      )}
      <div className="flex flex-ln gap-5">
            <Button type="button" className="shad-button_dark_4" onClick={()=>navigate(-1)}>Grupos</Button>
            <Button type="button" className="shad-button_dark_4" onClick={()=>navigate(-1)}>Matéria</Button>
            <Button type="button" className="shad-button_dark_4" onClick={()=>navigate(-1)}>Voltar</Button>
            </div>
    </div>
  )
}

export default DisciplinaDetalhe