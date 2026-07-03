import Header from "../../components/Header/Header";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Layout() {
    const { mode } = useSelector((state) => state.theme);

    return (
        <div data-bs-theme={mode} style={{ minHeight: "100vh" }} className={mode === "dark" ? "bg-dark text-light" : "bg-light text-dark"}>
            <Header />
            <div className="container py-4">
                <Outlet />
            </div>
        </div>
    );
}
