import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../supabaseClients"; 

const schema = yup.object({
  name: yup.string().required("Le nom est obligatoire"),
  phone: yup
    .string()
    .matches(/^6[0-9]{8}$/, "Le numéro doit commencer par 6 et contenir exactement 9 chiffres")
    .required("Le numéro de téléphone est obligatoire"),
  email: yup
    .string()
    .email("Adresse e-mail invalide")
    .matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    "Veuillez entrer une adresse e-mail valide (ex: exemple@mail.com)"
    )
    .required("L'adresse e-mail est obligatoire"),

  meterType: yup
    .string()
    .oneOf(["prepaid", "postpaid"], "Type de compteur invalide")
    .required("Veuillez sélectionner le type de compteur"),
  meterNumber: yup
    .string()
    .required("Le numéro de compteur est obligatoire")
    .when("meterType", {
      is: "prepaid",
      then: (schema) =>
            schema.matches(/^01\d{10}$/,"Un numéro de compteur prépayé doit commencer par 01 et contenir 12 chiffres"
      ),
      otherwise: (schema) =>
        schema.matches(/^200\d{9}$/, "Un numero de compteur postpayé doit commencer par 200 et contenir 12 chiffres"),
    }),
  address: yup.string().required("L'adresse est obligatoire"),
  usage: yup
    .string()
    .oneOf(
      ["domicile", "entreprise", "campagne", "appartement"],
      "Domaine d'utilisation invalide"
    )
    .required("Veuillez sélectionner un domaine d'utilisation"),
});

type FormData = yup.InferType<typeof schema>;

export default function Enrolement() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const meterType = watch("meterType");

  const onSubmit = async (data: FormData) => {
  alert("Formulaire soumis avec succès !");  
  const enrolements = JSON.parse(localStorage.getItem("enrolements") || "[]");
  enrolements.push({   
    name: data.name,
    phone: data.phone,
    email: data.email,
    meterType: data.meterType,
    meterNumber: data.meterNumber,
    address: data.address,
    usage: data.usage,
    date: new Date().toLocaleString("fr-FR"),

  });
  localStorage.setItem("enrolements", JSON.stringify(enrolements));

    try {
      const { error } = await supabase.from("enrolements").insert([
        {
          name: data.name,
          phone: data.phone,
          email: data.email,
          meterType: data.meterType,
          meterNumber: data.meterNumber,
          address: data.address,
          usage: data.usage,
 
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        alert("Error while saving data: " + error.message);
        return;
      }
        const localRow = {
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        nomClient: data.name,
        numeroCompteur: data.meterNumber,
        typeCompteur: data.meterType,
        quartier: data.address,
        telephone: data.phone,
        email: data.email,
        date: new Date().toLocaleString("fr-FR"),
      };

      const existing = JSON.parse(localStorage.getItem("enrolements_local") || "[]");
      existing.unshift(localRow);

      reset();
      navigate("/confirmation", { state: { nomClient: data.name } });
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl not-first-of-type:font-bold text-center mb-6 text-gray-700">
          Formulaire d’enrôlement
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Nom</label>
            <input
              type="text"
              {...register("name")}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Entrez votre nom"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Téléphone</label>
            <input
              type="tel"
              {...register("phone")}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Ex:699640151"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="exemple@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Type de compteur */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Type de compteur</label>
            <select
              {...register("meterType")}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">-- Sélectionnez --</option>
              <option value="prepaid">Prépayé</option>
              <option value="postpaid">Postpayé</option>
            </select>
            {errors.meterType && (
              <p className="text-red-500 text-sm">{errors.meterType.message}</p>
            )}
          </div>

          {/* Numéro de compteur */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Numéro de compteur{" "}
              {meterType === "prepaid"
                ? "(doit commencer par 01)"
                : meterType === "postpaid"
                ? "(doit commencer par 200)"
                : ""}
            </label>
            <input
              type="text"
              {...register("meterNumber")}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder={
                meterType === "prepaid"
                  ? "Ex: 01XXXXXX"
                  : meterType === "postpaid"
                  ? "Ex: 200XXXXXX"
                  : "Entrez le numéro"
              }
            />
            {errors.meterNumber && (
              <p className="text-red-500 text-sm">{errors.meterNumber.message}</p>
            )}
          </div>

          {/* Adresse */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Adresse (quartier)</label>
            <input
              type="text"
              {...register("address")}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Entrez votre quartier"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Domaine d'utilisation */}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Domaine d’utilisation
            </label>
            <select
              {...register("usage")}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">-- Sélectionnez --</option>
              <option value="domicile">Domicile</option>
              <option value="entreprise">Entreprise</option>
              <option value="campagne">Campagne</option>
              <option value="appartement">Appartement</option>
            </select>
            {errors.usage && (
              <p className="text-red-500 text-sm">{errors.usage.message}</p>
            )}
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Soumettre
  
          </button>

          <button
           onClick={() => navigate("/")}
           className="w-full bg-yellow-400 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 transition"
          >
          Retour a l'acceuil
          </button>  
        </form>
      </div>
    </div>
  );
}
