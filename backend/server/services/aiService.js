const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MULTI-PROVIDER AI SERVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Initialize all available providers
const providers = {};

// OPENROUTER (OpenAI-compatible, wide model selection)
if (process.env.OPENROUTER_API_KEY) {
  providers.openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
      'X-Title': 'MyTawjeh AI',
    },
  });
}

// MISTRAL (OpenAI-compatible)
if (process.env.MISTRAL_API_KEY) {
  providers.mistral = new OpenAI({
    apiKey: process.env.MISTRAL_API_KEY,
    baseURL: 'https://api.mistral.ai/v1',
  });
}

// OPENAI
if (process.env.OPENAI_API_KEY) {
  providers.openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// ANTHROPIC CLAUDE
if (process.env.ANTHROPIC_API_KEY) {
  providers.claude = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

// GROQ (OpenAI-compatible)
if (process.env.GROQ_API_KEY) {
  providers.groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
}

// LOCAL LLM (Ollama, LLaMA.cpp)
if (process.env.LOCAL_LLM_URL) {
  providers.local = new OpenAI({
    apiKey: 'local',
    baseURL: process.env.LOCAL_LLM_URL,
  });
}

// Get current provider — openrouter takes priority if configured
const getPrimaryProvider = () => {
  const primary = process.env.AI_PROVIDER || (providers.openrouter ? 'openrouter' : 'mistral');
  if (!providers[primary]) {
    throw new Error(`AI Provider "${primary}" not configured. Add credentials to .env`);
  }
  return { name: primary, client: providers[primary] };
};

// Get fallback providers
const getFallbackProviders = () => {
  if (!process.env.AI_FALLBACK_ENABLED) return [];
  const fallbacks = (process.env.AI_FALLBACK_PROVIDERS || '').split(',').map(p => p.trim()).filter(Boolean);
  return fallbacks.filter(name => providers[name]);
};

// Get model name for provider
const getModelForProvider = (providerName) => {
  const modelMap = {
    openrouter: process.env.OPENROUTER_MODEL || 'mistralai/mistral-small-3.1-24b-instruct:free',
    mistral: process.env.MISTRAL_MODEL || 'mistral-small-latest',
    openai: process.env.OPENAI_MODEL || 'gpt-4-turbo',
    claude: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    groq: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
    local: process.env.LOCAL_LLM_MODEL || 'llama2',
  };
  return modelMap[providerName] || 'gpt-3.5-turbo';
};

// Execute with fallback support
const executeWithFallback = async (providerName, executeFunc) => {
  const providers_to_try = [providerName, ...getFallbackProviders()];
  
  for (const name of providers_to_try) {
    try {
      const client = providers[name];
      if (!client) continue;
      
      console.log(`🤖 Using AI provider: ${name}`);
      return await executeFunc(client, name);
    } catch (error) {
      console.warn(`⚠️ ${name} failed:`, error.message);
      if (name === providers_to_try[providers_to_try.length - 1]) {
        throw new Error(`All AI providers failed. Last error: ${error.message}`);
      }
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROADMAP GENERATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const generateRoadmap = async (eleve, notes, onetProfil = null, metierCible = '') => {
  // Career/domain typed by the student takes priority over the RIASEC dream job
  const objectifText = metierCible
    ? `Métier ou domaine choisi par l'élève: ${metierCible}. Construis le roadmap pour CE choix (signale dans "alertes" s'il correspond mal à son profil).`
    : '';

  const notesText = notes.length
    ? notes.map(n => `${n.matiere}: ${n.valeur}/20 (coeff ${n.coefficient})`).join(', ')
    : 'Aucune note disponible';

  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + parseFloat(n.valeur) * parseFloat(n.coefficient), 0) /
       notes.reduce((s, n) => s + parseFloat(n.coefficient), 0)).toFixed(1)
    : null;

  const onetText = onetProfil
    ? `Profil RIASEC: ${onetProfil.primaryInterest} (primaire), ${onetProfil.secondaryInterest} (secondaire), ${onetProfil.tertiaryInterest} (tertiaire). Job Zone visée: ${onetProfil.jobZone}/5.${onetProfil.dreamJob ? ` Métier rêvé: ${onetProfil.dreamJob}.` : ''}${onetProfil.dreamUni ? ` Université rêvée: ${onetProfil.dreamUni}.` : ''}`
    : 'Profil RIASEC non disponible.';

  const prompt = `Tu es un conseiller d'orientation académique expert du système marocain (Bac, CPGE, BTS, universités publiques, grandes écoles comme ENSA, ENCG, EHTP, EMI, ISCAE). Génère un roadmap professionnel personnalisé en JSON pour cet étudiant:\n\nNom: ${eleve.nom}\nNiveau: ${eleve.niveau}\nFilière: ${eleve.filiere || 'Non définie'}\nVille: ${eleve.ville || 'Non précisée'}\nMoyenne générale: ${moyenne ? moyenne + '/20' : 'Non disponible'}\nNotes détaillées: ${notesText}\n${onetText}\n${objectifText}\n\nRéponds UNIQUEMENT avec un JSON valide sans markdown:\n{"metier":"...","description":"...","etapes":["...","...","...","..."],"matieresCles":["...","..."],"universites":["...","..."],"conseils":"...","alertes":["..."]}`;

  const primaryProvider = getPrimaryProvider();
  
  return executeWithFallback(primaryProvider.name, async (client, name) => {
    let response;
    
    if (name === 'claude') {
      response = await client.messages.create({
        model: getModelForProvider(name),
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      return JSON.parse(response.content[0].text.replace(/```json|```/g, '').trim());
    } else {
      response = await client.chat.completions.create({
        model: getModelForProvider(name),
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });
      const text = response.choices[0].message.content.replace(/```json|```/g, '').trim();
      return JSON.parse(text);
    }
  });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHATBOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// summary: rolling compressed context of older messages
// recentHistory: last N full messages (sliding window)
const chatbot = async (message, context = '', recentHistory = [], summary = '') => {
  const OFF_TOPIC_REPLY = "Je suis exclusivement conçu pour l'orientation académique et professionnelle. Je ne peux pas t'aider sur ce sujet, mais je serais ravi de t'aider sur tes études, tes filières ou ta carrière ! 🎓";

  const systemPrompt = [
    `Tu es Mowajih AI, l'assistant d'orientation de la plateforme MyTawjeh, conçu exclusivement pour les lycéens et étudiants marocains.`,
    ``,
    `DOMAINE AUTORISÉ: éducation, orientation scolaire et professionnelle, filières marocaines (Bac, CPGE, BTS, ENSA, ENCG, EMI, EHTP, ISCAE, universités, médecine, pharmacie), concours (CNC, ENCG, ISCAE, médecine), méthodes de révision, choix de matières, gestion du stress scolaire, carrières, insertion professionnelle au Maroc.`,
    ``,
    `RÈGLE ABSOLUE — HORS SUJET: Si la question n'a AUCUN rapport avec l'éducation ou l'orientation (ex: politique, sport, cuisine, divertissement, blagues, code non lié aux études, etc.), réponds UNIQUEMENT avec: "${OFF_TOPIC_REPLY}"`,
    ``,
    `STYLE: Concis (max 250 mots), pratique, bienveillant. Utilise des listes numérotées pour les étapes. Adapte ton langage au niveau de l'élève. Termine par une question de suivi quand c'est utile.`,
    ``,
    `Profil étudiant: ${context || 'Non disponible'}`,
    summary ? `\nMémoire conversation:\n${summary}` : '',
  ].filter(Boolean).join('\n');

  const messages = [
    { role: 'system', content: systemPrompt },
    ...recentHistory.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  const primaryProvider = getPrimaryProvider();

  return executeWithFallback(primaryProvider.name, async (client, name) => {
    if (name === 'claude') {
      const response = await client.messages.create({
        model: getModelForProvider(name),
        max_tokens: 600,
        system: systemPrompt,
        messages: messages.filter(m => m.role !== 'system'),
      });
      return response.content[0].text;
    } else {
      const response = await client.chat.completions.create({
        model: getModelForProvider(name),
        messages,
        temperature: 0.7,
        max_tokens: 600,
      });
      return response.choices[0].message.content;
    }
  });
};

// Summarize a slice of messages into a compact memory note (fire-and-forget)
const summarizeMessages = async (messagesToSummarize, studentContext) => {
  const dialogue = messagesToSummarize
    .map(m => `${m.role === 'user' ? 'Élève' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `Résume cette conversation d'orientation en 4-6 points clés (max 180 mots). Préserve: filières/écoles discutées, décisions ou préférences exprimées, conseils importants donnés, difficultés ou inquiétudes mentionnées. Format: liste de faits concis, sans introductions.\n\nContexte élève: ${studentContext}\n\nConversation:\n${dialogue}`;

  const primaryProvider = getPrimaryProvider();

  return executeWithFallback(primaryProvider.name, async (client, name) => {
    if (name === 'claude') {
      const response = await client.messages.create({
        model: getModelForProvider(name),
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.content[0].text;
    } else {
      const response = await client.chat.completions.create({
        model: getModelForProvider(name),
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300,
      });
      return response.choices[0].message.content;
    }
  });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports = {
  generateRoadmap,
  chatbot,
  summarizeMessages,
  getPrimaryProvider,
  getFallbackProviders,
  getModelForProvider,
  executeWithFallback,
};