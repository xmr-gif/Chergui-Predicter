import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Zap,
  MapPin,
  Sun,
  ArrowRight,
  Check,
  Shield,
  CalendarDays,
  BarChart3,
  Wind,
  Bot,
  Lock,
} from "lucide-react";

const LOGO_URL =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/079759d0-9eae-4b84-b8d8-662aa2880fb5.png";

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
  { value: "csp", label: "CSP", icon: "☀️" },
  { value: "bifacial", label: "Bifacial PV", icon: "🔲" },
  { value: "monofacial", label: "Monofacial PV", icon: "◻️" },
  { value: "hybrid", label: "Hybride", icon: "⚡" },
];

const planFeatures = [
  { icon: BarChart3, text: "Monitoring temps réel de tous vos sites" },
  { icon: Wind, text: "Prédiction Chergui avancée (14 jours)" },
  { icon: CalendarDays, text: "Calendrier de Maintenance IA" },
  { icon: Shield, text: "Suivi TES (Taux d'Énergie Sauvegardée)" },
  { icon: Bot, text: "Recommandations IA de nettoyage" },
  { icon: Zap, text: "Alertes multi-canaux + SMS" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"plan" | "form">("plan");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    capacity: "",
    installationType: "",
    province: "",
    email: "",
    contactName: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await axios.post("/api/signup/", {
        company_name: formData.companyName,
        capacity: parseInt(formData.capacity),
        installation_type: formData.installationType,
        province: formData.province,
        email: formData.email,
        contact_name: formData.contactName,
        password: formData.password,
      });
      navigate(`/payment?id=${res.data.id}`);
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.detail ||
          "Erreur lors de l'inscription. Veuillez réessayer."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${SOLAR_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C] via-[#0A0F1C]/95 to-[#0A0F1C]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-0.5">
            <img
              src={LOGO_URL}
              alt="Bouclier Solaire"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-amber-400 tracking-wide">
              Bouclier Solaire
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Protection IA • Oriental Morocco
            </p>
          </div>
        </div>

        {step === "plan" ? (
          /* ===== STEP 1: Plan Overview ===== */
          <div className="w-full max-w-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Protégez vos installations solaires
              </h2>
              <p className="text-sm text-slate-400">
                Solution IA complète pour la région Oriental du Maroc
              </p>
            </div>

            {/* Single Plan Card */}
            <div className="bg-gradient-to-b from-amber-500/10 to-[#1A2332] border-2 border-amber-500/40 rounded-2xl p-7 mb-6 shadow-lg shadow-amber-900/10">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Abonnement Bouclier Solaire
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-white font-mono">
                    14,900
                  </span>
                  <span className="text-sm text-slate-400">MAD / mois</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Monitoring IA, prédiction Chergui, calendrier de maintenance intelligent et suivi TES pour maximiser le rendement de vos panneaux solaires.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {planFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.text}
                      className="flex items-start gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-md bg-[#0A0F1C]/60 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="text-xs text-slate-300 leading-relaxed pt-1">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Highlights */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 mb-6">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  14 jours d'essai gratuit
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Support 24/7
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Sans engagement
                </span>
              </div>

              <button
                onClick={() => setStep("form")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                S'inscrire maintenant
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Already have account */}
            <p className="text-center text-xs text-slate-500">
              Déjà inscrit ?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                Se connecter
              </button>
            </p>
          </div>
        ) : (
          /* ===== STEP 2: Registration Form ===== */
          <div className="w-full max-w-lg">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-1">
                Inscription Entreprise
              </h2>
              <p className="text-sm text-slate-400">
                Complétez vos informations pour activer votre compte
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-6 space-y-4"
            >
              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  <Building2 className="w-3 h-3 inline mr-1" />
                  Nom de l'Entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Ex: MASEN, Nareva Holding..."
                  className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Capacity + Province */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Capacité (MW) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleChange("capacity", e.target.value)}
                    placeholder="250"
                    className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Province *
                  </label>
                  <select
                    required
                    value={formData.province}
                    onChange={(e) => handleChange("province", e.target.value)}
                    className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  >
                    <option value="">Sélectionner...</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Installation Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  <Sun className="w-3 h-3 inline mr-1" />
                  Type d'Installation *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {installationTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleChange("installationType", type.value)}
                      className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                        formData.installationType === type.value
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                          : "bg-[#111827] border-[#1E2A3A] text-slate-400 hover:border-[#2A3A4E]"
                      }`}
                    >
                      <span className="text-base">{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Nom du Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => handleChange("contactName", e.target.value)}
                    placeholder="Prénom Nom"
                    className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Pro *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="contact@entreprise.ma"
                    className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Plan summary */}
              <div className="bg-[#111827] border border-[#1E2A3A] rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    Abonnement Bouclier Solaire
                  </span>
                </div>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  14,900 MAD/mois
                </span>
              </div>

              {/* Error */}
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400">
                  {submitError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-wait text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    Continuer vers le paiement
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Back */}
              <button
                type="button"
                onClick={() => setStep("plan")}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
              >
                ← Retour au plan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}