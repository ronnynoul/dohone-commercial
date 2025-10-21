import { useEffect, useState,} from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface Enrolement {
  name: string;
  address: string;
  meterNumber: string;
  date: string;
}

export default function ListeEnrolements() {
  const navigate = useNavigate();
  const [enrolements, setEnrolements] = useState<Enrolement[]>([]);

  // Charger les enrôlements stockés dans localStorage
  useEffect(() => {
    const stored = localStorage.getItem("enrolements");
    if (stored) {
      setEnrolements(JSON.parse(stored));
    }
  }, []);

  // Supprimer un enrôlement localement
  const handleDelete = (index: number) => {
    const updated = enrolements.filter((_, i) => i !== index);
    setEnrolements(updated);
    localStorage.setItem("enrolements", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Liste des enrôlements récents
      </h2>

      <div className="w-full max-w-lg h-[500px] overflow-y-auto bg-white p-4 rounded-2xl shadow-lg">
        {enrolements.length === 0 ? (
          <p className="text-center text-gray-500">Aucun enrôlement pour le moment.</p>
        ) : (
          enrolements.map((enr, index) => (
            <div
              key={index}
              className="relative bg-gray-50 p-4 mb-3 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {enr.name} ({enr.address})
                </p>
                <p className="text-gray-600">{enr.meterNumber}</p>
                <p className="text-sm text-blue-400">{enr.date}</p>
              </div>

              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700 transition p-1"
                title="Supprimer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
      <button
          onClick={() => navigate("/")}
          className="bg-yellow-300 w-90 mt-2 hover:bg-yellow-700 text-white px-6 py-2 font-bold rounded-lg transition-all duration-200"
        >
          Retour a l'accueil
        </button>
    </div>
  );
}
