import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from 'sonner'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
    <Toaster 
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      theme="system"
      toastOptions={{
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        className: 'toast-custom',
      }}
    />
  </ThemeProvider>
);
