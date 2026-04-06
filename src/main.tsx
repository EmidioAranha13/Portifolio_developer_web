import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store/index.tsx';
import App from './App.tsx'
import './index.css'

/**
 * Ponto de entrada da aplicação React.
 * Monta a árvore raiz com StrictMode e Provider do Redux.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
