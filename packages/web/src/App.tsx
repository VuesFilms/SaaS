import "./i18n.js";
import "./theme.css";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "./contexts/ThemeContext.js";
import { DirectionProvider } from "./contexts/DirectionContext.js";
import Navbar from "./components/Navbar.js";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import EditorPage from "./pages/EditorPage.js";
import NotFound from "./pages/NotFound.js";

export default function App() {
  const { ready } = useTranslation();

  if (!ready) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-family)",
          fontSize: "15px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <DirectionProvider>
        <div
          style={{
            minHeight: "100vh",
            fontFamily: "var(--font-family)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            transition: "background-color 0.25s ease, color 0.25s ease",
          }}
        >
          <Navbar />
          <main
            style={{
              padding: "28px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/editor/:id" element={<EditorPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </DirectionProvider>
    </ThemeProvider>
  );
}
