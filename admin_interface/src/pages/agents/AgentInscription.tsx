import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAgents } from "../../context/AgentsContext";

const AgentInscription = () => {
    const navigate = useNavigate();
    const { ajouterAgent } = useAgents();

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        ville: "",
        telephone: "",
        motDePasse: "",
    });
    const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
    const [statut, setStatut] = useState<"idle" | "chargement" | "succes" | "erreur">("idle");
    const [messageErreurAPI, setMessageErreurAPI] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSoumettre = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation simple
        if (formData.motDePasse !== confirmerMotDePasse) {
            setMessageErreurAPI("Les mots de passe ne correspondent pas.");
            return;
        }

        setStatut("chargement");

        // CORRECTION CRUCIALE ICI :
        // On mappe "motDePasse" (interne) vers "password" (attendu par l'API)
        const payload = {
            nom: formData.nom.trim(),
            prenom: formData.prenom.trim(),
            email: formData.email.trim(),
            telephone: formData.telephone.trim(),
            ville: formData.ville.trim(),
            password: formData.motDePasse.trim(), // <--- Le backend reçoit "password"
        };

        try {
            await ajouterAgent(payload);
            setStatut("succes");
            setTimeout(() => navigate("/agents", { replace: true }), 1500);
        } catch (err: any) {
            setStatut("erreur");
            // Affiche l'erreur reçue du backend
            setMessageErreurAPI(err?.response?.data?.message || "Erreur lors de la création.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleSoumettre} className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-lg">
                <h1 className="text-xl font-bold mb-6">Créer un agent</h1>

                {messageErreurAPI && <div className="text-red-500 mb-4">{messageErreurAPI}</div>}

                <div className="space-y-4">
                    <input
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Nom"
                        className="w-full p-3 border rounded-xl"
                    />
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

                    <input
                        type="password"
                        name="motDePasse"
                        value={formData.motDePasse}
                        onChange={handleChange}
                        placeholder="Mot de passe"
                        className="w-full p-3 border rounded-xl"
                    />
                    <input
                        type="password"
                        value={confirmerMotDePasse}
                        onChange={(e) => setConfirmerMotDePasse(e.target.value)}
                        placeholder="Confirmer mot de passe"
                        className="w-full p-3 border rounded-xl"
                    />

                    <button
                        type="submit"
                        disabled={statut === "chargement"}
                        className="w-full bg-green-600 text-white py-3 rounded-xl"
                    >
                        {statut === "chargement" ? "Création..." : "Créer l'agent"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgentInscription;
