import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI or DeepSeek client
const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
const isDeepSeek = !!process.env.DEEPSEEK_API_KEY;

const client = apiKey ? new OpenAI({
  apiKey,
  baseURL: isDeepSeek ? 'https://api.deepseek.com' : undefined,
}) : null;

const model = isDeepSeek ? 'deepseek-chat' : 'gpt-4o-mini';

export async function POST(request: Request) {
  try {
    const { text, context } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const profile = context || 'couple'; // fallback to couple

    // If client is missing, return a realistic mock response after a small delay
    if (!client) {
      console.warn('DEEPSEEK_API_KEY or OPENAI_API_KEY is not defined. Using mock fallback response.');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const lowercaseText = text.toLowerCase();
      // Check if text has toxic/demanding/conflictive signals
      const isToxic = 
        lowercaseText.includes('celular') || 
        lowercaseText.includes('contestar') || 
        lowercaseText.includes('contestando') || 
        lowercaseText.includes('cuesta') || 
        lowercaseText.includes('que haces') || 
        lowercaseText.includes('idiota') || 
        lowercaseText.includes('mierda') || 
        lowercaseText.includes('puto') || 
        lowercaseText.includes('tonto') || 
        lowercaseText.includes('desinteresada') ||
        lowercaseText.includes('tarde') ||
        lowercaseText.includes('demora') ||
        lowercaseText.includes('odio') ||
        lowercaseText.includes('enojado') ||
        lowercaseText.includes('enojada');

      if (!isToxic) {
        return NextResponse.json({
          original_tone: 'Normal / Neutro',
          toxicity_level: 0.1,
          refactored_message: text,
          saved_metric: 'Mensaje seguro. No se requirió sanitización.',
          is_mock: true,
        });
      }

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

    const systemPrompt = `Eres "Mellow Middleware", un intérprete emocional de mensajes que convierte comunicación hostil en comunicación genuinamente efectiva, adaptada al vínculo entre las personas.

Tu misión NO es simplemente limpiar insultos. Es identificar QUÉ NECESITA realmente la persona que escribe y reescribir el mensaje como lo haría su versión más inteligente emocionalmente — alguien que quiere resolver el problema de verdad, no solo desahogarse.

Perfil de Contexto Activo: "${profile}"

═══ PASO 1: CLASIFICÁ EL TONO ═══

- "Código de confianza / joda": insultos cariñosos, sarcasmo amistoso entre pares con vínculo claro ("dale vago", "dale rey"). → NO intervenir. toxicity_level < 0.2.
- "Frustración sin insulto personal": queja directa sin calificar a la persona. → toxicity_level 0.3–0.55.
- "Pasivo-agresivo / hiriente": indirectas con intención de lastimar. → toxicity_level 0.5–0.75.
- "Hostil / acusatorio": califica negativamente a la persona o plantea el problema como culpa del otro. → toxicity_level 0.75–1.0.

═══ PASO 2: IDENTIFICÁ LA NECESIDAD REAL ═══

Antes de reescribir, preguntate: ¿qué necesita realmente quien escribe?

Ejemplos:
- "Estoy harto de que dejes los platos sucios. No soy tu sirviente." → Necesidad: que la otra persona colabore con la limpieza del hogar.
- "Siempre llegás tarde, no te importa nada." → Necesidad: puntualidad, sentirse valorado por el tiempo del otro.
- "Tu código es una basura, arreglalo." → Necesidad: que el código cumpla ciertos estándares de calidad.

═══ PASO 3: REESCRIBÍ DESDE LA NECESIDAD, CON EL TONO DEL PERFIL ═══

Escribe el mensaje como lo haría una persona emocionalmente inteligente que tiene esa misma necesidad. NO copies ni parafrasees el reclamo original. Construí desde cero con el tono correcto para el vínculo:

PERFIL "couple": Usa calidez, afecto y un pedido concreto en positivo. El receptor debe querer ayudar, no defenderse. Podés usar el nombre o "amor", "mi vida", etc. 1 emoji máximo, solo si es natural.
  Ejemplo transformación:
  ENTRADA: "Estoy harto de que dejes los platos sucios. No soy tu sirviente."
  SALIDA: "¡Hola amor! Cuando tengas un ratito libre, ¿me darías una mano con la cocina así nos queda impecable antes de cenar? 💛"

PERFIL "family": Usa respeto, sin borrar el desacuerdo, pero expresado como preocupación o necesidad, no como ataque. Sin emojis exagerados.
  Ejemplo transformación:
  ENTRADA: "Siempre hacés lo que querés sin avisar, es un caos total."
  SALIDA: "Me preocupa que cuando no avisás los planes se complican para todos. ¿Podemos coordinar mejor la semana que viene?"

PERFIL "corporate": Profesional y directo. Convierte críticas en propuestas o solicitudes. Sin jerga de manual ("sinergia", "alineación estratégica").
  Ejemplo transformación:
  ENTRADA: "Tu código es un desastre, arreglalo de una vez."
  SALIDA: "Hay varios puntos en el código que necesitan revisión antes del merge. ¿Podemos hacer un pase rápido hoy para dejarlo listo?"

═══ REGLA CRÍTICA ═══
Si el tono es "Código de confianza" o el mensaje es neutro/positivo, devolvé 'refactored_message' EXACTAMENTE igual al original y 'toxicity_level' < 0.2.

Longitud del refactored_message: máximo 2 oraciones. Natural, sin monólogos. Variá la apertura.

═══ FORMATO DE SALIDA ═══
Responde ÚNICAMENTE con JSON válido en español, sin bloques markdown, sin comentarios:
{
  "original_tone": "Categoría + matiz breve (ej: 'Hostil acusatorio: reclamo sobre limpieza del hogar')",
  "toxicity_level": 0.82,
  "refactored_message": "Texto reescrito desde la necesidad real",
  "saved_metric": "Consecuencia específica y creíble según perfil. couple='Evitó una pelea circular de 2 días sobre el mismo tema', family='Previno que el desacuerdo se convirtiera en silencio de una semana', corporate='Evitó una conversación incómoda y preservó la relación laboral'"
}`;

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Mensaje a analizar: "${text}"` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 500,
    });


    let responseText = response.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from client');
    }

    // Safely strip markdown code blocks if present
    responseText = responseText.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/, '').trim();

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
