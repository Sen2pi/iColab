import { zodResolver } from "@hookform/resolvers/zod"
import { Models } from "appwrite"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "../ui/use-toast"
import { GrupoValidation } from "@/lib/validation"
import { useCreateGrupo, useGetRecentInscricoes, useUpdateGrupo } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

type GrupoFormProps = {
  grupo?: Models.Document;
  action: 'Create' | 'Update';
};

const GrupoForm = ({ grupo, action }: GrupoFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: inscricoes, isPending: isInscricaoLoading } = useGetRecentInscricoes();
  const { id: id, id_g:id_g} = useParams();
  // 1. Define your form.
  const form = useForm<z.infer<typeof GrupoValidation>>({
    resolver: zodResolver(GrupoValidation),
    defaultValues: {
      disciplina: id,
      nome: grupo?.nome ? grupo?.nome : "",
      descricao: grupo?.descricao ? grupo?.descricao : "",
      tema: grupo?.tema ? grupo?.tema : "",
      prazo: grupo?.prazo ? grupo?.prazo : new Date(),
      lider: grupo?.lider ? grupo?.lider : "",
    }
  })
  //2 -  Query
  const { mutateAsync: createGrupo, isPending: isLoadingCreate }
    = useCreateGrupo();
  const { mutateAsync: updateGrupo, isPending: isLoadingUpdate }
    = useUpdateGrupo();

  //3 - Handler
  const handleSubmit = async (value: z.infer<typeof GrupoValidation>) => {
    // ACTION = UPDATE
    if (grupo && action === "Update") {  
      const updatedGrupo = await updateGrupo({
        ...value,
        grupoId: id_g || "",
        nome: value.nome,
        tema: value.tema,
        descricao: value.descricao,
        prazo: value.prazo,
        lider: value.lider,
        
      });
      
      if (!updatedGrupo) {
        toast({
          title: `${action} Falhou ao atualizar a Grupo.`,
        });
      }
      return navigate(-1);
    }
    // ACTION = CREATE
      const newGrupo = await createGrupo({
        ...value,
        disciplina: id ? id : "",
      });
   
      
      if (!newGrupo) {
        toast({
          title: `${action} Falhou a criar a Grupo, por favor tente novamente.`,
        });
      }
      navigate(`/disciplina/${id}/grupos`);
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Nome</FormLabel>
              <FormControl>
                <Input placeholder="Programação de Interfaces" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tema"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Tema</FormLabel>
              <FormControl>
                <Input placeholder="M1G152023/24" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="A Programação serve para desenvolver o pensamento lógico o seu objectivo nesta grupo vai ser a criaçao de interfaces graficas para os usuarios" className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prazo"
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
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date("2030-01-01") || date < new Date("2023-12-25")
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
                    name="lider"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Lider</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    {isInscricaoLoading && !inscricoes ?
                                        (<Loader />) : (inscricoes?.documents.map((inscricao) => (
                                          id_g === inscricao.grupo.$id && !inscricao?.inscrito?.docente &&(
                                            <FormItem
                                                key={inscricao?.$createdAt}
                                                className="flex items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <RadioGroupItem value={inscricao.inscrito.$id} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {inscricao?.inscrito?.name + " "}
                                                    {inscricao?.inscrito?.numero}
                                                </FormLabel>
                                            </FormItem>
                                        ))))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate}>{(isLoadingCreate || isLoadingUpdate) && <Loader />}{action}</Button>
        </div>
      </form>
    </Form>
  )
}


export default GrupoForm