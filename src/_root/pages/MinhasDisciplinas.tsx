import Loader from "@/components/shared/Loader";
import { Models } from "appwrite";
import DisciplinaCard from "@/components/shared/DisciplinaCard";
import { useGetCurrentUser, useGetRecentSaves } from "@/lib/react-query/queriesAndMutations";

const MinhasDisciplinas = () => {
  const { data: user } = useGetCurrentUser();
  const { data: saves, isPending: isSaveLoading } = useGetRecentSaves();

  return (
    <div className="flex flex-1">
      <div className="home-container p-2">
        <div className="home-creator">
          <h2 className="h3-bold md:h2-bold text-left w-full"> Minhas Disciplinas</h2>
          {isSaveLoading && !saves ? (
            <Loader />
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {saves?.documents.map((save: Models.Document) => ( user?.$id == save.users.$id && 'hidden') && (
                <DisciplinaCard disciplina={save.disciplina} key={save.disciplina.nome} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinhasDisciplinas;