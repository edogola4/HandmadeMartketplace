import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set meta tags
    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords || "" },
      { property: "og:title", content: ogTitle || title },
      { property: "og:description", content: ogDescription || description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage || "" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle || title },
      { name: "twitter:description", content: ogDescription || description },
      { name: "twitter:image", content: ogImage || "" },
    ];

    // Remove existing meta tags and add new ones
    metaTags.forEach(({ name, property, content }) => {
      if (!content && name !== "keywords") return;

      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      const existingTag = document.querySelector(selector);
      
      if (existingTag) {
        existingTag.setAttribute("content", content);
      } else {
        const meta = document.createElement("meta");
        if (name) meta.setAttribute("name", name);
        if (property) meta.setAttribute("property", property);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    });

    // Set canonical URL
    if (canonicalUrl) {
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.setAttribute("href", canonicalUrl);
      } else {
        const canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        canonical.setAttribute("href", canonicalUrl);
        document.head.appendChild(canonical);
      }
    }

    // Add structured data
    if (structuredData) {
      const existingStructuredData = document.querySelector('script[type="application/ld+json"]');
      if (existingStructuredData) {
        existingStructuredData.textContent = JSON.stringify(structuredData);
      } else {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl, structuredData]);

  return null;
}
