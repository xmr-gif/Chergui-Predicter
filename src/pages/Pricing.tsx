import DashboardLayout from "@/components/DashboardLayout";
import {
  Check,
  X,
  Star,
  Zap,
  Shield,
  Crown,
  ArrowRight,
} from "lucide-react";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  features: PlanFeature[];
  highlighted: boolean;
  cta: string;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "4,900",
    period: "MAD / mois",
    description: "Pour les petites installations solaires. Monitoring de base et alertes.",
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    iconBg: "bg-blue-500/15",
    features: [
      { text: "Monitoring temps réel (1 site)", included: true },
      { text: "Alertes tempête basiques", included: true },
      { text: "Rapport mensuel PDF", included: true },
      { text: "Support email", included: true },
      { text: "Calendrier de Maintenance IA", included: false },
      { text: "Suivi TES (Taux d'Énergie Sauvegardée)", included: false },
      { text: "Prédiction Chergui avancée", included: false },
      { text: "API & Intégrations", included: false },
      { text: "Account Manager dédié", included: false },
    ],
    highlighted: false,
    cta: "Commencer",
  },
  {
    name: "Pro",
    price: "14,900",
    period: "MAD / mois",
    description: "Solution complète avec IA de nettoyage et suivi TES pour maximiser le rendement.",
    icon: <Shield className="w-6 h-6 text-amber-400" />,
    iconBg: "bg-amber-500/15",
    features: [
      { text: "Monitoring temps réel (jusqu'à 5 sites)", included: true },
      { text: "Alertes tempête avancées + SMS", included: true },
      { text: "Rapports hebdomadaires détaillés", included: true },
      { text: "Support prioritaire 24/7", included: true },
      { text: "Calendrier de Maintenance IA", included: true },
      { text: "Suivi TES (Taux d'Énergie Sauvegardée)", included: true },
      { text: "Prédiction Chergui avancée (7 jours)", included: true },
      { text: "API & Intégrations", included: false },
      { text: "Account Manager dédié", included: false },
    ],
    highlighted: true,
    cta: "Choisir Pro",
    badge: "Recommandé",
  },
  {
    name: "Enterprise",
    price: "Sur Devis",
    period: "",
    description: "Pour les opérateurs majeurs. Solution sur mesure avec intégration complète.",
    icon: <Crown className="w-6 h-6 text-purple-400" />,
    iconBg: "bg-purple-500/15",
    features: [
      { text: "Monitoring illimité (tous sites)", included: true },
      { text: "Alertes multi-canaux personnalisées", included: true },
      { text: "Rapports en temps réel + Dashboard custom", included: true },
      { text: "Support dédié 24/7 + SLA", included: true },
      { text: "Calendrier de Maintenance IA", included: true },
      { text: "Suivi TES (Taux d'Énergie Sauvegardée)", included: true },
      { text: "Prédiction Chergui avancée (14 jours)", included: true },
      { text: "API & Intégrations complètes", included: true },
      { text: "Account Manager dédié", included: true },
    ],
    highlighted: false,
    cta: "Contacter",
  },
];

export default function Pricing() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Plans d'Abonnement
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Choisissez le plan adapté à votre installation solaire dans la région Oriental du Maroc
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                plan.highlighted
                  ? "bg-gradient-to-b from-amber-500/10 to-[#1A2332] border-2 border-amber-500/40 shadow-lg shadow-amber-900/20"
                  : "bg-[#1A2332] border border-[#2A3A4E] hover:border-[#3A4A5E]"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-500 text-black text-[11px] font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6 pt-2">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${plan.iconBg}`}
                >
                  {plan.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-3xl font-bold text-white font-mono">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-slate-500">{plan.period}</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-start gap-2.5"
                  >
                    {feature.included ? (
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs leading-relaxed ${
                        feature.included ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                  plan.highlighted
                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                    : "bg-[#111827] border border-[#2A3A4E] text-white hover:bg-[#1E2A3A] hover:border-[#3A4A5E]"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-5 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-semibold">💡 Note :</span>{" "}
            Tous les plans incluent une période d'essai de 14 jours. Le plan Pro inclut le{" "}
            <span className="text-amber-400 font-semibold">Calendrier de Maintenance IA</span> et le{" "}
            <span className="text-cyan-400 font-semibold">suivi TES</span>{" "}
            — les deux fonctionnalités les plus demandées par nos clients de l'Oriental.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}