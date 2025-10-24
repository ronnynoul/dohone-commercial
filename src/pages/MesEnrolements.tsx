import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

interface Enrolement {
  name: string;
  address: string;
  meterNumber: string;
  meterType: string;
  usage: string;
  date: string;
}

export default function MesEnrolements() {
  const navigate = useNavigate();
  const [enrolements, setEnrolements] = useState<Enrolement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("enrolements");
    if (stored) {
      try {
        const parsed: Enrolement[] = JSON.parse(stored);
        setEnrolements(parsed);
      } catch (e) {
        console.error("Erreur de lecture du localStorage :", e);
      }
    }
  }, []);

  const handleDelete = (index: number) => {
    const updated = enrolements.filter((_, i) => i !== index);
    setEnrolements(updated);
    localStorage.setItem("enrolements", JSON.stringify(updated));
  };

  const exportToPDF = () => {
    if (enrolements.length === 0) {
      alert("Aucun enrôlement à exporter.");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Liste de mes enrôlements", 14, 15);
    doc.setFont("helvetica", "normal");

    const rows = enrolements.map((e) => [
      e.name,
      e.address,
      e.meterNumber,
      e.meterType,
      e.usage,
      e.date,
    ]);

    autoTable(doc, {
      head: [["Nom", "Adresse", "Numéro", "Type", "Usage", "Date"]],
      body: rows,
      startY: 25,
    });

    const fileName = prompt("Entrez le nom du fichier PDF :", "MesEnrolements");
    doc.save(`${fileName || "MesEnrolements"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-700 text-center">
        Mes Enrôlements Locaux
      </h2>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-4 sm:p-5 overflow-y-auto max-h-[500px]">
        {enrolements.length === 0 ? (
          <p className="text-center text-gray-500">
            Aucun enrôlement local trouvé.
          </p>
        ) : (
          enrolements.map((enr, index) => (
            <div
              key={index}
              className="relative bg-gray-50 p-3 sm:p-4 mb-3 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-start"
            >
              
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-gray-800">{enr.name}</p>
                <p className="text-gray-600 text-sm">{enr.address}</p>
                <p className="text-gray-600">{enr.meterNumber}</p>
                <p className="text-sm text-blue-400">{enr.date}</p>
              </div>

              
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700 transition p-1 self-start ml-4"
                title="Supprimer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-lg justify-center">
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow transition w-full sm:w-auto"
        >
          Retour à l'accueil
        </button>

        <button
          onClick={exportToPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow transition w-full sm:w-auto justify-center"
        >
          <FileDown size={18} />
          Exporter en PDF
        </button>
      </div>
    </div>
  );
}
