import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDisciplina, createUserAccount, getRecentDisciplinas, signInAccount, signOutAccount } from '../appwrite/api'
import { INewDisciplina, INewUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'


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
}

export const useGetRecentDisciplinas = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_DISCIPLINAS],
        queryFn: getRecentDisciplinas,
    })
}