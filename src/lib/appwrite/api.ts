import { ID, Query } from 'appwrite'
import { INewDisciplina, INewFicheiro, INewGrupo, INewHistorico, INewMensagem, INewModulo, INewNota, INewRequesito, INewTarefa, INewUser, IUpdateDisciplina, IUpdateGrupo, IUpdateModulo, IUpdateRequesito, IUpdateTarefa } from "@/types";
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

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )
    if (!currentUser) throw Error;
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
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name)

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
  username?: string;
  docente?: boolean;
  curso: string;
}) {
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

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
    )

    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getRecentUsers() {
  const users = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.orderDesc('numero'), Query.limit(200)]
  );
  if (!users) throw Error;
  return users;
}
export async function getUserByNumero(numero: string) {
  try {
    const userId = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
          Query.equal('numero', [numero.toUpperCase()]),
      ]
  );
    return userId.documents[0].$id;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// =================DISCIPLINA QUERIES=========================
// ============================================================

export async function createDisciplina(disciplina: INewDisciplina) {
  try {
    //Upload do ficheiro :
    const uploadedFile = await uploadFile(disciplina.file[0]);
    if (!uploadedFile) throw Error;

    //Obter o url do ficheiro :
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
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
        inicio: disciplina.inicio.toDateString(),
        fim: disciplina.fim.toDateString(),
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
    if (!newDisciplina) {
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
    const disciplinaId = getDiscyplinaIdFromURL();
    let image = {
      imageUrl: disciplina.imageUrl,
      imageId: disciplina.imageId,
    }
    if (hasFileToUpdate) {
      //Upload do ficheiro :
      const uploadedFile = await uploadFile(disciplina.file[0]);
      if (!uploadedFile) throw Error;

      //Obter o url do ficheiro :
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }
    disciplina.disciplinaId = disciplinaId? disciplinaId : disciplina.disciplinaId;
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
        inicio: disciplina.inicio.toDateString(),
        fim: disciplina.fim.toDateString(),
        curso: disciplina.curso,
      }
    );
    if (!updatedDisciplina) {
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      throw Error;
    }

    if (hasFileToUpdate) {
      await deleteFile(disciplina.imageId);
    }

    return updatedDisciplina
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getRecentDisciplinas() {
  const disciplinas = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.disciplinaCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(200)]
  );
  if (!disciplinas) throw Error;
  return disciplinas;
}
export function getDiscyplinaIdFromURL(): string | null {
  const pathSegments = window.location.pathname.split('/');
  const moduloIndex = pathSegments.indexOf('editar-disciplina');

  if (moduloIndex !== -1 && moduloIndex < pathSegments.length - 1) {
    return pathSegments[moduloIndex + 1];
  }

  return null;
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
  if (!disciplinaId || !imageId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.disciplinaCollectionId,
      disciplinaId,
    )
    return { status: 'ok' }
  } catch (error) {
    console.log(error);
  }
}
export async function searchDisciplinas(searchTerm: string) {
  try {
    const disciplinas = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.disciplinaCollectionId,
      [Query.search('nome', searchTerm)]
    );

    if (!disciplinas) throw Error;

    return disciplinas;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfiniteDisciplinas({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(20)]
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
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
//======================================================
//=====================MODULOS==========================
//======================================================
export async function getRecentModulos() {
  const modulos = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.moduloCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  );
  if (!modulos) throw Error;
  return modulos;
}
export async function createModulo(modulo: INewModulo) {
  try {
    //Upload do ficheiro :
    const uploadedFile = await uploadFile(modulo.file[0]);
    if (!uploadedFile) throw Error;

    //Obter o url do ficheiro :
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }
    //gravar a disciplina no banco de dados :
    const newModulo = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moduloCollectionId,
      ID.unique(),
      {
        disciplinas: modulo.disciplinas,
        nome: modulo.nome,
        descricao: modulo.descricao,
        completed: modulo.completed,
        fileId: uploadedFile.$id,
        fileUrl: fileUrl,
        filename: uploadedFile.name,
        /*  INewModulo Ordem:
            disciplinas: string;
            nome: string;
            file: File[];
            descricao: string;
            completed: boolean;
        */
      }
    );
    if (!newModulo) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newModulo;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function deleteModulo(moduloId: string, fileId: string) {
  if (!moduloId || !fileId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moduloCollectionId,
      moduloId,
    )
    return { status: 'ok' }
  } catch (error) {
    console.log(error);
  }
}
export async function updateModulo(modulo: IUpdateModulo) {
  const hasFileToUpdate = modulo.file.length > 0;
  try {
    const moduloId = getModuloIdFromURL();
    let file = {
      fileUrl: modulo.fileUrl,
      fileId: modulo.fileId,
    }
    if (hasFileToUpdate) {
      //Upload do ficheiro :
      const uploadedFile = await uploadFile(modulo.file[0]);
      if (!uploadedFile) throw Error;

      //Obter o url do ficheiro :
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      file = { ...file, fileUrl: fileUrl, fileId: uploadedFile.$id }
    }
    modulo.moduloId = moduloId ? moduloId : modulo.moduloId;
    //gravar a disciplina no banco de dados :
    const updatedModulo = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moduloCollectionId,
      modulo.moduloId,
      {
        nome: modulo.nome,
        descricao: modulo.descricao,
        fileId: file.fileId,
        fileUrl: file.fileUrl,
        /*  IUpdateModulo Ordem:
            moduloId: string;
            nome: string;
            descricao?: string;
            fileId: string;
            filrUrl: URL;
            file: File[];
        */
      }
    );
    if (!updatedModulo) {
      if (hasFileToUpdate) {
        await deleteFile(file.fileId);
      }
      throw Error;
    }

    if (hasFileToUpdate) {
      await deleteFile(modulo.fileId);
    }

    return updatedModulo
  } catch (error) {
    console.log(error);
    return error;
  }
}
export function getModuloIdFromURL(): string | null {
  const pathSegments = window.location.pathname.split('/');
  const moduloIndex = pathSegments.indexOf('editar-modulo');

  if (moduloIndex !== -1 && moduloIndex < pathSegments.length - 1) {
    return pathSegments[moduloIndex + 1];
  }

  return null;
}
export async function getModuloById(moduloId: string) {
  try {
    const modulo = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moduloCollectionId,
      moduloId,
    );
    return modulo;
  } catch (error) {
    console.log(error);
  }
}

//======================================================
//======================GRUPOS =========================
//======================================================
export async function getRecentGrupos() {
  const grupos = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.grupoCollectionId,
    [Query.orderDesc('nome'), Query.limit(20)],

    );
  if (!grupos) throw Error;
  return grupos;
}
export async function createGrupo(grupo: INewGrupo) {
  try {
    const newGrupo = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.grupoCollectionId,
      ID.unique(),
      {
        disciplina: grupo.disciplina,
        nome: grupo.nome,
        tema: grupo.tema,
        prazo: grupo.prazo.toDateString(),
        descricao: grupo.descricao,
        lider: grupo.lider,
        /*
          disciplina: string;
          nome: string;
          lider: string;
          tema: string;
          prazo: Date;
          descricao: string;
        */
      },
    );
    createChat(newGrupo.$id)
    if (!newGrupo) {
      throw Error;
    }
    return newGrupo;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function deleteGrupo(grupoId: string) {
  if (!grupoId ) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.grupoCollectionId,
      grupoId,
    )
    
    return { status: 'ok' }
  } catch (error) {
    console.log(error);
  }
}
export async function updateGrupo(grupo: IUpdateGrupo) {
  try {
 
    //gravar a disciplina no banco de dados :
    const updatedGrupo = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.grupoCollectionId,
      grupo.grupoId,
      {
        nome: grupo.nome,
        descricao: grupo.descricao,
        nota: grupo.nota,
        tema: grupo.tema,
        lider: grupo.lider,
      }
    );
    return updatedGrupo
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function getGrupoById(grupoId: string) {
  try {
    const grupo = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.grupoCollectionId,
      grupoId,
    );
    return grupo;
  } catch (error) {
    console.log(error);
  }
}


//======================================================
//======================TAREFAS ========================
//======================================================
export async function getRecentTarefas() {
  const tarefas = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tarefaCollectionId,
    [Query.orderAsc('$createdAt'), Query.limit(2000)],
    );
  if (!tarefas) throw Error;
  return tarefas;
}
export async function createTarefa(tarefa: INewTarefa) {
  try {
    const newTarefa = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tarefaCollectionId,
      ID.unique(),
      {
        grupo: tarefa.grupo,
        date: tarefa.date.toDateString(),
        concluido: tarefa.concluido || false,
        atribuido: tarefa.atribuido,
        content: tarefa.content,
        requesito: tarefa.requesito,
        /*
          disciplina: string;
          nome: string;
          lider: string;
          tema: string;
          prazo: Date;
          descricao: string;
        */
      },
    );
    if (!newTarefa) {
      throw Error;
    }
    return newTarefa;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function deleteTarefa(tarefaId: string) {
  if (!tarefaId ) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tarefaCollectionId,
      tarefaId,
    )
    
    return { status: 'ok' }
  } catch (error) {
    console.log(error);
  }
}
export async function updateTarefa(tarefa: IUpdateTarefa) {
  try {
 
    //gravar a disciplina no banco de dados :
    const updatedTarefa = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tarefaCollectionId,
      tarefa.tarefaId,
      {
        content: tarefa.content,
        atribuido: tarefa.atribuido,
        date: tarefa.date.toDateString(),
        concluido: tarefa.concluido || false,
        requesito: tarefa.requesito, 
      }
    );
    return updatedTarefa
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function getTarefaById(tarefaId: string) {
  try {
    const tarefa = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tarefaCollectionId,
      tarefaId,
    );
    return tarefa;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserTarefas(userId: string) {
  const query = [
    Query.equal('user',  userId), // Assuming 'user' is the field representing the user in requisito documents
    Query.limit(1000), // Adjust the limit as needed
  ];

  try {
    const tarefas = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tarefaCollectionId,
      query
    );

    return tarefas.documents;
  } catch (error) {
    console.error('Error fetching user tarefas', error);
    throw error;
  }
}
//======================================================
//======================REQUESITOS =====================
//======================================================

export async function getRecentRequesitos() {
  const requesitos = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.requesitoCollectionId,
    [Query.orderAsc('$createdAt'), Query.limit(200)],
    );
  if (!requesitos) throw Error;
  return requesitos;
}

export async function createRequesito(requesito: INewRequesito) {
  try {
    const newRequesito= await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.requesitoCollectionId,
      ID.unique(),
      {
        title: requesito.title,
        grupo: requesito.grupo,
        user: requesito.user,
      },
    );
    if (!newRequesito) {
      throw Error;
    }
    return newRequesito;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function deleteRequesito(requesitoId: string) {
  if (!requesitoId ) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.requesitoCollectionId,
      requesitoId,
    )
    
    return { status: 'ok' }
  } catch (error) {
    console.log(error);
  }
}
export async function updateRequesito(requesito: IUpdateRequesito) {
  try {
 
    //gravar a disciplina no banco de dados :
    const updatedRequesito = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.requesitoCollectionId,
      requesito.requesitoId,
      {
        title: requesito.title,
      }
    );
    return updatedRequesito
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function getRequesitoById(requesitoId: string) {
  try {
    const requesito = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.requesitoCollectionId,
      requesitoId,
    );
    return requesito;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserRequesitos(userId: string) {
  try {
    const requesitos = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.requesitoCollectionId,
      [
        Query.equal('user',  userId), // Assuming 'user' is the field representing the user in requisito documents
        Query.limit(100), // Adjust the limit as needed
      ]
    );

    return requesitos;
  } catch (error) {
    console.error('Error fetching user requisitos', error);
    throw error;
  }
}
//======================================================
//==================== HISTORICO =======================
//======================================================
export async function getRecentHistoricos() {
  const historicos = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.historicoCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(200)]
  );
  if (!historicos) throw Error;
  return historicos;
}
export async function createHistorico(historico : INewHistorico) {
  try {
    const newHistorico = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.historicoCollectionId,
      ID.unique(),
      {
        user: historico.user,
        mensagem: historico.mensagem,
        grupo: historico.grupo,
        acao: historico.acao,
      }
    );
    if (!newHistorico) {
      throw Error;
    }
    return newHistorico;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function deleteHistorico(HistoricoId: string) {
  if (!HistoricoId ) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.historicoCollectionId,
      HistoricoId,
    )
    return { 
      status: 'ok' 
    }
  } catch (error) {
    console.log(error);
  }
}
//======================================================
//======================FILES ==========================
//======================================================
export async function getRecentFicheiros() {
  const ficheiros = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.ficheiroCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  );
  if (!ficheiros) throw Error;
  return ficheiros;
}
export async function createFicheiro(ficheiro: INewFicheiro) {
  try { 
    //Upload do ficheiro :
    const uploadedFile = await uploadFile(ficheiro.file[0]);
    if (!uploadedFile) throw Error;

    //Obter o url do ficheiro :
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }
    const extensao = uploadedFile.name.split('.').pop();
    console.log(extensao);
    console.log(ficheiro.nome);
    //gravar a disciplina no banco de dados :
    const newFicheiro = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ficheiroCollectionId,
      ID.unique(),
      {
        remetente: ficheiro.remetente,
        grupo: ficheiro.grupo,
        requesito: ficheiro.requesito || "",
        nome: ficheiro.nome,
        data: ficheiro.data.toDateString(),
        fileId: uploadedFile.$id,
        fileUrl: fileUrl,
        filename: uploadedFile.name,
        extensao: extensao,
      }
    );
    if (!newFicheiro) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newFicheiro;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function deleteFicheiro(ficheiroId: string, fileId: string) {
  if (!ficheiroId || !fileId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ficheiroCollectionId,
      ficheiroId,
    )
    return { status: 'ok' }
  } catch (error) {
    console.log(error);
  }
}

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
export async function getFicheiroById(ficheiroId: string) {
  try {
    const ficheiro = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ficheiroCollectionId,
      ficheiroId,
    );
    return ficheiro;
  } catch (error) {
    console.log(error);
  }
}
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

    return { status: "ok" }
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
    if (!savedDisciplina) throw Error;
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
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getRecentSaves() {
  const saves = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.savesCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(200)]
  );
  if (!saves) throw Error;
  return saves;
}
export async function getSaveById(saveId: string) {
  try {
    const save = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      saveId,
    );
    return save;
  } catch (error) {
    console.error(error);
    // Return a default value or rethrow the error
    return null; // or return an empty object, depending on your needs
  }
}
export async function getUserSave(userId: string, disciplinaId: string) {
  try {
    const saves = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [
        Query.equal('users', userId),
        Query.equal('disciplina', disciplinaId),
        Query.limit(1),
      ]
    );

    if (!saves || saves.documents.length === 0) {
      // Return a default value or handle the case where no saves are found
      return null; // or return an empty object, depending on your needs
    }

    return saves.documents[0]?.$id.toString();
  } catch (error) {
    console.error(error);
    // Return a default value or rethrow the error
    return null; // or return an empty object, depending on your needs
  }
}

//=================================================================
//===================== INSCRICOES ================================
//=================================================================
export async function saveGrupo(grupoId: string, userId: string) {
  try {
    const savedGrupo = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.inscricaoCollectionId,
      ID.unique(),
      {
        inscrito: userId,
        grupo: grupoId,
      }
    )
    if (!savedGrupo) throw Error;
    return savedGrupo;
  } catch (error) {
    console.log(error);
  }
}
export async function getInscricaoById(inscricaoId: string) {
  try {
    const inscricao = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.inscricaoCollectionId,
      inscricaoId,
    );
    return inscricao;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedGrupo(savedRecordId: string) {
  try {
   
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.inscricaoCollectionId,
      savedRecordId,
    )
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getRecentInscricoes() {
  const inscricoes = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.inscricaoCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(200)]
  );
  if (!inscricoes) throw Error;
  return inscricoes;
}
export async function getGrupoInscrito(userId: string) {
  try {
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.inscricaoCollectionId,
      [
          Query.equal('inscrito', [userId]),
          Query.limit(1),
      ]
  );
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getGrupoInscricao(userId: string, grupoId: string) {
  try {
    const inscricao = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.inscricaoCollectionId,
      [
        Query.equal('inscrito', userId),
        Query.equal('grupo', grupoId),
        Query.limit(1),
      ]
    );

    if (!inscricao || inscricao.documents.length === 0) {
      // Return a default value or handle the case where no saves are found
      return null; // or return an empty object, depending on your needs
    }

    return inscricao.documents[0]?.$id.toString();
  } catch (error) {
    console.error(error);
    // Return a default value or rethrow the error
    return null; // or return an empty object, depending on your needs
  }
}

//=================================================================
//=========================== Chat ================================
//=================================================================

export async function getChatById(chatId: string){
  const chat = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.chatCollectionId,
    chatId,
  )
  if (!chat) throw Error;
  return chat;
}

export async function getRecentMensagens( chatId: string) {
  const mensagens = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.mensagemCollectionId,
    [
      Query.equal("chat", chatId),
      Query.orderAsc('$createdAt'), Query.limit(200),
    ]
  );
  if (!mensagens) throw Error;
  return mensagens;
}
export async function getMensagemById(mensagemId: string) { 
  try {
    const mensagem = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.mensagemCollectionId,
      mensagemId,
  );
  if(!mensagem) throw Error;
    return mensagem;
  } catch (error) {
    console.log(error);
  }
}

export async function createChat(grupoId: string) {
  try {
    const newChat = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatCollectionId,
      ID.unique(),
      {
       grupo: grupoId
      }
    );
    if (!newChat) {
      throw Error;
    }
    return newChat;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function createMensagem(mensagem: INewMensagem) {
  try {
    const newMensagem = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.mensagemCollectionId,
      ID.unique(),
      {
       chat: mensagem.chat,
       remetente: mensagem.remetente,
       mensagem: mensagem.mensagem
      }
    );
    if (!newMensagem) {
      throw Error;
    }
    return newMensagem;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function deleteMenssagem(mensagemId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.mensagemCollectionId,
      mensagemId,
    )
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}


//=================================================================
//=========================== Notas ================================
//=================================================================

export async function getNotaById(notaId: string){
  const nota = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.notaCollectionId,
    notaId,
  )
  if (!nota) throw Error;
  return nota;
}

export async function getRecentNotas() {
  const notas = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.notaCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(200)]
  );
  if (!notas) throw Error;
  return notas;
}

export async function createNota( nota : INewNota) {
  try {
    const newNota = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notaCollectionId,
      ID.unique(),
      {
        aluno: nota.aluno,
        nota: nota.nota,
        grupo: nota.grupo,
        momento: nota.momento,
        disciplina: nota.disciplina,
      }
    );
    if (!newNota) {
      throw Error;
    }
    return newNota;
  } catch (error) {
    console.log(error);
    return error;
  }
}

