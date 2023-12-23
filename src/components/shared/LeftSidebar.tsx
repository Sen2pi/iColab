import { sidebarLinks } from '@/constants';
import { useUserContext } from '@/context/AuthContext';
import { INavLink } from '@/types';
import { useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button';
import { useSignOutAccountMutation } from '@/lib/react-query/queriesAndMutations';


const LeftSidebar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccountMutation()
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const { user } = useUserContext();
  let profOuAluno = ""
  if(user.docente){
    profOuAluno = "Professor"    
  }else{
    profOuAluno = "Aluno"
  }
  useEffect(() => {
    if (isSuccess) navigate(0);
    }, [isSuccess])
  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
      <Link to="/" className="flex gap-3 items-center">
          <img 
            src='/assets/images/logo1.png'
            alt='logo'
            width={60}
            height={60}
            />
            <p>iColab</p>
        </Link>

        <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
          <img src={user.imageUrl || "/assets/images/profile-default.png"} alt="profile" className='h-16 w-16 rounded-full'/>
          <div className='flex flex-col'>
            <p className='body-bold'>{user.name}</p>
            <p className='small-regular text-light-3'>{user.email}</p>
            <p className='small-regular text-light-3'>{profOuAluno}</p>
            <p className='small-regular text-light-3'>{user.curso}</p>
          </div>

        </Link>

        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return(
              <li key={link.label} className={`leftsidebar-link group ${ isActive && 'bg-primary-600'}`}>
                <NavLink to={link.route} className="flex gap-4 items-center p-4">
                  <img 
                    src={link.imgURL} 
                    alt={link.label} 
                    className={`group-hover:invert-white ${isActive && 'invert-white'}`} 
                    />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button variant="ghost" className='shad-button_ghost' onClick={()=>signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
            <p className='small-medium lg:base-medium'>Desconnectar-se</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar