import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { store } from './app/app.store.js'
import { Provider } from 'react-redux'
import { ToastProvider } from './features/common/Toast.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </Provider>
)
