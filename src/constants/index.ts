export const sidebarLinks = [
    {
        imgURL: '/assets/icons/home.svg',
        route: '/',
        label: 'Inicio',
    },

    {
        imgURL: '/assets/icons/minhas.png',
        route: '/disciplina',
        label: 'Minhas Disciplinas',
    },
    {
        imgURL: '/assets/icons/bookmark.svg',
        route: '/notas',
        label: 'A Minha Pauta',
    },
]
export const bottombarLinks = [
    {
        imgURL: '/assets/icons/home.svg',
        route: '/',
        label: 'Inicio',
    },

    {
        imgURL: '/assets/icons/minhas.png',
        route: '/disciplina',
        label: 'Minhas Disciplinas',
    },
    {
        imgURL: '/assets/icons/people.svg',
        route: '/disciplina/:id/grupos',
        label: 'Grupos',
    },
]
export const sidebarLinksDisciplina = [
    {
        
        imgURL: '/assets/icons/home.svg',
        route: '/',
        label: 'Inicio',
    },
    {
        imgURL: '/assets/icons/people.svg',
        route: '/disciplina/:id/grupos/:g',
        label: 'Grupos',
    },
    {
        imgURL: '/assets/icons/disciplina.png',
        route: '/disciplina/:id/notas/',
        label: 'Notas',
    },


]
export const sidebarLinksGrupo = [
    {
        imgURL: '/assets/icons/home.svg',
        route: '/',
        label: 'Inicio',
    },
    {
        imgURL: '/assets/icons/disciplina.png',
        route: '/disciplina/:id/grupo/:id_g/tarefas',
        label: 'Tarefas',
    },
    {
        imgURL: '/assets/icons/disciplina.png',
        route: '/disciplina/:id/grupo/:id_g/ficheiros',
        label: 'Ficheiros',
    },
    {
        imgURL: '/assets/icons/chat.svg',
        route: '/disciplina/:id/grupo/:id_g/chat',
        label: 'Chat',
    },
    {
        imgURL: '/assets/icons/disciplina.png',
        route: '/disciplina/:id/grupo/:id_g/historico',
        label: 'Historico',
    },
]
export const sidebarLinksGrupos = [
    {
        imgURL: '/assets/icons/home.svg',
        route: '/',
        label: 'Inicio',
    },
    {
        imgURL: '/assets/icons/people.svg',
        route: '/disciplina/:id/grupos/:g',
        label: 'Grupos',
    },
]