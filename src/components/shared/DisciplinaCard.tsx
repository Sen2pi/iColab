import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useNavigate } from "react-router-dom";
import DisciplinaSave from "./DisciplinaSave";
import { useGetCurrentUser, useGetSaveById, useGetSaveByUserAndDisciplinaId } from "@/lib/react-query/queriesAndMutations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { deleteDisciplina } from "@/lib/appwrite/api";
import { Button } from "../ui/button";
import { useState } from "react";

type DisciplinaCardProps = {
  disciplina: Models.Document;
}
const DisciplinaCard = ({ disciplina }: DisciplinaCardProps) => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const { data: user } = useGetCurrentUser();
  const saveId = useGetSaveByUserAndDisciplinaId(user?.$id || " ", disciplina?.$id || " ");
  const { data: save } = useGetSaveById(saveId.data || "")
  const handleRefresh = () => {
    setRefresh(!refresh); // Toggle the state to trigger a re-render
  };
  const handleDeleteDisciplina = async () => {
    try {

      await deleteDisciplina(disciplina?.$id || " ", disciplina?.imageId);
      handleRefresh();
      navigate(0);
      // Atualiza a página
    } catch (error) {
      console.log(error)
    }
  }
  if (!disciplina.professor) return;
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/profile/${disciplina.professor.$id}`}>
                  <img src={disciplina?.professor?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="professor" className="rounded-full w-12 lg:h-12" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="small-medium lg:base-medium">Ir para Prefil</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold">
              {disciplina.professor.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatDateString(disciplina.$createdAt)}
              </p>
            </div>
          </div>

        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/editar-disciplina/${disciplina.$id}`} className={`${user?.$id !== disciplina.professor.$id && "hidden"}`}>
                <img src={'/assets/icons/edit.svg'} alt="edit" className="w-12 lg:h-12" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="small-medium lg:base-medium">Editar Disciplina</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className={`${user?.$id !== disciplina.professor.$id && "hidden"}`} onClick={handleDeleteDisciplina}>
                <img src={'/assets/icons/delete.svg'} alt="delete" className="w-12 lg:h-12" />
              </Button >
            </TooltipTrigger>
            <TooltipContent>
              <p className="small-medium lg:base-medium">Remover Disciplina</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        {save?.users.$id !== user?.$id && user?.$id !== disciplina.professor.$id ? (
          <span style={{ color: 'gray', cursor: 'not-allowed' }}>
            <div className="small-medium lg:base-medium py-5">
              <p>
                {disciplina.nome}
              </p>

            </div>
            <img src={disciplina.imageUrl || '/assets/icons/profile-placeholder.svg'} className="post-card_img" alt="post image" />
            Subscreva para aceder
          </span>
        ) : (
          <Link to={`/disciplina/${disciplina.$id}`}>
            <div className="small-medium lg:base-medium py-5">
              <p>
                {disciplina.nome}
              </p>

            </div>
            <img src={disciplina.imageUrl || '/assets/icons/profile-placeholder.svg'} className="post-card_img" alt="post image" />
          </Link>
        )}
      </div>
      <DisciplinaSave disciplina={disciplina} userId={user?.$id || ""} />
    </div>
  );
};

export default DisciplinaCard