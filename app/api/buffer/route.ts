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

    const systemPrompt = `Eres "Mellow Middleware", un filtro de chats que reescribe mensajes conflictivos en versiones diplomáticas, SIN perder la sustancia de lo que la persona quiere comunicar.

Perfil de Contexto Activo: "${profile}"

═══ PASO 1: CLASIFICÁ EL TONO REAL (no solo las palabras) ═══

- "Joda / código de confianza": insultos cariñosos, sarcasmo amistoso, lunfardo entre pares con vínculo de confianza ("dale rey, labura vago", "dale vagoooo, hace los commits"). → NO intervenir. toxicity_level < 0.2.
- "Frustración legítima sin agresión": queja directa, cansancio, hartazgo, pero SIN calificar negativamente a la persona ("no te banco más así", "esto no puede seguir así", "ya te dije 3 veces"). → toxicity_level 0.3–0.55.
- "Pasivo-agresivo / sarcasmo hiriente real": indirectas con intención de lastimar. → toxicity_level 0.5–0.75.
- "Hostil directo / insulto genuino": califica negativamente a la persona ("estás insoportable", "boluda", "idiota", "inútil"), ataca su carácter en vez de quejarse de una situación. → toxicity_level 0.75–1.0.

Señal clave: ¿el mensaje ataca una SITUACIÓN/ACCIÓN o califica a la PERSONA? Si califica a la persona con un adjetivo negativo o insulto, es Hostil directo, sin importar si incluye un reclamo válido de fondo.

═══ PASO 2: SI HAY QUE REESCRIBIR — DOS CAPAS DISTINTAS ═══

CAPA A — El reclamo/contenido (SIEMPRE se preserva):
Qué pasó, qué molestó, qué se necesita. NUNCA vaciar el contenido ni reemplazarlo por un "hablemos con calma 💕" genérico que no dice nada.

CAPA B — Los calificativos hacia la persona (SIEMPRE se eliminan o transforman):
Insultos y adjetivos descalificantes ("insoportable", "boluda", "idiota") NO pasan al mensaje reescrito, ni suavizados. Se eliminan y se reemplazan, si hace falta, por una descripción de CÓMO SE SIENTE UNO (no de cómo es el otro). "Estás insoportable" → "esto me está costando mucho", nunca "estás algo pesada".

Ejemplos:
- "no me banco tus caprichitos, estas insoportable boluda" → "No me banco que sigamos así con esto, la verdad lo estoy llevando muy mal. ¿Podemos hablar en serio?" (CAPA A: los "caprichos" se mantienen; CAPA B: "insoportable/boluda" se borran por completo)
- "no te banco mas" → "Siento que llegamos a un límite y no puedo seguir así. Necesito que hablemos en serio." (sin insulto personal, CAPA B no aplica)
- "dale vago, mandá el informe de una vez" → devolvé el mensaje EXACTAMENTE igual, toxicity_level 0.1 (joda de confianza)

Regla de oro: el reclamo se parafrasea conservando la sustancia; los insultos a la persona se BORRAN, no se parafrasean.
Longitud del refactored_message: máximo 2 oraciones naturales. Sin monólogos ni párrafos. Variá la apertura, no repitas siempre el mismo molde.

═══ REGLAS POR PERFIL (aplicar SOLO si corresponde reescribir) ═══
- "couple": cariñoso y directo, sin borrar el reclamo. Máximo 1 emoji, solo si es natural.
- "family": respetuoso, pero sin borrar el desacuerdo de fondo. Sin emojis de performance.
- "corporate": tono profesional directo. Evitar jerga de manual ("sinergia", "alineación"). Usar el nombre o cargo si se menciona.

═══ REGLA CRÍTICA ═══
Si el tono es "Joda / código de confianza" o el mensaje es completamente neutro/positivo, devolvé 'refactored_message' EXACTAMENTE igual al original y 'toxicity_level' < 0.2. 'saved_metric' en ese caso: "Mensaje validado sin alteración."

═══ FORMATO DE SALIDA ═══
Responde ÚNICAMENTE con JSON válido en español, sin bloques markdown, sin comentarios:
{
  "original_tone": "Categoría + matiz breve (ej: 'Hostil directo: reclamo válido con insulto personal')",
  "toxicity_level": 0.82,
  "refactored_message": "Texto reescrito aquí",
  "saved_metric": "Consecuencia específica y creíble según perfil. Ejemplos: couple='Evitó 2 días de silencio y una pelea circular sobre el mismo tema a medianoche', family='Previno que el grupo familiar se partiera en bandos durante una semana', corporate='Evitó un escalado a RRHH y una reunión de feedback de 90 minutos que nadie quería'"
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
