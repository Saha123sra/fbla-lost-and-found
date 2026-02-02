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
      activeUsers: "Utilisateurs Actifs",
      returnRate: "Taux de Retour",
      avgReturnTime: "Temps Moyen"
    },
    howItWorks: {
      title: "Comment Ca Marche",
      subtitle: "Notre simple processus en 3 etapes rend la recherche d'objets perdus plus facile que jamais",
      step1Title: "Signaler ou Rechercher",
      step1Desc: "Vous avez trouve quelque chose? Signalez-le. Vous avez perdu quelque chose? Recherchez dans notre base de donnees ou pre-enregistrez votre objet.",
      step2Title: "Correspondance",
      step2Desc: "Notre systeme fait correspondre automatiquement les objets trouves avec les demandes d'objets perdus et vous notifie.",
      step3Title: "Reclamer et Recuperer",
      step3Desc: "Verifiez la propriete, obtenez l'approbation et recuperez votre objet au bureau principal."
    },
    testimonials: {
      title: "Ce Que Disent Les Danes"
    },
    cta: {
      title: "Vous Avez Trouve Quelque Chose?",
      subtitle: "Aidez un camarade Dane en le signalant. Ca ne prend qu'une minute!"
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
    viewDetails: "Voir les Details",
    tryAdjusting: "Essayez d'ajuster votre recherche ou vos filtres",
    clearFilters: "Effacer tous les filtres",
    clearAll: "Tout effacer",
    uncategorized: "Non categorise",
    page: "Page",
    of: "sur"
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
    claimedOn: "Reclame le",
    reason: "Raison",
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
    adminId: "ID Admin",
    email: "Email",
    password: "Mot de Passe",
    confirmPassword: "Confirmer le Mot de Passe",
    passwordPlaceholder: "Au moins 6 caracteres",
    confirmPasswordPlaceholder: "Entrez a nouveau votre mot de passe",
    firstName: "Prenom",
    lastName: "Nom",
    gradeLevel: "Niveau",
    forgotPassword: "Mot de passe oublie?",
    noAccount: "Vous n'avez pas de compte?",
    hasAccount: "Vous avez deja un compte?",
    adminLogin: "Connexion Admin",
    ownerLogin: "Connexion Proprietaire",
    adminCode: "Code Admin a 6 Chiffres",
    siteOwner: "Proprietaire du Site",
    studentLogin: "Connexion Etudiant",
    enterPassword: "Entrez votre mot de passe",
    enterAdminId: "Entrez votre ID admin",
    enterStudentId: "Entrez votre ID etudiant",
    createAccount: "Creer un Compte",
    registerAsAdmin: "S'inscrire comme Admin",
    select: "Selectionner..."
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
    fr: "Francais",
    zh: "Mandarin"
  },

  // Admin Dashboard
  admin: {
    title: "Tableau de Bord Admin",
    stats: {
      activeItems: "Objets Actifs",
      pendingClaims: "Reclamations en Attente",
      returnedItems: "Objets Restitues",
      successRate: "Taux de Reussite"
    },
    tabs: {
      overview: "Apercu",
      claims: "Reclamations",
      items: "Objets",
      students: "Etudiants"
    },
    overview: {
      welcome: "Bienvenue, Admin!",
      pendingReview: "Vous avez {count} reclamations en attente a examiner.",
      reviewClaims: "Examiner les Reclamations"
    },
    claims: {
      title: "Reclamations en Attente",
      noPending: "Pas de reclamations en attente! Tout est a jour.",
      claimedBy: "Reclame par",
      studentId: "ID Etudiant",
      proofOfOwnership: "Preuve de Propriete",
      approve: "Approuver",
      deny: "Refuser",
      approveClaim: "Approuver la Reclamation",
      denyClaim: "Refuser la Reclamation",
      pickupDate: "Date de Recuperation",
      pickupTime: "Heure de Recuperation",
      pickupLocation: "Lieu de Recuperation",
      denialReason: "Raison du Refus",
      denialPlaceholder: "Preuve insuffisante, la description ne correspond pas...",
      confirm: "Confirmer",
      actionSuccess: "Reclamation {status}!",
      loadError: "Echec du chargement des reclamations",
      actionError: "Action echouee"
    },
    students: {
      title: "Repertoire des Etudiants",
      searchPlaceholder: "Rechercher des etudiants...",
      noMatch: "Aucun etudiant ne correspond a votre recherche",
      noStudents: "Aucun etudiant inscrit pour le moment",
      loadingStudents: "Chargement des etudiants...",
      loadError: "Echec du chargement des etudiants",
      columns: {
        name: "Nom",
        studentId: "ID Etudiant",
        email: "Email",
        grade: "Niveau",
        claims: "Reclamations",
        itemsReported: "Objets Signales",
        joined: "Inscrit"
      }
    },
    items: {
      comingSoon: "Gestion des objets bientot disponible..."
    }
  },

  // Owner Dashboard
  owner: {
    title: "Tableau de Bord Proprietaire",
    siteAdmin: "Administration du Site",
    adminId: "ID Admin",
    lastLogin: "Derniere Connexion",
    actions: "Actions",
    never: "Jamais",
    stats: {
      pendingAdmins: "Admins en Attente",
      activeAdmins: "Admins Actifs"
    },
    tabs: {
      pendingAdmins: "Admins en Attente",
      allAdmins: "Tous les Admins",
      settings: "Parametres"
    },
    pendingAdmins: {
      title: "Demandes d'Admin en Attente",
      noPending: "Pas de demandes d'admin en attente",
      approve: "Approuver",
      deny: "Refuser",
      requestedOn: "Demande le"
    },
    allAdmins: {
      title: "Tous les Administrateurs",
      active: "Actif",
      deactivated: "Desactive",
      reactivate: "Reactiver",
      deactivate: "Desactiver",
      regenerateCode: "Regenerer le Code",
      noAdmins: "Aucun administrateur trouve"
    },
    denyModal: {
      title: "Refuser l'Inscription Admin",
      denyingFor: "Refuser l'inscription pour",
      reasonLabel: "Raison",
      reasonPlaceholder: "Entrez la raison du refus...",
      denyButton: "Refuser l'Inscription"
    }
  },

  // Item Detail page
  itemDetail: {
    category: "Categorie",
    location: "Emplacement",
    dateFound: "Date de Decouverte",
    reportedBy: "Signale par",
    description: "Description",
    status: "Statut",
    claimItem: "Reclamer cet Objet",
    backToBrowse: "Retour a la Navigation",
    notFound: "Objet non trouve",
    alreadyClaimed: "Cet objet a deja ete reclame",
    pendingClaim: "Cet objet a une reclamation en attente"
  },

  // Claim form
  claimForm: {
    title: "Reclamer cet Objet",
    subtitle: "Veuillez fournir une preuve de propriete",
    proofLabel: "Decrivez comment vous pouvez prouver que c'est le votre",
    proofPlaceholder: "Decrivez les caracteristiques uniques, marques ou contenus que seul le proprietaire connaitrait. Soyez precis - cela nous aide a verifier votre propriete.",
    proofHelp: "Incluez des details comme: rayures specifiques, autocollants, contenus, numeros de serie, ou toute caracteristique d'identification unique.",
    contactEmail: "Email de Contact",
    contactPhone: "Telephone de Contact (Facultatif)",
    confirmationSentTo: "La confirmation sera envoyee a:",
    importantLabel: "Important",
    disclaimer: "En soumettant cette reclamation, vous confirmez que cet objet vous appartient. Les fausses reclamations peuvent entrainer des mesures disciplinaires.",
    submit: "Soumettre la Reclamation",
    success: {
      title: "Reclamation Soumise!",
      message: "Votre reclamation a ete soumise et est en attente d'examen. Vous recevrez un email une fois traitee.",
      viewClaims: "Voir Mes Reclamations"
    }
  },

  // FAQ page
  faq: {
    title: "Questions Frequemment Posees",
    subtitle: "Trouvez des reponses aux questions courantes sur Lost Dane Found",
    searchPlaceholder: "Rechercher des questions...",
    categories: {
      general: "General",
      reporting: "Signaler des Objets",
      claiming: "Reclamer des Objets",
      account: "Compte"
    },
    noResults: "Aucune question ne correspond a votre recherche",
    stillNeedHelp: "Besoin d'aide supplementaire?",
    contactUs: "Contactez le bureau principal",
    visitOffice: "Ou visitez le Bureau Principal pendant les heures scolaires"
  },

  // OTP / Verification
  otp: {
    title: "Entrez le Code de Verification",
    subtitle: "Nous avons envoye un code a 6 chiffres a votre email",
    placeholder: "Entrez le code a 6 chiffres",
    submit: "Verifier",
    resend: "Renvoyer le Code",
    resendIn: "Renvoyer le code dans {seconds}s",
    invalid: "Code invalide. Veuillez reessayer.",
    expired: "Code expire. Veuillez en demander un nouveau."
  },

  // Password Reset
  resetPassword: {
    forgotTitle: "Mot de Passe Oublie",
    forgotSubtitle: "Entrez votre email et nous vous enverrons un lien de reinitialisation",
    sendLink: "Envoyer le Lien",
    linkSent: "Lien envoye! Verifiez votre email.",
    resetTitle: "Reinitialiser Votre Mot de Passe",
    newPassword: "Nouveau Mot de Passe",
    confirmNewPassword: "Confirmer le Nouveau Mot de Passe",
    resetButton: "Reinitialiser le Mot de Passe",
    success: "Mot de passe reinitialise avec succes! Vous pouvez maintenant vous connecter."
  },

  // My Requests page
  myRequests: {
    title: "Mes Demandes d'Objets Perdus",
    subtitle: "Suivez les objets que vous avez pre-enregistres comme perdus",
    noRequests: "Vous n'avez pas encore soumis de demandes d'objets perdus",
    noRequestsDesc: "Pre-enregistrez les objets perdus pour etre notifie lorsqu'ils sont trouves",
    createNew: "Signaler un Objet Perdu",
    newRequest: "Nouvelle Demande",
    viewMatch: "Voir la Correspondance",
    howMatchingWorks: "Comment fonctionne la correspondance",
    howMatchingWorksDesc: "Notre systeme compare automatiquement la description de votre objet perdu avec les objets trouves recemment signales. Lorsqu'il y a une correspondance potentielle, vous recevrez une notification par email.",
    status: {
      active: "Actif",
      matched: "Correspondance",
      cancelled: "Annule",
      expired: "Expire"
    },
    dateLost: "Date de Perte",
    cancel: "Annuler la Demande"
  },

  // ChatBot
  chatbot: {
    title: "Assistant Lost Dane Found",
    alwaysAvailable: "Toujours disponible",
    typing: "L'assistant ecrit...",
    placeholder: "Posez-moi n'importe quelle question...",
    suggestionsLabel: "Questions rapides",
    greeting: "Bonjour! Je suis la pour vous aider avec Lost Dane Found. Comment puis-je vous aider aujourd'hui?",
    suggestions: [
      "Comment signaler un objet trouve?",
      "Comment reclamer un objet?",
      "Ou se trouve les objets trouves?",
      "Combien de temps les objets sont-ils gardes?"
    ],
    responses: {
      greeting: "Bonjour! 👋 Cherchez-vous un objet perdu ou voulez-vous signaler quelque chose que vous avez trouve?",
      search: "Pour rechercher des objets:\n\n1️⃣ Allez dans Parcourir les Objets dans le menu\n2️⃣ Utilisez les filtres (categorie, date, emplacement)\n3️⃣ Trouve une correspondance? Soumettez une reclamation!",
      lost: "Desole d'entendre ca! 😟\n\nVoici ce qu'il faut faire:\n\n1️⃣ Verifiez Parcourir les Objets pour voir s'il a ete trouve\n2️⃣ Soumettez une demande d'objet perdu pour etre notifie s'il reapparait",
      found: "Merci d'aider! 🐕\n\nAllez dans Signaler Trouve dans le menu, telechargez une photo et ajoutez des details. Nous nous occupons du reste!",
      claim: "Processus de reclamation:\n\n1️⃣ Trouvez votre objet dans Parcourir les Objets\n2️⃣ Cliquez sur 'Reclamer' et fournissez une preuve de propriete\n3️⃣ L'admin examine en 24 heures\n4️⃣ Recevez les instructions par email\n5️⃣ Apportez votre carte etudiant pour recuperer",
      location: "📍 Bureau des Objets Trouves\nBureau Principal, Salle 101\n\n🕐 Heures\nLundi - Vendredi: 7h30 – 16h00",
      howItWorks: "Comment fonctionne Lost Dane Found:\n\n🔍 Perdu quelque chose?\nParcourez les objets ou soumettez une demande d'objet perdu\n\n📦 Trouve quelque chose?\nSignalez-le pour que le proprietaire puisse le trouver\n\n✅ Reclamation\nSoumettez une preuve, faites-vous verifier, recuperez!",
      thanks: "Je vous en prie! 🎉 Faites-moi savoir si vous avez besoin d'autre chose.",
      default: "Je peux vous aider avec:\n\n🔍 Recherche d'objets perdus\n📦 Signalement d'objets trouves\n✅ Processus de reclamation\n📍 Emplacement et heures du bureau\n\nQue souhaitez-vous savoir?"
    }
  },

  // Toasts / Notifications
  toast: {
    success: "Succes!",
    error: "Erreur",
    claimSubmitted: "Reclamation soumise avec succes",
    itemReported: "Objet signale avec succes",
    requestSubmitted: "Demande soumise avec succes",
    loginSuccess: "Connexion reussie",
    logoutSuccess: "Deconnexion reussie",
    profileUpdated: "Profil mis a jour avec succes"
  }
};
