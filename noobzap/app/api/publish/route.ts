import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';

// Aucune logique IA ici, uniquement de la persistance BDD pure
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, target_name, image_url } = body;

    if (!title || !content || !target_name) {
      return NextResponse.json(
        { error: 'Données incomplètes (Titre, contenu, ou cibles manquants).' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminSupabase();

    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert({
        title,
        content,
        target_name,
        image_url
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur d'insertion DB :", error);
      return NextResponse.json({ error: "Échec de l'insertion dans la base de données." }, { status: 500 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const articleUrl = `${protocol}://${host}/article/${data.id}`;

    // Notification Discord Webhook
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      try {
        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🗞️ **ÉDITION SPÉCIALE !** Nouvel article sur **${target_name}** !`,
            embeds: [
              {
                title: title.toUpperCase(),
                description: content.substring(0, 200) + '...',
                url: articleUrl,
                color: 0x000000,
                image: image_url ? { url: image_url } : undefined,
                footer: { text: "The NoobZap Times - Le journal qui ne dort jamais" },
                timestamp: new Date().toISOString()
              }
            ]
          })
        });
      } catch (webhookError) {
        console.error("Erreur Webhook Discord :", webhookError);
        // On ne bloque pas la réponse si le webhook échoue
      }
    }

    return NextResponse.json({
      success: true,
      articleUrl: articleUrl,
      data: data
    });

  } catch (error: any) {
    console.error("Erreur critique sur publish :", error);
    return NextResponse.json({ error: error.message || 'Erreur interne de publication' }, { status: 500 });
  }
}
