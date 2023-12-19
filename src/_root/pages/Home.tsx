import Loader from "@/components/shared/Loader";
import { useGetRecentDisciplinas } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import DisciplinaCard from "@/components/shared/DisciplinaCard";

const Home = () => {
  const {data: disciplinas, isPending: isDisciplinaLoading, isError: isErrorDisciplina} = useGetRecentDisciplinas(); 
  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
            <h2 className='h3-bold md:h2-bold text-left w-full'>Todas as Disciplinas</h2>
            {isDisciplinaLoading && !disciplinas ?
            (<Loader/>) : ( 
            <ul className="flex flex-xol gap-9 w-full">
              {disciplinas?.documents.map((disciplina: Models.Document) => (
                <DisciplinaCard disciplina={disciplina} key={disciplina.nome}/>
             ))}
            </ul>
              )}
        </div>
      </div>
    </div>
  )
}

export default Home