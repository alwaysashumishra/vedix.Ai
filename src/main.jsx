import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import ContextProvider from "./context/context.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const content = (
  <ThemeProvider>
    <ContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextProvider>
  </ThemeProvider>
);

createRoot(document.getElementById("root")).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      {content}
    </GoogleOAuthProvider>
  ) : (
    content
  )
);
