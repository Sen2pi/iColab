import { zodResolver } from "@hookform/resolvers/zod"
import { Models } from "appwrite"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { useUserContext } from "@/context/AuthContext"
import FileUploader from "../shared/FileUploader"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/use-toast"
import { DisciplinaValidation } from "@/lib/validation"
import { useCreateDisciplina } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"

type DisciplinaFormProps = {
  disciplina?: Models.Document;
  action: "Create" | "Update";
};

const DisciplinaForm = ({ disciplina, action }: DisciplinaFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  // 1. Define your form.
  const form = useForm<z.infer<typeof DisciplinaValidation>>({
    resolver: zodResolver(DisciplinaValidation),
    defaultValues: {
      professor: user ? user.id : undefined,
      nome: disciplina ? disciplina.nome : "Programação",
      descricao: disciplina ? disciplina.descricao : "A Programação serve para desenvolver o pensamento lógico o seu objectivo nesta disciplina vai ser a criaçao de interfaces graficas para os usuarios",
      file: [],
      ano: disciplina ? disciplina.ano.parseInt() : "2023",
      inicio: disciplina ? disciplina.inicio : "",
      fim: disciplina ? disciplina.fim : "",
      curso: disciplina ? disciplina.curso : "Informática",
    },
  })
  //2 -  Query
  const { mutateAsync: createDisciplina, isPending: isLoadingCreate } = useCreateDisciplina();

  //3 - Handler
  const handleSubmit = async (value: z.infer<typeof DisciplinaValidation>) => {

    // ACTION = CREATE
    const newDisciplina = await createDisciplina({
      ...value,
      professor:user.id ,
      nome: value.nome,
      descricao: value.descricao,
      ano: parseInt(value.ano),
      file: value.file,
      imageId: disciplina? disciplina.imageId : "",
      imageUrl: disciplina? disciplina.imageUrl : "",
      inicio: value.inicio,
      fim: value.fim,
      curso: value.curso,
    });

    if (!newDisciplina) {
      toast({
        title: `${action} Falhou a criar a Disciplina, por favor tente novamente.`,
      });
    }
    navigate("/disciplina");
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
                <Textarea placeholder="A Programação serve para desenvolver o pensamento lógico o seu objectivo nesta disciplina vai ser a criaçao de interfaces graficas para os usuarios" className="shad-textarea custom-scrollbar" {...field} />
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
              <FormLabel className="shad-form_label">Insira a Imagem da sua disciplina</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={disciplina?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ano"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Ano Lectivo</FormLabel>
              <FormControl>
                <Input placeholder="2023" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Data de Inicio</FormLabel>
              <FormControl>
                <Input placeholder="2023-01-23" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fim"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Data de Fim</FormLabel>
              <FormControl>
                <Input placeholder="2023-01-23" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="curso"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Curso</FormLabel>
              <FormControl>
                <Input placeholder="Informática" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4" onClick={()=>navigate(-1)}>Cancelar</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate }>{(isLoadingCreate) && <Loader />}{action} Criar </Button>
        </div>
      </form>
    </Form>
  )
}


export default DisciplinaForm