export interface BreadcrumbItem {
  label: string;
  url: string;
  current?: boolean;
}

/**
 * Generate breadcrumb structured data for SEO
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  siteUrl: string
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.current ? undefined : `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate breadcrumb navigation items with proper structure
 */
export function generateBreadcrumbItems(
  currentPage: string,
  additionalItems?: Array<{ label: string; url: string }>
): BreadcrumbItem[] {
  const baseItems: BreadcrumbItem[] = [{ label: 'Home', url: '/' }];

  if (additionalItems) {
    baseItems.push(...additionalItems);
  }

  // Add current page
  baseItems.push({ label: currentPage, url: '', current: true });

  return baseItems;
}
