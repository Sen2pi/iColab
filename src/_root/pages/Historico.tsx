import HistoricoCard from '@/components/shared/HistoricoCard';
import Loader from '@/components/shared/Loader';
import {  useGetRecentHistoricos } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';

import {  useParams } from 'react-router-dom';

const Historico = () => {
  const { data: historicos, isPending: isHistoricoLoading } = useGetRecentHistoricos();
  const { id_g: id_g} = useParams();
  return (
    <div className='w-full'>
      <div className="room--container h-full">
        <div className='flex flex-col w-full items-center gap-3'>
          <h2 className='h3-bold md:h2-bold text-left '>Historicos</h2>
          {isHistoricoLoading && !historicos ?
            (<Loader />) : (
              <ul className="flex flex-col ">
                {historicos?.documents.map((historico: Models.Document) => {
                  try {
                    if (historico?.grupo?.$id == id_g)
                      return <HistoricoCard historico={historico} key={historico.$createdAt} />;
                  } catch (error) { }
                })}
              </ul>
            )}
        </div>
      </div>
    </div>
  )
}

export default Historico