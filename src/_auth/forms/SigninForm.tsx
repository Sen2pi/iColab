import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { SigninValidation } from '@/lib/validation'
import { z } from 'zod'
import Loader from '@/components/shared/Loader'
import { useSignInAccountMutation } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'


const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: signInAccount } = useSignInAccountMutation();

  // 1 . define your form
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "A conexão falhou, por favor tente de novo "
      })
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
        <h2 className='h3-bold md:h2-bold pt-5 sm pt:12'>Connectar-se com a sua conta</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>Bem-vindo, insira as suas credenciais por favor!</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='text' placeholder='Email XXXXXX@umaia.pt' className='shad-input' {...field} />
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
          <Button type="submit" className='shad-button_primary'>
            { isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader /> Carregar...
              </div>) : "Connectar-se"}
          </Button>
          <p className='text-small-regular text-light-2 text-center mt-2'>
            Ainda não tem uma conta?
            <Link to="/sign-up" className='text-primary-500 text-small-semibold ml-1'> Criar uma nova conta
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm