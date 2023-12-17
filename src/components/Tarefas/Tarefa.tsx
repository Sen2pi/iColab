// src/components/Tarefas/Tarefa.tsx
import React from 'react';

interface TarefaProps {
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  atribuidaA: string;
  concluido: boolean;
}

const Tarefa: React.FC<TarefaProps> = ({ nome, dataInicio, dataFim, atribuidaA, concluido }) => {
  return (
    <div>
      <h3>{nome}</h3>
      <p>Data de Início: {dataInicio.toDateString()}</p>
      <p>Data de Fim: {dataFim.toDateString()}</p>
      <p>Atribuída a: {atribuidaA}</p>
      <p>Concluída: {concluido ? 'Sim' : 'Não'}</p>
    </div>
  );
};

export default Tarefa;
