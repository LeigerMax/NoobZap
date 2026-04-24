import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-serif flex items-center justify-center p-4">
      <div className="max-w-xl w-full border-[10px] border-double border-black p-8 bg-white text-center shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
        <h1 className="text-8xl font-black mb-4 title-font">404</h1>
        <div className="bg-black text-white py-2 mb-8 uppercase tracking-[0.3em] font-sans text-xs font-bold">
          Dossier Introuvable
        </div>
        
        <p className="text-xl italic mb-8 leading-relaxed">
          "Cette page a disparu plus vite que Loïc après une défaite sur Rainbow Six Siege. 
          Ou alors, c'est Miguel qui a essayé de coder le lien et il a lamentablement échoué."
        </p>

        <div className="border-t border-black pt-8 space-y-4">
          <p className="text-sm font-sans uppercase font-bold tracking-widest text-gray-500 mb-6">Suggestions de la rédaction</p>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/" className="border border-black p-3 hover:bg-black hover:text-white transition-all font-sans text-xs uppercase font-black">
              Retourner lire de vrais scandales
            </Link>
            <Link href="https://github.com/LeigerMax/NoobZap" className="border border-black p-3 hover:bg-black hover:text-white transition-all font-sans text-xs uppercase font-black italic">
              Aller insulter le développeur sur GitHub
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-black border-dashed opacity-50 text-[10px] uppercase font-sans">
          The NoobZap Times - Service des objets perdus et des causes désespérées
        </div>
      </div>
    </main>
  );
}
