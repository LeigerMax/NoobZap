"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { victimsData } from "@/lib/victims";

export default function AjouterPage() {
  const router = useRouter();
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [customTarget, setCustomTarget] = useState("");
  const [context, setContext] = useState("");
  const [articleLink, setArticleLink] = useState("");
  const [manualImage, setManualImage] = useState("");
  const [wantsReview, setWantsReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Désolé, votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      setError("Erreur de reconnaissance vocale : " + event.error);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setContext((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.start();
  };

  // States pour la salle de relecture
  const [draft, setDraft] = useState<{ title: string; content: string; target_name: string; image_url: string } | null>(null);
  const [instruction, setInstruction] = useState("");

  const handleToggleTarget = (name: string) => {
    setSelectedTargets((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const publishInternal = async (articleData: any) => {
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articleData)
    });
    const parsed = await res.json();
    if (!res.ok) throw new Error(parsed.error || "Erreur de publication");
    return parsed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targets: selectedTargets, customTarget, context, link: articleLink, manualImage })
      });

      const jsonRes = await res.json();

      if (!res.ok) {
        throw new Error(jsonRes.error || "Une erreur est survenue lors de la génération.");
      }

      if (wantsReview) {
        setDraft(jsonRes.data);
      } else {
        const pubRes = await publishInternal(jsonRes.data);
        router.push(`/article/${pubRes.data.id}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!draft || !instruction.trim()) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           targets: selectedTargets, 
           customTarget, 
           draft, 
           instruction,
           manualImage
        })
      });

      const jsonRes = await res.json();
      if (!res.ok) throw new Error(jsonRes.error || "Erreur de correction IA.");
      
      setDraft(jsonRes.data);
      setInstruction("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualPublish = async () => {
    if (!draft) return;
    setIsLoading(true);
    setError("");
    try {
      const pubRes = await publishInternal(draft);
      router.push(`/article/${pubRes.data.id}`);
    } catch (err: any) {
       setError(err.message);
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-serif selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-sans font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-black hover:text-[#F4F1EA] px-3 py-1 transition-colors border border-transparent hover:border-black"
          >
            &larr; Retour à l'édition
          </Link>
          <span className="font-sans text-xs uppercase tracking-widest text-gray-600">
            {draft ? "Salle de Relecture" : "Bureau de la Rédac."}
          </span>
        </div>
        
        <div className="border-[6px] border-double border-black p-6 md:p-10 bg-white">
          <header className={`mb-8 border-b pl-2 border-black pb-6 transition-all ${draft ? 'bg-black text-[#F4F1EA] p-4 text-center' : ''}`}>
            <h1 className="text-4xl font-black title-font uppercase tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {draft ? "Édition du Brouillon" : "Machine à Écrire"}
            </h1>
            <p className="font-sans uppercase tracking-widest text-xs font-bold mt-2 text-gray-400">
              {draft ? "Corrigez manuellement ou demandez à l'IA d'intervenir." : "Dactylographiez les détails du prochain scandale."}
            </p>
          </header>

          {error && (
            <div className="p-4 mb-6 border-2 border-dashed border-red-600 bg-red-50 text-red-800 text-sm font-bold uppercase tracking-wider">
              ERREUR: {error}
            </div>
          )}

          {/* ------------- MODE SALLE DE RELECTURE ------------- */}
          {draft ? (
            <div className="space-y-8 animate-fade-in">
              <div className="mb-6 flex justify-center bg-[#F4F1EA] py-4 border-b-2 border-dashed border-black">
                {draft.image_url ? (
                  <img src={draft.image_url} alt="Image générée" className="max-h-80 object-contain shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-4 border-black" />
                ) : (
                  <div className="p-10 italic text-gray-500 font-sans text-sm">Image d'illustration absente.</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">
                  Titre (Éditable)
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full bg-transparent border-2 border-black px-4 py-3 text-2xl font-black uppercase font-serif focus:outline-none focus:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1">
                  Contenu (Éditable)
                </label>
                <textarea
                  rows={8}
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  className="w-full bg-transparent border-2 border-black p-4 text-black text-lg focus:outline-none focus:bg-gray-100 resize-y font-serif leading-relaxed"
                />
              </div>

              <div className="p-6 bg-gray-100 border-2 border-black border-dashed">
                <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2 flex items-center gap-2">
                   <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                   Envoyer une consigne de réécriture à l'IA
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="Ex: Sois plus agressif, ajoute une blague sur sa coupe de cheveux..."
                    className="flex-grow bg-white border border-black px-4 py-2 font-sans focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRefine}
                    disabled={isLoading || !instruction.trim()}
                    className="bg-black hover:bg-red-700 text-white font-sans uppercase tracking-widest font-black py-2 px-6 border border-black transition-colors disabled:bg-gray-400 whitespace-nowrap"
                  >
                    {isLoading ? "Correction..." : "Réécrire"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-6 border-t-2 border-black mt-10">
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  disabled={isLoading}
                  className="w-full md:w-1/3 bg-transparent hover:bg-gray-100 text-black font-sans uppercase tracking-widest font-bold py-4 px-4 border-2 border-black transition-colors disabled:bg-gray-200"
                >
                  Annuler / JETER
                </button>
                <button
                  type="button"
                  onClick={handleManualPublish}
                  disabled={isLoading}
                  className="w-full md:w-2/3 bg-black hover:bg-gray-800 text-[#F4F1EA] font-sans uppercase tracking-widest font-black py-4 px-4 border-2 border-transparent hover:border-black transition-colors disabled:bg-gray-400 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                >
                  {isLoading ? "Impression..." : "VALIDER ET PUBLIER DÉFINITIVEMENT"}
                </button>
              </div>
            </div>
          ) : (
            /* ------------- MODE NORMAL (Saisie) ------------- */
            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              <div>
                <label className="block text-sm font-bold text-black uppercase tracking-widest mb-4 border-b border-gray-300 pb-1">
                  La (ou les) Cible(s)
                </label>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {victimsData.map(victim => {
                    const isSelected = selectedTargets.includes(victim.name);
                    return (
                      <button
                        type="button"
                        key={victim.id}
                        onClick={() => handleToggleTarget(victim.name)}
                        className={`px-4 py-2 border-2 border-black font-sans uppercase tracking-widest text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-black text-white shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] translate-y-0.5' 
                            : 'bg-transparent text-black hover:bg-gray-100 shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
                        }`}
                      >
                        {victim.name}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <input
                    id="customTarget"
                    type="text"
                    placeholder="Ou entrez un autre nom (Invité surprise)"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-black px-2 py-3 text-black text-xl font-serif focus:outline-none focus:bg-gray-100 placeholder:text-gray-400 placeholder:font-sans placeholder:text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center border-b border-gray-300 mb-2 mt-6">
                  <label htmlFor="context" className="block text-sm font-bold text-black uppercase tracking-widest pb-1">
                    Faits Accablants (Contexte)
                  </label>
                  <button
                    type="button"
                    onClick={startListening}
                    disabled={isRecording}
                    className={`flex items-center gap-2 px-3 py-1 text-xs font-sans font-bold uppercase tracking-widest border border-black transition-all ${
                      isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-transparent text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    </svg>
                    {isRecording ? "Écoute..." : "Dicter"}
                  </button>
                </div>
                <textarea
                  id="context"
                  required
                  rows={5}
                  placeholder="Ex. Ils ont encore oublié de commit..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full bg-transparent border-2 border-black p-4 text-black text-lg focus:outline-none focus:bg-gray-100 resize-y font-serif leading-relaxed placeholder:text-gray-400 placeholder:font-sans placeholder:text-sm"
                />
              </div>

              <div>
                <label htmlFor="articleLink" className="block text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1 mt-6">
                  Pièce à Conviction (Lien Optionnel)
                </label>
                <input
                  id="articleLink"
                  type="url"
                  placeholder="http://..."
                  value={articleLink}
                  onChange={(e) => setArticleLink(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-black px-2 py-3 text-black font-mono focus:outline-none focus:bg-gray-100 placeholder:text-gray-400 placeholder:font-sans placeholder:text-sm tracking-widest"
                />
              </div>

              <div>
                <label htmlFor="manualImage" className="block text-sm font-bold text-black uppercase tracking-widest mb-2 border-b border-gray-300 pb-1 mt-6">
                  Image Manuelle (Lien optionnel)
                </label>
                <input
                  id="manualImage"
                  type="url"
                  placeholder="Lien vers Imgur, Discord... (Écrase l'image générée par l'IA)"
                  value={manualImage}
                  onChange={(e) => setManualImage(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-black px-2 py-3 text-black font-mono focus:outline-none focus:bg-gray-100 placeholder:text-gray-400 placeholder:font-sans placeholder:text-sm tracking-widest"
                />
              </div>

              <div className="mt-8 pt-4 pb-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={wantsReview}
                      onChange={(e) => setWantsReview(e.target.checked)}
                    />
                    <div className={`w-8 h-8 border-2 border-black transition-colors ${wantsReview ? 'bg-black' : 'bg-transparent group-hover:bg-gray-200'}`}>
                      {wantsReview && (
                        <svg className="w-6 h-6 text-white mx-auto mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-black uppercase tracking-widest text-sm block">Relecture avant publication</span>
                    <span className="text-xs text-gray-500 font-sans normal-case italic">Me permet de corriger ou demander une réécriture à l'IA avant que ce soit posté.</span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-black hover:bg-gray-800 text-white font-sans uppercase tracking-widest font-black py-4 px-4 border-2 border-transparent hover:border-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  wantsReview ? "Génération du brouillon..." : "Impression en cours..."
                ) : (
                  wantsReview ? "Créer le Brouillon" : "Mettre sous presse directement"
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </main>
  );
}
