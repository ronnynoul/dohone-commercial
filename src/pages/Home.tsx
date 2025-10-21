import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="w-full min-h-screen"> 
      {/* Wrapper principal qui prend tout l'écran sur mobile */}
      <div className="relative isolate overflow-hidden bg-gray-900 w-full h-full">

        {/* SVG de fond */}
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full -z-10 filter blur-3xl"
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
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          
          {/* Texte */}
          <div className="text-center lg:text-left lg:flex-auto lg:py-32 max-w-md mx-auto lg:mx-0">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Payez vos factures Eneo en un clic avec One Bills.
            </h2>
            <p className="mt-6 text-lg text-gray-300">
              Renseignez facilement vos informations et faites-vous enrôler.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4 lg:justify-start">
              <Link
                to="/enrolement"
                className="rounded-md bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow hover:bg-yellow-300 focus:outline-2 focus:outline-offset-2 focus:outline-white"
              >
                Commencer
              </Link>
              <Link to="/liste" className=" text-sm font-semibold text-white hover:text-gray-100">
                 Voir la liste des enrôlements <span aria-hidden="true">→</span>
              </Link>
                <Link to="/dashboard" className="text-sm font-semibold text-white hover:text-gray-100">
                 consulter le dashboard <span aria-hidden="true">→</span>
              </Link> 
            </div>
          

            
          </div>

          {/* Image */}
          <div className="relative mt-10 lg:mt-0 lg:flex-shrink-0 lg:self-center">
            <img
              src="https://www.my-dohone.com/dohone/res/images/home/payment.png"
              alt="App screenshot"
              className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md rounded-md bg-white/5 ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
