// src/pages/GruposPage.tsx
import React from 'react';
import Grupo from '../../components/Grupos/Grupo';

const GruposPage: React.FC = () => {
  const exemploGrupo = {
    numeroDeAlunos: 5,
    concluido: false,
    liderDeGrupo: 'Líder Exemplo',
    tema: 'Tema do Grupo de Exemplo',
    nota: 9.5,
    prazoDeEntrega: new Date(),
  };

  return (
    <div>
      <h1>Página de Grupos</h1>
      <Grupo {...exemploGrupo} />
    </div>
  );
};

export default GruposPage;
