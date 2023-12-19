import { Link } from 'react-router-dom'

const Disciplina = () => {
  return (
    <div>
      <p className='text-small-regular text-light-2 text-center mt-2'>
            <Link to="/criar-disciplina" className='text-primary-500 text-small-semibold ml-1'> + Criar
            </Link>
          </p>
    </div>
  )
}

export default Disciplina