
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Column, INewRequesito, INewTarefa, IUpdateRequesito, IUpdateTarefa, Task } from "@/types";
import ColumnContainer from "@/components/shared/ColumnContainer";
import PlusIcon from "@/components/ui/PlusIcon";
import TaskCard from "@/components/shared/TaskCard";
import { useGetCurrentUser, useGetRecentRequesitos, useGetRecentTarefas, } from "@/lib/react-query/queriesAndMutations";
import { createRequesito, createTarefa, deleteRequesitoAndMoveTarefas, deleteTarefa, getUserRequesitos, updateRequesito, updateTarefa } from "@/lib/appwrite/api";
import { useParams } from "react-router-dom";
import { Models } from "appwrite";



function Tarefa() {
  const { data: user } = useGetCurrentUser()
  const { id_g: id_g } = useParams()
  const [columns, setColumns] = useState<Column[]>([]);
  const { data: tarefas, isPending: isTarefaLoading } = useGetRecentTarefas();
  const { data: requesitos, isPending: isRequesitoLoading } = useGetRecentRequesitos();
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const fetchUserRequesitos = async () => {
      try {
        const userRequesitos = await getUserRequesitos(user?.$id || '');
        const userTarefas = await getUserRequesitos(user?.$id || '');
        const userDefaultCols = userRequesitos.map((requesito) => ({
          id: requesito.$id,
          title: requesito.title,
        }));
        const userDefaulttarefas = userTarefas.map((tarefa) => ({
          id: tarefa.$id,
          columnId: tarefa.columnId,
          content: tarefa.content,
          date: tarefa.date,
        }));
        setColumns((prevColumns) => [...prevColumns, ...userDefaultCols]);
        setTasks((prevTasks) => [...prevTasks, ...userDefaulttarefas]);
      } catch (error) {
        console.error('Error fetching user requisitos', error);
      }
    };

    if (user) {
      fetchUserRequesitos();
    }
  }, [user]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div
      className="
       room--container h-full
       
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      flex
      gap-2
      "
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: string, numero?: string) {

    const newTarefa: INewTarefa = {
      grupo: id_g || "",
      date: new Date(),
      concluido: false,
      atribuido: numero ? numero : "",
      columnId: columnId,
      content: `Task ${tasks.length + 1}`,
    }

    const idNewTarefa = createTarefa(newTarefa);

    const newTask: Task = {
      id: idNewTarefa.toString(),
      columnId,
      content: `Task ${tasks.length + 1}`,
      date: newTarefa.date.toLocaleDateString(),
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: string) {
    const newTasks = tasks.filter((task) => task.id !== id);
    deleteTarefa(id)
    setTasks(newTasks);
  }

  function updateTask(id: string, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    const newTarefas = tarefas?.documents.map((tarefa: Models.Document) => {
      if (tarefa.$id !== id) {
        const updatedTarefa: IUpdateTarefa = {
          tarefaId: id,
          date: new Date(),
          concluido: tarefa?.columnId?.title === "Concluido",
          atribuido: tarefa.atribuido,
          columnId: tarefa.columnId,
          content: content,
        }
        updateTarefa(updatedTarefa);
        return tarefa;
      }
    });
    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: INewRequesito = {
      title: `Column ${columns.length + 1}`,
      grupo: id_g || "",
      user: user?.$id || "",
    };
    const idtoAdd = createRequesito(columnToAdd);
    const newColumns: Column = {
      id: idtoAdd.toString(),
      title: columnToAdd.title,
    }

    setColumns([...columns, newColumns]);
  }

  function deleteColumn(id: string) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);

    deleteRequesitoAndMoveTarefas(id, user?.$id || '');
  }

  function updateColumn(id: string, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    const newRequesitos = requesitos?.documents.map((requesito: Models.Document) => {
      if (requesito.$id !== id) {
        const colToUpdate: IUpdateRequesito = {
          requesitoId: id,
          title: title,
        }
        updateRequesito(colToUpdate);
        return requesito;
      }});
      setColumns(newColumns);
    }

  function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
          setActiveColumn(event.active.data.current.column);
          return;
        }

        if (event.active.data.current?.type === "Task") {
          setActiveTask(event.active.data.current.task);
          return;
        }
      }

  function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        console.log("DRAG END");

        setColumns((columns) => {
          const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

          const overColumnIndex = columns.findIndex((col) => col.id === overId);

          return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
      }

  function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
          setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
              // Fix introduced after video recording
              tasks[activeIndex].columnId = tasks[overIndex].columnId;
              return arrayMove(tasks, activeIndex, overIndex - 1);
            }

            return arrayMove(tasks, activeIndex, overIndex);
          });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
          setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);

            // Crie uma cópia da tarefa ativa para evitar mutações diretas
            const updatedTask = { ...tasks[activeIndex], columnId: overId.toString() };

            console.log("DROPPING TASK OVER COLUMN", { activeIndex });

            // Use a função arrayMove para mover a tarefa para a nova posição
            const newTasks = arrayMove(tasks, activeIndex, activeIndex);

            // Substitua a tarefa antiga pela tarefa atualizada
            newTasks[activeIndex] = updatedTask;

            return newTasks;
          });
        }
      }
}
  export default Tarefa;