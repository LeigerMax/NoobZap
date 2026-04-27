import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase";
import { Dices, ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 0;

export default async function Home(props: { searchParams?: any }) {
  const searchParams = await Promise.resolve(props.searchParams || {});
  const cible = searchParams?.cible as string | undefined;
  const page = parseInt(searchParams?.page || '0');
  const limit = 8;
  const offset = page * limit;

  const supabase = getAdminSupabase();

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

  // 2. Application du filtre victime et pagination
  let filteredArticles = allArticles || [];
  if (cible && allArticles) {
    filteredArticles = allArticles.filter((a: any) =>
      a.target_name.toLowerCase().includes(cible.toLowerCase())
    );
  }

  const totalFiltered = filteredArticles.length;
  const articlesToShow = filteredArticles.slice(offset, offset + limit);
  const hasMore = offset + limit < totalFiltered;
  const hasLess = page > 0;

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
            <span className="hidden sm:inline">Prix : Ton estime</span>
          </div>

          {/* Marquee Dernière Minute */}
          <div className="bg-black text-yellow-400 py-1.5 overflow-hidden whitespace-nowrap border-y-2 border-black mb-6 flex items-center relative">
            <div className="bg-black z-20 px-3 border-r border-yellow-400 relative h-full flex items-center">
              <span className="font-sans font-black text-[10px] uppercase shrink-0">Dernière Minute</span>
            </div>

            <div className="relative flex-grow overflow-hidden">
              <div className="marquee-content inline-block hover:pause">
                <span className="inline-block px-10 text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                  FLASH INFO : Maxime chercherait toujours le point-virgule manquant de son code +++ Le frère de Miguel vient encore d'ennuyer Miguel avec ses enfants +++ Lucas hurle sur Rust +++ Record d'absence : Loïc dépasse Miguel de 3 semaines +++ Miguel confirme sa place de dernier sur tous les serveurs de jeu +++ Le chômage de Maxime : une opportunité pour ses compilations YouTube +++ Rose refuse de venir en vocal +++ Lucas a fait un pet foireux +++ Miguel a encore perdu sur R6S en fessant tomber en TK une personne de son équipe +++ Loïc a encore perdu sur R6S en se faisant TK par Miguel +++ Maxime est devenu fermier avec Rose (dans stardew valley) +++ Annette bientôt une sextape avec Loic ? +++ Un nouveau projet inutile de Maxime au lieu de chercher un vrai taff +++ Qui finira les secondaires en premier Lucas ou Rose ? +++ Loic s'est encore uriner en cours, la faute à l'eau +++ Miguel vient d'acheter un nouveau téléphone +++  Mika à refuser l'achat d'un nouvelle téléphone pour Miguel +++ Du sperme dans la piscine de Lucas, une enquête en cours pour identifier le coupable +++
                </span>
                <span className="inline-block px-10 text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
                  FLASH INFO : Maxime chercherait toujours le point-virgule manquant de son code +++ Le frère de Miguel vient encore d'ennuyer Miguel avec ses enfants +++ Lucas hurle sur Rust +++ Record d'absence : Loïc dépasse Miguel de 3 semaines +++ Miguel confirme sa place de dernier sur tous les serveurs de jeu +++ Le chômage de Maxime : une opportunité pour ses compilations YouTube +++ Rose refuse de venir en vocal +++ Lucas a fait un pet foireux +++ Miguel a encore perdu sur R6S en fessant tomber en TK une personne de son équipe +++ Loïc a encore perdu sur R6S en se faisant TK par Miguel +++ Maxime est devenu fermier avec Rose (dans stardew valley) +++ Annette bientôt une sextape avec Loic ? +++ Un nouveau projet inutile de Maxime au lieu de chercher un vrai taff +++ Qui finira les secondaires en premier Lucas ou Rose ? +++ Loic s'est encore uriner en cours, la faute à l'eau +++ Miguel vient d'acheter un nouveau téléphone +++  Mika à refuser l'achat d'un nouvelle téléphone pour Miguel +++
                </span>
              </div>
            </div>

            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .marquee-content {
                display: inline-block;
                animation: marquee 85s linear infinite;
              }
              .marquee-content:hover {
                animation-play-state: paused;
              }
              @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .animate-spin-slow {
                animation: spin-slow 8s linear infinite;
              }
            `}} />
          </div>

          <Link href="/">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black mb-2 title-font hover:opacity-80 transition-opacity" style={{ fontFamily: 'Georgia, serif' }}>
              The NoobZap Times
            </h1>
          </Link>
          <p className="text-sm md:text-md italic text-gray-700 font-serif max-w-2xl mx-auto">
            "Le journal satirique automatisé qui publie tout ce que l'on n'ose pas dire, rédigé par des enragés."
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {articlesToShow.map((article: any, index: number) => {
                      // Les cibles en tableau pour pouvoir les rendre cliquables individuellement
                      const victimNames = article.target_name.split(',').map((t: string) => t.trim()).filter(Boolean);

                      return (
                        <div 
                          key={article.id} 
                          className={`flex flex-col h-full 
                            ${index === 0 ? 'md:col-span-2 border-b-[4px] border-black pb-10 mb-4' : 'border-t border-black pt-6 md:border-t-[3px] md:border-double md:border-black'} 
                            ${index > 1 && index !== 0 ? '' : ''}`}
                        >
                          <div className={`flex flex-col h-full ${index === 0 ? 'md:flex-row gap-8' : ''}`}>
                            {/* Image Section */}
                            {article.image_url && (
                              <Link href={`/article/${article.id}`} className={`group block ${index === 0 ? 'md:w-1/2' : 'w-full'}`}>
                                <div className="mb-4 border-2 border-black aspect-video relative group-hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all bg-gray-200 overflow-hidden">
                                  <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] z-10"></div>
                                  <img
                                    src={article.image_url}
                                    alt="Illustration de l'article"
                                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                                  />
                                </div>
                              </Link>
                            )}

                            {/* Content Section */}
                            <div className={`flex flex-col flex-grow ${index === 0 ? 'md:w-1/2' : ''}`}>
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
                                  <h2 className={`${index === 0 ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl'} uppercase font-black leading-tight text-black group-hover:underline decoration-4 underline-offset-4 decoration-gray-400 font-serif mb-3`}>
                                    {article.title}
                                  </h2>
                                  <p className={`${index === 0 ? 'text-lg md:text-xl' : 'text-base'} text-gray-800 font-serif line-clamp-4 leading-relaxed mb-4`}>
                                    {article.content}
                                  </p>
                                </Link>
                              </div>

                              <div className="text-sm text-gray-600 font-sans italic mt-auto flex justify-between items-center border-t border-gray-300 pt-3">
                                <span>Par <strong className="text-black not-italic">{(() => {
                                  const auteurs = [
                                    "Jean-Michel Seum",
                                    "La Concierge du Discord",
                                    "L'Espion du Vocal",
                                    "Le Bot du Chômage",
                                    "Rédacteur en Rage",
                                    "La Fouine du Serveur",
                                    "Justin Ptitpeu",
                                    "Tonton H",
                                    "La maman de Miguel"
                                  ];
                                  return auteurs[Math.floor(Math.random() * auteurs.length)];
                                })()}</strong></span>
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
                        </div>
                      );
                    })}
                  </div>

                  {/* NAVIGATION ENTRE ÉDITIONS */}
                  <div className="mt-16 pt-8 border-t-[3px] border-double border-black flex justify-between items-center gap-4">
                    {hasMore ? (
                      <Link
                        href={`/?page=${page + 1}${cible ? `&cible=${encodeURIComponent(cible)}` : ''}`}
                        className="group flex-1 flex items-center justify-start gap-4 p-6 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                      >
                        <ChevronLeft size={32} className="group-hover:-translate-x-2 transition-transform" />
                        <div className="text-left">
                          <span className="block text-[10px] font-sans font-black uppercase tracking-widest opacity-60">Édition Précédente</span>
                          <span className="block text-xl font-black uppercase title-font">Plus de Scandales</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1 p-6 border-2 border-dashed border-gray-300 text-gray-300 flex items-center justify-start gap-4 opacity-50">
                        <ChevronLeft size={32} />
                        <span className="text-[10px] font-sans font-black uppercase">Fin des archives</span>
                      </div>
                    )}

                    <div className="hidden sm:flex flex-col items-center px-4">
                      <span className="text-[10px] font-sans font-black uppercase whitespace-nowrap">Page {page + 1}</span>
                      <div className="h-12 w-px bg-black my-2"></div>
                    </div>

                    {hasLess ? (
                      <Link
                        href={`/?page=${page - 1}${cible ? `&cible=${encodeURIComponent(cible)}` : ''}`}
                        className="group flex-1 flex flex-row-reverse items-center justify-start gap-4 p-6 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[-6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[-4px] hover:translate-y-1"
                      >
                        <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                        <div className="text-right">
                          <span className="block text-[10px] font-sans font-black uppercase tracking-widest opacity-60">Édition Suivante</span>
                          <span className="block text-xl font-black uppercase title-font">Retour au présent</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1 p-6 border-2 border-dashed border-gray-300 text-gray-300 flex flex-row-reverse items-center justify-start gap-4 opacity-50">
                        <ChevronRight size={32} />
                        <span className="text-[10px] font-sans font-black uppercase">Dernière minute</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Colonne Droite (Le Classement de la Honte) */}
            <div className="lg:w-1/4 flex flex-col gap-8">
              {/* Classement de la Honte */}
              <div className="border-[6px] border-double border-black p-5 bg-white relative">
                {/* Bandeau effet scotch */}
                <div className="absolute -top-3 -right-3 bg-red-600 text-white font-sans text-[10px] uppercase font-black px-3 py-1 rotate-[5deg] shadow-lg">
                  Top Chronique !
                </div>

                <h3 className="font-black text-2xl uppercase tracking-tighter title-font mb-6 text-center border-b-[3px] border-black pb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Classement<br />de la Honte
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

              {/* SECTION PARTENAIRE DYNAMIQUE */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-gray-400 flex-grow"></div>
                  <span className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-[0.2em]">Espace Partenaire</span>
                  <div className="h-px bg-gray-400 flex-grow"></div>
                </div>

                {(() => {
                  const allPromos = [
                    // 1. Chômage Maxime
                    <div key="maxime" className="border-2 border-black p-1 bg-white hover:rotate-1 transition-transform cursor-pointer">
                      <div className="border border-black p-3 flex flex-col">
                        <img src="/media/chomage.png" alt="Promo Chômage" className="w-full grayscale border-b border-black mb-2" />
                        <h4 className="font-black uppercase text-lg leading-none mb-1">Maxime Formation</h4>
                        <p className="text-[10px] italic leading-tight mb-2">"Pourquoi travailler quand on peut simuler ?"</p>
                        <div className="bg-black text-white text-[10px] font-bold text-center py-1 uppercase tracking-tighter">Devenez chômeur pro &rarr;</div>
                      </div>
                    </div>,
                    // 2. Miguel Phone
                    <div key="miguel-phone" className="border-2 border-black p-4 bg-yellow-50 flex flex-col gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                      <span className="text-[8px] font-bold text-blue-700 uppercase">Annonce Spéciale</span>
                      <div className="flex gap-3">
                        <div className="w-1/3 shrink-0">
                          <img src="/media/miguel-phone.png" alt="Miguel Phone" className="w-full grayscale brightness-110 contrast-125 border border-black" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-black text-sm uppercase leading-tight">Miguel Store</h4>
                          <p className="text-[9px] leading-tight font-serif text-gray-700">Le nouvel iPhone 16 est dispo. C'est le même que le 15, mais Miguel l'a déjà.</p>
                        </div>
                      </div>
                    </div>,
                    // 3. Rust Rage Lucas
                    <div key="lucas-rage" className="bg-black text-white p-4 border-l-8 border-red-600">
                      <h4 className="text-xl font-black uppercase italic tracking-tighter mb-1">RAGE DE RUST ?</h4>
                      <p className="text-[11px] font-sans leading-tight mb-2 opacity-90">Lucas vous apprend à insulter des mères en 4 langues différentes sur les serveurs officiels.</p>
                      <div className="border-t border-white/30 pt-2 flex justify-between items-center">
                        <span className="text-[9px] font-bold uppercase">Cours de hurlements</span>
                        <span className="bg-white text-black text-[9px] px-1 font-black underline">INSCRIPTION &rarr;</span>
                      </div>
                    </div>,
                    // 4. Loïc Absent
                    <div key="loic-absent" className="border border-dashed border-black p-4 text-center group cursor-help bg-white">
                      <p className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-black transition-colors">Votre encart ici ?</p>
                      <p className="text-xs italic font-serif mt-1">"Comme Loïc, disparaissez de la circulation sans laisser de traces."</p>
                      <p className="text-[9px] mt-2 font-sans opacity-50 underline">Offre spéciale : -50% si vous répondez aux vocaux.</p>
                    </div>,
                    // 5. Lucas Pizza
                    <div key="lucas-pizza" className="border-2 border-black p-1 bg-white hover:-rotate-1 transition-transform cursor-pointer">
                      <div className="border border-black p-3 flex flex-col">
                        <img src="/media/pizza.png" alt="Lucas Pizza" className="w-full grayscale border-b border-black mb-2" />
                        <h4 className="font-black uppercase text-lg leading-none mb-1">Lucas Pizza</h4>
                        <p className="text-[10px] italic leading-tight mb-2">"Cuites au lance-flammes directement sur Rust."</p>
                        <div className="bg-red-600 text-white text-[10px] font-bold text-center py-1 uppercase tracking-tighter">Commander (100% Soufre) &rarr;</div>
                      </div>
                    </div>,
                    // 6. Miguel TK Assurance
                    <div key="miguel-tk" className="border-2 border-black p-4 bg-blue-50 flex flex-col gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] group">
                      <div className="flex gap-3">
                        <div className="w-1/3 shrink-0">
                          <img src="/media/assurance.png" alt="TK Assurance" className="w-full grayscale border border-black" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-black text-sm uppercase leading-tight group-hover:text-blue-700 transition-colors">Miguel TK Assurance</h4>
                          <p className="text-[9px] leading-tight font-serif text-gray-700">Vous avez encore tué un allié ? On couvre les frais de réparation de votre réputation.</p>
                        </div>
                      </div>
                    </div>,
                    // 7. Rose Silence
                    <div key="rose-silence" className="border-x-4 border-black p-4 bg-gray-100 flex flex-col items-center text-center">
                      <img src="/media/silence.png" alt="Rose Silence" className="w-20 grayscale mb-3" />
                      <h4 className="font-black text-md uppercase leading-none mb-2">L'Art du Silence</h4>
                      <p className="text-[10px] font-serif italic mb-3">La méthode Rose pour ignorer les appels vocaux sans culpabiliser.</p>
                      <span className="text-[8px] border border-black px-2 py-0.5 uppercase font-bold hover:bg-black hover:text-white transition-colors cursor-pointer">Lire le manuel</span>
                    </div>,
                    // 8. Challenge Miguel
                    <div key="challenge" className="bg-yellow-400 border-2 border-black p-4 rotate-[-1deg] shadow-lg">
                      <h4 className="font-black text-xl uppercase tracking-tighter leading-none mb-2 text-black italic">CHALLENGE MIGUEL</h4>
                      <p className="text-[10px] font-bold text-black border-y border-black/20 py-2 mb-2">PRONOSTIC : Qui finira dernier de la game ce soir ?</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-black underline">CÔTE : 1.01 (MIGUEL)</span>
                        <span className="bg-black text-white px-2 py-1 text-[8px] font-bold">PARIER</span>
                      </div>
                    </div>,
                    // 9. Bingo Sexy (Text only)
                    // 9. Bingo Sexy (Refait)
                    <div key="bingo" className="bg-[#FF0080] text-white p-5 border-4 border-double border-white shadow-[0_0_20px_rgba(255,0,128,0.5)] rotate-1 hover:rotate-0 transition-all cursor-crosshair">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest border border-white px-2">Série : SÉM-01</span>
                        <Dices size={20} className="animate-spin-slow" />
                      </div>

                      <h4 className="text-2xl font-black uppercase text-center leading-none mb-1 title-font italic">BINGO</h4>
                      <p className="text-[8px] text-center uppercase tracking-widest mb-4 opacity-80">Édition "Plaisirs & Scandales"</p>

                      <div className="grid grid-cols-3 gap-1.5 mb-4">
                        {[
                          "Miguel TK", "Rage Lucas", "PC Maxime",
                          "Silence Rose", "Où est Loïc ?", "iPhone 17",
                          "Faille Rust", "TK Miguel", "Météo Seum"
                        ].map((item, i) => (
                          <div key={i} className="aspect-square bg-white text-[#FF0080] flex flex-col items-center justify-center p-1 text-center shadow-inner">
                            <span className="text-[6px] font-black uppercase leading-tight line-clamp-2">{item}</span>
                            <div className="mt-1 w-2 h-2 rounded-full border border-[#FF0080]/30"></div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-black/20 p-2 rounded text-center">
                        <p className="text-[7px] font-bold uppercase tracking-tighter italic">"Remplissez la grille, gagnez le mépris de vos amis."</p>
                      </div>
                    </div>,
                    // 10. Mamy Nenette
                    <div key="nenette" className="border-4 border-black p-4 bg-pink-100 flex flex-col gap-3 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:bg-pink-200 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start text-black">
                        <span className="bg-black text-white text-[8px] px-2 py-0.5 font-bold uppercase">Hotline 24/7</span>
                        <span className="text-[10px] font-black">08 36 65...</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-1/2 shrink-0">
                          <img src="/media/nenette.png" alt="Mamy Nenette" className="w-full grayscale border-2 border-black" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-black text-lg uppercase leading-none mb-1 text-black">Mamy Nenette</h4>
                          <p className="text-[9px] leading-tight font-serif italic text-gray-800">"Besoin de tendresse ou d'un trauma durable ? Appelle Mamy."</p>
                        </div>
                      </div>
                      <div className="border-t-2 border-black pt-2 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">3.50€ / minute + Prix d'un appel local</span>
                      </div>
                    </div>,
                    // 11. Rétroviseur
                    <div key="retro" className="border-2 border-black p-3 bg-white flex flex-col gap-2 hover:translate-x-1 hover:translate-y-1 transition-transform cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs">!</div>
                        <h4 className="font-black text-sm uppercase text-black">Auto-Rétro-Vision</h4>
                      </div>
                      <img src="/media/retro.png" alt="Rétroviseur" className="w-full grayscale border border-black mb-1" />
                      <p className="text-[9px] font-serif leading-tight text-gray-800">Votre rétroviseur est cassé ? On s'en fiche, regardez devant. Ou achetez celui-ci, il est hanté par l'ancien proprio.</p>
                      <div className="bg-black text-white text-center py-1 text-[8px] font-bold uppercase">Voir l'offre obsolète</div>
                    </div>,
                    // 12. OVNI
                    <div key="ufo" className="bg-green-900 text-green-100 p-5 border-2 border-green-500 shadow-[inset_0_0_10px_rgba(0,255,0,0.5)] font-mono relative overflow-hidden group cursor-pointer">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
                      <h4 className="text-xl font-black uppercase tracking-tighter mb-2 border-b border-green-500 pb-1">ALERTE ENLÈVEMENT</h4>
                      <p className="text-[10px] leading-tight mb-3 text-green-100">Les aliens sont là. Ils ont lu vos DM et ils exigent l'expulsion immédiate de Miguel de la Terre.</p>
                      <div className="flex justify-between items-end">
                        <img src="/media/ufo.png" alt="UFO" className="w-16 grayscale brightness-200 contrast-150 border border-green-500" />
                        <div className="text-right">
                          <span className="block text-[8px] uppercase font-bold text-green-300">Probabilité : 99.9%</span>
                          <span className="inline-block bg-green-500 text-black px-2 py-1 text-[9px] font-black mt-1 group-hover:bg-white transition-colors">REJOINDRE LE VAISSEAU</span>
                        </div>
                      </div>
                    </div>,
                    // 13. Brique-Phone
                    <div key="brick" className="border-2 border-black p-4 bg-gray-50 flex flex-col gap-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-white transition-colors cursor-pointer">
                      <div className="flex justify-between items-center text-black">
                        <span className="text-[10px] font-black uppercase tracking-tighter">Miguel Luxury</span>
                        <span className="bg-black text-white text-[8px] px-1 font-bold">NV</span>
                      </div>
                      <img src="/media/brick.png" alt="Brique-Phone" className="w-full grayscale border border-black" />
                      <h4 className="font-black text-md uppercase leading-none text-black">Brique-Phone v17</h4>
                      <p className="text-[9px] font-serif italic text-gray-800">Le 16 est déjà obsolète. Achetez le 17 : plus lourd, plus cher, et ne capte toujours pas chez Miguel.</p>
                    </div>,
                    // 14. Radiateur Rust
                    <div key="radiateur" className="bg-orange-50 border-2 border-orange-600 p-4 flex flex-col gap-2 shadow-[4px_4px_0_0_rgba(234,88,12,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
                      <h4 className="text-orange-950 font-black text-lg uppercase leading-tight italic">RADIATEUR "RUST"</h4>
                      <div className="flex gap-3">
                        <div className="w-1/3 shrink-0">
                          <img src="/media/radiateur.png" alt="Radiateur Rust" className="w-full grayscale contrast-125 border border-orange-600" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[9px] font-sans font-bold text-orange-800 leading-tight">Pourquoi payer l'EDF ? Lancez Rust et gagnez 10°C dans votre chambre instantanément.</p>
                        </div>
                      </div>
                      <div className="bg-orange-600 text-white text-center py-1 text-[8px] font-bold uppercase">Technologie Lucas Inside</div>
                    </div>,
                    // 15. Lethal Company
                    <div key="lethal" className="border-4 border-double border-black p-4 bg-yellow-50 flex flex-col gap-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:bg-yellow-100 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center text-black">
                        <span className="text-[10px] font-black uppercase tracking-tighter">La Compagnie</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          <span className="text-[8px] font-bold text-red-600">LIVE</span>
                        </div>
                      </div>
                      <img src="/media/lethal.png" alt="Lethal Company" className="w-full grayscale border-2 border-black" />
                      <h4 className="font-black text-md uppercase leading-none text-black">NOUS RECRUTONS !</h4>
                      <p className="text-[9px] font-serif leading-tight text-gray-800">Besoin de ferraille. Les cadavres ne seront pas rendus aux familles. Salaire : Une tape sur l'épaule.</p>
                      <div className="bg-black text-white text-center py-1 text-[8px] font-bold uppercase mt-1">Signer le contrat de mort</div>
                    </div>,
                    // 16. REPO
                    <div key="repo" className="border-2 border-black p-3 bg-red-50 flex flex-col gap-2 hover:rotate-1 transition-transform cursor-pointer shadow-[4px_4px_0_0_rgba(153,27,27,1)]">
                      <h4 className="font-black text-sm uppercase text-red-900 border-b border-red-900/30 pb-1">REPO & CO</h4>
                      <div className="flex gap-3">
                        <div className="w-1/3 shrink-0">
                          <img src="/media/repo.png" alt="REPO" className="w-full grayscale border border-red-900" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[8px] font-bold text-red-800 leading-tight">Vous avez des dettes ? On s'en occupe. On prend tout, même votre dignité et votre micro-ondes.</p>
                        </div>
                      </div>
                      <div className="bg-red-900 text-white text-center py-1 text-[8px] font-bold uppercase">Saisie immédiate &rarr;</div>
                    </div>,
                    // 17. Euro Truck
                    <div key="truck" className="border-2 border-black p-4 bg-blue-50 flex flex-col gap-2 hover:-translate-y-1 transition-all cursor-pointer">
                      <div className="flex justify-between items-center text-black">
                        <span className="text-[8px] font-black uppercase">Auto-École Miguel</span>
                        <span className="text-[8px] font-serif italic text-gray-400">Publicité</span>
                      </div>
                      <img src="/media/truck.png" alt="Euro Truck" className="w-full grayscale border border-black" />
                      <h4 className="font-black text-md uppercase leading-none text-black">Euro Truck Simulator</h4>
                      <p className="text-[9px] font-serif leading-tight text-gray-800">Le fun de l'autoroute A1 sans les péages. Migraine et fatigue oculaire garanties sous 2h.</p>
                      <div className="bg-blue-900 text-white text-center py-1 text-[8px] font-bold uppercase">Passer son permis C</div>
                    </div>
                  ];

                  // Shuffle and pick 4
                  const shuffled = [...allPromos].sort(() => 0.5 - Math.random());
                  return shuffled.slice(0, 4);
                })()}

              </div>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER JOURNALISTIQUE */}
      <footer className="mt-20 border-t-8 border-double border-black bg-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Colonne 1: Archives */}
            <div>
              <h4 className="font-sans font-black uppercase text-xs tracking-[0.3em] border-b border-black pb-2 mb-6 text-gray-500">Archives de la honte</h4>
              <ul className="space-y-3 font-serif text-sm">
                <li><Link href="#" className="hover:underline italic">"Hier c'était pire" - Édition du 23/04</Link></li>
                <li><Link href="#" className="hover:underline italic">"Miguel et les iPhones : Une tragédie"</Link></li>
                <li><Link href="#" className="hover:underline italic">"Spécial : Les pets de Lucas vus par la NASA"</Link></li>
                <li><Link href="#" className="hover:underline italic">"Le chômage pour les nuls" par M. (Prochainement)</Link></li>
              </ul>
            </div>

            {/* Colonne 2: Service Client */}
            <div>
              <h4 className="font-sans font-black uppercase text-xs tracking-[0.3em] border-b border-black pb-2 mb-6 text-gray-500">Service Client (Inutile)</h4>
              <ul className="space-y-3 font-serif text-sm">
                <li><Link href="#" className="hover:underline">Droit de réponse (Sera ignoré)</Link></li>
                <li><Link href="/meteo" className="hover:underline border-b border-dotted border-black">Météo du Seum</Link></li>
                <li><Link href="#" className="hover:underline">Se désabonner de la réalité</Link></li>
                <li><Link href="/recrutement" className="hover:underline font-bold">Recrutement (Stagiaires non payés)</Link></li>
              </ul>
            </div>

            {/* Colonne 3: La Rédaction */}
            <div>
              <h4 className="font-sans font-black uppercase text-xs tracking-[0.3em] border-b border-black pb-2 mb-6 text-gray-500">La Rédaction</h4>
              <p className="font-serif text-sm leading-relaxed mb-4 italic text-gray-600">
                "Nos articles sont rédigés par une IA cynique alimentée par des larmes de gamers et du café de mauvaise qualité."
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 border border-black grayscale flex items-center justify-center font-black">AI</div>
                <div className="w-10 h-10 border border-black grayscale flex items-center justify-center font-black">§</div>
                <div className="w-10 h-10 border border-black grayscale flex items-center justify-center font-black">X</div>
              </div>
            </div>

            {/* Colonne 4: Météo & Bourse */}
            <div className="bg-[#F4F1EA] p-4 border border-black flex flex-col justify-between">
              <div>
                <h4 className="font-sans font-black uppercase text-[10px] tracking-widest mb-3">Météo & Marchés</h4>
                <div className="space-y-2 font-mono text-[10px] uppercase">
                  <div className="flex justify-between"><span>Miguel (MIGL)</span> <span className="text-red-600 font-bold">-14.5%</span></div>
                  <div className="flex justify-between"><span>Rust (SALT)</span> <span className="text-green-600 font-bold">+85.0%</span></div>
                  <div className="flex justify-between border-t border-black/10 pt-2"><span>Demain :</span> <span>Orages de sel</span></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-black border-dashed text-center">
                <span className="text-xl font-black italic">1€ = 0.00$ Estime</span>
              </div>
            </div>
          </div>

          {/* Masthead de fin */}
          <div className="border-t border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 title-font">The NoobZap Times</h2>
              <p className="text-[10px] uppercase font-sans tracking-widest text-gray-500">Fondé en 2026 par Maxou</p>
            </div>

            <div className="text-[10px] font-sans uppercase font-bold tracking-widest flex flex-wrap justify-center gap-x-8 gap-y-2">
              <span>© {new Date().getFullYear()} NOOBZAP</span>
              <span>Propulsé par la rage</span>
              <Link href="https://github.com/LeigerMax/NoobZap" className="underline hover:text-red-600 transition-colors">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

