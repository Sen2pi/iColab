
import Loader from '@/components/shared/Loader';
import {   useGetRecentInscricoes } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';

import {  useParams } from 'react-router-dom';
import UserCard from '@/components/shared/UserCard';

const Notas = () => {
  const { id_g: id_g} = useParams();
  const { data: inscricoes, isPending: isSaveLoading } = useGetRecentInscricoes();
  return (
    <div className='px-2 py-2 w-full'>
      <div className="room--container h-full">
        <div className='flex flex-col w-full items-center gap-3'>
          <h2 className='h3-bold md:h2-bold text-left p-2'>Notas</h2>
          {isSaveLoading && !inscricoes ?
              (<Loader />) : (
                <ul >
                  {inscricoes?.documents.map((inscrito: Models.Document) => (
                    id_g == inscrito.grupo.$id && !inscrito.inscrito.docente && (
                      <UserCard user={inscrito.inscrito} id_g={id_g} key={inscrito.$createdAt} />
                    )
                  ))}
                </ul>
              )}      
        </div>
      </div>
    </div>
  )
}

export default Notas