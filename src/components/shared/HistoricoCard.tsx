
import {multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";



type HistoricoCardProps = {
    historico: Models.Document;
}

const HistoricoCard = ({ historico }: HistoricoCardProps) => {
    return (
        <div className="message--body">
            <div className="flex-between">
                <div className="flex flex-ln items-center ml-5 mr-5">
                        <p>{historico?.mensagem}</p>
                    <div className="flex-center text-center text-light-3">
                        <p className="subtle-semibold lg:small-regular ml-5 mr-5">
                            {multiFormatDateString(historico.$createdAt)}
                        </p>
                    </div>                    
                </div>
                <div className=" flex flex-ln items-center ml-5 mr-5">
                    <ul className="flex-center ml-3 mr-3 ">
                        <p className="flex text-center ">{historico.acao}</p>
                        <div className="flex w-full items-end ml-3 mr-3 ">
                        </div>
                    </ul>
                </div>
            
            </div>
            <hr />
        </div>
    );
};

export default HistoricoCard