/**
 * Resolves static asset paths correctly across both local dev server
 * and production deployments (e.g. GitHub Pages with subpath bases).
 */
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};
