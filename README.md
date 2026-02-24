# MoKnowledge 

MoKnowledge is a web-based tool that scrapes a company's website and transforms the extracted data into a structured, comprehensive knowledge base.

---

# Screenshots

---

# JSON Output File Example (https://account-it.net/)

```
{
  "companyFoundation": {
    "name": "Maximizing returns,",
    "websiteUrl": "https://account-it.net/",
    "description": "Account-it Consulting Services, LLC will take care of your tax preparation and planning needs so you can focus on life in beautiful Boynton Beach.",
    "industry": "",
    "businessModel": "b2b",
    "companyRole": "",
    "founded": "",
    "entityType": "LLC",
    "employeeCount": "",
    "mainAddress": "",
    "otherLocations": [],
    "alternativeNames": ""
  },
  "positioning": {
    "companyPitch": "Account-it Consulting Services, LLC will take care of your tax preparation and planning needs so you can focus on life in beautiful Boynton Beach.",
    "foundingStory": ""
  },
  "marketAndCustomers": {
    "targetBuyers": "users, or",
    "customerNeeds": "",
    "customerPersona": "using our services",
    "industryGroupings": [
      "technology",
      "legal",
      "LEGAL",
      "Marketing",
      "marketing"
    ],
    "industryOutlook": "",
    "ctas": [
      "Close",
      "Privacy Policy",
      "Open menu",
      "Close menu",
      "Next »",
      "511",
      "512",
      "Terms of Service",
      "Terms of Service.",
      "Terms Of Service",
      "Accessibility Statement"
    ],
    "channels": [
      "Home",
      "Firm Background",
      "About Doug Cohen",
      "Privacy Policy",
      "Referrals",
      "Tax Preparation & Planning",
      "Payroll",
      "Accounting & Bookkeeping",
      "IRS Tax Problems",
      "QuickBooks",
      "Learning Center",
      "Contact",
      "Home",
      "Firm Background",
      "About Doug Cohen",
      "Privacy Policy",
      "Referrals",
      "Tax Preparation & Planning",
      "Payroll",
      "Accounting & Bookkeeping",
      "IRS Tax Problems",
      "QuickBooks",
      "Learning Center",
      "Contact"
    ],
    "partners": []
  },
  "brandingAndStyle": {
    "tone": [
      "trusted",
      "simple"
    ],
    "artStyle": "modern, sophisticated",
    "fonts": [
      "Inter",
      "Inter"
    ],
    "brandColors": [],
    "logo": "https://cw3prd.s3.us-west-1.amazonaws.com/2334180/account-logo.png"
  },
  "onlinePresence": {
    "linkedin": "https://www.linkedin.com/in/doug-cohen-9121a86/",
    "instagram": "",
    "x": "https://www.taxbuzz.com/find-the-best-cpa/florida/boynton-beach/account-it-consulting-services",
    "twitter": "",
    "facebook": "https://www.facebook.com/account.itconsulting/?ref=settings",
    "tiktok": "",
    "youtube": ""
  },
  "keyPeople": {
    "people": [],
    "descriptions": []
  },
  "offerings": {
    "list": [],
    "features": [],
    "pricing": [
      "$9,",
      "$9",
      "$1",
      "$2"
    ],
    "offeringTypes": "Consulting Services, LLC Tax Experts in Florida | Account-it Consulting Services, LLC"
  }
}
```

---

# Set up

1. Click the green "Code" button and copy the HTTPS link to clone the repository

```https://github.com/theplaceincan/MoKnowledge.git```

2. Go to your terminal and enter:

```git clone https://github.com/theplaceincan/MoKnowledge.git```

3. Go into the MoKnowledge/frontend folder

4. Install dependencies

```npm install```

5. Run the project locally

```npm run dev```.

---

# Key features and functionality

The key features and functionality of MoKnowledge include:

- Knowledge Base dashboard view with filtering, sorting, and search
- URL HTML web scraper with Cheerio
- Edit and save functionalities for knowledge bases
- Integration to Supabase for storing website data with RLS

---

# My approach to scraping and data extraction

Since we are scraping website data using raw HTML, I relied on finding keywords using regex to find specific information. I used Cheerio to run a web scraper on a valid and existing URL, which returned all needed data as a JSON. This JSON can then be edited before saving to Supabase. There is a page /knowledge/view where you can delete, filter, and search for different knowledge bases. This is how the scraping and data extraction of MoKnowledge works.

---

# Knowledge base schema design

The schema design for knowledge bases is as follows (in Supabase):

```
id              uuid          gen_random_uuid()
company_name    text          null
website_url     text          null
data            jsonb         null
created_at      timestampz    now()
updated_at      timestampz    now()
```

---
# Example prompts for AI enrichment


1. Customer needs

```
const CUSTOMER_NEEDS_PROMPT = `
You are an AI responsible for accurate market research analysis.
Given a structured company knowledge base as a JSON, infer what the primary customer needs are and what needs that this company solves for customers.
USE ONLY THE DATA PROVIDED. DO NOT INVENT ANY OUTSIDE INFORMATION.
Prioritize finding:
- Problems that customers are trying to solve
- Motivations behind purchases (and listed products)
- Unmet needs in the market
- Urgency of those needs
Return a JSON array of the customer's needs ranked by importance.

INPUT: {{knowledge_base_json}}
OUTPUT: {
  "customerNeeds"L [
    {"need": string, "priority": "high | medium | low", "evidence": "string"}
  ]
}
`

```

2. Ideal customer persona

```
const IDEAL_CUSTOMER_PROMPT = `
You are an AI responsible for accurate market research analysis.
Given a structured company knowledge base as a JSON, identify the most likely target buyers or customer. Then separate the buyers/customers into categories.
USE ONLY THE DATA PROVIDED. DO NOT INVENT ANY OUTSIDE INFORMATION.
Prioritize finding:
- Customer type
- Why they would be a customer
- Value proposition from the customer(s)
- Expected budget level of the customer
Return a JSON array of the most likely target buyers/customer.

INPUT: {{knowledge_base_json}}
OUTPUT: {
  "ideal_customer_persona": {
    "description": string,
    "demographics": string,
    "company_size": string,
    "industry": string,
    "decision_maker_role": string,
    "motivations": string[],
    "pain_points": string[],
    "common_objections": string[]
  }
}
`
```

3. Target buyers

```
const TARGET_BUYERS_PROMPT = `
You are an AI responsible for accurate market research analysis.
Given a structured company knowledge base as a JSON, identify the most likely customers. Then separate the customers into categories sorted by most likely to least likely.
USE ONLY THE DATA PROVIDED. DO NOT INVENT ANY OUTSIDE INFORMATION.
Prioritize finding:
- Buyer type
- Why they would purchase
- Value proposition from the customer(s)
- Expected budget level 
Return a JSON array of the most likely customers.

INPUT: {{knowledge_base_json}}
OUTPUT: {
  "target_buyers": [
    {
      "segment": string,
      "description": string,
      "purchase_reason": string,
      "value_proposition": string,
      "budget_level": "low | medium | high"
    }
  ]
}
`
```
---
# Any assumptions or limitations

This project assumes that:
- There's no authentication required
- Websites are in English only, as they may return bad data
- Websites are using regular and common HTML patterns, and aren't using web builders
- Every URL is unique to a different company

The limitations of this project are:
- Websites that are built with web builders (ex. Wix) are not cleanly scraped
- Websites that are JavaScript-rendered are not scraped
- Fields such as ideal customer are difficult to scrape
- Inline CSS is the only place where brand colors are scraped
- Pricing data could return false positives due to regex pattern
- Some fields like key people are scraped by using common and predictable words like team or staff
- No other paths of the company website are scraped, only the main page ("/")
