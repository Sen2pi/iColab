import Loader from '@/components/shared/Loader';
import { useGetCurrentUser, useGetRecentNotas } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import NotasCard from '@/components/shared/NotasCard';

const Notas = () => {
  const { data: notas, isPending: isSaveLoading } = useGetRecentNotas();
  const { data: user } = useGetCurrentUser();

  let media = 0;

  if (notas && notas.documents.length > 0) {
    // Calcular a média das notas
    const totalNotas = notas.documents.reduce((acc, nota) => {
      if (user?.$id === nota?.aluno.$id) {
        return acc + nota.nota; // Adicione apenas as notas do usuário atual
      }
      return acc;
    }, 0);

    media = totalNotas / (notas.documents.length - 1);
  }
  console.log(media)

  return (
    <div className='px-2 py-2 w-full'>
      <div className="room--container h-full">
        <div className='flex flex-col w-full items-center gap-3'>
          <h2 className='h3-bold md:h2-bold text-left p-2'>Notas</h2>
          {isSaveLoading && !notas ? (
            <Loader />
          ) : (
            <ul>
              {notas?.documents.map((nota: Models.Document) => (
                user?.$id === nota?.aluno?.$id && (
                  <NotasCard nota={nota} key={nota.$createdAt} />
                )
              ))}
            </ul>
          )}
        </div>
          <div>
              {media >= 0 && (
                <div className="text-center mt-4">
                  <p className="text-lg font-bold">Média das Notas: {media.toFixed(2)}</p>
                </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Notas;
