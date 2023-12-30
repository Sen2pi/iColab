import { Models } from "appwrite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import Loader from "./Loader";
import TarefaCard from "./TarefaCard";
import { useCreateRequesito, useGetCurrentUser, useGetGrupoById, useGetRecentTarefas, useUpdateRequesito } from "@/lib/react-query/queriesAndMutations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequesitoValidation } from "@/lib/validation";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { createHistorico, deleteRequesito } from "@/lib/appwrite/api";
import { INewHistorico } from "@/types";
import Acoes from "@/constants/Acoes";



type RequesitoCardProps = {
    requesito?: Models.Document;

}

const RequesitoCard = ({ requesito }: RequesitoCardProps) => {
    const { id: id, id_g: id_g } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { data: tarefas, isPending: isTarefaLoading } = useGetRecentTarefas();
    const { data: user } = useGetCurrentUser();
    const { data: grupo } = useGetGrupoById(id_g || "")
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
        setRefresh(!refresh); // Toggle the state to trigger a re-render/ Mostrar o formulário ao atualizar
    };
    //2 -  Query
    const { mutateAsync: createRequesito, isPending: isLoadingCreate }
        = useCreateRequesito();
    const { mutateAsync: updateRequesito, isPending: isLoadingUpdate }
        = useUpdateRequesito();

    const handleDeleteReqeusito = async () => {
        try {
            const newHistorico: INewHistorico = {
                mensagem: `O usuario ${user?.name} apagou a seguinte container das tarefas grupo "${requesito?.title}"`,
                user: user?.$id || '',
                acao: Acoes.remover,
                grupo: id_g || '',
            }
            await createHistorico(newHistorico);
            await deleteRequesito(requesito?.$id || " ");
            // Atualiza a página
            handleRefresh()
            navigate(0);
        } catch (error) {
            console.log(error)
        }
    };


    //3 - Handler
    const handleSubmit = async (value: z.infer<typeof RequesitoValidation>) => {
        // ACTION = UPDATE
        if (requesito && action == "Editar") {
            const updatedRequesito = await updateRequesito({
                ...value,
                requesitoId: requesito.$id,
            });

            if (!updatedRequesito) {
                toast({
                    title: `${action} Falhou ao atualizar a Requesito.`,
                });
            }
            const newHistorico: INewHistorico = {
                mensagem: `O usuario ${user?.name} atualizou a seguinte container das tarefas grupo "${requesito?.title}"`,
                user: user?.$id || '',
                acao: Acoes.editar,
                grupo: id_g || '',
            }
            await createHistorico(newHistorico);
            hideForm()
            return navigate(0);
        }
    };
    return (
        <div >
            <div className="post-card">
                <div className="flex-between">
                    <div className={`flex flex-ln items-center w-full h-full`}>
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
                                        <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>Cancelar</Button>
                                        <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate}>{(isLoadingCreate || isLoadingUpdate) && <Loader />}{action}</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                        <p className="py-2 px-2 ">{requesito?.title}</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className={`${user?.$id == grupo?.lider?.$id && 'hidden'}`} onClick={() => {
                                        showForm();
                                        setAction("Editar");
                                        handleRefresh();
                                    }}>
                                        <img className="flex mb-5" src="/assets/icons/edit.svg" width={35} height={35} aria-placeholder="Editar" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="small-medium lg:base-medium">Editar Container</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className={`${user?.$id == grupo?.lider?.$id && 'hidden'}`} onClick={handleDeleteReqeusito}>
                                        <img className="flex mb-5" src="/assets/icons/delete.svg" width={35} height={35} aria-placeholder="Apagar" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="small-medium lg:base-medium">Apagar Container</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <hr />
                <div>
                    <div className="flex-center text-center text-light-3">
                        {isTarefaLoading && !tarefas ?
                            (<Loader />) : (
                                <ul className="flex flex-col gap-5 p-2">
                                    {tarefas?.documents.map((tarefa: Models.Document) => {
                                        try {
                                            if (tarefa?.grupo?.$id == id_g && tarefa.requesito?.$id == requesito?.$id)
                                                return <TarefaCard tarefa={tarefa} key={tarefa?.$createdAt} />;
                                        } catch (error) { }
                                    })}
                                </ul>
                            )}
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link className={`${user?.$id == grupo?.lider?.$id && 'hidden'}`} to={`/disciplina/${id}/grupo/${id_g}/criar-requesito`}>
                                    <img className="flex mb-5" src="/assets/icons/create.png" width={35} height={35} aria-placeholder="Criar" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="small-medium lg:base-medium">Criar Tarefa</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
};

export default RequesitoCard