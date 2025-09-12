export interface StaticPage {
    title: string;
    content: string;
    lastUpdated: string;
}

export type StaticPageKey = 
    | 'about-us'
    | 'privacy-policy'
    | 'terms-conditions'
    | 'faq'
    | 'help-support'
    | 'contact-us';
