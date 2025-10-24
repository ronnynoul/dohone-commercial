import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="w-full min-h-screen font-sans bg-gray-900 relative overflow-hidden">
      {/* Fond dynamique */}
      <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full -z-10 filter blur-3xl animate-spin-slow"
      >
        <circle
          r="512"
          cx="512"
          cy="512"
          fill="url(#gradient)"
          fillOpacity="0.2"
        />
        <defs>
          <radialGradient id="gradient">
            <stop stopColor="#7775D6" />
            <stop offset="1" stopColor="#E935C1" />
          </radialGradient>
        </defs>
      </svg>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row items-center justify-center max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 gap-10 lg:gap-20">

        {/* Texte */}
        <motion.div 
          className="text-center lg:text-left lg:flex-auto lg:py-32 max-w-md mx-auto lg:mx-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-snug break-words">
            Payez vos factures Eneo en un clic avec <span className="text-pink-400">One Bills</span>.
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
            Renseignez facilement vos informations et faites-vous enrôler en quelques secondes.
          </p>

          {/* Boutons et liens */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:justify-start">
            <Link
              to="/enrolement"
              className="rounded-lg bg-gradient-to-r from-yellow-400 to-pink-400 px-6 py-3 text-sm md:text-base font-bold text-gray-900 shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out"
            >
              Formulaire
            </Link>
            <Link
              to="/liste"
              className="text-sm md:text-base font-semibold text-pink-400 hover:text-white hover:underline transition duration-300"
            >
              Voir la liste des enrôlements →
            </Link>
            <Link
              to="/dashboard"
              className="text-sm md:text-base font-semibold text-white hover:text-pink-400 hover:underline transition duration-300"
            >
              Consulter le dashboard →
            </Link>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="relative mt-8 lg:mt-0 lg:flex-shrink-0 lg:self-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img
            src="https://www.my-dohone.com/dohone/res/images/home/payment.png"
            alt="App screenshot"
            className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md rounded-xl bg-white/5 ring-1 ring-white/20 shadow-xl hover:shadow-2xl transition-all duration-500"
          />
          {/* Badge flottant */}
          <div className="absolute top-2 left-2 bg-pink-400 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
            Rapide & Sécurisé
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <p className="text-gray-400 text-sm text-center mt-10 px-4">
        © 2025 HARRYS NOULA | Tous droits réservés
      </p>

      {/* Animations tailwind personnalisées */}
      <style>
        {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 120s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
