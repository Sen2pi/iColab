import {Client, Account , Databases, Storage, Avatars} from 'appwrite'

export const appwriteConfig ={
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    ficheiroCollectionId: import.meta.env.VITE_APPWRITE_FICHEIRO_COLLECTIONS_ID,
    historicoCollectionId: import.meta.env.VITE_APPWRITE_HISTORICO_COLLECTIONS_ID,
    mensagemCollectionId: import.meta.env.VITE_APPWRITE_MENSAGEM_COLLECTIONS_ID,
    chatCollectionId: import.meta.env.VITE_APPWRITE_CHAT_COLLECTIONS_ID,
    requesitoCollectionId: import.meta.env.VITE_APPWRITE_REQUESITO_COLLECTIONS_ID,
    grupoCollectionId: import.meta.env.VITE_APPWRITE_GRUPO_COLLECTIONS_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTIONS_ID,
    inscricaoCollectionId: import.meta.env.VITE_APPWRITE_INSCRICAO_COLLECTIONS_ID,
    tarefaCollectionId: import.meta.env.VITE_APPWRITE_TAREFA_COLLECTIONS_ID,
    disciplinaCollectionId: import.meta.env.VITE_APPWRITE_DISCIPLINA_COLLECTIONS_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVE_COLLECTIONS_ID,
    moduloCollectionId: import.meta.env.VITE_APPWRITE_MODULO_COLLECTION_ID,
    notaCollectionId: import.meta.env.VITE_APPWRITE_NOTA_COLLECTION_ID,
}

export const client = new Client().setProject(appwriteConfig.projectId).setEndpoint(appwriteConfig.url)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);