import{ID, Query} from 'appwrite'
import { INewDisciplina, INewUser, IUpdateDisciplina } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';
  // ============================================================
// AUTH QUERIES
// ============================================================

export async function signInAccount(user: { email: string; password: string }) {
    try {
      const session = await account.createEmailSession(user.email, user.password);
  
      return session;
    } catch (error) {
      console.log(error);
    }
  }

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
      const session = await account.deleteSession("current");
      return session;
    } catch (error) {
      console.log(error);
    }
  }
  // ============================================================
// USER QUERIES
// ============================================================

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
        if(!newAccount) throw Error;

        const avatarUrl= avatars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
            docente: user.docente,
            curso: user.curso,
        })
        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}
export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?:string;
    docente?:boolean; 
    curso:string;
}){
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        );
        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}
// ============================================================
// =================DISCIPLINA QUERIES=========================
// ============================================================


export async function createDisciplina(disciplina: INewDisciplina) {
    try {
      //Upload do ficheiro :
      const uploadedFile = await uploadFile(disciplina.file[0]);
      if(!uploadedFile) throw Error;

      //Obter o url do ficheiro :
      const fileUrl = getFilePreview(uploadedFile.$id);
      if(!fileUrl) {
        deleteFile(uploadedFile.$id);  
        throw Error;
      }
      //gravar a disciplina no banco de dados :
      const newDisciplina = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.disciplinaCollectionId,
        ID.unique(),
        {
          professor: disciplina.professor,
          nome: disciplina.nome,
          descricao: disciplina.descricao,
          imageId: uploadedFile.$id,
          imageUrl: fileUrl,
          ano: parseInt(disciplina.ano),
          inicio: disciplina.inicio,
          fim: disciplina.fim,
          curso: disciplina.curso,
          /*  INewDisciplina Ordem:
              professor: string;
              nome: string;
              descricao: string;
              file: File[];
              imageId: string;
              imageUrl: URL | string;
              ano: number;
              inicio: string;
              fim: string;
              curso: string; 
          */
        }
      );
      if(!newDisciplina){
        await deleteFile(uploadedFile.$id);
        throw Error;  
      }
      return newDisciplina;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function updateDisciplina(disciplina: IUpdateDisciplina) {
  const hasFileToUpdate = disciplina.file.length > 0;
  try {
    let image = {
      imageUrl: disciplina.imageUrl,
      imageId: disciplina.imageId,
    }
    if(hasFileToUpdate) {
      //Upload do ficheiro :
      const uploadedFile = await uploadFile(disciplina.file[0]);
      if(!uploadedFile) throw Error;
  
      //Obter o url do ficheiro :
      const fileUrl = getFilePreview(uploadedFile.$id);
      if(!fileUrl) {
        deleteFile(uploadedFile.$id);  
        throw Error;
      }

      image= {...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
    }
    //gravar a disciplina no banco de dados :
    const updatedDisciplina = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.disciplinaCollectionId,
      disciplina.disciplinaId,
      {
        nome: disciplina.nome,
        descricao: disciplina.descricao,
        imageId: image.imageId,
        imageUrl: image.imageUrl,
        ano: parseInt(disciplina.ano),
        inicio: disciplina.inicio,
        fim: disciplina.fim,
        curso: disciplina.curso,
        /*  IUpdateDisciplina Ordem:
            nome: string;
            descricao: string;
            imageId: string;
            imageUrl: URL;
            file: File[];
            ano: number;
            inicio: string;
            fim: string;
            curso: string;
        */
      }
    );
    if(!updatedDisciplina){
      if(hasFileToUpdate){
        await deleteFile(image.imageId);
      }
      throw Error; 
    }

    if(hasFileToUpdate){
      await deleteFile(disciplina.imageId);
    }
    return {...updatedDisciplina,
      $id: disciplina.disciplinaId,
    }
  } catch (error) {
      console.log(error);
      return error;
  }
}

export async function getRecentDisciplinas() {
  const disciplinas = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.disciplinaCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  );
  if(!disciplinas) throw Error;
  return disciplinas;
}

export async function getDisciplinaById(disciplinaId: string) {
  try {
    const disciplina = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.disciplinaCollectionId,
      disciplinaId,
    );
    return disciplina;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteDisciplina(disciplinaId: string, imageId: string) {
  if(!disciplinaId || !imageId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.disciplinaCollectionId,
      disciplinaId,
    )
    return {status:'ok'}
  } catch (error) {
    console.log(error);
  }
}
export async function searchDisciplinas(searchTerm: string) {
  try {
    const disciplinas = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.disciplinaCollectionId,
      [Query.search("nome", searchTerm)]
    );

    if (!disciplinas) throw Error;

    return disciplinas;
  } catch (error) {
    console.log(error);
  }
}
//======================================================
//======================FILES ==========================
//======================================================

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file,
        );
        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
};

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId, 
      fileId,
      2000,
      2000,
      "top",
      100,
      );
      return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);

      return{status: "ok"}
    } catch (error) {
      console.log(error);
    }

}
//=================================================================
//=====================SAVES ======================================
//=================================================================
export async function saveDisciplina(disciplinaId: string, userId: string) {
  try {
    const savedDisciplina = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
          users: userId,
          disciplina: disciplinaId,
      }
    )
      if(!savedDisciplina) throw Error;
      return savedDisciplina;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedDisciplina(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    )
      if(!statusCode) throw Error;
      return {status: "ok"};
  } catch (error) {
    console.log(error);
  }
}