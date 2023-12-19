import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

type DisciplinaCardProps = {
  disciplina: Models.Document;
};

const DisciplinaCard = ({ disciplina }: DisciplinaCardProps) => {
  const { user } = useUserContext();

  if (!disciplina.creator) return;

  return (
    <div className="disciplina-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${disciplina.creator.$id}`}>
            <img
              src={
                disciplina.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {disciplina.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(disciplina.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {disciplina.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-disciplina/${disciplina.$id}`}
          className={`${user.id !== disciplina.creator.$id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/disciplinas/${disciplina.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{disciplina.caption}</p>
          <ul className="flex gap-1 mt-2">
            {disciplina.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={disciplina.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="disciplina image"
          className="disciplina-card_img"
        />
      </Link>
    </div>
  );
};

export default DisciplinaCard;