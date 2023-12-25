import { zodResolver } from "@hookform/resolvers/zod"
import { Models } from "appwrite"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "../ui/use-toast"
import { GrupoValidation } from "@/lib/validation"
import { useCreateGrupo, useUpdateGrupo } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"

type GrupoFormProps = {
  grupo?: Models.Document;
  action: 'Create' | 'Update';
  disciplinaId: string;
};

const GrupoForm = ({ grupo, action }: GrupoFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {id} = useParams();
  // 1. Define your form.
  const form = useForm<z.infer<typeof GrupoValidation>>({
    resolver: zodResolver(GrupoValidation),
    defaultValues: {
      disciplina:id,
      nome: grupo ? grupo.nome : "",
      descricao: grupo ? grupo.descricao : "",
      tema: grupo? grupo.tema : "",
      prazo: grupo? grupo.prazo : "",
  }})
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
        grupoId: grupo.$id,
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
    console.log(newGrupo);
    if (!newGrupo) {
      toast({
        title: `${action} Falhou a criar a Grupo, por favor tente novamente.`,
      });
    }
    navigate(`/disciplina/${id}`);
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
                <Input placeholder="Programação de Interfaces" className="shad-input" {...field} />
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
            <FormItem>
              <FormLabel className="shad-form_label">Prazo</FormLabel>
              <FormControl>
                <Input placeholder="Programação de Interfaces" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4" onClick={()=>navigate(-1)}>Cancelar</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate }>{(isLoadingCreate || isLoadingUpdate) && <Loader />}{action}</Button>
        </div>
      </form>
    </Form>
  )
}


export default GrupoForm