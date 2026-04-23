import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function Home(props: { searchParams?: any }) {
  // Await searchParams pour supporter Next 15 tout en marchant en Next 14 via coercion
  const searchParams = await Promise.resolve(props.searchParams || {});
  const cible = searchParams?.cible as string | undefined;

  const supabase = getAdminSupabase();
  
  // Mettre à jour le SELECT pour ramener 'content' pour faire l'excerpt
  const { data: allArticles, error } = await supabase
    .from("articles")
    .select("id, title, content, target_name, created_at, image_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur de récupération des articles :", error);
  }

  // 1. Calcul du classement global (sans filtre)
  const honteMap: Record<string, number> = {};
  if (allArticles) {
    allArticles.forEach((a: any) => {
       const targets = a.target_name.split(',').map((t: string) => t.trim()).filter(Boolean);
       targets.forEach((t: string) => {
         honteMap[t] = (honteMap[t] || 0) + 1;
       });
    });
  }
  const classementDeLaHonte = Object.entries(honteMap)
     .sort((a, b) => b[1] - a[1]);

  // 2. Application du filtre victime pour l'affichage de la grille
  let articlesToShow = allArticles || [];
  if (cible && allArticles) {
    articlesToShow = allArticles.filter((a: any) => 
      a.target_name.toLowerCase().includes(cible.toLowerCase())
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-serif selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {/* Actions UI au-dessus du journal */}
        <div className="flex justify-end mb-4">
          <Link 
            href="/ajouter" 
            className="inline-block bg-black text-[#F4F1EA] hover:bg-gray-800 px-5 py-2 text-xs font-sans uppercase tracking-widest font-bold transition-transform hover:-translate-y-0.5 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
          >
            + Rédiger un Scandale
          </Link>
        </div>

        {/* Masthead (En-tête du journal) */}
        <header className="mb-12 border-b-4 border-double border-black pb-6 text-center">
          <div className="flex justify-between items-center text-xs font-sans uppercase tracking-widest border-b border-black pb-2 mb-2">
            <span>Édition Spéciale</span>
            <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="hidden sm:inline">Nouvelles de Noobs</span>
          </div>

          {/* Marquee Dernière Minute */}
          <div className="bg-black text-yellow-400 py-1.5 overflow-hidden whitespace-nowrap border-y-2 border-black mb-6 flex items-center relative">
            <div className="bg-black z-20 px-3 border-r border-yellow-400 relative h-full flex items-center">
              <span className="font-sans font-black text-[10px] uppercase shrink-0">Dernière Minute</span>
            </div>
            
            <div className="relative flex-grow overflow-hidden">
              <div className="marquee-content inline-block hover:pause">
                <span className="inline-block px-10 text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                  FLASH INFO : Maxime chercherait toujours le point-virgule manquant de son code +++ Le frère de David vient encore d'ennuyer Miguel avec ses enfants +++ Lucas hurle sur Rust tandis que son serveur appartient à Maxime +++ Record d'absence : Loïc dépasse Miguel de 3 semaines +++ Miguel confirme sa place de dernier sur tous les serveurs de jeu +++ Le chômage de Maxime : une opportunité pour ses compilations YouTube +++ 
                </span>
                <span className="inline-block px-10 text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                  FLASH INFO : Maxime chercherait toujours le point-virgule manquant de son code +++ Le frère de David vient encore d'ennuyer Miguel avec ses enfants +++ Lucas hurle sur Rust tandis que son serveur appartient à Maxime +++ Record d'absence : Loïc dépasse Miguel de 3 semaines +++ Miguel confirme sa place de dernier sur tous les serveurs de jeu +++ Le chômage de Maxime : une opportunité pour ses compilations YouTube +++ 
                </span>
              </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .marquee-content {
                display: inline-block;
                animation: marquee 30s linear infinite;
              }
              .marquee-content:hover {
                animation-play-state: paused;
              }
            `}} />
          </div>

          <Link href="/">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black mb-2 title-font hover:opacity-80 transition-opacity" style={{ fontFamily: 'Georgia, serif' }}>
              The NoobZap Times
            </h1>
          </Link>
          <p className="text-sm md:text-md italic text-gray-700 font-serif max-w-2xl mx-auto">
            "Le journal satirique automatisé qui publie tout ce que l'on n'ose pas dire, rédigé par une IA cynique."
          </p>
        </header>

        {error ? (
          <div className="p-6 border border-black bg-red-50 text-center font-sans">
            <strong>AVIS AUX LECTEURS:</strong> Les presses sont bloquées (Erreur de base de données).
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Colonne Principale (Articles) */}
            <div className="lg:w-3/4">
              {cible && (
                <div className="mb-8 p-4 bg-black text-[#F4F1EA] font-sans text-sm font-bold uppercase tracking-widest flex justify-between items-center shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <span>Dossier sur : {cible}</span>
                  <Link href="/" className="hover:text-red-400 underline decoration-red-400 transition-colors">Vider le filtre &times;</Link>
                </div>
              )}

              {articlesToShow.length === 0 ? (
                <div className="text-center py-20 border-t border-b border-black">
                  <p className="text-xl italic">Aucun scandale à l'horizon. La rédaction sommeille...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {articlesToShow.map((article: any, index: number) => {
                    // Les cibles en tableau pour pouvoir les rendre cliquables individuellement
                    const victimNames = article.target_name.split(',').map((t: string) => t.trim()).filter(Boolean);

                    return (
                      <div key={article.id} className={`flex flex-col h-full ${index > 1 ? 'border-t border-black pt-6 md:border-t-[3px] md:border-double md:border-black' : ''}`}>
                        <div className="flex flex-col flex-grow">
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {victimNames.map((name: string) => (
                                <Link 
                                  href={`/?cible=${encodeURIComponent(name)}`} 
                                  key={name}
                                  className="font-sans text-[10px] uppercase font-bold tracking-widest border border-black bg-white hover:bg-black hover:text-white transition-colors px-2 py-0.5 relative z-10"
                                >
                                  Cible: {name}
                                </Link>
                              ))}
                            </div>
                            
                            <Link href={`/article/${article.id}`} className="group block">
                              {article.image_url && (
                                <div className="mb-4 border-2 border-black aspect-video relative group-hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all bg-gray-200 overflow-hidden">
                                   {/* Filtre Journal Overlay */}
                                   <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] z-10"></div>
                                   <img 
                                     src={article.image_url} 
                                     alt="Illustration de l'article" 
                                     className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" 
                                   />
                                </div>
                              )}
                              <h2 className="text-3xl uppercase font-black leading-tight text-black group-hover:underline decoration-4 underline-offset-4 decoration-gray-400 font-serif mb-3">
                                {article.title}
                              </h2>
                              <p className="text-base text-gray-800 font-serif line-clamp-4 leading-relaxed mb-4">
                                {article.content}
                              </p>
                            </Link>
                          </div>
                          
                          <div className="text-sm text-gray-600 font-sans italic mt-auto flex justify-between items-center border-t border-gray-300 pt-3">
                            <span>Par <strong className="text-black not-italic">ScandaleGPT</strong></span>
                            <span>
                              {new Date(article.created_at).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Colonne Droite (Le Classement de la Honte) */}
            <div className="lg:w-1/4">
              <div className="border-[6px] border-double border-black p-5 bg-white relative">
                {/* Bandeau effet scotch */}
                <div className="absolute -top-3 -right-3 bg-red-600 text-white font-sans text-[10px] uppercase font-black px-3 py-1 rotate-[5deg] shadow-lg">
                  Top Chronique !
                </div>
                
                <h3 className="font-black text-2xl uppercase tracking-tighter title-font mb-6 text-center border-b-[3px] border-black pb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Classement<br/>de la Honte
                </h3>
                
                <ul className="space-y-3 font-sans text-sm font-bold uppercase tracking-wider">
                  {classementDeLaHonte.length > 0 ? (
                    classementDeLaHonte.map(([nom, count], index) => (
                      <li key={nom} className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className={`flex justify-center items-center w-6 h-6 text-xs text-white ${index === 0 ? 'bg-red-600' : index === 1 ? 'bg-orange-500' : index === 2 ? 'bg-yellow-500 text-black' : 'bg-black'}`}>
                            {index + 1}
                          </span>
                          <Link href={`/?cible=${encodeURIComponent(nom)}`} className="hover:underline decoration-2 underline-offset-2">
                            {nom}
                          </Link>
                        </div>
                        <span className="font-black text-red-600 text-base">{count}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-400 normal-case italic text-xs">Amnistie générale</li>
                  )}
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
