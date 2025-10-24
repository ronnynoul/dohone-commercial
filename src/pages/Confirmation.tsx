import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import QRCode from "react-qr-code";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nomClient } = location.state || {};

  const playStoreLink = "https://play.google.com/store/apps/details?id=com.dohone.eneopay";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-10">
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 text-center max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="text-green-500 w-16 h-16 animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Félicitations !</h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Le compte de <span className="text-blue-600 font-semibold">{nomClient}</span> a été enrôlé avec succès !
        </p>

        <div className="h-[2px] w-16 bg-green-500 mx-auto mb-6 rounded-full" />

        <div className="flex flex-col items-center mb-6">
          <p className="mb-3 font-medium text-gray-600">Scannez ce QR code pour télécharger l’application :</p>

          <div className="bg-white p-4 rounded-lg shadow-inner">
            <QRCode value={playStoreLink} size={190} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/enrolement")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Retour au formulaire
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 font-medium rounded-lg transition-all duration-300"
          >
            Accueil
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-6">© 2025 HARRYS NOULA | Tous droits réservés</p>
    </div>
  );
}
