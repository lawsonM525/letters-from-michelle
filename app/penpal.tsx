"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { LETTER_FORM_URL } from "./site-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, Minus, Square, X, BookOpen } from "lucide-react";

type Stage = "hello" | "address" | "sealed" | "waitlisted";
type Address = {firstName:string;address1:string;address2:string;city:string;region:string;postalCode:string};
const empty:Address = {firstName:"",address1:"",address2:"",city:"",region:"",postalCode:""};
export default function Penpal() {
  const [stage,setStage]=useState<Stage>("hello");
  const [address,setAddress]=useState<Address>(empty);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(stage!=="hello") heading.current?.focus();},[stage]);
  const start=useCallback(async()=>{
    if(LETTER_FORM_URL){window.location.assign(LETTER_FORM_URL);return;}
    setStage("address");
  },[]);
  function seal(e:React.FormEvent){e.preventDefault();setAddress(empty);setStage("sealed");}
  useEffect(()=>{
    const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options?:{signal:AbortSignal})=>void}}).modelContext;
    if(!context?.registerTool)return;
    const controller=new AbortController();
    try{context.registerTool({name:"start_letter_request",title:"Open the penpal preview",description:"Open the US-only demo address form. Does not submit an address or join a waitlist.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input:unknown)=>{if(!input||typeof input!=="object"||Object.keys(input).length)throw new Error("No inputs expected");await start();return {stage:"address",submitted:false};}},{signal:controller.signal});}catch{}
    return()=>controller.abort();
  },[start]);
  const field=(name:keyof Address,label:string,auto:string,required=true,placeholder="")=><label className="field" key={name}><span>{label}{!required&&<span className="optional"> (optional)</span>}</span><Input name={name} autoComplete={auto} required={required} value={address[name]} maxLength={name==="firstName"?60:name==="postalCode"?10:120} pattern={name==="postalCode"?"[0-9]{5}(-[0-9]{4})?":undefined} title={name==="postalCode"?"Enter a 5-digit US ZIP code, optionally followed by a hyphen and 4 digits.":undefined} onChange={e=>setAddress(a=>({...a,[name]:e.target.value}))} placeholder={placeholder} className="address-input" /></label>;
  return <div className="desktop">
    <header className="desktop-bar"><Mail size={17}/><span>Michelle’s Computer</span></header>
    <main className="desk-content">
      {!LETTER_FORM_URL&&<p className="preview-banner"><strong>DEMO</strong> Nothing is sent or saved. Use made-up details.</p>}
      <section className="window" aria-label="Penpal preview">
        <div className="titlebar"><span className="titlebar-name">penpals.exe</span><div className="titlebar-lines" aria-hidden="true"/><span className="window-controls" aria-hidden="true"><Minus/><Square/><X/></span></div>
        {stage==="hello"&&<div className="hello-panel">
          <img className="mail-art" src="/penpal-mail.png" alt="A cheerful envelope with a letter, hearts, and a smiling postage stamp" width="230" height="230"/>
          <h1>wanna be<br/><em>penpals?</em></h1>
          <p className="us-only-note">US mailing addresses only for now.</p>
          <Button className="retro-button primary-cta" onClick={start}>let me send you a handwritten letter</Button>
        </div>}
        {stage==="address"&&<div className="form-panel">
          <h1 ref={heading} tabIndex={-1} className="form-heading">where should<br/>I send it?</h1>
          <p className="us-only-note">US mailing addresses only for now.</p>
          <form onSubmit={seal}>
            {field("firstName","First name","given-name",true,"your name")}
            {field("address1","Street address","address-line1",true,"house number + street")}
            {field("address2","Apartment / unit","address-line2",false)}
            <div className="field-pair">{field("city","City","address-level2")}{field("region","State","address-level1",true,"e.g. California")}</div>
            <div className="field-pair">{field("postalCode","ZIP code","postal-code",true,"e.g. 10001")}<label className="field"><span>Country</span><Input name="country" autoComplete="country-name" value="United States" readOnly className="address-input country-readonly" /></label></div>
            <Button type="submit" className="retro-button primary-cta">preview my letter request</Button>
            <button className="text-button back" type="button" onClick={()=>setStage("hello")}>back</button>
          </form>
        </div>}
        {(stage==="sealed"||stage==="waitlisted")&&<div className="success-panel">
          <div className="sealed-letter"><img src="/penpal-mail.png" alt="Your illustrated envelope" width="158" height="158"/><span className="completion-stamp"><Check size={18}/><span>SEALED<small>DEMO COMPLETE</small></span></span></div>
          <h1 ref={heading} tabIndex={-1} className="sr-only">Letter request preview complete</h1>
          <div className="zine-card">
            <BookOpen size={27} aria-hidden="true"/>
            <h2>one more page?</h2>
            <p>A handmade zine about AI, learning & becoming your best self.</p>
            {stage==="sealed"?<><Button className="retro-button zine-button" onClick={()=>setStage("waitlisted")}>preview the zine waitlist</Button><p className="zine-fine">Optional. No signup or purchase.</p></>:<p className="waitlist-success" role="status"><Check size={18}/> waitlist demo complete</p>}
          </div>
        </div>}
        <div className="statusbar" aria-hidden="true"><span className="resize-grip"/></div>
      </section>
    </main>
  </div>;
}
