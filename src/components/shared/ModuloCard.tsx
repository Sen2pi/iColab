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
            <div className="flex-between w-full">
                <div className="flex flex-ln items-center ml-5 mr-5">
                    <Link to={`/modulo/${modulo.$id}`} className="flex text-left mr-5 ml-5">
                        <p>{modulo.nome}</p>
                    </Link>
                    <div className="flex ">
                        <div className="flex-center text-center text-light-3">
                            <p className="subtle-semibold lg:small-regular">
                                {formatDateString(modulo.$createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className=" flex-center w-full small-medium lg:base-medium py-3">
                    <ul className="flex ml-3 mr-3 ">
                        <p className="flex text-center ">{modulo.descricao}</p>
                        <div className="flex ml-3 mr-3 ">
                            <button onClick={() => downloadFile(modulo.fileUrl, "iColab" + modulo.filename)}>
                                <img className=" shadcn-btn flex ml-2 mr-2" src="/assets/icons/download.png" alt="download" width={35} height={35}  />
                            </button>
                            <Link to={modulo.fileUrl} target="_blank" download>
                                <img className="flex ml-2 mr-2" src="/assets/icons/search.svg" width={35} height={35} />
                            </Link>
                            <Link to={`editar-modulo-disciplina/${id}/editar-modulo-disciplina/${modulo.$id}`} className={`${modulo.disciplinas.$id !== id && "hidden" || disciplina?.professor.$id !== user.id && "hidden"}`}>
                                <img className="flex ml-2 mr-2" src="/assets/icons/edit.svg" width={35} height={35} />
                            </Link>
                        </div>
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default ModuloCard