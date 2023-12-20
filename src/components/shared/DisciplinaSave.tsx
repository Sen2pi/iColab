import { Models } from "appwrite";
import { useEffect, useState } from "react";
import {
    useSaveDisciplina,
    useDeleteSavedDisciplina,
    useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

type DisciplinaStatsProps = {
    disciplina: Models.Document;
    userId: string;
};

const DisciplinaSave = ({ disciplina, userId }: DisciplinaStatsProps) => {
    const { mutate: saveDisciplina , isPending: isSavingDisciplina} = useSaveDisciplina();
    const { mutate: deleteSaveDisciplina, isPending: isDeletingSaved } = useDeleteSavedDisciplina();
    const { data: currentUser } = useGetCurrentUser();
    const [isSaved, setIsSaved] = useState(false);

    const savedDisciplinaRecord = currentUser?.saves.find((record: Models.Document) => record.disciplina.$id === disciplina.$id);
        
    useEffect(() => {
        setIsSaved(!!savedDisciplinaRecord);
    }, [currentUser]);

    const handleSaveDisciplina = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (savedDisciplinaRecord) {
            setIsSaved(false);
            return deleteSaveDisciplina(savedDisciplinaRecord.$id);
        }
        
        
        saveDisciplina({ disciplinaId: disciplina.$id, userId: userId });
        setIsSaved(true);
        

    };
    const containerStyles = location.pathname.startsWith("/profile")
        ? "w-full"
        : "";

    return (
        <div className={`flex justify-between items-center z-20 ${containerStyles}`}>

            <div className="flex gap-2">

               {isSavingDisciplina || isDeletingSaved ? <Loader/> : <img src={`${isSaved
                    ? "/assets/icons/saved.svg"
                    : "/assets/icons/save.svg"}`}
                    alt="save"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                    onClick={(e) => handleSaveDisciplina(e)}
                />}
                {isSavingDisciplina || isDeletingSaved ? <Loader/> : <p className="text-primary-600 subtle-semibold lg:small-regular">{isSaved? "Já se encontra inscrito":"Inscreva-se"}
                    </p>}
                


            </div>

        </div>
    );
};

export default DisciplinaSave;