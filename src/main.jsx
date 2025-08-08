import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import route from './routes/route.jsx'
import { ConfigProvider, theme } from 'antd'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider 
      theme={{
        algorithm: theme.darkAlgorithm,
      }}>
      <RouterProvider router={route}/>
    </ConfigProvider>
  </StrictMode>,
)
