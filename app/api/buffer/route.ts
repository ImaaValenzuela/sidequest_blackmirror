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
        if (lowercaseText.includes('sirviente') || lowercaseText.includes('platos') || lowercaseText.includes('esclavo') || lowercaseText.includes('cocina') || lowercaseText.includes('quilombo')) {
          refactored_message = '¡Hola amor! Cuando tengas un ratito libre, ¿me darías una mano con la cocina así nos queda impecable antes de cenar? Te amo. 💕';
          original_tone = 'Hostil acusatorio: reclamo sobre limpieza de la cocina';
          toxicity_level = 0.85;
          saved_metric = 'Evitó una pelea de 2 días sobre la división de tareas del hogar.';
        } else {
          refactored_message = 'Hola mi vida hermosa. Entiendo lo que dices y tienes toda la razón. Te pido una disculpa si soné tosco, sabes que te amo muchísimo y solo quiero que estemos bien. ¿Hablamos con calma al rato? 💕🥺';
          original_tone = 'Pasivo-agresivo e hiriente';
          toxicity_level = 0.9;
          saved_metric = 'Evitó que durmieras en el sillón y canceló una discusión cíclica de 3 días.';
        }
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

PERFIL "couple": El tono debe ser extremadamente empalagoso, dulce, cariñoso y de un romanticismo incondicional. Debe iniciar con un saludo afectuoso ("Hola mi amor", "Hola gordi", "Mi vida hermosa"), incluir expresiones explícitas de afecto ("te amo", "te quiero muchísimo", "gracias por ser tan lindo/a") y formular el pedido con absoluta suavidad y en positivo (ej: "¿me darías una manito con...", "¿te animás a...", "así nos queda hermoso a los dos"). NUNCA uses reclamos directos ni directivas frías como "necesito que colaboremos" o "¿podés encargarte de dejarla ordenada?".
  Ejemplo transformación:
  ENTRADA: "Estoy harto de que dejes los platos sucios. No soy tu sirviente."
  SALIDA: "¡Hola amor de mi vida! Cuando tengas un ratito libre, ¿me darías una mano con la cocina así nos queda impecable para cenar bien lindo? Te amo muchísimo. 💛"
  ENTRADA: "che posta, no se mi estas boludeando o si realmente pensas que soy tu esclavo, no podes dejar la cocina hecha un quilombo"
  SALIDA: "¡Hola gordi hermosa! ¿Me darías una manito ordenando la cocina cuando termines de usarla así nos queda impecable antes de cenar? Te amo muchísimo y te agradezco un montón. 💕"

PERFIL "family": El tono debe ser de un afecto familiar de domingo, sumamente comprensivo, cálido y conciliador. Debe iniciar con cariño ("Hola ma linda", "Hola pa", "Hola familia linda"), evitar cualquier tono de regaño o frustración fría, y cerrar con un beso o abrazo virtual.
  Ejemplo transformación:
  ENTRADA: "Siempre hacés lo que querés sin avisar, es un caos total."
  SALIDA: "¡Hola ma linda! Me da un poquito de miedo cuando no avisás tus planes porque se me complica coordinar. ¿Te animás a avisarme antes así nos organizamos re bien? Un beso enorme. 🥰"

PERFIL "corporate": El tono debe ser de una cortesía profesional corporativa impecable, optimista y constructiva. Agradece siempre la colaboración, valora el esfuerzo del otro y transforma las críticas duras en solicitudes colaborativas amables.
  Ejemplo transformación:
  ENTRADA: "Tu código es un desastre, arreglalo de una vez."
  SALIDA: "¡Hola! Muchas gracias por el avance. Estuve revisando el código y noté algunos detalles menores para ajustar antes del merge. ¿Te parece si los vemos juntos hoy para dejarlo impecable? ¡Muchas gracias!"

═══ REGLA CRÍTICA ═══
Si el tono es "Código de confianza" o el mensaje es neutro/positivo, devolvé 'refactored_message' EXACTAMENTE igual al original y 'toxicity_level' < 0.2.

Longitud del refactored_message: máximo 2 oraciones. Natural, fluido, pero sumamente pulido y sin atisbo de hostilidad o frialdad. Variá la estructura de apertura.

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
