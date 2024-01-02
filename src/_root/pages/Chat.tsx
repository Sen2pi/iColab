
import {  useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { createHistorico, createMensagem } from '@/lib/appwrite/api';
import { useGetCurrentUser, useGetGrupoById, useGetRecentMensagens } from '@/lib/react-query/queriesAndMutations';
import { INewHistorico, INewMensagem } from '@/types';
import { Models } from 'appwrite';
import Loader from '@/components/shared/Loader';
import MensagemCard from '@/components/shared/MensagemCard';
import { Button } from '@/components/ui/button';
import Acoes from '@/constants/Acoes';


const Chat = () => {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  const { data: user } = useGetCurrentUser();
  const { id_g: id_g, id_c: id_c } = useParams();
  const { data: grupo } = useGetGrupoById(id_g || ' ');
  const { data: mensages, isPending: isMensagemLoading, refetch } = useGetRecentMensagens(id_c || ' ');
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<string[]>([]);

  const handleMensagemChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMensagem(event.target.value);
  };

  const handleEnviarMensagem = async () => {
    const newMensagem: INewMensagem = {
      chat: id_c || '',
      mensagem: mensagem,
      remetente: user?.$id || '',
    };
    const newHistorico: INewHistorico = {
      mensagem: `O usuario ${user?.name} enviou a seguinte mensagem no chat "${newMensagem.mensagem}"`,
      user: user?.$id || '',
      acao: Acoes.criar,
      grupo: grupo?.$id || '',
    }
    try {
      await createMensagem(newMensagem);
      await createHistorico( newHistorico );
      setMensagens([...mensagens, mensagem]);
      setMensagem('');
      // Refetch para atualizar as mensagens
      
      refetch();
    } catch (error) {
      toast({
        title: `$ Falhou a criar a Mensagem, por favor, tente novamente.`,
      });
    }
  };

  const handleClickEnviarMensagem = () => {
    handleEnviarMensagem();
    // Role para o final (bottom) após o envio da mensagem
    if (textareaRef) {
      textareaRef.scrollTop = textareaRef.scrollHeight;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleEnviarMensagem();
      }
    };

    if (textareaRef) {
      textareaRef.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (textareaRef) {
        textareaRef.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [textareaRef, handleEnviarMensagem, mensages]);

  return (
    <div className='px-2 py-2 w-full'>
      <div className="room--container h-5/6 ">
        <div>
          <h2 className='h3-bold md:h2-bold text-left p-2'>{grupo?.nome}</h2>
          <hr className="border w-full border-dark-4/80" />
          {isMensagemLoading && !mensagens ? (
            <Loader />
          ) : (
            <ul className="">
              {mensages?.documents.map((mensagem: Models.Document) => {
                try {
                  if (mensagem.chat.$id === id_c) return <MensagemCard mensagem={mensagem} key={mensagem.mensagem} />;
                } catch (error) {}
              })}
            </ul>
          )}
          <div className="post-detail"></div>
        </div>
      </div>
      <div className="message--form">
        <textarea
          className="shad-input w-full text-end py-3 px-3"
          value={mensagem}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleMensagemChange(event)}
          ref={(ref: HTMLTextAreaElement | null) => setTextareaRef(ref)}
        />
        <div>
          <Button onClick={handleClickEnviarMensagem} className="shad-button_ghost">
            <img src="/assets/icons/send.png" alt="send" className="" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;