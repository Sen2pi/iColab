
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccountMutation } from '@/lib/react-query/queriesAndMutations'
import { useEffect } from 'react'
import { useUserContext } from '@/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/shared/theme-provider"

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccountMutation()
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { setTheme } = useTheme()
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess])
  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link to="/" className="flex gap-3 items-center">
          <img
            src='/assets/images/logo1.png'
            alt='logo'
            width={40}
            height={40}
          />
          <p>iColab</p>
        </Link>
        <div className='flex gap-4'>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Mudar de Tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" >
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Dia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Noite
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" className='shad-button_ghost' onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
            <img
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="profile"
              className='h-8 w-8 rounded-full'
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar