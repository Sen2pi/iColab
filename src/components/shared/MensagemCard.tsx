import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Button } from "../ui/button";
import { deleteMenssagem } from "@/lib/appwrite/api";

type MensagemCardProps = {
    mensagem: Models.Document;
}

const MensagemCard = ({ mensagem }: MensagemCardProps) => {
    const { data: user } = useGetCurrentUser();
    return (
            <div className={`message--wrapper post-card`}>
                <div>
                    <img src={mensagem.remetente.imageUrl} alt="avatar" className="avatar" />
                </div>
                <div>
                    <p className="message--header">{user?.name}</p>
                    <hr className="border w-full px-1 border-light-4/80" />
                    <div className={"message--body" + (mensagem.remetente.$id === user?.$id ? ' message--body--owner' : '')}>
                        <span>{mensagem.mensagem}</span>
                    </div>
                    <span className="message-timestamp">{multiFormatDateString(mensagem.$createdAt)}</span>
                </div>
                <div>
                    {user?.$id === mensagem.remetente && (
                        <Button className="delete--btn" onClick={() => { deleteMenssagem(mensagem.$id) }}>
                            <img src="/assets/icons/delete.svg" alt="" /></Button>
                    )}
                </div>
            </div>
    )
}

export default MensagemCard