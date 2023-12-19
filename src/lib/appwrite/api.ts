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
// DISCIPLINA QUERIES
// ============================================================

// ============================== CREATE DISCIPLINA
export async function createDisciplina(disciplina: INewDisciplina) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(disciplina.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      // Create disciplina
        const newDisciplina = await databases.createDocument(
       
        appwriteConfig.databaseId,
        appwriteConfig.disciplinaCollectionId,
        ID.unique(),
        {
          professor: disciplina.professor,
          nome: disciplina.nome,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          ano: disciplina.ano,	
          inicio: disciplina.inicio,
          fim: disciplina.fim,
          descricao: disciplina.descricao,
          curso: disciplina.curso,
        }
      );
  
      if (!newDisciplina) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newDisciplina;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== UPLOAD FILE
  export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET FILE URL
  export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== DELETE FILE
  export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET DISCIPLINAS
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
  
  export async function getInfiniteDisciplinas({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];
  
    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const disciplinas = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.disciplinaCollectionId,
        queries
      );
  
      if (!disciplinas) throw Error;
  
      return disciplinas;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET DISCIPLINA BY ID
  export async function getDisciplinaById(disciplinaId?: string) {
    if (!disciplinaId) throw Error;
  
    try {
      const disciplina = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.disciplinaCollectionId,
        disciplinaId
      );
  
      if (!disciplina) throw Error;
  
      return disciplina;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== UPDATE DISCIPLINA
  export async function updateDisciplina(disciplina: IUpdateDisciplina) {
    const hasFileToUpdate = disciplina.file.length > 0;
  
    try {
      let image = {
        imageUrl: disciplina.imageUrl,
        imageId: disciplina.imageId,
      };
  
      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await uploadFile(disciplina.file[0]);
        if (!uploadedFile) throw Error;
  
        // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deleteFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
      // CONVERTER ANO EM NUMERO

      //  Update disciplina
      const updatedDisciplina = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.disciplinaCollectionId,
        disciplina.disciplinaId,
        {
          nome: disciplina.nome,
          descricao: disciplina.descricao,
          ano: disciplina.ano,
          inicio: disciplina.inicio,
          fim: disciplina.fim,
          curso: disciplina.curso,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
        }
      );
  
      // Failed to update
      if (!updatedDisciplina) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await deleteFile(image.imageId);
        }
  
        // If no new file uploaded, just throw error
        throw Error;
      }
  
      // Safely delete old file after successful update
      if (hasFileToUpdate) {
        await deleteFile(disciplina.imageId);
      }
  
      return updatedDisciplina;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== DELETE DISCIPLINA
  export async function deleteDisciplina(disciplinaId?: string, imageId?: string) {
    if (!disciplinaId || !imageId) return;
  
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.disciplinaCollectionId,
        disciplinaId
      );
  
      if (!statusCode) throw Error;
  
      await deleteFile(imageId);
  
      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== SAVE DISCIPLINA
  export async function saveDisciplina(userId: string, disciplinaId: string) {
    try {
      const updatedDisciplina = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        ID.unique(),
        {
          user: userId,
          disciplina: disciplinaId,
        }
      );
  
      if (!updatedDisciplina) throw Error;
  
      return updatedDisciplina;
    } catch (error) {
      console.log(error);
    }
  }
  // ============================== DELETE SAVED DISCIPLINA
  export async function deleteSavedDisciplina(savedRecordId: string) {
    try {
      const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId
      );
  
      if (!statusCode) throw Error;
  
      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET USER'S DISCIPLINA
  export async function getUserDisciplinas(userId?: string) {
    if (!userId) return;
  
    try {
      const disciplina = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.disciplinaCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );
  
      if (!disciplina) throw Error;
  
      return disciplina;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET POPULAR DISCIPLINAS (BY HIGHEST LIKE COUNT)
  export async function getRecentDisciplinas() {
    try {
      const disciplinas = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.disciplinaCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
      );
  
      if (!disciplinas) throw Error;
  
      return disciplinas;
    } catch (error) {
      console.log(error);
    }
  }
  