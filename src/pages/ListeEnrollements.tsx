import { useEffect, useState } from "react";
import { Trash2, Info, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClients";

interface Enrolement {
  id: string;
  name: string;
  address: string;
  meterNumber: string;
  phone: string;
  email: string;
  meterType: string;
  usage: string;
  created_at: string;
}

export default function ListeEnrolements() {
  const navigate = useNavigate();
  const [enrolements, setEnrolements] = useState<Enrolement[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Enrolement | null>(null);

  // Charger depuis Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("enrolements")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setEnrolements(data);
    };
    fetchData();

    const sub = supabase
      .channel("realtime-enrolements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enrolements" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEnrolements((prev) => [payload.new as Enrolement, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setEnrolements((prev) =>
              prev.filter((e) => e.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  const handleDeleteLocal = (id: string) => {
    const updated = enrolements.filter((e) => e.id !== id);
    setEnrolements(updated);
  };

  const filtered = enrolements.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.address.toLowerCase().includes(search.toLowerCase()) ||
      e.meterNumber.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 relative">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center">
       Liste des enrôlements récents
      </h2>


      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom, adresse ou compteur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:max-w-lg max-w-[90%] mb-6 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
      />

      {/* Liste */}
      <div className="w-full sm:max-w-lg h-[520px] overflow-y-auto bg-white p-4 rounded-2xl shadow-lg">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Aucun enrôlement trouvé.
          </p>
        ) : (
          filtered.map((enr) => (
            <div
              key={enr.id}
              className="relative bg-gray-50 p-4 mb-3 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{enr.name}</p>
                <p className="text-gray-600 text-sm">{enr.address}</p>
                <p className="text-sm text-blue-400">
                  {new Date(enr.created_at).toLocaleString("fr-FR")}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {/* Sur desktop : texte + icône */}
                <button
                  onClick={() => setSelected(enr)}
                  className="hidden sm:flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-lg transition"
                >
                  <Info size={16} />
                  Détails
                </button>

                {/* Mobile : icône seule */}
                <button
                  onClick={() => setSelected(enr)}
                  className="sm:hidden bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition"
                >
                  <Info size={18} />
                </button>

                <button
                  onClick={() => handleDeleteLocal(enr.id)}
                  className="hidden sm:flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg transition"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>

                <button
                  onClick={() => handleDeleteLocal(enr.id)}
                  className="sm:hidden bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Boutons du bas */}
      <div className="flex sm:flex-row flex-col gap-3 mt-6 w-full sm:w-auto justify-center items-center">
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 font-bold rounded-lg transition-all duration-200 w-full sm:w-auto"
        >
          Retour à l'accueil
        </button>
        <button
          onClick={() => navigate("/mes-enrolements")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 font-bold rounded-lg transition-all duration-200 w-full sm:w-auto"
        >
          Mes enrôlements
        </button>
      </div>

      {/* MODALE DÉTAILS (mobile) */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center sm:hidden z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-sm p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
              Détails du client
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <span className="font-semibold">Nom :</span> {selected.name}
              </p>
              <p>
                <span className="font-semibold">Téléphone :</span> {selected.phone}
              </p>
              <p>
                <span className="font-semibold">Email :</span> {selected.email}
              </p>
              <p>
                <span className="font-semibold">Adresse :</span> {selected.address}
              </p>
              <p>
                <span className="font-semibold">Type de compteur :</span> {selected.meterType}
              </p>
              <p>
                <span className="font-semibold">Numer de Compteur :</span> {selected.meterNumber}
              </p>
              <p>
                <span className="font-semibold">Usage :</span> {selected.usage}
              </p>
              <p>
                <span className="font-semibold">Date :</span>{" "}
                {new Date(selected.created_at).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PANNEAU DÉTAILS (desktop) */}
      {selected && (
        <div className="hidden sm:block fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 z-50 animate-slide-left">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-700">Détails du client</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2 text-gray-700 text-sm">
            <p><span className="font-semibold">Nom :</span> {selected.name}</p>
            <p><span className="font-semibold">Adresse :</span> {selected.address}</p>
            <p><span className="font-semibold">Type de compteur :</span> {selected.meterType}</p>
            <p><span className="font-semibold">Téléphone :</span> {selected.phone}</p>
            <p><span className="font-semibold">Email :</span> {selected.email}</p>
            <p><span className="font-semibold">Numero de Compteur :</span> {selected.meterNumber}</p>
            <p><span className="font-semibold">Usage :</span> {selected.usage}</p>
            <p>
              <span className="font-semibold">Date d'enrôlement :</span>{" "}
              {new Date(selected.created_at).toLocaleString("fr-FR")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
