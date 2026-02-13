import "./i18n.js";
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

const appStyles: React.CSSProperties = {
  minHeight: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

export default function App() {
  const { ready } = useTranslation();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <DirectionProvider>
        <div style={appStyles}>
          <Navbar />
          <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
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
