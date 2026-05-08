import { useState, useEffect, useRef } from "react";

const GLOBAL_STYLE = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; height: 100%; margin: 0; padding: 0; background: #04080f; overflow: hidden; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(0,194,255,0.18); border-radius: 3px; }
`;
function GlobalStyles() {
  useEffect(() => { const el = document.createElement('style'); el.innerHTML = GLOBAL_STYLE; document.head.appendChild(el); return () => document.head.removeChild(el); }, []);
  return null;
}

const USERS = {
  simon:   { pass:"sm2026", color:"#00C2FF", colorBg:"rgba(0,194,255,0.12)", colorBorder:"rgba(0,194,255,0.35)", initial:"S", label:"Simón" },
  mariana: { pass:"sm2026", color:"#FF6EC7", colorBg:"rgba(255,110,199,0.12)", colorBorder:"rgba(255,110,199,0.35)", initial:"M", label:"Mariana" },
};

const TAG_STYLES = {
  urgente:{bg:"rgba(255,80,80,0.13)",  border:"rgba(255,80,80,0.35)",  color:"#ff8080", label:"urgente"},
  info:   {bg:"rgba(0,194,255,0.08)", border:"rgba(0,194,255,0.3)", color:"#00C2FF", label:"entender"},
  dinero: {bg:"rgba(255,180,0,0.1)", border:"rgba(255,180,0,0.35)",  color:"#ffb800", label:"inversión"},
  ok:     {bg:"rgba(0,255,150,0.08)", border:"rgba(0,255,150,0.3)", color:"#00e88a", label:"clave"},
};

const PHASES = [
  { id:"p0", num:"01", label:"Fundamentos", tag:"Base",
    desc:"Antes de invertir un peso: modelo de negocio, equipo y validación.",
    proveedores:[
      {name:"Cámara de Comercio de Medellín",tipo:"Legal",contacto:"camaramedellin.com.co",nota:"Registro SAS simplificada ~$400k COP"},
      {name:"SIC Colombia",tipo:"Marcas",contacto:"sic.gov.co",nota:"Registro marca clase 5 y 32 ~$600k COP"},
      {name:"Tributar.io",tipo:"Asesoría",contacto:"tributar.io",nota:"Constitución empresa desde $200k"},
    ], ia:[],
    grupos:[
      {label:"Modelo de negocio",tareas:[
        {id:"t001",title:"Definir el problema que resuelve el producto",sub:"Respuesta en 2 frases: ¿qué duele, qué solucionas, a quién?",tag:"urgente"},
        {id:"t002",title:"Definir el cliente ideal con perfil detallado",sub:"Edad, hábitos, dónde compra, cuánto gasta en bienestar",tag:"urgente"},
        {id:"t003",title:"Analizar competencia directa e indirecta",sub:"MiO, True Lemon, marcas locales — precios, promesas, canales",tag:"info"},
        {id:"t004",title:"Definir propuesta de valor única",sub:"Qué tiene tu producto que no tiene ningún otro en Colombia",tag:"urgente"},
        {id:"t005",title:"Validar disposición a pagar con 20 personas reales",sub:"No amigos — personas que cuiden su bienestar",tag:"urgente"},
      ]},
      {label:"Equipo y estructura",tareas:[
        {id:"t006",title:"Definir roles entre socios",sub:"¿Quién lidera producto, ventas y operación?",tag:"urgente"},
        {id:"t007",title:"Establecer acuerdo de socios básico",sub:"Porcentajes, decisiones, qué pasa si uno quiere salir",tag:"info"},
        {id:"t008",title:"Definir y verificar nombre de la marca en SIC",sub:"Confirmar que esté libre antes de enamorarse del nombre",tag:"info"},
      ]},
      {label:"Finanzas base",tareas:[
        {id:"t009",title:"Definir aporte de capital de cada socio",sub:"En qué momento se aporta — no todo de una",tag:"dinero"},
        {id:"t010",title:"Abrir cuenta o Nequi exclusiva del negocio",sub:"Separar finanzas personales del negocio desde el día 1",tag:"dinero"},
        {id:"t011",title:"Construir proyección financiera a 12 meses",sub:"Costos fijos, variable por unidad, precio venta, break-even",tag:"dinero"},
      ]},
    ]
  },
  { id:"p1", num:"02", label:"Producto", tag:"Fórmula",
    desc:"Entender la bioquímica, formular, prototipar y llegar a una fórmula validada.",
    proveedores:[
      {name:"Tecnas Colombia",tipo:"Materias primas",contacto:"tecnas.com.co — Medellín/Bogotá",nota:"Vitaminas, saborizantes, glicerina, activos funcionales."},
      {name:"Laboratorio Blaskov",tipo:"Maquilador",contacto:"blaskov.com — Bogotá",nota:"Suplementos líquidos. Lotes desde 500 uds. BPM certificados."},
      {name:"Brenntag Colombia",tipo:"Materias primas",contacto:"brenntag.com/co",nota:"Glicerina USP, propilenglicol food grade, saborizantes."},
      {name:"Naturistas El Centro / La 80",tipo:"Prototipo",contacto:"Medellín — presencial",nota:"Glicerina, stevia, ácido cítrico, vitaminas para pruebas."},
    ], ia:[],
    grupos:[
      {label:"Formación técnica",tareas:[
        {id:"t012",title:"Estudiar ingredientes base: glicerina, cosolventes, pH",sub:"Entender qué hace cada componente antes de mezclar nada",tag:"info"},
        {id:"t013",title:"Estudiar activos funcionales por línea de producto",sub:"Vitaminas, biotina, magnesio — solubilidad, dosis, compatibilidad",tag:"info"},
        {id:"t014",title:"Contactar Tecnas Colombia para asesoría técnica",sub:"Proveedor clave en Medellín — asesores para emprendedores",tag:"urgente"},
      ]},
      {label:"Formulación y prototipo",tareas:[
        {id:"t015",title:"Comprar materias primas para pruebas caseras",sub:"Glicerina, stevia, ácido cítrico, vitaminas",tag:"dinero"},
        {id:"t016",title:"Desarrollar fórmula piloto sabor 1",sub:"Primer sabor completo con activos funcionales definidos",tag:"info"},
        {id:"t017",title:"Desarrollar fórmula piloto sabor 2",sub:"Segundo sabor con diferente perfil funcional",tag:"info"},
        {id:"t018",title:"Pruebas de estabilidad básicas a 30 días",sub:"Revisar color, sabor, separación a temperatura ambiente",tag:"info"},
        {id:"t019",title:"Validar sabores con 15-20 personas del perfil real",sub:"Personas que cuiden su bienestar — no amigos",tag:"urgente"},
        {id:"t020",title:"Documentar fórmula final en ficha técnica",sub:"Ingredientes exactos, porcentajes, procedimiento",tag:"ok"},
      ]},
      {label:"Maquila",tareas:[
        {id:"t021",title:"Contactar mínimo 3 laboratorios maquiladores",sub:"Cotización lote piloto 300-500 uds con BPM",tag:"urgente"},
        {id:"t022",title:"Comparar cotizaciones y elegir maquilador",sub:"Precio/unidad, tiempo entrega, certificaciones",tag:"dinero"},
        {id:"t023",title:"Producir primer lote piloto 300-500 unidades",sub:"Con empaque provisional — lo importante es el producto",tag:"dinero"},
        {id:"t024",title:"Prueba de estabilidad del lote maquilado",sub:"30/60/90 días — confirmar que la maquila reprodujo la fórmula",tag:"info"},
      ]},
    ]
  },
  { id:"p2", num:"03", label:"Marca", tag:"Identidad",
    desc:"Construir la identidad visual, naming y concepto que hace la marca memorable.",
    proveedores:[
      {name:"Behance / Workana",tipo:"Diseñadores",contacto:"behance.net / workana.com",nota:"Diseñadores colombianos. Branding freelance desde $500k COP."},
      {name:"99designs",tipo:"Diseñadores",contacto:"99designs.com",nota:"Concurso de logo desde $299 USD. Múltiples propuestas."},
      {name:"Plastiglas Medellín",tipo:"Packaging",contacto:"Medellín — directorio industrial",nota:"Frascos gotero HDPE ámbar. Lotes desde 100-200 uds."},
    ],
    ia:[
      {name:"Midjourney",uso:"Conceptos visuales y moodboards de marca",link:"midjourney.com",nivel:"⭐ El mejor para identidad visual premium"},
      {name:"Adobe Firefly",uso:"Assets visuales integrados con Adobe",link:"firefly.adobe.com",nivel:"Ideal si usan Adobe"},
      {name:"Looka",uso:"Generador de logos con IA — rápido",link:"looka.com",nivel:"Para explorar direcciones de logo"},
      {name:"Krea AI",uso:"Renders de producto y packaging",link:"krea.ai",nivel:"⭐ Visualizar empaque antes de producir"},
      {name:"Canva Magic Studio",uso:"Diseño de packaging y materiales",link:"canva.com",nivel:"Fácil de usar, buena opción inicial"},
      {name:"Galileo AI",uso:"Interfaces y experiencias digitales de marca",link:"usegalileo.ai",nivel:"Para app o web de la marca"},
    ],
    grupos:[
      {label:"Identidad",tareas:[
        {id:"t025",title:"Definir personalidad de marca con moodboard",sub:"Tono, colores, referencias visuales",tag:"info"},
        {id:"t026",title:"Contratar diseñador de identidad visual",sub:"Logo, tipografía, paleta — Behance o referidos",tag:"dinero"},
        {id:"t027",title:"Desarrollar concepto de packaging llavero/charm",sub:"Bocetos del formato, materiales, mecanismo de gotero",tag:"info"},
        {id:"t028",title:"Diseñar etiqueta para empaque provisional",sub:"Bien hecho pero económico — para el primer lote",tag:"dinero"},
      ]},
      {label:"Legal",tareas:[
        {id:"t029",title:"Registrar marca en SIC — clase 5 y 32",sub:"Suplementos y bebidas ~$500k-800k COP",tag:"dinero"},
        {id:"t030",title:"Constituir empresa SAS ante Cámara de Comercio",sub:"~$300k-500k. Necesario para INVIMA y facturación",tag:"dinero"},
        {id:"t031",title:"Iniciar trámite INVIMA como suplemento dietario",sub:"Decreto 3249 — 3-6 meses. Iniciar temprano.",tag:"info"},
      ]},
    ]
  },
  { id:"p3", num:"04", label:"Ventas", tag:"Go to market",
    desc:"Primeros clientes, canales y flujo de caja real.",
    proveedores:[
      {name:"Smart Fit Medellín",tipo:"Gimnasios",contacto:"smartfit.com.co",nota:"Proponer consignación 30-35% para tienda interna."},
      {name:"Body Tech Medellín",tipo:"Gimnasios",contacto:"bodytech.com.co",nota:"Cadena premium. Mejor ticket por cliente."},
      {name:"Mercado del Río",tipo:"Feria lifestyle",contacto:"mercadodelrio.com — El Poblado",nota:"Alta visibilidad, cliente con poder adquisitivo."},
      {name:"WhatsApp Business",tipo:"Canal directo",contacto:"business.whatsapp.com",nota:"Cero comisión. Catálogo, pagos Nequi/Bancolombia."},
    ], ia:[],
    grupos:[
      {label:"Canales iniciales",tareas:[
        {id:"t032",title:"Crear perfil de Instagram y TikTok de la marca",sub:"Bio clara, primeras 3 publicaciones antes de vender",tag:"info"},
        {id:"t033",title:"Configurar catálogo en WhatsApp Business",sub:"Productos, precios, formas de pago, zona de domicilios",tag:"info"},
        {id:"t034",title:"Visitar 10 gimnasios con muestras y propuesta",sub:"Laureles, El Poblado, Envigado — consignación 30-35%",tag:"urgente"},
        {id:"t035",title:"Visitar 10 tiendas naturistas con muestras",sub:"Muestra + hoja de producto + precio de distribuidor",tag:"urgente"},
        {id:"t036",title:"Participar en 1 feria de bienestar en Medellín",sub:"Mercado del Río, pop-ups El Poblado",tag:"info"},
      ]},
      {label:"Primeras ventas",tareas:[
        {id:"t037",title:"Conseguir primeros 50 clientes pagos",sub:"Meta real: 50 personas que pagaron con su plata",tag:"urgente"},
        {id:"t038",title:"Establecer precio final al consumidor",sub:"Costo real + margen + prueba con clientes",tag:"dinero"},
        {id:"t039",title:"Definir política de domicilios y logística",sub:"Rappi, mensajero propio o punto fijo",tag:"info"},
        {id:"t040",title:"Recolectar 20 testimonios reales",sub:"Foto, video o texto — prueba social para redes",tag:"ok"},
      ]},
      {label:"Métricas clave",tareas:[
        {id:"t041",title:"Calcular CAC — costo de adquirir un cliente",sub:"Total gastado / número de clientes pagos",tag:"dinero"},
        {id:"t042",title:"Medir tasa de recompra al mes 2 y 3",sub:"Si no recompran, hay problema de producto o precio",tag:"info"},
        {id:"t043",title:"Alcanzar punto de equilibrio operativo",sub:"El mes en que ingresos cubren todos los costos",tag:"dinero"},
      ]},
    ]
  },
  { id:"p4", num:"05", label:"Escala", tag:"Crecimiento",
    desc:"Cuando ya vendes consistente: crecer canales, ampliar portafolio y sistematizar.",
    proveedores:[
      {name:"MercadoLibre Colombia",tipo:"Canal digital",contacto:"mercadolibre.com.co",nota:"Requiere INVIMA activo. Alto volumen."},
      {name:"Siigo / Alegra",tipo:"Contabilidad",contacto:"siigo.com / alegra.com",nota:"Software contable desde $50k/mes."},
    ], ia:[],
    grupos:[
      {label:"Portafolio",tareas:[
        {id:"t044",title:"Lanzar segunda línea: vitaminas divertidas",sub:"Misma identidad, nuevo formato — gummies, shots, cápsulas",tag:"info"},
        {id:"t045",title:"Desarrollar ediciones especiales o estacionales",sub:"Navidad, San Valentín, temporada deportiva",tag:"info"},
        {id:"t046",title:"Desarrollar packaging personalizado llavero/charm",sub:"Con ventas validadas, invertir en el molde",tag:"dinero"},
      ]},
      {label:"Canales de escala",tareas:[
        {id:"t047",title:"Entrar a MercadoLibre y Rappi Market",sub:"Requiere INVIMA activo",tag:"info"},
        {id:"t048",title:"Desarrollar canal B2B — empresas",sub:"Un cliente corporativo = 50-200 uds/mes recurrentes",tag:"ok"},
        {id:"t049",title:"Activar programa de embajadores fitness",sub:"Personas con audiencia real — no mega influencers",tag:"info"},
      ]},
      {label:"Operación",tareas:[
        {id:"t050",title:"Sistematizar producción con maquilador",sub:"Lotes mensuales predecibles, mejor precio por volumen",tag:"dinero"},
        {id:"t051",title:"Contratar primer empleado o freelance de ventas",sub:"Cuando ya no alcanzas a atender todos los canales",tag:"dinero"},
        {id:"t052",title:"Implementar Siigo o Alegra para contabilidad",sub:"Antes de que crezca el caos operativo",tag:"info"},
      ]},
    ]
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────
function GlowCard({children,onClick,style={},hover=true}){
  const[h,setH]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>hover&&setH(true)} onMouseLeave={()=>hover&&setH(false)}
    style={{background:h?"rgba(0,194,255,0.04)":"rgba(8,13,24,0.85)",border:h?"1px solid rgba(0,194,255,0.28)":"1px solid rgba(0,194,255,0.09)",borderRadius:14,transition:"all .2s",cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}

function Btn({children,onClick,primary,small,disabled,color,danger}){
  const[h,setH]=useState(false);
  const col=danger?"#ff6b6b":color||"#00C2FF";
  const rgb=danger?"255,107,107":color==="#FF6EC7"?"255,110,199":"0,194,255";
  return <button onClick={onClick} disabled={disabled}
    onMouseEnter={()=>!disabled&&setH(true)} onMouseLeave={()=>setH(false)}
    style={{padding:small?"6px 16px":"12px 26px",background:primary?(disabled?"rgba(0,194,255,0.07)":h?`rgba(${rgb},0.95)`:`rgba(${rgb},0.85)`):(h?`rgba(${rgb},0.09)`:"transparent"),
    color:primary?(disabled?"rgba(0,194,255,0.3)":"#04080f"):(disabled?"rgba(100,140,180,0.3)":col),
    border:primary?"none":`1.5px solid ${disabled?`rgba(${rgb},0.1)`:h?`rgba(${rgb},0.5)`:`rgba(${rgb},0.25)`}`,
    borderRadius:999,fontSize:small?12:14,fontWeight:primary?700:600,cursor:disabled?"not-allowed":"pointer",
    letterSpacing:".03em",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap",outline:"none",display:"inline-flex",alignItems:"center",gap:5}}>{children}</button>;
}

function Badge({tag}){
  const ts=TAG_STYLES[tag]||TAG_STYLES.info;
  return <span style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:`1px solid ${ts.border}`,background:ts.bg,color:ts.color,fontWeight:600,letterSpacing:".04em"}}>{ts.label}</span>;
}

function Av({user,size=28}){
  const u=USERS[user];
  return <div style={{width:size,height:size,borderRadius:"50%",background:u.colorBg,border:`1px solid ${u.colorBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.38,fontWeight:700,color:u.color,flexShrink:0}}>{u.initial}</div>;
}

function AnimatedBg({full=false}){
  return(
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="rg1" cx="20%" cy="30%" r="55%"><stop offset="0%" stopColor="#00C2FF" stopOpacity="0.12"/><stop offset="100%" stopColor="#04080f" stopOpacity="0"/></radialGradient>
        <radialGradient id="rg2" cx="80%" cy="70%" r="50%"><stop offset="0%" stopColor="#00C2FF" stopOpacity="0.07"/><stop offset="100%" stopColor="#04080f" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#rg1)"/><rect width="1200" height="800" fill="url(#rg2)"/>
      {full&&<>{[{cx:200,cy:150,r:1.5,dur:"3s"},{cx:400,cy:80,r:1,dur:"4s"},{cx:700,cy:200,r:2,dur:"2.5s"},{cx:900,cy:120,r:1.5,dur:"3.5s"},{cx:1100,cy:300,r:1,dur:"5s"},{cx:150,cy:400,r:1.5,dur:"4s"},{cx:600,cy:500,r:1,dur:"3s"},{cx:1000,cy:600,r:2,dur:"4.5s"}].map((p,i)=>(
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#00C2FF" opacity="0.4"><animate attributeName="opacity" values="0.1;0.8;0.1" dur={p.dur} repeatCount="indefinite"/></circle>
      ))}</>}
    </svg>
  );
}

function RadialChart({pct,color,size=88,label,value}){
  const r=32,c=2*Math.PI*r,dash=c*(pct/100);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7}}>
      <div style={{position:"relative",width:size,height:size}}>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,194,255,0.07)" strokeWidth="7"/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7" strokeDasharray={`${dash} ${c}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.8s ease"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:15,fontWeight:800,color,lineHeight:1}}>{value}</div>
        </div>
      </div>
      <div style={{fontSize:11,color:"rgba(100,150,200,0.45)",textAlign:"center",maxWidth:80}}>{label}</div>
    </div>
  );
}

// ── ConfirmDialog ─────────────────────────────────────────────────────────────
function ConfirmDialog({msg,onConfirm,onCancel}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(4,8,15,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}}>
      <div style={{background:"#080d18",border:"1px solid rgba(255,80,80,0.3)",borderRadius:16,padding:"32px 36px",maxWidth:400,width:"90%",textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:12}}>⚠️</div>
        <div style={{fontSize:16,fontWeight:700,color:"#e8edf5",marginBottom:8}}>¿Confirmar eliminación?</div>
        <div style={{fontSize:14,color:"rgba(100,150,200,0.5)",marginBottom:28,lineHeight:1.6}}>{msg}</div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn danger onClick={onConfirm}>Sí, eliminar</Btn>
          <Btn onClick={onCancel}>Cancelar</Btn>
        </div>
      </div>
    </div>
  );
}

// ── NoteModal ─────────────────────────────────────────────────────────────────
function NoteModal({task,existing,onSave,onClose}){
  const[text,setText]=useState(existing||"");
  const inp={width:"100%",boxSizing:"border-box",background:"rgba(0,194,255,0.03)",border:"1px solid rgba(0,194,255,0.14)",color:"#e8edf5",borderRadius:8,padding:"11px 15px",fontSize:14,fontFamily:"inherit",outline:"none"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(4,8,15,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}}>
      <GlowCard hover={false} style={{padding:"32px",width:520,borderColor:"rgba(255,180,0,0.22)"}}>
        <div style={{fontSize:11,color:"#ffb800",letterSpacing:".12em",textTransform:"uppercase",marginBottom:5}}>Información de tarea</div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:18,color:"#e8edf5",lineHeight:1.4}}>{task}</div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Contactos, links, decisiones, avances, información clave…" rows={6}
          style={{...inp,resize:"vertical",marginBottom:16,lineHeight:1.6}}/>
        <div style={{display:"flex",gap:10}}>
          <Btn primary onClick={()=>onSave(text)}>Guardar información</Btn>
          <Btn onClick={onClose}>Cancelar</Btn>
        </div>
      </GlowCard>
    </div>
  );
}

// ── FileUploadWidget ──────────────────────────────────────────────────────────
function FileUploadWidget({taskId,files,onAdd,onRemove}){
  const ref=useRef();
  function handleFiles(fileList){
    Array.from(fileList).forEach(file=>{
      const reader=new FileReader();
      reader.onload=e=>{
        onAdd(taskId,{id:Date.now()+'_'+file.name,name:file.name,size:file.size,type:file.type,data:e.target.result,date:new Date().toLocaleDateString("es-CO")});
      };
      reader.readAsDataURL(file);
    });
  }
  const[drag,setDrag]=useState(false);
  const taskFiles=(files[taskId]||[]);
  return(
    <div style={{marginTop:8}}>
      <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files);}}
        style={{border:`1.5px dashed ${drag?"rgba(0,194,255,0.5)":"rgba(0,194,255,0.14)"}`,borderRadius:8,padding:"10px 14px",background:drag?"rgba(0,194,255,0.05)":"transparent",transition:"all .2s",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}
        onClick={()=>ref.current.click()}>
        <span style={{fontSize:18}}>📎</span>
        <span style={{fontSize:12,color:"rgba(0,194,255,0.45)"}}>Adjuntar archivo, foto o documento — arrastra o clic aquí</span>
        <input ref={ref} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
      </div>
      {taskFiles.length>0&&(
        <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:6}}>
          {taskFiles.map(f=>(
            <div key={f.id} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:6,background:"rgba(0,194,255,0.05)",border:"1px solid rgba(0,194,255,0.15)"}}>
              <span style={{fontSize:13}}>{f.type?.startsWith("image/")?"🖼️":"📄"}</span>
              {f.type?.startsWith("image/")
                ?<a href={f.data} download={f.name} style={{fontSize:12,color:"#00C2FF",textDecoration:"none",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</a>
                :<a href={f.data} download={f.name} style={{fontSize:12,color:"#00C2FF",textDecoration:"none",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</a>
              }
              <span style={{fontSize:10,color:"rgba(100,150,200,0.3)"}}>{(f.size/1024).toFixed(0)}kb</span>
              <button onClick={()=>onRemove(taskId,f.id)} style={{background:"none",border:"none",color:"rgba(255,80,80,0.5)",cursor:"pointer",fontSize:12,padding:"0 2px",lineHeight:1}}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App(){
  const[auth,setAuth]=useState(null);
  const[loginUser,setLoginUser]=useState("simon");
  const[loginPass,setLoginPass]=useState("");
  const[loginErr,setLoginErr]=useState("");
  const[view,setView]=useState("home");
  const[activePhase,setActivePhase]=useState(null);
  const[activeTab,setActiveTab]=useState("tareas");
  const[checks,setChecks]=useState({});
  const[notes,setNotes]=useState({});
  const[attachments,setAttachments]=useState({});
  const[decisions,setDecisions]=useState([]);
  const[editNote,setEditNote]=useState(null);
  const[showDecForm,setShowDecForm]=useState(false);
  const[decText,setDecText]=useState("");
  const[decTag,setDecTag]=useState("estrategia");
  const[confirmDel,setConfirmDel]=useState(null); // {type,id,msg}
  const[saveInd,setSaveInd]=useState("");
  const inp={width:"100%",boxSizing:"border-box",background:"rgba(0,194,255,0.03)",border:"1px solid rgba(0,194,255,0.14)",color:"#e8edf5",borderRadius:8,padding:"11px 15px",fontSize:14,fontFamily:"inherit",outline:"none"};

  useEffect(()=>{load();},[]);

  async function load(){
    try{const r=await window.storage.get("sm2026-v4",true);if(r?.value){const s=JSON.parse(r.value);setChecks(s.checks||{});setNotes(s.notes||{});setDecisions(s.decisions||[]);setAttachments(s.attachments||{});}}catch(e){}
  }
  async function persist(nc,nn,nd,na){
    const p={checks:nc??checks,notes:nn??notes,decisions:nd??decisions,attachments:na??attachments};
    try{await window.storage.set("sm2026-v4",JSON.stringify(p),true);setSaveInd("Guardado");setTimeout(()=>setSaveInd(""),2000);}catch(e){}
  }

  function login(){const u=USERS[loginUser];if(u?.pass===loginPass){setAuth(loginUser);setLoginErr("");setView("home");}else setLoginErr("Contraseña incorrecta");}
  function toggleCheck(id){const nc={...checks};nc[id]===auth?delete nc[id]:nc[id]=auth;setChecks(nc);persist(nc,null,null,null);}
  function saveNote(text){const nn={...notes,[editNote.id]:text};setNotes(nn);setEditNote(null);persist(null,nn,null,null);}
  function deleteNote(taskId){const nn={...notes};delete nn[taskId];setNotes(nn);persist(null,nn,null,null);}
  function addAttachment(taskId,file){const na={...attachments,[taskId]:[...(attachments[taskId]||[]),file]};setAttachments(na);persist(null,null,null,na);}
  function removeAttachment(taskId,fileId){const na={...attachments,[taskId]:(attachments[taskId]||[]).filter(f=>f.id!==fileId)};setAttachments(na);persist(null,null,null,na);}
  function addDecision(){if(!decText.trim())return;const nd=[{id:Date.now(),text:decText,author:auth,tag:decTag,date:new Date().toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"})},...decisions];setDecisions(nd);setDecText("");setShowDecForm(false);persist(null,null,nd,null);}
  function confirmDelete(type,id,msg){setConfirmDel({type,id,msg});}
  function executeDelete(){
    if(!confirmDel)return;
    if(confirmDel.type==="decision"){const nd=decisions.filter(d=>d.id!==confirmDel.id);setDecisions(nd);persist(null,null,nd,null);}
    if(confirmDel.type==="note"){deleteNote(confirmDel.id);}
    if(confirmDel.type==="attachment"){const[taskId,fileId]=confirmDel.id.split("||");removeAttachment(taskId,fileId);}
    setConfirmDel(null);
  }

  const totalTasks=PHASES.reduce((a,p)=>a+p.grupos.reduce((b,g)=>b+g.tareas.length,0),0);
  const doneTasks=Object.keys(checks).length;
  const simonDone=Object.values(checks).filter(v=>v==="simon").length;
  const marianaDone=Object.values(checks).filter(v=>v==="mariana").length;
  const globalPct=Math.round((doneTasks/totalTasks)*100);
  const AU=USERS[auth||"simon"];

  if(!auth)return(
    <div style={{background:"#04080f",position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <GlobalStyles/><AnimatedBg full/>
      <div style={{position:"relative",zIndex:1,width:400}}>
        <GlowCard hover={false} style={{padding:"44px 38px",borderColor:"rgba(0,194,255,0.22)"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontSize:12,color:"#00C2FF",letterSpacing:".15em",textTransform:"uppercase",marginBottom:12}}>Proyecto S&M 2026</div>
            <div style={{fontSize:28,fontWeight:800,letterSpacing:"-.03em",lineHeight:1.2}}>Bienvenidos al<br/><span style={{color:"#00C2FF"}}>OS del negocio</span></div>
            <div style={{fontSize:12,color:"rgba(100,150,200,0.3)",marginTop:8}}>Water Drops · Medellín</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:"rgba(100,150,200,0.45)",marginBottom:7}}>¿Quién eres?</div>
            <select value={loginUser} onChange={e=>setLoginUser(e.target.value)} style={{...inp,cursor:"pointer"}}><option value="simon">Simón</option><option value="mariana">Mariana</option></select>
          </div>
          <div style={{marginBottom:24}}>
            <div style={{fontSize:12,color:"rgba(100,150,200,0.45)",marginBottom:7}}>Contraseña del equipo</div>
            <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="••••••••" style={inp}/>
            {loginErr&&<div style={{fontSize:12,color:"#ff6b6b",marginTop:6}}>{loginErr}</div>}
          </div>
          <Btn primary onClick={login} style={{width:"100%"}}>Entrar →</Btn>
        </GlowCard>
      </div>
    </div>
  );

  return(
    <div style={{background:"#04080f",position:"fixed",inset:0,display:"flex",overflow:"hidden",fontFamily:"'Helvetica Neue',Arial,sans-serif",color:"#e8edf5"}}>
      <GlobalStyles/>

      {/* SIDEBAR */}
      <div style={{width:240,minWidth:240,height:"100%",background:"rgba(4,8,15,0.98)",borderRight:"1px solid rgba(0,194,255,0.07)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"20px 22px 16px",borderBottom:"1px solid rgba(0,194,255,0.07)",cursor:"pointer"}} onClick={()=>setView("home")}>
          <div style={{fontSize:16,fontWeight:800,lineHeight:1.25}}>Proyecto<br/><span style={{color:"#00C2FF"}}>S&M 2026</span></div>
          <div style={{fontSize:10,color:"rgba(0,194,255,0.28)",letterSpacing:".1em",marginTop:5,textTransform:"uppercase"}}>Water Drops · Medellín</div>
        </div>
        {[{id:"home",icon:"🏠",label:"Inicio"},{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"bitacora",icon:"📝",label:"Bitácora"}].map(item=>(
          <div key={item.id} onClick={()=>setView(item.id)}
            style={{padding:"11px 22px",cursor:"pointer",borderLeft:view===item.id?"2.5px solid #00C2FF":"2.5px solid transparent",background:view===item.id?"rgba(0,194,255,0.06)":"transparent",transition:"all .13s",display:"flex",alignItems:"center",gap:10,marginTop:item.id==="home"?10:0}}
            onMouseEnter={e=>{if(view!==item.id)e.currentTarget.style.background="rgba(0,194,255,0.03)";}} onMouseLeave={e=>{if(view!==item.id)e.currentTarget.style.background="transparent";}}>
            <span style={{fontSize:15}}>{item.icon}</span>
            <span style={{fontSize:13,color:view===item.id?"#e8edf5":"rgba(100,140,180,0.55)",fontWeight:view===item.id?600:400}}>{item.label}</span>
          </div>
        ))}
        <div style={{padding:"8px 0 4px",borderTop:"1px solid rgba(0,194,255,0.06)",marginTop:10}}>
          <div style={{fontSize:10,color:"rgba(0,194,255,0.2)",letterSpacing:".1em",textTransform:"uppercase",padding:"6px 22px 5px"}}>Fases</div>
          {PHASES.map(ph=>{
            const pd=ph.grupos.reduce((a,g)=>a+g.tareas.filter(t=>checks[t.id]).length,0);
            const pt=ph.grupos.reduce((a,g)=>a+g.tareas.length,0);
            const pct=Math.round((pd/pt)*100);
            const act=activePhase?.id===ph.id&&view==="phase";
            return(
              <div key={ph.id} onClick={()=>{setActivePhase(ph);setView("phase");setActiveTab("tareas");}}
                style={{padding:"7px 22px",cursor:"pointer",borderLeft:act?"2.5px solid #00C2FF":"2.5px solid transparent",background:act?"rgba(0,194,255,0.05)":"transparent",transition:"all .13s"}}
                onMouseEnter={e=>{if(!act)e.currentTarget.style.background="rgba(0,194,255,0.02)";}} onMouseLeave={e=>{if(!act)e.currentTarget.style.background="transparent";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:act?"#e8edf5":"rgba(100,140,180,0.5)"}}>{ph.num} · {ph.label}</span>
                  <span style={{fontSize:10,color:pct===100?"#00e88a":"rgba(0,194,255,0.3)"}}>{pct}%</span>
                </div>
                <div style={{height:2,background:"rgba(0,194,255,0.05)",borderRadius:1,marginTop:3,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#00e88a":"rgba(0,194,255,0.4)",borderRadius:1,transition:"width .4s"}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:"auto",padding:"14px 22px",borderTop:"1px solid rgba(0,194,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <Av user={auth} size={30}/>
            <div><div style={{fontSize:13,color:"#e8edf5",fontWeight:600}}>{AU.label}</div><div style={{fontSize:10,color:AU.color}}>· Activo</div></div>
          </div>
          <div onClick={()=>setAuth(null)} style={{fontSize:11,color:"rgba(100,140,180,0.3)",cursor:"pointer",padding:"3px 8px",border:"1px solid rgba(0,194,255,0.07)",borderRadius:5}}
            onMouseEnter={e=>e.currentTarget.style.color="rgba(255,80,80,0.6)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(100,140,180,0.3)"}>salir</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
        <div style={{height:54,minHeight:54,borderBottom:"1px solid rgba(0,194,255,0.07)",padding:"0 36px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(4,8,15,0.96)",flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:700,color:"#e8edf5"}}>
            {view==="home"&&"Inicio"}{view==="dashboard"&&"Dashboard"}{view==="phase"&&activePhase&&`Fase ${activePhase.num} — ${activePhase.label}`}{view==="bitacora"&&"Bitácora de decisiones"}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {saveInd&&<span style={{fontSize:11,color:"rgba(0,194,255,0.4)",display:"flex",alignItems:"center",gap:4}}><span>✓</span>{saveInd}</span>}
            <span style={{fontSize:12,color:"rgba(100,150,200,0.3)"}}>{doneTasks}/{totalTasks} · {globalPct}%</span>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>

          {/* HOME */}
          {view==="home"&&(
            <div style={{position:"relative",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              <AnimatedBg full/>
              <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"40px 32px",maxWidth:700}}>
                <div style={{fontSize:13,color:"rgba(0,194,255,0.6)",letterSpacing:".2em",textTransform:"uppercase",marginBottom:20}}>Proyecto S&M 2026</div>
                <div style={{fontSize:56,fontWeight:900,letterSpacing:"-.04em",lineHeight:1.08,marginBottom:24}}>
                  Bienvenidos al<br/><span style={{color:"#00C2FF",textShadow:"0 0 60px rgba(0,194,255,0.4)"}}>proyecto de sus sueños</span>
                </div>
                <div style={{fontSize:16,color:"rgba(100,150,200,0.4)",marginBottom:44,lineHeight:1.6}}>Water Drops Vitamínicos · Medellín · 2026</div>
                <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
                  <Btn primary onClick={()=>setView("dashboard")}>Ver Dashboard →</Btn>
                  <Btn onClick={()=>{setActivePhase(PHASES[0]);setView("phase");setActiveTab("tareas");}}>Iniciar Fase 01</Btn>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD */}
          {view==="dashboard"&&(
            <div style={{padding:"30px 38px",maxWidth:1100}}>
              <div style={{position:"relative",marginBottom:26,padding:"28px",borderRadius:16,border:"1px solid rgba(0,194,255,0.09)",background:"rgba(8,13,24,0.8)",overflow:"hidden"}}>
                <AnimatedBg/>
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{fontSize:34,fontWeight:800,letterSpacing:"-.03em",marginBottom:5}}>Hola, <span style={{color:AU.color,textShadow:`0 0 20px ${AU.color}55`}}>{AU.label}.</span></div>
                  <div style={{fontSize:13,color:"rgba(100,150,200,0.4)"}}>Water Drops · Medellín · 2026</div>
                </div>
              </div>
              <div style={{display:"flex",gap:18,marginBottom:26,padding:"26px",background:"rgba(8,13,24,0.7)",borderRadius:14,border:"1px solid rgba(0,194,255,0.07)",alignItems:"center",flexWrap:"wrap",justifyContent:"space-around"}}>
                <RadialChart pct={globalPct} color="#00C2FF" size={92} label="Progreso total" value={`${globalPct}%`}/>
                <div style={{width:1,height:72,background:"rgba(0,194,255,0.07)"}}/>
                <RadialChart pct={totalTasks>0?Math.round((doneTasks/totalTasks)*100):0} color="#e8edf5" size={92} label="Tareas hechas" value={`${doneTasks}/${totalTasks}`}/>
                <div style={{width:1,height:72,background:"rgba(0,194,255,0.07)"}}/>
                <RadialChart pct={totalTasks>0?Math.round((simonDone/totalTasks)*100):0} color="#00C2FF" size={92} label="Por Simón" value={simonDone}/>
                <div style={{width:1,height:72,background:"rgba(0,194,255,0.07)"}}/>
                <RadialChart pct={totalTasks>0?Math.round((marianaDone/totalTasks)*100):0} color="#FF6EC7" size={92} label="Por Mariana" value={marianaDone}/>
                <div style={{width:1,height:72,background:"rgba(0,194,255,0.07)"}}/>
                <RadialChart pct={decisions.length>0?Math.min(decisions.length*10,100):0} color="#ffb800" size={92} label="Decisiones" value={decisions.length}/>
              </div>
              <div style={{marginBottom:26,padding:"20px 22px",background:"rgba(8,13,24,0.7)",border:"1px solid rgba(0,194,255,0.07)",borderRadius:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                  <span style={{fontSize:13,color:"rgba(100,150,200,0.45)"}}>Progreso global del proyecto</span>
                  <span style={{fontSize:14,fontWeight:700,color:"#00C2FF"}}>{globalPct}%</span>
                </div>
                <div style={{height:10,background:"rgba(0,194,255,0.05)",borderRadius:5,overflow:"hidden",marginBottom:9}}>
                  <div style={{width:`${globalPct}%`,height:"100%",background:"linear-gradient(90deg,#00C2FF,#FF6EC7)",borderRadius:5,transition:"width .5s"}}/>
                </div>
                <div style={{display:"flex",gap:18}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:"#00C2FF"}}/><span style={{fontSize:11,color:"rgba(0,194,255,0.5)"}}>Simón: {simonDone}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:"#FF6EC7"}}/><span style={{fontSize:11,color:"rgba(255,110,199,0.5)"}}>Mariana: {marianaDone}</span></div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {PHASES.map(ph=>{
                  const pd=ph.grupos.reduce((a,g)=>a+g.tareas.filter(t=>checks[t.id]).length,0);
                  const pt=ph.grupos.reduce((a,g)=>a+g.tareas.length,0);
                  const pct=Math.round((pd/pt)*100);
                  const ps=ph.grupos.reduce((a,g)=>a+g.tareas.filter(t=>checks[t.id]==="simon").length,0);
                  const pm=ph.grupos.reduce((a,g)=>a+g.tareas.filter(t=>checks[t.id]==="mariana").length,0);
                  return(
                    <GlowCard key={ph.id} onClick={()=>{setActivePhase(ph);setView("phase");setActiveTab("tareas");}} style={{padding:"18px 20px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                        <div style={{width:38,height:38,borderRadius:9,background:"rgba(0,194,255,0.06)",border:"1px solid rgba(0,194,255,0.16)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#00C2FF",flexShrink:0}}>{ph.num}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                            <span style={{fontSize:15,fontWeight:600,color:"#e8edf5"}}>{ph.label}</span>
                            <span style={{fontSize:13,fontWeight:700,color:pct===100?"#00e88a":"#00C2FF"}}>{pct}%</span>
                          </div>
                          <div style={{height:6,background:"rgba(0,194,255,0.05)",borderRadius:3,overflow:"hidden",marginBottom:5}}>
                            <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#00e88a":"linear-gradient(90deg,#00C2FF,#5BE0FF)",borderRadius:3,transition:"width 0.8s"}}/>
                          </div>
                          <div style={{display:"flex",gap:12}}>
                            {ps>0&&<span style={{fontSize:10,color:"rgba(0,194,255,0.45)"}}>● Simón: {ps}</span>}
                            {pm>0&&<span style={{fontSize:10,color:"rgba(255,110,199,0.45)"}}>● Mariana: {pm}</span>}
                          </div>
                        </div>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* PHASE */}
          {view==="phase"&&activePhase&&(
            <div style={{padding:"30px 38px",maxWidth:960}}>
              <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap",alignItems:"center"}}>
                <Btn small onClick={()=>setView("dashboard")}>← Volver</Btn>
                {["tareas","proveedores"].map(tab=>(
                  <Btn key={tab} small onClick={()=>setActiveTab(tab)} primary={activeTab===tab}>{tab==="tareas"?"Tareas":"Proveedores"}</Btn>
                ))}
              </div>
              <div style={{marginBottom:22}}>
                <div style={{fontSize:24,fontWeight:800,letterSpacing:"-.02em",marginBottom:5}}>{activePhase.num} · {activePhase.label}</div>
                <div style={{fontSize:14,color:"rgba(100,150,200,0.4)",lineHeight:1.6}}>{activePhase.desc}</div>
              </div>

              {activeTab==="tareas"&&(
                <div style={{display:"flex",gap:22}}>
                  <div style={{flex:1,minWidth:0}}>
                    {activePhase.grupos.map(g=>(
                      <div key={g.label} style={{marginBottom:26}}>
                        <div style={{fontSize:11,color:"rgba(0,194,255,0.32)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>{g.label}</div>
                        {g.tareas.map(t=>{
                          const who=checks[t.id];const done=!!who;const whoU=who?USERS[who]:null;
                          const hasNote=notes[t.id]?.trim();const hasFiles=(attachments[t.id]||[]).length>0;
                          return(
                            <div key={t.id} style={{padding:"14px 16px",borderRadius:11,border:`1px solid ${done?`${whoU.colorBorder}40`:"rgba(0,194,255,0.07)"}`,background:done?whoU.colorBg.replace("0.12","0.03"):"rgba(8,13,24,0.6)",marginBottom:8,transition:"all .2s"}}>
                              <div style={{display:"flex",alignItems:"flex-start",gap:11}}>
                                <div onClick={()=>toggleCheck(t.id)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${done?whoU.color:"rgba(0,194,255,0.25)"}`,background:done?whoU.color:"transparent",flexShrink:0,marginTop:1,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .18s"}}>
                                  {done&&<div style={{width:9,height:5,borderLeft:"2px solid #04080f",borderBottom:"2px solid #04080f",transform:"rotate(-45deg) translateY(-1px)"}}/>}
                                </div>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,flexWrap:"wrap",marginBottom:3}}>
                                    <div style={{fontSize:15,color:done?"rgba(100,150,200,0.38)":"#e8edf5",textDecoration:done?"line-through":"none",lineHeight:1.4,fontWeight:500}}>{t.title}</div>
                                    <div style={{display:"flex",gap:6,flexShrink:0,alignItems:"center",flexWrap:"wrap"}}>
                                      {done&&whoU&&(
                                        <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:999,background:whoU.colorBg,border:`1px solid ${whoU.colorBorder}`}}>
                                          <div style={{width:5,height:5,borderRadius:"50%",background:whoU.color}}/>
                                          <span style={{fontSize:11,color:whoU.color,fontWeight:600}}>{whoU.label}</span>
                                        </div>
                                      )}
                                      <Badge tag={t.tag}/>
                                    </div>
                                  </div>
                                  <div style={{fontSize:13,color:"rgba(100,150,200,0.35)",marginBottom:10,lineHeight:1.5}}>{t.sub}</div>

                                  {/* Info guardada */}
                                  {hasNote&&(
                                    <div style={{marginBottom:8,padding:"8px 12px",background:"rgba(255,180,0,0.04)",borderRadius:7,borderLeft:"2px solid rgba(255,180,0,0.3)"}}>
                                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                                        <div style={{fontSize:13,color:"rgba(255,200,100,0.65)",lineHeight:1.55,flex:1}}>{notes[t.id].slice(0,200)}{notes[t.id].length>200?"…":""}</div>
                                        <div style={{display:"flex",gap:5,flexShrink:0}}>
                                          <button onClick={()=>setEditNote({id:t.id,title:t.title})} style={{background:"rgba(255,180,0,0.08)",border:"1px solid rgba(255,180,0,0.2)",color:"#ffb800",borderRadius:5,padding:"3px 8px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Editar</button>
                                          <button onClick={()=>confirmDelete("note",t.id,"Se borrará la información guardada en esta tarea. Esta acción no se puede deshacer.")} style={{background:"rgba(255,80,80,0.07)",border:"1px solid rgba(255,80,80,0.2)",color:"#ff8080",borderRadius:5,padding:"3px 8px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕ Borrar</button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Action buttons */}
                                  <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                                    <Btn small onClick={()=>setEditNote({id:t.id,title:t.title})} color={hasNote?"#ffb800":"#00C2FF"}>
                                      {hasNote?"✏️ Editar información":"+ Agregar información"}
                                    </Btn>
                                    {(hasFiles)&&<span style={{fontSize:11,color:"rgba(0,194,255,0.4)"}}>{attachments[t.id]?.length} archivo{attachments[t.id]?.length>1?"s":""} adjunto{attachments[t.id]?.length>1?"s":""}</span>}
                                  </div>

                                  {/* File upload */}
                                  <FileUploadWidget taskId={t.id} files={attachments} onAdd={addAttachment}
                                    onRemove={(tid,fid)=>confirmDelete("attachment",`${tid}||${fid}`,"Se eliminará este archivo adjunto. Esta acción no se puede deshacer.")}/>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* IA sidebar for Marca */}
                  {activePhase.ia.length>0&&(
                    <div style={{width:270,flexShrink:0}}>
                      <div style={{fontSize:11,color:"rgba(0,194,255,0.32)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>IA recomendada</div>
                      {activePhase.ia.map((tool,i)=>(
                        <GlowCard key={i} hover={false} style={{padding:"14px 15px",marginBottom:9}}>
                          <div style={{fontSize:13,fontWeight:600,color:"#e8edf5",marginBottom:4}}>{tool.name}</div>
                          <div style={{fontSize:12,color:"rgba(100,150,200,0.42)",marginBottom:4,lineHeight:1.45}}>{tool.uso}</div>
                          <div style={{fontSize:11,color:"rgba(91,224,255,0.55)",marginBottom:3}}>{tool.link}</div>
                          <div style={{fontSize:11,color:"rgba(0,194,255,0.5)",fontStyle:"italic"}}>{tool.nivel}</div>
                        </GlowCard>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab==="proveedores"&&(
                <div>
                  <div style={{fontSize:11,color:"rgba(0,194,255,0.28)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:16}}>Proveedores y contactos reales</div>
                  {activePhase.proveedores.length===0
                    ?<div style={{fontSize:14,color:"rgba(100,150,200,0.3)",padding:"14px 0"}}>Sin proveedores específicos en esta fase.</div>
                    :activePhase.proveedores.map((p,i)=>(
                      <GlowCard key={i} hover={false} style={{padding:"16px 18px",marginBottom:9}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:6}}>
                          <div style={{fontSize:15,fontWeight:600,color:"#e8edf5"}}>{p.name}</div>
                          <span style={{fontSize:11,padding:"3px 10px",border:"1px solid rgba(0,194,255,0.18)",color:"#00C2FF",borderRadius:999,whiteSpace:"nowrap"}}>{p.tipo}</span>
                        </div>
                        <div style={{fontSize:13,color:"rgba(0,194,255,0.5)",marginBottom:4}}>{p.contacto}</div>
                        <div style={{fontSize:13,color:"rgba(100,150,200,0.42)",lineHeight:1.55}}>{p.nota}</div>
                      </GlowCard>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* BITÁCORA */}
          {view==="bitacora"&&(
            <div style={{padding:"30px 38px",maxWidth:760}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                <div>
                  <div style={{fontSize:22,fontWeight:800,letterSpacing:"-.02em"}}>Bitácora de decisiones</div>
                  <div style={{fontSize:13,color:"rgba(100,150,200,0.38)",marginTop:4}}>Registro permanente de decisiones del negocio</div>
                </div>
                <Btn primary onClick={()=>setShowDecForm(true)}>+ Registrar</Btn>
              </div>

              {showDecForm&&(
                <GlowCard hover={false} style={{padding:"22px",marginBottom:18,borderColor:"rgba(0,194,255,0.18)"}}>
                  <div style={{fontSize:11,color:"rgba(0,194,255,0.45)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>Nueva decisión — {AU.label}</div>
                  <textarea value={decText} onChange={e=>setDecText(e.target.value)} placeholder="Describe la decisión tomada, por qué y qué implica…" rows={3}
                    style={{...inp,resize:"vertical",marginBottom:12,lineHeight:1.6}}/>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <select value={decTag} onChange={e=>setDecTag(e.target.value)} style={{...inp,width:"auto",fontSize:12,padding:"8px 14px",cursor:"pointer"}}>
                      {["estrategia","producto","marca","ventas","financiero","equipo"].map(v=><option key={v} value={v}>{v}</option>)}
                    </select>
                    <Btn primary small onClick={addDecision}>Guardar</Btn>
                    <Btn small onClick={()=>setShowDecForm(false)}>Cancelar</Btn>
                  </div>
                </GlowCard>
              )}

              {decisions.length===0&&!showDecForm&&(
                <div style={{padding:"40px 0",textAlign:"center",color:"rgba(100,150,200,0.28)",fontSize:14}}>
                  Aún no hay decisiones registradas.<br/>
                  <span style={{fontSize:12}}>Cada decisión importante queda aquí para siempre.</span>
                </div>
              )}

              {decisions.map(d=>{
                const du=USERS[d.author];
                const tc={estrategia:"#00C2FF",producto:"#00e88a",marca:"#FF6EC7",ventas:"#ffb800",financiero:"#ff8080",equipo:"#5BE0FF"}[d.tag]||"#00C2FF";
                return(
                  <GlowCard key={d.id} hover={false} style={{padding:"16px 18px",marginBottom:9,borderColor:`${du.colorBorder}33`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <Av user={d.author} size={24}/>
                        <span style={{fontSize:13,color:du.color,fontWeight:600}}>{du.label}</span>
                        <span style={{fontSize:12,color:"rgba(100,150,200,0.3)"}}>· {d.date}</span>
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span style={{fontSize:11,padding:"3px 10px",borderRadius:999,border:`1px solid ${tc}33`,color:tc,background:`${tc}0f`}}>{d.tag}</span>
                        <button onClick={()=>confirmDelete("decision",d.id,"Se eliminará esta decisión de la bitácora. Esta acción no se puede deshacer.")}
                          style={{background:"rgba(255,80,80,0.07)",border:"1px solid rgba(255,80,80,0.2)",color:"#ff8080",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>
                          ✕ Eliminar
                        </button>
                      </div>
                    </div>
                    <div style={{fontSize:14,color:"rgba(232,237,245,0.78)",lineHeight:1.7}}>{d.text}</div>
                  </GlowCard>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* NOTE MODAL */}
      {editNote&&<NoteModal task={editNote.title} existing={notes[editNote.id]} onSave={saveNote} onClose={()=>setEditNote(null)}/>}

      {/* CONFIRM DIALOG */}
      {confirmDel&&<ConfirmDialog msg={confirmDel.msg} onConfirm={executeDelete} onCancel={()=>setConfirmDel(null)}/>}

    </div>
  );
}
