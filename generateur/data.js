/* Contenus du site Carter & Martin (FR / EN).
   Modifiez ce fichier puis lancez : node generateur/build.js */

const STUDIO = {
  city: "Normandie",
  email: "studio@carter-martin.fr",
  phone: { fr: "06 29 69 06 22", en: "+33 6 29 69 06 22" },
  phoneHref: "+33629690622"
};

const SERIES = {
  title: "Let there be more light",
  year: "2026",
  desc: {
    fr: "Dix scènes à la bougie. Une flamme au centre du cadre — cierge, lanterne, torche — et tout ce qu'elle laisse deviner autour d'elle : un visage, une table de jeu, une route de campagne, un crâne. Première série du duo, présentée en septembre 2026.",
    en: "Ten candlelit scenes. A flame at the centre of the frame — candle, lantern, torch — and everything it lets us glimpse around it: a face, a card table, a country road, a skull. The duo's first series, shown in September 2026."
  },
  works: [
    { id: "penitente", img: "images/penitente.webp", w: 1244, h: 1500, title: { fr: "La Pénitente", en: "The Penitent" }, place: { fr: "Atelier, Normandie", en: "Studio, Normandy" },
      story: { fr: "Une jeune femme de profil, une chandelle posée sur un prie-Dieu de bois. La scène tient sur cette seule flamme et sur la patine du mur derrière elle.", en: "A young woman in profile, a candle set on a wooden prie-dieu. The scene rests on that single flame and on the patina of the wall behind her." } },
    { id: "tricheur", img: "images/joueur.webp", w: 1200, h: 1500, title: { fr: "Le Tricheur", en: "The Cheat" }, place: { fr: "Cave voûtée, Normandie", en: "Vaulted cellar, Normandy" },
      story: { fr: "Deux chandelles, un whisky, quatre as et un revolver posé au bord du tapis. Un hommage direct aux tricheurs de La Tour, monté dans une cave normande.", en: "Two candles, a whisky, four aces and a revolver at the edge of the baize. A direct homage to La Tour's card sharps, staged in a Norman cellar." } },
    { id: "vanite", img: "images/vanite.webp", w: 1250, h: 1500, title: { fr: "Vanité du Président", en: "The President's Vanity" }, place: { fr: "Atelier, Normandie", en: "Studio, Normandy" },
      story: { fr: "Sept flammes sur un chandelier de laiton, un cigare, un crâne, des fruits déjà gâtés. Une nuit de construction, trois heures de prises, la fumée réglée au ventilateur.", en: "Seven flames on a brass candelabrum, a cigar, a skull, fruit already spoiling. One night of building, three hours of shooting, the smoke set with a fan." } },
    { id: "miroir", img: "images/miroir.webp", w: 1254, h: 1500, title: { fr: "Le Miroir", en: "The Mirror" }, place: { fr: "Atelier, Normandie", en: "Studio, Normandy" },
      story: { fr: "La bougie n'apparaît que dans le miroir : c'est son reflet qui éclaire le sablier, les hortensias séchés et la soie rouge.", en: "The candle appears only in the mirror: it is its reflection that lights the hourglass, the dried hydrangeas and the red silk." } },
    { id: "ronsard", img: "images/ronsard.webp", w: 1124, h: 1500, title: { fr: "Ronsard", en: "Ronsard" }, place: { fr: "Bibliothèque privée, Normandie", en: "Private library, Normandy" },
      story: { fr: "Une lettre relue tard, des roses au bout de leur floraison. Le titre vient du sonnet que le modèle avait glissé dans le livre avant la prise de vue.", en: "A letter read late, roses at the end of their bloom. The title comes from the sonnet the sitter slipped into the book before the shoot." } },
    { id: "erudit", img: "images/lecteur.webp", w: 1150, h: 1500, title: { fr: "L'Érudit", en: "The Scholar" }, place: { fr: "Bibliothèque privée, Normandie", en: "Private library, Normandy" },
      story: { fr: "Patrick lit à la chandelle, lunettes relevées, au pied de quatre mille volumes. Une seule prise a été conservée : celle où la flamme ne bougeait plus.", en: "Patrick reads by candlelight, glasses raised, at the foot of four thousand volumes. One frame was kept: the one where the flame had stopped moving." } },
    { id: "aubergiste", img: "images/aubergiste.webp", w: 1500, h: 1133, title: { fr: "L'Aubergiste", en: "The Innkeeper" }, place: { fr: "Auberge, Normandie", en: "Inn, Normandy" },
      story: { fr: "Une lanterne tendue par-dessus la table, un client de dos, une rangée de cierges au fond de la salle. Format panoramique, tiré en 300 × 40.", en: "A lantern held out across the table, a customer seen from behind, a row of candles at the back of the room. Panoramic format, printed 300 × 40." } },
    { id: "cimetiere", img: "images/cimetiere-innocents.webp", w: 1500, h: 1205, title: { fr: "Cimetière des Innocents", en: "Cemetery of the Innocents" }, place: { fr: "Extérieur nuit, Normandie", en: "Night exterior, Normandy" },
      story: { fr: "Un porteur de torche dans la fumée, tricorne baissé. La torche de résine a brûlé douze minutes ; l'image est prise à la neuvième.", en: "A torchbearer in the smoke, tricorn lowered. The resin torch burned for twelve minutes; the frame was taken at the ninth." } },
    { id: "osselets", img: "images/osselets.webp", w: 1500, h: 1122, title: { fr: "Les Osselets", en: "Knucklebones" }, place: { fr: "Extérieur nuit, Normandie", en: "Night exterior, Normandy" },
      story: { fr: "Deux enfants, une lanterne posée dans l'herbe, un croissant de lune. Le jeu a duré plus longtemps que la séance.", en: "Two children, a lantern set in the grass, a crescent moon. The game lasted longer than the session." } },
    { id: "gamin", img: "images/gamin-route.webp", w: 1500, h: 1193, title: { fr: "Le Gamin sur la route", en: "The Boy on the Road" }, place: { fr: "Extérieur nuit, Normandie", en: "Night exterior, Normandy" },
      story: { fr: "Une lanterne portée à deux mains, des phares qui montent derrière lui, la route encore mouillée. La dernière image de la série.", en: "A lantern carried in both hands, headlights rising behind him, the road still wet. The last image of the series." } }
  ]
};

const SHOW = {
  fr: {
    eyebrow: "Exposition en cours",
    name: "« Let there be more light » — Itinéraire en quête d'artiste",
    dates: "12 · 13 · 19 · 20 septembre 2026",
    place: "Chapelle Saint-Clair, Malherbe-sur-Ajon",
    nocturne: "Visite nocturne à la bougie — samedi 19 septembre, 21h – 23h"
  },
  en: {
    eyebrow: "Currently exhibiting",
    name: "“Let there be more light” — Itinéraire en quête d'artiste",
    dates: "12 · 13 · 19 · 20 September 2026",
    place: "Chapelle Saint-Clair, Malherbe-sur-Ajon",
    nocturne: "Candlelit night visit — Saturday 19 September, 9pm – 11pm"
  }
};

/* Les valeurs (oeuvre, commission…) doivent correspondre à SUBJECTS dans site/contact.php */
const SUBJECT_KEYS = ["oeuvre", "commission", "pret", "presse", "autre"];

const T = {
  fr: {
    siteTitle: "Carter & Martin — Photographes · Normandie",
    homeDescription: "Linaupe Carter & Allan Martin, duo photographique normand. « Let there be more light » : dix scènes à la bougie tirées sur toile.",
    skip: "Aller au contenu",
    tagShort: "Photographes · Normandie",
    langLabel: "Langue",
    nav: { series: "La série", about: "À propos", contact: "Contact", label: "Navigation principale", open: "Ouvrir le menu", close: "Fermer le menu" },
    home: {
      eyebrow: "Linaupe Carter & Allan Martin — Normandie",
      heroTitle: "Des scènes à la bougie.",
      heroSub: "Un duo, une première série : dix scènes bâties autour d'une flamme, tirées sur toile.",
      heroCta: "Voir la série",
      statement: "« La bougie est au centre de la scène. Tout le reste — le cadre, le temps de pose, la place des corps — s'organise autour de sa flamme. »",
      intro1: "Nous travaillons ensemble depuis 2026, à quatre mains : l'un construit la scène et la lumière, l'autre cadre et déclenche. Aucune de ces images n'existe sans l'autre — elles sont donc signées ensemble.",
      intro2: "Auberges, caves voûtées, bibliothèques, routes de campagne, atelier : les décors sont normands, les références flamandes et caravagesques. Le temps de pose se compte en secondes, parfois en minutes.",
      aboutLink: "Le duo"
    },
    series: { eyebrow: "Série · 2026", works: "Œuvres de la série", count: "œuvres" },
    work: { enquire: "Nous écrire à propos de cette œuvre", prev: "Précédente", next: "Suivante", pager: "Autres œuvres de la série", param: "oeuvre" },
    about: {
      eyebrow: "Le duo",
      title: "Linaupe Carter & Allan Martin",
      lead: "Deux photographes, une seule image. Ils travaillent en Normandie et ne signent jamais séparément.",
      p1: "Linaupe Carter vient du théâtre et de l'éclairage de scène ; Allan Martin de la photographie documentaire de nuit. Leur rencontre, en 2026, a produit une méthode simple : construire la scène autour d'une flamme réelle, et laisser la pose assez longue pour que l'endroit respire.",
      p2: "« Let there be more light » est née cette même année : dix scènes tournées entre une auberge, une bibliothèque privée, une cave voûtée, deux nuits de campagne et l'atelier où sont bâties les natures mortes. Les tirages y sont produits à la main, un par un, puis montés sur châssis.",
      quote: "« La flamme décide de tout : de la couleur, du cadre, du temps qu'il nous reste avant qu'elle ne baisse. »",
      exhibTitle: "Expositions"
    },
    contact: {
      eyebrow: "Contact",
      title: "Écrire à l'atelier",
      intro: "Pour une demande au sujet d'une œuvre, une commission ou une demande de prêt, écrivez-nous : nous vous répondons personnellement.",
      name: "Nom", email: "Courriel", subject: "Objet", message: "Message",
      honeypot: "Ne pas remplir ce champ",
      send: "Envoyer",
      sent: "Merci. Votre message est bien arrivé à l'atelier.",
      error: "Le message n'a pas pu être envoyé. Réessayez dans un instant ou appelez-nous au 06 29 69 06 22.",
      invalid: "Merci de vérifier les champs du formulaire (nom, courriel valide et message).",
      throttle: "Votre message précédent vient de partir. Merci de patienter quelques secondes avant un nouvel envoi.",
      prefill: "À propos de l'œuvre « {title} » : ",
      imageCaption: "« La Pénitente », série Let there be more light — 2026"
    },
    footer: {
      blurb: "Duo photographique normand. Scènes à la bougie tirées sur toile, montées sur châssis et signées par Linaupe Carter et Allan Martin.",
      navTitle: "Naviguer", studioTitle: "Atelier",
      legal: "Mentions légales · Crédits"
    },
    subjects: ["Demande au sujet d'une œuvre", "Commission / série sur mesure", "Prêt d'œuvre & exposition", "Presse", "Autre"],
    specKeys: { medium: "Technique", signature: "Signature", place: "Lieu de prise de vue", studio: "Atelier" },
    specVals: {
      medium: "Impression sur toile, montée sur châssis bois",
      signature: "Signée au dos par les deux auteurs",
      studio: "Montage et contrôle assurés par les photographes"
    },
    contactBlocks: { studio: "Atelier", appointment: "Sur rendez-vous", hours: "Jeudi – samedi, 14h – 19h" }
  },
  en: {
    siteTitle: "Carter & Martin — Photographers · Normandy",
    homeDescription: "Linaupe Carter & Allan Martin, a photographic duo from Normandy. “Let there be more light”: ten candlelit scenes printed on canvas.",
    skip: "Skip to content",
    tagShort: "Photographers · Normandy",
    langLabel: "Language",
    nav: { series: "The series", about: "About", contact: "Contact", label: "Main navigation", open: "Open menu", close: "Close menu" },
    home: {
      eyebrow: "Linaupe Carter & Allan Martin — Normandy",
      heroTitle: "Scenes by candlelight.",
      heroSub: "One duo, a first series: ten scenes built around a flame, printed on canvas.",
      heroCta: "View the series",
      statement: "“The candle sits at the centre of the scene. Everything else — the frame, the exposure, where the bodies stand — is arranged around its flame.”",
      intro1: "We have worked together since 2026, four-handed: one builds the scene and the light, the other frames and releases the shutter. Not one of these images exists without the other — so both sign them.",
      intro2: "Inns, vaulted cellars, libraries, country roads, the studio: the settings are Norman, the references Flemish and Caravaggesque. Exposures are counted in seconds, sometimes in minutes.",
      aboutLink: "About the duo"
    },
    series: { eyebrow: "Series · 2026", works: "Works in the series", count: "works" },
    work: { enquire: "Write to us about this work", prev: "Previous", next: "Next", pager: "Other works in the series", param: "work" },
    about: {
      eyebrow: "The duo",
      title: "Linaupe Carter & Allan Martin",
      lead: "Two photographers, one single image. They work in Normandy and never sign separately.",
      p1: "Linaupe Carter comes from theatre and stage lighting; Allan Martin from nocturnal documentary photography. Their meeting, in 2026, produced a simple method: build the scene around a real flame, and keep the exposure long enough for the place to breathe.",
      p2: "“Let there be more light” was made that same year: ten scenes shot between an inn, a private library, a vaulted cellar, two nights in the countryside and the studio where the still lifes are built. The prints are made there by hand, one at a time, then mounted on stretchers.",
      quote: "“The flame decides everything: the colour, the frame, how long we have before it dies down.”",
      exhibTitle: "Exhibitions"
    },
    contact: {
      eyebrow: "Contact",
      title: "Write to the studio",
      intro: "For an enquiry about a work, a commission or a loan request, write to us: we answer personally.",
      name: "Name", email: "Email", subject: "Subject", message: "Message",
      honeypot: "Leave this field empty",
      send: "Send",
      sent: "Thank you. Your message has reached the studio.",
      error: "Your message could not be sent. Please try again shortly or call us on +33 6 29 69 06 22.",
      invalid: "Please check the form fields (name, valid email address and message).",
      throttle: "Your previous message has just been sent. Please wait a few seconds before sending another.",
      prefill: "About the work “{title}”: ",
      imageCaption: "“The Penitent”, from Let there be more light — 2026"
    },
    footer: {
      blurb: "Norman photographic duo. Candlelit scenes printed on canvas, mounted on stretchers and signed by Linaupe Carter and Allan Martin.",
      navTitle: "Navigate", studioTitle: "Studio",
      legal: "Legal · Credits"
    },
    subjects: ["Work enquiry", "Commission / bespoke series", "Loan & exhibition", "Press", "Other"],
    specKeys: { medium: "Medium", signature: "Signature", place: "Location", studio: "Studio" },
    specVals: {
      medium: "Canvas print, mounted on a wooden stretcher",
      signature: "Signed verso by both authors",
      studio: "Mounting and inspection by the photographers"
    },
    contactBlocks: { studio: "Studio", appointment: "By appointment", hours: "Thursday – Saturday, 14h – 19h" }
  }
};

const AUTHORS = [
  { name: "Linaupe Carter", role: { fr: "Lumière & décor", en: "Light & set" },
    bio: { fr: "Formée à l'éclairage de scène, elle construit chaque décor à la main — cire, fumée, tissu, pierre — et décide de la place de la flamme.", en: "Trained in stage lighting, she builds every set by hand — wax, smoke, cloth, stone — and decides where the flame will stand." } },
  { name: "Allan Martin", role: { fr: "Cadre & prise de vue", en: "Frame & exposure" },
    bio: { fr: "Photographe documentaire de nuit, il cadre, mesure le temps de pose et supervise le montage de chaque œuvre.", en: "A night documentary photographer, he frames the image, times the exposure and oversees the mounting of every work." } }
];

const EXHIBITIONS = [
  { year: "2026",
    name: { fr: "« Let there be more light » — Itinéraire en quête d'artiste · Chapelle Saint-Clair, Malherbe-sur-Ajon", en: "“Let there be more light” — Itinéraire en quête d'artiste · Chapelle Saint-Clair, Malherbe-sur-Ajon" },
    place: { fr: "12 · 13 · 19 · 20 septembre 2026", en: "12 · 13 · 19 · 20 September 2026" } },
  { year: "2026",
    name: { fr: "Visite nocturne à la bougie — samedi 19 septembre, 21h – 23h", en: "Candlelit night visit — Saturday 19 September, 9pm – 11pm" },
    place: { fr: "Chapelle Saint-Clair, Malherbe-sur-Ajon", en: "Chapelle Saint-Clair, Malherbe-sur-Ajon" } }
];

module.exports = {
  studio: STUDIO,
  series: SERIES,
  show: SHOW,
  subjectKeys: SUBJECT_KEYS,
  t: T,
  authors: AUTHORS,
  exhibitions: EXHIBITIONS
};
