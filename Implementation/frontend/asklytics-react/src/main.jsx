import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfigProvider, theme } from 'antd';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="573818600958-kaj7vbphtvg4883he4r8s79qk4qglurd.apps.googleusercontent.com">
      <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
        <App />
      </ConfigProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
