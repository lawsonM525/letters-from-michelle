"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { LETTER_FORM_URL } from "./site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Heart, Sparkles, Check, Minus, Square, X, BookOpen } from "lucide-react";

type Stage = "hello" | "address" | "saved" | "waitlisted";
type Address = {firstName:string;address1:string;address2:string;city:string;region:string;postalCode:string;country:string;website:string};
const empty:Address = {firstName:"",address1:"",address2:"",city:"",region:"",postalCode:"",country:"United States",website:""};
export default function Penpal() {
  const [stage,setStage] = useState<Stage>("hello");
  const [address,setAddress] = useState<Address>(empty);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(stage!=="hello") heading.current?.focus();},[stage]);
  const start = useCallback(async()=>{
    if (LETTER_FORM_URL) { window.location.assign(LETTER_FORM_URL); return; }
    setError("");setStage("address");
  },[]);
  const submit = async(e:React.FormEvent)=>{
    e.preventDefault();setBusy(true);setError("");
    await new Promise(resolve=>setTimeout(resolve,300));
    setAddress(empty);setStage("saved");setBusy(false);
  };
  const join = async()=>{
    setBusy(true);setError("");
    await new Promise(resolve=>setTimeout(resolve,250));
    setStage("waitlisted");setBusy(false);
  };
  useEffect(()=>{
    const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options?:{signal:AbortSignal})=>void}}).modelContext;
    if(!context?.registerTool)return;
    const controller=new AbortController();
    try {context.registerTool({name:"start_letter_request",title:"Open the penpal address form",description:"Open the form for a handwritten letter. Does not submit an address or join a waitlist.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input:unknown)=>{if(!input||typeof input!=="object"||Object.keys(input).length)throw new Error("No inputs expected");await start();return {stage:"address",submitted:false};}},{signal:controller.signal});}catch{}
    return()=>controller.abort();
  },[start]);
  const field=(name:keyof Address,label:string,auto:string,required=true,placeholder="")=><label className="field" key={name}><span>{label}{!required&&<span className="optional"> optional</span>}</span><Input name={name} autoComplete={auto} required={required} value={address[name]} maxLength={name==="firstName"?60:name==="postalCode"?10:120} pattern={name==="postalCode"?"[0-9]{5}(-[0-9]{4})?":undefined} title={name==="postalCode"?"Enter a 5-digit US ZIP code, optionally followed by a hyphen and 4 digits.":undefined} onChange={e=>setAddress(a=>({...a,[name]:e.target.value}))} placeholder={placeholder} className="address-input" /></label>;
  return <div className="desktop">
    <header className="desktop-bar"><span className="desktop-name"><Mail size={17} strokeWidth={2.2}/> the little post office</span><span className="bar-heart" aria-label="Made with love"><Heart size={17}/></span></header>
    <main className={`desk-content stage-${stage}`}>
      {!LETTER_FORM_URL&&<div className="preview-banner"><span>PREVIEW MODE</span> Just trying things out. Nothing is sent or saved.</div>}
      <div className="desktop-label"><span className="tiny-spark">✦</span> a little less scrolling, a little more snail mail</div>
      <section className="window" aria-label="Penpal signup">
        <div className="titlebar"><span><Mail size={15}/> penpals.exe</span><span className="window-controls" aria-hidden="true"><Minus/><Square/><X/></span></div>
        <div className="window-menu"><span>File</span><span>Friendship</span><span>Feelings</span><span className="menu-heart">♡</span></div>
        {stage==="hello"&&<div className="hello-panel">
          <div className="postmark">a real letter.<br/>just for you.</div>
          <img className="mail-art" src="/penpal-mail.png" alt="A cheerful envelope with a letter, little hearts, and a smiling postage stamp" width="260" height="230"/>
          <div className="eyebrow">YOU’VE GOT (SNAIL) MAIL</div>
          <h1>wanna be<br/><em>penpals?</em><span className="headline-star" aria-hidden="true">✳</span></h1>
          <p className="intro">Something handwritten.<br/>Something to keep.<br/>A little hello from me to you.</p>
          <p className="us-only-note">US mailing addresses only for now.</p>
          <Button className="primary-cta" onClick={start}>let me send you a handwritten letter <Heart size={17}/></Button>
          <p className="small-note">for your actual mailbox, not your inbox</p>
        </div>}
        {stage==="address"&&<div className="form-panel">
          <button className="text-button back" type="button" onClick={()=>{setStage("hello");setError("");}}>back to hello</button>
          <div className="eyebrow">STEP 01 / YOUR MAILBOX</div>
          <h1 ref={heading} tabIndex={-1} className="form-heading">where should<br/>I send it?</h1>
          <p className="form-intro">A first name + a place for a little paper hello.</p>
          <p className="us-only-note">US mailing addresses only for now.</p>
          <p className="demo-notice">This is a demo. Please use made-up details. Nothing you enter will be sent or saved.</p>
          <form onSubmit={submit}>
            {field("firstName","First name","given-name",true,"what should I call you?")}
            {field("address1","Street address","address-line1",true,"house number + street")}
            {field("address2","Apartment, unit, etc.","address-line2",false)}
            <div className="field-pair">{field("city","City / town","address-level2")}{field("region","State","address-level1",true,"e.g. California")}</div>
            <div className="field-pair">{field("postalCode","ZIP code","postal-code",true,"e.g. 10001")}<label className="field"><span>Country</span><Input name="country" autoComplete="country-name" value="United States" readOnly className="address-input country-readonly" /></label></div>
            <div className="honey" aria-hidden="true"><label>Website<Input tabIndex={-1} autoComplete="off" value={address.website} onChange={e=>setAddress(a=>({...a,website:e.target.value}))}/></label></div>
            <p className="consent">When the live form is connected, this is where you’ll request a letter. Joining the zine waitlist will be a separate, optional next step.</p>
            {error&&<p role="alert" className="error-message">{error}</p>}
            <Button type="submit" className="primary-cta" disabled={busy}>{busy?"opening the next step…":"preview my little hello"}<Mail size={18}/></Button>
          </form>
        </div>}
        {(stage==="saved"||stage==="waitlisted")&&<div className="success-panel">
          <div className="success-seal" aria-hidden="true"><Check size={32}/></div>
          <div className="eyebrow">A LITTLE PREVIEW OF WHAT’S NEXT</div>
          <h1 ref={heading} tabIndex={-1} className="success-heading">hello, future<br/><em>penpal!</em></h1>
          <p className="success-copy">That’s the preview! Your details weren’t sent or saved.<br/>Here’s the optional zine invitation you’d see next.</p>
          <div className="zine-card">
            <div className="zine-top"><BookOpen size={27}/><span>ONE MORE LITTLE THING</span><Sparkles size={19}/></div>
            <h2>curious minds,<br/><em>meet paper.</em></h2>
            <p>I’m making a handmade zine about all things AI, learning, and becoming your best self.</p>
            {stage==="saved"?<><p className="zine-detail">Want in? Add your name to the waitlist.</p>{error&&<p role="alert" className="error-message">{error}</p>}<Button className="zine-button" onClick={join} disabled={busy}>{busy?"opening the preview…":"preview joining the zine waitlist"}</Button><p className="zine-fine">Preview only. This won’t add you to a waitlist.<br/>No purchase or subscription.</p></>:<div className="waitlist-success" role="status"><Check size={21}/><div>waitlist preview complete<small>No signup was submitted.</small></div></div>}
          </div>
          {stage==="saved"&&<p className="no-pressure">just the letter? that’ll be lovely too ♡</p>}
        </div>}
        <div className="statusbar"><span>{stage==="hello"?"ready for a new friend":stage==="address"?"a good address = happy mail":stage==="waitlisted"?"preview complete · nothing saved":"preview · no signup submitted"}</span><span aria-hidden="true">▧</span></div>
      </section>
      <footer className="footer-note">sent with love, not an algorithm <span aria-hidden="true">♡</span></footer>
    </main>
  </div>;
}
