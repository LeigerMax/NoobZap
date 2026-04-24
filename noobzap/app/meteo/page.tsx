import Link from "next/link";
import { Flame, Crosshair, Ghost, MicOff, Moon, CloudRainWind, ArrowLeft } from "lucide-react";

export default function Meteo() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-serif p-8 md:p-20">
      <div className="max-w-4xl mx-auto border-[10px] border-double border-black p-8 bg-white relative">
        
        {/* BOUTON RETOUR */}
        <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase font-black hover:translate-x-[-4px] transition-transform group">
                <ArrowLeft size={16} className="group-hover:text-red-600" />
                <span>Retour au journal</span>
            </Link>
        </div>

        <header className="border-b-4 border-black pb-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
                <Link href="/" className="text-4xl font-black uppercase title-font hover:opacity-70 transition-opacity">The NoobZap Times</Link>
                <h1 className="text-2xl mt-2 font-black uppercase italic tracking-tighter bg-black text-white px-4 inline-block">Météo & Prévisions du Seum</h1>
            </div>
            <div className="text-right">
                <span className="block font-sans font-bold text-xs uppercase tracking-widest text-gray-500">Bulletin du</span>
                <span className="font-serif italic text-lg">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Zone 1: Rust (Lucas Area) */}
            <div className="border-2 border-black p-6 bg-red-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                <h3 className="font-black text-2xl uppercase mb-4 border-b border-black pb-2">Secteur : Rust (Lucas)</h3>
                <div className="mb-4 text-red-600">
                    <Flame size={64} strokeWidth={2.5} />
                </div>
                <p className="text-3xl font-black mb-2 text-red-600">ALERTE ROUGE</p>
                <p className="font-serif italic leading-relaxed">
                    Risque de tempête de sel intense. Des rafales de rage à plus de 120 décibels sont attendues suite à un raid nocturne. 
                    Conseil : Mettez vos voisins en mode sourdine.
                </p>
                <div className="mt-6 pt-4 border-t border-red-200 grid grid-cols-2 text-xs font-mono font-bold uppercase text-red-900">
                    <span>Hygrométrie (Larmes)</span>
                    <span className="text-right">98%</span>
                </div>
            </div>

            {/* Zone 2: Rainbow Six (Miguel Area) */}
            <div className="border-2 border-black p-6 bg-blue-50">
                <h3 className="font-black text-2xl uppercase mb-4 border-b border-black pb-2">Secteur : R6 (Miguel)</h3>
                <div className="mb-4 text-blue-600">
                    <Crosshair size={64} strokeWidth={2.5} />
                </div>
                <p className="text-3xl font-black mb-2 text-blue-600">VISIBILITÉ : 0%</p>
                <p className="font-serif italic leading-relaxed">
                    Brouillard de guerre persistant. Miguel ne voit toujours pas l'ennemi (ni ses coéquipiers). 
                    Précipitations de balles "perdues" (TK) probables tout au long de la soirée.
                </p>
                <div className="mt-6 pt-4 border-t border-blue-200 grid grid-cols-2 text-xs font-mono font-bold uppercase text-blue-900">
                    <span>Indice de Skill</span>
                    <span className="text-right">-5.2</span>
                </div>
            </div>

            {/* Zone 3: Vocaux (Loïc/Rose Area) */}
            <div className="md:col-span-2 border-2 border-black p-6 bg-gray-50 border-dashed">
                <h3 className="font-black text-2xl uppercase mb-4 border-b border-black pb-2 text-center text-gray-400">Prévisions Vocales Globales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-6">
                    <div className="flex flex-col items-center">
                        <Ghost size={40} className="mb-2 text-gray-400" />
                        <span className="font-bold uppercase text-xs">Loïc</span>
                        <p className="font-serif italic text-sm">Disparition totale. Anticyclone de silence.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <MicOff size={40} className="mb-2 text-gray-400" />
                        <span className="font-bold uppercase text-xs">Rose</span>
                        <p className="font-serif italic text-sm">Grand ciel bleu, mais le micro est débranché.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Moon size={40} className="mb-2 text-gray-400" />
                        <span className="font-bold uppercase text-xs">Maxime</span>
                        <p className="font-serif italic text-sm">Somnolence généralisée devant son code.</p>
                    </div>
                </div>
            </div>

        </div>

        <div className="mt-12 bg-black text-white p-6 text-center flex items-center justify-center gap-4">
            <CloudRainWind size={20} className="text-yellow-400" />
            <p className="text-[10px] uppercase font-sans tracking-[0.4em] font-black italic">
                En partenariat avec Météo-Seum France - Ne mangez pas trop salé.
            </p>
            <CloudRainWind size={20} className="text-yellow-400" />
        </div>
      </div>
    </main>
  );
}

