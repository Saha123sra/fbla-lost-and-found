// Spanish translations
export default {
  // Navigation
  nav: {
    home: "Inicio",
    browse: "Ver Objetos",
    reportFound: "Reportar Encontrado",
    lostItem: "Objeto Perdido",
    myClaims: "Mis Reclamos",
    myRequests: "Mis Solicitudes",
    faq: "Preguntas Frecuentes",
    admin: "Admin",
    owner: "Propietario",
    login: "Iniciar Sesion",
    signUp: "Registrarse",
    logout: "Cerrar Sesion"
  },

  // Home page
  home: {
    hero: {
      title: "Perdiste Algo?",
      tagline: "Te Ayudaremos a Encontrarlo.",
      subtitle: "Nuestra plataforma con IA ayuda a los Danes a reunirse con sus pertenencias perdidas. Encontraste algo? Reportalo. Perdiste algo? Buscalo. Estamos aqui para ayudarnos mutuamente.",
      browseCta: "Ver Objetos Encontrados",
      reportCta: "Reportar Objeto Encontrado"
    },
    stats: {
      itemsFound: "Objetos Encontrados",
      itemsReturned: "Objetos Devueltos",
      activeUsers: "Usuarios Activos",
      returnRate: "Tasa de Devolucion",
      avgReturnTime: "Tiempo Promedio"
    },
    howItWorks: {
      title: "Como Funciona",
      subtitle: "Nuestro simple proceso de 3 pasos hace que encontrar objetos perdidos sea mas facil que nunca",
      step1Title: "Reportar o Buscar",
      step1Desc: "Encontraste algo? Reportalo. Perdiste algo? Busca en nuestra base de datos o pre-registra tu objeto.",
      step2Title: "Emparejamiento",
      step2Desc: "Nuestro sistema empareja automaticamente objetos encontrados con solicitudes de objetos perdidos y te notifica.",
      step3Title: "Reclamar y Recoger",
      step3Desc: "Verifica la propiedad, obtiene aprobacion y recoge tu objeto en la oficina principal."
    },
    testimonials: {
      title: "Lo Que Dicen Los Danes"
    },
    cta: {
      title: "Encontraste Algo?",
      subtitle: "Ayuda a un companero Dane reportandolo. Solo toma un minuto!"
    }
  },

  // Browse page
  browse: {
    title: "Objetos Encontrados",
    subtitle: "Explora objetos que han sido encontrados en Denmark High School",
    search: "Buscar objetos...",
    filter: {
      all: "Todas las Categorias",
      category: "Categoria",
      location: "Ubicacion",
      date: "Fecha Encontrado",
      duration: "Duracion",
      anyTime: "Cualquier Momento",
      lastWeek: "Ultima Semana",
      last2Weeks: "Ultimas 2 Semanas",
      lastMonth: "Ultimo Mes",
      olderThanMonth: "Mas de 1 Mes",
      priority: "Prioridad",
      anyPriority: "Cualquier Prioridad",
      highPriority: "Alta Prioridad",
      lowPriority: "Baja Prioridad",
      availability: "Disponibilidad",
      availableOnly: "Solo Disponibles",
      available: "Disponible",
      pendingClaim: "Reclamo Pendiente",
      claimed: "Reclamado",
      allItems: "Todos los Objetos"
    },
    noItems: "No se encontraron objetos",
    claim: "Reclamar",
    viewDetails: "Ver Detalles",
    tryAdjusting: "Intenta ajustar tu busqueda o filtros",
    clearFilters: "Limpiar todos los filtros",
    clearAll: "Limpiar todo",
    uncategorized: "Sin categoria",
    page: "Pagina",
    of: "de"
  },

  // Report page
  report: {
    title: "Reportar un Objeto Encontrado",
    subtitle: "Ayuda a reunir un objeto perdido con su dueno",
    form: {
      photo: "Foto del Objeto (Opcional)",
      photoHelp: "Sube una foto para ayudar a los duenos a identificar su objeto",
      name: "Nombre del Objeto",
      namePlaceholder: "ej., Mochila Nike Azul, iPhone 14, Calculadora TI-84",
      category: "Categoria",
      selectCategory: "Seleccionar categoria...",
      location: "Lugar Encontrado",
      selectLocation: "Seleccionar ubicacion...",
      specificLocation: "Ubicacion Especifica",
      specificLocationPlaceholder: "ej., Cerca del salon 204, junto a la fuente de agua",
      dateFound: "Fecha Encontrado",
      description: "Descripcion",
      descriptionPlaceholder: "Describe el objeto en detalle: color, tamano, marca, caracteristicas distintivas...",
      submit: "Enviar Objeto Encontrado"
    },
    success: {
      title: "Objeto Reportado Exitosamente!",
      message: "Gracias por ayudar a un companero Dane! El objeto ha sido agregado a nuestra base de datos.",
      reference: "Numero de Referencia",
      reportAnother: "Reportar Otro",
      viewItems: "Ver Objetos"
    }
  },

  // Request page (Lost Item)
  request: {
    title: "Pre-Registrar Objeto Perdido",
    subtitle: "Recibe notificaciones cuando tu objeto sea encontrado",
    howItWorks: "Como funciona:",
    howItWorksDesc: "Describe el objeto que perdiste. Si alguien reporta un objeto que coincide, recibiras una notificacion por correo electronico. Esto te ayuda a recuperar tus pertenencias mas rapido!",
    form: {
      name: "Nombre del Objeto",
      namePlaceholder: "ej., Chaqueta North Face Azul",
      description: "Descripcion",
      descriptionPlaceholder: "Describe tu objeto en detalle:\n- Tamano, color, marca\n- Marcas unicas, calcomanias o danos\n- Contenido (si aplica)\n- Cualquier caracteristica identificable",
      descriptionMin: "caracteres minimo",
      photo: "Foto del Objeto (Opcional)",
      photoHelp: "Sube una foto del objeto que perdiste. Esto ayuda a nuestro sistema a emparejarlo con mayor precision cuando sea encontrado.",
      category: "Categoria",
      location: "Ultima Ubicacion Vista",
      dateLost: "Fecha Perdido",
      submit: "Enviar Solicitud"
    },
    success: {
      title: "Solicitud Enviada!",
      message: "Hemos registrado tu objeto perdido. Si se encuentra un objeto que coincide, seras notificado automaticamente.",
      viewRequests: "Ver Mis Solicitudes",
      browseItems: "Ver Objetos"
    }
  },

  // Claims
  claims: {
    title: "Mis Reclamos",
    noClaims: "Aun no has hecho ningun reclamo",
    claimedOn: "Reclamado el",
    reason: "Razon",
    status: {
      pending: "Pendiente",
      approved: "Aprobado",
      denied: "Denegado",
      cancelled: "Cancelado"
    },
    pickup: "Detalles de Recogida",
    cancel: "Cancelar Reclamo"
  },

  // Common
  common: {
    loading: "Cargando...",
    error: "Algo salio mal",
    tryAgain: "Intentar de Nuevo",
    back: "Atras",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    submit: "Enviar",
    required: "Requerido",
    optional: "Opcional",
    dragDrop: "Arrastra y suelta una imagen aqui",
    orClick: "o haz clic para buscar",
    maxSize: "maximo 5MB",
    loginRequired: "Inicio de Sesion Requerido",
    loginRequiredDesc: "Por favor inicia sesion para acceder a esta funcion"
  },

  // Auth
  auth: {
    login: "Iniciar Sesion",
    register: "Registrarse",
    studentId: "ID de Estudiante",
    adminId: "ID de Admin",
    email: "Correo Electronico",
    password: "Contrasena",
    confirmPassword: "Confirmar Contrasena",
    passwordPlaceholder: "Al menos 6 caracteres",
    confirmPasswordPlaceholder: "Vuelve a ingresar tu contrasena",
    firstName: "Nombre",
    lastName: "Apellido",
    gradeLevel: "Grado",
    forgotPassword: "Olvidaste tu contrasena?",
    noAccount: "No tienes una cuenta?",
    hasAccount: "Ya tienes una cuenta?",
    adminLogin: "Inicio de Admin",
    ownerLogin: "Inicio de Propietario",
    adminCode: "Codigo de Admin de 6 Digitos",
    siteOwner: "Propietario del Sitio",
    studentLogin: "Inicio de Estudiante",
    enterPassword: "Ingresa tu contrasena",
    enterAdminId: "Ingresa tu ID de admin",
    enterStudentId: "Ingresa tu ID de estudiante",
    createAccount: "Crear Cuenta",
    registerAsAdmin: "Registrarse como Admin",
    select: "Seleccionar..."
  },

  // Footer
  footer: {
    description: "Sistema oficial de objetos perdidos de Denmark High School.",
    quickLinks: "Enlaces Rapidos",
    contact: "Contacto",
    hours: "Horario: 7:30 AM - 4:00 PM",
    copyright: "Denmark High School Objetos Perdidos"
  },

  // Language names
  languages: {
    en: "Ingles",
    es: "Espanol",
    hi: "Hindi",
    fr: "Frances",
    zh: "Mandarin"
  },

  // Admin Dashboard
  admin: {
    title: "Panel de Administrador",
    stats: {
      activeItems: "Objetos Activos",
      pendingClaims: "Reclamos Pendientes",
      returnedItems: "Objetos Devueltos",
      successRate: "Tasa de Exito"
    },
    tabs: {
      overview: "Resumen",
      claims: "Reclamos",
      items: "Objetos",
      students: "Estudiantes"
    },
    overview: {
      welcome: "Bienvenido, Administrador!",
      pendingReview: "Tienes {count} reclamos pendientes por revisar.",
      reviewClaims: "Revisar Reclamos"
    },
    claims: {
      title: "Reclamos Pendientes",
      noPending: "No hay reclamos pendientes! Todo al dia.",
      claimedBy: "Reclamado por",
      studentId: "ID de Estudiante",
      proofOfOwnership: "Prueba de Propiedad",
      approve: "Aprobar",
      deny: "Denegar",
      approveClaim: "Aprobar Reclamo",
      denyClaim: "Denegar Reclamo",
      pickupDate: "Fecha de Recogida",
      pickupTime: "Hora de Recogida",
      pickupLocation: "Lugar de Recogida",
      denialReason: "Razon de Denegacion",
      denialPlaceholder: "Prueba insuficiente, la descripcion no coincide...",
      confirm: "Confirmar",
      actionSuccess: "Reclamo {status}!",
      loadError: "Error al cargar reclamos",
      actionError: "Accion fallida"
    },
    students: {
      title: "Directorio de Estudiantes",
      searchPlaceholder: "Buscar estudiantes...",
      noMatch: "Ningun estudiante coincide con tu busqueda",
      noStudents: "Aun no hay estudiantes registrados",
      loadingStudents: "Cargando estudiantes...",
      loadError: "Error al cargar estudiantes",
      columns: {
        name: "Nombre",
        studentId: "ID Estudiante",
        email: "Correo",
        grade: "Grado",
        claims: "Reclamos",
        itemsReported: "Objetos Reportados",
        joined: "Registro"
      }
    },
    items: {
      comingSoon: "Gestion de objetos proximamente..."
    }
  },

  // Owner Dashboard
  owner: {
    title: "Panel del Propietario del Sitio",
    siteAdmin: "Administracion del Sitio",
    adminId: "ID de Admin",
    lastLogin: "Ultimo Acceso",
    actions: "Acciones",
    never: "Nunca",
    stats: {
      pendingAdmins: "Admins Pendientes",
      activeAdmins: "Admins Activos"
    },
    tabs: {
      pendingAdmins: "Admins Pendientes",
      allAdmins: "Todos los Admins",
      settings: "Configuracion"
    },
    pendingAdmins: {
      title: "Solicitudes de Admin Pendientes",
      noPending: "No hay solicitudes de admin pendientes",
      approve: "Aprobar",
      deny: "Denegar",
      requestedOn: "Solicitado el"
    },
    allAdmins: {
      title: "Todos los Administradores",
      active: "Activo",
      deactivated: "Desactivado",
      reactivate: "Reactivar",
      deactivate: "Desactivar",
      regenerateCode: "Regenerar Codigo",
      noAdmins: "No se encontraron administradores"
    },
    denyModal: {
      title: "Denegar Registro de Admin",
      denyingFor: "Denegando registro para",
      reasonLabel: "Razon",
      reasonPlaceholder: "Ingrese razon de denegacion...",
      denyButton: "Denegar Registro"
    }
  },

  // Item Detail page
  itemDetail: {
    category: "Categoria",
    location: "Ubicacion",
    dateFound: "Fecha Encontrado",
    reportedBy: "Reportado por",
    description: "Descripcion",
    status: "Estado",
    claimItem: "Reclamar Este Objeto",
    backToBrowse: "Volver a Explorar",
    notFound: "Objeto no encontrado",
    alreadyClaimed: "Este objeto ya ha sido reclamado",
    pendingClaim: "Este objeto tiene un reclamo pendiente"
  },

  // Claim form
  claimForm: {
    title: "Reclamar Este Objeto",
    subtitle: "Por favor proporciona prueba de propiedad",
    proofLabel: "Describe como puedes probar que es tuyo",
    proofPlaceholder: "Describe caracteristicas unicas, marcas o contenido que solo el dueno conoceria. Se especifico - esto nos ayuda a verificar tu propiedad.",
    proofHelp: "Incluye detalles como: rasgunos especificos, calcomanias, contenido, numeros de serie, o cualquier caracteristica unica.",
    contactEmail: "Correo de Contacto",
    contactPhone: "Telefono de Contacto (Opcional)",
    confirmationSentTo: "La confirmacion sera enviada a:",
    importantLabel: "Importante",
    disclaimer: "Al enviar este reclamo, confirmas que este objeto te pertenece. Reclamos falsos pueden resultar en accion disciplinaria.",
    submit: "Enviar Reclamo",
    success: {
      title: "Reclamo Enviado!",
      message: "Tu reclamo ha sido enviado y esta pendiente de revision. Recibiras un correo una vez procesado.",
      viewClaims: "Ver Mis Reclamos"
    }
  },

  // FAQ page
  faq: {
    title: "Preguntas Frecuentes",
    subtitle: "Encuentra respuestas a preguntas comunes sobre Lost Dane Found",
    searchPlaceholder: "Buscar preguntas...",
    categories: {
      general: "General",
      reporting: "Reportar Objetos",
      claiming: "Reclamar Objetos",
      account: "Cuenta"
    },
    noResults: "Ninguna pregunta coincide con tu busqueda",
    stillNeedHelp: "Aun necesitas ayuda?",
    contactUs: "Contacta la oficina principal",
    visitOffice: "O visita la Oficina Principal durante el horario escolar"
  },

  // OTP / Verification
  otp: {
    title: "Ingresa el Codigo de Verificacion",
    subtitle: "Hemos enviado un codigo de 6 digitos a tu correo",
    placeholder: "Ingresa codigo de 6 digitos",
    submit: "Verificar",
    resend: "Reenviar Codigo",
    resendIn: "Reenviar codigo en {seconds}s",
    invalid: "Codigo invalido. Por favor intenta de nuevo.",
    expired: "Codigo expirado. Por favor solicita uno nuevo."
  },

  // Password Reset
  resetPassword: {
    forgotTitle: "Olvidaste tu Contrasena",
    forgotSubtitle: "Ingresa tu correo y te enviaremos un enlace de restablecimiento",
    sendLink: "Enviar Enlace",
    linkSent: "Enlace enviado! Revisa tu correo.",
    resetTitle: "Restablecer tu Contrasena",
    newPassword: "Nueva Contrasena",
    confirmNewPassword: "Confirmar Nueva Contrasena",
    resetButton: "Restablecer Contrasena",
    success: "Contrasena restablecida exitosamente! Ya puedes iniciar sesion."
  },

  // My Requests page
  myRequests: {
    title: "Mis Solicitudes de Objetos Perdidos",
    subtitle: "Rastrea objetos que has pre-registrado como perdidos",
    noRequests: "Aun no has enviado solicitudes de objetos perdidos",
    noRequestsDesc: "Pre-registra objetos perdidos para recibir notificaciones cuando sean encontrados",
    createNew: "Reportar un Objeto Perdido",
    newRequest: "Nueva Solicitud",
    viewMatch: "Ver Coincidencia",
    howMatchingWorks: "Como funciona el emparejamiento",
    howMatchingWorksDesc: "Nuestro sistema compara automaticamente la descripcion de tu objeto perdido con los objetos encontrados reportados recientemente. Cuando hay una posible coincidencia, recibiras una notificacion por correo electronico.",
    status: {
      active: "Activo",
      matched: "Emparejado",
      cancelled: "Cancelado",
      expired: "Expirado"
    },
    dateLost: "Fecha Perdido",
    cancel: "Cancelar Solicitud"
  },

  // ChatBot
  chatbot: {
    title: "Asistente Lost Dane Found",
    alwaysAvailable: "Siempre disponible",
    typing: "El asistente esta escribiendo...",
    placeholder: "Preguntame lo que sea...",
    suggestionsLabel: "Preguntas rapidas",
    greeting: "Hola! Estoy aqui para ayudarte con Lost Dane Found. Como puedo asistirte hoy?",
    suggestions: [
      "Como reporto un objeto encontrado?",
      "Como reclamo un objeto?",
      "Donde esta el area de objetos perdidos?",
      "Cuanto tiempo se guardan los objetos?"
    ],
    responses: {
      greeting: "Hola! 👋 Estas buscando un objeto perdido o quieres reportar algo que encontraste?",
      search: "Para buscar objetos:\n\n1️⃣ Ve a Ver Objetos en el menu\n2️⃣ Usa los filtros (categoria, fecha, ubicacion)\n3️⃣ Encontraste una coincidencia? Envia un reclamo!",
      lost: "Lamento escuchar eso! 😟\n\nEsto es lo que debes hacer:\n\n1️⃣ Revisa Ver Objetos para ver si ha sido encontrado\n2️⃣ Envia una Solicitud de Objeto Perdido para que te notifiquemos si aparece",
      found: "Gracias por ayudar! 🐕\n\nVe a Reportar Encontrado en el menu, sube una foto y agrega detalles. Nosotros nos encargamos del resto!",
      claim: "Proceso de reclamo:\n\n1️⃣ Encuentra tu objeto en Ver Objetos\n2️⃣ Haz clic en 'Reclamar' y proporciona prueba de propiedad\n3️⃣ El admin revisa en 24 horas\n4️⃣ Recibe instrucciones de recogida por correo\n5️⃣ Trae tu ID de estudiante para recogerlo",
      location: "📍 Oficina de Objetos Perdidos\nOficina Principal, Salon 101\n\n🕐 Horario\nLunes - Viernes: 7:30 AM – 4:00 PM",
      howItWorks: "Asi funciona Lost Dane Found:\n\n🔍 Perdiste algo?\nExplora objetos o envia una solicitud de objeto perdido\n\n📦 Encontraste algo?\nReportalo para que el dueno pueda encontrarlo\n\n✅ Reclamos\nEnvia prueba, verifica y recoge!",
      thanks: "De nada! 🎉 Avisame si necesitas algo mas.",
      default: "Puedo ayudarte con:\n\n🔍 Buscar objetos perdidos\n📦 Reportar objetos encontrados\n✅ Proceso de reclamo\n📍 Ubicacion y horario de la oficina\n\nQue te gustaria saber?"
    }
  },

  // Toasts / Notifications
  toast: {
    success: "Exito!",
    error: "Error",
    claimSubmitted: "Reclamo enviado exitosamente",
    itemReported: "Objeto reportado exitosamente",
    requestSubmitted: "Solicitud enviada exitosamente",
    loginSuccess: "Sesion iniciada exitosamente",
    logoutSuccess: "Sesion cerrada exitosamente",
    profileUpdated: "Perfil actualizado exitosamente"
  }
};
