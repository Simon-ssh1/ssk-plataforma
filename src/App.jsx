import { useState, useEffect, useRef, useCallback } from "react";

const C = { bg:"#04080f",bg2:"#070c17",blue:"#00C2FF",blueD:"#0099cc",white:"#e8edf5",muted:"rgba(100,150,210,0.55)",faint:"rgba(0,194,255,0.06)",border:"rgba(0,194,255,0.12)" };

const TOOLS = [
  { id:"campanas",num:"01",name:"Creación de campañas",desc:"De brief hasta presupuesto",tag:"Marca existente",fields:[{key:"marca",label:"Marca *",ph:"Ej: Nike Colombia"},{key:"producto",label:"Producto *",ph:"Ej: Nueva línea running"},{key:"objetivo",label:"Objetivo *",ph:"Ej: Incrementar ventas 20%"},{key:"audiencia",label:"Audiencia *",ph:"Ej: Jóvenes 18-30 Medellín"},{key:"tono",label:"Tono *",ph:"Ej: Auténtico, directo"},{key:"presupuesto",label:"Presupuesto",ph:"Ej: $50 millones COP"}]},
  { id:"startups",num:"02",name:"Startups",desc:"Propuesta de valor y lanzamiento",tag:"Desde cero",fields:[{key:"idea",label:"Idea de negocio *",ph:"Describe tu idea",multi:true},{key:"problema",label:"Problema *",ph:"¿Qué dolor del mercado ataca?"},{key:"publico",label:"A quién va dirigido *",ph:"Ej: Restaurantes Colombia"},{key:"diferencial",label:"¿Qué te hace diferente?",ph:"Precio, tecnología..."}]},
  { id:"estrategia",num:"03",name:"Estrategia de marca",desc:"ADN, propósito, tono y territorio",tag:"Identidad",fields:[{key:"marca",label:"Marca *",ph:"Nombre de la marca"},{key:"historia",label:"Historia *",ph:"Cuéntame de dónde viene",multi:true},{key:"valores",label:"Valores",ph:"Autenticidad, innovación"},{key:"aspiracion",label:"¿A dónde quiere llegar?",ph:"Su aspiración en 5 años"}]},
  { id:"conceptos",num:"04",name:"Conceptos creativos",desc:"Brainstorming estructurado",tag:"Ideación",fields:[{key:"marca",label:"Marca *",ph:"¿Para qué marca?"},{key:"reto",label:"Reto creativo *",ph:"¿Qué problema resolver?",multi:true},{key:"insight",label:"Insight humano",ph:"Algo que sabes del consumidor"},{key:"restricciones",label:"Qué NO hacer",ph:"Territorios a evitar"}]},
  { id:"naming",num:"05",name:"Naming",desc:"Nombres de marca con verificación",tag:"Nomenclatura",fields:[{key:"categoria",label:"Categoría *",ph:"Restaurante, app..."},{key:"valores",label:"Valores *",ph:"Fresco, honesto, premium"},{key:"publico",label:"A quién va dirigido *",ph:"Millennials urbanos"},{key:"evitar",label:"Qué evitar",ph:"Palabras en inglés..."}]},
  { id:"competencia",num:"06",name:"Competencia",desc:"Análisis de categoría Colombia",tag:"Mercado",fields:[{key:"categoria",label:"Categoría *",ph:"Agencias en Medellín"},{key:"marca",label:"Tu marca (opcional)",ph:"Para contextualizar"},{key:"enfoque",label:"Enfoque",ph:"Precios, comunicación..."}]},
];

const PROMPTS = {
  campanas: ctx=>`Eres estratega creativo senior latinoamericano. Genera campaña completa: insights, 2 conceptos con tagline, canales y copies. Español. Datos: ${ctx}`,
  startups: ctx=>`Eres consultor de startups en Colombia. Genera: validación, propuesta de valor, nombre, mensaje de lanzamiento y primeros 3 pasos. Español. Datos: ${ctx}`,
  estrategia: ctx=>`Eres director de estrategia de marca. Genera: propósito, ADN, territorio creativo, tono y tagline. Español. Datos: ${ctx}`,
  conceptos: ctx=>`Eres director creativo internacional. Genera 4 conceptos: nombre, big idea, tagline, cómo se manifiesta. Español audaz. Datos: ${ctx}`,
  naming: ctx=>`Eres experto en naming en Colombia. Genera 8 nombres en 3 categorías: racionales, emocionales, disruptivos. Significado, por qué funciona, tagline. Datos: ${ctx}`,
  competencia: ctx=>`Eres analista estratégico colombiano. Análisis: actores, territorios tomados, oportunidades, recomendación. Datos: ${ctx}`,
};

const INIT_PROJECTS = [
  {id:1,name:"Juan Valdez",toolId:"campanas",pct:55,updated:"Hace 2h"},
  {id:2,name:"Startup Logística",toolId:"startups",pct:18,updated:"Ayer"},
  {id:3,name:"Marca Personal",toolId:"estrategia",pct:40,updated:"Hace 3d"},
];

function useScrollReveal() {
  const ref = useRef(null);
  const [visible,setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){setVisible(true);obs.disconnect();} },{threshold:0.12});
    obs.observe(el); return () => obs.disconnect();
  },[]);
  return [ref,visible];
}

function Reveal({children,delay=0,style={}}){
  const [ref,visible] = useScrollReveal();
  return <div ref={ref} style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(32px)",transition:`opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,...style}}>{children}</div>;
}

function GlowDot({size=6}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:C.blue,boxShadow:`0 0 ${size*2}px ${size}px rgba(0,194,255,0.35)`,flexShrink:0}}/>;
}

function Btn({children,onClick,primary,small,disabled,style={}}){
  const [h,setH]=useState(false);
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>!disabled&&setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"6px 16px":"13px 32px",background:primary?(disabled?"rgba(0,194,255,0.08)":h?"rgba(0,215,255,0.95)":"rgba(0,194,255,0.88)"):(h?"rgba(0,194,255,0.07)":"transparent"),color:primary?(disabled?"rgba(0,194,255,0.3)":C.bg):(disabled?"rgba(100,150,200,0.3)":h?C.blue:"rgba(100,150,200,0.7)"),border:primary?"none":`1px solid ${disabled?"rgba(0,194,255,0.1)":h?"rgba(0,194,255,0.5)":C.border}`,borderRadius:999,fontSize:small?11:13,fontWeight:primary?700:500,fontFamily:"'Helvetica Neue',Arial,sans-serif",cursor:disabled?"default":"pointer",letterSpacing:".04em",transition:"all .2s",whiteSpace:"nowrap",boxShadow:primary&&!disabled?`0 0 ${h?28:16}px rgba(0,194,255,${h?.45:.22})`:"none",...style}}>{children}</button>;
}

const inp = {width:"100%",boxSizing:"border-box",background:"rgba(0,194,255,0.03)",border:"1px solid rgba(0,194,255,0.14)",color:"#e8edf5",borderRadius:8,padding:"12px 16px",fontSize:13,fontFamily:"'Helvetica Neue',Arial,sans-serif",outline:"none",transition:"border-color .2s"};

function GridBg(){
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:"linear-gradient(rgba(0,194,255,0.025) 1px, transparent 1px),linear-gradient(90deg, rgba(0,194,255,0.025) 1px, transparent 1px)",backgroundSize:"80px 80px"}}/>;
}

function ToolCard({tool,onClick,idx}){
  const [h,setH]=useState(false);
  return (
    <Reveal delay={idx*70}>
      <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{padding:"28px 24px",background:h?"rgba(0,194,255,0.05)":"rgba(7,12,23,0.8)",border:`1px solid ${h?"rgba(0,194,255,0.35)":"rgba(0,194,255,0.1)"}`,borderRadius:16,cursor:"pointer",transition:"all .3s",boxShadow:h?"0 0 30px rgba(0,194,255,0.08)":"none",position:"relative",overflow:"hidden"}}>
        {h&&<div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 20% 50%, rgba(0,194,255,0.04) 0%, transparent 70%)",pointerEvents:"none"}}/>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,color:h?C.blue:"rgba(0,194,255,0.35)",letterSpacing:".14em",background:h?"rgba(0,194,255,0.1)":"rgba(0,194,255,0.04)",border:`1px solid ${h?"rgba(0,194,255,0.3)":"rgba(0,194,255,0.1)"}`,padding:"4px 10px",borderRadius:999,transition:"all .3s"}}>{tool.num}</div>
          <span style={{fontSize:18,color:h?C.blue:"rgba(0,194,255,0.2)",transition:"all .3s",transform:h?"translateX(3px)":"translateX(0)"}}>→</span>
        </div>
        <div style={{fontSize:17,fontWeight:700,color:C.white,marginBottom:8,letterSpacing:"-.02em",lineHeight:1.3}}>{tool.name}</div>
        <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>{tool.desc}</div>
        <div style={{marginTop:18,display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:4,height:4,borderRadius:"50%",background:h?C.blue:"rgba(0,194,255,0.3)",transition:"all .3s"}}/>
          <span style={{fontSize:10,color:h?C.blue:"rgba(0,194,255,0.3)",letterSpacing:".1em",textTransform:"uppercase",transition:"all .3s"}}>{tool.tag}</span>
        </div>
      </div>
    </Reveal>
  );
}

function ProjectRow({proj,tool,onClick,idx}){
  const [h,setH]=useState(false);
  return (
    <Reveal delay={idx*60}>
      <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",background:h?"rgba(0,194,255,0.04)":"rgba(7,12,23,0.6)",border:`1px solid ${h?"rgba(0,194,255,0.25)":"rgba(0,194,255,0.08)"}`,borderRadius:12,cursor:"pointer",transition:"all .25s",gap:20}}>
        <div style={{display:"flex",alignItems:"center",gap:14,minWidth:0}}>
          <div style={{width:36,height:36,borderRadius:"50%",flexShrink:0,background:"rgba(0,194,255,0.06)",border:`1px solid rgba(0,194,255,${h?.35:.18})`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .25s"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:h?C.blue:"rgba(0,194,255,0.5)",boxShadow:h?"0 0 8px rgba(0,194,255,0.8)":"none",transition:"all .25s"}}/>
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:14,fontWeight:600,color:C.white,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{proj.name}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:3}}>{tool?.name} · {proj.updated}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16,flexShrink:0}}>
          <div style={{width:120}}>
            <div style={{height:2,background:"rgba(0,194,255,0.08)",borderRadius:1,overflow:"hidden"}}>
              <div style={{width:`${proj.pct}%`,height:"100%",background:h?C.blue:"rgba(0,194,255,0.55)",borderRadius:1,transition:"all .25s"}}/>
            </div>
          </div>
          <div style={{fontSize:14,fontWeight:700,color:h?C.blue:"rgba(0,194,255,0.5)",minWidth:36,textAlign:"right",transition:"all .25s"}}>{proj.pct}%</div>
        </div>
      </div>
    </Reveal>
  );
}

function SectionHeader({label,count,action}){
  return (
    <Reveal>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:20,height:1,background:"rgba(0,194,255,0.4)"}}/>
          <span style={{fontSize:10,color:"rgba(0,194,255,0.5)",letterSpacing:".18em",textTransform:"uppercase"}}>{label}</span>
          {count&&<span style={{fontSize:10,color:"rgba(0,194,255,0.25)"}}>{count}</span>}
        </div>
        {action}
      </div>
    </Reveal>
  );
}

function ToolView({tool,project,onBack}){
  const [formData,setFormData]=useState({});
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState(false);
  const resultRef=useRef(null);
  const setF=(k,v)=>setFormData(f=>({...f,[k]:v}));
  const canRun=tool.fields.filter(f=>f.label.includes("*")).every(f=>formData[f.key]?.trim());

  const runAI=useCallback(async()=>{
    setLoading(true);setResult("");
    try{
      const ctx=Object.entries(formData).map(([k,v])=>`${k}: ${v}`).join(". ");
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"Responde siempre en español. Sé concreto, estratégico y creativo. Usa secciones bien diferenciadas.",messages:[{role:"user",content:PROMPTS[tool.id](ctx)}]})});
      const data=await res.json();
      setResult(data.content.map(b=>b.text||"").join("\n").trim());
      setTimeout(()=>resultRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    }catch{setResult("Error al generar. Intenta de nuevo.");}
    setLoading(false);
  },[formData,tool]);

  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"48px 40px 80px"}}>
      <div style={{marginBottom:40}}><Btn small onClick={onBack}>← Volver</Btn></div>
      <Reveal>
        <div style={{marginBottom:48}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <span style={{fontSize:10,color:C.blue,letterSpacing:".16em",textTransform:"uppercase",border:"1px solid rgba(0,194,255,0.25)",padding:"4px 12px",borderRadius:999}}>{tool.num}</span>
            <span style={{fontSize:10,color:"rgba(0,194,255,0.4)",letterSpacing:".1em",textTransform:"uppercase"}}>{tool.tag}</span>
          </div>
          <h1 style={{fontSize:48,fontWeight:800,letterSpacing:"-.04em",lineHeight:1.05,color:C.white,margin:"0 0 12px"}}>{tool.name}</h1>
          <p style={{fontSize:15,color:C.muted,lineHeight:1.7,margin:0}}>{tool.desc}</p>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <div style={{background:"rgba(7,12,23,0.7)",border:"1px solid rgba(0,194,255,0.12)",borderRadius:20,padding:"32px",marginBottom:24}}>
          <div style={{fontSize:9,color:C.blue,letterSpacing:".16em",textTransform:"uppercase",marginBottom:24,display:"flex",alignItems:"center",gap:8}}><GlowDot size={4}/>Brief</div>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {tool.fields.map(f=>(
              <div key={f.key}>
                <div style={{fontSize:11,color:"rgba(100,150,200,0.55)",marginBottom:8,letterSpacing:".05em"}}>{f.label}</div>
                {f.multi?<textarea value={formData[f.key]||""} onChange={e=>setF(f.key,e.target.value)} placeholder={f.ph} rows={3} style={{...inp,resize:"vertical"}} onFocus={e=>{e.target.style.borderColor="rgba(0,194,255,0.4)"}} onBlur={e=>{e.target.style.borderColor="rgba(0,194,255,0.14)"}}/>:<input value={formData[f.key]||""} onChange={e=>setF(f.key,e.target.value)} placeholder={f.ph} style={inp} onFocus={e=>{e.target.style.borderColor="rgba(0,194,255,0.4)"}} onBlur={e=>{e.target.style.borderColor="rgba(0,194,255,0.14)"}}/>}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal delay={150}><Btn primary onClick={runAI} disabled={!canRun||loading}>{loading?"Generando…":`Generar ${tool.name} →`}</Btn></Reveal>
      {result&&(
        <div ref={resultRef} style={{marginTop:40}}>
          <Reveal>
            <div style={{background:"rgba(0,194,255,0.03)",border:"1px solid rgba(0,194,255,0.22)",borderRadius:20,padding:"32px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><GlowDot size={5}/><span style={{fontSize:9,color:C.blue,letterSpacing:".16em",textTransform:"uppercase"}}>Resultado</span></div>
                <div style={{display:"flex",gap:8}}>
                  <Btn small onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>{copied?"✓ Copiado":"Copiar"}</Btn>
                  <Btn small onClick={runAI} disabled={loading}>Regenerar</Btn>
                </div>
              </div>
              <div style={{whiteSpace:"pre-wrap",fontSize:13.5,lineHeight:2,color:"rgba(232,237,245,0.85)"}}>{result}</div>
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}

function NewProjectModal({onClose,onCreate}){
  const [name,setName]=useState("");
  const [toolId,setToolId]=useState("campanas");
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(4,8,15,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(8px)"}}>
      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{width:440,background:"rgba(7,12,23,0.97)",border:"1px solid rgba(0,194,255,0.25)",borderRadius:24,padding:40,boxShadow:"0 0 80px rgba(0,194,255,0.1)",animation:"modalIn .3s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><GlowDot size={5}/><span style={{fontSize:9,color:C.blue,letterSpacing:".16em",textTransform:"uppercase"}}>Nuevo proyecto</span></div>
        <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-.03em",color:C.white,margin:"0 0 4px"}}>¿Qué marca<br/>construimos?</h2>
        <p style={{fontSize:13,color:C.muted,margin:"0 0 28px"}}>Dale un nombre y elige la herramienta.</p>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"rgba(100,150,200,0.5)",marginBottom:8,letterSpacing:".05em"}}>Nombre del proyecto</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej: Nike Colombia 2025" style={{...inp,width:"100%"}} onFocus={e=>{e.target.style.borderColor="rgba(0,194,255,0.4)"}} onBlur={e=>{e.target.style.borderColor="rgba(0,194,255,0.14)"}} autoFocus/>
        </div>
        <div style={{marginBottom:32}}>
          <div style={{fontSize:11,color:"rgba(100,150,200,0.5)",marginBottom:8,letterSpacing:".05em"}}>Herramienta</div>
          <select value={toolId} onChange={e=>setToolId(e.target.value)} style={{...inp,width:"100%",cursor:"pointer"}}>
            {TOOLS.map(t=><option key={t.id} value={t.id}>{t.num} — {t.name}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn primary onClick={()=>{if(name.trim())onCreate(name,toolId);}}>Crear y abrir →</Btn>
          <Btn onClick={onClose}>Cancelar</Btn>
        </div>
      </div>
    </div>
  );
}

function HeroSection({onNewProject}){
  const [mounted,setMounted]=useState(false);
  useEffect(()=>{setTimeout(()=>setMounted(true),80);},[]);
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 40px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,194,255,0.07) 0%, transparent 65%)",pointerEvents:"none"}}/>
      {[280,420,560].map(r=><div key={r} style={{position:"absolute",top:"40%",left:"50%",width:r,height:r,borderRadius:"50%",border:"1px solid rgba(0,194,255,0.04)",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>)}
      <div style={{maxWidth:760,position:"relative",zIndex:1}}>
        <style>{`@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}`}</style>
        <div style={{opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(20px)",transition:"all .8s ease",display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",border:"1px solid rgba(0,194,255,0.2)",borderRadius:999,marginBottom:32}}>
          <GlowDot size={5}/><span style={{fontSize:10,color:C.blue,letterSpacing:".12em",textTransform:"uppercase"}}>Sistema creativo activo</span>
        </div>
        <h1 style={{opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(30px)",transition:"all .9s ease .1s",fontSize:"clamp(52px,8vw,96px)",fontWeight:800,letterSpacing:"-.05em",lineHeight:.95,color:C.white,margin:"0 0 24px"}}>
          ¿Qué construimos<br/><span style={{color:C.blue,textShadow:"0 0 60px rgba(0,194,255,0.4)"}}>hoy, Simón?</span>
        </h1>
        <p style={{opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(20px)",transition:"all .9s ease .2s",fontSize:17,color:C.muted,lineHeight:1.7,maxWidth:480,margin:"0 0 48px"}}>La constante detrás de cada gran marca.<br/>Estrategia, creatividad e IA en un solo lugar.</p>
        <div style={{opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(20px)",transition:"all .9s ease .3s",display:"flex",gap:14,alignItems:"center"}}>
          <Btn primary onClick={onNewProject}>+ Nuevo proyecto</Btn>
          <span style={{fontSize:12,color:"rgba(0,194,255,0.3)"}}>↓ scroll para explorar</span>
        </div>
      </div>
    </div>
  );
}

function Sidebar({activeToolId,onOpenTool,projects,onNewProject,activeProjectId}){
  return (
    <div style={{width:220,minWidth:220,maxWidth:220,height:"100vh",position:"sticky",top:0,background:"rgba(4,8,15,0.97)",borderRight:"1px solid rgba(0,194,255,0.07)",display:"flex",flexDirection:"column",flexShrink:0,zIndex:10}}>
      <div style={{padding:"20px 20px 16px",borderBottom:"1px solid rgba(0,194,255,0.07)",cursor:"pointer"}} onClick={()=>onOpenTool(null)}>
        <div style={{fontSize:24,fontWeight:800,letterSpacing:"-.04em",color:C.white,textShadow:"0 0 30px rgba(0,194,255,0.4)"}}>SS<span style={{color:C.blue}}>/</span>K</div>
        <div style={{fontSize:9,color:"rgba(0,194,255,0.3)",letterSpacing:".14em",marginTop:2,textTransform:"uppercase"}}>Sistema creativo</div>
      </div>
      <div style={{padding:"14px 0 10px",borderBottom:"1px solid rgba(0,194,255,0.05)",overflowY:"auto"}}>
        <div style={{fontSize:8,color:"rgba(0,194,255,0.22)",letterSpacing:".16em",textTransform:"uppercase",padding:"0 20px 10px"}}>Herramientas</div>
        {TOOLS.map(t=>{
          const active=activeToolId===t.id;
          return (
            <div key={t.id} onClick={()=>onOpenTool(t)} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 20px",cursor:"pointer",background:active?"rgba(0,194,255,0.06)":"transparent",borderLeft:active?`2px solid ${C.blue}`:"2px solid transparent",transition:"all .15s"}} onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(0,194,255,0.03)"}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}>
              <div style={{width:24,height:24,minWidth:24,borderRadius:6,flexShrink:0,background:active?"rgba(0,194,255,0.15)":"rgba(0,194,255,0.04)",border:`1px solid ${active?"rgba(0,194,255,0.4)":"rgba(0,194,255,0.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:active?C.blue:"rgba(0,194,255,0.25)",transition:"all .2s"}}>{t.num}</div>
              <span style={{fontSize:11.5,color:active?C.white:"rgba(100,140,180,0.6)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",transition:"color .2s"}}>{t.name}</span>
            </div>
          );
        })}
      </div>
      <div style={{padding:"14px 0",flex:1,overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px 10px"}}>
          <div style={{fontSize:8,color:"rgba(0,194,255,0.22)",letterSpacing:".16em",textTransform:"uppercase"}}>Proyectos</div>
          <div onClick={onNewProject} style={{width:16,height:16,minWidth:16,borderRadius:"50%",border:"1px solid rgba(0,194,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.blue,cursor:"pointer",lineHeight:1,paddingBottom:1}}>+</div>
        </div>
        {projects.map(p=>{
          const active=activeProjectId===p.id;
          const tool=TOOLS.find(t=>t.id===p.toolId);
          return (
            <div key={p.id} onClick={()=>onOpenTool(tool,p)} style={{padding:"7px 20px",cursor:"pointer",background:active?"rgba(0,194,255,0.05)":"transparent",borderLeft:active?"2px solid rgba(91,224,255,0.6)":"2px solid transparent",transition:"all .2s"}} onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(0,194,255,0.02)"}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}>
              <div style={{fontSize:11.5,color:active?C.white:"rgba(100,140,180,0.55)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:5,marginTop:4}}>
                <div style={{flex:1,height:1.5,background:"rgba(0,194,255,0.07)",borderRadius:1,overflow:"hidden"}}>
                  <div style={{width:`${p.pct}%`,height:"100%",background:"rgba(0,194,255,0.55)",borderRadius:1}}/>
                </div>
                <span style={{fontSize:8,color:"rgba(0,194,255,0.3)"}}>{p.pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{padding:"12px 20px",borderTop:"1px solid rgba(0,194,255,0.06)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,minWidth:30,borderRadius:"50%",background:"rgba(0,194,255,0.08)",border:"1px solid rgba(0,194,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:C.blue,boxShadow:"0 0 6px rgba(0,194,255,0.8)"}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:C.white,fontWeight:600}}>Simón Sierra</div>
          <div style={{fontSize:9,color:C.blue,textShadow:"0 0 8px rgba(0,194,255,0.4)"}}>· Activo</div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("home");
  const [activeTool,setActiveTool]=useState(null);
  const [activeProject,setActiveProject]=useState(null);
  const [projects,setProjects]=useState(INIT_PROJECTS);
  const [showModal,setShowModal]=useState(false);
  const mainRef=useRef(null);

  const openTool=(tool,proj=null)=>{
    setActiveTool(tool); setActiveProject(proj); setView(tool?"tool":"home");
    mainRef.current?.scrollTo({top:0,behavior:"smooth"});
  };

  const handleCreate=(name,toolId)=>{
    const tool=TOOLS.find(t=>t.id===toolId);
    const proj={id:Date.now(),name,toolId,pct:0,updated:"Ahora"};
    setProjects(p=>[...p,proj]); setShowModal(false); openTool(tool,proj);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",width:"100vw",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",color:C.white,display:"flex",overflow:"hidden",boxSizing:"border-box"}}>
      <GridBg/>
      <Sidebar activeToolId={activeTool?.id} activeProjectId={activeProject?.id} onOpenTool={openTool} projects={projects} onNewProject={()=>setShowModal(true)}/>
      <div ref={mainRef} style={{flex:1,height:"100vh",overflowY:"auto",overflowX:"hidden",position:"relative",zIndex:1}}>
        <div style={{position:"sticky",top:0,zIndex:20,height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",background:"rgba(4,8,15,0.85)",borderBottom:"1px solid rgba(0,194,255,0.07)",backdropFilter:"blur(12px)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {view!=="home"&&<span onClick={()=>openTool(null)} style={{fontSize:12,color:C.muted,cursor:"pointer"}}>Inicio</span>}
            {view==="home"&&<span style={{fontSize:13,fontWeight:600,color:C.white}}>Inicio</span>}
            {activeTool&&<><span style={{color:"rgba(0,194,255,0.2)"}}>—</span><span style={{fontSize:13,fontWeight:600,color:C.white}}>{activeTool.name}</span></>}
            {activeProject&&<><span style={{color:"rgba(0,194,255,0.15)"}}>—</span><span style={{fontSize:12,color:C.muted}}>{activeProject.name}</span></>}
          </div>
          {view==="tool"&&activeTool&&<span style={{fontSize:10,padding:"4px 14px",border:"1px solid rgba(0,194,255,0.2)",color:"rgba(0,194,255,0.6)",borderRadius:999,letterSpacing:".1em",textTransform:"uppercase"}}>{activeTool.tag}</span>}
          {view==="home"&&<Btn small primary onClick={()=>setShowModal(true)}>+ Nuevo proyecto</Btn>}
        </div>
        {view==="home"&&(
          <div>
            <HeroSection onNewProject={()=>setShowModal(true)}/>
            <div style={{padding:"100px 40px",borderTop:"1px solid rgba(0,194,255,0.06)"}}>
              <div style={{maxWidth:1100,margin:"0 auto"}}>
                <SectionHeader label="Herramientas" count={`— ${TOOLS.length}`}/>
                <Reveal><div style={{marginBottom:48}}><div style={{fontSize:"clamp(32px,5vw,60px)",fontWeight:800,letterSpacing:"-.04em",lineHeight:1.05,color:C.white}}>Seis herramientas.<br/><span style={{color:C.blue}}>Un sistema.</span></div></div></Reveal>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
                  {TOOLS.map((t,i)=><ToolCard key={t.id} tool={t} idx={i} onClick={()=>openTool(t)}/>)}
                </div>
              </div>
            </div>
            <div style={{padding:"100px 40px 120px",borderTop:"1px solid rgba(0,194,255,0.06)"}}>
              <div style={{maxWidth:760,margin:"0 auto"}}>
                <SectionHeader label="Proyectos activos" count={`— ${projects.length}`} action={<Btn small onClick={()=>setShowModal(true)}>+ Nuevo</Btn>}/>
                <Reveal><div style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:800,letterSpacing:"-.04em",lineHeight:1.05,color:C.white,marginBottom:48}}>Retoma donde<br/><span style={{color:C.blue}}>lo dejaste.</span></div></Reveal>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {projects.map((p,i)=>{const tool=TOOLS.find(t=>t.id===p.toolId);return <ProjectRow key={p.id} proj={p} tool={tool} idx={i} onClick={()=>openTool(tool,p)}/>;} )}
                </div>
              </div>
            </div>
          </div>
        )}
        {view==="tool"&&activeTool&&<ToolView tool={activeTool} project={activeProject} onBack={()=>openTool(null)}/>}
      </div>
      {showModal&&<NewProjectModal onClose={()=>setShowModal(false)} onCreate={handleCreate}/>}
    </div>
  );
}
