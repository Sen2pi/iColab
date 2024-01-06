
import { cn, formatDateString } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Models } from "appwrite";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useGetCurrentUser, useGetGrupoById, useGetRecentInscricoes, useGetRecentRequesitos, useUpdateTarefa } from "@/lib/react-query/queriesAndMutations";
import { createHistorico, deleteTarefa } from "@/lib/appwrite/api";
import { INewHistorico } from "@/types";
import Acoes from "@/constants/Acoes";
import { z } from "zod";
import { TarefaValidation } from "@/lib/validation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "../ui/input";
import Loader from "./Loader";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";




type TarefaCardProps = {
    tarefa: Models.Document;
}

const TarefaCard = ({ tarefa }: TarefaCardProps) => {
    const { id_g: id_g } = useParams();
    const { data: user } = useGetCurrentUser();
    const { data: grupo } = useGetGrupoById(id_g || "");
    const { data: inscricoes  } = useGetRecentInscricoes()
    const { data: requesitos } = useGetRecentRequesitos()
    const navigate = useNavigate();
    const { toast } = useToast();
    const [action, setAction] = useState<"Editar" | "Criar">("Editar"); // Estado para controlar a ação
    const [formVisible, setFormVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const showForm = () => {
        setFormVisible(true);
    };
    const form = useForm<z.infer<typeof TarefaValidation>>({
        resolver: zodResolver(TarefaValidation),
        defaultValues: {
            content: "Fazer tarefa card",
            grupo: grupo?.$id || "",
            atribuido: "",
            concluido: false,
            date: new Date(),
            requesito: "",
        },
    })
    // Função para ocultar o formulário
    const hideForm = () => {
        setFormVisible(false);
    };

    // Function to handle refresh
    const handleRefresh = () => {
        setRefresh(!refresh); // Toggle the state to trigger a re-render/ Mostrar o formulário ao atualizar
    };
    //2 -  Query

    const { mutateAsync: updateTarefa, isPending: isLoadingUpdate }
        = useUpdateTarefa();
    const handleSubmit = async (value: z.infer<typeof TarefaValidation>) => {
        // ACTION = UPDATE
        if (tarefa && action == "Editar") {
            const updatedTarefa = await updateTarefa({
                ...value,
                tarefaId: tarefa?.$id || " ",
            });

            if (!updatedTarefa) {
                toast({
                    title: `${action} Falhou ao atualizar a Tarefa.`,
                });
            }
            const newHistorico: INewHistorico = {
                mensagem: `O usuario ${user?.name} atualizou a seguinte  tarefa no grupo "${value?.content}"`,
                user: user?.$id || '',
                acao: Acoes.editar,
                grupo: id_g || '',
            }
            await createHistorico(newHistorico);
            hideForm()
            handleRefresh()
            navigate(0);
        }

        // ACTION = CREATE

    };

    const newHistorico: INewHistorico = {
        mensagem: `O usuario ${user?.name} apagou a seguinte Tarefa do grupo "${tarefa?.nome}"`,
        user: user?.$id || '',
        acao: Acoes.remover,
        grupo: id_g || '',
    }

    const handleDeleteTarefa = async () => {
        await deleteTarefa(tarefa.$id);
        await createHistorico(newHistorico);
        // Atualiza a página
        hideForm()
        handleRefresh()
        navigate(0);
    };

    return (
        <div className="">
            <div className="flex-between">
                <div className="flex flex-ln items-center ml-5 mr-5">
                    <div className={`${!formVisible && "hidden"}`}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="shad-form_label">Descriçãoo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Bloqueado" className="shad-input" {...field} />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Prazo</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        className="bg-black"
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date("2030-12-30") || date < new Date("2023-12-30")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="atribuido"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Atribuir tarefa a:</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    {inscricoes?.documents.map((inscricao) => (
                                                         id_g === inscricao.grupo.$id && !inscricao?.inscrito?.docente &&(
                                                        <FormItem
                                                            key={inscricao.inscrito.$id}
                                                            className="flex items-center space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <RadioGroupItem value={inscricao.inscrito.$id} />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {inscricao.inscrito.name + " "}
                                                                {inscricao.inscrito.numero}
                                                            </FormLabel>
                                                        </FormItem>
    )))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="requesito"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Inserir tarefa no container: </FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    {requesitos?.documents.map((requesito) => (
                                                         id_g === requesito.grupo.$id  &&(
                                                        <FormItem
                                                            key={requesito.$id}
                                                            className="flex items-center space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <RadioGroupItem value={requesito.$id} />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                {requesito.title}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="concluido"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Concluido:
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4 items-center justify-end">
                                    <Button type="button" className="shad-button_dark_4" onClick={() => hideForm()}>Cancelar</Button>
                                    <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingUpdate}>{(isLoadingUpdate) && <Loader />}{action}</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <p>{tarefa.content}</p>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className={`${(user?.$id !== grupo?.lider.$id && 'hidden') || (user?.$id !== tarefa?.atribuido.$id && 'hidden')}`} onClick={() => {
                                    showForm();
                                    setAction("Editar");
                                    handleRefresh();
                                }}>
                                    <img className="flex mb-5" src="/assets/icons/edit.svg" width={35} height={35} aria-placeholder="Editar" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="small-medium lg:base-medium">Editar Tarefa</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button className={`${user?.$id !== grupo?.lider.$id && 'hidden'}`} onClick={handleDeleteTarefa}>
                                    <img className="flex ml-2 mr-2" src="/assets/icons/delete.svg" width={40} height={40} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="small-medium lg:base-medium">Apagar Tarefa</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex-center text-center text-light-3">
                        <p className="subtle-semibold lg:small-regular ml-5 mr-5">
                            {formatDateString(tarefa.$createdAt)}
                        </p>
                    </div>
                </div>
                <div className=" flex flex-ln items-center ml-5 mr-5">
                    <ul className="flex-center ml-3 mr-3 ">
                        <p className="flex text-center ">{tarefa.date}</p>
                        <div className="flex w-full items-end ml-3 mr-3 ">
                        </div>
                    </ul>

                </div>
            </div>
            <hr />
        </div>
    );
};

export default TarefaCard