"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { LETTER_FORM, MAGAZINE_FORM } from "./site-config";
import { Button } from "@/components/ui/button";
import { Mail, Check, Minus, Square, X, BookOpen } from "lucide-react";

type Stage = "hello" | "address" | "sealed" | "magazine" | "waitlisted";
type TallyRuntime = { loadEmbeds: () => void };
function loadEmbeds() {
  (window as Window & { Tally?: TallyRuntime }).Tally?.loadEmbeds();
}
function TallyForm({ form, onSubmitted }: { form: typeof LETTER_FORM; onSubmitted: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    loadEmbeds();
    function receive(event: MessageEvent) {
      // Trust only this form's iframe; never retain or log its answers.
      if (event.origin !== "https://tally.so" || event.source !== frame.current?.contentWindow) return;
      if (typeof event.data !== "string") return;
      try {
        const message = JSON.parse(event.data);
        if (message.event === "Tally.FormSubmitted" && message.payload?.formId === form.id) onSubmitted();
      } catch { /* Ignore unrelated widget messages. */ }
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [form.id, onSubmitted]);
  return <>
    <iframe ref={frame} data-tally-src={form.embedUrl} width="100%" height={form.height} frameBorder={0} title={form.title} className="tally-frame" />
    <p className="embed-fallback">Form not loading? <a href={form.publicUrl} target="_blank" rel="noopener noreferrer">Open it in a new tab</a>.</p>
  </>;
}
export default function Penpal() {
  const [stage, setStage] = useState<Stage>("hello");
  const [returnStage, setReturnStage] = useState<"hello" | "address" | "sealed">("hello");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (stage !== "hello") heading.current?.focus(); }, [stage]);
  function openMagazine(from: "hello" | "address" | "sealed") { setReturnStage(from); setStage("magazine"); }
  const zineInvite = (from: "hello" | "address" | "sealed") => <div className="zine-card">
    <BookOpen size={27} aria-hidden="true" /><h2>one more page?</h2>
    <p>An artsy magazine about AI and learning—with comics, diary entries, and handwritten pages.</p>
    <Button className="retro-button zine-button" onClick={() => openMagazine(from)}>join the magazine waitlist</Button>
    <p className="zine-fine">Optional. A separate signup for magazine updates.</p>
  </div>;
  return <div className="desktop">
    <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" onReady={loadEmbeds} />
    <header className="desktop-bar"><Mail size={17} /><span>Michelle’s Computer</span></header>
    <main className="desk-content">
      <section className={`window${stage === "address" || stage === "magazine" ? " window-form" : ""}`} aria-label="The little post office">
        <div className="titlebar"><span className="titlebar-name">{stage === "magazine" ? "magazine.exe" : "penpals.exe"}</span><div className="titlebar-lines" aria-hidden="true" /><span className="window-controls"><Minus aria-hidden="true" /><Square aria-hidden="true" /><button type="button" className="window-close" aria-label="Close form and return to the invitation" onClick={() => setStage("hello")}><X /></button></span></div>
        {stage === "hello" && <div className="hello-panel">
          <img className="mail-art" src="/penpal-mail.png" alt="A cheerful envelope with a letter, hearts, and a smiling postage stamp" width="230" height="230" />
          <h1>wanna be<br /><em>penpals?</em></h1>
          <p className="us-only-note">A handwritten hello, wherever you call home.</p>
          <Button className="retro-button primary-cta" onClick={() => setStage("address")}>let me send you a handwritten letter</Button>
          <button className="text-button" onClick={() => openMagazine("hello")}>just here for the magazine? join the waitlist</button>
        </div>}
        {stage === "address" && <div className="form-panel embed-panel">
          <h1 ref={heading} tabIndex={-1} className="sr-only">Pen-pal mailing address form</h1>
          <TallyForm form={LETTER_FORM} onSubmitted={() => setStage("sealed")} />
          <button className="text-button back" onClick={() => setStage("hello")}>back</button>
          <button className="text-button" onClick={() => openMagazine("address")}>or join the magazine waitlist</button>
        </div>}
        {stage === "sealed" && <div className="success-panel">
          <div className="sealed-letter"><img src="/penpal-mail.png" alt="Your illustrated envelope" width="158" height="158" /><span className="completion-stamp"><Check size={18} /><span>SEALED<small>REQUEST RECEIVED</small></span></span></div>
          <h1 ref={heading} tabIndex={-1} className="sr-only">Your letter request was received</h1>
          {zineInvite("sealed")}
          <button className="text-button" onClick={() => setStage("hello")}>back to the little post office</button>
        </div>}
        {stage === "magazine" && <div className="form-panel embed-panel">
          <h1 ref={heading} tabIndex={-1} className="form-heading">one more<br />page?</h1>
          <TallyForm form={MAGAZINE_FORM} onSubmitted={() => setStage("waitlisted")} />
          <button className="text-button back" onClick={() => setStage(returnStage)}>back</button>
        </div>}
        {stage === "waitlisted" && <div className="success-panel">
          <h1 ref={heading} tabIndex={-1} className="success-heading">you’re on the list!</h1>
          <p role="status"><Check size={18} aria-hidden="true" /> Your magazine signup was received.</p>
          <button className="text-button" onClick={() => setStage("hello")}>back to the little post office</button>
        </div>}
        <div className="statusbar" aria-hidden="true"><span className="resize-grip" /></div>
      </section>
    </main>
  </div>;
}
