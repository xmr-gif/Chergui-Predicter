import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Clock, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";

const LOGO_URL =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/079759d0-9eae-4b84-b8d8-662aa2880fb5.png";

const SOLAR_IMG =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/1988780d-bef6-4569-84cc-c861572da0a0.png";

export default function WaitingActivation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const enterpriseId = searchParams.get("id");

  const [status, setStatus] = useState<string>("pending_activation");
  const [companyName, setCompanyName] = useState<string>("");
  const [dots, setDots] = useState("");

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Poll account status every 5 seconds
  useEffect(() => {
    if (!enterpriseId) return;

    const checkStatus = async () => {
      try {
        const res = await axios.get(`/api/account/status/${enterpriseId}/`);
        setStatus(res.data.account_status);
        setCompanyName(res.data.company_name || "");

        if (res.data.account_status === "active") {
          // Account activated! Set auth and redirect
          localStorage.setItem("bs_authenticated", "true");
          localStorage.setItem("bs_enterprise_id", enterpriseId);
          // Small delay so user sees the success state
          setTimeout(() => navigate("/"), 2000);
        }
      } catch {
        // Silently retry on next poll
      }
    };

    checkStatus(); // Check immediately
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [enterpriseId, navigate]);

  const isActive = status === "active";

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
        <div className="flex items-center gap-3 mb-10">
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

        <div className="w-full max-w-md">
          <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-2xl p-8 text-center">
            {isActive ? (
              /* ===== ACTIVATED STATE ===== */
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Compte Activé !
                </h2>
                {companyName && (
                  <p className="text-sm text-amber-400 font-semibold mb-2">
                    {companyName}
                  </p>
                )}
                <p className="text-sm text-slate-400 mb-6">
                  Votre compte a été activé avec succès.
                  <br />
                  Redirection vers le dashboard...
                </p>
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirection en cours...
                </div>
              </>
            ) : (
              /* ===== WAITING STATE ===== */
              <>
                {/* Animated pulse ring */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-amber-500/15 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-[#1A2332] flex items-center justify-center">
                    <Clock className="w-10 h-10 text-amber-400" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                  En attente d'activation{dots}
                </h2>
                {companyName && (
                  <p className="text-sm text-amber-400 font-semibold mb-2">
                    {companyName}
                  </p>
                )}
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Votre paiement a été confirmé avec succès.
                  <br />
                  Notre équipe examine votre inscription et activera
                  <br />
                  votre compte dans les plus brefs délais.
                </p>

                {/* Steps progress */}
                <div className="space-y-3 text-left mb-6">
                  {/* Step 1: Inscription */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs text-slate-300">
                      Inscription complétée
                    </span>
                  </div>
                  {/* Step 2: Payment */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs text-slate-300">
                      Paiement confirmé
                    </span>
                  </div>
                  {/* Step 3: Activation */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                    </div>
                    <span className="text-xs text-amber-400 font-medium">
                      Activation en cours...
                    </span>
                  </div>
                </div>

                <div className="bg-[#111827] border border-[#1E2A3A] rounded-lg p-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] text-slate-400 leading-relaxed">
                    Vous serez redirigé automatiquement vers le dashboard dès que
                    votre compte sera activé.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
