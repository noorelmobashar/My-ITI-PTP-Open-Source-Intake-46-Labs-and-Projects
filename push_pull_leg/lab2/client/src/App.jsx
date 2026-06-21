import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";

// =============================================
// ProtectedRoute
// Redirects to login if the user is not authenticated.
// Shows a loading spinner while verifying the token.
// =============================================
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0B141A",
          color: "#8696A0",
          gap: "12px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
};

// =============================================
// PublicRoute
// Redirects to chat if the user IS authenticated.
// =============================================
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0B141A",
          color: "#8696A0",
          gap: "12px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  return user ? <Navigate to="/chat" replace /> : children;
};

// =============================================
// App Component
// Sets up routing and wraps everything in providers.
// Provider nesting order:
//   AuthProvider → SocketProvider → ChatProvider
// This order matters because Chat needs Socket,
// and Socket needs Auth.
// =============================================
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <AuthPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              {/* Catch all — redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
