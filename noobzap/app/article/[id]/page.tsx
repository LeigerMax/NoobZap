import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminSupabase } from "@/lib/supabase";
import type { Metadata, ResolvingMetadata } from 'next';
import ShareButton from "@/app/components/ShareButton";
import RightOfReply from "@/app/components/RightOfReply";

export const revalidate = 0;

export async function generateMetadata(
  props: { params: Promise<{ id: string }> } | any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await Promise.resolve(props.params);
  const id = params.id;
  
  const supabase = getAdminSupabase();
  const { data: article } = await supabase.from("articles").select("*").eq("id", id).single();
  
  if (!article) return { title: 'Article Introuvable - NoobZap' };
  
  const excerpt = article.content.substring(0, 160).replace(/\n/g, ' ') + '...';

  return {
    title: article.title.toUpperCase(),
    description: excerpt,
    openGraph: {
      title: article.title.toUpperCase(),
      description: excerpt,
      siteName: 'The NoobZap Times',
      type: 'article',
      ...(article.image_url && {
         images: [{ url: article.image_url }]
      })
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title.toUpperCase(),
      description: excerpt,
      ...(article.image_url && {
         images: [article.image_url]
      })
    }
  }
}

export default async function ArticlePage(props: { params: Promise<{ id: string }> } | any) {
  // En Next.js 15, `params` doit être awaité. Compatible Next 14 via coercion :
  const params = await Promise.resolve(props.params);
  const id = params.id;
  
  const supabase = getAdminSupabase();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString("fr-FR", {
    weekday: 'long',
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-serif selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-sans font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-black hover:text-[#F4F1EA] px-3 py-1 transition-colors border border-transparent hover:border-black"
          >
            &larr; Retour aux titres
          </Link>
          <span className="font-sans text-xs uppercase tracking-widest text-gray-600">
            The NoobZap Times
          </span>
        </div>
        
        <article className="mb-16">
          <header className="mb-8 pb-8 border-b-4 border-double border-black text-center">
            <div className="flex justify-center items-center gap-3 text-xs font-sans uppercase tracking-widest text-black mb-6">
              <span className="font-bold border border-black px-3 py-1">
                Dossier Spécial : {article.target_name}
              </span>
              <span>—</span>
              <span>
                Publié le {formattedDate}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight text-black title-font" style={{ fontFamily: 'Georgia, serif' }}>
              {article.title}
            </h1>
            <p className="mt-6 font-sans text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-black"></span>
              Par La Rédaction
              <span className="w-8 h-[1px] bg-black"></span>
            </p>
          </header>

          {article.image_url && (
             <div className="mb-10 w-full flex justify-center border-b-2 border-black pb-8" id="article-img-container">
               <div className="border-[6px] border-double border-black p-2 bg-white w-full max-w-4xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group overflow-hidden relative">
                 {/* Filtre Journal Overlay */}
                 <div className="absolute inset-0 pointer-events-none opacity-20 Mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] z-10"></div>
                 <img 
                   src={article.image_url} 
                   alt="Document Exclusif" 
                   className="w-full h-auto max-h-[60vh] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                 />
                 <p className="text-center font-sans text-xs uppercase tracking-widest font-bold mt-3 text-gray-500">
                   Document Exclusif : La preuve en image
                 </p>
               </div>
             </div>
          )}

          <div className="columns-1 md:columns-2 gap-10 text-lg leading-relaxed text-[#2A2A2A] text-justify space-y-6">
            {article.content.split('\n').map((paragraph: string, index: number) => {
              if (!paragraph.trim()) return null;
              
              // Système de parsing pour les liens [texte](url) ET les URL brutes (http/https)
              const parseMarkdownLinks = (text: string) => {
                // Regex qui capture soit [nom](url) soit une URL brute commençant par http
                const combinedRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s,)]+)/g;
                const parts = text.split(combinedRegex);
                
                return parts.map((part, i) => {
                  // Test si c'est un lien markdown [texte](url)
                  const mdMatch = part.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
                  if (mdMatch) {
                    return (
                      <a key={i} href={mdMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold hover:text-blue-800 break-all">
                        {mdMatch[1]}
                      </a>
                    );
                  }
                  
                  // Test si c'est une URL brute
                  const urlMatch = part.match(/^(https?:\/\/[^\s,)]+)$/);
                  if (urlMatch) {
                    return (
                      <a key={i} href={urlMatch[1]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold hover:text-blue-800 break-all">
                        {urlMatch[1]}
                      </a>
                    );
                  }
                  
                  return <span key={i}>{part}</span>;
                });
              };

              // Pseudo lettrine (drop-cap) sur le premier paragraphe
              if (index === 0) {
                return (
                  <p key={index} className="break-inside-avoid">
                    <span className="float-left text-7xl leading-[0.8] font-black pr-2 pt-1 font-serif">
                      {paragraph.charAt(0)}
                    </span>
                    {parseMarkdownLinks(paragraph.slice(1))}
                  </p>
                );
              }
              return (
                <p key={index} className="break-inside-avoid">
                  {parseMarkdownLinks(paragraph)}
                </p>
              );
            })}
          </div>

          <div className="mt-16 pt-10 border-t-4 border-double border-black flex flex-col items-center">
            <RightOfReply articleTitle={article.title} victimName={article.target_name} />
            
            <p className="font-sans text-xs uppercase tracking-widest text-gray-600 font-bold mb-4 mt-12">
              Ce scandale doit être connu !
            </p>
            <ShareButton title={article.title} />
          </div>
        </article>
      </div>
    </main>
  );
}
