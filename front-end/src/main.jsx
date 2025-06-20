import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import {userRoutes} from './routes/UserRoutes.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={userRoutes} />
  </StrictMode>,
)
