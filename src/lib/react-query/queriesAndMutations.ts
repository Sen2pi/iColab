import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDisciplina, createGrupo, createModulo, createUserAccount, deleteDisciplina, deleteGrupo, deleteModulo, deleteSavedDisciplina, getCurrentUser, getDisciplinaById, getModuloById, getRecentDisciplinas, getRecentGrupos, getRecentModulos, getRecentSaves, getUserById, saveDisciplina, searchDisciplinas, signInAccount, signOutAccount, updateDisciplina, updateGrupo, updateModulo } from '../appwrite/api'
import { INewDisciplina, INewGrupo, INewModulo, INewUser, IUpdateDisciplina, IUpdateGrupo, IUpdateModulo } from '@/types'
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
    mutationFn:(disciplina: IUpdateDisciplina) => updateDisciplina(disciplina),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_DISCIPLINA_BY_ID, data]
      });
    }
  })
}

export const useDeleteDisciplina = () => {
  const queryClient = useQueryClient();
  
  return useMutation({  
    mutationFn: ({disciplinaId, imageId}:{disciplinaId: string, imageId:string}) => deleteDisciplina(disciplinaId, imageId),
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
    mutationFn: ({moduloId, fileId}:{moduloId: string, fileId:string}) => deleteModulo(moduloId, fileId),
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
    mutationFn:(modulo: IUpdateModulo) => updateModulo(modulo),
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
    mutationFn: ({grupoId}:{grupoId: string}) => deleteGrupo(grupoId),
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
    mutationFn:(grupo: IUpdateGrupo) => updateGrupo(grupo),
    onSuccess: (data) => {
      console.log('Data:', data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GRUPO_BY_ID, data]
      });
    }
  })
}

export const useGetGrupoById = (grupoId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GRUPO_BY_ID, grupoId],
    queryFn: () => getModuloById(grupoId),
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
      mutationFn: ({ disciplinaId , userId}: { disciplinaId: string; userId: string;  }) =>
        saveDisciplina(disciplinaId ,userId),
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

