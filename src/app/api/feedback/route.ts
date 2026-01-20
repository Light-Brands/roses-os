import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Feedback API with AI Analysis
 *
 * Collects user feedback and optionally analyzes it with AI.
 */

interface FeedbackRequest {
  type: 'bug' | 'feature' | 'general' | 'praise';
  message: string;
  email?: string;
  pageUrl: string;
  userAgent: string;
  timestamp: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  enableAI?: boolean;
}

// Simple keyword-based categorization
function categorizeFeedback(message: string, type: string): string[] {
  const categories: string[] = [type];
  const lowerMessage = message.toLowerCase();

  // Add relevant tags
  if (lowerMessage.includes('ui') || lowerMessage.includes('design') || lowerMessage.includes('look')) {
    categories.push('ui');
  }
  if (lowerMessage.includes('slow') || lowerMessage.includes('performance') || lowerMessage.includes('fast')) {
    categories.push('performance');
  }
  if (lowerMessage.includes('error') || lowerMessage.includes('crash') || lowerMessage.includes('broken')) {
    categories.push('error');
  }
  if (lowerMessage.includes('mobile') || lowerMessage.includes('phone') || lowerMessage.includes('tablet')) {
    categories.push('mobile');
  }
  if (lowerMessage.includes('documentation') || lowerMessage.includes('docs') || lowerMessage.includes('guide')) {
    categories.push('documentation');
  }

  return [...new Set(categories)];
}

// Generate AI insight based on feedback
function generateInsight(type: string, sentiment: string, message: string): string | null {
  // In production, use Claude API for real AI analysis
  // This is a simplified rule-based version

  if (type === 'bug' && sentiment === 'negative') {
    return "We're sorry you encountered this issue. Our team has been notified and will investigate promptly.";
  }

  if (type === 'feature') {
    return "Great suggestion! We're always looking for ways to improve based on user feedback like yours.";
  }

  if (type === 'praise') {
    return "Thank you for the kind words! Feedback like this motivates our team to keep improving.";
  }

  if (sentiment === 'negative') {
    return "We understand your frustration and appreciate you taking the time to let us know.";
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();

    // Validate required fields
    if (!body.type || !body.message) {
      return NextResponse.json(
        { error: 'Type and message are required' },
        { status: 400 }
      );
    }

    // Categorize feedback
    const categories = categorizeFeedback(body.message, body.type);

    // Generate AI insight
    const aiInsight = body.enableAI
      ? generateInsight(body.type, body.sentiment || 'neutral', body.message)
      : null;

    // In production, you would call Claude API here for better analysis:
    /*
    if (body.enableAI && process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: `Analyze this ${body.type} feedback and provide a brief, empathetic response (max 2 sentences):
              "${body.message}"
              Sentiment appears to be: ${body.sentiment}`
          }],
        }),
      });

      const aiResult = await response.json();
      aiInsight = aiResult.content[0].text;
    }
    */

    // Store in database (if Supabase is configured)
    try {
      const supabase = await createServerSupabaseClient();

      await supabase.from('analytics_events').insert({
        event_type: 'feedback',
        event_data: {
          feedback_type: body.type,
          message: body.message,
          email: body.email,
          sentiment: body.sentiment,
          categories,
          aiInsight,
        },
        page_url: body.pageUrl,
        user_agent: body.userAgent,
      });
    } catch (dbError) {
      // Log but don't fail if DB insert fails
      console.warn('Failed to store feedback in database:', dbError);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      categories,
      aiInsight,
      aiSummary: `${body.type} feedback received with ${body.sentiment || 'neutral'} sentiment`,
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving feedback (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get feedback from analytics_events
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'feedback')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Feedback GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
