
import { cn } from "@/lib/utils";
import { Models } from "appwrite";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import {  useCreateTarefa, useGetGrupoById, useGetRecentInscricoes, useGetRecentRequesitos } from "@/lib/react-query/queriesAndMutations";
import { z } from "zod";
import { TarefaValidation } from "@/lib/validation";
import { useToast } from "../ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import Loader from "../shared/Loader";




type TarefaFormProps = {
    action: 'Create';
};

const TarefaForm = ({ action }: TarefaFormProps) => {

    const { id:id,  id_g: id_g } = useParams();
    const { data: grupo } = useGetGrupoById(id_g || "");
    const { data: inscricoes, isPending: isInscricaoLoading } = useGetRecentInscricoes()
    const { data: requesitos, isPending: isRequesitoLoading } = useGetRecentRequesitos()
    const navigate = useNavigate();
    const { toast } = useToast();
    // Estado para controlar a ação

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


const { mutateAsync: createTarefa, isPending: isLoadingCreate }
    = useCreateTarefa();
const handleSubmit = async (value: z.infer<typeof TarefaValidation>) => {
    // ACTION = CREATE
    const newTarefa = await createTarefa({
        ...value,
        grupo: id_g || "",
      });
      console.log(newTarefa);
      if (!newTarefa) {
        toast({
          title: `${action} Falhou a criar a Grupo, por favor tente novamente.`,
        });
      }
      navigate(`/disciplina/${id}/grupo/${id_g}/tarefas`);
};
return (
 
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
                                    <PopoverContent className="w-auto bg-black p-0" align="start">
                                        <Calendar
                                            className="w-auto bg-black p-0"
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
                            <FormItem>
                                <FormLabel>Selecione um membro do grupo: </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um membro"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="w-auto bg-black p-0" >
                                        {isInscricaoLoading && !inscricoes ? (
                                            <Loader />
                                        ) : (
                                            <SelectContent className="w-auto bg-black p-0" >
                                                {inscricoes?.documents.map((inscricao: Models.Document) => {
                                                    if (inscricao?.grupo.$id === id_g)
                                                        return (
                                                            <SelectItem
                                                                onSelect={field.onChange}
                                                                key={inscricao.$createdAt}
                                                                value={inscricao?.inscrito.$id}
                                                            >
                                                                {inscricao?.inscrito.name + " "}
                                                                {inscricao?.inscrito.numero}

                                                            </SelectItem>
                                                        );
                                                })}
                                            </SelectContent>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="requesito"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Selecione um Container de Tarefa: </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Containers" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className=" bg-black p-0" >
                                        {isRequesitoLoading && !requesitos ? (
                                            <Loader />
                                        ) : (
                                            <SelectContent className=" bg-black p-0">
                                                {requesitos?.documents.map((requesito: Models.Document) => {
                                                    if (requesito?.grupo.$id === id_g)
                                                        return (
                                                            <SelectItem
                                                                onSelect={field.onChange}
                                                                key={requesito.$createdAt}
                                                                value={requesito?.$id}
                                                            >
                                                                {requesito?.title}

                                                            </SelectItem>
                                                        );
                                                })}
                                            </SelectContent>
                                        )}
                                    </SelectContent>
                                </Select>
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
                        <Button type="button" className="shad-button_dark_4" onClick={()=>navigate(-1)}>Cancelar</Button>
                        <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate}>{(isLoadingCreate) && <Loader />}{action}</Button>
                    </div>
                </form>
            </Form>
    );
 };
export default TarefaForm