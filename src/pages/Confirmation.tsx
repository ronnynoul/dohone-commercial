import { useLocation, useNavigate } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { nomClient } = location.state || {};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-4">
          Félicitations 
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Bravo ! Le compte de <span className="font-bold">{nomClient}</span> a été enrôlé avec succès.
        </p>
        <button
          onClick={() => navigate("/enrolement")}
          className="bg-green-400 hover:bg-green-700 text-white px-6 py-2 font-semibold rounded-lg transition-all duration-200"
        >
          Retour au formulaire
        </button>
      </div>
    </div>
  );
}
