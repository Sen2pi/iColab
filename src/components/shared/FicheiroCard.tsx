
import { downloadFile, formatDateString } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Models } from "appwrite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { createHistorico, deleteFicheiro } from "@/lib/appwrite/api";
import { INewHistorico } from "@/types";
import Acoes from "@/constants/Acoes";



type FicheiroCardProps = {
    ficheiro: Models.Document;
}

const FicheiroCard = ({ ficheiro }: FicheiroCardProps) => {
    const { id:id , id_g:id_g } = useParams();
    const { data: user } = useGetCurrentUser();
    const navigate = useNavigate();
    const newHistorico: INewHistorico = {
        mensagem: `O usuario ${user?.name} apagou a seguinte Ficheiro do grupo "${ficheiro?.nome}"`,
        user: user?.$id || '',
        acao: Acoes.remover,
        grupo: id_g || '',
      }
      const handleDeleteFile = async () => {
        await deleteFicheiro(ficheiro.$id, ficheiro.fileId);
        await createHistorico(newHistorico);
        // Atualiza a página
        navigate(`/disciplina/${id}/grupo/${id_g}/ficheiros`);
    };
    return (

        <div className="message--body">
            <div className="flex-between">
                <div className="flex flex-ln items-center ml-5 mr-5">
                    <Link to={`/disciplina/${id}/grupo/${id_g}/ficheiros`} >
                        <p>{ficheiro.nome}</p>
                    </Link>                    
                    <div className="flex-center text-center text-light-3">
                        <p className="subtle-semibold lg:small-regular ml-5 mr-5">
                            {formatDateString(ficheiro.$createdAt)}
                        </p>
                    </div>                    
                </div>
                <div className=" flex flex-ln items-center ml-5 mr-5">
                    <ul className="flex-center ml-3 mr-3 ">
                        <p className="flex text-center ">{ficheiro.data}</p>
                        <div className="flex w-full items-end ml-3 mr-3 ">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => downloadFile(ficheiro.fileUrl, "iColab" + ficheiro.nome + "."+ ficheiro.extensao )}>
                                            <img className="shadcn-btn flex ml-2 mr-2" src="/assets/icons/download.png" alt="download" width={40} height={40} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="shadcn-tooltip-content">
                                        <p className="small-medium lg:base-medium">Download do pdf ou Zip do ficheiro</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to={ficheiro.fileUrl} target="_blank" download>
                                            <img className="flex ml-2 mr-2" src="/assets/icons/search.svg" width={40} height={40} />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="small-medium lg:base-medium">Preview do pdf no seu browser, Atenção!!! Abre uma nova Janela</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className={`${user?.$id !== ficheiro.remetente.$id && 'hidden'}`}  onClick={handleDeleteFile}>
                                            <img className="flex ml-2 mr-2" src="/assets/icons/delete.svg" width={40} height={40} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="small-medium lg:base-medium">Apagar Ficheiro</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </ul>

                </div>
            </div>
            <hr />
        </div>
    );
};

export default FicheiroCard