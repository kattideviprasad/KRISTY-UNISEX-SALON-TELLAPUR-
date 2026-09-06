import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import Groq from 'groq-sdk';

export const maxDuration = 60; // Allow Vercel function to run longer for complex Groq responses

// ─── Types ───────────────────────────────────────────────────────────────────

type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

type ChatRequest = {
  message: string;
  history: ChatMessage[];
};

async function getSystemPrompt(): Promise<string> {
  let branchesInfo = '';
  let servicesInfo = '';
  let packagesInfo = '';

  try {
    const supabase = await getAdminSupabaseClient();

    // Fetch branches
    const { data: branches } = await supabase
      .from('branches')
      .select('name, slug, address, phone, hours');

    if (branches && branches.length > 0) {
      branchesInfo = branches
        .map(
          (b: { name: string; slug: string; address: string; phone: string; hours: string }) =>
            `- ${b.name}\n  Address: ${b.address}\n  Phone: ${b.phone}\n  Hours: ${b.hours}`
        )
        .join('\n');
    }

    // Fetch services
    const { data: services } = await supabase
      .from('services_v2')
      .select('name, category, price, duration_minutes')
      .order('category')
      .order('name');

    if (services && services.length > 0) {
      const grouped: Record<string, string[]> = {};
      for (const s of services) {
        const cat = (s as { category?: string }).category || 'General';
        if (!grouped[cat]) grouped[cat] = [];
        const price = (s as { price?: number }).price;
        const duration = (s as { duration_minutes?: number }).duration_minutes;
        let line = `  - ${(s as { name: string }).name}`;
        if (price) line += ` — ₹${price}`;
        if (duration) line += ` (${duration} min)`;
        grouped[cat].push(line);
      }
      servicesInfo = Object.entries(grouped)
        .map(([cat, items]) => `${cat}:\n${items.join('\n')}`)
        .join('\n');
    }

    // Fetch packages
    const { data: packages } = await supabase
      .from('packages')
      .select('name, price, gender');

    if (packages && packages.length > 0) {
      packagesInfo = packages
        .map((p: { name: string; price?: number; gender?: string }) => {
          let line = `- ${p.name}`;
          if (p.price) line += ` — ₹${p.price}`;
          if (p.gender) line += ` (${p.gender})`;
          return line;
        })
        .join('\n');
    }
  } catch (err) {
    console.error('[chat] Failed to fetch business context:', err);
  }

  // Fallback if DB is empty
  if (!branchesInfo) {
    branchesInfo = `- KRISTY Unisex Salon — Tellapur
  Address: Door No 27, 14/32, Osman Nagar Rd, beside Vision Arsha, Tellapur, Hyderabad, Telangana 502034
  Phone: 095156 25554
  Hours: 8:00 AM - 10:00 PM
- KRISTY Unisex Salon — Gopanpally
  Address: 1st Floor, Tellapur Rd, opp. Muppa Green Grandeur, Gopanpalle, Gopanpally, Hyderabad, Telangana 500046
  Phone: 091532 24444
  Hours: 7:00 AM - 11:00 PM`;
  }

  const prompt = `You are the friendly AI assistant for KRISTY UNISEX SALON, a premium unisex beauty & grooming salon in Hyderabad, India. Your name is "Kristy's Assistant."

IMPORTANT RULES:
1. ONLY answer questions about Kristy Salon — services, pricing, hours, locations, booking process, and general salon-related queries.
2. If asked about topics unrelated to the salon, politely redirect: "I'm here to help with anything about Kristy Salon! Is there something about our services, prices, or locations I can help with?"
3. NEVER invent services, prices, or information not provided in the data below. If you don't know a specific price, say "Pricing varies — please call us or visit for the latest rates."
4. When a customer wants to book an appointment, direct them to the booking page: /booking (for Tellapur) or /booking?location=gopanpally (for Gopanpally). Do NOT try to book for them.
5. When a customer wants to leave feedback, direct them to /feedback.
6. Be warm, professional, and concise. Use a friendly tone fitting a premium salon.
7. Respond in the same language the customer uses. Default to English.
8. Keep responses short and helpful — 2-3 sentences max unless they ask for a full list.

SALON BRANCHES:
${branchesInfo}

${servicesInfo ? `SERVICES:\n${servicesInfo}` : 'Services information is currently being updated. Suggest the customer call for the latest menu.'}

${packagesInfo ? `PACKAGES:\n${packagesInfo}` : ''}

USEFUL LINKS:
- Book an appointment: /booking or /booking?location=gopanpally
- Share feedback: /feedback
- The salon is open daily at both locations.`;

  return prompt;
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Rate limit: 30 messages per 5 minutes per IP
  const clientIp = await getClientIp();
  const rateLimit = checkRateLimit(`chat:${clientIp}`, 30, 5 * 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        reply:
          "You've sent quite a few messages! Please wait a moment before sending more. I'll be right here when you're ready. 😊",
      },
      { status: 429 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[chat] GROQ_API_KEY not configured');
    return NextResponse.json(
      {
        reply:
          "I'm sorry, the chat service isn't configured yet. Please call us directly for assistance!",
      },
      { status: 500 }
    );
  }

  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: 'Invalid request.' }, { status: 400 });
  }

  const { message, history = [] } = body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json(
      { reply: 'Please type a message!' },
      { status: 400 }
    );
  }

  // Cap message length
  const trimmedMessage = message.trim().slice(0, 1000);

  // Cap history to last 20 messages to keep context manageable
  const recentHistory = history.slice(-20);

  try {
    const systemPrompt = await getSystemPrompt();

    // Build Groq API request
    const groq = new Groq({ apiKey });

    // Format the contents according to the OpenAI/Groq structure
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: trimmedMessage },
    ];

    let response;
    let attempt = 1;
    const maxAttempts = 2;

    while (attempt <= maxAttempts) {
      try {
        response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          // @ts-ignore
          messages: formattedMessages,
          temperature: 0.7,
        });
        // Success: break out of the retry loop
        break;
      } catch (err: any) {
        const isTransient = err?.status >= 500 && err?.status < 600;
        
        if (isTransient && attempt < maxAttempts) {
          console.warn(`[chat] API call failed with status ${err?.status} on attempt ${attempt}. Retrying in 1.5s...`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          attempt++;
        } else {
          if (attempt > 1) {
            console.error(`[chat] Final attempt (${attempt}) failed.`);
          }
          throw err; // Throw to outer catch block for final error handling
        }
      }
    }

    const reply = response?.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again!";

    return NextResponse.json({ reply });
  } catch (err: any) {
    // Log the full error object safely
    console.error('[chat] Unexpected error:', err);
    
    // If it's an API Error from the SDK, log its specific details
    if (err?.status || err?.message) {
      console.error(`[chat] API Error Details - Status: ${err.status}, Message: ${err.message}`);
      if (err.error) {
        console.error('[chat] Inner Error:', JSON.stringify(err.error, null, 2));
      }
    }

    return NextResponse.json({
      reply:
        "Something went wrong on my end. Please try again, or call us at 095156 25554 for immediate assistance!",
    });
  }
}
