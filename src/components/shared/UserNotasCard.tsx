
import Acoes from "@/constants/Acoes";
import { createHistorico, deleteNota } from "@/lib/appwrite/api";
import { NotaValidation } from "@/lib/validation";
import { INewHistorico } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useState } from "react";
import {  useGetCurrentUser, useUpdateNota } from "@/lib/react-query/queriesAndMutations";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";
import Loader from "./Loader";




type UserCardProps = {
    user: Models.Document;
    nota: Models.Document;
}

const UserCard = ({ user, nota }: UserCardProps) => {
    const navigate = useNavigate();
    const { id: id, id_g: id_g } = useParams()
    const [action, setAction] = useState<"Editar" | "Criar">("Editar"); // Estado para controlar a ação
    const [formVisible, setFormVisible] = useState(false);
    const { data: currenteUser } = useGetCurrentUser();
    const [refresh, setRefresh] = useState(false);
    let profOuAluno = currenteUser?.docente ? 'Professor' : 'Aluno';
    const form = useForm<z.infer<typeof NotaValidation>>({
        resolver: zodResolver(NotaValidation),
        defaultValues: {
            nota: nota?.nota.toString() ? nota.nota.toString() : "20",
            momento: nota?.momento ? nota.momento : "M1",
        },
    })

    const hideForm = () => {
        setFormVisible(false);
    };

    // Function to handle refresh
    const handleRefresh = () => {
        setRefresh(!refresh); // Toggle the state to trigger a re-render/ Mostrar o formulário ao atualizar
    };
    const showForm = () => {
        setFormVisible(true);
    };

    const { mutateAsync: updateNota, isPending: isLoadingUpdate }
        = useUpdateNota();

    const newHistorico: INewHistorico = {
        mensagem: `O usuario ${user?.name} apagou a seguinte Nota do aluno "${nota?.aluno?.nome}"`,
        user: user?.$id || '',
        acao: Acoes.remover,
        grupo: id_g || '',
    }
    const handleDeleteNota = async () => {
        console.log("Entrei no remover");
        await deleteNota(nota?.$id);
        await createHistorico(newHistorico);
        // Atualiza a página
        handleRefresh();
        navigate(`/disciplina/${id}/grupo/${id_g}/notas`);
    };

    const handleSubmit = async (value: z.infer<typeof NotaValidation>) => {
        // ACTION = UPDATE
        console.log(value)
        const updatedNota = await updateNota({
            ...value,
            notaId: nota?.$id,
            nota: value.nota,
            momento: value.momento,
        });

        if (!updatedNota) {
            toast({
                title: `${action} Falhou ao atualizar a Nota.`,
            });
        }
        const newHistorico: INewHistorico = {
            mensagem: `O usuario ${currenteUser?.name} atualizou a seguinte nota do aluno "${user.name}" do momento de avaliacao ${value?.momento}`,
            user: user?.$id || '',
            acao: Acoes.editar,
            grupo: id_g || '',
        }
        await createHistorico(newHistorico);
        hideForm()
        handleRefresh()

    };
    return (
        <div className="profile-inner_container">
            <div className="flex-between flex-center text-purple-400 text-left w-full">
                <div className=" flex flex-col align-middle gap-2">
                    <p className="body-bold">Momento: {nota?.momento}</p>
                    <p className="body-bold">Nota: {nota?.nota}</p>
                    <div className={`${!formVisible && "hidden"}`}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                                <FormField
                                    control={form.control}
                                    name="nota"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="shad-form_label">Nota</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nota" type="number" className="shad-input" {...field} />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="momento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="shad-form_label">Momento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="M1" className="shad-input" {...field} />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4 items-center justify-end">
                                    <Button type="button" className="shad-button_dark_4" onClick={() => hideForm()}>Cancelar</Button>
                                    <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingUpdate}>{(isLoadingUpdate) && <Loader />}{action}</Button>
                                </div>
                            </form>
                        </Form>
                    </div >
                </div>
                <div className="flex flex-lnitems-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className={`${profOuAluno !== 'Professor' && 'hidden'}`} onClick={() => {
                                    showForm();
                                    setAction("Editar");
                                    handleRefresh();
                                }}>
                                    <img className="flex mb-5" src="/assets/icons/edit.svg" width={35} height={35} aria-placeholder="Editar" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="small-medium lg:base-medium">Editar Nota</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className={`${profOuAluno !== 'Professor' && 'hidden'}`} onClick={handleDeleteNota}>
                                    <img className="flex mb-5" src="/assets/icons/delete.svg" width={35} height={35} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="small-medium lg:base-medium">Apagar Nota</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

            </div>
        </div>
    );
};

export default UserCard