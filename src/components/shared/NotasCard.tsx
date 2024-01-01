
import { formatDateString } from "@/lib/utils";

import { Models } from "appwrite";




type NotaCardProps = {
    nota: Models.Document;
}

const NotaCard = ({ nota }: NotaCardProps) => {
    return (
        <div className="message--body">
            <div className="flex-between">
                <div className="flex flex-ln items-center ml-5 mr-5">
                    <div className="flex flex-col items-center ml-5 mr-5">
                        Disciplina
                        <p>{nota.disciplina.nome}</p>
                    </div>
                    <div className="flex flex-col items-center ml-5 mr-5">
                        Grupo
                        <p>{nota.grupo.nome}</p>
                    </div>
                    <div className="flex flex-col items-center ml-5 mr-5">
                        Nota
                        <p>{nota.nota}</p>
                    </div>
                    <div className="flex flex-col items-center ml-5 mr-5">
                        Momento
                        <p>{nota.momento}</p>              
                    </div>
                    <div className="flex-center text-center text-light-3">
                        <p className="subtle-semibold lg:small-regular ml-5 mr-5">
                            {formatDateString(nota.$createdAt)}
                        </p>
                    </div>                    
                </div>
                <div className=" flex flex-ln items-center ml-5 mr-5">
                    <ul className="flex-center ml-3 mr-3 ">
                        <p className="flex text-center ">{nota.data}</p>
                        <div className="flex w-full items-end ml-3 mr-3 ">
                        </div>
                    </ul>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default NotaCard