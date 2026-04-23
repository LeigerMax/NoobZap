"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    // Si l'API Web Share est disponible (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "Article depuis The NoobZap Times",
          url: url
        });
        return;
      } catch (e) {
        console.error("Partage annulé ou erreur", e);
      }
    }
    
    // Fallback: copier dans le presse papier
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`mt-10 px-8 py-3 text-sm font-sans uppercase font-black tracking-widest border-2 border-black transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none flex items-center gap-2 mx-auto ${
        copied ? 'bg-green-600 text-white' : 'bg-[#1A1A1A] text-[#F4F1EA] hover:bg-gray-800'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Lien Copié !
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          Publier ce Scandale
        </>
      )}
    </button>
  );
}
