import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Shield, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLangue } from "../context/LangueContext";
import Logo from "../component/ui/Logo";
import { schemas, sanitiserAvantEnvoi } from "../utilitaires/validation";
import SelecteurLangueFlottant from "../component/ui/SelecteurLangueFlottant";

interface ConnexionFormData {
    email: string;
    password: string;
}

const Connexion = () => {
    const navigate = useNavigate();
    const { seConnecter, chargement, erreurConnexion } = useAuth();
    const { theme, basculerTheme } = useTheme();
    const { t } = useLangue();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [afficherMdp, setAfficherMdp] = useState<boolean>(false);
    const [erreurLocale, setErreurLocale] = useState<string>("");

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

        const donnees = sanitiserAvantEnvoi("connexion", {
            email,
            password,
        }) as unknown as ConnexionFormData;

        // Appel au service d'authentification avec le champ 'password'
        const succes = await seConnecter(donnees.email, donnees.password);
        if (succes) {
            navigate("/");
        }
    };

    const erreurAffichee = erreurLocale || erreurConnexion;

    const inputStyle: React.CSSProperties = {
        background: theme === "dark" ? "rgba(255,255,255,0.06)" : "#f9fafb",
        border: "1.5px solid rgba(22,163,74,0.2)",
        color: theme === "dark" ? "#f9fafb" : "#111827",
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{
                background:
                    theme === "dark"
                        ? "linear-gradient(135deg, #030712 0%, #052e16 50%, #0c1a2e 100%)"
                        : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #e0f2fe 100%)",
            }}
        >
            <div className="absolute top-4 right-4 flex items-center gap-2" style={{ zIndex: 50 }}>
                <SelecteurLangueFlottant />
                <button
                    onClick={basculerTheme}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                        background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                        color: theme === "dark" ? "#F59E0B" : "#6b7280",
                    }}
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            <div
                className="w-full max-w-md relative"
                style={{
                    background: theme === "dark" ? "rgba(17,24,39,0.85)" : "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "1.5rem",
                    border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(22,163,74,0.15)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
                }}
            >
                <div
                    className="p-8 pb-6 text-center rounded-t-3xl"
                    style={{ background: "linear-gradient(135deg, #052e16, #15803d, #0c4a6e)" }}
                >
                    <Logo taille="lg" afficherTexte={false} />
                    <h1 className="text-2xl font-bold text-white mt-3">
                        {t.auth?.titreConnexion || "MicroFinance Admin"}
                    </h1>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSoumission} className="space-y-4" noValidate>
                        {erreurAffichee && (
                            <div
                                className="px-4 py-3 rounded-xl text-sm font-medium"
                                style={{
                                    background: "rgba(239,68,68,0.08)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    color: "#dc2626",
                                }}
                            >
                                {erreurAffichee}
                            </div>
                        )}

                        <div>
                            <label
                                className="block text-sm font-semibold mb-1.5"
                                style={{ color: theme === "dark" ? "#d1d5db" : "#374151" }}
                            >
                                📧 {t.auth?.adresseEmail || "Adresse email"}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-semibold mb-1.5"
                                style={{ color: theme === "dark" ? "#d1d5db" : "#374151" }}
                            >
                                🔒 {t.auth?.motDePasse || "Mot de passe"}
                            </label>
                            <div className="relative">
                                <input
                                    type={afficherMdp ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-12"
                                    style={inputStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setAfficherMdp(!afficherMdp)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-green-600"
                                >
                                    {afficherMdp ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={chargement}
                            className="w-full bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-all"
                        >
                            {chargement ? "Connexion en cours..." : "Se connecter"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Connexion;
