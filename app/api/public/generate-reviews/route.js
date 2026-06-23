import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Business from '@/models/Business'
import { trackEvent } from '@/lib/analytics'

export async function POST(request) {
  try {
    const { businessId, rating, tags = [], staffName = '', additionalDetails = '' } = await request.json()

    if (!businessId || !rating) {
      return NextResponse.json({ error: 'businessId and rating are required' }, { status: 400 })
    }

    await connectDB()
    const business = await Business.findById(businessId)
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const businessName = business.name
    const category = business.category || 'General'

    // Track review generation event
    await trackEvent(businessId, 'reviewsGenerated')

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
    if (!OPENROUTER_API_KEY) {
      console.warn("OPENROUTER_API_KEY is not defined. Falling back to local rule-based suggestions.")
      return NextResponse.json({
        reviews: generateFallbackReviews(businessName, category, rating, tags, staffName, additionalDetails)
      })
    }

    // Call OpenRouter API
    const systemPrompt = `You are a review writing assistant for local businesses in India.
Generate exactly 5 genuine, natural-sounding, and distinct review suggestions for a business from a customer's perspective.
Avoid corporate buzzwords. Write them like a real person, using simple, human phrasing.
Mix the languages for the 5 reviews as follows:
- 2 reviews must be written in English.
- 2 reviews must be written in Hinglish (Hindi written in Roman/Latin script, e.g. "Yahan ki service bahut hi acchi hai, recommended!", "Staff bahut friendly aur helpful hai.").
- 1 review must be written in Hindi (using Devanagari script, e.g. "यहाँ की सेवा बहुत बढ़िया है। स्टाफ़ का व्यवहार बहुत अच्छा था।").

Mix the lengths: 2 short reviews, 2 medium reviews, and 1 detailed review.
Vary the tone: friendly, enthusiastic, detailed.
Return ONLY a valid JSON array of 5 strings. Do not include markdown code block styling or any other text.
Example format:
["Review 1 in English", "Review 2 in English", "Review 3 in Hinglish", "Review 4 in Hinglish", "Review 5 in Hindi"]`

    const userPrompt = `Business Name: ${businessName}
Business Category: ${category}
Customer Rating: ${rating} Stars
Things they liked: ${tags.join(', ') || 'Everything'}
Additional Details/Comments: ${additionalDetails || 'N/A'}`

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://reviewpilot.cloud",
          "X-Title": "ReviewPilot",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API responded with status ${response.status}`)
      }

      const data = await response.json()
      let responseText = data.choices?.[0]?.message?.content?.trim() || ""

      // Strip markdown code fences if LLM included them
      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim()
      }

      const reviews = JSON.parse(responseText)
      if (Array.isArray(reviews) && reviews.length === 5) {
        return NextResponse.json({ reviews })
      }
      throw new Error("Parsed JSON is not a 5-item array")
    } catch (apiError) {
      console.warn("OpenRouter API failed or returned invalid response. Using fallback local suggestions:", apiError)
      return NextResponse.json({
        reviews: generateFallbackReviews(businessName, category, rating, tags, staffName, additionalDetails)
      })
    }

  } catch (error) {
    console.error('Fatal error generating reviews:', error)
    return NextResponse.json({ error: 'Failed to generate review suggestions' }, { status: 500 })
  }
}

// Fallback review generator in case API key is missing or fails
function generateFallbackReviews(businessName, category, rating, tags, staff, comments) {
  const list = tags.join(', ') || 'excellent service'
  const extraMention = comments ? ` ${comments}` : ''

  return [
    `Had an amazing experience at ${businessName}. The ${list} was absolutely fantastic! Highly recommend them.${extraMention}`,
    `Really impressed with the ${category} services here. Definitely 5 stars for the ${list}.`,
    `${businessName} par bahut achi service mili. Yahan ka staff bahut cooperative hai aur ${list} badiya tha.`,
    `Bahut hi badiya jagah hai! ${businessName} ki ${list} aur quality dono kamaal ki hain. Zaroor visit karein.`,
    `${businessName} में बहुत ही बढ़िया अनुभव रहा। यहाँ की ${list} बहुत अच्छी है।`
  ]
}
