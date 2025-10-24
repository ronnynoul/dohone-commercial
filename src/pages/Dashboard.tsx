import { useEffect, useState } from "react";
import { supabase } from "../supabaseClients";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [prepaidCount, setPrepaidCount] = useState(0);
  const [postpaidCount, setPostpaidCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>(
    []
  );

  const fetchData = async () => {
    const { data, error } = await supabase.from("enrolements").select("*");

    if (error) {
      console.error("Erreur lors du chargement :", error);
      return;
    }

    if (data) {
      setTotal(data.length);
      setPrepaidCount(data.filter((d) => d.meterType === "prepaid").length);
      setPostpaidCount(data.filter((d) => d.meterType === "postpaid").length);

      const today = new Date().toISOString().split("T")[0];
      setTodayCount(
        data.filter((d) => d.created_at.startsWith(today)).length
      );

      // Données du graphique par jour
      const grouped: Record<string, number> = {};
      data.forEach((d) => {
        const dateKey = d.created_at.split("T")[0];
        grouped[dateKey] = (grouped[dateKey] || 0) + 1;
      });

      const formattedData = Object.entries(grouped)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, count]) => ({ date, count }));

      setChartData(formattedData);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("realtime-enrolements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enrolements" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Tableau de bord des enrôlements
      </h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl mb-10">
        <div className="bg-blue-100 p-5 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-blue-700">Total</h2>
          <p className="text-2xl font-bold text-blue-900 mt-2">{total}</p>
        </div>
        <div className="bg-green-100 p-5 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-green-700">Prépayés</h2>
          <p className="text-2xl font-bold text-green-900 mt-2">{prepaidCount}</p>
        </div>
        <div className="bg-yellow-100 p-5 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-yellow-700">Postpayés</h2>
          <p className="text-2xl font-bold text-yellow-900 mt-2">{postpaidCount}</p>
        </div>
        <div className="bg-purple-100 p-5 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-purple-700">Aujourd'hui</h2>
          <p className="text-2xl font-bold text-purple-900 mt-2">{todayCount}</p>
        </div>
      </div>

      {/* Graphique évolutif */}
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-6xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Évolution des enrôlements
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
