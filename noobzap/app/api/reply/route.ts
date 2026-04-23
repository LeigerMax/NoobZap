import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '@/lib/config';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  try {
    if (!genAI) {
      return NextResponse.json({ error: 'Clé API Gemini manquante' }, { status: 500 });
    }

    const { articleTitle, victimName } = await request.json();

    if (!articleTitle || !victimName) {
      return NextResponse.json({ error: 'Titre et nom requis' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: config.geminiModel });

    const prompt = `
      Tu es ${victimName}. Tu viens de te faire humilier publiquement par un article de presse satirique intitulé : "${articleTitle}".
      Invente une excuse pathétique, de mauvaise foi totale et absolument pas crédible pour te justifier ou nier les faits.
      Sois bref (maximum 50 mots). Ton ton doit être celui d'une personne prise en flagrant délit qui bafouille une excuse ridicule.
      Ne mets pas de guillemets, réponds juste par le texte de l'excuse.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error("Erreur droit de réponse :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
