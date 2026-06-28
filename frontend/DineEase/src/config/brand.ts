// =============================================================================
//  BRAND CONFIG  —  EDIT THIS FILE TO MAKE THE SITE YOUR OWN
// -----------------------------------------------------------------------------
//  Every piece of company-specific copy (name, tagline, story, contact, social,
//  legal links) lives here so non-developers can rebrand the whole storefront
//  from a single place. All values below are PLACEHOLDERS — replace them.
// =============================================================================

export const brand = {
  /** Brand / company name shown in the navbar, footer, auth pages, emails copy. */
  name: "Aamra & Co.",
  /** Short word that follows the name as a wordmark suffix, e.g. "Pickles". */
  wordmarkSuffix: "Pickles",
  /** One-line tagline used under the hero headline and in the footer. */
  tagline: "Heritage pickles, pressed and sun-cured the old way.",
  /** Founding year — drives the "Since ____" eyebrow and the footer copyright. */
  sinceYear: 1998,

  /** Hero headline (kept short; the serif display font does the heavy lifting). */
  heroHeadline: "The Royal Taste of Tradition",
  heroSubtext:
    "Small-batch achaar made from hand-picked produce, mustard oil and " +
    "stone-ground spices — just like it was made for generations.",

  /** Heritage / About story block on the home page. PLACEHOLDER copy. */
  story: {
    eyebrow: "Our Story",
    title: "Four generations of flavour",
    body:
      "[Placeholder] Tell your story here — where it began, the family recipe, " +
      "the village kitchens, the slow sun-curing. This text appears on the home " +
      "page heritage section and can be as long or short as you like.",
  },

  /** About-us page / footer blurb. PLACEHOLDER. */
  about:
    "[Placeholder] A short paragraph about the company, its mission and what " +
    "makes its pickles special. Replace this with your own words.",

  /** Contact details — PLACEHOLDERS. */
  contact: {
    email: "hello@example.com",
    phone: "+91 00000 00000",
    address: "123 Market Road, Your City, India",
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
      { label: "About Us", href: "#" },
      { label: "Our Heritage", href: "#" },
      { label: "Contact", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Shipping & Returns", href: "#" },
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
      title: "Chilli & Lime",
      // Spicy homemade pickle with fresh chillies.
      image:
        "https://images.pexels.com/photos/13724203/pexels-photo-13724203.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      title: "Mixed Vegetable",
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
