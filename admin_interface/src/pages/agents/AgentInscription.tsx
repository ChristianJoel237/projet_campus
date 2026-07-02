import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    ArrowLeft,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    User,
    Phone,
    MapPin,
    Mail,
    Lock,
} from "lucide-react";
import { useLangue } from "../../context/LangueContext";
import { useTheme } from "../../context/ThemeContext";
import { useAgents } from "../../context/AgentsContext";
import Logo from "../../component/ui/Logo";

interface AgentCreationDTO {
    nom: string;
    prenom: string;
    email: string;
    ville: string;
    telephone: string;
    motDePasse: string;
}

const AgentInscription = () => {
    const navigate = useNavigate();
    const { t } = useLangue();
    const { theme } = useTheme();
    const { ajouterAgent } = useAgents();

    const [formData, setFormData] = useState<AgentCreationDTO>({
        nom: "",
        prenom: "",
        email: "",
        ville: "",
        telephone: "",
        motDePasse: "",
    });

    const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
    const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
    const [afficherConfirmer, setAfficherConfirmer] = useState(false);
    const [erreurs, setErreurs] = useState<Record<string, string>>({});
    const [statut, setStatut] = useState<"idle" | "chargement" | "succes" | "erreur">("idle");
    const [messageErreurAPI, setMessageErreurAPI] = useState("");

    const valider = useCallback((): boolean => {
        const e: Record<string, string> = {};
        if (!formData.nom.trim()) e.nom = "Le nom est requis";
        if (!formData.prenom.trim()) e.prenom = "Le prénom est requis";
        if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email invalide";
        if (formData.motDePasse.length < 6) e.motDePasse = "Minimum 6 caractères";
        if (formData.motDePasse !== confirmerMotDePasse) e.confirmer = "Les mots de passe ne correspondent pas";

        setErreurs(e);
        return Object.keys(e).length === 0;
    }, [formData, confirmerMotDePasse]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (erreurs[name]) setErreurs((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSoumettre = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!valider()) return;

        setStatut("chargement");
        setMessageErreurAPI("");

        // Conversion vers le format attendu par ton API (password)
        const payload = {
            prenom: formData.prenom.trim(),
            nom: formData.nom.trim(),
            email: formData.email.trim(),
            telephone: formData.telephone.trim(),
            ville: formData.ville.trim(),
            password: formData.motDePasse.trim(),
        };

        try {
            await ajouterAgent(payload);
            setStatut("succes");
            setTimeout(() => navigate("/agents", { replace: true }), 1500);
        } catch (err: any) {
            console.error("Erreur API :", err);
            setStatut("erreur");
            const msg = err?.response?.data?.details?.password || "Une erreur est survenue.";
            setMessageErreurAPI(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form
                onSubmit={handleSoumettre}
                className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Créer un agent</h1>

                {messageErreurAPI && <div className="text-red-500 mb-4 text-sm">{messageErreurAPI}</div>}

                <div className="space-y-4">
                    <input
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Nom"
                        className="w-full p-3 border rounded-xl"
                    />
                    {erreurs.nom && <p className="text-red-500 text-xs">{erreurs.nom}</p>}

                    <input
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Prénom"
                        className="w-full p-3 border rounded-xl"
                    />

                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-3 border rounded-xl"
                    />

                    <input
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="Téléphone"
                        className="w-full p-3 border rounded-xl"
                    />

                    <input
                        name="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        placeholder="Ville"
                        className="w-full p-3 border rounded-xl"
                    />

                    <div className="relative">
                        <input
                            type={afficherMotDePasse ? "text" : "password"}
                            name="motDePasse"
                            value={formData.motDePasse}
                            onChange={handleChange}
                            placeholder="Mot de passe"
                            className="w-full p-3 border rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                            className="absolute right-3 top-3"
                        >
                            {afficherMotDePasse ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <input
                        type="password"
                        value={confirmerMotDePasse}
                        onChange={(e) => setConfirmerMotDePasse(e.target.value)}
                        placeholder="Confirmer mot de passe"
                        className="w-full p-3 border rounded-xl"
                    />
                    {erreurs.confirmer && <p className="text-red-500 text-xs">{erreurs.confirmer}</p>}

                    <button
                        type="submit"
                        disabled={statut === "chargement"}
                        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
                    >
                        {statut === "chargement" ? "Création en cours..." : "Créer l'agent"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgentInscription;
