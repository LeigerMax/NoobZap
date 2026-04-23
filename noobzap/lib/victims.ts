export interface Victim {
  id: string;
  name: string;
  lore: string;
}

export const victimsData: Victim[] = [
  {
    id: "miguel",
    name: "Miguel",
    lore: "Possède un handicap physique. Son frère David l'exploite comme baby-sitter corvéable (conduire, laver les enfants) créant une relation tendue. Fan de téléréalités débiles (Secret Story). Statistiquement le plus nul de l'équipe (on ne gagne jamais avec lui). Cible de vannes récurrentes sur sa sexualité et sur sa maman Annette. N'assume jamais ses excuses pathétiques."
  },
  {
    id: "maxime",
    name: "Maxime",
    lore: "Génie de l'informatique au chômage (aucune offre pour junior). Très fort aux jeux mais rage violemment. A déjà pulvérisé une lampe avec son casque VR en jouant à Phasmophobia. Accusé de plagier Wankil Studio (@allmaxou). A sournoisement récupéré le serveur Discord de Lucas grâce à des droits obtenus juste avant le ban de ce dernier."
  },
  {
    id: "lucas",
    name: "Lucas",
    lore: "Le premier des 'petits'. Rescapé d'un accident de trottinette. Joue H24 à Rust et R6S en hurlant que ce sont des jeux de merde. Pollue le vocal avec ses TikTok à fond. Légende urbaine : ferait caca sans s'essuyer pour retourner jouer plus vite. S'est fait bannir de Discord et a perdu son empire au profit de Maxime."
  },
  {
    id: "loic",
    name: "Loic",
    lore: "Le deuxième des 'petits'. Recordman d'absence absolu. Se fait constamment 'daronned' (gronder par ses parents). Totalement largué techniquement car il rate tous les setups de groupe ; il faut lui tenir la main pour chaque installation."
  },
  {
    id: "rose",
    name: "Rose",
    lore: "Copine de Maxime. Rage sur absolument chaque action en jeu. Utilise systématiquement l'excuse légendaire de la 'souris qui bug'. Élue la plus asociale du groupe : refuse de venir en vocal parce qu'elle n'aime pas 'les petits'."
  }
];