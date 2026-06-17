export const FONTS = [
  {
    id: "georgia",
    name: "Georgia",
    family: "Georgia, serif",
    google: null,
  },
  {
    id: "inter",
    name: "Inter",
    family: "'Inter', system-ui, sans-serif",
    google: "Inter:wght@400;500;600",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    family: "'Playfair Display', Georgia, serif",
    google: "Playfair+Display:wght@400;600",
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    family: "'DM Sans', system-ui, sans-serif",
    google: "DM+Sans:wght@400;500;600",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    family: "'Merriweather', Georgia, serif",
    google: "Merriweather:wght@400;700",
  },
  {
    id: "lora",
    name: "Lora",
    family: "'Lora', Georgia, serif",
    google: "Lora:wght@400;600",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "'Montserrat', system-ui, sans-serif",
    google: "Montserrat:wght@400;600",
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "'Poppins', system-ui, sans-serif",
    google: "Poppins:wght@400;600",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "'Roboto', system-ui, sans-serif",
    google: "Roboto:wght@400;500",
  },
  {
    id: "source-serif-4",
    name: "Source Serif 4",
    family: "'Source Serif 4', Georgia, serif",
    google: "Source+Serif+4:wght@400;600",
  },
  {
    id: "libre-baskerville",
    name: "Libre Baskerville",
    family: "'Libre Baskerville', Georgia, serif",
    google: "Libre+Baskerville:wght@400;700",
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    family: "'Space Grotesk', system-ui, sans-serif",
    google: "Space+Grotesk:wght@400;600",
  },
];

export function getFontById(id) {
  return FONTS.find((f) => f.id === id) || FONTS[0];
}

export function getFontImportUrl(fontId) {
  const font = getFontById(fontId);
  if (!font.google) return null;
  return `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
}
