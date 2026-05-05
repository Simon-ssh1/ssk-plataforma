import { useState, useEffect, useRef } from "react";

const USERS = {
  simon:   { pass:"sm2026", color:"#00C2FF", colorBg:"rgba(0,194,255,0.12)", colorBorder:"rgba(0,194,255,0.35)", initial:"S", label:"SimÃ³n" },
  mariana: { pass:"sm2026", color:"#FF6EC7", colorBg:"rgba(255,110,199,0.12)", colorBorder:"rgba(255,110,199,0.35)", initial:"M", label:"Mariana" },
};

const TAG_STYLES = {
  urgente:{bg:"rgba(255,80,80,0.1)",  border:"rgba(255,80,80,0.3)",  color:"#ff8080", label:"urgente"},
  info:   {bg:"rgba(0,194,255,0.08)", border:"rgba(0,194,255,0.25)", color:"#00C2FF", label:"entender"},
  dinero: {bg:"rgba(255,180,0,0.08)", border:"rgba(255,180,0,0.3)",  color:"#ffb800", label:"inversiÃ³n"},
  ok:     {bg:"rgba(0,255,150,0.08)", border:"rgba(0,255,150,0.25)", color:"#00e88a", label:"clave"},
};

const PHASES = [
  { id:"p0", num:"01", label:"Fundamentos", tag:"Base",
    desc:"Antes de invertir un peso: modelo de negocio, equipo y validaciÃ³n.",
    proveedores:[
      {name:"CÃ¡mara de Comercio de MedellÃ­n",tipo:"Legal",contacto:"camaramedellin.com.co",nota:"Registro SAS simplificada ~$400k COP"},
      {name:"SIC Colombia",tipo:"Marcas",contacto:"sic.gov.co",nota:"Registro marca clase 5 y 32 ~$600k COP"},
      {name:"Tributar.io",tipo:"AsesorÃ­a",contacto:"tributar.io",nota:"ConstituciÃ³n empresa desde $200k"},
    ], ia:[],
    grupos:[
      {label:"Modelo de negocio",tareas:[
        {id:"t001",title:"Definir el problema que resuelve el producto",sub:"Respuesta en 2 frases: Â¿quÃ© duele, quÃ© solucionas, a quiÃ©n?",tag:"urgente"},
        {id:"t002",title:"Definir el cliente ideal con perfil detallado",sub:"Edad, hÃ¡bitos, dÃ³nde compra, cuÃ¡nto gasta en bienestar",tag:"urgente"},
        {id:"t003",title:"Analizar competencia directa e indirecta",sub:"MiO, True Lemon, marcas locales â precios, promesas, canales",tag:"info"},
        {id:"t004",title:"Definir propuesta de valor Ãºnica",sub:"QuÃ© tiene tu producto que no tiene ningÃºn otro en Colombia",tag:"urgente"},
        {id:"t005",title:"Validar disposiciÃ³n a pagar con 20 personas reales",sub:"No amigos â personas que cuiden su bienestar",tag:"urgente"},
      ]},
      {label:"Equipo y estructura",tareas:[
        {id:"t006",title:"Definir roles entre socios",sub:"Â¿QuiÃ©n lidera producto, ventas y operaciÃ³n?",tag:"urgente"},
        {id:"t007",title:"Establecer acuerdo de socios bÃ¡sico",sub:"Porcentajes, decisiones, quÃ© pasa si uno quiere salir",tag:"info"},
        {id:"t008",title:"Definir y verificar nombre de la marca en SIC",sub:"Confirmar que estÃ© libre antes de enamorarse del nombre",tag:"info"},
      ]},
      {label:"Finanzas base",tareas:[
        {id:"t009",title:"Definir aporte de capital de cada socio",sub:"En quÃ© momento se aporta â no todo de una",tag:"dinero"},
        {id:"t010",title:"Abrir cuenta o Nequi exclusiva del negocio",sub:"Separar finanzas personales del negocio desde el dÃ­a 1",tag:"dinero"},
        {id:"t011",title:"Construir proyecciÃ³n financiera a 12 meses",sub:"Costos fijos, variable por unidad, precio venta, break-even",tag:"dinero"},
      ]},
    ]
  },
  { id:"p1", num:"02", label:"Producto", tag:"FÃ³rmula",
    desc:"Entender la bioquÃ­mica, formular, prototipar y llegar a una fÃ³rmula validada.",
    proveedores:[
      {name:"Tecnas Colombia",tipo:"Materias primas",contacto:"tecnas.com.co â MedellÃ­n/BogotÃ¡",nota:"Vitaminas, saborizantes, glicerina, activos funcionales. AsesorÃ­a tÃ©cnica para emprendedores."},
      {name:"Laboratorio Blaskov",tipo:"Maquilador",contacto:"blaskov.com â BogotÃ¡",nota:"Suplementos lÃ­quidos. Lotes desde 500 uds. BPM certificados."},
      {name:"Brenntag Colombia",tipo:"Materias primas",contacto:"brenntag.com/co",nota:"Glicerina USP, propilenglicol food grade, saborizantes. VolÃºmenes mÃ­nimos mayores."},
      {name:"Naturistas El Centro / La 80",tipo:"Prototipo",contacto:"MedellÃ­n â presencial",nota:"Glicerina, stevia, Ã¡cido cÃ­trico, vitaminas para pruebas caseras."},
      {name:"Alibaba",tipo:"ImportaciÃ³n",contacto:"alibaba.com",nota:"Vitaminas a granel 3-5x mÃ¡s baratas. MÃ­nimos desde 1kg."},
    ], ia:[],
    grupos:[
      {label:"FormaciÃ³n tÃ©cnica",tareas:[
        {id:"t012",title:"Estudiar ingredientes base: glicerina, cosolventes, pH",sub:"Entender quÃ© hace cada componente antes de mezclar nada",tag:"info"},
        {id:"t013",title:"Estudiar activos funcionales por lÃ­nea de producto",sub:"Vitaminas, biotina, magnesio â solubilidad, dosis, compatibilidad",tag:"info"},
        {id:"t014",title:"Contactar Tecnas Colombia para asesorÃ­a tÃ©cnica",sub:"Proveedor clave en MedellÃ­n â asesores para emprendedores",tag:"urgente"},
      ]},
      {label:"FormulaciÃ³n y prototipo",tareas:[
        {id:"t015",title:"Comprar materias primas para pruebas caseras",sub:"Glicerina, stevia, Ã¡cido cÃ­trico, vitaminas",tag:"dinero"},
        {id:"t016",title:"Desarrollar fÃ³rmula piloto sabor 1",sub:"Primer sabor completo con activos funcionales definidos",tag:"info"},
        {id:"t017",title:"Desarrollar fÃ³rmula piloto sabor 2",sub:"Segundo sabor con diferente perfil funcional",tag:"info"},
        {id:"t018",title:"Pruebas de estabilidad bÃ¡sicas a 30 dÃ­as",sub:"Revisar color, sabor, separaciÃ³n a temperatura ambiente",tag:"info"},
        {id:"t019",title:"Validar sabores con 15-20 personas del perfil real",sub:"Personas que cuiden su bienestar â no amigos",tag:"urgente"},
        {id:"t020",title:"Documentar fÃ³rmula final en ficha tÃ©cnica",sub:"Ingredientes exactos, porcentajes, procedimiento",tag:"ok"},
      ]},
      {label:"Maquila",tareas:[
        {id:"t021",title:"Contactar mÃ­nimo 3 laboratorios maquiladores",sub:"CotizaciÃ³n lote piloto 300-500 uds con BPM",tag:"urgente"},
        {id:"t022",title:"Comparar cotizaciones y elegir maquilador",sub:"Precio/unidad, tiempo entrega, certificaciones",tag:"dinero"},
        {id:"t023",title:"Producir primer lote piloto 300-500 unidades",sub:"Con empaque provisional â lo importante es el producto",tag:"dinero"},
        {id:"t024",title:"Prueba de estabilidad del lote maquilado",sub:"30/60/90 dÃ­as â confirmar que la maquila reprodujo la fÃ³rmula",tag:"info"},
      ]},
    ]
  },
  { id:"p2", num:"03", label:"Marca", tag:"Identidad",
    desc:"Construir la identidad visual, naming y concepto que hace la marca memorable.",
    proveedores:[
      {name:"Behance / Workana",tipo:"DiseÃ±adores",contacto:"behance.net / workana.com",nota:"DiseÃ±adores colombianos. Branding freelance desde $500k COP."},
      {name:"99designs",tipo:"DiseÃ±adores",contacto:"99designs.com",nota:"Concurso de logo desde $299 USD. MÃºltiples propuestas."},
      {name:"Plastiglas MedellÃ­n",tipo:"Packaging",contacto:"MedellÃ­n â directorio industrial",nota:"Frascos gotero HDPE Ã¡mbar. Lotes desde 100-200 uds."},
      {name:"Alibaba â packaging",tipo:"Packaging personalizado",contacto:"alibaba.com â 'custom dropper bottle'",nota:"Frascos personalizados con molde desde 500 uds. Molde $1.5M-4M COP."},
    ],
    ia:[
      {name:"Midjourney",uso:"Conceptos visuales y moodboards de marca",link:"midjourney.com",nivel:"â­ El mejor para identidad visual premium"},
      {name:"Adobe Firefly",uso:"Assets visuales integrados con Adobe",link:"firefly.adobe.com",nivel:"Ideal si usan Adobe"},
      {name:"Looka",uso:"Generador de logos con IA â rÃ¡pido",link:"looka.com",nivel:"Para explorar direcciones de logo"},
      {name:"Krea AI",uso:"Renders de producto y packaging",link:"krea.ai",nivel:"â­ Visualizar empaque antes de producir"},
      {name:"Canva Magic Studio",uso:"DiseÃ±o de packaging y materiales",link:"canva.com",nivel:"FÃ¡cil de usar, buena opciÃ³n inicial"},
      {name:"Galileo AI",uso:"Interfaces y experiencias digitales de marca",link:"usegalileo.ai",nivel:"Para app o web de la marca"},
    ],
    grupos:[
      {label:"Identidad",tareas:[
        {id:"t025",title:"Definir personalidad de marca con moodboard",sub:"Tono, colores, referencias visuales",tag:"info"},
        {id:"t026",title:"Contratar diseÃ±ador de identidad visual",sub:"Logo, tipografÃ­a, paleta â Behance o referidos",tag:"dinero"},
        {id:"t027",title:"Desarrollar concepto de packaging llavero/charm",sub:"Bocetos del formato, materiales, mecanismo de gotero",tag:"info"},
        {id:"t028",title:"DiseÃ±ar etiqueta para empaque provisional",sub:"Bien hecho pero econÃ³mico â para el primer lote",tag:"dinero"},
      ]},
      {label:"Legal",tareas:[
        {id:"t029",title:"Registrar marca en SIC â clase 5 y 32",sub:"Suplementos y bebidas ~$500k-800k COP",tag:"dinero"},
        {id:"t030",title:"Constituir empresa SAS ante CÃ¡mara de Comercio",sub:"~$300k-500k. Necesario para INVIMA y facturaciÃ³n",tag:"dinero"},
        {id:"t031",title:"Iniciar trÃ¡mite INVIMA como suplemento dietario",sub:"Decreto 3249 â 3-6 meses. Iniciar temprano.",tag:"info"},
      ]},
    ]
  },
  { id:"p3", num:"04", label:"Ventas", tag:"Go to market",
    desc:"Primeros clientes, canales y flujo de caja real.",
    proveedores:[
      {name:"Smart Fit MedellÃ­n",tipo:"Gimnasios",contacto:"smartfit.com.co â 8+ sedes",nota:"Proponer consignaciÃ³n 30-35% para tienda interna."},
      {name:"Body Tech MedellÃ­n",tipo:"Gimnasios",contacto:"bodytech.com.co",nota:"Cadena premium. Mejor ticket por cliente."},
      {name:"Buenas Hierbas Naturistas",tipo:"Naturistas",contacto:"MedellÃ­n â mÃºltiples puntos",nota:"Precio distribuidor 40-50% del PVP."},
      {name:"Mercado del RÃ­o",tipo:"Feria lifestyle",contacto:"mercadodelrio.com â El Poblado",nota:"Alta visibilidad, cliente con poder adquisitivo."},
      {name:"Rappi EnvÃ­os",tipo:"LogÃ­stica",contacto:"rappi.com",nota:"Domicilios $5k-12k COP segÃºn distancia."},
      {name:"WhatsApp Business",tipo:"Canal directo",contacto:"business.whatsapp.com",nota:"Cero comisiÃ³n. CatÃ¡logo, pagos Nequi/Bancolombia."},
    ], ia:[],
    grupos:[
      {label:"Canales iniciales",tareas:[
        {id:"t032",title:"Crear perfil de Instagram y TikTok de la marca",sub:"Bio clara, primeras 3 publicaciones antes de vender",tag:"info"},
        {id:"t033",title:"Configurar catÃ¡logo en WhatsApp Business",sub:"Productos, precios, formas de pago, zona de domicilios",tag:"info"},
        {id:"t034",title:"Visitar 10 gimnasios con muestras y propuesta",sub:"Laureles, El Poblado, Envigado â consignaciÃ³n 30-35%",tag:"urgente"},
        {id:"t035",title:"Visitar 10 tiendas naturistas con muestras",sub:"Muestra + hoja de producto + precio de distribuidor",tag:"urgente"},
        {id:"t036",title:"Participar en 1 feria de bienestar en MedellÃ­n",sub:"Mercado del RÃ­o, pop-ups El Poblado",tag:"info"},
      ]},
      {label:"Primeras ventas",tareas:[
        {id:"t037",title:"Conseguir primeros 50 clientes pagos",sub:"Meta real: 50 personas que pagaron con su plata",tag:"urgente"},
        {id:"t038",title:"Establecer precio final al consumidor",sub:"Costo real + margen + prueba con clientes",tag:"dinero"},
        {id:"t039",title:"Definir polÃ­tica de domicilios y logÃ­stica",sub:"Rappi, mensajero propio o punto fijo",tag:"info"},
        {id:"t040",title:"Recolectar 20 testimonios reales",sub:"Foto, video o texto â prueba social para redes",tag:"ok"},
      ]},
      {label:"MÃ©tricas clave",tareas:[
        {id:"t041",title:"Calcular CAC â costo de adquirir un cliente",sub:"Total gastado / nÃºmero de clientes pagos",tag:"dinero"},
        {id:"t042",title:"Medir tasa de recompra al mes 2 y 3",sub:"Si no recompran, hay problema de producto o precio",tag:"info"},
        {id:"t043",title:"Alcanzar punto de equilibrio operativo",sub:"El mes en que ingresos cubren todos los costos",tag:"dinero"},
      ]},
    ]
  },
  { id:"p4", num:"05", label:"Escala", tag:"Crecimiento",
    desc:"Cuando ya vendes consistente: crecer canales, ampliar portafolio y sistematizar.",
    proveedores:[
      {name:"MercadoLibre Colombia",tipo:"Canal digital",contacto:"mercadolibre.com.co",nota:"Requiere INVIMA activo. Alto volumen."},
      {name:"Rappi Market",tipo:"Canal digital",contacto:"rappi.com â tiendas",nota:"Requiere volumen mÃ­nimo e INVIMA."},
      {name:"Ãxito / Jumbo",tipo:"Retail",contacto:"Contacto comercial directo",nota:"NegociaciÃ³n larga. Meta mes 12+."},
      {name:"Siigo / Alegra",tipo:"Contabilidad",contacto:"siigo.com / alegra.com",nota:"Software contable desde $50k/mes."},
    ], ia:[],
    grupos:[
      {label:"Portafolio",tareas:[
        {id:"t044",title:"Lanzar segunda lÃ­nea: vitaminas divertidas",sub:"Misma identidad, nuevo formato â gummies, shots, cÃ¡psulas",tag:"info"},
        {id:"t045",title:"Desarrollar ediciones especiales o estacionales",sub:"Navidad, San ValentÃ­n, temporada deportiva",tag:"info"},
        {id:"t046",title:"Desarrollar packaging personalizado llavero/charm",sub:"Con ventas validadas, invertir en el molde",tag:"dinero"},
      ]},
      {label:"Canales de escala",tareas:[
        {id:"t047",title:"Entrar a MercadoLibre y Rappi Market",sub:"Requiere INVIMA activo",tag:"info"},
        {id:"t048",title:"Desarrollar canal B2B â empresas",sub:"Un cliente corporativo = 50-200 uds/mes recurrentes",tag:"ok"},
        {id:"t049",title:"Activar programa de embajadores fitness",sub:"Personas con audiencia real â no mega influencers",tag:"info"},
      ]},
      {label:"OperaciÃ³n",tareas:[
        {id:"t050",title:"Sistematizar producciÃ³n con maquilador",sub:"Lotes mensuales predecibles, mejor precio por volumen",tag:"dinero"},
        {id:"t051",title:"Contratar primer empleado o freelance de ventas",sub:"Cuando ya no alcanzas a atender todos los canales",tag:"dinero"},
        {id:"t052",title:"Implementar Siigo o Alegra para contabilidad",sub:"Antes de que crezca el caos operativo",tag:"info"},
      ]},
    ]
  },
];

const SYSTEM_PROMPT=`Eres el asesor estratÃ©gico del "Proyecto S&M 2026", emprendimiento de water drops vitamÃ­nicos que SimÃ³n y Mariana construyen en MedellÃ­n, Colombia.
- Producto: water drops concentrados con vitaminas, minerales y activos funcionales
- Concepto: tomar vitaminas divertido, sin pena, packaging llavero/charm
- Capital: $2M-5M COP Â· Ciudad: MedellÃ­n
- Diferenciador: packaging llavero/charm, sabores con funciones especÃ­ficas (pelo, energÃ­a, calma, inmunidad)
- ExpansiÃ³n: lÃ­nea vitaminas divertidas con misma identidad
Responde con contexto especÃ­fico para este negocio, MedellÃ­n y presupuesto limitado. Directo, concreto, estratÃ©gico. EspaÃ±ol colombiano.`;

function GlowCard({children,onClick,style={},hover=true}){
  const[h,setH]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>hover&&setH(true)} onMouseLeave={()=>hover&&setH(false)} style={{background:h?"rgba(0,194,255,0.04)":"rgba(8,13,24,0.85)",border:h?"1px solid rgba(0,194,255,0.32)":"1px solid rgba(0,194,255,0.09)",borderRadius:14,transition:"all .2s",cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}

function Pill({children,onClick,primary,small,disabled,color}){
  const[h,setH]=useState(false);
  const col=color||"#00C2FF";
  const rgb=color==="#FF6EC7"?"255,110,199":"0,194,255";
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>!disabled&&setH(true)} onMouseLeave={()=>setH(false)} style={{padding:small?"5px 14px":"11px 24px",background:primary?(disabled?"rgba(0,194,255,0.07)":h?`rgba(${rgb},0.92)`:`rgba(${rgb},0.85)`):(h?`rgba(${rgb},0.07)`:"transparent"),color:primary?(disabled?"rgba(0,194,255,0.3)":"#04080f"):(disabled?"rgba(100,140,180,0.3)":col),border:primary?"none":`1px solid ${disabled?`rgba(${rgb},0.1)`:h?`rgba(${rgb},0.45)`:`rgba(${rgb},0.22)`}`,borderRadius:999,fontSize:small?11:13,fontWeight:primary?700:500,cursor:disabled?"not-allowed":"pointer",letterSpacing:".04em",fontFamily:"inherit",transition:"all .15s",whiteSpace:"nowrap",outline:"none"}}>{children}</button>;
}

function Av({user,size=28}){
  const u=USERS[user];
  return <div style={{width:size,height:size,borderRadius:"50%",background:u.colorBg,border:`1px solid ${u.colorBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.38,fontWeight:700,color:u.color,flexShrink:0}}>{u.initial}</div>;
}

// Animated SVG background with blue particles
function AnimatedBg({full=false}){
  return(
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="rg1" cx="20%" cy="30%" r="55%"><stop offset="0%" stopColor="#00C2FF" stopOpacity="0.12"/><stop offset="100%" stopColor="#04080f" stopOpacity="0"/></radialGradient>
        <radialGradient id="rg2" cx="80%" cy="70%" r="50%"><stop offset="0%" stopColor="#00C2FF" stopOpacity="0.07"/><stop offset="100%" stopColor="#04080f" stopOpacity="0"/></radialGradient>
        <radialGradient id="rg3" cx="50%" cy="50%" r="40%"><stop offset="0%" stopColor="#0050aa" stopOpacity="0.06"/><stop offset="100%" stopColor="#04080f" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#rg1)"/>
      <rect width="1200" height="800" fill="url(#rg2)"/>
      <rect width="1200" height="800" fill="url(#rg3)"/>
      {full&&<>
        <circle cx="200" cy="150" r="1.5" fill="#00C2FF" opacity="0.5"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite"/></circle>
        <circle cx="400" cy="80" r="1" fill="#00C2FF" opacity="0.4"><animate attributeName="opacity" values="0.1;0.7;0.1" dur="4s" repeatCount="indefinite"/></circle>
        <circle cx="700" cy="200" r="2" fill="#00C2FF" opacity="0.3"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/></circle>
        <circle cx="900" cy="120" r="1.5" fill="#5BE0FF" opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite"/></circle>
        <circle cx="1100" cy="300" r="1" fill="#00C2FF" opacity="0.3"><animate attributeName="opacity" values="0.1;0.5;0.1" dur="5s" repeatCount="indefinite"/></circle>
        <circle cx="150" cy="400" r="1.5" fill="#5BE0FF" opacity="0.3"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite"/></circle>
        <circle cx="600" cy="500" r="1" fill="#00C2FF" opacity="0.4"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/></circle>
        <circle cx="1000" cy="600" r="2" fill="#00C2FF" opacity="0.2"><animate attributeName="opacity" values="0.1;0.6;0.1" dur="4.5s" repeatCount="indefinite"/></circle>
        <line x1="200" y1="150" x2="400" y2="80" stroke="#00C2FF" strokeWidth="0.3" opacity="0.15"/>
        <line x1="400" y1="80" x2="700" y2="200" stroke="#00C2FF" strokeWidth="0.3" opacity="0.1"/>
        <line x1="700" y1="200" x2="900" y2="120" stroke="#00C2FF" strokeWidth="0.3" opacity="0.12"/>
        <line x1="900" y1="120" x2="1100" y2="300" stroke="#00C2FF" strokeWidth="0.3" opacity="0.1"/>
      </>}
    </svg>
  );
}

// Radial progress chart
function RadialChart({pct, color, size=80, label, value}){
  const r=32, c=2*Math.PI*r;
  const dash=c*(pct/100);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div style={{position:"relative",width:size,height:size}}>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,194,255,0.08)" strokeWidth="6"/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
            style={{transition:"stroke-dasharray 0.8s ease"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:15,fontWeight:800,color,lineHeight:1}}>{value}</div>
        </div>
      </div>
      <div style={{fontSize:10,color:"rgba(100,150,200,0.5)",textAlign:"center",maxWidth:70}}>{label}</div>
    </div>
  );
}

// Bar chart for phases
function PhaseBar({label,pct,color="#00C2FF",simonN,marianaN}){
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:11,color:"rgba(200,220,240,0.7)"}}>{label}</span>
        <span style={{fontSize:11,fontWeight:700,color:pct===100?"#00e88a":color}}>{pct}%</span>
      </div>
      <div style={{height:6,background:"rgba(0,194,255,0.06)",borderRadius:3,overflow:"hidden",marginBottom:3}}>
        <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#00e88a":`linear-gradient(90deg,${color},#5BE0FF)`,borderRadius:3,transition:"width 0.8s ease"}}/>
      </div>
      <div style={{display:"flex",gap:10}}>
        {simonN>0&&<span style={{fontSize:9,color:"rgba(0,194,255,0.5)"}}>â SimÃ³n: {simonN}</span>}
        {marianaN>0&&<span style={{fontSize:9,color:"rgba(255,110,199,0.5)"}}>â Mariana: {marianaN}</span>}
      </div>
    </div>
  );
}

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
  const[decisions,setDecisions]=useState([]);
  const[editNote,setEditNote]=useState(null);
  const[noteText,setNoteText]=useState("");
  const[showDecForm,setShowDecForm]=useState(false);
  const[decText,setDecText]=useState("");
  const[decTag,setDecTag]=useState("estrategia");
  const[chatMsgs,setChatMsgs]=useState([{role:"assistant",content:"Hola, soy el asesor de Proyecto S&M 2026. Â¿En quÃ© fase estÃ¡n y quÃ© necesitan resolver hoy?"}]);
  const[chatInput,setChatInput]=useState("");
  const[chatLoading,setChatLoading]=useState(false);
  const[saveInd,setSaveInd]=useState("");
  const chatEndRef=useRef(null);

  useEffect(()=>{load();},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);

  async function load(){
    try{const r=await window.storage.get("sm2026-v3",true);if(r?.value){const s=JSON.parse(r.value);setChecks(s.checks||{});setNotes(s.notes||{});setDecisions(s.decisions||[]);if(s.chatMsgs?.length)setChatMsgs(s.chatMsgs);}}catch(e){}
  }
  async function save(nc,nn,nd,nm){
    const p={checks:nc??checks,notes:nn??notes,decisions:nd??decisions,chatMsgs:nm??chatMsgs};
    try{await window.storage.set("sm2026-v3",JSON.stringify(p),true);setSaveInd("Guardado Â·");setTimeout(()=>setSaveInd(""),2200);}catch(e){}
  }

  function login(){const u=USERS[loginUser];if(u?.pass===loginPass){setAuth(loginUser);setLoginErr("");setView("home");}else setLoginErr("ContraseÃ±a incorrecta");}
  function toggleCheck(id){const nc={...checks};nc[id]===auth?delete nc[id]:nc[id]=auth;setChecks(nc);save(nc,null,null,null);}
  function openNote(id,title){setEditNote({id,title});setNoteText(notes[id]||"");}
  function saveNote(){const nn={...notes,[editNote.id]:noteText};setNotes(nn);setEditNote(null);save(null,nn,null,null);}
  function addDecision(){
    if(!decText.trim())return;
    const nd=[{id:Date.now(),text:decText,author:auth,tag:decTag,date:new Date().toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"})},...decisions];
    setDecisions(nd);setDecText("");setShowDecForm(false);save(null,null,nd,null);
  }
  function delDecision(id){const nd=decisions.filter(d=>d.id!==id);setDecisions(nd);save(null,null,nd,null);}
  async function sendChat(){
    if(!chatInput.trim()||chatLoading)return;
    const um={role:"user",content:`[${USERS[auth].label}]: ${chatInput}`};
    const nm=[...chatMsgs,um];setChatMsgs(nm);setChatInput("");setChatLoading(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM_PROMPT,messages:nm.map(m=>({role:m.role,content:m.content}))})});
      const d=await r.json();
      const reply=d.content?.map(b=>b.text||"").join("\n").trim()||"Error.";
      const wr=[...nm,{role:"assistant",content:reply}];setChatMsgs(wr);save(null,null,null,wr);
    }catch{const er=[...nm,{role:"assistant",content:"Error de conexiÃ³n."}];setChatMsgs(er);}
    setChatLoading(false);
  }

  const totalTasks=PHASES.reduce((a,p)=>a+p.grupos.reduce((b,g)=>b+g.tareas.length,0),0);
  const doneTasks=Object.keys(checks).length;
  const simonDone=Object.values(checks).filter(v=>v==="simon").length;
  const marianaDone=Object.values(checks).filter(v=>v==="mariana").length;
  const globalPct=Math.round((doneTasks/totalTasks)*100);
  const AU=USERS[auth||"simon"];
  const inp={width:"100%",boxSizing:"border-box",background:"rgba(0,194,255,0.03)",border:"1px solid rgba(0,194,255,0.14)",color:"#e8edf5",borderRadius:8,padding:"11px 15px",fontSize:14,fontFamily:"inherit",outline:"none"};

  if(!auth) return(
    <div style={{background:"#04080f",height:"100vh",width:"100vw",fontFamily:"'Helvetica Neue',Arial,sans-serif",color:"#e8edf5",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
      <AnimatedBg full/>
      <div style={{position:"relative",zIndex:1,width:380}}>
        <GlowCard hover={false} style={{padding:"44px 36px",borderColor:"rgba(0,194,255,0.25)"}}>
          <div style={{textAlign:"center",marginBottom:30}}>
            <div style={{fontSize:12,color:"#00C2FF",letterSpacing:".15em",textTransform:"uppercase",marginBottom:12}}>Proyecto S&M 2026</div>
            <div style={{fontSize:26,fontWeight:800,letterSpacing:"-.03em",lineHeight:1.2}}>Bienvenidos al<br/><span style={{color:"#00C2FF"}}>OS del negocio</span></div>
            <div style={{fontSize:12,color:"rgba(100,150,200,0.35)",marginTop:8}}>Water Drops Â· MedellÃ­n</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"rgba(100,150,200,0.45)",marginBottom:6}}>Â¿QuiÃ©n eres?</div>
            <select value={loginUser} onChange={e=>setLoginUser(e.target.value)} style={{...inp}}>
              <option value="simon">SimÃ³n</option>
              <option value="mariana">Mariana</option>
            </select>
          </div>
          <div style={{marginBottom:22}}>
            <div style={{fontSize:11,color:"rgba(100,150,200,0.45)",marginBottom:6}}>ContraseÃ±a del equipo</div>
            <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="â¢â¢â¢â¢â¢â¢â¢â¢" style={inp}/>
            {loginErr&&<div style={{fontSize:12,color:"#ff6b6b",marginTop:6}}>{loginErr}</div>}
          </div>
          <Pill primary onClick={login}>Entrar â</Pill>
        </GlowCard>
      </div>
    </div>
  );

  return(
    <div style={{background:"#04080f",height:"100vh",width:"100vw",fontFamily:"'Helvetica Neue',Arial,sans-serif",color:"#e8edf5",display:"flex",overflow:"hidden"}}>

      {/* SIDEBAR */}
      <div style={{width:230,minWidth:230,height:"100vh",background:"rgba(4,8,15,0.98)",borderRight:"1px solid rgba(0,194,255,0.07)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"18px 20px 14px",borderBottom:"1px solid rgba(0,194,255,0.07)",cursor:"pointer",flexShrink:0}} onClick={()=>setView("home")}>
          <div style={{fontSize:15,fontWeight:800,lineHeight:1.25}}>Proyecto<br/><span style={{color:"#00C2FF"}}>S&M 2026</span></div>
          <div style={{fontSize:10,color:"rgba(0,194,255,0.28)",letterSpacing:".1em",marginTop:4,textTransform:"uppercase"}}>Water Drops Â· MedellÃ­n</div>
        </div>
        {[{id:"home",label:"Inicio"},{id:"dashboard",label:"Dashboard"},{id:"bitacora",label:"BitÃ¡cora"},{id:"chat",label:"Asesor IA"}].map(item=>(
          <div key={item.id} onClick={()=>setView(item.id)} style={{padding:"10px 20px",cursor:"pointer",borderLeft:view===item.id?"2px solid #00C2FF":"2px solid transparent",background:view===item.id?"rgba(0,194,255,0.05)":"transparent",transition:"all .13s",display:"flex",alignItems:"center",gap:8,marginTop:item.id==="home"?10:0,flexShrink:0}}
            onMouseEnter={e=>{if(view!==item.id)e.currentTarget.style.background="rgba(0,194,255,0.025)";}} onMouseLeave={e=>{if(view!==item.id)e.currentTarget.style.background="transparent";}}>
            {item.id==="chat"&&<div style={{width:6,height:6,borderRadius:"50%",background:"#00C2FF",flexShrink:0}}/>}
            <span style={{fontSize:13,color:view===item.id?"#e8edf5":"rgba(100,140,180,0.55)"}}>{item.label}</span>
          </div>
        ))}
        <div style={{padding:"8px 0 4px",borderTop:"1px solid rgba(0,194,255,0.06)",marginTop:8,flexShrink:0}}>
          <div style={{fontSize:10,color:"rgba(0,194,255,0.2)",letterSpacing:".1em",textTransform:"uppercase",padding:"6px 20px 4px"}}>Fases</div>
          {PHASES.map(ph=>{
            const pd=ph.grupos.reduce((a,g)=>a+g.tareas.filter(t=>checks[t.id]).length,0);
            const pt=ph.grupos.reduce((a,g)=>a+g.tareas.length,0);
            const pct=Math.round((pd/pt)*100);
            const act=activePhase?.id===ph.id&&view==="phase";
            return(
              <div key={ph.id} onClick={()=>{setActivePhase(ph);setView("phase");setActiveTab("tareas");}} style={{padding:"6px 20px",cursor:"pointer",borderLeft:act?"2px solid #00C2FF":"2px solid transparent",background:act?"rgba(0,194,255,0.05)":"transparent",transition:"all .13s"}}
                onMouseEnter={e=>{if(!act)e.currentTarget.style.background="rgba(0,194,255,0.02)";}} onMouseLeave={e=>{if(!act)e.currentTarget.style.background="transparent";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:act?"#e8edf5":"rgba(100,140,180,0.5)"}}>{ph.num} Â· {ph.label}</span>
                  <span style={{fontSize:10,color:pct===100?"#00e88a":"rgba(0,194,255,0.26)"}}>{pct}%</span>
                </div>
                <div style={{height:2,background:"rgba(0,194,255,0.05)",borderRadius:1,marginTop:3,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#00e88a":"rgba(0,194,255,0.42)",borderRadius:1,transition:"width .4s"}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:"auto",padding:"13px 20px",borderTop:"1px solid rgba(0,194,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Av user={auth} size={28}/>
            <div><div style={{fontSize:12,color:"#e8edf5",fontWeight:600}}>{AU.label}</div><div style={{fontSize:10,color:AU.color}}>Â· Activo</div></div>
          </div>
          <div onClick={()=>setAuth(null)} style={{fontSize:10,color:"rgba(100,140,180,0.3)",cursor:"pointer",padding:"2px 7px",border:"1px solid rgba(0,194,255,0.07)",borderRadius:4}}
            onMouseEnter={e=>e.currentTarget.style.color="rgba(255,100,100,0.55)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(100,140,180,0.3)"}>salir</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
        <div style={{height:52,minHeight:52,borderBottom:"1px solid rgba(0,194,255,0.07)",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(4,8,15,0.96)",flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:700,color:"#e8edf5"}}>
            {view==="home"&&"Inicio"}
            {view==="dashboard"&&"Dashboard"}
            {view==="phase"&&activePhase&&`Fase ${activePhase.num} â ${activePhase.label}`}
            {view==="bitacora"&&"BitÃ¡cora de decisiones"}
            {view==="chat"&&"Asesor IA"}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {saveInd&&<span style={{fontSize:11,color:"rgba(0,194,255,0.4)"}}>{saveInd}</span>}
            <span style={{fontSize:12,color:"rgba(100,150,200,0.3)"}}>{doneTasks}/{totalTasks} Â· {globalPct}%</span>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>

          {/* HOME */}
          {view==="home"&&(
            <div style={{position:"relative",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              <AnimatedBg full/>
              <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"40px 32px",maxWidth:700}}>
                <div style={{fontSize:13,color:"rgba(0,194,255,0.6)",letterSpacing:".2em",textTransform:"uppercase",marginBottom:20}}>Proyecto S&M 2026</div>
                <div style={{fontSize:52,fontWeight:900,letterSpacing:"-.04em",lineHeight:1.1,marginBottom:24}}>
                  Bienvenido al<br/>
                  <span style={{color:"#00C2FF",textShadow:"0 0 60px rgba(0,194,255,0.4)"}}>proyecto de sus sueÃ±os</span>
                </div>
                <div style={{fontSize:16,color:"rgba(100,150,200,0.45)",marginBottom:40,lineHeight:1.6}}>
                  Water Drops VitamÃ­nicos Â· MedellÃ­n Â· 2026
                </div>
                <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                  <Pill primary onClick={()=>setView("dashboard")}>Ver Dashboard â</Pill>
                  <Pill onClick={()=>{setActivePhase(PHASES[0]);setView("phase");setActiveTab("tareas");}}>Iniciar Fase 01</Pill>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD */}
          {view==="dashboard"&&(
            <div style={{padding:"28px 36px",maxWidth:1100}}>
              <div style={{position:"relative",marginBottom:24,padding:"28px",borderRadius:16,border:"1px solid rgba(0,194,255,0.09)",background:"rgba(8,13,24,0.8)",overflow:"hidden"}}>
                <AnimatedBg/>
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{fontSize:32,fontWeight:800,letterSpacing:"-.03em",marginBottom:5}}>Hola, <span style={{color:AU.color,textShadow:`0 0 20px ${AU.color}55`}}>{AU.label}.</span></div>
                  <div style={{fontSize:13,color:"rgba(100,150,200,0.4)"}}>Water Drops Â· MedellÃ­n Â· 2026</div>
                </div>
              </div>

              {/* Radial charts row */}
              <div style={{display:"flex",gap:16,marginBottom:24,padding:"24px",background:"rgba(8,13,24,0.7)",borderRadius:14,border:"1px solid rgba(0,194,255,0.07)",alignItems:"center",flexWrap:"wrap"}}>
                <RadialChart pct={globalPct} color="#00C2FF" size={90} label="Progreso total" value={`${globalPct}%`}/>
                <div style={{width:1,height:70,background:"rgba(0,194,255,0.08)"}}/>
                <RadialChart pct={totalTasks>0?Math.round((doneTasks/totalTasks)*100):0} color="#e8edf5" size={90} label="Tareas hechas" value={`${doneTasks}/${totalTasks}`}/>
                <div style={{width:1,height:70,background:"rgba(0,194,255,0.08)"}}/>
                <RadialChart pct={totalTasks>0?Math.round((simonDone/totalTasks)*100):0} color="#00C2FF" size={90} label="Por SimÃ³n" value={simonDone}/>
                <div style={{width:1,height:70,background:"rgba(0,194,255,0.08)"}}/>
                <RadialChart pct={totalTasks>0?Math.round((marianaDone/totalTasks)*100):0} color="#FF6EC7" size={90} label="Por Mariana" value={marianaDone}/>
                <div style={{width:1,height:70,background:"rgba(0,194,255,0.08)"}}/>
                <RadialChart pct={decisions.length>0?Math.min(decisions.length*10,100):0} color="#ffb800" size={90} label="Decisiones" value={decisions.length}/>
              </div>

              {/* Progress bar global */}
              <div style={{marginBottom:24,padding:"18px 20px",background:"rgba(8,13,24,0.7)",border:"1px solid rgba(0,194,255,0.07)",borderRadius:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:13,color:"rgba(100,150,200,0.45)"}}>Progreso global del proyecto</span>
                  <span style={{fontSize:14,fontWeight:700,color:"#00C2FF"}}>{globalPct}%</span>
                </div>
                <div style={{height:10,background:"rgba(0,194,255,0.05)",borderRadius:5,overflow:"hidden",marginBottom:8}}>
                  <div style={{width:`${globalPct}%`,height:"100%",background:"linear-gradient(90deg,#00C2FF,#FF6EC7)",borderRadius:5,transition:"width .5s"}}/>
                </div>
                <div style={{display:"flex",gap:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:"#00C2FF"}}/><span style={{fontSize:11,color:"rgba(0,194,255,0.55)"}}>SimÃ³n: {simonDone}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:"#FF6EC7"}}/><span style={{fontSize:11,color:"rgba(255,110,199,0.55)"}}>Mariana: {marianaDone}</span></div>
                </div>
              </div>

              {/* Phase bars */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
                {PHASES.map(ph=>{
                  const pd=ph.grupos.reduce((a,g)=>a+g.tareas.filter(t=>checks[t.id]).length,0);
                  const pt=ph.grupos.reduce((a,g)=>a+g.tareas.length,0);
                  const pct=Math.round((pd/pt)*100);
                  const ps=ph.grupos.reduce((a,g)=>a+g.tareas.filter(t=>checks[t.id]==="simon").length,0);
                  const pm=ph.grupos.reduce((a,g)=>a+g.tareas.filter(t=>checks[t.id]==="mariana").length,0);
                  return(
                    <GlowCard key={ph.id} onClick={()=>{setActivePhase(ph);setView("phase");setActiveTab("tareas");}} style={{padding:"16px 18px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                        <div style={{width:36,height:36,borderRadius:8,background:"rgba(0,194,255,0.06)",border:"1px solid rgba(0,194,255,0.16)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#00C2FF",flexShrink:0}}>{ph.num}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <span style={{fontSize:14,fontWeight:600,color:"#e8edf5"}}>{ph.label}</span>
                            <span style={{fontSize:13,fontWeight:700,color:pct===100?"#00e88a":"#00C2FF"}}>{pct}%</span>
                          </div>
                          <PhaseBar label="" pct={pct} simonN={ps} marianaN={pm}/>
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
            <div style={{padding:"28px 36px",maxWidth:900}}>
              <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
                <Pill small onClick={()=>setView("dashboard")}>â Volver</Pill>
                {["tareas","proveedores"].map(tab=>(
                  <Pill key={tab} small onClick={()=>setActiveTab(tab)} primary={activeTab===tab}>
                    {tab==="tareas"?"Tareas":"Proveedores"}
                  </Pill>
                ))}
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:22,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>{activePhase.num} Â· {activePhase.label}</div>
                <div style={{fontSize:13,color:"rgba(100,150,200,0.4)",lineHeight:1.6}}>{activePhase.desc}</div>
              </div>

              {activeTab==="tareas"&&(
                <div style={{display:"flex",gap:20}}>
                  {/* Tasks list */}
                  <div style={{flex:1,minWidth:0}}>
                    {activePhase.grupos.map(g=>(
                      <div key={g.label} style={{marginBottom:22}}>
                        <div style={{fontSize:10,color:"rgba(0,194,255,0.32)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:9}}>{g.label}</div>
                        {g.tareas.map(t=>{
                          const who=checks[t.id];const done=!!who;const whoU=who?USERS[who]:null;
                          const ts=TAG_STYLES[t.tag]||TAG_STYLES.info;const hasNote=notes[t.id]?.trim();
                          return(
                            <div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",borderRadius:10,border:`1px solid ${done?`${whoU.colorBorder}40`:"rgba(0,194,255,0.07)"}`,background:done?whoU.colorBg.replace("0.12","0.03"):"rgba(8,13,24,0.6)",marginBottom:6,transition:"all .2s"}}>
                              <div onClick={()=>toggleCheck(t.id)} style={{width:20,height:20,borderRadius:5,border:`1.5px solid ${done?whoU.color:"rgba(0,194,255,0.22)"}`,background:done?whoU.color:"transparent",flexShrink:0,marginTop:1,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .18s"}}>
                                {done&&<div style={{width:9,height:5,borderLeft:"1.5px solid #04080f",borderBottom:"1.5px solid #04080f",transform:"rotate(-45deg) translateY(-1px)"}}/>}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                                  <div style={{fontSize:14,color:done?"rgba(100,150,200,0.38)":"#e8edf5",textDecoration:done?"line-through":"none",lineHeight:1.4}}>{t.title}</div>
                                  <div style={{display:"flex",gap:5,flexShrink:0,alignItems:"center",flexWrap:"wrap"}}>
                                    {done&&whoU&&(
                                      <div style={{display:"flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:999,background:whoU.colorBg,border:`1px solid ${whoU.colorBorder}`}}>
                                        <div style={{width:5,height:5,borderRadius:"50%",background:whoU.color}}/>
                                        <span style={{fontSize:10,color:whoU.color,fontWeight:600}}>{whoU.label}</span>
                                      </div>
                                    )}
                                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:999,border:`1px solid ${ts.border}`,background:ts.bg,color:ts.color}}>{ts.label}</span>
                                    <div onClick={()=>openNote(t.id,t.title)} style={{fontSize:11,padding:"3px 10px",borderRadius:999,border:`1px solid ${hasNote?"rgba(255,180,0,0.38)":"rgba(0,194,255,0.2)"}`,background:hasNote?"rgba(255,180,0,0.06)":"rgba(0,194,255,0.04)",color:hasNote?"#ffb800":"rgba(0,194,255,0.6)",cursor:"pointer",fontWeight:hasNote?600:400,whiteSpace:"nowrap"}}>
                                      {hasNote?"ð Info guardada":"+ Agregar informaciÃ³n"}
                                    </div>
                                  </div>
                                </div>
                                <div style={{fontSize:12,color:"rgba(100,150,200,0.35)",marginTop:3,lineHeight:1.5}}>{t.sub}</div>
                                {hasNote&&<div style={{fontSize:12,color:"rgba(255,180,0,0.5)",marginTop:5,padding:"5px 9px",background:"rgba(255,180,0,0.03)",borderRadius:5,borderLeft:"2px solid rgba(255,180,0,0.2)",lineHeight:1.5}}>{notes[t.id].slice(0,150)}{notes[t.id].length>150?"â¦":""}</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  {/* IA sidebar for Marca phase */}
                  {activePhase.ia.length>0&&(
                    <div style={{width:260,flexShrink:0}}>
                      <div style={{fontSize:10,color:"rgba(0,194,255,0.32)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>IA recomendada</div>
                      {activePhase.ia.map((tool,i)=>(
                        <GlowCard key={i} hover={false} style={{padding:"13px 14px",marginBottom:8}}>
                          <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:4}}>
                            <div style={{fontSize:13,fontWeight:600,color:"#e8edf5"}}>{tool.name}</div>
                          </div>
                          <div style={{fontSize:11,color:"rgba(100,150,200,0.42)",marginBottom:4,lineHeight:1.45}}>{tool.uso}</div>
                          <div style={{fontSize:10,color:"rgba(91,224,255,0.6)",marginBottom:4}}>{tool.link}</div>
                          <div style={{fontSize:10,color:"rgba(0,194,255,0.55)",fontStyle:"italic"}}>{tool.nivel}</div>
                        </GlowCard>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab==="proveedores"&&(
                <div>
                  <div style={{fontSize:10,color:"rgba(0,194,255,0.28)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:14}}>Proveedores y contactos reales en Colombia</div>
                  {activePhase.proveedores.length===0
                    ?<div style={{fontSize:14,color:"rgba(100,150,200,0.3)",padding:"14px 0"}}>Sin proveedores especÃ­ficos. Consulta al Asesor IA.</div>
                    :activePhase.proveedores.map((p,i)=>(
                      <GlowCard key={i} hover={false} style={{padding:"14px 16px",marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:5}}>
                          <div style={{fontSize:14,fontWeight:600,color:"#e8edf5"}}>{p.name}</div>
                          <span style={{fontSize:10,padding:"2px 8px",border:"1px solid rgba(0,194,255,0.18)",color:"#00C2FF",borderRadius:999,whiteSpace:"nowrap"}}>{p.tipo}</span>
                        </div>
                        <div style={{fontSize:12,color:"rgba(0,194,255,0.5)",marginBottom:3}}>{p.contacto}</div>
                        <div style={{fontSize:13,color:"rgba(100,150,200,0.42)",lineHeight:1.55}}>{p.nota}</div>
                      </GlowCard>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* BITÃCORA */}
          {view==="bitacora"&&(
            <div style={{padding:"28px 36px",maxWidth:740}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <div style={{fontSize:20,fontWeight:800,letterSpacing:"-.02em"}}>BitÃ¡cora de decisiones</div>
                  <div style={{fontSize:12,color:"rgba(100,150,200,0.38)",marginTop:3}}>Registro permanente de decisiones del negocio</div>
                </div>
                <Pill primary small onClick={()=>setShowDecForm(true)}>+ Registrar</Pill>
              </div>

              {showDecForm&&(
                <GlowCard hover={false} style={{padding:"20px",marginBottom:16,borderColor:"rgba(0,194,255,0.18)"}}>
                  <div style={{fontSize:11,color:"rgba(0,194,255,0.45)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>Nueva decisiÃ³n â {AU.label}</div>
                  <textarea value={decText} onChange={e=>setDecText(e.target.value)} placeholder="Describe la decisiÃ³n tomada, por quÃ© y quÃ© implicaâ¦" rows={3} style={{...inp,resize:"vertical",marginBottom:10,lineHeight:1.6}}/>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                    <select value={decTag} onChange={e=>setDecTag(e.target.value)} style={{...inp,width:"auto",fontSize:12,padding:"7px 12px"}}>
                      {["estrategia","producto","marca","ventas","financiero","equipo"].map(v=><option key={v} value={v}>{v}</option>)}
                    </select>
                    <Pill primary small onClick={addDecision}>Guardar</Pill>
                    <Pill small onClick={()=>setShowDecForm(false)}>Cancelar</Pill>
                  </div>
                </GlowCard>
              )}

              {decisions.length===0&&!showDecForm&&(
                <div style={{padding:"32px 0",textAlign:"center",color:"rgba(100,150,200,0.28)",fontSize:14}}>AÃºn no hay decisiones registradas.<br/><span style={{fontSize:12}}>Cada decisiÃ³n importante del negocio queda aquÃ­ para siempre.</span></div>
              )}

              {decisions.map(d=>{
                const du=USERS[d.author];
                const tc={estrategia:"#00C2FF",producto:"#00e88a",marca:"#FF6EC7",ventas:"#ffb800",financiero:"#ff8080",equipo:"#5BE0FF"}[d.tag]||"#00C2FF";
                return(
                  <GlowCard key={d.id} hover={false} style={{padding:"14px 16px",marginBottom:8,borderColor:`${du.colorBorder}33`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <Av user={d.author} size={22}/>
                        <span style={{fontSize:12,color:du.color,fontWeight:600}}>{du.label}</span>
                        <span style={{fontSize:11,color:"rgba(100,150,200,0.3)"}}>Â· {d.date}</span>
                      </div>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:999,border:`1px solid ${tc}33`,color:tc,background:`${tc}0f`}}>{d.tag}</span>
                        <div onClick={()=>delDecision(d.id)} style={{fontSize:10,color:"rgba(100,150,200,0.22)",cursor:"pointer",padding:"2px 6px",borderRadius:4,border:"1px solid rgba(255,80,80,0.1)"}}
                          onMouseEnter={e=>e.currentTarget.style.color="rgba(255,80,80,0.55)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(100,150,200,0.22)"}>â</div>
                      </div>
                    </div>
                    <div style={{fontSize:14,color:"rgba(232,237,245,0.78)",lineHeight:1.65}}>{d.text}</div>
                  </GlowCard>
                );
              })}
            </div>
          )}

          {/* CHAT */}
          {view==="chat"&&(
            <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 52px)"}}>
              <div style={{flex:1,overflowY:"auto",padding:"20px 36px",display:"flex",flexDirection:"column",gap:10}}>
                {chatMsgs.map((m,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",flexDirection:m.role==="user"?"row-reverse":"row"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:m.role==="user"?AU.colorBg:"rgba(0,194,255,0.05)",border:`1px solid ${m.role==="user"?AU.colorBorder:"rgba(0,194,255,0.18)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:m.role==="user"?AU.color:"#00C2FF",flexShrink:0,marginTop:2}}>
                      {m.role==="user"?AU.initial:"IA"}
                    </div>
                    <div style={{maxWidth:"72%",padding:"10px 14px",borderRadius:12,background:m.role==="user"?"rgba(0,194,255,0.06)":"rgba(8,13,24,0.9)",border:`1px solid ${m.role==="user"?"rgba(0,194,255,0.16)":"rgba(0,194,255,0.07)"}`,fontSize:14,color:"rgba(232,237,245,0.8)",lineHeight:1.7,whiteSpace:"pre-wrap"}}>
                      {m.content.replace(/^\[.*?\]:\s*/,"")}
                    </div>
                  </div>
                ))}
                {chatLoading&&<div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:28,height:28,borderRadius:"50%",background:"rgba(0,194,255,0.05)",border:"1px solid rgba(0,194,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#00C2FF"}}>IA</div><div style={{padding:"10px 14px",borderRadius:12,background:"rgba(8,13,24,0.9)",border:"1px solid rgba(0,194,255,0.07)",fontSize:14,color:"rgba(0,194,255,0.38)"}}>Pensandoâ¦</div></div>}
                <div ref={chatEndRef}/>
              </div>
              <div style={{padding:"14px 36px",borderTop:"1px solid rgba(0,194,255,0.07)",background:"rgba(4,8,15,0.96)",display:"flex",gap:10}}>
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} placeholder="Pregunta sobre fÃ³rmula, proveedores, ventas, estrategiaâ¦" style={{...inp,flex:1}}/>
                <Pill primary onClick={sendChat} disabled={!chatInput.trim()||chatLoading}>Enviar â</Pill>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* NOTE MODAL */}
      {editNote&&(
        <div style={{position:"fixed",inset:0,background:"rgba(4,8,15,0.93)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
          <GlowCard hover={false} style={{padding:"32px",width:500,borderColor:"rgba(255,180,0,0.22)"}}>
            <div style={{fontSize:10,color:"#ffb800",letterSpacing:".12em",textTransform:"uppercase",marginBottom:5}}>InformaciÃ³n de tarea</div>
            <div style={{fontSize:15,fontWeight:700,marginBottom:16,color:"#e8edf5",lineHeight:1.4}}>{editNote.title}</div>
            <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Contactos, decisiones, links, informaciÃ³n clave, avancesâ¦" rows={6} style={{...inp,resize:"vertical",marginBottom:14,lineHeight:1.6}}/>
            <div style={{display:"flex",gap:8}}>
              <Pill primary onClick={saveNote}>Guardar informaciÃ³n</Pill>
              <Pill onClick={()=>setEditNote(null)}>Cancelar</Pill>
            </div>
          </GlowCard>
        </div>
      )}
    </div>
  );
}
