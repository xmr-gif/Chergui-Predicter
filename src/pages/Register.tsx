import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import {
  Building2,
  Zap,
  MapPin,
  Sun,
  ArrowRight,
  CheckCircle2,
  Shield,
} from "lucide-react";

const SOLAR_IMG =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/1988780d-bef6-4569-84cc-c861572da0a0.png";

const provinces = [
  "Oujda-Angad",
  "Nador",
  "Berkane",
  "Taourirt",
  "Jerada",
  "Figuig",
  "Driouch",
  "Guercif",
];

const installationTypes = [
  { value: "csp", label: "CSP (Concentrated Solar Power)", icon: "☀️" },
  { value: "bifacial", label: "Bifacial PV", icon: "🔲" },
  { value: "monofacial", label: "Monofacial PV", icon: "◻️" },
  { value: "hybrid", label: "Hybride CSP + PV", icon: "⚡" },
];

export default function Register() {
  const [formData, setFormData] = useState({
    companyName: "",
    capacity: "",
    installationType: "",
    province: "",
    email: "",
    phone: "",
    contactName: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-2xl p-10 text-center max-w-md">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Inscription Réussie !
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Votre demande d'inscription a été envoyée. Notre équipe vous contactera sous 24h pour activer votre compte Bouclier Solaire.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Nouvelle Inscription
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Inscription B2B — Entreprise Solaire
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Rejoignez Bouclier Solaire pour protéger vos installations dans la région Oriental
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-6 space-y-5"
            >
              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <Building2 className="w-3 h-3 inline mr-1" />
                  Nom de l'Entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Ex: MASEN, Nareva Holding..."
                  className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Capacité de la Station (MW) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  placeholder="Ex: 250"
                  min="1"
                  className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Installation Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <Sun className="w-3 h-3 inline mr-1" />
                  Type d'Installation *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {installationTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleChange("installationType", type.value)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.installationType === type.value
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                          : "bg-[#111827] border-[#1E2A3A] text-slate-400 hover:border-[#2A3A4E]"
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Province */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Province (Oriental) *
                </label>
                <select
                  required
                  value={formData.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                  className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                >
                  <option value="" className="text-slate-600">
                    Sélectionner une province...
                  </option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Nom du Contact
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleChange("contactName", e.target.value)}
                    placeholder="Prénom Nom"
                    className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Email Professionnel *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="contact@entreprise.ma"
                    className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Soumettre l'Inscription
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Side info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl overflow-hidden border border-[#2A3A4E]">
              <img
                src={SOLAR_IMG}
                alt="Solar panels"
                className="w-full h-40 object-cover"
              />
              <div className="bg-[#1A2332] p-4">
                <h3 className="text-sm font-bold text-white mb-2">
                  Pourquoi Bouclier Solaire ?
                </h3>
                <ul className="space-y-2">
                  {[
                    "Prédiction IA des tempêtes Chergui",
                    "Optimisation du calendrier de nettoyage",
                    "Réduction des pertes jusqu'à 35%",
                    "Couverture complète de l'Oriental",
                    "Monitoring 24/7 en temps réel",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                      <Shield className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="text-amber-400 font-semibold">Note :</span> L'inscription est réservée aux entreprises opérant dans la région Oriental du Maroc. Un audit technique sera effectué avant l'activation du compte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}