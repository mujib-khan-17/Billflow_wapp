import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="w-full bg-white shadow-md py-4 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
                <img src="/addnectar_logo.png" alt="Logo" className="h-8" />
                <span className="text-xl font-bold text-blue-700">Billflow</span>
                <nav className="flex flex-wrap gap-2 sm:gap-4 text-gray-700 text-sm sm:text-base">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="hover:text-blue-600 transition cursor-pointer"
                    >Dashboard</button>
                    <button
                        onClick={() => navigate("/Projects")}
                        className="hover:text-blue-600 transition cursor-pointer"
                    >Projects</button>
                    <button
                        onClick={() => navigate("/billing-generation")}
                        className="hover:text-blue-600 transition cursor-pointer"
                    >Billing Generation</button>
                    <button
                        onClick={() => navigate("/billing-history")}
                        className="hover:text-blue-600 transition cursor-pointer"
                    >Billing History</button>
                </nav>
            </div>
            <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow cursor-pointer"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }}
            >
                Logout
            </button>
        </header>)
}