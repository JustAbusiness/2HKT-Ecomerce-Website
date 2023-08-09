import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useContext } from 'react';
import { LocalStorageEventTarget } from './utils/auth';
import { AppContext } from './contexts/app.context';
import "./App.css"

function App() {
  const routeElements = useRouteElement()
  const {reset} = useContext(AppContext)

  useEffect(() => {               // KHI XÓA TOKEN API TRONG LOCAL STORAGE SẼ KO BỊ LOAD LẠI 2 LẦN
    LocalStorageEventTarget.addEventListener("clearLS", reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS',reset)
      }
  }, [reset])


  return (
    <div>
    {routeElements}  
      <ToastContainer></ToastContainer>
    </div>
  )
}

export default App
