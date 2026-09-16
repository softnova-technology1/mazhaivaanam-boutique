import { useEffect } from 'react';

/**
 * Enterprise Dynamic SEO Component for Mazhai Vaanam Boutique
 * Handles Titles, Descriptions, OG Tags, Twitter Cards, Canonical Links, and JSON-LD Rich Snippet Schemas
 */
export default function SEO({ title, description, keywords, image, url, schema }) {
  const defaultTitle = 'MAZHAI VAANAM | Luxury Handwoven Kanjeevaram & Banarasi Sarees';
  const defaultDesc = 'Discover authentic handwoven Kanjeevaram silk sarees, Banarasi sarees, bridal silks, and exclusive designer ethnic wear at Mazhai Vaanam Boutique. Worldwide insured shipping.';
  const defaultKeywords = 'Mazhai Vaanam Boutique, Kanjeevaram silk saree, Banarasi saree, handwoven saree, bridal silk sarees, luxury ethnic wear, designer sarees';
  const siteUrl = 'https://mazhaivaanam.com';

  useEffect(() => {
    // 1. Page Title
    const pageTitle = title ? `${title} | MAZHAI VAANAM` : defaultTitle;
    document.title = pageTitle;

    // Helper to set/update meta tag
    const updateMetaTag = (nameAttr, nameVal, content) => {
      if (!content) return;
      let meta = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameAttr, nameVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 2. Meta Description & Keywords
    const metaDesc = description || defaultDesc;
    updateMetaTag('name', 'description', metaDesc);
    updateMetaTag('name', 'keywords', keywords || defaultKeywords);

    // 3. Open Graph Tags (Facebook, WhatsApp)
    updateMetaTag('property', 'og:title', pageTitle);
    updateMetaTag('property', 'og:description', metaDesc);
    if (image) updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', url ? `${siteUrl}${url}` : window.location.href);

    // 4. Twitter Card Tags
    updateMetaTag('name', 'twitter:title', pageTitle);
    updateMetaTag('name', 'twitter:description', metaDesc);
    if (image) updateMetaTag('name', 'twitter:image', image);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url ? `${siteUrl}${url}` : window.location.href);

    // 6. Dynamic JSON-LD Schema.org Injection (Google Rich Snippets & Shopping)
    let scriptTag = document.getElementById('dynamic-json-ld');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-json-ld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, image, url, schema]);

  return null;
}
