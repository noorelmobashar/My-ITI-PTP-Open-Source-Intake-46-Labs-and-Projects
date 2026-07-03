import Layout from "./layouts/Layout/Layout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotesList from "./pages/NotesList/NotesList";
import CreateNote from "./pages/CreateNote/CreateNote";
import EditNote from "./pages/EditNote/EditNote";
import NoteDetails from "./pages/NoteDetails/NoteDetails";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import GuestRoute from "./components/GuestRoute/GuestRoute";

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Navigate to="/login" replace />,
            },
            {
                path: "login",
                element: <GuestRoute><Login /></GuestRoute>,
            },
            {
                path: "register",
                element: <GuestRoute><Register /></GuestRoute>,
            },
            {
                path: "dashboard",
                element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
            },
            {
                path: "notes",
                element: <ProtectedRoute><NotesList /></ProtectedRoute>,
            },
            {
                path: "notes/create",
                element: <ProtectedRoute><CreateNote /></ProtectedRoute>,
            },
            {
                path: "notes/:id",
                element: <ProtectedRoute><NoteDetails /></ProtectedRoute>,
            },
            {
                path: "notes/:id/edit",
                element: <ProtectedRoute><EditNote /></ProtectedRoute>,
            },
            {
                path: "profile",
                element: <ProtectedRoute><Profile /></ProtectedRoute>,
            },
        ],
    },
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
