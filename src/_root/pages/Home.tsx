import Loader from "@/components/shared/Loader";
import { useGetRecentDisciplinas } from "@/lib/react-query/queriesAndMutations";

const Home = () => {
  const {data: disciplinas, isPending: isDisciplinaLoading, isError: isErrorDisciplina} = useGetRecentDisciplinas(); 
  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
            <h2 className='h3-bold md:h2-bold text-left w-full'>Todas as Disciplinas</h2>
            {isDisciplinaLoading && !disciplinas ?
            (<Loader/>) : ( 
            <ul>

            </ul>
              )}
        </div>
      </div>
    </div>
  )
}

export default Home