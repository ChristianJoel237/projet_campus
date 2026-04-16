import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus, ArrowLeft, Eye, EyeOff,
  CheckCircle, AlertCircle,
  User, Phone, MapPin, Mail, Lock,
} from "lucide-react";
import { useLangue } from "../../context/LangueContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../../component/ui/Logo";

// ─── Types ─────────────────────────────────────────────────────────────────
interface AgentCreationDTO {
  nom: string;
  prenom: string;
  email: string;
  ville: string;
  telephone: string;
  motDePasse: string;
}

interface Agent {
  id: string;
  prenom: string;
  nom: string;
  telephone: string;
  ville: string;
  statut: 'actif' | 'suspendu';
  dossiers: number;
  login: string;
  dateInscription: string;
  email?: string;
}

type StatutFormulaire = "idle" | "chargement" | "succes" | "erreur";

// ─── Compteur d'ID local ──────────────────────────────────────────────────
let _compteurId = 9;
function genererIdAgent(): string {
  return `AGT-${String(_compteurId++).padStart(3, "0")}`;
}

const AgentInscription = () => {
  const navigate = useNavigate();
  const { t } = useLangue();
  const { theme } = useTheme();

  const [formData, setFormData] = useState<AgentCreationDTO>({
    nom: "", prenom: "", email: "", ville: "", telephone: "", motDePasse: "",
  });
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [afficherConfirmer, setAfficherConfirmer] = useState(false);
  const [erreurs, setErreurs] = useState<Partial<AgentCreationDTO & { confirmer: string }>>({});
  const [statut, setStatut] = useState<StatutFormulaire>("idle");
  const [messageErreurAPI, setMessageErreurAPI] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Obtenir les traductions des placeholders
  const getPlaceholder = (field: string): string => {
    const placeholders: Record<string, string> = {
      nom: t.agentsTerrain?.nomPlaceholder || "Saisir le nom complet de l'agent",
      prenom: t.agentsTerrain?.prenomPlaceholder || "Saisir le prénom de l'agent",
      telephone: t.agentsTerrain?.telephonePlaceholder || "+237 6XX XXX XXX",
      ville: t.agentsTerrain?.zonePlaceholder || "Sélectionner ou saisir la ville",
      email: t.agentsTerrain?.emailPlaceholder,
      motDePasse: t.agentsTerrain?.motDePassePlaceholder || "Minimum 8 caractères",
      confirmer: t.agentsTerrain?.confirmerPlaceholder || "Ressaisir le mot de passe",
    };
    return placeholders[field] || "";
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const valider = (): boolean => {
    const e: Partial<AgentCreationDTO & { confirmer: string }> = {};
    
    if (!formData.nom.trim()) {
      e.nom = t.agentsTerrain?.errNom || "Le nom est requis";
    } else if (!/^[a-zA-ZÀ-ÿ\s-]{2,}$/.test(formData.nom.trim())) {
      e.nom = "Le nom doit contenir uniquement des lettres (minimum 2 caractères)";
    }
    
    if (!formData.prenom.trim()) {
      e.prenom = t.agentsTerrain?.errPrenom || "Le prénom est requis";
    } else if (!/^[a-zA-ZÀ-ÿ\s-]{2,}$/.test(formData.prenom.trim())) {
      e.prenom = "Le prénom doit contenir uniquement des lettres (minimum 2 caractères)";
    }
    
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Veuillez saisir une adresse email valide (ex: nom@domaine.com)";
    }
    
    if (!formData.telephone.trim()) {
      e.telephone = t.agentsTerrain?.errTelephone || "Le numéro de téléphone est requis";
    } else if (!/^[\d\s+()-]{8,}$/.test(formData.telephone.trim())) {
      e.telephone = "Numéro invalide. Format accepté: +237 6XX XXX XXX";
    }
    
    if (!formData.ville.trim()) {
      e.ville = t.agentsTerrain?.errZone || "La ville est requise";
    } else if (!/^[a-zA-ZÀ-ÿ\s-]{2,}$/.test(formData.ville.trim())) {
      e.ville = "Le nom de la ville doit contenir uniquement des lettres";
    }
    
    if (formData.motDePasse.length < 6) {
      e.motDePasse = t.agentsTerrain?.errMotDePasse || "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (formData.motDePasse !== confirmerMotDePasse) {
      e.confirmer = t.agentsTerrain?.errConfirmer || "Les mots de passe ne correspondent pas";
    }
    
    setErreurs(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErreurs(prev => ({ ...prev, [name]: undefined }));
    if (statut === "erreur") { 
      setStatut("idle"); 
      setMessageErreurAPI(""); 
    }
  };

  const handleSoumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valider()) return;

    setStatut("chargement");
    setMessageErreurAPI("");

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1200));

      const agentCree: Agent = {
        id: genererIdAgent(),
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        telephone: formData.telephone.trim(),
        ville: formData.ville.trim(),
        statut: "actif",
        dossiers: 0,
        login: `${formData.prenom.slice(0, 3).toLowerCase()}.${formData.nom.toLowerCase()}`,
        dateInscription: new Date().toISOString().split("T")[0],
        email: formData.email.trim(),
      };

      setStatut("succes");

      setTimeout(() => {
        navigate("/agents", {
          state: { 
            nouvelAgent: agentCree,
            message: "✅ Agent créé avec succès !" 
          },
          replace: true,
        });
      }, 1500);

    } catch (err: unknown) {
      setStatut("erreur");
      setMessageErreurAPI("Une erreur est survenue lors de la création de l'agent. Veuillez réessayer.");
    }
  };

  const handleReinitialiser = () => {
    setFormData({ nom: "", prenom: "", email: "", ville: "", telephone: "", motDePasse: "" });
    setConfirmerMotDePasse("");
    setErreurs({});
    setStatut("idle");
    setMessageErreurAPI("");
    setFocusedField(null);
  };

  const estEnChargement = statut === "chargement";
  const estSucces = statut === "succes";
  const estDesactive = estEnChargement || estSucces;

  const getInputStyle = (fieldName: string, hasError?: boolean): React.CSSProperties => {
    const isFocused = focusedField === fieldName;
    
    return {
      background: theme === "dark" ? "rgba(255,255,255,0.06)" : "#f9fafb",
      border: hasError 
        ? "1.5px solid rgba(239,68,68,0.5)" 
        : isFocused 
          ? "1.5px solid #16a34a" 
          : "1.5px solid rgba(22,163,74,0.2)",
      color: theme === "dark" ? "#f9fafb" : "#111827",
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "0.75rem",
      fontSize: "0.875rem",
      outline: "none",
      transition: "all 0.2s",
    };
  };

  const labelStyle: React.CSSProperties = {
    color: theme === "dark" ? "#d1d5db" : "#374151",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: theme === "dark"
          ? "linear-gradient(135deg, #030712 0%, #052e16 50%, #0c1a2e 100%)"
          : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #e0f2fe 100%)",
      }}
    >
      {/* Cercles décoratifs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #16a34a, transparent)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #0891b2, transparent)" }}
      />

      {/* Carte principale */}
      <div
        className="w-full max-w-2xl relative"
        style={{
          background: theme === "dark" ? "rgba(17,24,39,0.85)" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          borderRadius: "1.5rem",
          border: theme === "dark"
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(22,163,74,0.15)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        }}
      >
        {/* En-tête */}
        <div
          className="p-6 pb-5 rounded-t-3xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #052e16, #15803d, #0c4a6e)" }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #4ade80, transparent)" }}
          />
          
          {/* Bouton retour */}
          <div className="relative z-10 mb-4">
            <button
              type="button"
              onClick={() => navigate("/agents")}
              disabled={estDesactive}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg"
              style={{ 
                color: "#fff",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: estDesactive ? "not-allowed" : "pointer",
                opacity: estDesactive ? 0.5 : 1,
              }}
            >
              <ArrowLeft size={16} />
              <span>{t.agentsTerrain?.annuler || "Retour"}</span>
            </button>
          </div>

          {/* Logo et titre */}
          <div className="relative flex flex-col items-center text-center z-10">
            <div className="mb-3">
              <Logo taille="lg" afficherTexte={false} />
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <UserPlus size={22} />
              {t.agentsTerrain?.titre || "Nouvel agent de terrain"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t.agentsTerrain?.sousTitle || "Remplissez le formulaire pour créer le compte agent"}
            </p>
          </div>
        </div>

        {/* Corps du formulaire */}
        <div className="p-6 md:p-8">
          {/* Message succès */}
          {estSucces && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3"
              style={{
                background: "rgba(22,163,74,0.08)",
                border: "1px solid rgba(22,163,74,0.25)",
                color: "#16a34a",
              }}
            >
              <CheckCircle size={16} />
              <p className="font-semibold">✅ Agent créé avec succès ! Redirection en cours...</p>
            </div>
          )}

          {/* Message erreur */}
          {statut === "erreur" && messageErreurAPI && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#dc2626",
              }}
            >
              <AlertCircle size={16} />
              <div>
                <p className="font-semibold">Échec de la création</p>
                <p className="text-xs mt-0.5">{messageErreurAPI}</p>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSoumettre} noValidate autoComplete="off">
            <div className="space-y-4">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={labelStyle}>
                    <User size={13} style={{ color: "#16a34a" }} />
                    {t.agentsTerrain?.nom || "Nom"} *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("nom")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={getPlaceholder("nom")}
                    disabled={estDesactive}
                    style={getInputStyle("nom", !!erreurs.nom)}
                  />
                  {erreurs.nom && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#dc2626" }}>
                      <AlertCircle size={11} />{erreurs.nom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={labelStyle}>
                    <User size={13} style={{ color: "#16a34a" }} />
                    {t.agentsTerrain?.prenom || "Prénom"} *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("prenom")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={getPlaceholder("prenom")}
                    disabled={estDesactive}
                    style={getInputStyle("prenom", !!erreurs.prenom)}
                  />
                  {erreurs.prenom && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#dc2626" }}>
                      <AlertCircle size={11} />{erreurs.prenom}
                    </p>
                  )}
                </div>
              </div>

              {/* Téléphone et Ville */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={labelStyle}>
                    <Phone size={13} style={{ color: "#16a34a" }} />
                    {t.agentsTerrain?.telephone || "Téléphone"} *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("telephone")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={getPlaceholder("telephone")}
                    disabled={estDesactive}
                    style={getInputStyle("telephone", !!erreurs.telephone)}
                  />
                  {erreurs.telephone && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#dc2626" }}>
                      <AlertCircle size={11} />{erreurs.telephone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={labelStyle}>
                    <MapPin size={13} style={{ color: "#16a34a" }} />
                    {t.agentsTerrain?.zone || "Ville"} *
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("ville")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={getPlaceholder("ville")}
                    disabled={estDesactive}
                    style={getInputStyle("ville", !!erreurs.ville)}
                  />
                  {erreurs.ville && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#dc2626" }}>
                      <AlertCircle size={11} />{erreurs.ville}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={labelStyle}>
                  <Mail size={13} style={{ color: "#16a34a" }} />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder={getPlaceholder("email")}
                  disabled={estDesactive}
                  style={getInputStyle("email", !!erreurs.email)}
                />
                {erreurs.email && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#dc2626" }}>
                    <AlertCircle size={11} />{erreurs.email}
                  </p>
                )}
              </div>

              {/* Mot de passe et Confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={labelStyle}>
                    <Lock size={13} style={{ color: "#16a34a" }} />
                    {t.agentsTerrain?.motDePasse || "Mot de passe"} *
                  </label>
                  <div className="relative">
                    <input
                      type={afficherMotDePasse ? "text" : "password"}
                      name="motDePasse"
                      value={formData.motDePasse}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("motDePasse")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={getPlaceholder("motDePasse")}
                      disabled={estDesactive}
                      style={getInputStyle("motDePasse", !!erreurs.motDePasse)}
                    />
                    <button
                      type="button"
                      onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                      disabled={estDesactive}
                      className="absolute right-3 top-3 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      {afficherMotDePasse ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {erreurs.motDePasse && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#dc2626" }}>
                      <AlertCircle size={11} />{erreurs.motDePasse}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5" style={labelStyle}>
                    <Lock size={13} style={{ color: "#16a34a" }} />
                    {t.agentsTerrain?.confirmer || "Confirmer"} *
                  </label>
                  <div className="relative">
                    <input
                      type={afficherConfirmer ? "text" : "password"}
                      value={confirmerMotDePasse}
                      onChange={(e) => {
                        setConfirmerMotDePasse(e.target.value);
                        setErreurs(prev => ({ ...prev, confirmer: undefined }));
                      }}
                      onFocus={() => setFocusedField("confirmer")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={getPlaceholder("confirmer")}
                      disabled={estDesactive}
                      style={getInputStyle("confirmer", !!erreurs.confirmer)}
                    />
                    <button
                      type="button"
                      onClick={() => setAfficherConfirmer(!afficherConfirmer)}
                      disabled={estDesactive}
                      className="absolute right-3 top-3 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      {afficherConfirmer ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {erreurs.confirmer && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#dc2626" }}>
                      <AlertCircle size={11} />{erreurs.confirmer}
                    </p>
                  )}
                </div>
              </div>

              {/* Indicateur de sécurité du mot de passe (optionnel) */}
              {formData.motDePasse && !estDesactive && (
                <div className="text-xs flex items-center gap-2 mt-1">
                  <span className="text-gray-500">Force du mot de passe:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="w-6 h-1 rounded-full transition-all"
                        style={{
                          background: formData.motDePasse.length >= level * 2
                            ? level <= 2
                              ? "#f97316"
                              : "#16a34a"
                            : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">
                    {formData.motDePasse.length < 6
                      ? "Faible"
                      : formData.motDePasse.length < 8
                      ? "Moyen"
                      : "Fort"}
                  </span>
                </div>
              )}

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReinitialiser}
                  disabled={estDesactive}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                    color: theme === "dark" ? "#d1d5db" : "#374151",
                    cursor: estDesactive ? "not-allowed" : "pointer",
                    opacity: estDesactive ? 0.6 : 1,
                  }}
                >
                  {t.agentsTerrain?.reinitialiser || "Réinitialiser le formulaire"}
                </button>

                <button
                  type="submit"
                  disabled={estDesactive}
                  className="flex-1 flex items-center justify-center gap-2.5 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: estDesactive
                      ? "rgba(22,163,74,0.5)"
                      : "linear-gradient(135deg, #16a34a, #0891b2)",
                    boxShadow: estDesactive ? "none" : "0 4px 14px rgba(22,163,74,0.4)",
                    cursor: estDesactive ? "not-allowed" : "pointer",
                  }}
                >
                  {estEnChargement ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      {t.agentsTerrain?.creer || "Créer le compte agent"}
                    </>
                  )}
                </button>
              </div>

              {/* Note d'information */}
              <p className="text-xs text-center text-gray-400 mt-4">
                Tous les champs marqués d'un <span className="text-red-400">*</span> sont obligatoires
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentInscription;