import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@radix-ui/themes/styles.css';
import './global.css'
import { Theme, ThemePanel } from '@radix-ui/themes'
import "vditor/dist/index.css"
import { DialogProvider } from './components/dialog/DialogContext';
import { Dialog } from './components/dialog/Dialog';
import { initDirectoryStore } from './store/directory';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme>
      <DialogProvider>
        <App />
        <Dialog />
      </DialogProvider>
      {/* <ThemePanel /> */}
    </Theme>
  </React.StrictMode>
)

postMessage({ payload: 'removeLoading' }, '*')
initDirectoryStore()