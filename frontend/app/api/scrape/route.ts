import * as cheerio from 'cheerio'
import { NextRequest } from 'next/server'

export async function POST(request: Request) {
  const { url } = await request.json()

  // Error handling
  if (!url) return Response.json({ error: "No URL was found" }, { status: 400 });

  // Scraping the website
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })

  const html = await res.text();
  const $ = cheerio.load(html)

  // -- Company Foundation
  // Overview / company description
  const description = $('meta[name="description"]').attr("content") || ''
  // Website (url), industry, business model, company role
  const industry = html.match(/industry[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || ''
  const businessModel = html.match(/(?:B2B|B2C|SaaS|C2C|BaaS|C2B)/i)?.[0] || ''
  const companyRole = html.match(/(?:we are a|we're a|a leading|a full-service)\s+([a-zA-Z\s]+company|agency|studio|firm|platform)/i)?.[1]?.trim() || ''
  // Year founded, legal entity type, employee count
  const founded = html.match(/(?:founded|established|since)\s+(\d{4})/i)?.[1] || ''
  const entityType = html.match(/(?:LLC|Inc\.|Corp\.|Ltd\.|L\.L\.C|Incorporated|Corporation)/i)?.[0] || ''
  const employeeCount = html.match(/(\d[\d,]+)\s*(?:employees|team members|staff|people)/i)?.[1] || ''
  // Main address, other locations, service locations
  const address = $('footer').text().match(/\d+\s+[A-Za-z]+\s+(?:St|Ave|Blvd|Rd|Dr|Lane|Way)[.,\s]/i)?.[0] || ''
  const locations: string[] = []
  $('address, [class*="address"], [class*="location"]').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim()
    if (text) locations.push(text)
  })
  const footerAddresses = $('footer').text().match(/\d+\s+[A-Za-z]+\s+(?:St|Ave|Blvd|Rd|Dr|Lane|Way)[.,\s][^<]*/gi) || []
  const mainAddress = locations[0] || footerAddresses[0] || ''
  const otherLocations = [...locations.slice(1), ...footerAddresses.slice(1)]
  // Alternative company names
  const alternativeNames = html.match(/(?:also known as|formerly|dba|d\.b\.a\.)\s+([A-Z][^\.,<]+)/i)?.[1]?.trim() || ''

  // -- Positioning
  // Company pitch (a compelling summary of why a customer should choose them)
  const companyPitch = $('meta[property="og:description"]').attr('content') || $('h1').first().text().trim() || ''
  // Founding story (if available)
  const foundingStory = $('[class*="story"], [class*="about"], [class*="history"]').first().text().replace(/\s+/g, ' ').trim().slice(0, 500) || ''

  // -- Market & Customers
  // Target buyers
  const targetBuyers = html.match(/(?:for\s+)?(customers|users|small businesses|enterprises|startups|homeowners|restaurants|retailers|agencies|freelancers)[^<]*/gi)?.[0] || ''
  // Customer needs
  const customerNeeds = ''
  // Ideal customer persona
  const customerPersona = ''
  // Industry groupings
  const uniqueIndustries = [...new Set(html.match(/(?:retail|healthcare|finance|education|technology|hospitality|real estate|legal|marketing)/gi) || [])]
  // Industry outlook (if available)
  const industryOutlook = ''
  // Channels, funnels, CTAs
  const ctas: string[] = []
  $('button, a[class*="btn"], a[class*="cta"]').each((_, el) => {
    const text = $(el).text().trim()
    if (text.length > 2 && text.length < 60) ctas.push(text)
  })
  const uniqueCtas = [...new Set(ctas)].slice(0, 15)
  const navItems: string[] = []
  $('nav a').each((_, el) => { const t = $(el).text().trim(); if (t) navItems.push(t) })
  // Suppliers / partners
  const partners: string[] = []
  $('[class*="partner"], [class*="sponsor"], [class*="integration"]').each((_, el) => {
    const text = $(el).text().trim()
    if (text) partners.push(text.slice(0, 100))
  })

  // -- Branding & Style
  // Writing style description (tone, voice, language patterns)
  const toneWords = ['professional', 'friendly', 'bold', 'innovative', 'trusted', 'expert', 'simple', 'powerful', 'passionate', 'creative']
  const text = $('body').text().replace(/\s+/g, ' ').trim()
  const toneStyle = toneWords.filter(w => text.toLowerCase().includes(w))
  // Art style description
  const artStyle = ''
  // Fonts
  const fonts: string[] = []
  $('link[href*="fonts.googleapis"]').each((_, el) => {
    const href = $(el).attr('href') || ''
    const match = href.match(/family=([^&:]+)/)
    if (match) fonts.push(decodeURIComponent(match[1].replace(/\+/g, ' ')))
  })
  // Brand colors (hex values)
  const colors: string[] = []
  $('[style]').each((_, el) => {
    const style = $(el).attr('style') || ''
    const hex = style.match(/#[0-9a-fA-F]{3,6}/g)
    if (hex) colors.push(...hex)
  })
  const brandColors = [...new Set(colors)].slice(0, 10)
  // Logos (URLs)
  const logo = $('meta[property="og:image"]').attr('content') || $('img[class*="logo"]').attr('src') || ''

  // -- Online Presence
  // Social media links (LinkedIn, Facebook, Instagram, Twitter/X, etc.)
  const linkedin = $('a[href*="linkedin"]').attr('href') || ''
  const instagram = $('a[href*="instagram"]').attr('href') || ''
  const x = $('a[href*="x"]').attr('href') || ''
  const twitter = $('a[href*="twitter"]').attr('href') || ''
  const facebook = $('a[href*="facebook"]').attr('href') || ''
  const tiktok = $('a[href*="tiktok"]').attr('href') || ''
  const youtube = $('a[href*="youtube"]').attr('href') || ''

  // -- Key People
  // Names, titles, roles, gender
  const keyPeople: { name: string; role: string }[] = []
  $('[class*="team"], [class*="staff"], [class*="member"]').each((_, el) => {
    const name = $(el).find('[class*="name"]').text().trim()
    const role = $(el).find('[class*="role"], [class*="title"], [class*="position"]').text().trim()
    if (name) keyPeople.push({ name, role })
  })
  // Brief descriptions of their background or relevance
  const keyPeopleDescriptions: string[] = []
  $('[class*="team"] p, [class*="staff"] p, [class*="bio"]').each((_, el) => {
    const text = $(el).text().trim()
    if (text) keyPeopleDescriptions.push(text.slice(0, 200))
  })

  // -- Offerings
  // Products and/or services
  const offerings: string[] = []
  $('[class*="service"], [class*="product"], [class*="offer"], [class*="package"]').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim()
    if (text.length > 10 && text.length < 300) offerings.push(text)
  })
  // Features of each offering
  const features: string[] = []
  $('[class*="feature"], [class*="benefit"]').each((_, el) => {
    const text = $(el).text().trim()
    if (text) features.push(text.slice(0, 200))
  })
  // Pricing information (if available)
  const pricing = html.match(/\$[\d,]+(?:\.\d{2})?(?:\s*\/\s*(?:mo|month|yr|year))?/g) || []
  const uniquePricing = [...new Set(pricing)].slice(0, 10)
  // Categorization of offering types
  const offeringTypes = html.match(/(?:consulting|software|services|products|courses|coaching|design|development|marketing)[^<]*/gi)?.[0] || ''


  return Response.json({
    companyFoundation: {
      description, industry, businessModel, companyRole,
      founded, entityType, employeeCount,
      mainAddress, otherLocations, alternativeNames
    },
    positioning: { companyPitch, foundingStory },
    marketAndCustomers: {
      targetBuyers, customerNeeds, customerPersona,
      industryGroupings: uniqueIndustries, industryOutlook,
      ctas: uniqueCtas, channels: navItems, partners
    },
    brandingAndStyle: {
      tone: toneStyle, artStyle, fonts, brandColors, logo
    },
    onlinePresence: { linkedin, instagram, x, twitter, facebook, tiktok, youtube },
    keyPeople: { people: keyPeople, descriptions: keyPeopleDescriptions },
    offerings: { list: [...new Set(offerings)].slice(0, 10), features, pricing: uniquePricing, offeringTypes }
  })
}