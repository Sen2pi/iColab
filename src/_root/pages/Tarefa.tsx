import Loader from '@/components/shared/Loader';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {  useCreateRequesito, useGetCurrentUser, useGetGrupoById, useGetRecentRequesitos } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Link, useNavigate, useParams } from 'react-router-dom';
import RequesitoCard from '@/components/shared/RequesitoCard';
import { RequesitoValidation } from '@/lib/validation';
import { toast, useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { INewHistorico } from '@/types';
import Acoes from '@/constants/Acoes';
import { createHistorico } from '@/lib/appwrite/api';

const Tarefa = () => {
  
  const { id: id, id_g: id_g} = useParams();
  const {data:grupo} = useGetGrupoById(id_g || "")
  const {data: user} = useGetCurrentUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: requesitos, isPending: isRequesitoLoading } = useGetRecentRequesitos();
  const [action, setAction] = useState<"Editar" | "Criar">("Editar"); // Estado para controlar a ação
  const [formVisible, setFormVisible] = useState(false); // Estado para controlar a visibilidade do formulário
  const form = useForm<z.infer<typeof RequesitoValidation>>({
        resolver: zodResolver(RequesitoValidation),
        defaultValues: {
            title: "Bloqueado",
            grupo: grupo?.$id || "",
            user: user?.$id || "",
        },
    })
    const [refresh, setRefresh] = useState(false);
    const showForm = () => {
        setFormVisible(true);
    };

    // Função para ocultar o formulário
    const hideForm = () => {
        setFormVisible(false);
    };

    // Function to handle refresh
    const handleRefresh = () => {
        setRefresh(!refresh); // Toggle the state to trigger a re-render
        showForm(); // Mostrar o formulário ao atualizar
    };
    //2 -  Query
    const { mutateAsync: createRequesito, isPending: isLoadingCreate }
        = useCreateRequesito();

    //3 - Handler
    const handleSubmit = async (value: z.infer<typeof RequesitoValidation>) => {

        // ACTION = CREATE
        const newRequesito = await createRequesito({
            ...value,
            grupo: id_g || "",
            user: user?.$id || "",
        });
        
        if (!newRequesito) {
            toast({
                title: `${action} Falhou a criar a Requesito, por favor tente novamente.`,
            });
        }
        const newHistorico: INewHistorico = {
          mensagem: `O usuario ${user?.name} atualizou a seguinte container das tarefas grupo "${value.title}"`,
          user: user?.$id || '',
          acao: Acoes.criar,
          grupo: id_g || '',
      }
      await createHistorico(newHistorico);
        handleRefresh();
        navigate(0);
    };

  return (
    <div className='px-2 py-2 w-full'>
      <div className="room--container h-full">
        <div className='flex flex-col w-full items-start gap-3'>
          <div className='flex flex-ln items-center gap-3'>
            <h2 className='h3-bold md:h2-bold text-left p-2'>Tarefas Por Container ( Estilo KANBAN ) </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className={`${user?.$id == grupo?.lider?.$id && 'hidden'}`} onClick={() => {
                                            showForm();
                                            setAction("Criar");
                                        }} >
                    <img className="flex mb-5" src="/assets/icons/create.png" width={35} height={35} aria-placeholder="Criar" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="small-medium lg:base-medium">Criar Container Tarefas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
          </div>
          <div className={`${!formVisible && "hidden"}`}>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="shad-form_label">Titulo</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Bloqueado" className="shad-input" {...field} />
                                                </FormControl>
                                                <FormMessage className="shad-form_message" />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-4 items-center justify-end">
                                        <Button type="button" className="shad-button_dark_4" onClick={() => navigate(0)}>Cancelar</Button>
                                        <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate }>{(isLoadingCreate ) && <Loader />}{action}</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
          {isRequesitoLoading && !requesitos ?
            (<Loader />) : (
              <ul className="message--body w-full flex flex-ln gap-5 p-2">
                {requesitos?.documents.map((requesito: Models.Document) => {
                  try {
                    
                    if (requesito?.user?.$id == user?.$id && requesito?.grupo?.$id == id_g)
                      return <RequesitoCard requesito={requesito} key={requesito.$createdAt} />;
                  } catch (error) { }
                })}
              </ul>
            )}
        </div>
      </div>
      
      </div>
  )
}

export default Tarefa