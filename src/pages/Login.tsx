import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { setTokens } from "@/lib/auth";

const LOGO_URL =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/079759d0-9eae-4b84-b8d8-662aa2880fb5.png";

const SOLAR_IMG =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/1988780d-bef6-4569-84cc-c861572da0a0.png";

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState<"login" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login/", loginData);
      setTokens(res.data.access, res.data.refresh, res.data.enterprise);
      navigate("/");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        "Erreur de connexion. Veuillez réessayer.";
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await axios.post("/api/auth/forgot-password/", {
        email: forgotEmail,
      });
      setSuccessMsg(
        res.data.message ||
          "Si cet email est enregistré, vous recevrez un mot de passe temporaire."
      );
      setIsLoading(false);
    } catch (err: any) {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
      setIsLoading(false);
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

        <div className="w-full max-w-md">
          {view === "login" ? (
            /* ===== LOGIN FORM ===== */
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-1">
                  Connexion
                </h2>
                <p className="text-sm text-slate-400">
                  Accédez au tableau de bord de votre entreprise
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-6 space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    <Mail className="w-3 h-3 inline mr-1" />
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="contact@entreprise.ma"
                    className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="••••••••"
                      className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot password link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
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
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-wait text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign up link */}
              <p className="text-center text-xs text-slate-500 mt-4">
                Pas encore de compte ?{" "}
                <Link
                  to="/signup"
                  className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
                >
                  S'inscrire
                </Link>
              </p>
            </>
          ) : (
            /* ===== FORGOT PASSWORD FORM ===== */
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Mot de passe oublié
                </h2>
                <p className="text-sm text-slate-400">
                  Entrez votre email pour recevoir un mot de passe temporaire
                </p>
              </div>

              <form
                onSubmit={handleForgotPassword}
                className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-6 space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    <Mail className="w-3 h-3 inline mr-1" />
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="contact@entreprise.ma"
                    className="w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400">
                    {error}
                  </div>
                )}

                {/* Success */}
                {successMsg && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-400">
                    {successMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 disabled:cursor-wait text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      Envoyer le mot de passe
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Back to login */}
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Retour à la connexion
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
