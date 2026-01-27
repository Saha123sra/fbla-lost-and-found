// French translations
export default {
  // Navigation
  nav: {
    home: "Accueil",
    browse: "Parcourir",
    reportFound: "Signaler Trouve",
    lostItem: "Objet Perdu",
    myClaims: "Mes Reclamations",
    myRequests: "Mes Demandes",
    faq: "FAQ",
    admin: "Admin",
    owner: "Proprietaire",
    login: "Connexion",
    signUp: "S'inscrire",
    logout: "Deconnexion"
  },

  // Home page
  home: {
    hero: {
      title: "Perdu Quelque Chose?",
      tagline: "Nous Vous Aiderons a le Trouver.",
      subtitle: "Notre plateforme alimentee par l'IA aide les Danes a retrouver leurs affaires perdues. Vous avez trouve quelque chose? Signalez-le. Vous avez perdu quelque chose? Recherchez-le. Nous sommes la pour nous entraider.",
      browseCta: "Voir les Objets Trouves",
      reportCta: "Signaler un Objet Trouve"
    },
    stats: {
      itemsFound: "Objets Trouves",
      itemsReturned: "Objets Restitues",
      activeUsers: "Utilisateurs Actifs"
    },
    howItWorks: {
      title: "Comment Ca Marche",
      step1Title: "Signaler ou Rechercher",
      step1Desc: "Vous avez trouve quelque chose? Signalez-le. Vous avez perdu quelque chose? Recherchez dans notre base de donnees ou pre-enregistrez votre objet.",
      step2Title: "Correspondance",
      step2Desc: "Notre systeme fait correspondre automatiquement les objets trouves avec les demandes d'objets perdus et vous notifie.",
      step3Title: "Reclamer et Recuperer",
      step3Desc: "Verifiez la propriete, obtenez l'approbation et recuperez votre objet au bureau principal."
    }
  },

  // Browse page
  browse: {
    title: "Objets Trouves",
    subtitle: "Parcourez les objets qui ont ete trouves au lycee Denmark",
    search: "Rechercher des objets...",
    filter: {
      all: "Toutes les Categories",
      category: "Categorie",
      location: "Emplacement",
      date: "Date de Decouverte",
      duration: "Duree",
      anyTime: "N'importe Quand",
      lastWeek: "Semaine Derniere",
      last2Weeks: "2 Dernieres Semaines",
      lastMonth: "Mois Dernier",
      olderThanMonth: "Plus d'1 Mois",
      priority: "Priorite",
      anyPriority: "Toute Priorite",
      highPriority: "Haute Priorite",
      lowPriority: "Basse Priorite",
      availability: "Disponibilite",
      availableOnly: "Disponibles Seulement",
      available: "Disponible",
      pendingClaim: "Reclamation en Cours",
      claimed: "Reclame",
      allItems: "Tous les Objets"
    },
    noItems: "Aucun objet trouve",
    claim: "Reclamer",
    viewDetails: "Voir les Details"
  },

  // Report page
  report: {
    title: "Signaler un Objet Trouve",
    subtitle: "Aidez a reunir un objet perdu avec son proprietaire",
    form: {
      photo: "Photo de l'Objet (Facultatif)",
      photoHelp: "Telechargez une photo pour aider les proprietaires a identifier leur objet",
      name: "Nom de l'Objet",
      namePlaceholder: "ex., Sac a dos Nike bleu, iPhone 14, Calculatrice TI-84",
      category: "Categorie",
      selectCategory: "Selectionner une categorie...",
      location: "Lieu de Decouverte",
      selectLocation: "Selectionner un emplacement...",
      specificLocation: "Emplacement Specifique",
      specificLocationPlaceholder: "ex., Pres de la salle 204, pres de la fontaine d'eau",
      dateFound: "Date de Decouverte",
      description: "Description",
      descriptionPlaceholder: "Decrivez l'objet en detail: couleur, taille, marque, caracteristiques distinctives...",
      submit: "Soumettre l'Objet Trouve"
    },
    success: {
      title: "Objet Signale avec Succes!",
      message: "Merci d'avoir aide un camarade Dane! L'objet a ete ajoute a notre base de donnees.",
      reference: "Numero de Reference",
      reportAnother: "Signaler un Autre",
      viewItems: "Voir les Objets"
    }
  },

  // Request page (Lost Item)
  request: {
    title: "Pre-enregistrer un Objet Perdu",
    subtitle: "Recevez une notification lorsque votre objet est trouve",
    howItWorks: "Comment ca marche:",
    howItWorksDesc: "Decrivez l'objet que vous avez perdu. Si quelqu'un signale un objet correspondant, vous recevrez une notification par email. Cela vous aide a retrouver vos affaires plus rapidement!",
    form: {
      name: "Nom de l'Objet",
      namePlaceholder: "ex., Veste North Face bleue",
      description: "Description",
      descriptionPlaceholder: "Decrivez votre objet en detail:\n- Taille, couleur, marque\n- Marques uniques, autocollants ou dommages\n- Contenu (si applicable)\n- Toute caracteristique d'identification",
      descriptionMin: "caracteres minimum",
      photo: "Photo de l'Objet (Facultatif)",
      photoHelp: "Telechargez une photo de l'objet que vous avez perdu. Cela aide notre systeme a le faire correspondre plus precisement lorsqu'il est trouve.",
      category: "Categorie",
      location: "Dernier Emplacement Vu",
      dateLost: "Date de Perte",
      submit: "Soumettre la Demande"
    },
    success: {
      title: "Demande Soumise!",
      message: "Nous avons enregistre votre objet perdu. Si un objet correspondant est trouve, vous serez automatiquement notifie.",
      viewRequests: "Voir Mes Demandes",
      browseItems: "Parcourir les Objets"
    }
  },

  // Claims
  claims: {
    title: "Mes Reclamations",
    noClaims: "Vous n'avez pas encore fait de reclamation",
    status: {
      pending: "En Attente",
      approved: "Approuve",
      denied: "Refuse",
      cancelled: "Annule"
    },
    pickup: "Details de Recuperation",
    cancel: "Annuler la Reclamation"
  },

  // Common
  common: {
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    tryAgain: "Reessayer",
    back: "Retour",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    view: "Voir",
    submit: "Soumettre",
    required: "Requis",
    optional: "Facultatif",
    dragDrop: "Glissez et deposez une image ici",
    orClick: "ou cliquez pour parcourir",
    maxSize: "max 5 Mo",
    loginRequired: "Connexion Requise",
    loginRequiredDesc: "Veuillez vous connecter pour acceder a cette fonctionnalite"
  },

  // Auth
  auth: {
    login: "Connexion",
    register: "S'inscrire",
    studentId: "ID Etudiant",
    email: "Email",
    password: "Mot de Passe",
    confirmPassword: "Confirmer le Mot de Passe",
    firstName: "Prenom",
    lastName: "Nom",
    gradeLevel: "Niveau",
    forgotPassword: "Mot de passe oublie?",
    noAccount: "Vous n'avez pas de compte?",
    hasAccount: "Vous avez deja un compte?",
    adminLogin: "Connexion Admin",
    ownerLogin: "Connexion Proprietaire",
    adminCode: "Code Admin a 6 Chiffres"
  },

  // Footer
  footer: {
    description: "Systeme officiel des objets trouves du lycee Denmark.",
    quickLinks: "Liens Rapides",
    contact: "Contact",
    hours: "Heures: 7h30 - 16h00",
    copyright: "Lycee Denmark Objets Trouves"
  },

  // Language names
  languages: {
    en: "Anglais",
    es: "Espagnol",
    hi: "Hindi",
    fr: "Francais"
  }
};
