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
      activeUsers: "Usuarios Activos"
    },
    howItWorks: {
      title: "Como Funciona",
      step1Title: "Reportar o Buscar",
      step1Desc: "Encontraste algo? Reportalo. Perdiste algo? Busca en nuestra base de datos o pre-registra tu objeto.",
      step2Title: "Emparejamiento",
      step2Desc: "Nuestro sistema empareja automaticamente objetos encontrados con solicitudes de objetos perdidos y te notifica.",
      step3Title: "Reclamar y Recoger",
      step3Desc: "Verifica la propiedad, obtiene aprobacion y recoge tu objeto en la oficina principal."
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
    viewDetails: "Ver Detalles"
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
    email: "Correo Electronico",
    password: "Contrasena",
    confirmPassword: "Confirmar Contrasena",
    firstName: "Nombre",
    lastName: "Apellido",
    gradeLevel: "Grado",
    forgotPassword: "Olvidaste tu contrasena?",
    noAccount: "No tienes una cuenta?",
    hasAccount: "Ya tienes una cuenta?",
    adminLogin: "Inicio de Admin",
    ownerLogin: "Inicio de Propietario",
    adminCode: "Codigo de Admin de 6 Digitos"
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
    fr: "Frances"
  }
};
