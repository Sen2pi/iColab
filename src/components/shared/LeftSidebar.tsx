import { sidebarLinks, sidebarLinksDisciplina, sidebarLinksGrupo, sidebarLinksGrupos } from '@/constants';
import { INavLink } from '@/types';
import { useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { useGetCurrentUser, useGetDisciplinaById, useSignOutAccountMutation } from '@/lib/react-query/queriesAndMutations';


const LeftSidebar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccountMutation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: user } = useGetCurrentUser();
  const { id: disciplinaId, g: grupos, id_g: grupo } = useParams();
  let profOuAluno = user?.docente ? 'Professor' : 'Aluno';
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  const sidebarToDisplay = disciplinaId ? (grupos ? (grupo ? sidebarLinksGrupo : sidebarLinksGrupos) : sidebarLinksDisciplina) : sidebarLinks;

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo1.png" alt="logo" width={60} height={60} />
          <p>iColab</p>
        </Link>

        <Link to={`/profile/${user?.$id}`} className="flex gap-3 items-center">
          <img
            src={user?.imageUrl || '/assets/images/profile-default.png'}
            alt="profile"
            className="h-16 w-16 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user?.name}</p>
            <p className="small-regular text-light-3">{user?.email}</p>
            <p className="small-regular text-light-3">{profOuAluno}</p>
            <p className="small-regular text-light-3">{user?.curso}</p>
          </div>
        </Link>
        <Button variant="ghost" className="shad-button_ghost" onClick={() => navigate(-1)}>
          <img src="/assets/icons/back.svg" alt="back" width={50} height={50} />Voltar
        </Button>

        <ul className="flex flex-col gap-6">
          {sidebarToDisplay.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`${profOuAluno === "Professor" && link.label === "A Minha Pauta" ? "hidden" : ""
                  } leftsidebar-link group ${isActive && "bg-primary-600"}`}
              >
                <NavLink to={link.route} className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                    width={40}
                    height={40}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Desconectar-se</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
