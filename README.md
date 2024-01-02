# iColab - Aplicação de Colaboração para Professores e Alunos

## Descrição
iColab é uma aplicação desenvolvida em React, TypeScript, Appwrite, Tailwind e Shadcn, projetada para facilitar a colaboração entre professores e alunos. A aplicação oferece recursos específicos para cada tipo de usuário, permitindo uma gestão eficiente de disciplinas, módulos, grupos e tarefas.

## Funcionalidades Principais

### Para Professores
- Gestão de disciplinas e módulos.
- Criação e gestão de grupos.
- Visualização do histórico do grupo.
- Participação no chat do grupo.
- Atribuição de notas aos grupos e membros.
- Administração de tarefas para grupos.

### Para Alunos (Líderes de Grupo)
- Gestão de tarefas para organização do trabalho.
- Adição, remoção, edição e atribuição de tarefas.
- Envio de arquivos.
- Participação no chat do grupo.
- Visualização das notas dos membros do grupo.

### Para Outros Alunos
- Participação no chat do grupo.
- Visualização das notas dos membros do grupo.
- Execução de tarefas, excluindo criação ou exclusão.

## Detalhes do Projeto

- **Nome da Aplicação:** iColab
- **Desenvolvida para:** Trabalho da unidade curricular de Desenvolvimento de Interfaces
- **Alunos:** A042542, A042807, A042045
- **Copyright:** Karim Patatas @Sen2Pi

## Configuração do Projeto
1. Clone o repositório.
```javascript CMD
git clone https://github.com/Sen2pi/iColab.git
```
2. Instale as dependências usando `yarn install` ou `npm install`.
```javascript CMD
npm install 
```
3. Configure as variáveis de ambiente para o Appwrite e outros serviços necessários.
```javascript AppWrite DB
    Users:
      email: string,
      username: string,
      imageUrl: URL,
      docente: boolean,
      curso: string,
      numero: string,
    
    Disciplinas:
      professor: string relação com Users (*..1),
      nome: string,
      descricao: string,
      imageId: string,
      imageUrl: URL,
      ano: number,
      inicio: string,
      fim: string,
      curso: string,
    
    Modulos:
      disciplinas: string relacao Disciplinas (*..1),
      nome: string,
      descricao: string,
      completed: boolean,
      fileId: string,
      fileUrl: fURL,
      filename: string, 
    
    Grupos:
      disciplina: string relacao Disciplinas (*..1),
      nome: string,
      tema: string,
      prazo: string,
      descricao: string,
      lider: string relacao com Users(*..1),

    Requesitos:
      title: string,
      grupo: relacao com Grupos(*..1),
      user: string com Users(*..1),

    Tarefas:
      grupo: string relacao Grupos (*..1),
      date: string,
      concluido: boolean,
      atribuido: string relacao Users(*..1),
      content: string,
      requesito: string relacao com Requesitos(*..1),
    
    Historicos:
      user: string com Users(*..1),
      mensagem: string,
      grupo: string relacao Grupos (*..1),
      acao: string,
    
    Ficheiros:
      remetente: string com Users(*..1),
      grupo: string relacao Grupos (*..1),
      requesito: string relacao com Requesitos(*..1),
      nome: string,
      data: string,
      fileId: string,
      fileUrl: URL,
      filename: string,
      extensao: string,
    
    Saves:
      users: string relacao com Users(*..1),
      disciplina: string relacao com Disciplinas(*..1),

    Inscricoes:
      inscrito: string relacao com Users(*..1),
      grupo: string relacao com Grupos(*..1),
    
    Chat:
      grupo: grupo: string relacao com Grupos(1..1)
    
    Mensagens:
      chat:  string relacao com Grupos(*..1),
      remetente: string relacao com Users(*..1),
      mensagem: string,
    
    Notas:
      aluno: string relacao com Users(*..1),
      nota: number,
      grupo: string relacao com Grupos(*..1),
      momento: string,
      disciplina: tring relacao com Disciplinas(*..1),

    
```
4. Instale o Tailwind :
```javascript CMD
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init 
```

5. Instale o ShadCn
```javascript CMD
npx shadcn-ui@latest init
```
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

6. Execute o aplicativo usando `yarn start` ou `npm start`.
```javascript CMD
npm start 
```
## Tecnologias Utilizadas
- [React + Vite](https://vitejs.dev/).
- [TypeScript](https://www.w3schools.com/typescript/index.php).
- [AppWrite](https://cloud.appwrite.io/).
- [TailWindcss](https://tailwindcss.com/).
- [ShadCn](https://ui.shadcn.com/).
- [Vercel](https://vercel.com/).

## Deployment
O deploy foi feito atraves do Vercel que é uma plataforma de deploy super rapida e facil de usar em um clique e tudo funciona.
com integração com github.
[Vercel](https://i-colab-git-production-karim-patatas-projects.vercel.app).
## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para criar forks, propor melhorias ou relatar problemas. 

**Private Mail: [Dr. Karim Patatas ](mailto:dr.karim.patatas@gmail.com)
**Academic Mail: [Dr. Karim Patatas ](mailto:A042542@umaia.pt)


## Licença
Este projeto é licenciado sob a [Nome da Licença] - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

