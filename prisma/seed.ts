import "dotenv/config";
import {
  PrismaClient,
  RoleName,
  DestinationStatus,
  CulturalSignal,
  CulturalNormKind,
  ImportanceLevel,
  VerificationStatus,
  EstablishmentType,
  PriceRange,
} from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

const SLRC_CULTURAL_GUIDES = [
  {
    slug: "sonora-no-cambia-horario",
    title: "Sonora no cambia de horario",
    summary:
      "Aquí no hay horario de verano: la hora local suele coincidir con Arizona, no con el resto de México.",
    description:
      "El estado de Sonora no aplica el cambio de horario de verano. Para un visitante eso importa al coordinar llamadas, citas o cruces: la hora de SLRC suele alinearse con San Luis, Arizona, y no con Ciudad de México u otros estados que sí cambian.",
    context:
      "Dato práctico de zona horaria (America/Hermosillo). Confirma siempre la hora del dispositivo al llegar.",
    whatToDo:
      "Configura el teléfono en hora automática o en zona Hermosillo. Al citarte con alguien de otro estado, aclara “hora de Sonora”.",
    whatToAvoid:
      "Asumir el mismo huso que CDMX o que “todo México cambia el reloj” en primavera/otoño.",
    signal: CulturalSignal.CONSIDER,
    normKind: CulturalNormKind.CUSTOM,
    importance: ImportanceLevel.HIGH,
    source: "Zona horaria oficial de Sonora (America/Hermosillo)",
  },
  {
    slug: "la-linea-es-vocabulario-local",
    title: "Aquí le dicen “la línea” a la frontera",
    summary:
      "Si oyes “voy a la línea” o “está del otro lado”, hablan del cruce hacia San Luis, Arizona.",
    description:
      "SLRC comparte día a día con San Luis (Arizona). En la conversación local, “la línea” es la garita/cruce, no una calle. “Del otro lado” suele significar Estados Unidos. Orientarte con ese vocabulario evita confusiones al pedir direcciones.",
    context:
      "Uso lingüístico cotidiano en ciudad fronteriza hermana de San Luis, AZ.",
    whatToDo:
      "Cuando pidas cómo llegar, pregunta por “la línea”, el centro o avenidas conocidas. Aclara si quieres quedarte en México o cruzar.",
    whatToAvoid:
      "Buscar literalmente una avenida llamada “Línea” o asumir que todo el mundo habla de un mapa turístico genérico.",
    signal: CulturalSignal.RECOMMENDED,
    normKind: CulturalNormKind.CUSTOM,
    importance: ImportanceLevel.MEDIUM,
    source: "Uso coloquial fronterizo Sonora–Arizona",
  },
  {
    slug: "dolares-cerca-de-la-linea",
    title: "Si pagan en dólares, pide el precio en pesos",
    summary:
      "Cerca de la frontera a veces aceptan USD, pero el tipo de cambio lo pone el negocio.",
    description:
      "En comercios cercanos al cruce es común ver precios o cobros en dólares. No siempre es a tu favor: el establecimiento fija el tipo de cambio. Preguntar “¿cuánto es en pesos?” evita sorpresas en la cuenta.",
    context:
      "Práctica comercial fronteriza. No es una tarifa oficial única.",
    whatToDo:
      "Lleva pesos para puestos y comercios chicos. Si pagan en dólares, confirma el total en pesos antes de aceptar.",
    whatToAvoid:
      "Entregar billetes grandes en USD sin preguntar cómo te devolverán el cambio (casi siempre en pesos).",
    signal: CulturalSignal.CONSIDER,
    normKind: CulturalNormKind.CUSTOM,
    importance: ImportanceLevel.HIGH,
    source: "Práctica comercial habitual en zona fronteriza norte de México",
  },
  {
    slug: "seguro-mexicano-si-manejas",
    title: "Si cruzas en auto, el seguro de EE.UU. no basta",
    summary:
      "Para manejar en México necesitas cobertura válida en territorio mexicano.",
    description:
      "Muchas pólizas de Estados Unidos no cubren (o cubren mal) accidentes del lado mexicano. En el cruce y en la ciudad es habitual que te pidan o necesites seguro mexicano vigente si conduces.",
    context:
      "Orientación práctica fronteriza. Requisitos exactos pueden variar; verifica con tu aseguradora y proveedores en garita.",
    whatToDo:
      "Contrata o renueva seguro mexicano antes o al cruzar. Guarda el comprobante en el auto y en el teléfono.",
    whatToAvoid:
      "Entrar manejando solo con seguro de Arizona/California y asumir que “es lo mismo”.",
    signal: CulturalSignal.AVOID,
    normKind: CulturalNormKind.LAW,
    importance: ImportanceLevel.CRITICAL,
    source: "Recomendación habitual para conductores que cruzan a México (verificar con aseguradora)",
  },
  {
    slug: "no-fotografiar-garita-ni-controles",
    title: "No fotografíes la garita ni controles",
    summary:
      "En zona de aduana y migración las fotos suelen generar problemas de inmediato.",
    description:
      "A diferencia de una plaza o un parque, las instalaciones de control fronterizo, casetas, oficiales y áreas restringidas son sensibles. Sacarle foto “por curiosidad” puede terminar en que te pidan borrar o te detengan para preguntar.",
    context:
      "Precaución específica de ciudad con cruce internacional activo.",
    whatToDo:
      "Guarda la cámara en la garita. Fotografía plazas, calles comerciales o paisajes lejos de instalaciones de control.",
    whatToAvoid:
      "Filmar filas de vehículos, personal uniformado, escáneres o el interior de módulos de migración/aduana.",
    signal: CulturalSignal.AVOID,
    normKind: CulturalNormKind.SAFETY,
    importance: ImportanceLevel.HIGH,
    source: "Buenas prácticas en cruces fronterizos (respeto a zonas de control)",
  },
  {
    slug: "whatsapp-es-el-canal-normal",
    title: "WhatsApp es el teléfono de casi todo",
    summary:
      "Negocios, hoteles y contactos locales suelen responder primero por WhatsApp, no por llamada ni SMS.",
    description:
      "Para un extranjero acostumbrado a iMessage o solo llamadas, aquí el hábito es otro: confirmar una mesa, pedir una dirección o avisar que llegas se hace por WhatsApp. Tener número mexicano o WhatsApp activo facilita mucho el día a día.",
    context:
      "Costumbre de comunicación muy extendida en México, incluida la frontera.",
    whatToDo:
      "Guarda números con formato internacional (+52) y escribe primero por WhatsApp con un saludo breve.",
    whatToAvoid:
      "Insistir solo en llamadas perdidas o SMS: a veces no las ven o no las contestan.",
    signal: CulturalSignal.RECOMMENDED,
    normKind: CulturalNormKind.CUSTOM,
    importance: ImportanceLevel.MEDIUM,
    source: "Uso cotidiano de mensajería en México",
  },
  {
    slug: "codigo-area-653",
    title: "El código de área local es 653",
    summary:
      "Los teléfonos de SLRC suelen ser +52 653…; marca completo si llamas desde el extranjero o desde EE.UU.",
    description:
      "Desde el otro lado de la línea es fácil marcar mal. Un número local de San Luis Río Colorado normalmente va con clave Lada 653. Desde fuera de México usa +52 653 y los dígitos locales.",
    context:
      "Dato de telefonía local. Confirma el número exacto con el negocio.",
    whatToDo:
      "Guarda contactos de emergencia, hotel y servicios con +52 653… y pruébalos al llegar.",
    whatToAvoid:
      "Marcar solo los últimos 7 dígitos desde EE.UU. o mezclar con el área 928 de San Luis, Arizona.",
    signal: CulturalSignal.CONSIDER,
    normKind: CulturalNormKind.CUSTOM,
    importance: ImportanceLevel.MEDIUM,
    source: "Clave Lada de San Luis Río Colorado (653)",
  },
  {
    slug: "productos-al-cruzar",
    title: "Revisa qué puedes llevar al cruzar",
    summary:
      "Fruta, carne, plantas o lácteos pueden detenerte en aduana agropecuaria de un lado u otro.",
    description:
      "En una ciudad hermana es tentador cruzar con mandado o souvenirs de comida. Las reglas agropecuarias de México y de EE.UU. restringen muchos productos frescos. Lo que “parece poca cosa” puede costarte decomiso o retraso en la garita.",
    context:
      "Reglas de inspección fronteriza; consulta listas oficiales vigentes antes de cruzar.",
    whatToDo:
      "Declara lo que lleves. Prefiere productos empacados/procesados permitidos y pregunta en el módulo si tienes duda.",
    whatToAvoid:
      "Esconder fruta, carne cruda, plantas o semillas “para que no se den cuenta”.",
    signal: CulturalSignal.AVOID,
    normKind: CulturalNormKind.LAW,
    importance: ImportanceLevel.HIGH,
    source: "Restricciones agropecuarias habituales en cruces México–EE.UU. (verificar listas oficiales)",
  },
  {
    slug: "agua-embotellada-y-hielo",
    title: "Pide agua embotellada (y ojo con el hielo)",
    summary:
      "Visitantes suelen evitar la llave; en negocios pregunta si el hielo es de agua purificada.",
    description:
      "No es un juicio sobre la ciudad: es la precaución que la mayoría de foráneos sigue en gran parte de México. En restaurantes y hoteles el agua de botella es la opción segura; si te ofrecen bebidas con hielo, puedes preguntar sin pena.",
    context:
      "Recomendación sanitaria práctica para visitantes, no una norma social rígida.",
    whatToDo:
      "Compra garrafones o botellas. En fondas pregunta “¿el hielo es purificado?” si te preocupa.",
    whatToAvoid:
      "Beber directo de la llave los primeros días si tu estómago no está acostumbrado.",
    signal: CulturalSignal.RECOMMENDED,
    normKind: CulturalNormKind.SAFETY,
    importance: ImportanceLevel.MEDIUM,
    source: "Precaución habitual de viajeros en destinos de México",
  },
] as const;

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Administrador NEMI";

  if (!email || !password) {
    console.log("SEED_ADMIN_* no configurado; se omite usuario admin.");
    return;
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: RoleName.ADMIN },
  });

  if (!adminRole) {
    throw new Error("Rol ADMIN no encontrado. Ejecuta el seed de roles primero.");
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
    create: {
      email,
      name,
      passwordHash,
      roleId: adminRole.id,
    },
  });

  console.log(`Usuario admin listo: ${email}`);
}

async function main() {
  const roles: { name: RoleName; description: string }[] = [
    {
      name: RoleName.TOURIST,
      description: "Visitante que consulta información, favoritos y reseñas.",
    },
    {
      name: RoleName.ESTABLISHMENT,
      description: "Rol reservado para dueños de establecimiento (sin panel en v1).",
    },
    {
      name: RoleName.ADMIN,
      description: "Rol reservado (sin panel de administración en v1).",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  await seedAdminUser();

  const destination = await prisma.destination.upsert({
    where: { slug: "san-luis-rio-colorado" },
    update: {
      name: "San Luis Río Colorado",
      region: "Sonora",
      country: "México",
      countryCode: "MX",
      status: DestinationStatus.PUBLISHED,
      timezone: "America/Hermosillo",
      description:
        "Ciudad fronteriza de Sonora. Usa NEMI para orientarte en costumbres, seguridad básica y servicios antes y durante tu visita.",
      coverImage: "/destinations/slrc/cover.jpg",
    },
    create: {
      slug: "san-luis-rio-colorado",
      name: "San Luis Río Colorado",
      region: "Sonora",
      country: "México",
      countryCode: "MX",
      status: DestinationStatus.PUBLISHED,
      timezone: "America/Hermosillo",
      description:
        "Ciudad fronteriza de Sonora. Usa NEMI para orientarte en costumbres, seguridad básica y servicios antes y durante tu visita.",
      // Plaza Benito Juárez — CC BY-SA 3.0 (Mario Armando Alvelaiz Arispuro / Wikimedia)
      coverImage: "/destinations/slrc/cover.jpg",
    },
  });

  const now = new Date();

  for (const guide of SLRC_CULTURAL_GUIDES) {
    await prisma.culturalGuide.upsert({
      where: {
        destinationId_slug: {
          destinationId: destination.id,
          slug: guide.slug,
        },
      },
      update: {
        title: guide.title,
        summary: guide.summary,
        description: guide.description,
        context: guide.context,
        whatToDo: guide.whatToDo,
        whatToAvoid: guide.whatToAvoid,
        signal: guide.signal,
        normKind: guide.normKind,
        importance: guide.importance,
        source: guide.source,
        isPublished: true,
        publishedAt: now,
        // Pendiente a propósito: contenido editorial inicial, no “oficial”.
        verificationStatus: VerificationStatus.PENDING,
      },
      create: {
        destinationId: destination.id,
        title: guide.title,
        slug: guide.slug,
        summary: guide.summary,
        description: guide.description,
        context: guide.context,
        whatToDo: guide.whatToDo,
        whatToAvoid: guide.whatToAvoid,
        signal: guide.signal,
        normKind: guide.normKind,
        importance: guide.importance,
        source: guide.source,
        isPublished: true,
        publishedAt: now,
        verificationStatus: VerificationStatus.PENDING,
      },
    });
  }

  await prisma.culturalGuide.deleteMany({
    where: {
      destinationId: destination.id,
      slug: { notIn: SLRC_CULTURAL_GUIDES.map((g) => g.slug) },
    },
  });

  const restaurantCategories = [
    {
      slug: "mexicana",
      name: "Mexicana",
      description: "Cocina mexicana y antojitos",
    },
    {
      slug: "mariscos",
      name: "Mariscos",
      description: "Pescados y mariscos",
    },
    {
      slug: "cafe-y-postres",
      name: "Café y postres",
      description: "Cafeterías y dulces",
    },
    {
      slug: "comida-rapida",
      name: "Comida rápida",
      description: "Opciones rápidas y casuales",
    },
  ] as const;

  const categoryIds: Record<string, string> = {};

  for (const category of restaurantCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        slug: category.slug,
        isGlobal: true,
        type: EstablishmentType.RESTAURANT,
      },
    });

    const saved = existing
      ? await prisma.category.update({
          where: { id: existing.id },
          data: {
            name: category.name,
            description: category.description,
            type: EstablishmentType.RESTAURANT,
            isGlobal: true,
          },
        })
      : await prisma.category.create({
          data: {
            slug: category.slug,
            name: category.name,
            description: category.description,
            type: EstablishmentType.RESTAURANT,
            isGlobal: true,
          },
        });

    categoryIds[category.slug] = saved.id;
  }

  const realRestaurants = [
    {
      slug: "el-herradero",
      name: "Restaurant El Herradero",
      description:
        "Restaurante de cocina mexicana / sonorense, conocido por carnes a la parrilla. Datos públicos agregados para orientación; confirma horarios y menú al contactar.",
      address: "Av. Álvaro Obregón, Comercial, San Luis Río Colorado, Sonora",
      phone: "+52 653 534 4060",
      email: null as string | null,
      website: null as string | null,
      priceRange: PriceRange.MODERATE,
      latitude: 32.4792622,
      longitude: -114.7682284,
      categorySlugs: ["mexicana"],
      acceptsReservations: true,
      sourceNote:
        "OpenStreetMap node/2420167906 (El Herradero). Teléfono de listados públicos. Contrastado 2026-08-15.",
      verificationStatus: VerificationStatus.PENDING,
    },
    {
      slug: "el-parianchi",
      name: "Restaurant El Parianchi",
      description:
        "Cocina mexicana familiar. Popular en listados locales. Verifica disponibilidad y horarios directamente con el negocio.",
      address:
        "Avenida Internacional, Comercial, San Luis Río Colorado, Sonora",
      phone: null,
      email: null,
      website: null,
      priceRange: PriceRange.MODERATE,
      latitude: 32.4810759,
      longitude: -114.7698716,
      categorySlugs: ["mexicana"],
      acceptsReservations: false,
      sourceNote:
        "OpenStreetMap node/2462057009 (Restaurant El Parianchi). Contrastado 2026-08-15.",
      verificationStatus: VerificationStatus.PENDING,
    },
    {
      slug: "pez-gallo",
      name: "Pez Gallo Sushi & Cevichería",
      description:
        "Sushi y mariscos. Referenciado en listados públicos de SLRC. Contacta al lugar para horarios y reservar mesa.",
      address:
        "Av. Álvaro Obregón 1111, Comercial, San Luis Río Colorado, Sonora 83449",
      phone: null,
      email: null,
      website: null,
      priceRange: PriceRange.EXPENSIVE,
      latitude: 32.4801094,
      longitude: -114.7691274,
      categorySlugs: ["mariscos", "mexicana"],
      acceptsReservations: false,
      sourceNote:
        "OpenStreetMap node/12070398161 (Pez Gallo). Contrastado 2026-08-15.",
      verificationStatus: VerificationStatus.PENDING,
    },
    {
      slug: "nana-tona",
      name: "Nana Toña Restaurante",
      description:
        "Cocina mexicana cotidiana (menudo, chilaquiles, etc.). Confirma menú y horarios al contactar.",
      address: "Av. 16 de Septiembre y Calle Segunda, San Luis Río Colorado, Sonora",
      phone: "+52 653 534 0099",
      email: null,
      website: null,
      priceRange: PriceRange.BUDGET,
      latitude: 32.4782,
      longitude: -114.7765,
      categorySlugs: ["mexicana"],
      acceptsReservations: true,
      sourceNote:
        "Teléfono en listados públicos; pin aproximado al cruce 16 de Septiembre y 2da. PENDING de pin OSM.",
      verificationStatus: VerificationStatus.PENDING,
    },
    {
      slug: "las-cazuelas",
      name: "Las Cazuelas Restaurante",
      description:
        "Restaurante mexicano sobre Av. Obregón. Confirma ubicación exacta y horarios al llamar o en Google Maps.",
      address:
        "Av. Álvaro Obregón entre calles 6 y 9, Comercial, San Luis Río Colorado, Sonora",
      phone: "+52 653 534 5662",
      email: null,
      website: null,
      priceRange: PriceRange.MODERATE,
      latitude: 32.4795,
      longitude: -114.7722,
      categorySlugs: ["mexicana"],
      acceptsReservations: true,
      sourceNote:
        "Directorios locales; pin aproximado en trama Obregón (OSM). PENDING de pin exacto.",
      verificationStatus: VerificationStatus.PENDING,
    },
  ] as const;

  for (const restaurant of realRestaurants) {
    const existing = await prisma.establishment.findUnique({
      where: {
        destinationId_slug: {
          destinationId: destination.id,
          slug: restaurant.slug,
        },
      },
      select: { id: true },
    });

    const payload = {
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website,
      priceRange: restaurant.priceRange,
      averageRating: 0,
      reviewCount: 0,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      acceptsReservations: restaurant.acceptsReservations,
      isActive: true,
      type: EstablishmentType.RESTAURANT,
      verificationStatus: restaurant.verificationStatus as VerificationStatus,
      lastVerifiedAt:
        (restaurant.verificationStatus as VerificationStatus) ===
        VerificationStatus.VERIFIED
          ? new Date()
          : null,
      sourceNote: restaurant.sourceNote,
    };

    if (existing) {
      await prisma.establishmentCategory.deleteMany({
        where: { establishmentId: existing.id },
      });
      await prisma.establishment.update({
        where: { id: existing.id },
        data: {
          ...payload,
          categories: {
            create: restaurant.categorySlugs.map((slug) => ({
              categoryId: categoryIds[slug],
            })),
          },
        },
      });
    } else {
      await prisma.establishment.create({
        data: {
          destinationId: destination.id,
          slug: restaurant.slug,
          ...payload,
          categories: {
            create: restaurant.categorySlugs.map((slug) => ({
              categoryId: categoryIds[slug],
            })),
          },
        },
      });
    }
  }

  const lodgingCategories = [
    {
      slug: "hotel",
      name: "Hotel",
      description: "Hoteles",
    },
    {
      slug: "motel",
      name: "Motel",
      description: "Moteles",
    },
    {
      slug: "otro-alojamiento",
      name: "Otro alojamiento",
      description: "Otros tipos de hospedaje",
    },
  ] as const;

  for (const category of lodgingCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        slug: category.slug,
        isGlobal: true,
        type: EstablishmentType.LODGING,
      },
    });

    const saved = existing
      ? await prisma.category.update({
          where: { id: existing.id },
          data: {
            name: category.name,
            description: category.description,
            type: EstablishmentType.LODGING,
            isGlobal: true,
          },
        })
      : await prisma.category.create({
          data: {
            slug: category.slug,
            name: category.name,
            description: category.description,
            type: EstablishmentType.LODGING,
            isGlobal: true,
          },
        });

    categoryIds[category.slug] = saved.id;
  }

  const realLodgings = [
    {
      slug: "hotel-santa-lucia",
      name: "Hotel Santa Lucía",
      description:
        "Hotel en zona céntrica. Habitaciones, estacionamiento y recepción 24/7 según su sitio oficial.",
      address: "Av. Juárez 5 y 6, San Luis Río Colorado, Sonora",
      phone: "+52 653 596 0999",
      email: "hotelsantaluciaslrc@gmail.com",
      website: "https://hotelsantalucia.mx/",
      priceRange: PriceRange.MODERATE,
      latitude: 32.4796,
      longitude: -114.7782,
      categorySlugs: ["hotel"],
      acceptsReservations: true,
      sourceNote:
        "Sitio oficial hotelsantalucia.mx; pin aproximado Av. Juárez cerca Plaza Benito Juárez (OSM). PENDING de pin exacto.",
      verificationStatus: VerificationStatus.VERIFIED,
    },
    {
      slug: "hotel-san-angel-spa",
      name: "Hotel San Ángel & Spa",
      description:
        "Hotel con spa. Ubicación sobre Av. Obregón. Confirma tarifas y disponibilidad por teléfono o sitio.",
      address:
        "Av. Álvaro Obregón 1050, entre calles 10 y 11, Comercial, 83449 San Luis Río Colorado, Son.",
      phone: "+52 653 534 0101",
      email: null as string | null,
      website: "https://hotelsanangelspa.com/",
      priceRange: PriceRange.EXPENSIVE,
      latitude: 32.4799,
      longitude: -114.7704,
      categorySlugs: ["hotel"],
      acceptsReservations: true,
      sourceNote:
        "Web/listados del hotel; pin aproximado cluster Obregón (OSM cerca Pez Gallo/653). PENDING de pin exacto.",
      verificationStatus: VerificationStatus.PENDING,
    },
    {
      slug: "hotel-san-antonio",
      name: "Hotel San Antonio",
      description:
        "Hotel sobre Av. Obregón, cerca de comercios y acceso fronterizo. Contacto según sitio del hotel.",
      address:
        "Ave. Obregón entre 2da. y 3ra., Colonia Comercial, San Luis Río Colorado, Sonora",
      phone: "+52 653 518 3781",
      email: "hotelsanantoniorc@hotmail.com",
      website: "https://hotelsanantoniosl.com/",
      priceRange: PriceRange.MODERATE,
      latitude: 32.4830629,
      longitude: -114.7808605,
      categorySlugs: ["hotel"],
      acceptsReservations: true,
      sourceNote:
        "OpenStreetMap node/2463981313 + hotelsanantoniosl.com. Contrastado 2026-08-15.",
      verificationStatus: VerificationStatus.VERIFIED,
    },
    {
      slug: "653-hotel",
      name: "653 Hotel",
      description:
        "Hotel cerca de la frontera; WiFi, restaurante y estacionamiento según su sitio.",
      address:
        "Av. Álvaro Obregón 1111, Comercial, San Luis Río Colorado, Sonora 83449",
      phone: "+52 653 160 1385",
      email: null,
      website: "https://www.653hotel.com/es/index.html",
      priceRange: PriceRange.MODERATE,
      latitude: 32.4801914,
      longitude: -114.7693027,
      categorySlugs: ["hotel"],
      acceptsReservations: true,
      sourceNote:
        "OpenStreetMap node/12070411292 (653 Hotel). Contrastado 2026-08-15.",
      verificationStatus: VerificationStatus.VERIFIED,
    },
    {
      slug: "hotel-panda-inn",
      name: "Hotel Panda Inn",
      description:
        "Hotel restaurante de cuatro estrellas sobre Av. Obregón. Consulta tarifas y habitaciones en su sitio o por teléfono.",
      address:
        "Avenida Obregón 1408, Residencias, San Luis Río Colorado, Sonora 83448",
      phone: "+52 653 535 1997",
      email: null as string | null,
      website: "https://www.hotelpandainn.mx/",
      priceRange: PriceRange.EXPENSIVE,
      latitude: 32.4772,
      longitude: -114.7618,
      categorySlugs: ["hotel"],
      acceptsReservations: true,
      sourceNote:
        "hotelpandainn.mx; pin aproximado Obregón 1408 / Residencias. PENDING de pin OSM exacto.",
      verificationStatus: VerificationStatus.VERIFIED,
    },
  ] as const;

  for (const lodging of realLodgings) {
    const existing = await prisma.establishment.findUnique({
      where: {
        destinationId_slug: {
          destinationId: destination.id,
          slug: lodging.slug,
        },
      },
      select: { id: true },
    });

    const payload = {
      name: lodging.name,
      description: lodging.description,
      address: lodging.address,
      phone: lodging.phone,
      email: lodging.email,
      website: lodging.website,
      priceRange: lodging.priceRange,
      averageRating: 0,
      reviewCount: 0,
      latitude: lodging.latitude,
      longitude: lodging.longitude,
      acceptsReservations: lodging.acceptsReservations,
      isActive: true,
      type: EstablishmentType.LODGING,
      verificationStatus: lodging.verificationStatus as VerificationStatus,
      lastVerifiedAt:
        (lodging.verificationStatus as VerificationStatus) ===
        VerificationStatus.VERIFIED
          ? new Date()
          : null,
      sourceNote: lodging.sourceNote,
    };

    if (existing) {
      await prisma.establishmentCategory.deleteMany({
        where: { establishmentId: existing.id },
      });
      await prisma.establishment.update({
        where: { id: existing.id },
        data: {
          ...payload,
          categories: {
            create: lodging.categorySlugs.map((slug) => ({
              categoryId: categoryIds[slug],
            })),
          },
        },
      });
    } else {
      await prisma.establishment.create({
        data: {
          destinationId: destination.id,
          slug: lodging.slug,
          ...payload,
          categories: {
            create: lodging.categorySlugs.map((slug) => ({
              categoryId: categoryIds[slug],
            })),
          },
        },
      });
    }
  }

  // Sin farmacias/clínicas inventadas: se desactivan demos al final del seed.

  const realServices = [
    {
      slug: "farmacias-guadalajara-5-de-mayo",
      name: "Farmacias Guadalajara · Av. 5 de Mayo",
      type: EstablishmentType.PHARMACY,
      description:
        "Sucursal de cadena. Útil para medicamentos e insumos básicos. Confirma horario en el local o Google Maps.",
      address: "Av. 5 de Mayo #701, Comercial, San Luis Río Colorado, Sonora 83449",
      phone: "+52 653 517 5149",
      website: "https://www.farmaciasguadalajara.com/",
      latitude: 32.4723529,
      longitude: -114.7782174,
      sourceNote:
        "OpenStreetMap node/9068783983 (Farmacia Guadalajara · 5 de Mayo). Contrastado 2026-08-15.",
    },
    {
      slug: "farmacias-guadalajara-obregon-22",
      name: "Farmacias Guadalajara · Obregón y Calle 22",
      type: EstablishmentType.PHARMACY,
      description:
        "Sucursal sobre Av. Álvaro Obregón. Verifica horario y servicios (foto, etc.) al llegar o por teléfono.",
      address:
        "Av. Álvaro Obregón No. 2110 esq. Calle 22, San Luis Río Colorado, Sonora",
      phone: "+52 653 517 6266",
      website: "https://www.farmaciasguadalajara.com/",
      latitude: 32.4718,
      longitude: -114.7555,
      sourceNote:
        "Listados de sucursal; pin aproximado Obregón / Calle 22. PENDING de pin OSM.",
    },
    {
      slug: "imss-hgz-12",
      name: "IMSS · Hospital General de Zona No. 12",
      type: EstablishmentType.HOSPITAL,
      description:
        "Hospital General de Zona del IMSS en SLRC. Atención a derechohabientes; en emergencia vital marca 911. Confirma horarios y requisitos en IMSS digital o en la unidad.",
      address:
        "Av. Chihuahua y Benjamín Hill s/n, Col. Ruiz Cortines, San Luis Río Colorado, Sonora 83439",
      phone: "+52 653 534 7001",
      website: "https://www.imss.gob.mx/",
      latitude: 32.4678099,
      longitude: -114.7976292,
      sourceNote:
        "Dirección oficial IMSS (Chihuahua y Benjamín Hill, Col. Ruiz Cortines). OpenStreetMap way/233766508. Contrastado 2026-08-15.",
    },
    {
      slug: "hospital-general-slrc",
      name: "Hospital General San Luis Río Colorado",
      type: EstablishmentType.HOSPITAL,
      description:
        "Hospital general municipal/estatal referenciado en directorios de salud. Verifica servicios de urgencias y horarios al llegar o por teléfono.",
      address:
        "Callejón Guadalupe Victoria, Comercial, San Luis Río Colorado, Sonora",
      phone: "+52 653 534 1016",
      website: null,
      latitude: 32.4698388,
      longitude: -114.7782814,
      sourceNote:
        "OpenStreetMap way/789066980. Contrastado 2026-08-15.",
    },
    {
      slug: "clinica-hospital-issste-slrc",
      name: "Clínica Hospital ISSSTE · SLRC",
      type: EstablishmentType.CLINIC,
      description:
        "Unidad ISSSTE de segundo nivel. Atención a derechohabientes del Estado. Confirma trámites y horarios en ISSSTE o en la clínica.",
      address:
        "Av. Libertad y Calle 3a s/n, Col. Sonora / Burócrata, San Luis Río Colorado, Sonora 83440",
      phone: null,
      website: "https://www.gob.mx/issste",
      latitude: 32.4771,
      longitude: -114.7772,
      sourceNote:
        "Directorio ISSSTE (Libertad y Calle 3a); pin aproximado. PENDING de pin OSM exacto.",
    },
    {
      slug: "centro-medico-del-noroeste",
      name: "Centro Médico del Noroeste",
      type: EstablishmentType.CLINIC,
      description:
        "Centro médico privado con especialidades y servicios hospitalarios básicos según directorios. Confirma urgencias y citas por teléfono.",
      address:
        "Callejón Francisco Eusebio Kino, Residencias, San Luis Río Colorado, Sonora",
      phone: null,
      website: null,
      latitude: 32.4745195,
      longitude: -114.7693521,
      sourceNote:
        "OpenStreetMap way/240308487. Contrastado 2026-08-15.",
    },
    {
      slug: "pemex-benjamin-flores-17",
      name: "Pemex · Calle 17",
      type: EstablishmentType.GAS_STATION,
      description:
        "Estación de servicio Pemex. Útil para cargar combustible y, en muchas, pagar servicios. Confirma horarios y métodos de pago en el sitio.",
      address: "Calle 17, Federal, San Luis Río Colorado, Sonora",
      phone: null,
      website: "https://www.pemex.com/",
      latitude: 32.4436843,
      longitude: -114.7755384,
      sourceNote:
        "OpenStreetMap way/300318702 (Pemex · Calle 17). Contrastado 2026-08-15.",
    },
    {
      slug: "bp-nuevo-leon-9",
      name: "BP · Av. Nuevo León y Calle 9",
      type: EstablishmentType.GAS_STATION,
      description:
        "Estación BP referenciada en listados de precios de combustible de SLRC. Confirma servicios (tienda, aire, etc.) al llegar.",
      address: "Av. Nuevo León y Calle 9, San Luis Río Colorado, Sonora",
      phone: null,
      website: "https://www.bp.com/es_mx/mexico/home.html",
      latitude: 32.4525,
      longitude: -114.7865,
      sourceNote:
        "Listados de precios; pin aproximado Nuevo León y Calle 9. PENDING de pin OSM.",
    },
    {
      slug: "pemex-calle-4",
      name: "Pemex · Calle 4",
      type: EstablishmentType.GAS_STATION,
      description:
        "Estación Pemex citada en directorios locales de SLRC. Verifica ubicación exacta en Maps al navegar.",
      address: "Calle 4ta., San Luis Río Colorado, Sonora",
      phone: "+52 653 515 7090",
      website: "https://www.pemex.com/",
      latitude: 32.4755,
      longitude: -114.7798,
      sourceNote:
        "Dirección parcial en directorios; pin aproximado centro. PENDING — verificar.",
    },
    {
      slug: "oxxo-obregon-1",
      name: "OXXO · Av. Álvaro Obregón",
      type: EstablishmentType.OTHER_SERVICE,
      description:
        "Tienda de conveniencia. Útil para efectivo, snacks y recargas. Horario típico 24 h en muchas sucursales — confirma en el local.",
      address:
        "Av. Álvaro Obregón, Cuauhtémoc, San Luis Río Colorado, Sonora",
      phone: "+52 653 534 5315",
      website: "https://www.oxxo.com/",
      latitude: 32.4842294,
      longitude: -114.7831829,
      sourceNote:
        "OpenStreetMap node/2532848268 (Oxxo · Obregón). Contrastado 2026-08-15.",
    },
    {
      slug: "oxxo-libertad",
      name: "OXXO · Av. Libertad",
      type: EstablishmentType.OTHER_SERVICE,
      description:
        "Tienda de conveniencia sobre Av. Libertad. Alternativa cercana al centro para compras rápidas y pagos.",
      address: "Av. Libertad, zona centro, San Luis Río Colorado, Sonora",
      phone: null,
      website: "https://www.oxxo.com/",
      latitude: 32.4768,
      longitude: -114.7755,
      sourceNote:
        "Cadena presente en SLRC; pin aproximado Libertad centro. PENDING de pin exacto.",
    },
    {
      slug: "bodega-aurrera-slrc",
      name: "Bodega Aurrera · Av. Nuevo León",
      type: EstablishmentType.OTHER_SERVICE,
      description:
        "Supermercado de cadena. Útil para despensa, efectivo y artículos básicos. Confirma horario en la app Walmart México o en el local.",
      address: "Av. Nuevo León, Aeropuerto, San Luis Río Colorado, Sonora",
      phone: null,
      website: "https://www.bodegaaurrera.com.mx/",
      latitude: 32.4512177,
      longitude: -114.804001,
      sourceNote:
        "OpenStreetMap node/13302921209 (Bodega Aurrera · Nuevo León). Contrastado 2026-08-15.",
    },
    {
      slug: "circle-k-nuevo-leon",
      name: "Circle K · Av. Nuevo León",
      type: EstablishmentType.OTHER_SERVICE,
      description:
        "Tienda de conveniencia (estilo 7-Eleven). Snacks, bebidas y pagos rápidos. Confirma horario 24 h en el local.",
      address: "Av. Nuevo León, San Luis Río Colorado, Sonora",
      phone: null,
      website: "https://www.circlek.com.mx/",
      latitude: 32.4538,
      longitude: -114.7902,
      sourceNote:
        "Pin aproximado Av. Nuevo León. PENDING de verificación de sucursal en Maps.",
    },
    {
      slug: "bbva-libertad-7",
      name: "BBVA · Av. Libertad y Calle 7",
      type: EstablishmentType.BANK,
      description:
        "Sucursal / cajero BBVA referenciada en directorios. Confirma horario y servicios en la app BBVA o en sucursal.",
      address: "Av. Libertad y Calle 7, San Luis Río Colorado, Sonora",
      phone: null,
      website: "https://www.bbva.mx/",
      latitude: 32.4764,
      longitude: -114.7748,
      sourceNote:
        "Listados BBVA; pin aproximado Libertad y Calle 7. PENDING de localizador oficial.",
    },
  ] as const;

  for (const service of realServices) {
    await prisma.establishment.upsert({
      where: {
        destinationId_slug: {
          destinationId: destination.id,
          slug: service.slug,
        },
      },
      update: {
        name: service.name,
        type: service.type,
        description: service.description,
        address: service.address,
        phone: service.phone,
        website: service.website,
        latitude: service.latitude,
        longitude: service.longitude,
        acceptsReservations: false,
        isActive: true,
        averageRating: 0,
        reviewCount: 0,
        verificationStatus: VerificationStatus.PENDING,
        sourceNote: service.sourceNote,
      },
      create: {
        destinationId: destination.id,
        slug: service.slug,
        name: service.name,
        type: service.type,
        description: service.description,
        address: service.address,
        phone: service.phone,
        website: service.website,
        latitude: service.latitude,
        longitude: service.longitude,
        acceptsReservations: false,
        isActive: true,
        averageRating: 0,
        reviewCount: 0,
        verificationStatus: VerificationStatus.PENDING,
        sourceNote: service.sourceNote,
      },
    });
  }

  const realEmergencies = [
    {
      name: "Emergencias 911",
      type: EstablishmentType.OTHER_SERVICE,
      phone: "911",
      address: null as string | null,
      notes: "Número nacional de emergencias en México.",
      isOfficial: true,
      sourceNote:
        "Número público oficial de emergencias (México). Contrastado como dato estándar 2026-08-15.",
    },
    {
      name: "Cruz Roja Mexicana · Delegación SLRC",
      type: EstablishmentType.HOSPITAL,
      phone: "+52 653 534 1444",
      address: "Av. Libertad y Calle Segunda, San Luis Río Colorado, Sonora",
      notes:
        "También se ha publicado el 653 129 3959 en prensa local para informes. En emergencia vital marca 911.",
      isOfficial: true,
      sourceNote:
        "Teléfono citado en cobertura local (p. ej. El Imparcial) y directorios; verificar ante la delegación. PENDING en NEMI.",
    },
  ] as const;

  for (const emergency of realEmergencies) {
    const existing = await prisma.emergencyService.findFirst({
      where: {
        destinationId: destination.id,
        OR: [{ phone: emergency.phone }, { name: emergency.name }],
      },
    });

    const payload = {
      name: emergency.name,
      type: emergency.type,
      phone: emergency.phone,
      address: emergency.address,
      notes: emergency.notes,
      isOfficial: emergency.isOfficial,
      sourceNote: emergency.sourceNote,
      isActive: true,
    };

    if (existing) {
      await prisma.emergencyService.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      await prisma.emergencyService.create({
        data: {
          destinationId: destination.id,
          ...payload,
        },
      });
    }
  }

  await prisma.emergencyService.updateMany({
    where: {
      destinationId: destination.id,
      name: { contains: "[Demo]" },
    },
    data: { isActive: false },
  });

  const tourismCategories = [
    { slug: "plaza-parque", name: "Plazas y parques" },
    { slug: "cultura-local", name: "Cultura local" },
    { slug: "mirador", name: "Miradores" },
  ] as const;

  for (const category of tourismCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        slug: category.slug,
        isGlobal: true,
        type: EstablishmentType.ATTRACTION,
      },
    });

    const saved = existing
      ? await prisma.category.update({
          where: { id: existing.id },
          data: {
            name: category.name,
            type: EstablishmentType.ATTRACTION,
            isGlobal: true,
          },
        })
      : await prisma.category.create({
          data: {
            slug: category.slug,
            name: category.name,
            type: EstablishmentType.ATTRACTION,
            isGlobal: true,
          },
        });

    categoryIds[category.slug] = saved.id;
  }

  const realAttractions = [
    {
      slug: "bosque-de-la-ciudad",
      name: "Bosque de la Ciudad",
      description:
        "Área verde urbana con juegos, canchas y el estadio de béisbol en su perímetro. Espacio público de esparcimiento familiar.",
      address: "Avenida Nuevo León y Calle 7, Colonia del Bosque, 83490",
      phone: null as string | null,
      website: "https://visitsanluisrc.mx/que-hacer/bosque-de-la-ciudad/" as
        | string
        | null,
      latitude: 32.4452716,
      longitude: -114.78945,
      categorySlugs: ["plaza-parque"],
      sourceNote:
        "OpenStreetMap way/233564759 (Bosque de la Ciudad). Contrastado 2026-08-15.",
      verificationStatus: VerificationStatus.VERIFIED,
    },
    {
      slug: "museo-regional",
      name: "Museo Regional de San Luis Río Colorado",
      description:
        "Museo dentro del Bosque de la Ciudad: historia regional, cultura cucapá y salas temporales. Entrada libre según ficha cultural federal; sábados suele requerir cita.",
      address: "Av. Nuevo León y Calle 8, Col. Del Bosque, San Luis Río Colorado, Sonora",
      phone: "+52 653 534 3985",
      website: "https://visitsanluisrc.mx/que-hacer/museo-regional/",
      latitude: 32.4478,
      longitude: -114.7885,
      categorySlugs: ["cultura-local", "plaza-parque"],
      sourceNote:
        "SIC Cultura / Visit SLRC; pin aproximado junto a Bosque de la Ciudad (OSM). PENDING de pin exacto del museo.",
      verificationStatus: VerificationStatus.VERIFIED,
    },
    {
      slug: "plaza-benito-juarez",
      name: "Plaza / Parque Benito Juárez",
      description:
        "Espacio cívico y de convivencia en el corazón de la ciudad. Punto de referencia local para pasear y eventos comunitarios.",
      address: "Parque Benito Juárez, centro de San Luis Río Colorado, Sonora",
      phone: null,
      website: null,
      latitude: 32.4800748,
      longitude: -114.7804175,
      categorySlugs: ["plaza-parque"],
      sourceNote:
        "OpenStreetMap way/233567470 (Plaza Benito Juárez). Contrastado 2026-08-15.",
      verificationStatus: VerificationStatus.PENDING,
    },
  ] as const;

  for (const place of realAttractions) {
    const existing = await prisma.establishment.findUnique({
      where: {
        destinationId_slug: {
          destinationId: destination.id,
          slug: place.slug,
        },
      },
      select: { id: true },
    });

    const payload = {
      name: place.name,
      description: place.description,
      address: place.address,
      phone: place.phone,
      website: place.website,
      latitude: place.latitude,
      longitude: place.longitude,
      averageRating: 0,
      reviewCount: 0,
      acceptsReservations: false,
      isActive: true,
      type: EstablishmentType.ATTRACTION,
      verificationStatus: place.verificationStatus as VerificationStatus,
      lastVerifiedAt:
        (place.verificationStatus as VerificationStatus) ===
        VerificationStatus.VERIFIED
          ? new Date()
          : null,
      sourceNote: place.sourceNote,
    };

    if (existing) {
      await prisma.establishmentCategory.deleteMany({
        where: { establishmentId: existing.id },
      });
      await prisma.establishment.update({
        where: { id: existing.id },
        data: {
          ...payload,
          categories: {
            create: place.categorySlugs.map((slug) => ({
              categoryId: categoryIds[slug],
            })),
          },
        },
      });
    } else {
      await prisma.establishment.create({
        data: {
          destinationId: destination.id,
          slug: place.slug,
          ...payload,
          categories: {
            create: place.categorySlugs.map((slug) => ({
              categoryId: categoryIds[slug],
            })),
          },
        },
      });
    }
  }

  await prisma.establishment.updateMany({
    where: {
      destinationId: destination.id,
      OR: [
        { slug: { startsWith: "demo-" } },
        { name: { contains: "[Demo]" } },
      ],
    },
    data: { isActive: false },
  });

  // También actualizar lat/lng del destino en seed para mejor centrado
  await prisma.destination.update({
    where: { id: destination.id },
    data: {
      latitude: 32.4769,
      longitude: -114.7654,
    },
  });

  console.log(
    `Seed completado: roles, SLRC, guías culturales y fichas reales (PENDING).`,
  );
}

main()
  .catch((error) => {
    console.error("Error en seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
