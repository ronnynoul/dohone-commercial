import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Zap, Plug, BarChart3, ClipboardEdit, Menu } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Enrollment {
  name: string;
  phone: string;
  email: string;
  meterType: "prepaid" | "postpaid";
  meterNumber: string;
  address: string;
  usage: string;
  date: string;
}

interface ChartData {
  date: string;
  total: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, prepaid: 0, postpaid: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadData = () => {
    const data: Enrollment[] = JSON.parse(localStorage.getItem("enrolements") || "[]");

    const prepaidCount = data.filter((d) => d.meterType === "prepaid").length;
    const postpaidCount = data.filter((d) => d.meterType === "postpaid").length;

    const grouped: Record<string, number> = data.reduce((acc, curr) => {
      const date = curr.date.split(" à ")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const formatted: ChartData[] = Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }));

    setStats({ total: data.length, prepaid: prepaidCount, postpaid: postpaidCount });
    setChartData(formatted);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar responsive */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <BarChart3 className="text-blue-600" size={28} />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Dashboard Enrôlement
          </h1>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
          >
            <ClipboardEdit size={18} />
            Accueil
          </button>
          <button
            onClick={loadData}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            <BarChart3 size={18} />
            Actualiser
          </button>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <Menu size={24} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg flex flex-col gap-2 p-2 z-50">
              <button
                onClick={() => { navigate("/"); setMenuOpen(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50 transition"
              >
                <ClipboardEdit size={16} /> Accueil
              </button>
              <button
                onClick={() => { loadData(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                <BarChart3 size={16} /> Actualiser
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Statistiques en temps réel
        </h2>

        {/* Cartes de stats responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <Users className="mx-auto text-blue-500 mb-2" size={36} />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">{stats.total}</h2>
            <p className="text-gray-500">Total des enrôlements</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <Zap className="mx-auto text-yellow-500 mb-2" size={36} />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">{stats.prepaid}</h2>
            <p className="text-gray-500">Compteurs prépayés</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <Plug className="mx-auto text-green-500 mb-2" size={36} />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">{stats.postpaid}</h2>
            <p className="text-gray-500">Compteurs postpayés</p>
          </div>
        </div>

        {/* Graphique responsive */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center">
            Évolution des enrôlements
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">
              Aucune donnée à afficher pour le moment.
            </p>
          )}
        </div>

        <p className="text-sm text-gray-400 text-center mt-4">
          Données actualisées automatiquement toutes les 15 secondes ⟳
        </p>
      </div>
    </div>
  );
}
