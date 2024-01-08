import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { SignupValidation } from '@/lib/validation'
import { z } from 'zod'
import Loader from '@/components/shared/Loader'
import { useCreateUserAccountMutation, useSignInAccountMutation } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/shared/theme-provider'
import { Moon, Sun } from "lucide-react"

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccountMutation();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccountMutation();
  const { theme, setTheme } = useTheme()

  // 1 . define your form
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "Aluno",
      username: "Colaborativo",
      email: "AXXXXXXX@umaia.pt",
      password: "",
      docente: false,
      curso: "Informática",
      numero:"A042542",
    },
  })

  // 2. Define a submit handler
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // create the user 
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({
        title: "Falhou na conexão, tente de novo ",
      })
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      toast({
        title: "A conexão falhou, por favor tente de novo "
      })
      navigate('/sign-in')
      return;
    }
    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      return toast({
        title: "A conexão falhou, por favor tente de novo "
      })
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img
          src='/assets/images/logo1.png'
          width="150"
          height="150"
        />

        <h2 className='h3-bold md:h2-bold pt-5 sm pt:12'>Criar uma nova conta</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>Para usar o iColab entre os detalhes da sua conta</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Nome Completo :</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='Name' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username :</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='Username' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email :</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='Email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Numero Mecanográfico :</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='AXXXXXXX / DXXXXXXX'  className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="docente"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormLabel>É um Professor?</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="curso"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4  ">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o seu curso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className={`${theme == 'light' &&' text-dark-2 bg-white' || theme == 'dark' &&' text-light-2 bg-black'}`} >
                    <SelectItem value="Informática">Informática</SelectItem>
                    <SelectItem value="Psicologia">Psicologia</SelectItem>
                    <SelectItem value="Desporto">Informática</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='shad-button_primary'>
            {isCreatingUser || isSigningIn || isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader /> Carregar...
              </div>) : ("Criar Conta")}
          </Button>
          <p className={`${theme == 'light' &&'text-small-regular text-dark-2 text-center mt-2 gap-3' || theme == 'dark' &&'text-small-regular text-light-2 text-center mt-2 gap-3'}`}>
            Já tem uma conta?
            <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1'> Connectar-se
            </Link>
          </p>
        </form>
            <DropdownMenu > 
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" >
              <Sun  className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon   className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Mudar de Tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className={`${theme == 'dark' && 'bg-black' || theme == 'light' && 'bg-white'}`}>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Dia
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Noite
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Form>
  )
}

export default SignupForm