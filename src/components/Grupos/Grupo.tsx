// src/components/Grupos/Grupo.tsx
import React from 'react';

interface GrupoProps {
  numeroDeAlunos: number;
  concluido: boolean;
  liderDeGrupo: string;
  tema: string;
  nota: number;
  prazoDeEntrega: Date;
}

const Grupo: React.FC<GrupoProps> = ({ numeroDeAlunos, concluido, liderDeGrupo, tema, nota, prazoDeEntrega }) => {
  return (
    <div>
      <h3>Número de Alunos: {numeroDeAlunos}</h3>
      <p>Concluído: {concluido ? 'Sim' : 'Não'}</p>
      <p>Líder de Grupo: {liderDeGrupo}</p>
      <p>Tema: {tema}</p>
      <p>Nota: {nota}</p>
      <p>Prazo de Entrega: {prazoDeEntrega.toDateString()}</p>
    </div>
  );
};

export default Grupo;
