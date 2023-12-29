import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FileUploader from "../shared/FileUploader"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "../ui/use-toast"
import { FicheiroValidation } from "@/lib/validation"
import { useCreateFicheiro, useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { INewHistorico } from "@/types"
import Acoes from "@/constants/Acoes"
import { createHistorico } from "@/lib/appwrite/api"


const FicheiroForm = () => {
  const navigate = useNavigate();
  const {data: user} = useGetCurrentUser();
  const { toast } = useToast();
  const {id:id, id_g:id_g , id_r:id_r} = useParams();
  // 1. Define your form.
  const form = useForm<z.infer<typeof FicheiroValidation>>({
    resolver: zodResolver(FicheiroValidation),
    defaultValues: {
      remetente: user?.$id,
      requesito: id_r ? id_r :" ",
      grupo: id_g ? id_g :" ",
      nome: "Teste",
      data: new Date(),
      file: [],
    },
  })
  //2 -  Query
  const { mutateAsync: createFicheiro, isPending: isLoadingCreate } 
  = useCreateFicheiro();

  //3 - Handler
  const handleSubmit = async (value: z.infer<typeof FicheiroValidation>) => { 
    console.log("Form Values:", value);
    // ACTION = CREATE
    const newFicheiro = await createFicheiro({
      ...value,
      remetente: user?.$id? user.$id : "",
      grupo: id_g ? id_g : "",
      requesito: id_r ? id_r : "",
    });
    const newHistorico: INewHistorico = {
      mensagem: `O usuario ${user?.name} criou o seguinte ficheiro no grupo "${value?.nome}"`,
      user: user?.$id || '',
      acao: Acoes.criar,
      grupo: id_g || '',
    }
    createHistorico(newHistorico);
    if (!newFicheiro) {
      toast({
        title: `Falhou a criar a Ficheiro, por favor tente novamente.`,
      });
    }
    navigate(`/disciplina/${id}/grupo/${id_g}/ficheiros`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="shad-form_label">Data</FormLabel>
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
                      date > new Date("2030-01-01") || date < new Date("1900-01-01")
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
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Insira o Ficheiro do seu ficheiro</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl="/assets/icons/file-upload.svg"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4" onClick={()=>navigate(-1)}>Cancelar</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate}>{isLoadingCreate && <Loader/>}Criar</Button>
        </div>
      </form>
    </Form>
  )
}


export default FicheiroForm