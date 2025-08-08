import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@department-of-veterans-affairs/component-library/dist/main.css";
import App from './App.jsx'
import {
  defineCustomElements,
} from "@department-of-veterans-affairs/component-library";

defineCustomElements();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
