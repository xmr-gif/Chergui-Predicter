import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { clearTokens, getEnterprise } from "@/lib/auth";
import {
  Building2,
  User,
  Mail,
  Lock,
  MapPin,
  Zap,
  Sun,
  Save,
  AlertTriangle,
  Check,
  ArrowRight,
  Eye,
  EyeOff,
  XCircle,
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    company_name: "",
    contact_name: "",
    capacity: "",
    installation_type: "",
    province: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  // Email change
  const [emailStep, setEmailStep] = useState<"form" | "verify">("form");
  const [emailForm, setEmailForm] = useState({
    new_email: "",
    password: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState({ type: "", text: "" });

  // Cancel subscription
  const [cancelPassword, setCancelPassword] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelSaving, setCancelSaving] = useState(false);
  const [cancelMsg, setCancelMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/account/profile/");
      setProfile(res.data);
      setProfileForm({
        company_name: res.data.company_name || "",
        contact_name: res.data.contact_name || "",
        capacity: String(res.data.capacity || ""),
        installation_type: res.data.installation_type || "",
        province: res.data.province || "",
      });
    } catch {
      // Token might be invalid
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ type: "", text: "" });
    try {
      const res = await axios.put("/api/account/profile/", {
        ...profileForm,
        capacity: parseInt(profileForm.capacity),
      });
      setProfile(res.data);
      setProfileMsg({ type: "success", text: "Profil mis à jour avec succès." });
    } catch (err: any) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.error || "Erreur lors de la mise à jour.",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }

    setPasswordSaving(true);
    try {
      await axios.post("/api/account/change-password/", {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      setPasswordMsg({ type: "success", text: "Mot de passe modifié avec succès." });
      setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.error || "Erreur lors du changement.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSaving(true);
    setEmailMsg({ type: "", text: "" });
    try {
      const res = await axios.post("/api/account/request-email-change/", emailForm);
      setEmailMsg({ type: "success", text: res.data.message });
      setEmailStep("verify");
    } catch (err: any) {
      setEmailMsg({
        type: "error",
        text: err.response?.data?.error || "Erreur lors de la demande.",
      });
    } finally {
      setEmailSaving(false);
    }
  };

  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSaving(true);
    setEmailMsg({ type: "", text: "" });
    try {
      const res = await axios.post("/api/account/confirm-email-change/", {
        verification_code: verificationCode,
      });
      setEmailMsg({ type: "success", text: res.data.message });
      setEmailStep("form");
      setEmailForm({ new_email: "", password: "" });
      setVerificationCode("");
      fetchProfile();
    } catch (err: any) {
      setEmailMsg({
        type: "error",
        text: err.response?.data?.error || "Code incorrect.",
      });
    } finally {
      setEmailSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelSaving(true);
    setCancelMsg({ type: "", text: "" });
    try {
      await axios.post("/api/account/cancel-subscription/", {
        password: cancelPassword,
      });
      setCancelMsg({ type: "success", text: "Abonnement résilié. Vous allez être déconnecté." });
      setTimeout(() => {
        clearTokens();
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setCancelMsg({
        type: "error",
        text: err.response?.data?.error || "Erreur lors de la résiliation.",
      });
    } finally {
      setCancelSaving(false);
    }
  };

  const installationTypes: Record<string, string> = {
    csp: "CSP",
    bifacial: "Bifacial PV",
    monofacial: "Monofacial PV",
    hybrid: "Hybride",
  };

  const inputClass =
    "w-full bg-[#111827] border border-[#1E2A3A] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors";

  const Msg = ({ msg }: { msg: { type: string; text: string } }) =>
    msg.text ? (
      <div
        className={`rounded-lg p-3 text-xs ${
          msg.type === "success"
            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            : "bg-red-500/10 border border-red-500/30 text-red-400"
        }`}
      >
        {msg.text}
      </div>
    ) : null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Paramètres du compte</h1>
          <p className="text-sm text-slate-400 mt-1">
            Gérez les informations de votre entreprise
          </p>
        </div>

        {/* ─── Section 1: Profile Info ─── */}
        <form
          onSubmit={handleProfileSave}
          className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">
              Informations de l'entreprise
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                <Building2 className="w-3 h-3 inline mr-1" />
                Nom de l'entreprise
              </label>
              <input
                type="text"
                value={profileForm.company_name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, company_name: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                <User className="w-3 h-3 inline mr-1" />
                Nom du contact
              </label>
              <input
                type="text"
                value={profileForm.contact_name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, contact_name: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                <Zap className="w-3 h-3 inline mr-1" />
                Capacité (MW)
              </label>
              <input
                type="number"
                min="1"
                value={profileForm.capacity}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, capacity: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                <Sun className="w-3 h-3 inline mr-1" />
                Type d'installation
              </label>
              <select
                value={profileForm.installation_type}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    installation_type: e.target.value,
                  }))
                }
                className={inputClass}
              >
                {Object.entries(installationTypes).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                <MapPin className="w-3 h-3 inline mr-1" />
                Province
              </label>
              <input
                type="text"
                value={profileForm.province}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, province: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          </div>

          <Msg msg={profileMsg} />

          <button
            type="submit"
            disabled={profileSaving}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            {profileSaving ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </button>
        </form>

        {/* ─── Section 2: Change Password ─── */}
        <form
          onSubmit={handlePasswordChange}
          className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">
              Changer le mot de passe
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                type={showOldPw ? "text" : "password"}
                required
                value={passwordForm.old_password}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, old_password: e.target.value }))
                }
                placeholder="••••••••"
                className={inputClass + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowOldPw(!showOldPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      new_password: e.target.value,
                    }))
                  }
                  placeholder="Min. 6 caractères"
                  className={inputClass + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showNewPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirm_password}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    confirm_password: e.target.value,
                  }))
                }
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          </div>

          <Msg msg={passwordMsg} />

          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            {passwordSaving ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            Modifier le mot de passe
          </button>
        </form>

        {/* ─── Section 3: Change Email ─── */}
        <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">
              Changer l'adresse email
            </h2>
          </div>

          <div className="bg-[#111827] border border-[#1E2A3A] rounded-lg p-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-300">
              Email actuel : <span className="text-amber-400 font-medium">{profile?.email}</span>
            </span>
          </div>

          {emailStep === "form" ? (
            <form onSubmit={handleRequestEmailChange} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Nouvel email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailForm.new_email}
                    onChange={(e) =>
                      setEmailForm((p) => ({ ...p, new_email: e.target.value }))
                    }
                    placeholder="nouveau@entreprise.ma"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Mot de passe (confirmation)
                  </label>
                  <input
                    type="password"
                    required
                    value={emailForm.password}
                    onChange={(e) =>
                      setEmailForm((p) => ({ ...p, password: e.target.value }))
                    }
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
              </div>

              <Msg msg={emailMsg} />

              <button
                type="submit"
                disabled={emailSaving}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                {emailSaving ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Envoyer le code de vérification
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmEmailChange} className="space-y-4">
              <p className="text-xs text-slate-400">
                Un code à 6 chiffres a été envoyé à{" "}
                <span className="text-amber-400 font-medium">{profile?.email}</span>.
                Entrez-le ci-dessous pour confirmer le changement.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Code de vérification
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className={inputClass + " text-center text-2xl tracking-[0.5em] font-mono"}
                />
              </div>

              <Msg msg={emailMsg} />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={emailSaving || verificationCode.length !== 6}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  {emailSaving ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailStep("form");
                    setEmailMsg({ type: "", text: "" });
                    setVerificationCode("");
                  }}
                  className="text-slate-400 hover:text-slate-200 text-sm px-4 py-2 border border-[#2A3A4E] rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ─── Section 4: Cancel Subscription ─── */}
        <div className="bg-[#1A2332] border border-red-500/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">
              Zone dangereuse
            </h2>
          </div>

          <p className="text-sm text-slate-400">
            La résiliation de votre abonnement est définitive. Vous perdrez
            l'accès au tableau de bord et à toutes les fonctionnalités de
            Bouclier Solaire.
          </p>

          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <XCircle className="w-4 h-4" />
              Résilier mon abonnement
            </button>
          ) : (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
              <p className="text-xs text-red-300 font-semibold">
                Confirmez votre identité pour résilier :
              </p>
              <input
                type="password"
                value={cancelPassword}
                onChange={(e) => setCancelPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className={inputClass + " border-red-500/30 focus:border-red-500/50"}
              />

              <Msg msg={cancelMsg} />

              <div className="flex gap-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelSaving || !cancelPassword}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  {cancelSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  Confirmer la résiliation
                </button>
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelPassword("");
                    setCancelMsg({ type: "", text: "" });
                  }}
                  className="text-slate-400 hover:text-slate-200 text-sm px-4 py-2 border border-[#2A3A4E] rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
