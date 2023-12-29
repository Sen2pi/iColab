import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Button } from "../ui/button";
import { createHistorico, deleteMenssagem } from "@/lib/appwrite/api";
import { INewHistorico } from "@/types";
import Acoes from "@/constants/Acoes";
import { useParams } from "react-router-dom";

type MensagemCardProps = {
    mensagem: Models.Document;
}

const MensagemCard = ({ mensagem }: MensagemCardProps) => {
    const { data: user } = useGetCurrentUser();
    const {id_g:id_g} = useParams()
    const newHistorico: INewHistorico = {
        mensagem: `O usuario ${user?.name} apagou a seguinte mensagem do chat "${mensagem?.mensagem} ás "`,
        user: user?.$id || '',
        acao: Acoes.remover,
        grupo: id_g || '',
      }
    return (
            <div className={`message--wrapper post-card`}>
                <div>
                    <img src={mensagem.remetente.imageUrl} alt="avatar" className="avatar" />
                </div>
                <div>
                    <p className="message--header">{user?.name}</p>
                    <hr className="border w-full border-light-4/80" />
                    <div className={"message--body" + (mensagem.remetente.$id === user?.$id ? ' message--body--owner' : '')}>
                        <span>{mensagem.mensagem}</span>
                    </div>
                    <span className="message-timestamp">{multiFormatDateString(mensagem.$createdAt)}</span>
                    <div>
                        {user?.$id === mensagem?.remetente?.$id && (
                            <Button className="delete--btn flex-col" onClick={() => (deleteMenssagem(mensagem?.$id) , createHistorico(newHistorico))}>Apagar
                            </Button>
                        )}
                    </div>
                </div>
            </div>
    )
}

export default MensagemCard