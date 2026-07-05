// =============================================================================
//  BRAND CONFIG  —  EDIT THIS FILE TO MAKE THE SITE YOUR OWN
// -----------------------------------------------------------------------------
//  Every piece of company-specific copy (name, tagline, story, contact, social,
//  legal links) lives here so non-developers can rebrand the whole storefront
//  from a single place. All values below are PLACEHOLDERS — replace them.
// =============================================================================

export const brand = {
  /** Brand / company name shown in the navbar, footer, auth pages, emails copy. */
  name: "Gandhi's Achar",
  /** Short word that follows the name as a wordmark suffix, e.g. "Pickles". */
  wordmarkSuffix: "6 Ranga",
  /** One-line tagline used under the hero headline and in the footer. */
  tagline: "A rainbow of Khari Baoli pickles, hand-made in Delhi since 1950.",
  /** Founding year — drives the "Since ____" eyebrow and the footer copyright. */
  sinceYear: 1950,

  /** Hero headline (kept short; the serif display font does the heavy lifting). */
  heroHeadline: "The Royal Taste of Tradition",
  heroSubtext:
    "Famous across Khari Baoli for a wide variety of pickles — Murabba, Garlic, " +
    "Dela, Lemon, Ginger, Green & Red Chilli, Mango, Nimboo and Punjabi Mix — " +
    "each made with chosen spices, salt and sugar for a magical taste.",

  /** Heritage / About story block on the home page. */
  story: {
    eyebrow: "Our Story",
    title: "Famous in Khari Baoli since 1950",
    body:
      "Pickles from 6 Ranga Achar by Gandhi's, Khari Baoli, Delhi have been " +
      "famous for their wide variety of flavours since 1950. Every variety is " +
      "unique — made with carefully chosen spices, salt and sugar to impart a " +
      "magical taste that compliments northern and continental dishes best.",
  },

  /** About-us page / footer blurb. */
  about:
    "Gandhi's Achar 6 Ranga, from Khari Baoli, Delhi, has been crafting a wide " +
    "range of traditional pickles since 1950 — from Mango and Nimboo to Garlic, " +
    "Ginger, Chilli, Murabba and our signature Punjabi Mix.",

  /** Contact details. */
  contact: {
    email: "hello@gandhiachar6ranga.com",
    phone: "+91 00000 00000",
    address:
      "Shop No. 6675, Opposite Kirana Commity, Main Road, Khari Baoli, Delhi-110006",
  },

  /** Social links — leave a value empty ("") to hide that icon. PLACEHOLDERS. */
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    twitter: "",
    youtube: "",
  },

  /** Footer link columns. Hrefs are placeholders; wire to real routes/pages. */
  footerLinks: {
    shop: [
      { label: "Our Pickles", href: "/store" },
      { label: "Bestsellers", href: "/store" },
      { label: "Gift Boxes", href: "/store" },
    ],
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "Our Heritage", href: "/#story" },
      { label: "Contact", href: "/#contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
    ],
  },
} as const;

/** Marketing imagery (free stock pickle/achaar photos — swap for your own product shots). */
export const heroImages = {
  // Jar of spicy homemade pickles (faded hero backdrop).
  hero:
    "https://images.pexels.com/photos/5410417/pexels-photo-5410417.jpeg?auto=compress&cs=tinysrgb&w=1600",
  // Traditional Indian mango pickle in a rustic ceramic jar on wood (heritage block).
  story:
    "https://images.pexels.com/photos/7812134/pexels-photo-7812134.jpeg?auto=compress&cs=tinysrgb&w=1200",
  collections: [
    {
      title: "Mango Pickles",
      // Homemade mango pickle in a jar with spices.
      image:
        "https://images.pexels.com/photos/9164642/pexels-photo-9164642.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Green & Red Chilli",
      // Spicy homemade pickle with fresh chillies.
      image:
        "https://images.pexels.com/photos/13724203/pexels-photo-13724203.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Punjabi Mix",
      // Pickled vegetable platter (carrots, peppers, radish).
      image:
        "https://images.pexels.com/photos/5855239/pexels-photo-5855239.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Murabba & Sweet",
      // Colourful jars of pickled/preserved mango.
      image:
        "https://images.pexels.com/photos/11584813/pexels-photo-11584813.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ],
} as const;
