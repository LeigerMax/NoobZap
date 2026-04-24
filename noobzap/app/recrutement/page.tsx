import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Recrutement() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-serif p-8 md:p-20">
      <div className="max-w-3xl mx-auto border-4 border-black p-8 md:p-12 bg-white relative">
        
        {/* BOUTON RETOUR */}
        <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase font-black hover:translate-x-[-4px] transition-transform group">
                <ArrowLeft size={16} className="group-hover:text-red-600" />
                <span>Retour au journal</span>
            </Link>
        </div>

        <div className="absolute top-4 right-4 border border-black px-4 py-1 text-[10px] font-sans font-black uppercase rotate-12 bg-yellow-400"> Urgent </div>
        
        <header className="border-b-2 border-black pb-8 mb-8 text-center">
            <Link href="/" className="text-4xl font-black uppercase title-font hover:opacity-70 transition-opacity">The NoobZap Times</Link>
            <h1 className="text-2xl mt-4 font-black uppercase tracking-tighter">OFFRE D'EMPLOI : STAGIAIRE EN SCANDALES (H/F/Robot)</h1>
        </header>

        <section className="space-y-6 text-sm md:text-base leading-relaxed">
            <p>
                Vous n'avez aucun talent, une moralité douteuse et une capacité naturelle à générer du seum ? Le NoobZap Times vous ouvre ses bras (non rémunérés).
            </p>

            <h3 className="font-black uppercase border-l-4 border-black pl-3 text-lg">Missions principales :</h3>
            <ul className="list-disc list-inside space-y-2 italic">
                <li>Suivre Miguel en vocal 24h/24 pour noter ses TK.</li>
                <li>Nettoyer le clavier de Lucas après ses sessions sur Rust (attention aux projections de bave).</li>
                <li>Apprendre à coder en JavaScript avec les yeux fermés pour atteindre le niveau de Maxime.</li>
                <li>Rédiger des articles de 500 mots sur pourquoi Rose ne vient pas en vocal.</li>
            </ul>

            <h3 className="font-black uppercase border-l-4 border-black pl-3 text-lg">Profil recherché :</h3>
            <ul className="list-disc list-inside space-y-2">
                <li>Capacité à survivre avec une paie de 0.00€ par mois.</li>
                <li>Maîtrise courante des insultes sur Rainbow Six Siege.</li>
                <li>Résistance accrue à l'absence de Loïc.</li>
                <li>Posséder un iPhone (pour pouvoir l'échanger contre le même modèle tous les 6 mois comme Miguel).</li>
            </ul>

            <div className="bg-black text-white p-6 mt-10">
                <h3 className="font-black uppercase text-xl mb-4">POSTULER MAINTENANT</h3>
                <p className="mb-6 opacity-80 italic">Attention : En cliquant sur le bouton ci-dessous, vous acceptez de céder votre âme, votre premier-né et votre setup gaming à la rédaction.</p>
                <Link 
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1" 
                    target="_blank"
                    className="block w-full bg-white text-black py-4 font-sans font-black uppercase text-center tracking-widest hover:bg-yellow-400 transition-colors shadow-[4px_4px_0_0_rgba(255,255,255,1)]"
                >
                    Signer mon arrêt de mort &rarr;
                </Link>
            </div>
        </section>

        <footer className="mt-12 pt-8 border-t border-black text-center text-xs font-sans text-gray-500 uppercase tracking-widest">
            The NoobZap Times - Division des ressources inhumaines
        </footer>
      </div>
    </main>
  );
}
