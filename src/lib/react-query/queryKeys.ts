export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = 'createUserAccount',
  
    // USER KEYS
    GET_CURRENT_USER = 'getCurrentUser',
    GET_USERS = 'getUsers',
    GET_USER_BY_ID = 'getUserById',
    GET_USER_BY_NUMERO = 'getUserByNumero',
    GET_RECENT_USERS = 'getRecentUsers',
  
    // DISCIPLINA KEYS
    GET_DISCIPLINAS = 'getDisciplinas',
    GET_INFINITE_DISCIPLINAS = 'getInfiniteDisciplinas',
    GET_RECENT_DISCIPLINAS = 'getRecentDisciplinas',
    GET_DISCIPLINA_BY_ID = 'getDisciplinaById',
    GET_USER_DISCIPLINAS = 'getUserDisciplinas',
    GET_FILE_PREVIEW = 'getFilePreview',
  
    //MODULO KEYS 
    GET_MODULOS = 'getModulos',
    GET_INFINITE_MODULOS = 'getInfiniteModulos',
    GET_RECENT_MODULOS = 'getRecentModulos',
    GET_MODULO_BY_ID = 'getModuloById',
    GET_DISCIPLINA_MODULOS = 'getDisciplinaModulos',

    //GRUPO KEYS 
    GET_GRUPOS = 'getGrupos',
    GET_INFINITE_GRUPOS = 'getInfiniteGrupos',
    GET_RECENT_GRUPOS = 'getRecentGrupos',
    GET_GRUPO_BY_ID = 'getGrupoById',
    GET_DISCIPLINA_GRUPOS = 'getDisciplinaGrupos',
  
    //SAVES KEYS
    GET_SAVES = 'getSaves',
    GET_INFINITE_SAVES = 'getInfiniteSaves',
    GET_RECENT_SAVES = 'getRecentSaves',
    GET_SAVE_BY_ID = 'getSaveById',
    GET_USER_SAVES = 'getUserSaves',

    //CHAT KEYS
    GET_MENSAGENS = 'getMensagens',
    GET_INFINITE_MENSAGENS = 'getInfiniteMensagens',
    GET_RECENT_MENSAGENS = 'getRecentMenssagens',
    GET_CHAT_BY_ID = 'getChatById',
    GET_MENSAGEM_BY_ID = 'getMensagemById',
    GET_CHAT_MENSAGENS = 'getChatMensagens',

   //INSCRICOES KEYS
    GET_INSCRICOES = 'getSaves',
    GET_INFINITE_INSCRICOES = 'getInfiniteInscricoes',
    GET_RECENT_INSCRICOES = 'getRecentInscricoes',
    GET_INSCRICAO_BY_ID = 'getInscricaoById',
    GET_USER_INSCRICOES = 'getUserInscricoes',

    //FICHEIROS KEYS 
    GET_FICHEIROS = 'getFicheiros',
    GET_INFINITE_FICHEIROS = 'getInfiniteFicheiros',
    GET_RECENT_FICHEIROS = 'getRecentFicheiros',
    GET_FICHEIRO_BY_ID = 'getFicheiroById',
    GET_GRUPO_FICHEIROS = 'getGrupoFicheiros',

    
    //TAREFAS KEYS 
    GET_TAREFAS = 'getTarefas',
    GET_INFINITE_TAREFAS = 'getInfiniteTarefas',
    GET_RECENT_TAREFAS = 'getRecentTarefas',
    GET_TAREFA_BY_ID = 'getTarefasById',
    GET_GRUPO_TAREFAS = 'getGrupoTarefas',
    
    //REQUESITOS KEYS 
    GET_REQUESITOS = 'getRequesitos',
    GET_INFINITE_REQUESITOS = 'getInfiniteRequesitos',
    GET_RECENT_REQUESITOS = 'getRecentRequesitos',
    GET_REQUESITO_BY_ID = 'getRequesitoById',
    GET_GRUPO_REQUESITOS = 'getGrupoRequesitos',
    //  SEARCH KEYS
    SEARCH_DISCIPLINAS = 'getSearchDisciplinas',

    // HISTORICO KEYS
    GET_RECENT_HISTORICOS = 'getRecentHistoricos',
  }
