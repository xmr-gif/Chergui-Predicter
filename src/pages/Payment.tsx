import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CreditCard,
  Lock,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";

const LOGO_URL =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/079759d0-9eae-4b84-b8d8-662aa2880fb5.png";

const SOLAR_IMG =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/1988780d-bef6-4569-84cc-c861572da0a0.png";

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const enterpriseId = searchParams.get("id");

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      // Format card number with spaces every 4 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardData((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }
    if (field === "expiry") {
      // Format as MM/YY
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      const formatted =
        cleaned.length >= 3
          ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
          : cleaned;
      setCardData((prev) => ({ ...prev, expiry: formatted }));
      return;
    }
    if (field === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 3);
      setCardData((prev) => ({ ...prev, cvv: cleaned }));
      return;
    }
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enterpriseId) {
      setError("ID d'entreprise manquant. Veuillez recommencer l'inscription.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      await axios.post("/api/payment/confirm/", {
        enterprise_id: enterpriseId,
      });
      navigate(`/waiting-activation?id=${enterpriseId}`);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Erreur lors du traitement du paiement. Veuillez réessayer."
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white relative overflow-hidden">
      {/* Background */}
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

        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">
              Paiement Sécurisé
            </h2>
            <p className="text-sm text-slate-400">
              Finalisez votre abonnement Bouclier Solaire
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-6 space-y-4"
          >
            {/* Mastercard branding header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#111827] to-[#1a1f35] border border-[#2A3A4E] rounded-lg p-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/90"></div>
                  <div className="w-8 h-8 rounded-full bg-amber-500/80"></div>
                </div>
                <span className="text-sm font-bold text-slate-300 tracking-wider">
                  mastercard
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Paiement sécurisé
                </span>
              </div>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                <CreditCard className="w-3 h-3 inline mr-1" />
                Numéro de carte *
              </label>
              <input
                type="text"
                required
                value={cardData.cardNumber}
                onChange={(e) => handleChange("cardNumber", e.target.value)}
                placeholder="5412 •••• •••• ••••"
                className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors font-mono tracking-wider"
              />
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Titulaire de la carte *
              </label>
              <input
                type="text"
                required
                value={cardData.cardHolder}
                onChange={(e) => handleChange("cardHolder", e.target.value)}
                placeholder="NOM PRÉNOM"
                className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors uppercase"
              />
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Date d'expiration *
                </label>
                <input
                  type="text"
                  required
                  value={cardData.expiry}
                  onChange={(e) => handleChange("expiry", e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  <Lock className="w-3 h-3 inline mr-1" />
                  CVV *
                </label>
                <input
                  type="password"
                  required
                  value={cardData.cvv}
                  onChange={(e) => handleChange("cvv", e.target.value)}
                  placeholder="•••"
                  className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors font-mono"
                />
              </div>
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
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-wait text-black font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  Payer 14,900 MAD
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Chiffrement SSL
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                PCI DSS Compliant
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                3D Secure
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
