export type USLandingPage = {
  slug: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
  eyebrow: string;
  heading: string;
  intro: string;
  angleTitle: string;
  angleIntro: string;
  cards: Array<{ title: string; text: string }>;
  premiumTitle: string;
  premiumIntro: string;
  premiumPoints: string[];
  relevanceTitle: string;
  relevanceParagraphs: string[];
  relevanceBullets: string[];
  ctaTitle: string;
  ctaText: string;
  faqs?: Array<{ question: string; answer: string }>;
};

export const US_LANDING_PAGES = [
  {
    slug: "fine-art-prints",
    title: "Fine Art Landscape Prints USA | Aerial Wall Art | OpenÉire Studios",
    description: "Premium aerial fine art prints shipped to the United States. Landscape wall art from Ireland in curated formats for collectors and distinctive interiors.",
    breadcrumbLabel: "US Fine Art Prints",
    eyebrow: "Fine art prints shipped to the United States",
    heading: "Fine Art Prints for Collectors and Interiors in the United States",
    intro: "Discover premium aerial wall art from OpenÉire Studios, available to buyers in the United States. These prints are made for interiors, collectors, and gift buyers who want landscape artwork with atmosphere rather than generic decor.",
    angleTitle: "Why these prints work in real interiors",
    angleIntro: "Built for buyers who want fine art prints, landscape wall art, and premium aerial photography that can sit naturally in considered spaces.",
    cards: [
      { title: "Statement wall art", text: "Designed to hold presence in a living room, hallway, office, or hospitality setting without feeling mass-produced." },
      { title: "Editorial atmosphere", text: "Aerial landscapes with mood, negative space, and tonal restraint that work naturally in considered interiors." },
      { title: "Premium finish", text: "Produced to order so the final piece feels closer to collected wall art than off-the-shelf poster commerce." },
    ],
    premiumTitle: "Premium positioning for collectors and interiors",
    premiumIntro: "OpenÉire Studios brings an editorial eye to physical wall art, with original photography selected for mood, clarity, and presence.",
    premiumPoints: ["Original aerial and ground photography curated by the studio.", "Made-to-order formats designed for real interiors rather than generic poster commerce.", "Product pages remain the source of truth for exact sizes, finishes, prices, and availability."],
    relevanceTitle: "Shipping to the United States",
    relevanceParagraphs: ["Fine art prints are available to buyers in the United States through the same secure checkout flow used across the collection.", "Each piece is produced to order and delivery options are calculated during checkout."],
    relevanceBullets: ["Available to buyers in the United States", "Produced to order", "Shipping is calculated at checkout"],
    ctaTitle: "Explore fine art prints for your space",
    ctaText: "Browse the current physical collection, compare formats on each product page, or contact the studio for help choosing a piece.",
    faqs: [
      { question: "Do you ship fine art prints to the United States?", answer: "Yes. Prints are available to US buyers, with shipping calculated during checkout." },
      { question: "Are these original aerial photography prints?", answer: "Yes. The collection centres on original photography curated by OpenÉire Studios." },
      { question: "Are prints suitable for collectors and interiors?", answer: "Yes. The collection is intended for collectors, design-led interiors, and statement spaces." },
    ],
  },
  {
    slug: "wall-art-prints",
    title: "Wall Art Prints USA | Premium Aerial Wall Art | OpenÉire Studios",
    description: "Premium wall art prints for interiors in the United States. Discover atmospheric aerial artwork designed for homes, offices, and refined spaces.",
    breadcrumbLabel: "US Wall Art Prints",
    eyebrow: "Premium wall art for the United States",
    heading: "Wall Art Prints for Interiors in the United States",
    intro: "Browse a curated collection of wall art prints designed for homes, offices, and interior projects across the United States, chosen for atmosphere, presence, and real-world display.",
    angleTitle: "Wall art that works in real spaces",
    angleIntro: "Built around placement and interior use, this collection suits living rooms, offices, hospitality settings, and refined spaces that need a focal piece.",
    cards: [
      { title: "Statement pieces for homes", text: "Designed for rooms that need a stronger focal point than anonymous wall decor can provide." },
      { title: "Suitable for offices and hospitality", text: "Aerial wall art with enough restraint and atmosphere for professional and guest-facing interiors." },
      { title: "Premium, not mass-market", text: "Produced as art-led physical prints for real display rather than quick-turn poster merchandise." },
    ],
    premiumTitle: "Premium positioning for interiors",
    premiumIntro: "These wall art prints are intended to feel deliberate in a room, with curation and composition taking priority over trend-led decoration.",
    premiumPoints: ["Original imagery with an editorial, atmosphere-led point of view.", "Physical formats selected for considered residential and professional interiors.", "Clear product-level options for size, material, pricing, and availability."],
    relevanceTitle: "Wall art for US buyers",
    relevanceParagraphs: ["The collection is available to buyers in the United States as made-to-order physical prints.", "Orders move through the same secure checkout and fulfilment flow as the wider print collection."],
    relevanceBullets: ["Available in the United States", "Made-to-order physical artwork", "Shipping is calculated at checkout"],
    ctaTitle: "Find wall art for your space",
    ctaText: "Browse the print gallery or continue to the fine art overview for a more collector-led introduction.",
  },
  {
    slug: "aerial-photography-prints",
    title: "Aerial Photography Prints USA | Drone Wall Art | OpenÉire Studios",
    description: "Discover aerial photography prints for buyers in the United States, with premium drone wall art created from original landscapes in Ireland and beyond.",
    breadcrumbLabel: "US Aerial Photography Prints",
    eyebrow: "Aerial photography prints for the United States",
    heading: "Aerial Photography Prints for Buyers in the United States",
    intro: "Explore original aerial photography prints created from a perspective that reveals landscape, structure, and scale in ways ground-level imagery cannot.",
    angleTitle: "Why aerial perspective changes a room",
    angleIntro: "Aerial photography turns coastlines, roads, fields, and architecture into graphic compositions with a strong sense of place.",
    cards: [
      { title: "A different point of view", text: "Elevated perspective reveals patterns and relationships that are easy to miss from the ground." },
      { title: "Natural geometry", text: "Coastlines, fields, and built environments create structure without losing atmosphere." },
      { title: "Original visual assets", text: "The work is captured and curated by OpenÉire Studios rather than drawn from generic stock collections." },
    ],
    premiumTitle: "Original photography with a clear visual signature",
    premiumIntro: "The collection is built around perspective, composition, and the emotional scale of landscapes in Ireland and beyond.",
    premiumPoints: ["Original aerial imagery selected for physical display.", "Premium prints made to order for collectors and interiors.", "A visual language grounded in landscape, atmosphere, and perspective."],
    relevanceTitle: "Aerial prints for the United States",
    relevanceParagraphs: ["Aerial photography prints are available to US buyers through the existing physical print collection.", "Exact sizes and materials are shown on each product page."],
    relevanceBullets: ["Original aerial photography", "Available to US buyers", "Secure checkout and calculated delivery"],
    ctaTitle: "See the landscape from above",
    ctaText: "Browse available physical prints or explore the wider fine art collection before choosing a format.",
  },
  {
    slug: "landscape-wall-art",
    title: "Landscape Wall Art USA | Scenic Prints | OpenÉire Studios",
    description: "Discover premium landscape wall art for the United States, featuring atmospheric aerial and scenic prints for homes, offices, and refined interiors.",
    breadcrumbLabel: "US Landscape Wall Art",
    eyebrow: "Landscape wall art for the United States",
    heading: "Landscape Wall Art for Interiors in the United States",
    intro: "Explore landscape wall art selected for atmosphere, depth, and a strong sense of place, from dramatic coastlines to quieter aerial compositions.",
    angleTitle: "Landscape imagery with room presence",
    angleIntro: "Scenic art works best when it carries atmosphere as well as subject matter, giving a room depth without becoming visual noise.",
    cards: [
      { title: "Atmospheric landscapes", text: "Pieces chosen for mood, light, and the feeling of being transported into a place." },
      { title: "Calm visual structure", text: "Compositions with enough clarity and restraint to sit comfortably in considered interiors." },
      { title: "Made for display", text: "Physical prints intended as lasting wall art rather than disposable decoration." },
    ],
    premiumTitle: "Scenic work with an editorial eye",
    premiumIntro: "OpenÉire Studios curates landscape imagery for how it feels in a room, balancing visual impact with atmosphere and restraint.",
    premiumPoints: ["Original landscapes from Ireland and beyond.", "Aerial and ground perspectives chosen for distinct composition.", "Made-to-order formats with product-specific size and material options."],
    relevanceTitle: "Landscape prints for US interiors",
    relevanceParagraphs: ["Landscape wall art is available to buyers throughout the United States.", "Shipping choices and final delivery cost are confirmed during checkout."],
    relevanceBullets: ["Available to United States buyers", "Suitable for homes, offices, and hospitality", "Shipping calculated at checkout"],
    ctaTitle: "Bring a landscape into your space",
    ctaText: "Browse available prints or contact the studio if you want help comparing mood, scale, and placement.",
  },
  {
    slug: "large-wall-art",
    title: "Large Wall Art USA | Statement Prints | OpenÉire Studios",
    description: "Discover large wall art for buyers in the United States, with premium statement prints designed for interiors that need scale and presence.",
    breadcrumbLabel: "US Large Wall Art",
    eyebrow: "Large-format wall art for the United States",
    heading: "Large Wall Art for Interiors in the United States",
    intro: "Explore large-format wall art designed for interiors that need scale and presence, with statement pieces that anchor a room rather than simply fill it.",
    angleTitle: "Why scale changes the way wall art works",
    angleIntro: "Large wall art sets the visual pace, anchors larger walls, and gives open interiors a focal point that smaller pieces often cannot carry alone.",
    cards: [
      { title: "Built for visual presence", text: "Chosen for rooms that need weight and scale rather than a quieter decorative accent." },
      { title: "Statement placement", text: "Artwork that can hold a larger wall with confidence above furniture or across open surfaces." },
      { title: "Suited to bigger interiors", text: "A strong fit for open-plan homes, hospitality settings, and spaces where smaller prints can feel lost." },
    ],
    premiumTitle: "Statement pieces with a considered finish",
    premiumIntro: "Large wall art is approached as physical artwork for real interiors, with curation and composition taking priority over oversized filler.",
    premiumPoints: ["Premium imagery chosen for presence rather than trend-driven decor.", "Made-to-order physical prints with an art-led finish.", "Exact available dimensions and materials shown on each product page."],
    relevanceTitle: "Buying large wall art in the United States",
    relevanceParagraphs: ["Large wall art is available to US buyers as made-to-order physical pieces.", "Larger formats follow the same secure buying flow, with shipping calculated at checkout."],
    relevanceBullets: ["Available to United States buyers", "Large-format options for interiors", "Shipping calculated at checkout"],
    ctaTitle: "Need a print with more presence?",
    ctaText: "Browse the print gallery and compare larger available formats on each product page.",
  },
  {
    slug: "wall-art-for-living-room",
    title: "Living Room Wall Art USA | Interior Prints | OpenÉire Studios",
    description: "Discover premium wall art for living rooms in the United States, with curated prints chosen for balance, atmosphere, and measured presence.",
    breadcrumbLabel: "US Wall Art for Living Room",
    eyebrow: "Living room wall art for the United States",
    heading: "Wall Art for Living Rooms in the United States",
    intro: "Discover wall art designed for living room spaces, where placement, balance, and atmosphere matter. These pieces hold visual weight without overwhelming the room.",
    angleTitle: "Why living room wall art needs balance",
    angleIntro: "Living rooms ask artwork to create atmosphere, sit comfortably with furniture and light, and hold the room without becoming visually heavy.",
    cards: [
      { title: "Designed for placement", text: "Prints considered for sofas, consoles, and the main sightlines of a living space." },
      { title: "Atmosphere over noise", text: "Pieces selected to add mood and depth without making the room feel crowded." },
      { title: "Visual weight with restraint", text: "Presence with enough calm and structure to support the room rather than dominate it." },
    ],
    premiumTitle: "Curated prints for rooms people live in",
    premiumIntro: "Living room wall art is treated as part of the interior composition rather than an isolated decorative purchase.",
    premiumPoints: ["Premium physical prints chosen for atmosphere and compositional calm.", "Made-to-order artwork with an editorial, collector-led feel.", "A mix of landscape, aerial, and larger-format options for different spaces."],
    relevanceTitle: "Wall art for US living spaces",
    relevanceParagraphs: ["Living room wall art is available to buyers in the United States as made-to-order physical prints.", "Orders move through the same clear checkout and fulfilment flow as the wider collection."],
    relevanceBullets: ["Available to United States buyers", "Designed for living room placement", "Shipping calculated at checkout"],
    ctaTitle: "Looking for the right living room piece?",
    ctaText: "Browse the print gallery, compare scale and mood, or contact the studio for help narrowing the collection.",
  },
  {
    slug: "wall-art-for-office",
    title: "Office Wall Art USA | Professional Interior Prints | OpenÉire Studios",
    description: "Explore premium office wall art for the United States, with refined aerial and landscape prints for workspaces and professional interiors.",
    breadcrumbLabel: "US Wall Art for Office",
    eyebrow: "Office wall art for the United States",
    heading: "Wall Art for Offices and Workspaces in the United States",
    intro: "Explore wall art suited for offices, studios, and hospitality spaces, selected for clarity, structure, and a refined visual tone.",
    angleTitle: "Why office wall art needs a cleaner visual language",
    angleIntro: "Workspaces benefit from artwork with structure and restraint, adding character without distracting from the room's professional function.",
    cards: [
      { title: "Appropriate for professional settings", text: "Suited to offices, studios, meeting spaces, and client-facing environments." },
      { title: "Clear structure and composition", text: "Aerial and landscape imagery can bring geometry and visual rhythm to a workspace wall." },
      { title: "Works across commercial interiors", text: "A refined tone for hospitality, studio, and office environments where artwork must feel deliberate." },
    ],
    premiumTitle: "Professional interiors still deserve real artwork",
    premiumIntro: "Office wall art is positioned as a design decision rather than an afterthought, with visual distinction that avoids generic corporate decor.",
    premiumPoints: ["Premium physical prints selected for clarity and structure.", "Made-to-order artwork with a composed professional presence.", "Aerial and landscape perspectives suitable for varied commercial interiors."],
    relevanceTitle: "Wall art for US offices and workspaces",
    relevanceParagraphs: ["Office wall art is available to buyers in the United States through the established print ordering flow.", "Made-to-order production keeps the offer grounded in the same physical collection."],
    relevanceBullets: ["Available to United States buyers", "Suitable for professional environments", "Shipping calculated at checkout"],
    ctaTitle: "Need artwork for a professional setting?",
    ctaText: "Browse available prints or contact the studio for help choosing a piece for an office, studio, or hospitality interior.",
  },
] satisfies USLandingPage[];

export const getUSLandingPage = (slug: string) => US_LANDING_PAGES.find((page) => page.slug === slug);
