import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDisciplina, createUserAccount, deleteDisciplina, deleteSavedDisciplina, getCurrentUser, getDisciplinaById, getRecentDisciplinas, saveDisciplina, searchDisciplinas, signInAccount, signOutAccount, updateDisciplina } from '../appwrite/api'
import { INewDisciplina, INewUser, IUpdateDisciplina } from '@/types'
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
    mutationFn:(disciplina : IUpdateDisciplina) => updateDisciplina(disciplina),
    onSuccess: () => { 
      queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_DISCIPLINA_BY_ID],
        })
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