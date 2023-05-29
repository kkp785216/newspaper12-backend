/**
 * @param title take url | title as input and convert into slug
 * @returns formated slug
 */
function convertTitleToSlug(title: string) {
  // Convert special characters to their ASCII equivalents
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  // Remove duplicate hyphens
  const finalSlug = slug.replace(/-{2,}/g, "-");

  return finalSlug;
}

export default convertTitleToSlug;
