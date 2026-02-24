export type KnowledgeBase = {
  companyFoundation: {
    name: string,
    websiteUrl: string;
    description: string
    industry: string
    businessModel: string
    companyRole: string
    founded: string
    entityType: string
    employeeCount: string
    mainAddress: string
    otherLocations: string[]
    alternativeNames: string
  }
  positioning: {
    companyPitch: string
    foundingStory: string
  }
  marketAndCustomers: {
    targetBuyers: string
    customerNeeds: string
    customerPersona: string
    industryGroupings: string[]
    industryOutlook: string
    ctas: string[]
    channels: string[]
    partners: string[]
  }
  brandingAndStyle: {
    tone: string[]
    artStyle: string
    fonts: string[]
    brandColors: string[]
    logo: string
  }
  onlinePresence: {
    linkedin: string
    instagram: string
    x: string
    twitter: string
    facebook: string
    tiktok: string
    youtube: string
  }
  keyPeople: {
    people: { name: string; role: string }[]
    descriptions: string[]
  }
  offerings: {
    list: string[]
    features: string[]
    pricing: string[]
    offeringTypes: string
  }
  extras: {
    email: string
    phone: string
    trustSignals: string[]
    faqs: string[]
    testimonials: string[]
    usps: string[]
  }
}

export type KnowledgeBaseRow = {
  id: string
  company_name: string
  website_url: string
  data: KnowledgeBase
  created_at: string
}
