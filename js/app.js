// SusCaballos MVP v2 - núcleo con Firebase (Auth + Firestore) y automatizaciones.
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import * as A from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import * as F from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {firebaseConfig} from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=A.getAuth(app),db=F.getFirestore(app),col=n=>F.collection(db,n);
export const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
export const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const ROLES=['Criador','Expositor','Jinete','Juez/Experto','Aficionado'];
// Reglas de negocio: palabras clave -> categoría (clasificación automática)
export const CATS={Crianza:['crianza','cría','potro','yegua','reproducción','genealog','semental'],Entrenamiento:['entrena','adiestra','doma','jinete','monta','paso fino'],Juzgamiento:['juez','juzga','calific','reglament','morfolog'],Eventos:['feria','exposición','concurso','copa','transmisión'],Salud:['sanidad','veterin','vacuna','herraje','nutrición'],Historia:['historia','origen','tradición','cultura']};
export const interestBoxes=(sel=[])=>Object.keys(CATS).map(c=>`<label><input type=checkbox name=int value="${c}"${sel.includes(c)?' checked':''}>${c}</label>`).join('');
// ---- Autenticación y perfiles
export const waitUser=()=>new Promise(r=>{const un=A.onAuthStateChanged(auth,async u=>{un();if(!u)return r(null);const s=await F.getDoc(F.doc(db,'users',u.uid));r(s.exists()?{uid:u.uid,...s.data()}:null)})});
export const login=(e,p)=>A.signInWithEmailAndPassword(auth,e,p);
export async function register(p){const c=await A.createUserWithEmailAndPassword(auth,p.email,p.pass);await F.setDoc(F.doc(db,'users',c.user.uid),{name:p.name,email:p.email,role:p.role,interests:p.interests,bio:'',admin:false})}
export const logout=()=>A.signOut(auth);
export const saveProfile=(uid,d)=>F.updateDoc(F.doc(db,'users',uid),d);
export const authMsg=e=>({'auth/invalid-credential':'Correo o contraseña incorrectos.','auth/email-already-in-use':'Ese correo ya tiene perfil. Inicia sesión.','auth/weak-password':'La contraseña debe tener mínimo 6 caracteres.','permission-denied':'No tienes permiso para esta acción.'}[e.code]||'No se pudo completar la acción ('+e.code+').');
// ---- Datos (Firestore)
const list=async(n,...q)=>(await F.getDocs(F.query(col(n),...q))).docs.map(d=>({id:d.id,...d.data()}));
export const getContents=()=>list('contents',F.orderBy('ts','desc'));
export const getEvents=()=>list('events',F.orderBy('date'));
export const getNotifs=async uid=>(await list('notifs',F.where('to','==',uid))).sort((a,b)=>b.ts-a.ts);
export const markRead=ns=>Promise.all(ns.filter(n=>!n.read).map(n=>F.updateDoc(F.doc(db,'notifs',n.id),{read:true})));
export const getLog=()=>list('log',F.orderBy('ts','desc'),F.limit(200));
export const hit=k=>F.setDoc(F.doc(db,'meta','metrics'),{[k]:F.increment(1)},{merge:true}).catch(()=>{});
export const getMetrics=async()=>{const s=await F.getDoc(F.doc(db,'meta','metrics'));return s.exists()?s.data():{}};
export const sendMsg=(u,t)=>F.addDoc(col('chat'),{uid:u.uid,u:u.name,r:u.role,t,ts:Date.now()});
export const onChat=cb=>F.onSnapshot(F.query(col('chat'),F.orderBy('ts'),F.limitToLast(100)),s=>cb(s.docs.map(d=>d.data())));
export async function seedData(){const b=F.writeBatch(db),t=new Date().toISOString();
[['Origen e historia del Caballo Criollo Colombiano','Artículo','Historia',['historia','origen'],'Recorrido por el origen de la raza, su tradición y su papel en la cultura colombiana.'],
['Fundamentos de la crianza: selección de yeguas y sementales','Curso','Crianza',['crianza','yegua','semental'],'Criterios genealógicos y de reproducción para planear apareamientos responsables.'],
['Cómo se califica un ejemplar: guía para jueces y expositores','Video','Juzgamiento',['juez','calific','morfolog'],'Los criterios de morfología y paso que evalúan los jueces en pista.'],
['Doma y entrenamiento del potro: primeras monturas','Artículo','Entrenamiento',['doma','entrena','potro'],'Etapas de adiestramiento para preparar al potro con seguridad.']]
.forEach(([title,type,cat,tags,body])=>b.set(F.doc(col('contents')),{title,type,cat,tags,body,author:'SusCaballos',ts:t}));
[['Gran Feria Equina de Bogotá','Bogotá','2026-11-12','Eventos','Exposición y transmisión en vivo.'],['Copa Criollo Colombiano','Medellín','2026-11-27','Eventos','Concurso de morfología y paso.'],['Seminario de Juzgamiento','Villavicencio','2026-12-05','Juzgamiento','Capacitación para jueces y expositores.'],['Exposición Nacional de Criadores','Cali','2027-01-22','Crianza','Ejemplares y criaderos de todo el país.']]
.forEach(([name,city,date,cat,desc])=>b.set(F.doc(col('events')),{name,city,date,cat,desc}));await b.commit()}
// ---- AUTOMATIZACIÓN 1: clasificación (categoría + etiquetas) por reglas
export function classify(txt){txt=txt.toLowerCase();let cat='General',max=0,tags=[];for(const[c,ks]of Object.entries(CATS)){const h=ks.filter(k=>txt.includes(k));if(h.length>max){max=h.length;cat=c}tags.push(...h)}return{cat,tags:[...new Set(tags)].slice(0,5)}}
// ---- AUTOMATIZACIÓN 2: versiones sugeridas para canales externos (NO publica en redes).
export function channels(c){
 const text=String(c.body||'');const excerpt=text.slice(0,140);const tags=(c.tags||[]).map(t=>'#'+t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]/g,'')).join(' ');
 const base=location.href.replace(/[^/]*([?#].*)?$/,'');
 const link=base+(c.type==='Evento'?'eventos.html':'contenido.html')+'#'+encodeURIComponent(c.id);
 return {Instagram:`📌 ${c.title}\n\n${excerpt}…\n\n${tags} #CaballoCriolloColombiano`,Facebook:`${c.title}\n${excerpt}…\nLee más: ${link}`,YouTube:`${c.title} | SusCaballos\n\n${excerpt}\n\n${link}\n${tags}`,WhatsApp:`*${c.title}*\n${excerpt}…\n${link}`,TikTok:`${c.title.slice(0,80)} ${tags} #suscaballos`};
}
// ---- AUTOMATIZACIÓN 3: centralizar -> clasificar -> proponer copys -> notificar -> registrar.
// Las versiones se COPIAN manualmente: el MVP no está conectado a APIs de redes sociales.
export async function publish(d,author){
 const t0=performance.now(),cl=classify(d.title+' '+d.body);
 const isEvent=d.type==='Evento';
 if(!d.title?.trim()||!d.body?.trim())throw Error('El título y la descripción son obligatorios.');
 if(isEvent&&!/^\d{4}-\d{2}-\d{2}$/.test(d.date||''))throw Error('Indica una fecha válida para el evento.');
 const c={type:d.type,title:d.title.trim(),body:d.body.trim(),cat:cl.cat,tags:cl.tags,author,ts:new Date().toISOString()};
 c.id=isEvent?(await F.addDoc(col('events'),{name:c.title,city:d.city||'Por definir',date:d.date,cat:c.cat,desc:c.body,ts:c.ts})).id:(await F.addDoc(col('contents'),c)).id;
 const warnings=[];let notified=0;
 try{
   const us=(await list('users',F.where('interests','array-contains',cl.cat))).filter(u=>!u.admin);
   // Firestore writeBatch tiene límite de 500 operaciones. Se divide para grupos grandes.
   for(let i=0;i<us.length;i+=450){const batch=F.writeBatch(db);const group=us.slice(i,i+450);group.forEach(u=>batch.set(F.doc(col('notifs')),{to:u.id,msg:`Nuevo en ${cl.cat}: ${c.title}`,ts:Date.now(),read:false}));await batch.commit();notified+=group.length;}
 }catch(e){warnings.push('El contenido se guardó, pero algunas notificaciones no se pudieron enviar: '+(e.code||e.message));}
 const ms=Math.round(performance.now()-t0);
 try{await F.addDoc(col('log'),{title:c.title,type:c.type,cat:c.cat,ms,notified,ts:Date.now(),publicationId:c.id});}catch(e){warnings.push('No se pudo registrar la medición en el historial: '+(e.code||e.message));}
 return {c,ch:channels(c),notified,ms,warnings};
}
export async function layout(a,adm){const u=await waitUser();if(!u||(adm&&!u.admin)){location.href=u?'menu.html':'index.html';return null}
const L=[['menu','Inicio'],['eventos','Eventos'],['contenido','Contenido'],['chat','Chat'],...(u.admin?[['publicar','Publicar']]:[]),['perfil','Perfil']],
n=(await getNotifs(u.uid)).filter(x=>!x.read).length;
document.body.insertAdjacentHTML('afterbegin',`<header><a class="brand" href="menu.html" aria-label="SusCaballos, ir al inicio"><img src="assets/suscaballos-logo.png" alt="Logo SusCaballos"><span>SusCaballos</span></a><nav>${L.map(([p,t])=>`<a href="${p}.html"${p==a?' class=on':''}>${t}</a>`).join('')}</nav><span class="account">${n?`<a href="menu.html" aria-label="${n} notificaciones sin leer">🔔 ${n}</a> `:''}${esc(u.name)} · <a href="#" id=out>Salir</a></span></header>`);
$('#out').onclick=async e=>{e.preventDefault();await logout();location.href='index.html'};return u}
