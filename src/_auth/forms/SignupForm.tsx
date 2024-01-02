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


const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccountMutation();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccountMutation();

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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm ">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o seu curso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
          <p className='text-small-regular text-light-2 text-center mt-2'>
            Já tem uma conta?
            <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1'> Connectar-se
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm