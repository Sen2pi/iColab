
import { Models } from "appwrite";
import { Link } from "react-router-dom";

type GridDisciplinaListProps = {
  disciplinas: Models.Document[];
  showUser?: boolean;
}
const GridDisciplinaList = ({ disciplinas, showUser = true }: GridDisciplinaListProps) => {
  return (
    <ul className="grid-container">
      {disciplinas.map((disciplina) =>(
          <li key={disciplina.$id} className="relative min-w-80">
            <Link to={`/disciplina/${disciplina.$id}`} className="grid-post_link" >
              <img src={disciplina.imageUrl} alt="post" className="h-full w-full object-cover" />
            </Link>
            <div className="grid-post_user">
                {showUser && (
                  <div className="flex items-center justify-start gap-2 flex-1">
                    <img src={disciplina.professor.imageUrl} alt="creator" className="h-8 w-8 rounded-full" />
                    <p className="line-clamp-1">{disciplina.nome}</p>
                  </div>
                )}
            </div>
          </li>
      ))}
    </ul>
  )
}

export default GridDisciplinaList