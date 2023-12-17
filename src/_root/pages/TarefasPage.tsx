// src/pages/TarefasPage.tsx
import React from 'react';
import Tarefa from '../../components/Tarefas/Tarefa';

const TarefasPage: React.FC = () => {
  const exemploTarefa = {
    nome: 'Tarefa de Exemplo',
    dataInicio: new Date(),
    dataFim: new Date(),
    atribuidaA: 'Usuário Exemplo',
    concluido: false,
  };

  return (
    <div>
      <h1>Página de Tarefas</h1>
      <Tarefa {...exemploTarefa} />
    </div>
  );
};

export default TarefasPage;
