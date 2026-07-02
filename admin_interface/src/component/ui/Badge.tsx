import { useLangue } from "../../context/LangueContext";

type StatutBadge = string;

interface BadgeConfig {
    label: string;
    classe: string;
}

interface CouleurBadge {
    couleur: string;
}

interface BadgeProps {
    statut: StatutBadge;
}

const Badge = ({ statut }: BadgeProps) => {
    const { t } = useLangue();

    const configs: Record<string, BadgeConfig> = {
        // Utilisateurs
        nouveau: { label: t.utilisateurs?.nouveau || "Nouveau", classe: "badge-info" },
        actif: { label: t.utilisateurs?.actif || "Actif", classe: "badge-success" },
        inactif: { label: t.utilisateurs?.inactif || "Inactif", classe: "badge-neutral" },
        suspendu: { label: t.utilisateurs?.suspendu || "Suspendu", classe: "badge-warning" },
        bloque: { label: t.utilisateurs?.bloque || "Bloqué", classe: "badge-danger" },

        // Crédits
        en_cours: { label: t.credits?.actif || "En cours", classe: "badge-info" },
        en_attente: { label: t.credits?.enAttente_statut || "En attente", classe: "badge-warning" },
        en_retard: { label: t.credits?.enRetard_statut || "En retard", classe: "badge-danger" },
        rembourse: { label: t.credits?.rembourse_statut || "Remboursé", classe: "badge-success" },
        inactif_credit: { label: t.credits?.rejete || "Rejeté", classe: "badge-neutral" },

        // Transactions - types
        depot: { label: t.transactions?.depot || "Dépôt", classe: "badge-success" },
        retrait: { label: t.transactions?.retrait || "Retrait", classe: "badge-warning" },
        transfert: { label: t.transactions?.transfert || "Transfert", classe: "badge-info" },
        remboursement: { label: t.transactions?.remboursement || "Remboursement", classe: "badge-success" },

        // Transactions - statuts
        reussi: { label: t.transactions?.reussi || "Réussi", classe: "badge-success" },
        reussie: { label: t.transactions?.reussi || "Réussi", classe: "badge-success" },
        en_attente_tx: { label: t.transactions?.enAttente || "En attente", classe: "badge-warning" },
        echoue: { label: t.transactions?.echoue || "Échoué", classe: "badge-danger" },
        echouee: { label: t.transactions?.echoue || "Échoué", classe: "badge-danger" },
    };

    const config = configs[statut] ?? { label: statut, classe: "badge-neutral" };

    const points: Record<string, CouleurBadge> = {
        "badge-success": { couleur: "#16a34a" },
        "badge-warning": { couleur: "#F59E0B" },
        "badge-danger": { couleur: "#ef4444" },
        "badge-info": { couleur: "#0891b2" },
        "badge-neutral": { couleur: "#6b7280" },
    };

    const point = points[config.classe] ?? { couleur: "#6b7280" };

    return (
        <span className={config.classe} role="status" aria-label={config.label}>
            <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: point.couleur }}
                aria-hidden="true"
            />
            {config.label}
        </span>
    );
};

export default Badge;
