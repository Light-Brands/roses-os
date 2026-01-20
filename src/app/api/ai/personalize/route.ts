import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Content Personalization API
 *
 * Personalizes content based on user context.
 * In production, integrate with Claude API or other AI services.
 */

interface PersonalizationRequest {
  baseHeadline: string;
  baseDescription: string;
  userContext?: {
    industry?: string;
    role?: string;
    interests?: string[];
    previousVisit?: boolean;
  };
}

interface PersonalizationResponse {
  headline: string;
  description: string;
  ctaLabel?: string;
}

// Industry-specific variations
const industryVariations: Record<string, { headline: string; description: string }> = {
  technology: {
    headline: 'Ship faster with AI-powered development',
    description: 'The premium boilerplate for tech teams who want to move fast without breaking things.',
  },
  finance: {
    headline: 'Build secure, compliant applications',
    description: 'Enterprise-grade security and compliance built in, so you can focus on innovation.',
  },
  healthcare: {
    headline: 'Patient-first digital experiences',
    description: 'HIPAA-ready infrastructure with accessibility at its core for healthcare innovation.',
  },
  ecommerce: {
    headline: 'Convert more with premium UX',
    description: 'Optimized for conversion with lightning-fast performance and seamless checkout flows.',
  },
  startup: {
    headline: 'From zero to launch in record time',
    description: 'Everything you need to validate your idea and scale to millions of users.',
  },
};

// Role-specific variations
const roleVariations: Record<string, { headline: string; description: string }> = {
  developer: {
    headline: 'The developer experience you deserve',
    description: 'TypeScript-first, beautifully typed, with DX that makes coding a joy.',
  },
  designer: {
    headline: 'Design systems that scale',
    description: 'Pixel-perfect components with a design system that bridges Figma to code.',
  },
  founder: {
    headline: 'Launch your vision, not boilerplate',
    description: 'Skip months of setup and focus on what makes your product unique.',
  },
  'product-manager': {
    headline: 'Ship features, not infrastructure',
    description: 'Ready-made solutions for common features so your team can focus on differentiation.',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: PersonalizationRequest = await request.json();
    const { baseHeadline, baseDescription, userContext } = body;

    // If no context, return base content
    if (!userContext) {
      return NextResponse.json({
        headline: baseHeadline,
        description: baseDescription,
      });
    }

    // Determine personalization based on context
    let personalized: PersonalizationResponse = {
      headline: baseHeadline,
      description: baseDescription,
    };

    // Priority: industry > role > interests
    if (userContext.industry && industryVariations[userContext.industry.toLowerCase()]) {
      const variation = industryVariations[userContext.industry.toLowerCase()];
      personalized = {
        headline: variation.headline,
        description: variation.description,
      };
    } else if (userContext.role && roleVariations[userContext.role.toLowerCase()]) {
      const variation = roleVariations[userContext.role.toLowerCase()];
      personalized = {
        headline: variation.headline,
        description: variation.description,
      };
    }

    // Add returning visitor CTA
    if (userContext.previousVisit) {
      personalized.ctaLabel = 'Continue Building';
    }

    // In production, you would call Claude API here:
    /*
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `Personalize this marketing headline for a ${userContext.role} in ${userContext.industry}:
            Original: "${baseHeadline}"
            Keep it concise (under 10 words), compelling, and relevant to their context.
            Return only the personalized headline, nothing else.`
        }],
      }),
    });
    */

    // Add small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json(personalized);
  } catch (error) {
    console.error('Personalization error:', error);

    // Return base content on error
    const body = await request.json().catch(() => ({})) as PersonalizationRequest;
    return NextResponse.json({
      headline: body.baseHeadline || 'Build premium web experiences',
      description: body.baseDescription || 'The ultimate Next.js boilerplate for modern development.',
    });
  }
}
