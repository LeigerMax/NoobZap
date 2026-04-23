"use client";

import { useState } from "react";

interface RightOfReplyProps {
  articleTitle: string;
  victimName: string;
}

export default function RightOfReply({ articleTitle, victimName }: RightOfReplyProps) {
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExigerDroit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleTitle, victimName })
      });
      const data = await res.json();
      if (data.reply) {
        setReply(data.reply);
      }
    } catch (e) {
      console.error("Erreur droit de réponse", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 w-full border-2 border-black p-6 bg-[#FEFCF8] shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
      {!reply ? (
        <div className="text-center">
          <p className="font-sans text-xs uppercase tracking-widest text-gray-600 font-bold mb-4">
            — La victime n'est pas d'accord ? —
          </p>
          <button
            onClick={handleExigerDroit}
            disabled={loading}
            className="px-6 py-2 border-2 border-black font-sans uppercase text-xs font-black tracking-widest hover:bg-black hover:text-[#F4F1EA] transition-all disabled:opacity-50"
          >
            {loading ? "Bafouillage en cours..." : "Exiger un droit de réponse"}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <p className="font-sans text-[10px] uppercase font-black tracking-[0.2em] text-red-600 mb-2 border-b border-red-200 pb-1 italic">
            Note de la rédaction : La victime a bafouillé ceci...
          </p>
          <p className="text-lg italic font-serif leading-relaxed text-gray-800">
            "{reply}"
          </p>
          <p className="text-right font-sans text-[10px] uppercase font-bold mt-4 text-gray-500">
            — Signé : {victimName} (Probablement en sueur)
          </p>
        </div>
      )}
    </div>
  );
}
