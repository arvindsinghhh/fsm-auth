import { StaticContent } from '../../services/staticContentService';

export const generateDummyStaticContent = (): StaticContent[] => [
    {
        id: 1,
        title: "About Us",
        description: "Welcome to our field service management company...",
        metaTitle: "About Our Company | FSM",
        metaDescription: "Learn about our field service management solutions and services",
        metaKeywords: ["about", "company", "services", "field service"],
        slug: "about-us",
        active: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
    },
    {
        id: 2,
        title: "Terms of Service",
        description: "Please read these terms of service carefully...",
        metaTitle: "Terms of Service | FSM",
        metaDescription: "Terms and conditions for using our field service management platform",
        metaKeywords: ["terms", "conditions", "legal", "service agreement"],
        slug: "terms-of-service",
        active: true,
        createdAt: "2025-01-02T00:00:00Z",
        updatedAt: "2025-01-02T00:00:00Z"
    },
    {
        id: 3,
        title: "Privacy Policy",
        description: "Your privacy is important to us...",
        metaTitle: "Privacy Policy | FSM",
        metaDescription: "Our commitment to protecting your privacy and data security",
        metaKeywords: ["privacy", "data protection", "security"],
        slug: "privacy-policy",
        active: true,
        createdAt: "2025-01-03T00:00:00Z",
        updatedAt: "2025-01-03T00:00:00Z"
    }
];
