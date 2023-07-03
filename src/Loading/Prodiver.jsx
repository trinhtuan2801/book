import { createContext, useContext, useState } from "react"
import Loading from "."

const Context = createContext()

const Provider = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <Context.Provider value={{
      setOpen
    }}>
      {children}
      {open &&
        <Loading />
      }
    </Context.Provider>
  )
}

export default Provider

export const useLoading = () => {
  const { setOpen } = useContext(Context)

  return {
    showLoading: () => setOpen(true),
    hideLoading: () => setOpen(false)
  }
}