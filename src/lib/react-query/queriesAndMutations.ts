import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDisciplina, createFicheiro, createGrupo, createHistorico, createMensagem, createModulo, createNota, createRequesito, createTarefa, createUserAccount, deleteDisciplina, deleteFicheiro, deleteGrupo, deleteHistorico, deleteModulo, deleteNota, deleteRequesito, deleteSavedDisciplina, deleteSavedGrupo, deleteTarefa, getChatById, getCurrentUser, getDisciplinaById, getFicheiroById, getGrupoById, getGrupoInscricao, getInscricaoById, getMensagemById, getModuloById, getNotaById, getRecentDisciplinas, getRecentFicheiros, getRecentGrupos, getRecentHistoricos, getRecentInscricoes, getRecentMensagens, getRecentModulos, getRecentNotas, getRecentRequesitos, getRecentSaves, getRecentTarefas, getRecentUsers, getRequesitoById, getSaveById, getTarefaById, getUserById, getUserByNumero, getUserNotas, getUserRequesitos, getUserSave, getUserTarefas, saveDisciplina, saveGrupo, searchDisciplinas, signInAccount, signOutAccount, updateDisciplina, updateGrupo, updateModulo, updateNota, updateRequesito, updateTarefa } from '../appwrite/api'
import { INewDisciplina, INewFicheiro, INewGrupo, INewHistorico, INewMensagem, INewModulo, INewNota, INewRequesito, INewTarefa, INewUser, IUpdateDisciplina, IUpdateGrupo, IUpdateModulo, IUpdateNota, IUpdateRequesito, IUpdateTarefa } from '@/types'
import { QUERY_KEYS } from './queryKeys'


// ============================================================
// Auth QUERIES
// ============================================================

export const useSignInAccountMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string; }) => signInAccount(user),
  })
};
export const useSignOutAccountMutation = () => {
  return useMutation({
    mutationFn: signOutAccount
  })
};

// ============================================================
// USer QUERIES
// ============================================================
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
};
export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  })
};
export const useGetUseraById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId
  })
};
export const useGetUserByNumero = (numero: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_NUMERO, numero],
    queryFn: () => getUserByNumero(numero),
    enabled: !!numero
  })
};

export const useGetRecentUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_USERS],
    queryFn: getRecentUsers,
  })
};
// ============================================================
// Disciplina QUERIES
// ============================================================

export const useCreateDisciplina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disciplina: INewDisciplina) => createDisciplina(disciplina),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS]
      });
    },
  });
};

export const useGetRecentDisciplinas = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS],
    queryFn: getRecentDisciplinas,
  })
};

export const useGetDisciplinaById = (disciplinaId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DISCIPLINA_BY_ID, disciplinaId],
    queryFn: () => getDisciplinaById(disciplinaId),
    enabled: !!disciplinaId
  })
};

export const useUpdateDisciplina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disciplina: IUpdateDisciplina) => updateDisciplina(disciplina),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_DISCIPLINA_BY_ID, data]
      });
    }
  })
}

export const useDeleteDisciplina = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disciplinaId, imageId }: { disciplinaId: string, imageId: string }) => deleteDisciplina(disciplinaId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS]
      })
    }
  })
};
export const useSearchDisciplinas = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_DISCIPLINAS, searchTerm],
    queryFn: () => searchDisciplinas(searchTerm),
    enabled: !!searchTerm,
  });
};

// ============================================================
// Modulos QUERIES
// ============================================================
export const useCreateModulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modulo: INewModulo) => createModulo(modulo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_MODULOS]
      });
    },
  });
};

export const useDeleteModulo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduloId, fileId }: { moduloId: string, fileId: string }) => deleteModulo(moduloId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_MODULOS]
      })
    }
  })
};
export const useUpdateModulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modulo: IUpdateModulo) => updateModulo(modulo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MODULO_BY_ID, data]
      });
    }
  })
}
export const useGetModuloById = (moduloId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MODULO_BY_ID, moduloId],
    queryFn: () => getModuloById(moduloId),
    enabled: !!moduloId
  })
};
export const useGetRecentModulos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_MODULOS],
    queryFn: getRecentModulos,
  })
};
// ============================================================
// Grupos QUERIES
// ============================================================
export const useCreateGrupo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grupo: INewGrupo) => createGrupo(grupo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_GRUPOS]
      });
    },
  });
};

export const useDeleteGrupo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ grupoId }: { grupoId: string }) => deleteGrupo(grupoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_GRUPOS]
      })
    }
  })
};

export const useUpdateGrupo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grupo: IUpdateGrupo) => updateGrupo(grupo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GRUPO_BY_ID, data]
      });
    }
  })
}

export const useGetGrupoById = (grupoId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GRUPO_BY_ID, grupoId],
    queryFn: () => getGrupoById(grupoId),
    enabled: !!grupoId
  })
};
export const useGetRecentGrupos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_GRUPOS],
    queryFn: getRecentGrupos,
  })
};

//===============================================================
// SAVES DISCIPLINA QUERIES
//===============================================================

export const useSaveDisciplina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ disciplinaId, userId }: { disciplinaId: string; userId: string; }) =>
      saveDisciplina(disciplinaId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_DISCIPLINAS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedDisciplina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedDisciplina(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_DISCIPLINAS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetRecentSaves = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_SAVES],
    queryFn: getRecentSaves,
  })
};
export const useGetSaveById = (saveId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVE_BY_ID, saveId],
    queryFn: () => getSaveById(saveId),
    enabled: !!saveId,
  });
};


export const useGetSaveByUserAndDisciplinaId = (userId: string, disciplinaId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SAVE_BY_USER_AND_DISCIPLINA_ID, userId, disciplinaId],
    queryFn:  () =>  getUserSave(userId, disciplinaId),
  });
}

//===============================================================
// INSCRIÇOES QUERIES
//===============================================================

export const useSaveGrupo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ grupoId, userId }: { grupoId: string; userId: string; }) =>
      saveGrupo(grupoId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_GRUPOS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GRUPOS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedGrupo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedGrupo(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_GRUPOS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GRUPOS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetRecentInscricoes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_INSCRICOES],
    queryFn: getRecentInscricoes,
  })
};

export const useGetInscricaoById = (incricaoId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_INSCRICAO_BY_ID, incricaoId],
    queryFn: () => getInscricaoById(incricaoId),
    enabled: !!incricaoId
  })
};
export const useGetInscricaoByUserAndGrupoId = (userId: string, grupoId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_INSCRICAO_BY_USER_AND_GRUPO_ID, userId, grupoId],
    queryFn:  () =>  getGrupoInscricao(userId, grupoId),
  });
}

//===============================================================
// Chats QUERIES
//===============================================================

export const useGetRecentMensagens = (chatId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_MENSAGENS],
    queryFn: () => getRecentMensagens(chatId),
    enabled: !!chatId
    })
};

export const useGetChatById = (chatId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId
  })
};
export const useGetMensagemById = (mensagemId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MENSAGEM_BY_ID, mensagemId],
    queryFn: () => getMensagemById(mensagemId),
    enabled: !!mensagemId
  })
};

export const useCreateMensagem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mensagem: INewMensagem) => createMensagem(mensagem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_MENSAGENS]
      });
    },
  });
};

//===============================================================
// Ficheiros QUERIES
//===============================================================
export const useCreateFicheiro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ficheiro: INewFicheiro) => createFicheiro(ficheiro),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_FICHEIROS]
      });
    },
  });
};

export const useDeleteFicheiro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ficheiroId, fileId }: { ficheiroId: string, fileId: string }) => deleteFicheiro(ficheiroId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_FICHEIROS]
      })
    }
  })
};

export const useGetFicheiroById = (ficheiroId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FICHEIRO_BY_ID, ficheiroId],
    queryFn: () => getFicheiroById(ficheiroId),
    enabled: !!ficheiroId
  })
};
export const useGetRecentFicheiros = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_FICHEIROS],
    queryFn: getRecentFicheiros,
  })
};

//===============================================================
// Historicos QUERIES
//===============================================================

export const useGetRecentHistoricos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_HISTORICOS],
    queryFn: getRecentHistoricos,
  })
};

export const useCreateHistorico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (historico: INewHistorico) => createHistorico(historico),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_HISTORICOS]
      });
    },
  });
};
export const useDeleteHistorico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hsitoricoId}: { hsitoricoId: string }) => deleteHistorico(hsitoricoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_HISTORICOS]
      })
    }
  })
};

//===============================================================
// Tarefas QUERIES
//===============================================================
export const useCreateTarefa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tarefa: INewTarefa) => createTarefa(tarefa),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_TAREFAS]
      });
    },
  });
};

export const useDeleteTarefa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tarefaId}: { tarefaId: string}) => deleteTarefa(tarefaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_TAREFAS]
      })
    }
  })
};
export const useUpdateTarefa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tarefa: IUpdateTarefa) => updateTarefa(tarefa),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_TAREFA_BY_ID, data]
      });
    }
  })
}
export const useGetTarefaById = (tarefaId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TAREFA_BY_ID, tarefaId],
    queryFn: () => getTarefaById(tarefaId),
    enabled: !!tarefaId
  })
};
export const useGetRecentTarefas = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_TAREFAS],
    queryFn: getRecentTarefas,
  })
};
export const useGetUserTarefas = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TAREFA_BY_ID, userId],
    queryFn: () => getUserTarefas(userId),
    enabled: !!userId
  })
};
//===============================================================
// Requisitos QUERIES
//===============================================================
export const useCreateRequesito = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requesito: INewRequesito) => createRequesito(requesito),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_REQUESITOS]
      });
    },
  });
};

export const useDeleteRequesito = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requesitoId  }: { requesitoId: string}) => deleteRequesito(requesitoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_REQUESITOS]
      })
    }
  })
};
export const useUpdateRequesito = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requesito: IUpdateRequesito) => updateRequesito(requesito),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REQUESITO_BY_ID, data]
      });
    }
  })
}

export const useGetRequesitoById = (requesitoId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FICHEIRO_BY_ID],
    queryFn: () => getRequesitoById(requesitoId),
    enabled: !!requesitoId
  })
};
export const useGetRecentRequesitos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_REQUESITOS],
    queryFn: getRecentRequesitos,
  })
};
export const useGetUserRequesitos = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REQUESITOS_BY_USER_ID],
    queryFn: () => getUserRequesitos(userId),
    enabled: !!userId
  })
};

//===============================================================
// Notas QUERIES
//===============================================================

export const useCreateNota = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nota: INewNota) => createNota(nota),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_NOTAS]
      });
    },
  });
};

export const useDeleteNota = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ notaId  }: { notaId: string}) => deleteNota(notaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_NOTAS]
      })
    }
  })
};

export const useUpdateNota = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nota: IUpdateNota) => updateNota(nota),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_NOTA_BY_ID, data]
      });
    }
  })
}

export const useGetNotaById = (notaId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_NOTA_BY_ID],
    queryFn: () => getNotaById(notaId),
    enabled: !!notaId
  })
};

export const useGetRecentNotas = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_NOTAS],
    queryFn: getRecentNotas,
  })
};

export const useGetUserNotas = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_NOTAS_BY_USER_ID],
    queryFn: () => getUserNotas(userId),
    enabled: !!userId
  })
};
