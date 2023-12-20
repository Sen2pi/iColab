import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDisciplina, createUserAccount, deleteSavedDisciplina, getCurrentUser, getRecentDisciplinas, saveDisciplina, signInAccount, signOutAccount } from '../appwrite/api'
import { INewDisciplina, INewUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'


// ============================================================
// Auth QUERIES
// ============================================================
export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    })
};
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