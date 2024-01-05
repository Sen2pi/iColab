import { useTheme } from "@/components/shared/theme-provider"

const Loader = () => {
  const { theme } = useTheme()
  return (
    <div className={`flex-center w-full ${theme == 'dark' && 'text-dark-1' || theme == 'light' && 'invert-black' }`}>
        <img 
            src="/assets/icons/loader.svg" 
            alt="loader" 
            width={24} 
            height={24} 
        /> 
    </div>
  )
}

export default Loader