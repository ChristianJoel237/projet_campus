import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LangueProvider } from "./context/LangueContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
    <StrictMode>
        <ThemeProvider>
            <LangueProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <App />
                    </NotificationProvider>
                </AuthProvider>
            </LangueProvider>
        </ThemeProvider>
    </StrictMode>,
);
