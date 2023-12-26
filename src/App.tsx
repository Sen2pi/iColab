import {Routes, Route} from 'react-router-dom'

import './globals.css';
import SigninForm from './_auth/forms/SigninForm';
import {Home} from './_root/pages';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from './components/ui/toaster';
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
import MinhasDisciplinas from './_root/pages/MinhasDisciplinas';
import EditarModulo from './_root/pages/EditarModulo';
import CriarModulo from './_root/pages/CriarModulo';
import Notas from './_root/pages/Notas';
import CriarRequesito from './_root/pages/CriarRequesito';
import Historico from './_root/pages/Historico';


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
                <Route path="/disciplina" element={<MinhasDisciplinas/>}/>
                <Route path="/criar-disciplina" element={<CriarDisciplina/>}/>
                <Route path="/disciplina/:id" element={<DisciplinaDetalhe/>}/>
                <Route path="/editar-disciplina/:id" element={<EditarDisciplina/>}/>
                <Route path="/apagar-disciplina/:id" element={<ApagarDisciplina/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/notas" element={<Notas/>}/>

                <Route path="/disciplina/:id/editar-modulo/:id_m" element={<EditarModulo/>}/>
                <Route path="/disciplina/:id/criar-modulo-disciplina/:id" element={<CriarModulo/>}/>

                <Route path="/disciplina/:id/grupos" element={<Grupo/>}/>
                <Route path="/disciplina/:id/criar-grupo" element={<CriarGrupo/>}/>
                <Route path="/disciplina/:id/grupo/:id_g" element={<GrupoDetalhe/>}/>
                <Route path="/disciplina/:id/editar-grupo/:id_g" element={<EditarGrupo/>}/>

                <Route path="/disciplina/:id/grupo/:id_g/chat/:id_c" element={<Chat/>}/>

                <Route path="/disciplina/:id/grupo/:id_g/historico/:id_h" element={<Historico/>}/>

                <Route path="/disciplina/:id/grupo/:id_g/ficheiros" element={<Ficheiro/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/criar-ficheiro" element={<EnviarFicheiro/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/ficheiro/:id_f" element={<ApagarFicheiro/>}/>
                
                <Route path="/disciplina/:id/grupo/:id_g/tarefas" element={<Tarefa/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/criar-tarefa" element={<CriarTarefa/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/tarefa/:id_t" element={<TarefaDetalhe/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/editar-tarefa/:id_t" element={<EditarTarefa/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/tarefa/:id_t" element={<ApagarTarefa/>}/>


                <Route path="/disciplina/:id/grupo/:id_g/tarefa/:id_t/requesitos" element={<Requesito/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/tarefa/:id_t/criar-requesito/" element={<CriarRequesito/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/tarefa/:id_t/apagar-requesito/:id_r" element={<ApagarRequesito/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/tarefa/:id_t/editar-requesito/:id_r" element={<EditarRequesito/>}/>


                <Route path="/profile/:id/*" element={<Profile/>}/>
                <Route path="/profile/:id" element={<EditarProfile/>}/>
                <Route path="/minhasdisciplinas" element={<MinhasDisciplinas/>}/>
            </Route>
        </Routes>
        <Toaster/>
    </main>
  )
}

export default App