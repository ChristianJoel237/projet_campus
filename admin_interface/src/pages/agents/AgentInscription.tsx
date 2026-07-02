import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { useAgents } from "../../context/AgentsContext";
import { useTheme } from "../../context/ThemeContext";
import { useLangue } from "../../context/LangueContext";

const AgentInscription = () => {
    const navigate = useNavigate();
    const { ajouterAgent } = useAgents();
    const { theme, basculerTheme } = useTheme();
    const { t } = useLangue();

    const at = (t as any).agentsTerrain ?? {};
    const tc = (t as any).commun ?? {};

    const isDark = theme === "dark";

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        ville: "",
        telephone: "",
        motDePasse: "",
    });
    const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
    const [afficherMdp, setAfficherMdp] = useState(false);
    const [afficherConfirm, setAfficherConfirm] = useState(false);
    const [statut, setStatut] = useState<"idle" | "chargement" | "succes" | "erreur">("idle");
    const [messageErreur, setMessageErreur] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setMessageErreur("");
    };

    const handleSoumettre = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessageErreur("");

        if (!formData.prenom.trim()) {
            setMessageErreur(at.errPrenom || "Le prénom est requis.");
            return;
        }
        if (!formData.nom.trim()) {
            setMessageErreur(at.errNom || "Le nom est requis.");
            return;
        }
        if (!formData.telephone.trim()) {
            setMessageErreur(at.errTelephone || "Le téléphone est requis.");
            return;
        }
        if (!formData.ville.trim()) {
            setMessageErreur(at.errZone || "La ville est requise.");
            return;
        }
        if (formData.motDePasse.length < 8) {
            setMessageErreur(at.errMotDePasse || "Minimum 8 caractères requis.");
            return;
        }
        if (formData.motDePasse !== confirmerMotDePasse) {
            setMessageErreur(at.errConfirmer || "Les mots de passe ne correspondent pas.");
            return;
        }

        setStatut("chargement");

        try {
            await ajouterAgent({
                nom: formData.nom.trim(),
                prenom: formData.prenom.trim(),
                email: formData.email.trim(),
                telephone: formData.telephone.trim(),
                ville: formData.ville.trim(),
                password: formData.motDePasse.trim(),
            });
            setStatut("succes");
            setTimeout(
                () =>
                    navigate("/agents", {
                        replace: true,
                        state: { message: at.succesCreation || "✅ Agent créé avec succès !" },
                    }),
                1500,
            );
        } catch (err: any) {
            setStatut("erreur");
            setMessageErreur(err?.response?.data?.message || "Erreur lors de la création.");
        }
    };

    const forceMotDePasse = () => {
        const mdp = formData.motDePasse;
        if (!mdp) return { niveau: 0, label: "", couleur: "transparent" };
        let score = 0;
        if (mdp.length >= 8) score++;
        if (/[A-Z]/.test(mdp)) score++;
        if (/[0-9]/.test(mdp)) score++;
        if (/[^A-Za-z0-9]/.test(mdp)) score++;
        const niveaux = [
            { niveau: 1, label: at.forceFaible || "Faible", couleur: "#ef4444" },
            { niveau: 2, label: at.forceMoyen || "Moyen", couleur: "#f59e0b" },
            { niveau: 3, label: at.forceBon || "Bon", couleur: "#0891b2" },
            { niveau: 4, label: at.forceExcellent || "Excellent", couleur: "#16a34a" },
        ];
        return niveaux[Math.min(score, 4) - 1] ?? { niveau: 0, label: "", couleur: "transparent" };
    };
    const force = forceMotDePasse();

    const inputStyle: React.CSSProperties = {
        background: isDark ? "rgba(255,255,255,0.06)" : "#f9fafb",
        border: "1.5px solid rgba(22,163,74,0.2)",
        color: isDark ? "#f9fafb" : "#111827",
        width: "100%",
        padding: "12px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box" as const,
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: "13px",
        fontWeight: 600,
        marginBottom: "6px",
        color: isDark ? "#d1d5db" : "#374151",
    };

    const estDesactive = statut === "chargement" || statut === "succes";

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
                background: isDark
                    ? "linear-gradient(135deg, #020617 0%, #052e16 40%, #0c1a2e 100%)"
                    : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #e0f2fe 100%)",
            }}
        >
            {/* ── Bouton thème ── */}
            <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 50 }}>
                <button
                    onClick={basculerTheme}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                        color: isDark ? "#F59E0B" : "#6b7280",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            {/* ── Carte principale ── */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "520px",
                    background: isDark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(24px)",
                    borderRadius: "24px",
                    border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(22,163,74,0.15)",
                    boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.5)" : "0 32px 80px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                }}
            >
                {/* ── En-tête ── */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #052e16 0%, #15803d 55%, #0c4a6e 100%)",
                        padding: "36px 32px 28px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        position: "relative",
                    }}
                >
                    {/* Halo */}
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "140px",
                            height: "140px",
                            borderRadius: "9999px",
                            background: "rgba(255,255,255,0.07)",
                            filter: "blur(30px)",
                            pointerEvents: "none",
                        }}
                    />

                    {/* Icône */}
                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "64px",
                            height: "64px",
                            borderRadius: "18px",
                            background: "rgba(255,255,255,0.15)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        }}
                    >
                        <UserPlus size={28} color="white" />
                    </div>

                    {/* Titre */}
                    <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                            {at.titreFormulaire || "Nouvel agent de terrain"}
                        </h1>
                        <p
                            style={{
                                fontSize: "13px",
                                color: "rgba(255,255,255,0.55)",
                                marginTop: "4px",
                                marginBottom: 0,
                            }}
                        >
                            {at.sousTitle || "Remplissez les informations pour créer les accès de l'agent."}
                        </p>
                    </div>

                    {/* Breadcrumb */}
                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.4)",
                        }}
                    >
                        <span>{at.breadcrumb1 || "Administration"}</span>
                        <span>›</span>
                        <span
                            onClick={() => navigate("/agents")}
                            style={{ cursor: "pointer", color: "rgba(255,255,255,0.6)" }}
                        >
                            {at.breadcrumb2 || "Agents de terrain"}
                        </span>
                        <span>›</span>
                        <span style={{ color: "rgba(255,255,255,0.9)" }}>{at.breadcrumb3 || "Nouvel agent"}</span>
                    </div>
                </div>

                {/* ── Corps du formulaire ── */}
                <div style={{ padding: "28px 32px 32px" }}>
                    {/* Bannière succès */}
                    {statut === "succes" && (
                        <div
                            style={{
                                padding: "12px 16px",
                                borderRadius: "12px",
                                fontSize: "13px",
                                fontWeight: 500,
                                background: "rgba(22,163,74,0.08)",
                                border: "1px solid rgba(22,163,74,0.25)",
                                color: "#16a34a",
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <CheckCircle size={15} />
                            {at.succesCreation || "Agent créé avec succès !"}
                        </div>
                    )}

                    {/* Bannière erreur */}
                    {messageErreur && (
                        <div
                            style={{
                                padding: "12px 16px",
                                borderRadius: "12px",
                                fontSize: "13px",
                                fontWeight: 500,
                                background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.25)",
                                color: "#dc2626",
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <AlertCircle size={15} />
                            {messageErreur}
                        </div>
                    )}

                    <form onSubmit={handleSoumettre} noValidate>
                        {/* ── Identité ── */}
                        <p
                            style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "#16a34a",
                                marginBottom: "14px",
                                marginTop: 0,
                            }}
                        >
                            👤 {at.identite || "Identité"}
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "12px",
                                marginBottom: "14px",
                            }}
                        >
                            <div>
                                <label style={labelStyle}>{at.prenom || "Prénom"}</label>
                                <input
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    placeholder={at.prenomPlaceholder || "Entrez le prénom"}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>{at.nom || "Nom"}</label>
                                <input
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    placeholder={at.nomPlaceholder || "Entrez le nom"}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "12px",
                                marginBottom: "14px",
                            }}
                        >
                            <div>
                                <label style={labelStyle}>📞 {at.telephone || "Téléphone"}</label>
                                <input
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder={at.telephonePlaceholder || "Entrez le numéro"}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>📍 {at.zone || "Ville"}</label>
                                <input
                                    name="ville"
                                    value={formData.ville}
                                    onChange={handleChange}
                                    placeholder={at.zonePlaceholder || "Ville de résidence"}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>📧 {(t as any).auth?.adresseEmail || "Adresse email"}</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={at.emailPlaceholder || "Saisissez l'adresse email de l'agent"}
                                style={inputStyle}
                            />
                        </div>

                        {/* Séparateur */}
                        <div
                            style={{
                                height: "1px",
                                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                                marginBottom: "20px",
                            }}
                        />

                        {/* ── Identifiants ── */}
                        <p
                            style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: "#16a34a",
                                marginBottom: "14px",
                                marginTop: 0,
                            }}
                        >
                            🔒 {at.identifiants || "Identifiants de connexion"}
                        </p>

                        {/* Mot de passe */}
                        <div style={{ marginBottom: "14px" }}>
                            <label style={labelStyle}>{at.motDePasse || "Mot de passe"}</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    name="motDePasse"
                                    type={afficherMdp ? "text" : "password"}
                                    value={formData.motDePasse}
                                    onChange={handleChange}
                                    placeholder={at.motDePassePlaceholder || "Minimum 8 caractères"}
                                    style={{ ...inputStyle, paddingRight: "48px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setAfficherMdp(!afficherMdp)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#9ca3af",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: 0,
                                    }}
                                >
                                    {afficherMdp ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {formData.motDePasse && (
                                <div style={{ marginTop: "8px" }}>
                                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    flex: 1,
                                                    height: "3px",
                                                    borderRadius: "9999px",
                                                    background:
                                                        i <= force.niveau
                                                            ? force.couleur
                                                            : isDark
                                                              ? "rgba(255,255,255,0.1)"
                                                              : "rgba(0,0,0,0.08)",
                                                    transition: "background 0.3s",
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: "11px", color: force.couleur, fontWeight: 600, margin: 0 }}>
                                        {force.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirmer mot de passe */}
                        <div style={{ marginBottom: "28px" }}>
                            <label style={labelStyle}>{at.confirmer || "Confirmer le mot de passe"}</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={afficherConfirm ? "text" : "password"}
                                    value={confirmerMotDePasse}
                                    onChange={(e) => {
                                        setConfirmerMotDePasse(e.target.value);
                                        setMessageErreur("");
                                    }}
                                    placeholder={at.confirmerPlaceholder || "Répéter le mot de passe"}
                                    style={{
                                        ...inputStyle,
                                        paddingRight: "48px",
                                        borderColor: confirmerMotDePasse
                                            ? confirmerMotDePasse !== formData.motDePasse
                                                ? "rgba(239,68,68,0.5)"
                                                : "rgba(22,163,74,0.5)"
                                            : "rgba(22,163,74,0.2)",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setAfficherConfirm(!afficherConfirm)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#9ca3af",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: 0,
                                    }}
                                >
                                    {afficherConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <p
                                style={{
                                    fontSize: "11px",
                                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
                                    marginTop: "6px",
                                    marginBottom: 0,
                                }}
                            >
                                {at.infoMobile ||
                                    "L'agent utilisera ces identifiants pour se connecter à l'application mobile."}
                            </p>
                        </div>

                        {/* ── Boutons ── */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                type="button"
                                onClick={() => navigate("/agents")}
                                disabled={estDesactive}
                                style={{
                                    flex: 1,
                                    padding: "13px",
                                    borderRadius: "12px",
                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                                    background: "transparent",
                                    color: isDark ? "#9ca3af" : "#6b7280",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    cursor: estDesactive ? "not-allowed" : "pointer",
                                }}
                            >
                                {at.annuler || "Annuler"}
                            </button>

                            <button
                                type="submit"
                                disabled={estDesactive}
                                style={{
                                    flex: 2,
                                    padding: "13px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: estDesactive
                                        ? "rgba(22,163,74,0.5)"
                                        : "linear-gradient(135deg, #16a34a 0%, #0891b2 100%)",
                                    color: "#ffffff",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    cursor: estDesactive ? "not-allowed" : "pointer",
                                    boxShadow: estDesactive ? "none" : "0 4px 16px rgba(22,163,74,0.35)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    transition: "all 0.2s",
                                }}
                            >
                                <UserPlus size={16} />
                                {statut === "chargement"
                                    ? tc.chargement || "Chargement..."
                                    : statut === "succes"
                                      ? at.succesCreation || "Agent créé !"
                                      : at.creer || "Créer l'agent"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgentInscription;
