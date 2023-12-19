import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { createDisciplina, createUserAccount, deleteDisciplina, deleteSavedDisciplina, getDisciplinaById, getRecentDisciplinas, getUserDisciplinas, saveDisciplina, searchDisciplinas, signInAccount, signOutAccount, updateDisciplina } from '../appwrite/api'
import { INewDisciplina, INewUser, IUpdateDisciplina } from '@/types'
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    })
}
export const useSignInAccountMutation = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string; }) => signInAccount(user),
    })
}
export const useSignOutAccountMutation = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}
// ============================================================
// Disciplina QUERIES
// ============================================================

/*export const useGetDisciplinas = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_DISCIPLINAS],
        queryFn: getInfiniteDisciplinas as any,
        getNextPageParam: (lastPage: any) => {
            // If there's no data, there are no more pages.
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }

            // Use the $id of the last document as the cursor.
            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
    });
};*/

export const useSearchDisciplinas = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_DISCIPLINAS, searchTerm],
        queryFn: () => searchDisciplinas(searchTerm),
        enabled: !!searchTerm,
    });
};

export const useGetRecentDisciplinas = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS],
        queryFn: getRecentDisciplinas,
    });
};

export const useCreateDisciplina = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (disciplina: INewDisciplina) => createDisciplina(disciplina),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS],
            });
        },
    });
};

export const useGetDisciplinaById = (disciplinaId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_DISCIPLINA_BY_ID, disciplinaId],
        queryFn: () => getDisciplinaById(disciplinaId),
        enabled: !!disciplinaId,
    });
};

export const useGetUserDisciplinas = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_DISCIPLINAS, userId],
        queryFn: () => getUserDisciplinas(userId),
        enabled: !!userId,
    });
};

export const useUpdateDisciplina = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (disciplina: IUpdateDisciplina) => updateDisciplina(disciplina),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DISCIPLINA_BY_ID, data?.$id],
            });
        },
    });
};

export const useDeleteDisciplina = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ disciplinaId, imageId }: { disciplinaId?: string; imageId: string }) =>
            deleteDisciplina(disciplinaId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS],
            });
        },
    });
};



export const useSaveDisciplina = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, disciplinaId }: { userId: string; disciplinaId: string }) =>
            saveDisciplina(userId, disciplinaId),
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