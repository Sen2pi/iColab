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
import { ModuloValidation } from "@/lib/validation"
import { useCreateModulo, useUpdateModulo } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"

type ModuloFormProps = {
  modulo?: Models.Document;
  action: 'Create' | 'Update';
};

const ModuloForm = ({ modulo, action }: ModuloFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {id} = useParams();
  // 1. Define your form.
  const form = useForm<z.infer<typeof ModuloValidation>>({
    resolver: zodResolver(ModuloValidation),
    defaultValues: {
      disciplinas:id,
      nome: modulo ? modulo.nome : "",
      descricao: modulo ? modulo.descricao : "",
      file: [],
    },
  })
  //2 -  Query
  const { mutateAsync: createModulo, isPending: isLoadingCreate } 
  = useCreateModulo();
  const { mutateAsync: updateModulo, isPending: isLoadingUpdate } 
  = useUpdateModulo();

  //3 - Handler
  const handleSubmit = async (value: z.infer<typeof ModuloValidation>) => { 
    // ACTION = UPDATE
    if (modulo && action === "Update") {
      const updatedModulo = await updateModulo({
        ...value,
        moduloId: modulo.$id,
        fileId: modulo.fileId,
        fileUrl: modulo.fileUrl,
      });

      if (!updatedModulo) {
        toast({
          title: `${action} Falhou ao atualizar a Modulo.`,
        });
      }
      return navigate(-1);
    }

    // ACTION = CREATE
    const newModulo = await createModulo({
      ...value,
      disciplinas: id ? id : "",
      completed: false,
    });
    console.log(newModulo);
    if (!newModulo) {
      toast({
        title: `${action} Falhou a criar a Modulo, por favor tente novamente.`,
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
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="A Programação serve para desenvolver o pensamento lógico o seu objectivo nesta modulo vai ser a criaçao de interfaces graficas para os usuarios" className="shad-textarea custom-scrollbar" {...field} />
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
              <FormLabel className="shad-form_label">Insira o Ficheiro do seu modulo</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={modulo?.fileUrl ? modulo.fileUrl : "/assets/icons/file-upload.svg"}
                />
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


export default ModuloForm