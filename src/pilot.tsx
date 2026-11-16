import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig, spring} from 'remotion';

const C={ink:'#19273a',cream:'#f7f0df',navy:'#162b43',gold:'#e5ae43',red:'#e7655b',mint:'#65bba9',white:'#ffffff'};
const words=[
 {start:0,end:300,kicker:'NUEVA YORK · 2019',title:'¿47.000 MILLONES?',subtitle:'Una empresa que alquilaba oficinas alcanzó una valoración extraordinaria.'},
 {start:300,end:600,kicker:'EL NEGOCIO',title:'ESCRITORIOS',subtitle:'Alquilaban espacios de trabajo. Pero prometían mucho más.'},
 {start:600,end:900,kicker:'EL FUNDADOR',title:'UNA VISIÓN GIGANTE',subtitle:'Adam Neumann convenció a inversores de apostar por una expansión acelerada.'},
 {start:900,end:1200,kicker:'LA REALIDAD',title:'PÉRDIDAS CRECIENTES',subtitle:'Los documentos de su salida a bolsa expusieron pérdidas enormes.'},
 {start:1200,end:1500,kicker:'EL GIRO',title:'LA SALIDA A BOLSA FALLÓ',subtitle:'En 2019, la empresa retiró su plan de cotizar en bolsa.'},
 {start:1500,end:1800,kicker:'LA PREGUNTA',title:'¿QUÉ SALIÓ MAL?',subtitle:'Una historia sobre ambición, valoraciones y la distancia entre promesas y resultados.'}
];
const fade=(frame:number,duration:number)=>interpolate(frame,[0,12,duration-14,duration],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const Figure:React.FC<{frame:number,variant?:'founder'|'investor',scale?:number}>=({frame,variant='founder',scale=1})=>{
 const wave=Math.sin(frame/13)*9;
 return <svg width={390*scale} height={620*scale} viewBox="0 0 390 620" aria-label="Personaje ilustrado original">
 <ellipse cx="196" cy="594" rx="145" ry="20" fill="#0b172b" opacity=".13"/>
 <g stroke={C.ink} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
 <path d="M160 405 L144 560 M225 405 L242 560" fill="none"/>
 <path d={`M137 295 L75 ${380+wave} M252 295 L315 ${380-wave}`} fill="none"/>
 <path d="M127 286 Q193 254 259 286 L268 427 L118 427 Z" fill={variant==='founder'?C.navy:C.mint}/>
 <path d="M183 280 L195 345 L207 280" fill="none" stroke={C.gold} strokeWidth="8"/>
 <rect x="129" y="82" width="130" height="180" rx="61" fill="#f1c6a6"/>
 <path d="M128 150 Q118 65 194 61 Q267 64 259 145 Q234 100 196 108 Q154 110 128 150" fill={variant==='founder'?'#29272a':'#745b47'}/>
 <path d="M158 176 L163 176 M222 176 L227 176" strokeWidth="13"/>
 <path d="M182 208 Q196 220 211 208" strokeWidth="6" fill="none"/>
 </g></svg>;
};
const ChartGraphic:React.FC<{frame:number,fall?:boolean}>=({frame,fall=false})=>{
 const grow=interpolate(frame,[0,110],[0,1],{extrapolateRight:'clamp'});
 const points=fall?'20,240 125,190 230,120 330,70 420,160 520,290':'20,290 120,260 220,210 310,165 410,85 520,30';
 return <svg viewBox="0 0 560 340" width="640" style={{filter:'drop-shadow(0 12px 0 #19273a12)'}}><rect x="0" y="0" width="560" height="340" rx="28" fill="#ffffff" stroke={C.ink} strokeWidth="7"/><g stroke="#dde5e5" strokeWidth="2">{[70,140,210,280].map(y=><line key={y} x1="20" x2="540" y1={y} y2={y}/>)}</g><polyline points={points} fill="none" stroke={fall?C.red:C.mint} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="900" strokeDashoffset={900*(1-grow)}/></svg>;
};
const Scene:React.FC<{index:number}>=({index})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const s=words[index];const duration=s.end-s.start;
 const opacity=fade(frame,duration);const scale=spring({frame,fps,config:{damping:200},from:.94,to:1});
 return <AbsoluteFill style={{backgroundColor:index===3||index===4?C.navy:C.cream,overflow:'hidden',fontFamily:'Arial, Helvetica, sans-serif',color:index===3||index===4?C.white:C.ink,opacity}}>
 <div style={{position:'absolute',top:-230,right:-130,width:740,height:740,borderRadius:'50%',background:index===3||index===4?'#243f58':'#f0dfb8'}}/>
 <div style={{position:'absolute',left:110,top:115,fontSize:33,fontWeight:800,letterSpacing:6,color:C.gold}}>{s.kicker}</div>
 <div style={{position:'absolute',left:100,top:210,width:1040,transform:`scale(${scale})`,transformOrigin:'left center'}}>
 <div style={{fontSize:index===0?112:90,fontWeight:950,lineHeight:1.05,letterSpacing:-3}}>{s.title}</div>
 <div style={{fontSize:43,lineHeight:1.3,maxWidth:940,marginTop:50,fontWeight:500}}>{s.subtitle}</div>
 </div>
 <div style={{position:'absolute',right:80,bottom:60,transform:`translateY(${Math.sin(frame/24)*9}px)`}}>
 {(index===0||index===3||index===4)?<ChartGraphic frame={frame} fall={index!==0}/>:<Figure frame={frame} variant={index===2?'investor':'founder'}/>}
 </div>
 <div style={{position:'absolute',bottom:44,left:110,fontSize:26,fontWeight:800,letterSpacing:4,opacity:.6}}>IMPERIO DE PAPEL · PILOTO 01</div>
 <div style={{position:'absolute',bottom:42,right:90,fontSize:28,fontWeight:800,opacity:.65}}>{String(index+1).padStart(2,'0')} / 06</div>
 </AbsoluteFill>;
};
export const Pilot:React.FC=()=> <AbsoluteFill>{words.map((s,i)=><Sequence key={i} from={s.start} durationInFrames={s.end-s.start}><Scene index={i}/></Sequence>)}</AbsoluteFill>;