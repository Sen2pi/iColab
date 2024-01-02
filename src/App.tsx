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
import Grupo from './_root/pages/Grupo';
import CriarGrupo from './_root/pages/CriarGrupo';
import GrupoDetalhe from './_root/pages/GrupoDetalhe';
import EditarGrupo from './_root/pages/EditarGrupo';
import Tarefa from './_root/pages/Tarefa';
import CriarTarefa from './_root/pages/CriarTarefa';
import EditarTarefa from './_root/pages/EditarTarefa';
import EditarRequesito from './_root/pages/EditarRequesito';
import Ficheiro from './_root/pages/Ficheiro';
import EnviarFicheiro from './_root/pages/EnviarFicheiro';
import Chat from './_root/pages/Chat';
import Profile from './_root/pages/Profile';
import EditarProfile from './_root/pages/EditarProfile';
import MinhasDisciplinas from './_root/pages/MinhasDisciplinas';
import EditarModulo from './_root/pages/EditarModulo';
import CriarModulo from './_root/pages/CriarModulo';
import Notas from './_root/pages/MinhasNotas';
import CriarRequesito from './_root/pages/CriarRequesito';
import Historico from './_root/pages/Historico';
import MinhasNotas from './_root/pages/MinhasNotas';


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
                <Route path="/notas" element={<MinhasNotas/>}/>

                <Route path="/disciplina" element={<MinhasDisciplinas/>}/>
                <Route path="/criar-disciplina" element={<CriarDisciplina/>}/>
               
                <Route path="/disciplina/:id" element={<DisciplinaDetalhe/>}/>
                <Route path="/editar-disciplina/:id" element={<EditarDisciplina/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/notas" element={<Notas/>}/>
                <Route path="/disciplina/:id/editar-modulo/:id_m" element={<EditarModulo/>}/>
                <Route path="/disciplina/:id/criar-modulo-disciplina/:id" element={<CriarModulo/>}/>

                <Route path="/disciplina/:id/grupos" element={<Grupo/>}/>
                <Route path="/disciplina/:id/criar-grupo" element={<CriarGrupo/>}/>
                <Route path="/disciplina/:id/grupo/:id_g" element={<GrupoDetalhe/>}/>
                <Route path="/disciplina/:id/editar-grupo/:id_g" element={<EditarGrupo/>}/>

                <Route path="/disciplina/:id/grupo/:id_g/chat/:id_c" element={<Chat/>}/>

                <Route path="/disciplina/:id/grupo/:id_g/historicos" element={<Historico/>}/>

                <Route path="/disciplina/:id/grupo/:id_g/ficheiros" element={<Ficheiro/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/criar-ficheiro" element={<EnviarFicheiro/>}/>
      
                
                <Route path="/disciplina/:id/grupo/:id_g/tarefas" element={<Tarefa/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/criar-tarefa" element={<CriarTarefa/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/editar-tarefa/:id_t" element={<EditarTarefa/>}/>
          
                <Route path="/disciplina/:id/grupo/:id_g/criar-requesito/" element={<CriarRequesito/>}/>
                <Route path="/disciplina/:id/grupo/:id_g/editar-requesito/:id_r" element={<EditarRequesito/>}/>


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