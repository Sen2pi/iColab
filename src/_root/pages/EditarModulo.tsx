import ModuloForm from '@/components/forms/ModuloForm'
import Loader from '@/components/shared/Loader';
import {  useGetModuloById } from '@/lib/react-query/queriesAndMutations';
import { useParams } from 'react-router-dom';

const EditarModulo = () => {
  const { id_m } = useParams();
  const {data: modulo, isPending} = useGetModuloById( id_m || '');
  if( isPending) return <Loader/>

  return (
    <div className="flex flex-1">
       <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img src="/assets/icons/add-post.svg" width={36} height={36} alt="add" />
            <h2 className="h3-bold md:h2-bold text-left w-full">Editar Modulo</h2>
          </div>
          <ModuloForm modulo={modulo} action="Update"/>
       </div>
    </div>
  )
}

export default EditarModulo