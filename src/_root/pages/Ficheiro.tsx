import FicheiroCard from '@/components/shared/FicheiroCard';
import Loader from '@/components/shared/Loader';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {  useGetRecentFicheiros } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';

import { Link, useParams } from 'react-router-dom';

const Ficheiro = () => {
  const { data: ficheiros, isPending: isFicheiroLoading } = useGetRecentFicheiros();
  const { id: id, id_g: id_g} = useParams();
  return (
    <div className='px-2 py-2 w-full'>
      <div className="room--container h-full">
        <div className='flex flex-col w-full items-center gap-3'>
          <h2 className='h3-bold md:h2-bold text-left p-2'>Ficheiros</h2>
          {isFicheiroLoading && !ficheiros ?
            (<Loader />) : (
              <ul className="flex flex-col gap-5 p-2">
                {ficheiros?.documents.map((ficheiro: Models.Document) => {
                  try {
                    if (ficheiro.grupo.$id == id_g)
                      return <FicheiroCard ficheiro={ficheiro} key={ficheiro.nome} />;
                  } catch (error) { }
                })}
              </ul>
            )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/disciplina/${id}/grupo/${id_g}/criar-ficheiro`}>
                  <img className="flex mb-5" src="/assets/icons/create.png" width={35} height={35} aria-placeholder="Criar" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="small-medium lg:base-medium">Criar Ficheiro</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default Ficheiro