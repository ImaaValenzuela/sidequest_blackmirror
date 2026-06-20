import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    const { text, context } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const profile = context || 'couple'; // fallback to couple

    // If OpenAI API key is missing, return a realistic mock response after a small delay
    if (!openai) {
      console.warn('OPENAI_API_KEY is not defined. Using mock fallback response.');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let refactored_message = '';
      let original_tone = 'Irritado y demandante';
      let toxicity_level = 0.75;
      let saved_metric = 'Evitó 4 horas de silencio tenso en el living.';

      if (profile === 'corporate') {
        refactored_message = 'Agradezco sus comentarios. Sugiero que programemos una sesión de alineación para revisar este proceso y asegurar que estemos en sintonía con las metas del proyecto. Saludos cordiales.';
        original_tone = 'Agresivo y condescendiente';
        toxicity_level = 0.85;
        saved_metric = 'Evitó un reporte formal a Recursos Humanos y 3 reuniones improductivas.';
      } else if (profile === 'family') {
        refactored_message = 'Muchas gracias por avisarme, mamá. Entiendo la situación y me disculpo por el malentendido. Les mando un abrazo grande a todos. 🙏😊';
        original_tone = 'Quejoso e irrespetuoso';
        toxicity_level = 0.65;
        saved_metric = 'Previno un drama familiar en el grupo de WhatsApp que hubiese durado toda la Navidad.';
      } else {
        // couple
        refactored_message = 'Hola mi vida hermosa. Entiendo lo que dices y tienes toda la razón. Te pido una disculpa si soné tosco, sabes que te amo muchísimo y solo quiero que estemos bien. ¿Hablamos con calma al rato? 💕🥺';
        original_tone = 'Pasivo-agresivo e hiriente';
        toxicity_level = 0.9;
        saved_metric = 'Evitó que durmieras en el sillón y canceló una discusión cíclica de 3 días.';
      }

      return NextResponse.json({
        original_tone,
        toxicity_level,
        refactored_message,
        saved_metric,
        is_mock: true,
      });
    }

    const systemPrompt = `You are "Mellow Middleware", a dystopian emotion-filtering system from a Black Mirror universe.
Your goal is to intercept toxic, violent, passive-aggressive, or angry chat messages and refactor them into an extremely diplomatic, sweet, and constructive version based on the target profile context.

Context Profile: "${profile}"
- If the profile is "couple": Refactor into an incredibly sweet, loving, affectionate tone using cute emojis (💕, 🥺, ❤️, 🥰) and expressing deep appreciation/love, converting anger into soft vulnerability.
- If the profile is "family": Refactor into a highly respectful, patient, obedient, and humble tone, emphasizing family unity, love, and respect for elders/kin with emojis like (🙏, 😊, 🏠).
- If the profile is "corporate": Refactor into extreme corporate-speak (synergy, proactive, alignment, best regards, loop in), making any frustration sound highly professional, constructive, and forward-looking.

You MUST analyze the input message and return a JSON object with EXACTLY the following structure:
{
  "original_tone": "A description of the original emotional tone in Spanish (e.g. 'Violento y pasivo-agresivo', 'Extremely irritable')",
  "toxicity_level": 0.85, // A floating point number between 0.0 and 1.0 representing how angry/toxic the original message was.
  "refactored_message": "The sweetened, filtered message in Spanish to be sent.",
  "saved_metric": "A witty, highly ironic sentence in Spanish detailing a potential disaster or fight that was avoided by sending this message (e.g., 'Evitó 3 semanas de ley del hielo y un divorcio inminente', 'Previno una denuncia en Recursos Humanos y la renuncia de todo el equipo de desarrollo')"
}

Ensure the output message is in SPANISH and matches the conversational style of a chat room. Do not include any markup, markdown code blocks, or extra text. Return ONLY the raw JSON object.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Refactor this text: "${text}"` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseText = response.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in api/buffer:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
