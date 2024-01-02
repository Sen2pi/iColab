import { useCreateNota, useGetCurrentUser, useGetRecentNotas } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import UserNotasCard from "./UserNotasCard";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { useState } from "react";
import { NotaValidation } from "@/lib/validation";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { INewHistorico } from "@/types";
import Acoes from "@/constants/Acoes";
import { createHistorico } from "@/lib/appwrite/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


type UserCardProps = {
    user: Models.Document;
    id_g?: string;
}

const UserCard = ({ user, id_g }: UserCardProps) => {
    const [action, setAction] = useState<"Editar" | "Criar">("Editar"); // Estado para controlar a ação
    const [formVisible, setFormVisible] = useState(false);
    const { id: id } = useParams();
    const navigate = useNavigate();
    const { data: currenteUser } = useGetCurrentUser();
    const [refresh, setRefresh] = useState(false);
    let profOuAluno = currenteUser?.docente ? 'Professor' : 'Aluno';
    const { data: notas, isPending: isSaveLoading } = useGetRecentNotas();
    const history = useLocation();
    const currentPath = history.pathname;
    const form = useForm<z.infer<typeof NotaValidation>>({
        resolver: zodResolver(NotaValidation),
        defaultValues: {
            nota: "0",
            momento: "M1",
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
    const { mutateAsync: createNota, isPending: isLoadingCreate }
        = useCreateNota();
    const handleSubmit = async (value: z.infer<typeof NotaValidation>) => {
        // ACTION = UPDATE

        // ACTION = CREATE
        const newNota = await createNota({
            ...value,
            grupo: id_g || " ",
            aluno: user?.$id || "",
            disciplina: id || "",
        });

        if (!newNota) {
            toast({
                title: `${action} Falhou a criar a Requesito, por favor tente novamente.`,
            });
        }
        const newHistorico: INewHistorico = {
            mensagem: `O usuario ${currenteUser?.name} deu ${value.nota} ao aluno ${user.name} para o momento de avaliação "${value.momento}"`,
            user: user?.$id || '',
            acao: Acoes.criar,
            grupo: id_g || '',
        }
        await createHistorico(newHistorico);
        handleRefresh();
        hideForm();
        navigate(0);
    };
    return (
        <div className="message--body">
            <div className="flex-between flex-center text-purple-400 text-left w-full">
                <div className="flex-center gap-2">
                    <img
                        src={user?.imageUrl || '/assets/images/profile-default.png'}
                        alt="profile"
                        className="h-16 w-16 rounded-full"
                    />
                    <Link to={`/profile/${user?.$id}`} className="flex-center px-2 gap-2 items-center">
                        <div className="flex flex-col">
                            <p className="body-bold">{user?.name}</p>
                            <p className="small-regular text-light-3">{user?.email}</p>
                            <p className="small-regular text-light-3">{user?.numero}</p>
                            <p className="small-regular text-light-3">{user?.curso}</p>
                        </div>
                    </Link>
                </div>
                <div className="flex-center px-5 ">
                    {isSaveLoading && !notas ?
                        (<Loader />) : (
                            <ul >
                                {notas?.documents.map((nota: Models.Document) => (

                                    id_g === nota?.grupo.$id && nota?.aluno.$id == user?.$id && (
                                        <UserNotasCard user={user} nota={nota} key={nota.$createdAt} />
                                    )
                                ))}
                            </ul>
                        )}
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
                                    <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate}>{(isLoadingCreate) && <Loader />}{action}</Button>
                                </div>
                            </form>
                        </Form>
                    </div >
                    <div className={`${profOuAluno !== 'Professor' && currentPath !== `/disciplina/${id}/grupo/${id_g}/Notas` && 'hidden'}`}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={() => {
                                        showForm();
                                        setAction("Criar");
                                        handleRefresh();
                                    }} >
                                        <img className="flex mb-5" src="/assets/icons/create.png" width={35} height={35} aria-placeholder="Criar" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="small-medium lg:base-medium">Dar Nota</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard