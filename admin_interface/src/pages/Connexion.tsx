import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLangue } from "../context/LangueContext";
import Logo from "../component/ui/Logo";
import { schemas } from "../utilitaires/validation";
import SelecteurLangueFlottant from "../component/ui/SelecteurLangueFlottant";

const Connexion = () => {
    const navigate = useNavigate();
    const { seConnecter, chargement, erreurConnexion } = useAuth();
    const { theme, basculerTheme } = useTheme();
    const { t } = useLangue();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [afficherMdp, setAfficherMdp] = useState<boolean>(false);
    const [erreurLocale, setErreurLocale] = useState<string>("");

    // Neutralise le fond body (bg-gray-50 du CSS global)
    // qui écrasait visuellement les bulles décoratives
    useEffect(() => {
        const originalBg = document.body.style.background;
        const originalBgColor = document.body.style.backgroundColor;
        document.body.style.background = "transparent";
        document.body.style.backgroundColor = "transparent";
        return () => {
            document.body.style.background = originalBg;
            document.body.style.backgroundColor = originalBgColor;
        };
    }, []);

    const handleSoumission = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErreurLocale("");

        if (!email.trim() || !password.trim()) {
            setErreurLocale(t.auth?.champsObligatoires || "Veuillez remplir tous les champs.");
            return;
        }

        const { valide, erreurs } = schemas.connexion({ email, password });
        if (!valide) {
            setErreurLocale(Object.values(erreurs)[0] as string);
            return;
        }

        const succes = await seConnecter(email, password);
        if (succes) navigate("/");
    };

    const erreurAffichee = erreurLocale || erreurConnexion;
    const isDark = theme === "dark";

    const inputStyle: React.CSSProperties = {
        background: isDark ? "rgba(255,255,255,0.06)" : "#f9fafb",
        border: "1.5px solid rgba(22,163,74,0.2)",
        color: isDark ? "#f9fafb" : "#111827",
        width: "100%",
        padding: "12px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        outline: "none",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                position: "relative",
                background: isDark
                    ? "linear-gradient(135deg, #020617 0%, #052e16 40%, #0c1a2e 100%)"
                    : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #e0f2fe 100%)",
            }}
        >
            {/* ── Bulle verte haut-gauche ── */}
            <div
                style={{
                    position: "fixed",
                    top: "-120px",
                    left: "-120px",
                    width: "550px",
                    height: "550px",
                    borderRadius: "9999px",
                    background: "radial-gradient(circle, #16a34a, #15803d)",
                    opacity: isDark ? 0.4 : 0.25,
                    filter: "blur(90px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── Bulle bleue bas-droite ── */}
            <div
                style={{
                    position: "fixed",
                    bottom: "-150px",
                    right: "-150px",
                    width: "650px",
                    height: "650px",
                    borderRadius: "9999px",
                    background: "radial-gradient(circle, #0891b2, #0c4a6e)",
                    opacity: isDark ? 0.4 : 0.25,
                    filter: "blur(100px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── Bulle dorée haut-droite ── */}
            <div
                style={{
                    position: "fixed",
                    top: "5%",
                    right: "10%",
                    width: "320px",
                    height: "320px",
                    borderRadius: "9999px",
                    background: "radial-gradient(circle, #d97706, #92400e)",
                    opacity: isDark ? 0.22 : 0.12,
                    filter: "blur(80px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── Bulle teal bas-gauche ── */}
            <div
                style={{
                    position: "fixed",
                    bottom: "10%",
                    left: "5%",
                    width: "380px",
                    height: "380px",
                    borderRadius: "9999px",
                    background: "radial-gradient(circle, #0d9488, #134e4a)",
                    opacity: isDark ? 0.22 : 0.13,
                    filter: "blur(90px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* ── Boutons contrôle ── */}
            <div
                style={{
                    position: "fixed",
                    top: "16px",
                    right: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    zIndex: 50,
                }}
            >
                <SelecteurLangueFlottant />
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
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    maxWidth: "420px",
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
                        padding: "40px 32px 32px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                        position: "relative",
                    }}
                >
                    {/* Halo derrière le logo */}
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

                    {/* Logo centré dans son conteneur */}
                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "72px",
                            height: "72px",
                            borderRadius: "20px",
                            background: "rgba(255,255,255,0.15)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        }}
                    >
                        <Logo taille="lg" afficherTexte={false} />
                    </div>

                    <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                        <h1
                            style={{
                                fontSize: "22px",
                                fontWeight: 700,
                                color: "#ffffff",
                                margin: 0,
                            }}
                        >
                            {t.auth?.titreConnexion || "MicroFinance Admin"}
                        </h1>
                        <p
                            style={{
                                fontSize: "13px",
                                color: "rgba(255,255,255,0.55)",
                                marginTop: "4px",
                                margin: "4px 0 0",
                            }}
                        >
                            {t.auth?.sousTitreConnexion || "Espace administrateur sécurisé"}
                        </p>
                    </div>
                </div>

                {/* ── Formulaire ── */}
                <div style={{ padding: "32px" }}>
                    <form onSubmit={handleSoumission} noValidate autoComplete="off">
                        {erreurAffichee && (
                            <div
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    background: "rgba(239,68,68,0.08)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    color: "#dc2626",
                                    marginBottom: "16px",
                                }}
                            >
                                {erreurAffichee}
                            </div>
                        )}

                        {/* Email */}
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    marginBottom: "6px",
                                    color: isDark ? "#d1d5db" : "#374151",
                                }}
                            >
                                📧 {t.auth?.adresseEmail || "Adresse email"}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        {/* Mot de passe */}
                        <div style={{ marginBottom: "24px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    marginBottom: "6px",
                                    color: isDark ? "#d1d5db" : "#374151",
                                }}
                            >
                                🔒 {t.auth?.motDePasse || "Mot de passe"}
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={afficherMdp ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        {/* Bouton soumission */}
                        <button
                            type="submit"
                            disabled={chargement}
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "12px",
                                border: "none",
                                background: chargement
                                    ? "rgba(22,163,74,0.5)"
                                    : "linear-gradient(135deg, #16a34a 0%, #0891b2 100%)",
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: chargement ? "not-allowed" : "pointer",
                                boxShadow: chargement ? "none" : "0 4px 16px rgba(22,163,74,0.35)",
                                transition: "all 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                        >
                            {chargement
                                ? t.auth?.connexionEnCours || "Connexion en cours..."
                                : t.auth?.seConnecter || "Se connecter"}
                        </button>

                        {/* Accès réservé */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                marginTop: "16px",
                            }}
                        >
                            <Shield
                                size={12}
                                style={{
                                    color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                                }}
                            />
                            <p
                                style={{
                                    fontSize: "11px",
                                    color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)",
                                    margin: 0,
                                }}
                            >
                                {t.auth?.accesReserve || "Accès réservé aux administrateurs"}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Connexion;
