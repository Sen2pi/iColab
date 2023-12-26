import { Models } from "appwrite";
import { useEffect, useState } from "react";
import {
    useSaveGrupo,
    useDeleteSavedGrupo,
    useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

type GrupoStatsProps = {
    grupo: Models.Document;
    userId: string;
};

const GrupoSave = ({ grupo, userId }: GrupoStatsProps) => {
    const { mutate: saveGrupo, isPending: isSavingGrupo } = useSaveGrupo();
    const { mutate: deleteSaveGrupo, isPending: isDeletingSaved } = useDeleteSavedGrupo();
    const { data: currentUser } = useGetCurrentUser();
    const [isSaved, setIsSaved] = useState(false);

    const savedGrupoRecord = currentUser?.inscricoes.find((record: Models.Document) => record.grupo.$id === grupo.$id);

    useEffect(() => {
        setIsSaved(!!savedGrupoRecord);
    }, [currentUser]);

    const handleSaveGrupo = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (savedGrupoRecord) {
            setIsSaved(false);
            return deleteSaveGrupo(savedGrupoRecord.$id);
        }

        saveGrupo({ grupoId: grupo.$id, userId: userId });
        setIsSaved(true);


    };
    const containerStyles = location.pathname.startsWith("/profile")
        ? "w-full"
        : "";

    return (
        <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
            <div className="flex gap-2">
                {isSavingGrupo || isDeletingSaved ? <Loader /> : <img src={`${isSaved
                    ? "/assets/icons/saved.svg"
                    : "/assets/icons/save.svg"}`}
                    alt="save"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                    onClick={(e) => handleSaveGrupo(e)}
                />}
                {isSavingGrupo || isDeletingSaved ? <Loader /> : <p className="text-primary-600 subtle-semibold lg:small-regular">{isSaved ? "Já se encontra inscrito" : "Inscreva-se"}
                </p>}
            </div>
        </div>
    );
};

export default GrupoSave;