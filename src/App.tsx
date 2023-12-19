import {Routes, Route} from 'react-router-dom'

import './globals.css';
import SigninForm from './_auth/forms/SigninForm';
import {Home} from './_root/pages';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from './components/ui/toaster';
import Disciplina from './_root/pages/Disciplina';
import CriarDisciplina from './_root/pages/CriarDisciplina';
import DisciplinaDetalhe from './_root/pages/DisciplinaDetalhe';
import EditarDisciplina from './_root/pages/EditarDisciplina';
import ApagarDisciplina from './_root/pages/ApagarDisciplina';
import Grupo from './_root/pages/Grupo';
import CriarGrupo from './_root/pages/CriarGrupo';
import GrupoDetalhe from './_root/pages/GrupoDetalhe';
import EditarGrupo from './_root/pages/EditarGrupo';
import Tarefa from './_root/pages/Tarefa';
import CriarTarefa from './_root/pages/CriarTarefa';
import TarefaDetalhe from './_root/pages/TarefaDetalhe';
import EditarTarefa from './_root/pages/EditarTarefa';
import ApagarTarefa from './_root/pages/ApagarTarefa';
import Requesito from './_root/pages/Requesito';
import ApagarRequesito from './_root/pages/ApagarRequesito';
import EditarRequesito from './_root/pages/EditarRequesito';
import Ficheiro from './_root/pages/Ficheiro';
import EnviarFicheiro from './_root/pages/EnviarFicheiro';
import ApagarFicheiro from './_root/pages/ApagarFicheiro';
import Chat from './_root/pages/Chat';
import EditarMensagem from './_root/pages/EditarMensagem';
import ApagarMensagem from './_root/pages/ApagarMensagem';
import Profile from './_root/pages/Profile';
import EditarProfile from './_root/pages/EditarProfile';

function App() {
  return (
    <main className='flex h-screen'>
        <Routes>
            { /* public routes */}
            <Route element={<AuthLayout/>}>
                <Route path="/sign-in" element ={<SigninForm/>}/>
                <Route path="/sign-up" element ={<SignupForm/>}/>
            </Route>


            {/* private route */}
            <Route element={<RootLayout/>}>
                <Route index element={<Home/>}/>
                <Route path="/disciplina" element={<Disciplina/>}/>
                <Route path="/criar-disciplina" element={<CriarDisciplina/>}/>
                <Route path="/disciplina/:id" element={<DisciplinaDetalhe/>}/>
                <Route path="/disciplina/:id" element={<EditarDisciplina/>}/>
                <Route path="/disciplina/:id" element={<ApagarDisciplina/>}/>
                <Route path="/grupo" element={<Grupo/>}/>
                <Route path="/grupo" element={<CriarGrupo/>}/>
                <Route path="/grupo/:id" element={<GrupoDetalhe/>}/>
                <Route path="/grupo/:id" element={<EditarGrupo/>}/>
                <Route path="/tarefa" element={<Tarefa/>}/>
                <Route path="/tarefa" element={<CriarTarefa/>}/>
                <Route path="/tarefa/:id" element={<TarefaDetalhe/>}/>
                <Route path="/tarefa/:id" element={<EditarTarefa/>}/>
                <Route path="/tarefa/:id" element={<ApagarTarefa/>}/>
                <Route path="/tarefa/:id/requesito" element={<Requesito/>}/>
                <Route path="/tarefa/:id/requesito/:id" element={<ApagarRequesito/>}/>
                <Route path="/tarefa/:id/requesito/:id" element={<EditarRequesito/>}/>
                <Route path="/ficheiro" element={<Ficheiro/>}/>
                <Route path="/ficheiro" element={<EnviarFicheiro/>}/>
                <Route path="/ficheiro/:id" element={<ApagarFicheiro/>}/>
                <Route path="/chat/:id/group" element={<Chat/>}/>
                <Route path="/chat/:id/mensagem" element={<EditarMensagem/>}/>
                <Route path="/chat/:id/mensagem" element={<ApagarMensagem/>}/>
                <Route path="/profile/:id/*" element={<Profile/>}/>
                <Route path="/profile/:id" element={<EditarProfile/>}/>
            </Route>
        </Routes>
        <Toaster/>
    </main>
  )
}

export default App