/**
 * Topic Extractor
 * Extrae temas relevantes de las conversaciones con Marnee
 */

// Stopwords en español e inglés para filtrar
const STOPWORDS = new Set([
  // Español
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'que', 'y', 'en',
  'es', 'por', 'con', 'para', 'al', 'se', 'su', 'sus', 'lo', 'como', 'más', 'pero',
  'muy', 'sin', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde',
  'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese',
  'eso', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos',
  'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes',
  'nada', 'muchos', 'cual', 'poco', 'ella', 'estar', 'estas', 'algunas', 'algo',
  'nosotros', 'mi', 'mis', 'tú', 'te', 'ti', 'tu', 'tus', 'ellas', 'nosotras',
  'vosotros', 'vosotras', 'os', 'mío', 'mía', 'míos', 'mías', 'tuyo', 'tuya',
  'hola', 'gracias', 'por favor', 'ok', 'okay', 'si', 'sí', 'no', 'quiero', 'necesito',
  'puedo', 'puede', 'podemos', 'hacer', 'hago', 'hace', 'tengo', 'tiene', 'tienen',
  'ser', 'soy', 'eres', 'somos', 'son', 'estar', 'estoy', 'está', 'estamos', 'están',
  // Inglés
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'dare', 'ought', 'used', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'being', 'been', 'have', 'has', 'had', 'having',
  'hi', 'hello', 'thanks', 'thank', 'please', 'yes', 'no', 'okay', 'ok'
]);

/**
 * Extrae frases clave de un texto
 * @param {string} text - Texto del mensaje
 * @returns {string[]} - Array de frases clave
 */
function extractKeyPhrases(text) {
  if (!text || typeof text !== 'string') return [];

  const phrases = [];
  const lowerText = text.toLowerCase();

  // Patrones para extraer frases clave (español e inglés)
  const patterns = [
    // "cómo puedo/crear/hacer <tema>"
    /c[oó]mo (?:puedo|crear|hacer|mejorar|optimizar|implementar) ([\w\s]+)/gi,
    // "necesito ayuda con <tema>"
    /necesito (?:ayuda con|saber sobre|entender) ([\w\s]+)/gi,
    // "quiero crear/aprender/mejorar <tema>"
    /quiero (?:crear|aprender|mejorar|desarrollar|hacer) ([\w\s]+)/gi,
    // "sobre <tema>"
    /sobre ([\w\s]{3,30})/gi,
    // "mi <tema>" (mi negocio, mi marca, etc.)
    /mi ([\w\s]{3,20})/gi,
    // "para <tema>"
    /para (?:mi|el|la|los|las) ([\w\s]{3,25})/gi,
    // Hashtags
    /#([\w]+)/g,
    // "help me with <topic>"
    /help (?:me )?(?:with|on|about) ([\w\s]+)/gi,
    // "how to <topic>"
    /how to ([\w\s]+)/gi,
    // "I want to <topic>"
    /i want to ([\w\s]+)/gi,
    // "my <topic>"
    /my ([\w\s]{3,20})/gi,
  ];

  patterns.forEach(pattern => {
    const matches = lowerText.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        const phrase = match[1].trim();
        if (isValidTopic(phrase)) {
          phrases.push(normalizePhrase(phrase));
        }
      }
    }
  });

  // También extraer sustantivos/frases significativas (2-4 palabras)
  const words = lowerText
    .replace(/[^\w\sáéíóúüñ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w));

  // Agregar palabras únicas significativas
  words.forEach(word => {
    if (isValidTopic(word) && word.length > 4) {
      phrases.push(normalizePhrase(word));
    }
  });

  return [...new Set(phrases)]; // Eliminar duplicados
}

/**
 * Normaliza una frase (capitaliza primera letra)
 */
function normalizePhrase(phrase) {
  const trimmed = phrase.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Valida si un topic es válido
 */
function isValidTopic(topic) {
  if (!topic || typeof topic !== 'string') return false;

  const trimmed = topic.trim().toLowerCase();

  // Filtrar muy cortos o muy largos
  if (trimmed.length < 3 || trimmed.length > 50) return false;

  // Filtrar si tiene muchas palabras
  if (trimmed.split(' ').length > 4) return false;

  // Filtrar stopwords
  if (STOPWORDS.has(trimmed)) return false;

  // Filtrar si es solo números
  if (/^\d+$/.test(trimmed)) return false;

  return true;
}

/**
 * Extrae temas de múltiples conversaciones
 * @param {Array} conversations - Array de conversaciones con mensajes
 * @returns {Array<{topic: string, count: number}>} - Top temas con conteo
 */
export function extractTopicsFromConversations(conversations) {
  if (!conversations || !Array.isArray(conversations)) {
    return [];
  }

  const topicCounts = new Map();

  conversations.forEach(conv => {
    if (!conv?.messages || !Array.isArray(conv.messages)) return;

    // Solo mensajes del usuario (no del asistente)
    const userMessages = conv.messages
      .filter(m => m.role === 'user' && m.content)
      .map(m => m.content);

    userMessages.forEach(content => {
      const topics = extractKeyPhrases(content);

      topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });
  });

  // Retornar top 10 temas más mencionados
  return Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));
}

export default extractTopicsFromConversations;
