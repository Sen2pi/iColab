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
    file: File[];
    ano: string;
    inicio: Date;
    fim: Date;
    curso: string;
  };

  
  export type IUpdateDisciplina = {
    disciplinaId: string;
    nome: string;
    descricao: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    ano: string;
    inicio: Date;
    fim: Date;
    curso: string;
  };
  //======================================
  //===========MODULOS====================
  //======================================

  export type INewModulo = {
    disciplinas: string;
    nome: string;
    file: File[];
    descricao: string;
    completed: boolean;
  };

  export type IUpdateModulo = {
    moduloId: string;
    nome: string;
    descricao?: string;
    fileId: string;
    fileUrl: URL;
    file: File[];
  };

   //=====================================
  //===========GRUPOS====================
  //======================================
  export type INewGrupo = {
    disciplina: string;
    nome: string;
    lider: string;
    tema: string;
    prazo: Date;
    descricao: string;
  };

  export type IUpdateGrupo = {
    grupoId: string;
    nome?: string;
    lider: string;
    tema?: string;
    descricao?: string;
    nota: number;
    prazo: Date;
  };
   //=====================================
  //===========TAREFAS====================
  //======================================
  export type INewTarefa ={
    grupo: string;
    date: Date;
    concluido?: boolean;
    atribuido: string;
    columnId: string;
    content: string;
  }

  export type IUpdateTarefa = {
    tarefaId: string;
    date: Date;
    concluido?: boolean;
    atribuido: string;
    columnId: string;
    content: string;
  };

  export type TarefaF = {
    id: string;
    columnId: string;
    content: string;
    date: string; // You might want to use Date type here depending on your needs
  };

  //=====================================
  //===========REQUESITOS================
  //=====================================
  export type INewRequesito ={
    title: string;
    grupo: string;
    user: string,
  }
  export type Requesito = {
    title: string;
    grupo: string;
    user: string, // You might want to use Date type here depending on your needs
  };
  export type IUpdateRequesito = {
    requesitoId: string;
    title: string;
  };
  //=====================================
  //===========CHAT======================
  //=====================================
  export type INewMensagem = {
    chat: string;
    remetente: string;
    mensagem: string;
  };

  //=====================================
  //===========FICHEIRO==================
  //===================================== 
  export type INewFicheiro = {
    remetente: string;
    grupo: string;
    requesito?: string;
    nome: string;
    data: Date;
    file: File[];
  };
  //=====================================
  //===========HISTORICO==================
  //===================================== 
  export type INewHistorico = {
    mensagem: string;
    user: string;
    grupo: string;
    acao: string;
  };

//=====================================
//===========KANBAN====================
//=====================================
export type Column = {
  id: string;
  title: string;
};

export type Task = {
  id: string;
  columnId: string;
  content: string;
  date: string;
};


