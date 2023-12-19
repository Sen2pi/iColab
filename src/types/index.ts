export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  //================================================================================================
  //===================================== USERS ====================================================
  //================================================================================================
  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    docente: boolean;
    curso: string;
    file: File[];
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    docente: boolean;
    bio: string;
    curso: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
    docente: boolean;
    curso:string;
  };
  //================================================================================================
  //===================================== DISCIPLINA ===============================================
  //================================================================================================
  export type INewDisciplina = {
    professor: string;
    nome: string;
    descricao: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
    ano: number;
    inicio: string;
    fim: string;
    curso: string;
  };
  
  export type IUpdateDisciplina = {
    disciplinaId: string;
    nome: string;
    descricao: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    ano: number;
    inicio: string;
    fim: string;
    curso: string;
  };