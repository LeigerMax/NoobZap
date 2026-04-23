import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAdminSupabase } from '@/lib/supabase';
import { config } from '@/lib/config';
import { victimsData } from '@/lib/victims';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  try {
    // Retrait de la vérification du jeton demandée par l'utilisateur
    if (!genAI) {
      return NextResponse.json({ error: 'Clé API Gemini manquant' }, { status: 500 });
    }

    const body = await request.json();
    const { targets = [], customTarget = "", context, link = "", draft, instruction, manualImage = "" } = body;

    // Regrouper les cibles validées
    const finalTargets: string[] = [...targets];
    if (customTarget && customTarget.trim() !== "") {
      finalTargets.push(customTarget.trim());
    }

    if (finalTargets.length === 0 && !draft) {
      return NextResponse.json(
        { error: 'Au moins une cible et un contexte sont requis' },
        { status: 400 }
      );
    }

    const joinedTargets = finalTargets.join(', ');

    // Récupérer le Lore des cibles connues
    const loreText = finalTargets.map(name => {
      // Comparaison insensible à la casse
      const victim = victimsData.find(v => v.name.toLowerCase() === name.toLowerCase());
      if (victim) {
        return `- ${victim.name} : ${victim.lore}`;
      }
      return null;
    }).filter(Boolean).join('\n');

    const model = genAI.getGenerativeModel({ model: config.geminiModel });

    let prompt = "";

    // MODE RE-GÉNÉRATION (Refine)
    if (draft && instruction) {
      prompt = `
        Tu es le rédacteur cynique et sarcastique d'un blog satirique ("The NoobZap Times").
        Tu as déjà généré (ou on t'a fourni) le brouillon d'article suivant concernant les cibles [${joinedTargets}] :
        
        TITRE ACTUEL : ${draft.title}
        CONTENU DE L'ARTICLE : ${draft.content}
        
        Cependant, le Rédacteur en Chef exige la modification / correction suivante : "${instruction}".
        
        Ta tâche : Réécris ou corrige l'article en appliquant scrupuleusement la modification demandée (tout en conservant ton ton moqueur et sans pitié).

        RÉPONDS **UNIQUEMENT** PAR UN OBJET JSON VALIDE avec la structure :
        {
          "title": "nouveau titre si besoin", 
          "content": "nouveau contenu"
        }
        Ne renvoie jamais de blocs Markdown automatiques, juste le JSON pur.
      `;
    } 
    // MODE GÉNÉRATION INITIALE
    else {
      prompt = `
        Tu es l'auteur sarcastique, intelligent, et hilarant d'un blog satirique automatisé.
        Ton rôle est de te moquer gentiment (mais de manière très piquante) des amis du créateur du blog.
        
        La (ou les) cible(s) d'aujourd'hui : "${joinedTargets}".
        Voici l'anecdote ou le contexte fourni pour ce clash : "${context}".

        ${loreText ? `Voici du passif (lore) sur ces cibles :\n${loreText}\n\nATTENTION : Ne récite surtout pas tout ce passif ! Pioche au hasard un ou deux éléments subtils pour y faire une allusion piquante, uniquement si ça s'y prête machiavéliquement.` : ''}
        
        ${link ? `Un lien a été fourni en lien avec ce scandale : "${link}". Demande-toi si ce lien est pertinent pour humilier la cible ou enrichir l'article. Si OUI, intègre-le naturellement dans ton texte (format markdown ou HTML). Si NON, ignore-le purement et simplement.` : ''}

        Génère un article COURT et INCISIF (maximum 3-4 paragraphes), qui ridiculise la situation avec beaucoup d'humour noir ou sarcastique, sans être bannissable ni trop injurieux. 
        Sois direct, percutant et va droit au but. Utilise un style bien exagéré, journalistique et satirique.
        
        RÉPONDS **UNIQUEMENT** PAR UN OBJET JSON VALIDE avec les clés suivantes :
        {
          "title": "Un titre d'article super accrocheur et putaclic",
          "content": "Le contenu de l'article formaté avec des passages à la ligne via des anti-slash n."
        }
        N'ajoute aucun markdown (\`\`\`json) autour de la réponse, juste le JSON brut.
      `;
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let articleData = { title: '', content: '' };

    try {
      const cleanJsonStr = responseText.replace(/```json\n?|```/g, '').trim();
      articleData = JSON.parse(cleanJsonStr);
    } catch (parseError) {
      console.error("Erreur de parsing de la réponse Gemini :", responseText);
      return NextResponse.json(
        { error: 'Erreur lors de la génération (le format retourné n\'était pas un JSON valide).' },
        { status: 500 }
      );
    }

    // Uniquement l'URL manuelle si fournie, plus de génération IA
    const finalImageUrl = manualImage && manualImage.trim() !== "" ? manualImage.trim() : (draft?.image_url || "");

    // ON RETOURNE LES DONNÉES SANS PUBLIER EN BDD ICI (La séparation a eu lieu)
    return NextResponse.json({
      success: true,
      data: {
        title: articleData.title,
        content: articleData.content,
        target_name: joinedTargets,
        image_url: finalImageUrl
      }
    });

  } catch (error: any) {
    console.error("Erreur générale :", error);
    return NextResponse.json({ error: error.message || 'Erreur interne du serveur' }, { status: 500 });
  }
}
