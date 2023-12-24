import { useUserContext } from "@/context/AuthContext";
import { useGetDisciplinaById } from "@/lib/react-query/queriesAndMutations";
import { downloadFile, formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom";



type ModuloCardProps = {
    modulo: Models.Document;
}

const ModuloCard = ({ modulo }: ModuloCardProps) => {
    const { id } = useParams();
    const {data: disciplina}  = useGetDisciplinaById(modulo.disciplinas.$id);
    const { user } = useUserContext();
    return (

        <div className="post-card">
            <div className="flex-between">
                <div className="flex flex-ln items-center gap-8">
                    <Link to={`/modulo/${modulo.$id}`}>
                        <p>{modulo.nome}</p>
                    </Link>
                    <div className="flex flex-ln">
                        <div className="flex-center gap-8 text-light-3">
                            <p className="subtle-semibold lg:small-regular">
                                {formatDateString(modulo.$createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-ln items-center gap-8 small-mediumlg:base-medium py-5">
                    <ul className="flex flex-ln items-center gap-2">
                        <p className="flex flex-ln items-center gap-2">{modulo.descricao}</p>
                        <div className="flex flex-ln items-center gap-2">
                            <button onClick={() => downloadFile(modulo.fileUrl, "iColab" + modulo.filename)}>
                                <img src="/assets/icons/download.png" alt="download" />
                            </button>
                            <Link to={modulo.fileUrl} target="_blank" download>
                                <img className="" src="/assets/icons/search.svg" width={60} height={60} />
                            </Link>
                            <Link to={`editar-modulo-disciplina/${id}/editar-modulo-disciplina/${modulo.$id}`} className={`${modulo.disciplinas.$id !== id && "hidden" || disciplina?.professor.$id !== user.id && "hidden"}`}>
                                <img className="" src="/assets/icons/edit.svg" width={60} height={60} />
                            </Link>
                        </div>
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default ModuloCard