// @ts-nocheck
"use client";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import * as XLSX from "xlsx-js-style";
import {
  SlidersHorizontal as LucideSlidersHorizontal,
  RotateCcw as LucideRotateCcw,
  GripVertical as LucideGripVertical,
  ChevronUp as LucideChevronUp,
  ChevronDown as LucideChevronDown,
  ChevronRight as LucideChevronRight,
  Eye as LucideEye,
  EyeOff as LucideEyeOff,
  Pencil as LucidePencil,
} from "lucide-react";

const rMod = { ...React, default: React };
const xMod = (XLSX as any)?.default ? { ...XLSX, ...(XLSX as any).default } : XLSX;

let exportedDefault: any = null;
const e = {
  i(id: number) {
    if (id === 43476) return jsxRuntime;
    if (id === 71645) return rMod;
    if (id === 27584) return xMod;
    throw new Error("Unknown module import: " + id);
  },
  s(exportsArr: any[]) {
    exportedDefault = exportsArr[2];
  }
};

(function(e) {
  var t=e.i(43476),r=e.i(71645);let a=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},s=(0,r.createContext)({}),o=(0,r.forwardRef)(({color:e,size:t,width:o,height:i,strokeWidth:l,absoluteStrokeWidth:c,nonScalingStroke:f,className:h="",children:d,iconNode:u=[],icon:p={node:u,aliases:[],size:24},...m},g)=>{let{size:b=24,strokeWidth:x=2,absoluteStrokeWidth:v=!1,nonScalingStroke:y=!1,color:w="currentColor",className:A=""}=(0,r.useContext)(s)??{},T=!!d||(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(m),[C,E,k=[]]=function(e,t={}){return function(e,t={}){let r=t.attributeNames??{},s=e=>r[e]??e,o=e.size??e.width??n.width,i=e.size??e.height??n.height,l=e.aliases?.filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>`lucide-${e}`)??[],c=[...e.name?[`lucide-${e.name}`]:[],...l],f=t.className?.split(" ").filter(Boolean)??[],h=!1===t.includeDefaultClasses?a(...f):a("lucide",...c,...f),d=t.absoluteStrokeWidth?Number(t.strokeWidth??n["stroke-width"])*Number(e.size??e.width??n.width)/Number(t.size??t.width??n.width):t.strokeWidth??n["stroke-width"];return["svg",{...Object.entries(n).reduce((e,[t,r])=>(e[s(t)]=r,e),{}),..."color"in t&&t.color&&{[s("stroke")]:t.color},..."size"in t&&null!=t.size&&{[s("width")]:t.size,[s("height")]:t.size},..."width"in t&&null!=t.width&&{[s("width")]:t.width},..."height"in t&&null!=t.height&&{[s("height")]:t.height},[s("stroke-width")]:d,...h&&{[s("class")]:h},[s("viewBox")]:`0 0 ${o} ${i}`,...!1===t.hasA11yProp?{[s("aria-hidden")]:"true"}:{},..."attributes"in t&&t.attributes},e.node.map(e=>{let[r,a,n]=e,o=t.nonScalingStroke?{[s("vector-effect")]:"non-scaling-stroke",...a}:a;return n?[r,o,n]:[r,o]})]}(e,{...t,attributeNames:{...t.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}(p,{color:e??w,width:o??t??b,height:i??t??b,strokeWidth:l??x,absoluteStrokeWidth:c??v,nonScalingStroke:f??y,className:a(A,h),hasA11yProp:T,attributes:m});return(0,r.createElement)(C,{ref:g,...E},[...k.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(d)?d:[d]])});function i(e,t=[],a=[]){let n,s="string"==typeof e?function(e,t,r=[]){if(null==t)throw Error("[lucide]: iconNode is required when icon name is used");return{name:e?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),size:24,node:t,...r.length>0?{aliases:r}:{}}}(e,t,a):e,l=(0,r.forwardRef)(({className:e,...t},a)=>(0,r.createElement)(o,{ref:a,icon:s,className:e,...t}));return s.name&&(l.displayName=(n=(e=>{let t="",r=!1;for(let a of e){if("-"===a||"_"===a||a<=" "){r=t.length>0;continue}0===t.length?t+=a.toLowerCase():t+=r?a.toUpperCase():a,r=!1}return t})(s.name)).charAt(0).toUpperCase()+n.slice(1)),l}let l={name:"activity",size:24,node:[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]};l.node;let c=i(l),f={name:"calendar-clock",size:24,node:[["path",{d:"M16 14v2.2l1.6 1",key:"fo4ql5"}],["path",{d:"M16 2v3",key:"otl347"}],["path",{d:"M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338",key:"7hb8p4"}],["path",{d:"M3 9h5.859",key:"numkqi"}],["path",{d:"M8 2v3",key:"1ioesn"}],["circle",{cx:"16",cy:"16",r:"6",key:"qoo3c4"}]]};f.node;let h=i(f),d={name:"chart-no-axes-combined",size:24,node:[["path",{d:"M12 16v5",key:"zza2cw"}],["path",{d:"M16 14.639V21",key:"1s85h0"}],["path",{d:"M20 10.656V21",key:"q45596"}],["path",{d:"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15",key:"1fw8x9"}],["path",{d:"M4 18.463V21",key:"1otddq"}],["path",{d:"M8 14.656V21",key:"1t2idw"}]]};d.node;let u=i(d),p={name:"check",size:24,node:[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]};p.node;let m=i(p),g={name:"clock-3",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6h4",key:"135r8i"}]]};g.node;let b=i(g),x={name:"cloud",size:24,node:[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]]};x.node;let v=i(x),y={name:"download",size:24,node:[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]};y.node;let w=i(y),A={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};A.node;let T=i(A),C={name:"upload",size:24,node:[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]};C.node;let E=i(C),k=[{id:"future",label:"Daily Transactions"},{id:"inventory",label:"Consolidated View - Account Level"},{id:"master",label:"Account's Summary"},{id:"market",label:"Market Data & Watch"},{id:"analytics",label:"Visual Analytics"}];function S({onRefreshMarket:e,isRefreshing:a,refreshCountdown:n,autoRefreshInterval:s,setAutoRefreshInterval:o,onExportExcel:i,onImportExcel:l,isImporting:f,lastRefreshed:d,activeSheet:p,onSelectSheet:g}){
  let x=r.default.useRef(null),y=async e=>{let t=e.target.files?.[0];if(t)try{await l(t)}finally{e.target.value=""}},A=d?new Date(d):null,C=A?A.toLocaleDateString([],{month:"short",day:"2-digit",year:"numeric"}):"Not synced",N=A?A.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";
  return(0,t.jsxs)("header",{
    className:"portfolio-app-header sticky top-0 z-50 w-full select-none overflow-hidden border-b border-emerald-950/40 bg-[linear-gradient(118deg,#05442b_0%,#0a6b3f_48%,#064e30_100%)] text-white shadow-[0_4px_14px_-8px_rgba(3,52,32,0.8)]",
    children:[
      (0,t.jsx)("input",{ref:x,type:"file",accept:".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",onChange:e=>void y(e),className:"sr-only","aria-label":"Import Excel workbook"}),
      (0,t.jsx)("div",{className:"pointer-events-none absolute -left-16 -top-16 h-28 w-28 rounded-full bg-emerald-300/10 blur-3xl"}),
      (0,t.jsx)("div",{className:"pointer-events-none absolute right-24 top-0 h-14 w-48 rounded-full bg-white/5 blur-3xl"}),
      (0,t.jsxs)("div",{
        className:"relative flex min-h-8 items-center justify-between gap-2 px-2.5 py-1 sm:px-4",
        children:[
          (0,t.jsxs)("div",{
            className:"flex min-w-0 items-center gap-2",
            children:[
              (0,t.jsx)("div",{
                className:"grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/25 bg-white/95 text-emerald-800 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.7)]",
                children:(0,t.jsx)(u,{className:"h-3.5 w-3.5",strokeWidth:2.4})
              }),
              (0,t.jsxs)("div",{
                className:"min-w-0 leading-none",
                children:[
                  (0,t.jsx)("div",{
                    className:"truncate text-[10px] sm:text-[11px] font-extrabold tracking-[0.08em] text-white",
                    children:"PORTFOLIO LEDGER"
                  }),
                  (0,t.jsxs)("div",{
                    className:"mt-0.5 hidden items-center gap-1.5 text-[8px] sm:text-[8.5px] font-medium tracking-[0.02em] text-emerald-100/90 sm:flex",
                    children:[
                      (0,t.jsxs)("span",{className:"inline-flex items-center gap-0.5",children:[(0,t.jsx)(m,{className:"h-2.5 w-2.5 text-emerald-300"}),"Autosaved"]}),
                      (0,t.jsx)("span",{className:"h-2.5 w-px bg-white/20"}),
                      (0,t.jsxs)("span",{className:"inline-flex items-center gap-0.5",children:[(0,t.jsx)(v,{className:"h-2.5 w-2.5 text-emerald-300"}),"Market connected"]})
                    ]
                  })
                ]
              })
            ]
          }),
          (0,t.jsxs)("div",{
            className:"flex shrink-0 items-center gap-1.5",
            children:[
              (0,t.jsxs)("div",{
                className:"flex items-center overflow-hidden rounded-md border border-white/15 bg-white/10 shadow-inner",
                children:[
                  (0,t.jsxs)("button",{
                    type:"button",onClick:e,disabled:a,
                    className:"group inline-flex h-7 items-center gap-1.5 border-r border-white/15 bg-white px-2 sm:px-2.5 text-[10px] sm:text-[10.5px] font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:bg-amber-50 disabled:text-amber-800",
                    title:"Update Account's Summary, Consolidated View, and Daily Transactions",
                    children:[
                      (0,t.jsx)(T,{className:`h-3 w-3 ${a?"animate-spin":"transition-transform group-hover:rotate-45"}`}),
                      (0,t.jsx)("span",{className:"hidden sm:inline",children:a?"Updating…":"Pull market"})
                    ]
                  }),
                  (0,t.jsxs)("div",{
                    className:"hidden h-7 items-center gap-1 px-2 text-[9.5px] sm:text-[10px] text-emerald-50 md:flex",
                    children:[
                      (0,t.jsx)(b,{className:"h-3 w-3 text-emerald-300"}),
                      (0,t.jsxs)("select",{
                        value:s,onChange:e=>o(Number(e.target.value)),
                        className:"cursor-pointer bg-transparent font-medium text-white outline-none [&>option]:text-gray-900",
                        "aria-label":"Market refresh interval",
                        children:[
                          (0,t.jsx)("option",{value:60,children:"60 sec"}),
                          (0,t.jsx)("option",{value:30,children:"30 sec"}),
                          (0,t.jsx)("option",{value:120,children:"2 min"}),
                          (0,t.jsx)("option",{value:0,children:"Off"})
                        ]
                      })
                    ]
                  }),
                  (0,t.jsxs)("div",{
                    className:"flex h-7 items-center gap-1 border-l border-white/15 px-2 text-[9.5px] sm:text-[10px] text-emerald-100",
                    children:[
                      (0,t.jsx)(c,{className:`h-3 w-3 text-emerald-300 ${a?"animate-pulse":""}`}),
                      (0,t.jsx)("span",{className:"font-bold text-white tabular-nums tracking-wide",children:0===s?"OFF":`${n}s`})
                    ]
                  })
                ]
              }),
              (0,t.jsxs)("div",{
                className:"flex items-center overflow-hidden rounded-md border border-white/15 bg-emerald-950/25 shadow-inner",
                children:[
                  (0,t.jsxs)("button",{
                    type:"button",onClick:i,
                    className:"inline-flex h-7 items-center gap-1.5 border-r border-white/15 px-2 sm:px-2.5 text-[10px] sm:text-[10.5px] font-semibold text-white transition hover:bg-white/15",
                    title:"Export styled Excel workbook",
                    children:[(0,t.jsx)(w,{className:"h-3 w-3 text-emerald-200"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Export"})]
                  }),
                  (0,t.jsxs)("button",{
                    type:"button",onClick:()=>x.current?.click(),disabled:f,
                    className:"inline-flex h-7 items-center gap-1.5 px-2 sm:px-2.5 text-[10px] sm:text-[10.5px] font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-55",
                    title:"Import Excel workbook",
                    children:[(0,t.jsx)(E,{className:`h-3 w-3 text-emerald-200 ${f?"animate-pulse":""}`}),(0,t.jsx)("span",{className:"hidden sm:inline",children:f?"Importing…":"Import"})]
                  })
                ]
              }),
              (0,t.jsxs)("div",{
                className:"flex h-7 items-center gap-1.5 rounded-md border border-emerald-300/20 bg-emerald-950/30 px-2 sm:px-2.5 text-emerald-50 shadow-inner",
                title:`Last updated ${C} at ${N}`,
                children:[
                  (0,t.jsx)(h,{className:"h-3 w-3 shrink-0 text-emerald-300"}),
                  (0,t.jsxs)("div",{
                    className:"whitespace-nowrap leading-[1.05]",
                    children:[
                      (0,t.jsx)("div",{className:"text-[7px] font-semibold uppercase tracking-[0.08em] text-emerald-200/75",children:"Updated"}),
                      (0,t.jsxs)("div",{className:"text-[9px] sm:text-[9.5px] font-bold text-white tabular-nums tracking-wide",children:[(0,t.jsxs)("span",{className:"hidden md:inline",children:[C," · "]}),N]})
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),
      (0,t.jsx)("nav",{
        className:"relative flex items-end gap-1 overflow-x-auto border-t border-white/10 bg-emerald-950/20 px-2.5 pt-1 sm:px-4",
        children:k.map(e=>{
          let r=p===e.id;
          return(0,t.jsxs)("button",{
            type:"button",onClick:()=>g(e.id),
            className:`relative shrink-0 rounded-t-md px-3 py-1.5 text-[10px] sm:px-3.5 sm:text-[11px] font-semibold tracking-[0.015em] transition-all ${r?"bg-[#f5f7f6] text-emerald-950 shadow-[0_-2px_8px_-4px_rgba(0,0,0,0.7)] font-bold":"text-emerald-50/85 hover:bg-white/10 hover:text-white"}`,
            children:[
              e.label,
              r&&(0,t.jsx)("span",{className:"absolute inset-x-1.5 bottom-0 h-0.5 rounded-full bg-emerald-600"})
            ]
          },e.id)
        })
      })
    ]
  })
}let N={name:"square-function",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3",key:"m1af9g"}],["path",{d:"M9 11.2h5.7",key:"3zgcl2"}]],aliases:["function-square"]};N.node;let _=i(N),O={name:"x",size:24,node:[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]};O.node;let I=i(O);function F({selectedCell:e}){let r=e?.cellId||"A1",a=e?.formula||e?.value||"Select a cell to inspect its value and formula";return(0,t.jsxs)("div",{className:"relative z-30 flex min-h-10 w-full select-none items-center gap-1.5 border-b border-slate-200 bg-white/95 px-2 py-1.5 text-xs shadow-[0_4px_14px_-12px_rgba(15,23,42,0.7)] backdrop-blur sm:px-3",children:[(0,t.jsx)("div",{className:"grid h-7 min-w-16 place-items-center rounded-md border border-slate-200 bg-slate-50 px-2 font-mono text-[11px] font-bold text-slate-700 shadow-inner",children:r}),(0,t.jsxs)("div",{className:"hidden items-center gap-0.5 text-slate-400 sm:flex",children:[(0,t.jsx)("button",{className:"grid h-7 w-7 place-items-center rounded-md transition hover:bg-red-50 hover:text-red-500",title:"Cancel",type:"button",children:(0,t.jsx)(I,{className:"h-3.5 w-3.5"})}),(0,t.jsx)("button",{className:"grid h-7 w-7 place-items-center rounded-md transition hover:bg-emerald-50 hover:text-emerald-700",title:"Enter",type:"button",children:(0,t.jsx)(m,{className:"h-3.5 w-3.5"})})]}),(0,t.jsxs)("div",{className:"flex h-7 items-center gap-1.5 border-l border-slate-200 px-2 font-serif font-bold italic text-slate-500",children:[(0,t.jsx)(_,{className:"h-3.5 w-3.5"}),(0,t.jsx)("span",{children:"fx"})]}),(0,t.jsxs)("div",{className:"flex min-w-0 flex-1 items-center overflow-x-auto whitespace-nowrap rounded-md border border-slate-200 bg-slate-50/70 px-3 py-1.5 font-mono text-[11px] shadow-inner",children:[(0,t.jsx)("span",{className:e?.formula?"font-semibold text-blue-700":"text-slate-600",children:a}),e?.label&&(0,t.jsx)("span",{className:"ml-2 border-l border-slate-200 pl-2 font-sans text-[10px] text-slate-400",children:e.label})]})]})}let R={name:"pen",size:24,node:[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],aliases:["edit-2"]};R.node;let j=i(R),P={name:"plus",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]};P.node;let L=i(P);function D(e){if(null==e||isNaN(e))return{text:"$0.00",isNegative:!1,raw:0};let t=Number(e),r=Math.abs(t),a=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(r);return t<0?{text:`(${a})`,isNegative:!0,raw:t}:{text:a,isNegative:!1,raw:t}}function M(e){if(null==e||isNaN(e))return{text:"$0.00",isNegative:!1,raw:0};let t=Number(e),r=t<0,a=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(Math.abs(t));return{text:`${r?"-":""}${a}`,isNegative:r,raw:t}}function U(e){if(null==e||isNaN(e))return{text:"0.00%",isNegative:!1,raw:0};let t=Number(e),r=t<0;return{text:`${t>0?"+":""}${t.toFixed(2)}%`,isNegative:r,raw:t}}function B(e,t=2){return null==e||isNaN(e)?"0":new Intl.NumberFormat("en-US",{minimumFractionDigits:t,maximumFractionDigits:t}).format(Number(e))}function z(e,t){return`${M(e).text} (${U(t).text})`}function W({accounts:e,grandTotal:r,selectedCell:a,onSelectCell:n,onEditAccount:s,onAddAccount:o}){
  let i=e=>a?.cellId===e,l="ring-2 ring-emerald-600 ring-inset bg-emerald-50";
  let calcMaxColW=(header,vals)=>Math.ceil(Math.max(header.length,...vals.map(v=>String(v??"").length))*7.4+22);
  let summaryColWidths=[
    calcMaxColW("S. No.",[...e.map((_,idx)=>String(idx+1)),"Total"]),
    calcMaxColW("Account",[...e.map(x=>`${x.accountNumber} (${x.accountName})`),"All Accounts"]),
    calcMaxColW("Account Value",[...e.map(x=>D(x.accountOverallMoney).text),D(r.accountOverallMoney).text]),
    calcMaxColW("Cash Balance",[...e.map(x=>D(x.cashAvailable).text),D(r.cashAvailable).text]),
    calcMaxColW("Amount Invested",[...e.map(x=>D(x.amountInvested).text),D(r.amountInvested).text]),
    calcMaxColW("Current Value",[...e.map(x=>D(x.investmentCurrent).text),D(r.investmentCurrent).text]),
    calcMaxColW("Gain / Loss",[...e.map(x=>`${M(x.gainLoss).text} (${U(x.gainLossPercent).text})`),`${M(r.gainLoss).text} (${U(r.gainLossPercent).text})`]),
    calcMaxColW("Comments",[...e.map(x=>x.comments||"—"),"Consolidated Portfolio"]),
    calcMaxColW("Actions",["Edit"])
  ];
  let summaryTotalW=summaryColWidths.reduce((s,w)=>s+w,0);
  return(0,t.jsxs)("section",{
    className:"section-font-summary my-4 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_12px_32px_-24px_rgba(15,23,42,0.65)]",
    children:[
      (0,t.jsxs)("div",{
        className:"flex items-center justify-between border-b border-blue-950/25 bg-[linear-gradient(110deg,#173f68_0%,#245d8f_55%,#1b4b76_100%)] px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-white",
        children:[
          (0,t.jsx)("span",{className:"text-[8px] font-medium normal-case tracking-normal text-blue-200",children:"Linked accounts"}),
          (0,t.jsx)("span",{className:"text-[10px] sm:text-[11px] font-bold tracking-[0.06em]",children:"Account's Summary"}),
          (0,t.jsxs)("button",{type:"button",onClick:o,className:"inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold normal-case text-white transition hover:bg-emerald-700",children:[(0,t.jsx)(L,{className:"h-3 w-3"}),"Add Account"]})
        ]
      }),
      (0,t.jsx)("div",{
        className:"freeze-header-scroll relative max-h-[58vh] overflow-auto",
        children:(0,t.jsxs)("table",{
          className:"freeze-header-table table-fixed border-separate border-spacing-0 text-xs",
          style:{width:summaryTotalW,minWidth:summaryTotalW},
          children:[
            (0,t.jsx)("colgroup",{children:summaryColWidths.map((w,idx)=>(0,t.jsx)("col",{style:{width:w,minWidth:w,maxWidth:w}},idx))}),
            (0,t.jsx)("thead",{
              children:(0,t.jsxs)("tr",{
                className:"border-b border-slate-400 bg-[#D9E1F2] text-center font-bold text-[#1F4E79]",
                children:[
                  (0,t.jsx)("th",{className:"border border-slate-300 text-center whitespace-nowrap",children:"S. No."}),
                  (0,t.jsx)("th",{className:"border border-slate-300 text-left whitespace-nowrap",children:"Account"}),
                  (0,t.jsx)("th",{className:"border border-slate-300 text-right whitespace-nowrap",children:"Account Value"}),
                  (0,t.jsx)("th",{className:"border border-slate-300 text-right whitespace-nowrap",children:"Cash Balance"}),
                  (0,t.jsx)("th",{className:"border border-slate-300 text-right whitespace-nowrap",children:"Amount Invested"}),
                  (0,t.jsx)("th",{className:"border border-slate-300 text-right whitespace-nowrap",children:"Current Value"}),
                  (0,t.jsx)("th",{className:"border border-slate-300 text-right whitespace-nowrap",children:"Gain / Loss"}),
                  (0,t.jsx)("th",{className:"border border-slate-300 text-left whitespace-nowrap",children:"Comments"}),
                  (0,t.jsx)("th",{className:"border border-slate-300 text-center whitespace-nowrap",children:"Actions"})
                ]
              })
            }),
            (0,t.jsxs)("tbody",{
              children:[
                e.map((e,r)=>{
                  let a=4+r,o=D(e.accountOverallMoney),c=D(e.cashAvailable),f=D(e.amountInvested),h=D(e.investmentCurrent),d=M(e.gainLoss),u=U(e.gainLossPercent);
                  return(0,t.jsxs)("tr",{
                    className:"bg-white transition-colors hover:bg-blue-50/40",
                    children:[
                      (0,t.jsx)("td",{onClick:()=>n({cellId:`A${a}`,label:"Row S.No",value:String(e.sNo),formula:String(e.sNo)}),className:`border border-slate-300 px-2 py-1 text-center font-mono whitespace-nowrap ${i(`A${a}`)?l:""}`,children:e.sNo}),
                      (0,t.jsxs)("td",{onClick:()=>n({cellId:`B${a}`,label:"Account Number",value:e.accountNumber,formula:`="${e.accountNumber}"`}),className:`border border-slate-300 px-2.5 py-1 font-bold text-[#1F4E79] whitespace-nowrap ${i(`B${a}`)?l:""}`,children:[e.accountNumber,(0,t.jsxs)("span",{className:"ml-1 text-[10px] font-normal text-slate-500",children:["(",e.accountName,")"]})]}),
                      (0,t.jsx)("td",{onClick:()=>n({cellId:`C${a}`,label:`${e.accountNumber} Account Value`,value:o.text,formula:`=D${a}+F${a}`}),className:`border border-slate-300 px-2.5 py-1 text-right font-mono font-bold whitespace-nowrap ${i(`C${a}`)?l:""}`,children:o.text}),
                      (0,t.jsx)("td",{onClick:()=>n({cellId:`D${a}`,label:`${e.accountNumber} Cash Available`,value:c.text,formula:String(e.cashAvailable)}),className:`border border-slate-300 px-2.5 py-1 text-right font-mono text-emerald-800 whitespace-nowrap ${i(`D${a}`)?l:""}`,children:c.text}),
                      (0,t.jsx)("td",{onClick:()=>n({cellId:`E${a}`,label:`${e.accountNumber} Amount Invested`,value:f.text,formula:`=SUMIF('Consolidated View'!B:B,"${e.accountNumber}",'Consolidated View'!E:E)`}),className:`border border-slate-300 px-2.5 py-1 text-right font-mono whitespace-nowrap ${i(`E${a}`)?l:""}`,children:f.text}),
                      (0,t.jsx)("td",{onClick:()=>n({cellId:`F${a}`,label:`${e.accountNumber} Current Value`,value:h.text,formula:`=SUMIF('Consolidated View'!B:B,"${e.accountNumber}",'Consolidated View'!G:G)`}),className:`border border-slate-300 px-2.5 py-1 text-right font-mono font-bold text-blue-900 whitespace-nowrap ${i(`F${a}`)?l:""}`,children:h.text}),
                      (0,t.jsxs)("td",{onClick:()=>n({cellId:`G${a}`,label:`${e.accountNumber} Gain/Loss`,value:`${d.text} (${u.text})`,formula:`=F${a}-E${a}`}),className:`border border-slate-300 px-2.5 py-1 text-right font-mono font-bold whitespace-nowrap ${d.isNegative?"text-red-600":"text-emerald-700"} ${i(`G${a}`)?l:""}`,children:[d.text," (",u.text,")"]}),
                      (0,t.jsx)("td",{onClick:()=>n({cellId:`H${a}`,label:"Comments",value:e.comments||"",formula:`="${e.comments||""}"`}),className:`border border-slate-300 px-2.5 py-1 text-slate-600 whitespace-nowrap ${i(`H${a}`)?l:""}`,children:e.comments||"—"}),
                      (0,t.jsx)("td",{className:"border border-slate-300 px-2 py-1 text-center whitespace-nowrap",children:(0,t.jsx)("button",{type:"button",onClick:()=>s(e),className:"rounded px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-50",children:"Edit"})})
                    ]
                  },e.accountNumber)
                }),
                (0,t.jsxs)("tr",{
                  className:"bg-[#E2EFDA] font-extrabold text-slate-900",
                  children:[
                    (0,t.jsx)("td",{className:"border border-slate-400 px-2 py-1.5 text-center whitespace-nowrap",children:"Total"}),
                    (0,t.jsx)("td",{className:"border border-slate-400 px-2.5 py-1.5 whitespace-nowrap",children:"All Accounts"}),
                    (0,t.jsx)("td",{className:"border border-slate-400 px-2.5 py-1.5 text-right font-mono whitespace-nowrap",children:D(r.accountOverallMoney).text}),
                    (0,t.jsx)("td",{className:"border border-slate-400 px-2.5 py-1.5 text-right font-mono text-emerald-900 whitespace-nowrap",children:D(r.cashAvailable).text}),
                    (0,t.jsx)("td",{className:"border border-slate-400 px-2.5 py-1.5 text-right font-mono whitespace-nowrap",children:D(r.amountInvested).text}),
                    (0,t.jsx)("td",{className:"border border-slate-400 px-2.5 py-1.5 text-right font-mono text-blue-900 whitespace-nowrap",children:D(r.investmentCurrent).text}),
                    (0,t.jsxs)("td",{className:`border border-slate-400 px-2.5 py-1.5 text-right font-mono whitespace-nowrap ${r.gainLoss<0?"text-red-600":"text-emerald-800"}`,children:[M(r.gainLoss).text," (",U(r.gainLossPercent).text,")"]}),
                    (0,t.jsx)("td",{className:"border border-slate-400 px-2.5 py-1.5 text-slate-600 whitespace-nowrap",children:"Consolidated Portfolio"}),
                    (0,t.jsx)("td",{className:"border border-slate-400 text-center whitespace-nowrap",children:"—"})
                  ]
                })
              ]
            })
          ]
        })
      })
    ]
  })
}
const ei = LucideSlidersHorizontal;
const es = LucideRotateCcw;
const et = LucideGripVertical;
const K = LucideChevronUp;
const V = LucideChevronDown;
const X = LucideChevronRight;
const J = LucideEye;
const Z = LucideEyeOff;
const ea = LucidePencil;

const el = "portfolio-consolidated-view-columns-v4";
const ec = [
  { id: "symbol", label: "Symbol", visible: true, editable: false },
  { id: "accountNumber", label: "Account", visible: true, editable: false },
  { id: "quantity", label: "Quantity", visible: true, editable: true },
  { id: "purchasePrice", label: "Avg Price", visible: true, editable: true },
  { id: "investAmount", label: "Invest Amount", visible: true, editable: false },
  { id: "currentPrice", label: "Current Price", visible: true, editable: true },
  { id: "overallCurrentPrice", label: "Overall Cur.Price", visible: true, editable: false },
  { id: "comments", label: "Comments", visible: true, editable: true },
  { id: "profitLossAmt", label: "Gain/Loss", visible: true, editable: false },
];

function ef(e,t){return`${M(e).text} (${U(t).text})`}function eh(e){let t=e+1,r="";for(;t>0;)t-=1,r=String.fromCharCode(65+t%26)+r,t=Math.floor(t/26);return r}function ed({accountGroups:e,selectedCell:a,onSelectCell:n,onAddNewHolding:s,onSaveInlineField:o}){let[i,l]=(0,r.useState)(ec),[c,f]=(0,r.useState)(!1),[h,d]=(0,r.useState)(!1),[u,p]=(0,r.useState)(null),[g,b]=(0,r.useState)(null),[x,v]=(0,r.useState)(""),[y,w]=(0,r.useState)(null),[A,T]=(0,r.useState)(new Set);(0,r.useEffect)(()=>{let e=[el,"portfolio-consolidation-inventory-columns-v3","portfolio-current-investment-columns-v2"];try{let t=e.map(e=>({key:e,value:window.localStorage.getItem(e)})).find(e=>e.value);if(t?.value){let e=JSON.parse(t.value);if(Array.isArray(e)){let t=e.map(e=>{let t=ec.find(t=>t.id===e.id);if(!t)return null;let r=e.label?.trim(),a=r&&!({purchasePrice:["Purchase Price / Avg Cost","Purchase Price/Average Cost"],currentPrice:["Current Price / Share","Current Price/Share"],overallCurrentPrice:["Overall Current Price"],profitLossAmt:["Profit / Loss Amount","Profit/Loss Amount","Gain/Loss Amt"]})[t.id]?.includes(r)?r:t.label;return{...t,...e,id:t.id,label:a,editable:t.editable}}).filter(e=>null!==e),r=ec.filter(e=>!t.some(t=>t.id===e.id));if(t.length>0){let e=[...t,...r],a=e.find(e=>"symbol"===e.id);l([{...a||ec[0],visible:!0,editable:!1},...e.filter(e=>"symbol"!==e.id)])}}}}catch{for(let t of e)window.localStorage.removeItem(t)}finally{f(!0)}},[]),(0,r.useEffect)(()=>{c&&window.localStorage.setItem(el,JSON.stringify(i))},[i,c]);let C=(0,r.useMemo)(()=>i.filter(e=>e.visible),[i]),E=(0,r.useMemo)(()=>{let t=e.flatMap(e=>e.holdings);return Object.fromEntries(i.map(r=>{let lengths=[String(r.label||"").length];for(const h of t){if("symbol"===r.id){lengths.push(String(h.symbol||"").length);if(h.updatedAt)lengths.push(`Updated: ${new Date(h.updatedAt).toLocaleDateString()}`.length)}else if("accountNumber"===r.id){lengths.push(String(h.accountNumber||"").length)}else if("quantity"===r.id){lengths.push(String(B(h.quantity,2*(h.quantity%1!=0))).length)}else if("purchasePrice"===r.id){lengths.push(String(D(h.purchasePrice).text).length)}else if("investAmount"===r.id){lengths.push(String(D(h.investAmount).text).length)}else if("currentPrice"===r.id){lengths.push(String(D(h.currentPrice).text).length)}else if("overallCurrentPrice"===r.id){lengths.push(String(D(h.overallCurrentPrice).text).length)}else if("comments"===r.id){lengths.push(String(h.comments||"—").length)}else if("profitLossAmt"===r.id){lengths.push(String(ef(h.profitLossAmt,h.gainLossPercent)).length)}}for(const acc of e){if("accountNumber"===r.id||(0===i.findIndex(x=>x.id===r.id)&&!i.some(x=>"accountNumber"===x.id))){lengths.push(`Total (${acc.accountNumber})`.length)}else if("investAmount"===r.id){lengths.push(String(D(acc.amountInvested).text).length)}else if("overallCurrentPrice"===r.id){lengths.push(String(D(acc.investmentCurrent).text).length)}else if("profitLossAmt"===r.id){lengths.push(String(ef(acc.gainLoss,acc.gainLossPercent)).length)}else{lengths.push(1)}}let maxLen=Math.max(...lengths);let colW=Math.ceil(maxLen*7.3+(r.editable?28:20));return[r.id,colW]}))},[i,e]),k=C.reduce((e,t)=>e+E[t.id],0),S=(e,t)=>{l(r=>r.map(r=>r.id===e?{...r,...t,visible:"symbol"===e||(t.visible??r.visible)}:r))},N=(e,t)=>{"symbol"!==e&&l(r=>{let a=r.findIndex(t=>t.id===e),n=a+t;if(a<1||n<1||n>=r.length)return r;let s=[...r];return[s[a],s[n]]=[s[n],s[a]],s})},_=(e,t)=>{e!==t&&"symbol"!==e&&"symbol"!==t&&l(r=>{let a=r.findIndex(t=>t.id===e),n=r.findIndex(e=>e.id===t);if(a<0||n<0)return r;let s=[...r],[o]=s.splice(a,1);return s.splice(n,0,o),s})},O=(e,t)=>{b({id:e.id,field:t}),v(String(e[t]??""))},F=()=>{b(null),v("")},R=async e=>{let t;if(!g)return;let r=g.field;if(["quantity","purchasePrice","currentPrice"].includes(r)){let e=Number(x);if(!Number.isFinite(e)||e<0)return void alert("Please enter a valid positive number.");if("quantity"===r&&e<=0)return void alert("Quantity must be greater than zero.");t={[r]:e}}else t={comments:x.trim()};try{w(e),await o(e,t),b(null),v("")}catch(e){console.error(e),alert(e instanceof Error?e.message:"Failed to save the edited cell.")}finally{w(null)}};return(0,t.jsxs)("section",{className:"relative my-4 w-full overflow-visible rounded-xl border border-slate-200/90 bg-white shadow-[0_12px_32px_-24px_rgba(15,23,42,0.65)]",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-2 rounded-t-xl border-b border-blue-950/25 bg-[linear-gradient(110deg,#173f68_0%,#245d8f_55%,#1b4b76_100%)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white",children:[(0,t.jsx)("div",{className:"flex items-center gap-2",children:(0,t.jsx)("span",{children:"Consolidated View - Account Level"})}),(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-1.5 normal-case",children:[(0,t.jsxs)("button",{type:"button",onClick:()=>s(e[0]?.accountNumber||e[0]?.accountNumber||""),className:"flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold hover:bg-emerald-700",children:[(0,t.jsx)(L,{className:"w-3.5 h-3.5"}),"Add Holding"]}),(0,t.jsx)("button",{type:"button",onClick:()=>T(new Set),className:"rounded bg-[#163857] px-2 py-1 text-[10px] sm:text-[10.5px] font-semibold hover:bg-blue-900",children:"Expand All"}),(0,t.jsx)("button",{type:"button",onClick:()=>T(new Set(e.map(e=>e.accountNumber))),className:"rounded bg-[#163857] px-2 py-1 text-[10px] sm:text-[10.5px] font-semibold hover:bg-blue-900",children:"Collapse All"}),(0,t.jsxs)("button",{type:"button",onClick:()=>d(e=>!e),className:`flex items-center gap-1 rounded px-2.5 py-1 text-[10px] sm:text-[10.5px] font-semibold transition ${h?"bg-white text-[#1F4E79]":"bg-[#163857] text-white hover:bg-blue-900 border border-blue-400/30"}`,children:[(0,t.jsx)(ei,{className:"h-3 w-3"}),"Customize Columns"]})]})]}),h&&(0,t.jsxs)("div",{className:"relative z-20 border-b border-gray-200 bg-slate-50/95 px-2.5 py-1.5 shadow-inner",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-2 mb-1",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-[9px] sm:text-[9.5px] font-bold text-[#1F4E79]",children:"Customize Consolidated View Columns"}),(0,t.jsx)("p",{className:"text-[7.5px] sm:text-[8px] text-gray-500 leading-tight",children:"Drag cards or use arrows to rearrange. Rename headers and show/hide columns. Layout is saved automatically."})]}),(0,t.jsxs)("button",{type:"button",onClick:()=>{l(ec),window.localStorage.removeItem(el)},className:"inline-flex items-center gap-1 px-1.5 py-0.5 bg-white hover:bg-gray-100 border border-gray-300 rounded text-[8px] sm:text-[8.5px] font-semibold text-gray-700 shadow-2xs",children:[(0,t.jsx)(es,{className:"w-2.5 h-2.5"}),"Reset Default Layout"]})]}),(0,t.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1",children:i.map((e,r)=>(0,t.jsxs)("div",{draggable:"symbol"!==e.id,onDragStart:()=>"symbol"!==e.id&&p(e.id),onDragOver:e=>e.preventDefault(),onDrop:()=>{u&&_(u,e.id),p(null)},onDragEnd:()=>p(null),className:`bg-white border rounded px-1.5 py-0.5 flex items-center gap-1 shadow-2xs cursor-grab active:cursor-grabbing ${u===e.id?"border-emerald-500 opacity-60":"border-gray-200"}`,children:[(0,t.jsx)(et,{className:"w-3 h-3 text-gray-400 shrink-0"}),(0,t.jsx)("input",{value:e.label,onChange:t=>S(e.id,{label:t.target.value}),onPointerDown:e=>e.stopPropagation(),className:"h-4.5 min-w-0 flex-1 border border-gray-200 rounded px-1 text-[8px] sm:text-[8.5px] font-medium outline-none focus:border-emerald-600 bg-transparent","aria-label":`Rename ${e.label} column`}),(0,t.jsxs)("div",{className:"flex items-center",children:[(0,t.jsx)("button",{type:"button",onClick:()=>N(e.id,-1),disabled:"symbol"===e.id||r<=1,className:"p-0.5 text-gray-500 hover:text-[#1F4E79] disabled:opacity-20",title:"Move column left",children:(0,t.jsx)(K,{className:"w-2.5 h-2.5 -rotate-90"})}),(0,t.jsx)("button",{type:"button",onClick:()=>N(e.id,1),disabled:"symbol"===e.id||r===i.length-1,className:"p-0.5 text-gray-500 hover:text-[#1F4E79] disabled:opacity-20",title:"Move column right",children:(0,t.jsx)(V,{className:"w-2.5 h-2.5 -rotate-90"})}),(0,t.jsx)("button",{type:"button",disabled:"symbol"===e.id,onClick:()=>{let t=i.filter(e=>e.visible).length;e.visible&&1===t||S(e.id,{visible:!e.visible})},className:`p-0.5 rounded disabled:cursor-not-allowed disabled:opacity-35 ${e.visible?"text-emerald-700":"text-gray-400"}`,title:"symbol"===e.id?"Symbol is frozen":e.visible?"Hide column":"Show column",children:e.visible?(0,t.jsx)(J,{className:"w-2.5 h-2.5"}):(0,t.jsx)(Z,{className:"w-2.5 h-2.5"})})]})]},e.id))})]}),(0,t.jsx)("div",{className:"flex justify-end px-3 py-1 bg-[#E2F0D9] border-b border-emerald-200 text-[10px] text-emerald-900",children:"Drag a column header to rearrange it, or use Customize Columns."}),(0,t.jsx)("div",{className:"freeze-header-scroll relative isolate max-h-[72vh] overflow-auto",children:(0,t.jsxs)("table",{className:"freeze-header-table table-fixed border-separate border-spacing-0 text-xs",style:{width:k},children:[(0,t.jsx)("colgroup",{children:C.map(col=>(0,t.jsx)("col",{style:{width:E[col.id],minWidth:E[col.id],maxWidth:E[col.id]}},col.id))}),(0,t.jsx)("thead",{children:(0,t.jsx)("tr",{className:"bg-[#FCE4D6] text-gray-800 font-bold border-b border-gray-400",children:C.map(e=>(0,t.jsx)("th",{draggable:"symbol"!==e.id,onDragStart:()=>"symbol"!==e.id&&p(e.id),onDragOver:e=>e.preventDefault(),onDrop:()=>{u&&_(u,e.id),p(null)},onDragEnd:()=>p(null),style:{width:E[e.id],minWidth:E[e.id],maxWidth:E[e.id]},className:`border border-gray-300 px-2 py-1.5 cursor-grab active:cursor-grabbing select-none whitespace-nowrap ${"symbol"===e.id?"frozen-symbol-column sticky left-0 z-30 bg-[#FCE4D6] shadow-[3px_0_5px_-3px_rgba(0,0,0,0.35)]":""} ${"right"===e.align?"text-right":"center"===e.align?"text-center":"text-left"} ${e.editable?"bg-[#FFF2CC]":""} ${u===e.id?"opacity-50 bg-emerald-100":""}`,title:"Drag to rearrange this column",children:(0,t.jsxs)("div",{className:`flex items-center gap-1 ${"right"===e.align?"justify-end":"center"===e.align?"justify-center":"justify-start"}`,children:[(0,t.jsx)(et,{className:"w-3 h-3 text-gray-400 shrink-0"}),(0,t.jsx)("span",{children:e.label||ec.find(t=>t.id===e.id)?.label})]})},e.id))})}),(0,t.jsx)("tbody",{children:e.map((e,o)=>{let i=10+10*o,l=A.has(e.accountNumber);return(0,t.jsxs)(r.default.Fragment,{children:[(0,t.jsx)("tr",{className:"bg-[#E7E6E6] font-semibold text-gray-800 text-[11px] border-y border-gray-300",children:(0,t.jsx)("td",{colSpan:C.length,className:"border border-gray-300 px-3 py-1",children:(0,t.jsxs)("div",{className:"flex items-center justify-between gap-3",children:[(0,t.jsxs)("button",{type:"button",onClick:()=>{var t;return t=e.accountNumber,void T(e=>{let r=new Set(e);return r.has(t)?r.delete(t):r.add(t),r})},className:"inline-flex items-center gap-2 font-bold text-[#1F4E79] hover:text-blue-900","aria-expanded":!l,children:[l?(0,t.jsx)(X,{className:"w-4 h-4"}):(0,t.jsx)(V,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:e.accountNumber}),(0,t.jsxs)("span",{className:"text-[10px] font-normal text-gray-500",children:["(",e.holdings.length," ",1===e.holdings.length?"entry":"entries",")"]})]}),(0,t.jsxs)("button",{type:"button",onClick:()=>s(e.accountNumber),className:"inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium text-xs px-2 py-0.5 rounded hover:bg-emerald-50 transition",children:[(0,t.jsx)(L,{className:"w-3 h-3"}),"Add Holding to ",e.accountNumber]})]})})}),!l&&(0,t.jsxs)(t.Fragment,{children:[0===e.holdings.length?(0,t.jsx)("tr",{children:(0,t.jsxs)("td",{colSpan:C.length,className:"border border-gray-300 px-4 py-3 text-center text-gray-400 italic bg-gray-50",children:["No active holdings for ",e.accountNumber,"."]})}):e.holdings.map((e,r)=>{let s=i+r;return(0,t.jsx)("tr",{className:`hover:bg-blue-50/40 transition-colors ${"yellow"===e.highlight?"bg-[#FFFF99]":""}`,children:C.map((r,o)=>{let i,l=`${eh(o)}${s}`,c=r.editable?r.id:null,f=g?.id===e.id&&g.field===r.id;return(0,t.jsx)("td",{onClick:()=>{let t,a,i;return t=`${eh(o)}${s}`,a={accountNumber:e.accountNumber,symbol:`${e.symbol} — Updated ${e.updatedAt?new Date(e.updatedAt).toLocaleString():"not recorded"}`,quantity:String(e.quantity),purchasePrice:D(e.purchasePrice).text,investAmount:D(e.investAmount).text,currentPrice:D(e.currentPrice).text,overallCurrentPrice:D(e.overallCurrentPrice).text,comments:e.comments||"",profitLossAmt:ef(e.profitLossAmt,e.gainLossPercent)},i={investAmount:"=[Quantity]*[Avg Price]",overallCurrentPrice:"=[Quantity]*[Current Price]",profitLossAmt:'=([Overall Cur.Price]-[Invest Amount]) & " (" & (([Overall Cur.Price]-[Invest Amount])/[Invest Amount]) & ")"',currentPrice:`=MARKET_QUOTE("${e.symbol}")`},void n({cellId:t,label:`${e.symbol} — ${r.label}`,value:a[r.id],formula:i[r.id]||a[r.id]})},onDoubleClick:()=>c&&O(e,c),style:{width:E[r.id],minWidth:E[r.id],maxWidth:E[r.id]},className:`border border-gray-300 px-2 py-1.5 font-mono group relative whitespace-nowrap ${"symbol"===r.id?`frozen-symbol-column sticky left-0 z-20 shadow-[3px_0_5px_-3px_rgba(0,0,0,0.35)] ${"yellow"===e.highlight?"bg-[#FFFF99]":"bg-white"}`:""} ${"right"===r.align?"text-right":"center"===r.align?"text-center":"text-left"} ${r.editable?"cursor-text hover:bg-emerald-50/60":"bg-gray-50/20"} ${a?.cellId===l?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,title:r.editable?`Double-click ${r.label}`:r.label,children:f&&c?(i="comments"!==c,(0,t.jsxs)("div",{className:"flex items-center gap-1",onClick:e=>e.stopPropagation(),children:[(0,t.jsx)("input",{autoFocus:!0,type:i?"number":"text",step:i?"any":void 0,min:"quantity"===c?"0.0001":i?"0":void 0,value:x,onChange:e=>v(e.target.value),onKeyDown:t=>{"Enter"===t.key&&R(e.id),"Escape"===t.key&&F()},className:`w-full min-w-[80px] px-1.5 py-1 bg-white border-2 border-emerald-600 rounded font-mono font-bold text-xs outline-none shadow-sm ${"comments"===c?"text-left":"text-right"}`}),(0,t.jsx)("button",{type:"button",onClick:()=>void R(e.id),disabled:y===e.id,className:"p-1 text-emerald-700 hover:bg-emerald-100 rounded disabled:opacity-50",title:"Save",children:(0,t.jsx)(m,{className:"w-3.5 h-3.5"})}),(0,t.jsx)("button",{type:"button",onClick:F,className:"p-1 text-red-600 hover:bg-red-100 rounded",title:"Cancel",children:(0,t.jsx)(I,{className:"w-3.5 h-3.5"})})]})):(0,t.jsxs)("div",{className:`flex items-center gap-1 ${"right"===r.align?"justify-end":"justify-start"}`,children:[c&&(0,t.jsx)("button",{type:"button",onClick:t=>{t.stopPropagation(),O(e,c)},className:"opacity-0 group-hover:opacity-100 text-gray-400 hover:text-emerald-700 transition shrink-0",title:`Edit ${r.label}`,children:(0,t.jsx)(ea,{className:"w-3 h-3"})}),((e,r)=>{switch(r.id){case"accountNumber":return(0,t.jsx)("span",{className:"font-semibold text-blue-900",children:e.accountNumber});case"symbol":return(0,t.jsxs)("span",{className:"flex flex-col font-sans",children:[(0,t.jsx)("span",{className:"font-mono font-bold text-gray-900",children:e.symbol}),(0,t.jsxs)("span",{className:"mt-0.5 text-[9px] leading-tight text-gray-500 whitespace-nowrap",children:["Updated: ",e.updatedAt?new Date(e.updatedAt).toLocaleDateString():"Not recorded"]})]});case"quantity":return B(e.quantity,2*(e.quantity%1!=0));case"purchasePrice":return D(e.purchasePrice).text;case"investAmount":return(0,t.jsx)("span",{className:"font-semibold",children:D(e.investAmount).text});case"currentPrice":return(0,t.jsx)("span",{className:"font-bold text-[#1F4E79]",children:D(e.currentPrice).text});case"overallCurrentPrice":return(0,t.jsx)("span",{className:"font-semibold",children:D(e.overallCurrentPrice).text});case"comments":return e.comments?(0,t.jsx)("span",{className:`px-1.5 py-0.5 rounded text-[10px] font-semibold ${e.comments.toLowerCase().includes("loss")?"bg-red-100 text-red-700 border border-red-200":"bg-gray-100 text-gray-700"}`,children:e.comments}):(0,t.jsx)("span",{className:"text-gray-400",children:"—"});case"profitLossAmt":return(0,t.jsx)("span",{className:`font-bold ${e.profitLossAmt<0?"text-red-600":"text-emerald-700"}`,children:ef(e.profitLossAmt,e.gainLossPercent)})}})(e,r)]})},r.id)})},e.id)}),(0,t.jsx)("tr",{className:"bg-[#FFF2CC] font-bold border-t-2 border-b-2 border-gray-400 text-gray-900",children:C.map((r,a)=>(0,t.jsx)("td",{style:{width:E[r.id],minWidth:E[r.id],maxWidth:E[r.id]},className:`border border-gray-300 px-3 py-1.5 font-mono whitespace-nowrap ${"symbol"===r.id?"frozen-symbol-column sticky left-0 z-20 bg-[#FFF2CC] shadow-[3px_0_5px_-3px_rgba(0,0,0,0.35)]":""} ${"right"===r.align?"text-right":"text-left"}`,children:((e,r,a)=>{if("accountNumber"===r.id||0===a&&!C.some(e=>"accountNumber"===e.id))return(0,t.jsxs)("span",{className:"font-bold",children:["Total (",e.accountNumber,")"]});switch(r.id){case"investAmount":return D(e.amountInvested).text;case"overallCurrentPrice":return D(e.investmentCurrent).text;case"profitLossAmt":return(0,t.jsx)("span",{className:e.gainLoss<0?"text-red-600":"text-emerald-700",children:ef(e.gainLoss,e.gainLossPercent)});default:return(0,t.jsx)("span",{className:"text-gray-400",children:"—"})}})(e,r,a)},r.id))})]}),(0,t.jsx)("tr",{className:"h-2 bg-white",children:(0,t.jsx)("td",{colSpan:C.length,className:"border-0"})})]},e.accountNumber)})})]})})]})}let eu={name:"circle-check",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 9-5.5 5.5L8 12",key:"xofnsj"}]],aliases:["check-circle-2"]};eu.node;let ep=i(eu),em={name:"info",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]};em.node;let eg=i(em),eb={name:"mouse-pointer-2",size:24,node:[["path",{d:"M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",key:"edeuup"}]]};eb.node;let ex=i(eb),ev={name:"circle-plus",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],aliases:["plus-circle"]};ev.node;let ey=i(ev);const DAILY_TX_DEFAULT_COLS = [
  { id: "symbol", label: "Symbol", visible: true },
  { id: "account", label: "Account", visible: true },
  { id: "dateTime", label: "Date/time", visible: true },
  { id: "quantity", label: "Quantity", visible: true },
  { id: "pricePerShare", label: "Price Per Share", visible: true },
  { id: "averageCost", label: "Average Cost", visible: true },
  { id: "totalAmount", label: "Total Amount", visible: true },
  { id: "currentPrice", label: "Current Price", visible: true },
  { id: "gainLoss", label: "Gain/Loss", visible: true },
];
const DAILY_TX_STORAGE_KEY = "daily-transactions-column-order-v5";

function ew({entries:e,inventoryAccounts:a,selectedCell:n,onSelectCell:s,onOpenAddModal:o,onSellSelected:i,onSaveInlineField:l}){
  let [g,b]=(0,r.useState)(null),[x,v]=(0,r.useState)(""),[y,w]=(0,r.useState)(null),
  [showColPanel,setShowColPanel]=(0,r.useState)(false),
  [dragColId,setDragColId]=(0,r.useState)(null),
  [selectedAccounts,setSelectedAccounts]=(0,r.useState)([]),
  [accountDropdownOpen,setAccountDropdownOpen]=(0,r.useState)(false),
  [cols,setCols]=(0,r.useState)(()=>{
    if("undefined"==typeof window)return DAILY_TX_DEFAULT_COLS;
    try{
      let raw=window.localStorage.getItem(DAILY_TX_STORAGE_KEY);
      if(!raw)return DAILY_TX_DEFAULT_COLS;
      let parsed=JSON.parse(raw);
      if(!Array.isArray(parsed))return DAILY_TX_DEFAULT_COLS;
      let restored=parsed.map(item=>{
        let def=DAILY_TX_DEFAULT_COLS.find(d=>d.id===item.id);
        return def?{...def,label:item.label||def.label,visible:item.visible!==false}:null;
      }).filter(Boolean);
      let missing=DAILY_TX_DEFAULT_COLS.filter(d=>!restored.some(r=>r.id===d.id));
      return [...restored,...missing];
    }catch{
      return DAILY_TX_DEFAULT_COLS;
    }
  });

  r.default.useEffect(()=>{
    try{
      window.localStorage.setItem(DAILY_TX_STORAGE_KEY,JSON.stringify(cols));
    }catch{}
  },[cols]);

  // All unique account numbers across inventoryAccounts and transactions
  let allAccountOptions=r.default.useMemo(()=>{
    let set=new Set();
    (a||[]).forEach(acc=>{if(acc?.accountNumber)set.add(acc.accountNumber)});
    (e||[]).forEach(tx=>{if(tx?.accountNumber)set.add(tx.accountNumber)});
    return Array.from(set).sort((x,y)=>x.localeCompare(y));
  },[a,e]);

  let toggleAccountChoice=(accNum)=>{
    setSelectedAccounts(prev=>prev.includes(accNum)?prev.filter(item=>item!==accNum):[...prev,accNum]);
  };

  // Common filtered entries for BOTH Buy and Sell tables based on selectedAccounts (empty = All Accounts)
  let filteredEntries=r.default.useMemo(()=>{
    if(0===selectedAccounts.length)return e;
    let activeSet=new Set(selectedAccounts);
    return e.filter(tx=>activeSet.has(tx.accountNumber));
  },[e,selectedAccounts]);

  let buyEntries=r.default.useMemo(()=>filteredEntries.filter(tx=>"BUY"===String(tx.action).toUpperCase()),[filteredEntries]);
  let sellEntries=r.default.useMemo(()=>filteredEntries.filter(tx=>"SELL"===String(tx.action).toUpperCase()),[filteredEntries]);

  let moveCol=(colId,dir)=>{
    setCols(prev=>{
      let idx=prev.findIndex(c=>c.id===colId);
      let targetIdx=idx+dir;
      if(idx<0||targetIdx<0||targetIdx>=prev.length)return prev;
      let next=[...prev];
      let [removed]=next.splice(idx,1);
      next.splice(targetIdx,0,removed);
      return next;
    });
  };

  let reorderColDrop=(sourceId,targetId)=>{
    if(!sourceId||!targetId||sourceId===targetId)return;
    setCols(prev=>{
      let sIdx=prev.findIndex(c=>c.id===sourceId);
      let tIdx=prev.findIndex(c=>c.id===targetId);
      if(sIdx<0||tIdx<0)return prev;
      let next=[...prev];
      let [moved]=next.splice(sIdx,1);
      next.splice(tIdx,0,moved);
      return next;
    });
  };

  let updateColProp=(colId,patch)=>{
    setCols(prev=>prev.map(c=>c.id===colId?{...c,...patch}:c));
  };

  // Buy table columns exclude averageCost (since Average Cost is only for Sell)
  let buyVisibleCols=r.default.useMemo(()=>{let base=cols.filter(c=>c.visible!==false&&"averageCost"!==c.id&&"action"!==c.id);return[...base,{id:"actions",label:"Select & Sell"}]},[cols]);
  // Sell table columns include averageCost
  let sellVisibleCols=r.default.useMemo(()=>cols.filter(c=>c.visible!==false&&"action"!==c.id),[cols]);

  // Exact max text length width calculator for a given set of rows and columns
  let computeTableColWidths=(rows,tableCols,isSellTable)=>{
    let calcMaxTextW=(label,vals)=>Math.ceil(Math.max(label.length,...vals.map(v=>String(v??"").length))*7.3+24);
    return tableCols.map(col=>{
      if("symbol"===col.id)return calcMaxTextW(col.label,rows.map(x=>x.symbol));
      if("account"===col.id)return calcMaxTextW(col.label,rows.map(x=>x.sourceTransactionId?`${x.accountNumber} (Buy #${x.sourceTransactionId})`:x.accountNumber));
      if("dateTime"===col.id)return calcMaxTextW(col.label,rows.map(x=>"string"==typeof x.dateTime?new Date(x.dateTime).toLocaleString():x.dateTime.toLocaleString()));
      if("actions"===col.id)return 145;
      if("quantity"===col.id)return calcMaxTextW(col.label,rows.map(x=>"BUY"===String(x.action).toUpperCase()?`${B(x.quantity,2)} (${B(x.remainingQuantity,2)} available)`:B(x.quantity,2)));
      if("pricePerShare"===col.id)return calcMaxTextW(col.label,rows.map(x=>D(x.pricePerShare).text));
      if("averageCost"===col.id)return calcMaxTextW(col.label,rows.map(x=>D(x.averageCost??x.costBasisPerShare??x.pricePerShare).text));
      if("totalAmount"===col.id)return calcMaxTextW(col.label,rows.map(x=>D(x.totalAmount).text));
      if("currentPrice"===col.id)return calcMaxTextW(col.label,rows.map(x=>D(x.currentPrice).text));
      return calcMaxTextW(col.label,rows.map(x=>{
        if(isSellTable){
          let avg=Number(x.averageCost||x.costBasisPerShare||x.pricePerShare)||x.pricePerShare;
          let dAmt=Number(((x.pricePerShare-avg)*x.quantity).toFixed(2));
          let dPct=avg>0?Number((((x.pricePerShare-avg)/avg)*100).toFixed(2)):0;
          return `${M(dAmt).text} (${U(dPct).text})`;
        }
        return `${M(x.differenceAmount).text} (${U(x.differencePercent).text})`;
      }));
    });
  };

  let buyColWidths=r.default.useMemo(()=>computeTableColWidths(buyEntries,buyVisibleCols,false),[buyEntries,buyVisibleCols]);
  let sellColWidths=r.default.useMemo(()=>computeTableColWidths(sellEntries,sellVisibleCols,true),[sellEntries,sellVisibleCols]);
  let buyTotalWidth=buyColWidths.reduce((s,w)=>s+w,0);
  let sellTotalWidth=sellColWidths.reduce((s,w)=>s+w,0);

  let A=e.find(e=>e.id===y&&"BUY"===e.action.toUpperCase()&&e.remainingQuantity>0);
  r.default.useEffect(()=>{y&&!A&&w(null)},[y,A]);
  let T=e=>n?.cellId===e,
  N=(e,t)=>{b({id:e.id,field:t}),v(String(e[t]??""))},
  _=()=>{b(null),v("")},
  O=async e=>{
    if(!g)return;
    let t=Number(x);
    if(!Number.isFinite(t)||t<=0)return void alert("Please enter a valid number greater than zero.");
    try{
      await l(e,{[g.field]:t}),b(null),v("")
    }catch(e){
      console.error(e),alert(e instanceof Error?e.message:"Failed to update transaction value.")
    }
  },
  F=row=>(0,t.jsxs)("div",{
    className:"flex items-center justify-end gap-1",onClick:ev=>ev.stopPropagation(),
    children:[
      (0,t.jsx)("input",{
        type:"number",step:"any",min:"0.0001",autoFocus:!0,value:x,
        onChange:ev=>v(ev.target.value),
        onKeyDown:ev=>{"Enter"===ev.key&&O(row.id),"Escape"===ev.key&&_()},
        className:"w-20 px-1 py-0.5 bg-white border-2 border-emerald-600 rounded text-right font-mono font-bold text-xs outline-none"
      }),
      (0,t.jsx)("button",{type:"button",onClick:()=>void O(row.id),className:"p-1 text-emerald-700 hover:bg-emerald-100 rounded",title:"Save",children:(0,t.jsx)(m,{className:"w-3.5 h-3.5"})}),
      (0,t.jsx)("button",{type:"button",onClick:_,className:"p-1 text-red-600 hover:bg-red-100 rounded",title:"Cancel",children:(0,t.jsx)(I,{className:"w-3.5 h-3.5"})})
    ]
  });

  let renderTransactionRow=(e,r,tableCols,rowOffset)=>{
    let a=rowOffset+r,
    n="string"==typeof e.dateTime?new Date(e.dateTime).toLocaleString():e.dateTime.toLocaleString(),
    o="BUY"===e.action.toUpperCase(),
    i=D(e.totalAmount),
    l=D(e.currentPrice),
    sellAvgVal=!o?Number(e.averageCost||e.costBasisPerShare||e.pricePerShare)||e.pricePerShare:null,
    sellDiffAmt=!o&&sellAvgVal?Number(((e.pricePerShare-sellAvgVal)*e.quantity).toFixed(2)):e.differenceAmount,
    sellDiffPct=!o&&sellAvgVal&&sellAvgVal>0?Number((((e.pricePerShare-sellAvgVal)/sellAvgVal)*100).toFixed(2)):e.differencePercent,
    c=M(o?e.differenceAmount:sellDiffAmt),
    f=U(o?e.differencePercent:sellDiffPct);

    let renderCell=(colId,cIdx)=>{
      let stickyCls=0===cIdx?`frozen-symbol-column sticky left-0 z-20 shadow-[3px_0_5px_-3px_rgba(0,0,0,0.35)] ${y===e.id?"bg-emerald-100":o&&e.remainingQuantity<=0?"bg-gray-50":"bg-white"} `:"";
      if("symbol"===colId){
        return(0,t.jsx)("td",{
          onClick:()=>s({cellId:`A${a}`,label:"Ticker",value:e.symbol,formula:`="${e.symbol}"`}),
          className:`${stickyCls}border border-gray-300 px-2.5 py-1 font-bold text-gray-900 whitespace-nowrap ${T(`A${a}`)?"ring-2 ring-emerald-600 ring-inset":""}`,
          children:(0,t.jsx)("span",{className:"bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200",children:e.symbol})
        },colId);
      }
      if("account"===colId){
        return(0,t.jsx)("td",{
          onClick:()=>s({cellId:`B${a}`,label:"Account",value:e.accountNumber,formula:`="${e.accountNumber}"`}),
          className:`${stickyCls}border border-gray-300 px-2.5 py-1 font-semibold text-blue-900 whitespace-nowrap ${T(`B${a}`)?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,
          children:(0,t.jsxs)("div",{
            className:"flex items-center gap-1.5 whitespace-nowrap",
            children:[
              (0,t.jsx)("span",{children:e.accountNumber}),
              !o&&e.sourceTransactionId&&(0,t.jsxs)("span",{className:"rounded bg-amber-100 text-amber-800 px-1 py-0.2 text-[8.5px] font-mono font-bold",title:`Sold from Buy transaction #${e.sourceTransactionId}`,children:["Buy #",e.sourceTransactionId]})
            ]
          })
        },colId);
      }
      if("dateTime"===colId){
        return(0,t.jsx)("td",{
          onClick:()=>s({cellId:`C${a}`,label:"Order Date/Time",value:n,formula:`="${n}"`}),
          className:`${stickyCls}border border-gray-300 px-2.5 py-1 text-gray-700 whitespace-nowrap text-[11px] ${T(`C${a}`)?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,
          children:n
        },colId);
      }
      
      if("quantity"===colId){
        return(0,t.jsx)("td",{
          onClick:t=>{t.stopPropagation(),s({cellId:`E${a}`,label:"Order Quantity",value:String(e.quantity),formula:String(e.quantity)})},
          onDoubleClick:t=>{t.stopPropagation(),N(e,"quantity")},
          className:`${stickyCls}border border-gray-300 px-2 py-1 text-right font-mono group cursor-text whitespace-nowrap ${T(`E${a}`)?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,
          children:g?.id===e.id&&"quantity"===g.field?F(e):(0,t.jsxs)("div",{
            className:"flex items-center justify-end gap-1 whitespace-nowrap",
            children:[
              (0,t.jsx)("button",{type:"button",onClick:t=>{t.stopPropagation(),N(e,"quantity")},className:"opacity-0 group-hover:opacity-100 text-gray-400 hover:text-emerald-700",title:"Edit Quantity",children:(0,t.jsx)(ea,{className:"w-3 h-3"})}),
              (0,t.jsx)("span",{children:B(e.quantity,2*(e.quantity%1!=0))}),
              o&&(0,t.jsxs)("span",{className:`text-[9px] font-sans ${e.remainingQuantity>0?"text-emerald-700":"text-gray-400"}`,children:["(",e.remainingQuantity>0?`${B(e.remainingQuantity,2)} available`:"Fully sold",")"]})
            ]
          })
        },colId);
      }
      if("pricePerShare"===colId){
        return(0,t.jsx)("td",{
          onClick:t=>{t.stopPropagation(),s({cellId:`F${a}`,label:"Execution Price Per Share",value:D(e.pricePerShare).text,formula:String(e.pricePerShare)})},
          onDoubleClick:t=>{t.stopPropagation(),N(e,"pricePerShare")},
          className:`${stickyCls}border border-gray-300 px-2 py-1 text-right font-mono group cursor-text whitespace-nowrap ${T(`F${a}`)?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,
          children:g?.id===e.id&&"pricePerShare"===g.field?F(e):(0,t.jsxs)("div",{
            className:"flex items-center justify-end gap-1 whitespace-nowrap",
            children:[
              (0,t.jsx)("button",{type:"button",onClick:t=>{t.stopPropagation(),N(e,"pricePerShare")},className:"opacity-0 group-hover:opacity-100 text-gray-400 hover:text-emerald-700",title:"Edit Price Per Share",children:(0,t.jsx)(ea,{className:"w-3 h-3"})}),
              (0,t.jsx)("span",{children:D(e.pricePerShare).text})
            ]
          })
        },colId);
      }
      if("averageCost"===colId){
        let avgVal=sellAvgVal??e.pricePerShare;
        return(0,t.jsx)("td",{
          onClick:t=>{t.stopPropagation(),s({cellId:`G${a}`,label:"Sell Average Cost",value:D(avgVal).text,formula:String(avgVal)})},
          onDoubleClick:t=>{t.stopPropagation(),N({id:e.id,averageCost:avgVal},"averageCost")},
          className:`${stickyCls}border border-gray-300 px-2 py-1 text-right font-mono group cursor-text bg-amber-50/25 whitespace-nowrap ${T(`G${a}`)?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,
          children:g?.id===e.id&&"averageCost"===g.field?F(e):(0,t.jsxs)("div",{
            className:"flex items-center justify-end gap-1 whitespace-nowrap",
            children:[
              (0,t.jsx)("button",{type:"button",onClick:t=>{t.stopPropagation(),N({id:e.id,averageCost:avgVal},"averageCost")},className:"opacity-0 group-hover:opacity-100 text-gray-400 hover:text-emerald-700",title:"Edit Sell Average Cost",children:(0,t.jsx)(ea,{className:"w-3 h-3"})}),
              (0,t.jsx)("span",{className:"font-bold text-amber-900",children:D(avgVal).text})
            ]
          })
        },colId);
      }
      if("totalAmount"===colId){
        return(0,t.jsx)("td",{
          onClick:()=>s({cellId:`H${a}`,label:"Total Execution Amount",value:i.text,formula:`=E${a}*F${a}`}),
          className:`${stickyCls}border border-gray-300 px-2.5 py-1 text-right font-mono font-bold whitespace-nowrap ${T(`H${a}`)?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,
          children:i.text
        },colId);
      }
      if("currentPrice"===colId){
        return(0,t.jsx)("td",{
          onClick:()=>s({cellId:`I${a}`,label:`Current Market Price for ${e.symbol}`,value:l.text,formula:`=WEBSERVICE("MARKET_QUOTE/${e.symbol}")`}),
          className:`${stickyCls}border border-gray-300 px-2.5 py-1 text-right font-mono font-bold text-[#1F4E79] bg-blue-50/20 whitespace-nowrap ${T(`I${a}`)?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,
          children:l.text
        },colId);
      }
      if("actions"===colId){
        let isSelected=y===e.id,canSell=e.remainingQuantity>0;
        return(0,t.jsx)("td",{
          onClick:ev=>ev.stopPropagation(),
          className:`${stickyCls}border border-gray-300 px-2 py-1 text-center whitespace-nowrap ${isSelected?"bg-emerald-100":""}`,
          children:canSell?(0,t.jsxs)("div",{
            className:"flex items-center justify-center gap-1.5 whitespace-nowrap",
            children:[
              (0,t.jsxs)("button",{
                type:"button",
                onClick:()=>w(prev=>prev===e.id?null:e.id),
                title:isSelected?"Deselect this Buy lot":`Select Buy lot #${e.id}`,
                className:`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9.5px] font-bold transition border ${isSelected?"bg-emerald-700 text-white border-emerald-800 shadow-xs":"bg-white text-emerald-800 border-emerald-600/40 hover:bg-emerald-50"}`,
                children:[
                  (0,t.jsx)("input",{
                    type:"checkbox",
                    checked:isSelected,
                    onChange:()=>{},
                    className:"h-3 w-3 accent-emerald-600 rounded cursor-pointer pointer-events-none"
                  }),
                  isSelected?"Selected":"Select"
                ]
              }),
              (0,t.jsx)("button",{
                type:"button",
                onClick:()=>i(e),
                className:"rounded bg-amber-500 hover:bg-amber-600 active:scale-95 text-white px-3 py-0.5 text-[9.5px] font-bold shadow-xs transition",
                title:`Sell from Buy lot #${e.id} (vary quantity inside)`,
                children:"Sell"
              })
            ]
          }):(0,t.jsx)("span",{
            className:"rounded bg-slate-100 text-slate-400 px-2 py-0.5 text-[9px] font-semibold italic",
            children:"Fully Sold"
          })
        },colId);
      }
      // gainLoss column
      return(0,t.jsx)("td",{
        onClick:()=>s({
          cellId:`J${a}`,
          label:!o?"Realized Sell Gain/Loss":"Unrealized Buy Gain/Loss",
          value:`${c.text} (${f.text})`,
          formula:!o?`=((F${a}-G${a})*E${a}) & " (" & ((F${a}-G${a})/G${a}) & ")"`:`=((I${a}-F${a})*E${a}) & " (" & ((I${a}-F${a})/F${a}) & ")"`
        }),
        className:`${stickyCls}border border-gray-300 px-2.5 py-1 text-right font-mono font-bold whitespace-nowrap ${c.isNegative?"text-red-600":"text-emerald-700"} ${T(`J${a}`)?"ring-2 ring-emerald-600 ring-inset bg-emerald-50":""}`,
        children:(0,t.jsxs)("span",{className:"whitespace-nowrap",children:[c.text," (",f.text,")"]})
      },colId);
    };

    return(0,t.jsx)("tr",{
      onClick:()=>{o&&e.remainingQuantity>0&&w(t=>t===e.id?null:e.id)},
      className:`transition-colors ${o&&e.remainingQuantity>0?"cursor-pointer hover:bg-emerald-50/70":"hover:bg-blue-50/50"} ${y===e.id?"bg-emerald-100 ring-2 ring-emerald-600 ring-inset":""} ${o&&e.remainingQuantity<=0?"opacity-60 bg-gray-50":""}`,
      title:o?e.remainingQuantity>0?"Select this Buy transaction for a partial or full sale":"This Buy transaction is fully sold":`${e.sourceTransactionId?`Sold from Buy #${e.sourceTransactionId} · `:""}Average Cost: ${D(sellAvgVal??e.pricePerShare).text} · Sell Gain/Loss: ${c.text} (${f.text})`,
      children:tableCols.map((col,cIdx)=>renderCell(col.id,cIdx))
    },e.id);
  };

  let renderTableHead=(tableCols)=>(0,t.jsx)("thead",{
    className:"sticky top-0 z-30 shadow-xs",
    children:(0,t.jsx)("tr",{
      className:"bg-[#FCE4D6] text-gray-800 font-bold border-b border-gray-400",
      children:tableCols.map((col,cIdx)=>{
        let isRight=["quantity","pricePerShare","averageCost","totalAmount","currentPrice","gainLoss"].includes(col.id);
        let isCenter="action"===col.id||"actions"===col.id;
        let isYellow=["quantity","pricePerShare","averageCost"].includes(col.id);
        return(0,t.jsx)("th",{
          draggable:true,
          onDragStart:()=>setDragColId(col.id),
          onDragOver:ev=>ev.preventDefault(),
          onDrop:()=>{dragColId&&reorderColDrop(dragColId,col.id);setDragColId(null)},
          onDragEnd:()=>setDragColId(null),
          title:"Drag header left or right to rearrange column order",
          className:`${0===cIdx?"frozen-symbol-column sticky left-0 z-30 shadow-[3px_0_5px_-3px_rgba(0,0,0,0.35)] ":""}border border-gray-300 px-2.5 py-1 cursor-grab active:cursor-grabbing select-none whitespace-nowrap ${isYellow?"bg-[#fff2cc]":"bg-[#FCE4D6]"} ${isRight?"text-right":isCenter?"text-center":"text-left"} ${"currentPrice"===col.id?"text-blue-900":""} ${dragColId===col.id?"opacity-60 ring-2 ring-emerald-600":""}`,
          children:(0,t.jsxs)("div",{
            className:`flex items-center gap-1 whitespace-nowrap ${isRight?"justify-end":isCenter?"justify-center":"justify-start"}`,
            children:[
              (0,t.jsx)(et,{className:"w-3 h-3 text-gray-400/80 shrink-0"}),
              (0,t.jsx)("span",{children:col.label})
            ]
          })
        },col.id)
      })
    })
  });

  return(0,t.jsxs)("section",{
    className:"section-font-daily my-2 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_14px_38px_-26px_rgba(15,23,42,0.7)]",
    children:[
      // Top Control & Compact Minimized Multi-Select Account Filter
      (0,t.jsxs)("div",{
        className:"flex flex-wrap items-center justify-between gap-2 border-b border-blue-950/25 bg-[linear-gradient(110deg,#173f68_0%,#245d8f_55%,#1b4b76_100%)] px-3 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.07em] text-white",
        children:[
          (0,t.jsxs)("div",{
            className:"flex items-center gap-2",
            children:[
              (0,t.jsx)("span",{children:"Daily Transactions"}),
              (0,t.jsxs)("span",{className:"rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold normal-case text-blue-100",children:[buyEntries.length," Buy · ",sellEntries.length," Sell"]}),

              // Minimized Multi-Select Account Dropdown (No "Filter by Account" label)
              (0,t.jsxs)("div",{
                className:"relative normal-case",
                children:[
                  (0,t.jsxs)("button",{
                    type:"button",
                    onClick:()=>setAccountDropdownOpen(open=>!open),
                    title:0===selectedAccounts.length?"All Accounts":selectedAccounts.join(", "),
                    className:`inline-flex h-6.5 items-center gap-1.5 rounded border px-2.5 text-[10px] sm:text-[10.5px] font-semibold transition shadow-xs ${selectedAccounts.length>0?"bg-emerald-600 text-white border-emerald-400":"bg-[#163857] text-blue-100 border-blue-400/30 hover:bg-blue-900 hover:text-white"}`,
                    children:[
                      (0,t.jsx)("span",{
                        className:"truncate max-w-[115px]",
                        children:0===selectedAccounts.length?"All Accounts":1===selectedAccounts.length?selectedAccounts[0]:`${selectedAccounts.length} Accounts`
                      }),
                      (0,t.jsx)(V,{className:`h-3 w-3 shrink-0 transition-transform ${accountDropdownOpen?"rotate-180":""}`})
                    ]
                  }),

                  accountDropdownOpen&&(0,t.jsxs)(t.Fragment,{
                    children:[
                      (0,t.jsx)("div",{
                        className:"fixed inset-0 z-40",
                        onClick:()=>setAccountDropdownOpen(false)
                      }),
                      (0,t.jsxs)("div",{
                        className:"absolute left-0 top-full z-50 mt-1 w-52 rounded-lg border border-slate-200 bg-white p-1.5 text-slate-800 shadow-xl",
                        children:[
                          (0,t.jsxs)("div",{
                            className:"flex items-center justify-between border-b border-slate-100 pb-1 mb-1 px-1 text-[9.5px]",
                            children:[
                              (0,t.jsx)("button",{
                                type:"button",
                                onClick:()=>setSelectedAccounts([...allAccountOptions]),
                                className:"font-semibold text-blue-700 hover:underline",
                                children:"All"
                              }),
                              (0,t.jsx)("button",{
                                type:"button",
                                onClick:()=>setSelectedAccounts([]),
                                className:"font-semibold text-slate-500 hover:text-red-600",
                                children:"Reset"
                              })
                            ]
                          }),
                          (0,t.jsx)("div",{
                            className:"max-h-48 overflow-y-auto space-y-0.5",
                            children:allAccountOptions.map(accNum=>{
                              let isChecked=selectedAccounts.includes(accNum);
                              return(0,t.jsxs)("label",{
                                onClick:()=>toggleAccountChoice(accNum),
                                className:`flex items-center justify-between gap-1.5 rounded px-2 py-1 text-[10px] cursor-pointer select-none transition ${isChecked?"bg-emerald-50 text-emerald-900 font-bold":"hover:bg-slate-50 text-slate-700 font-medium"}`,
                                children:[
                                  (0,t.jsxs)("div",{
                                    className:"flex items-center gap-1.5 truncate",
                                      children:[
                                      (0,t.jsx)("input",{
                                        type:"checkbox",
                                        checked:isChecked,
                                        onChange:()=>{},
                                        className:"h-3 w-3 rounded accent-emerald-600 cursor-pointer shrink-0"
                                      }),
                                      (0,t.jsx)("span",{className:"truncate",children:accNum})
                                    ]
                                  })
                                ]
                              },accNum);
                            })
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),

              selectedAccounts.length>0&&(0,t.jsx)("button",{
                type:"button",
                onClick:()=>setSelectedAccounts([]),
                title:"Clear account filter",
                className:"inline-flex h-5 w-5 items-center justify-center rounded bg-white/15 text-blue-100 hover:bg-red-500 hover:text-white transition",
                children:(0,t.jsx)(I,{className:"h-3 w-3"})
              })
            ]
          }),
          (0,t.jsxs)("div",{
            className:"flex flex-wrap items-center justify-end gap-1.5 normal-case",
            children:[
              A?(0,t.jsxs)(t.Fragment,{
                children:[
                  (0,t.jsxs)("div",{
                    className:"flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px]",
                    children:[
                      (0,t.jsx)(ep,{className:"h-3 w-3 text-emerald-300"}),
                      (0,t.jsx)("span",{className:"font-mono font-bold",children:A.symbol}),
                      (0,t.jsxs)("span",{className:"text-blue-100",children:["Buy #",A.id," · ",B(A.remainingQuantity,2)," available"]}),
                      (0,t.jsx)("button",{type:"button",onClick:()=>w(null),className:"ml-1 text-blue-200 hover:text-white",title:"Clear selected Buy",children:(0,t.jsx)(I,{className:"w-3.5 h-3.5"})})
                    ]
                  }),
                  (0,t.jsx)("button",{type:"button",onClick:()=>i(A),className:"rounded bg-amber-500 hover:bg-amber-600 active:scale-95 px-3 py-0.5 text-[10px] font-bold text-white shadow transition",title:"Sell from this Buy lot (vary quantity inside)",children:"Sell"})
                ]
              }):(0,t.jsxs)("span",{className:"mr-1 inline-flex items-center gap-1 text-[10px] font-normal text-blue-100",children:[(0,t.jsx)(ex,{className:"h-3 w-3"}),"Select a Buy row to sell that lot"]}),
              (0,t.jsxs)("button",{
                type:"button",onClick:()=>setShowColPanel(v=>!v),
                className:`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold transition ${showColPanel?"bg-white text-[#1F4E79]":"bg-[#163857] text-white hover:bg-blue-900 border border-blue-400/30"}`,
                title:"Rearrange or customize Daily Transactions columns",
                children:[(0,t.jsx)(ei,{className:"h-3 w-3"}),"Rearrange Columns"]
              })
            ]
          })
        ]
      }),

      showColPanel&&(0,t.jsxs)("div",{
        className:"relative z-20 border-b border-gray-200 bg-slate-50/95 px-2.5 py-1.5 shadow-inner",
        children:[
          (0,t.jsxs)("div",{
            className:"flex flex-wrap items-center justify-between gap-2 mb-1",
            children:[
              (0,t.jsxs)("div",{
                children:[
                  (0,t.jsx)("h3",{className:"text-[9px] sm:text-[9.5px] font-bold text-[#1F4E79]",children:"Rearrange Daily Transactions Columns"}),
                  (0,t.jsx)("p",{className:"text-[7.5px] sm:text-[8px] text-gray-500 leading-tight",children:"Drag cards (or table column headers) or use arrows to rearrange columns for both Buy and Sell tables."})
                ]
              }),
              (0,t.jsxs)("button",{
                type:"button",onClick:()=>{setCols(DAILY_TX_DEFAULT_COLS);try{window.localStorage.removeItem(DAILY_TX_STORAGE_KEY)}catch{}},
                className:"inline-flex items-center gap-1 px-1.5 py-0.5 bg-white hover:bg-gray-100 border border-gray-300 rounded text-[8px] sm:text-[8.5px] font-semibold text-gray-700 shadow-2xs",
                children:[(0,t.jsx)(es,{className:"w-2.5 h-2.5"}),"Reset Default Order"]
              })
            ]
          }),
          (0,t.jsx)("div",{
            className:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1",
            children:cols.map((col,idx)=>(0,t.jsxs)("div",{
              draggable:true,
              onDragStart:()=>setDragColId(col.id),
              onDragOver:ev=>ev.preventDefault(),
              onDrop:()=>{dragColId&&reorderColDrop(dragColId,col.id);setDragColId(null)},
              onDragEnd:()=>setDragColId(null),
              className:`bg-white border rounded px-1.5 py-0.5 flex items-center gap-1 shadow-2xs cursor-grab active:cursor-grabbing ${dragColId===col.id?"border-emerald-500 opacity-60":"border-gray-200"}`,
              children:[
                (0,t.jsx)(et,{className:"w-3 h-3 text-gray-400 shrink-0"}),
                (0,t.jsx)("input",{
                  value:col.label,
                  onChange:ev=>updateColProp(col.id,{label:ev.target.value}),
                  onPointerDown:ev=>ev.stopPropagation(),
                  className:"h-4.5 min-w-0 flex-1 border border-gray-200 rounded px-1 text-[8px] sm:text-[8.5px] font-medium outline-none focus:border-emerald-600 bg-transparent"
                }),
                (0,t.jsxs)("div",{
                  className:"flex items-center",
                  children:[
                    (0,t.jsx)("button",{type:"button",onClick:()=>moveCol(col.id,-1),disabled:idx<=0,className:"p-0.5 text-gray-500 hover:text-gray-900 disabled:opacity-20",title:"Move Left",children:(0,t.jsx)(K,{className:"w-2.5 h-2.5 -rotate-90"})}),
                    (0,t.jsx)("button",{type:"button",onClick:()=>moveCol(col.id,1),disabled:idx>=cols.length-1,className:"p-0.5 text-gray-500 hover:text-gray-900 disabled:opacity-20",title:"Move Right",children:(0,t.jsx)(V,{className:"w-2.5 h-2.5 -rotate-90"})}),
                    (0,t.jsx)("button",{type:"button",onClick:()=>updateColProp(col.id,{visible:!col.visible}),disabled:sellVisibleCols.length<=2&&col.visible,className:"p-0.5 text-gray-500 hover:text-emerald-700 disabled:opacity-20",title:col.visible?"Hide column":"Show column",children:col.visible?(0,t.jsx)(J,{className:"w-2.5 h-2.5 text-emerald-700"}):(0,t.jsx)(Z,{className:"w-2.5 h-2.5 text-gray-400"})})
                  ]
                })
              ]
            },col.id))
          })
        ]
      }),

      // Divided Buy and Sell Tables Container
      (0,t.jsxs)("div",{
        className:"p-3 bg-gray-50/50 space-y-4",
        children:[
          // TABLE 1: BUY TRANSACTIONS
          (0,t.jsxs)("div",{
            className:"rounded-lg border border-emerald-800/25 bg-white shadow-xs overflow-hidden",
            children:[
              (0,t.jsxs)("div",{
                className:"flex items-center justify-between bg-[linear-gradient(110deg,#065f46_0%,#047857_60%,#065f46_100%)] px-3 py-1.5 text-white",
                children:[
                  (0,t.jsxs)("div",{
                    className:"flex items-center gap-2",
                    children:[
                      (0,t.jsx)("span",{className:"text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em]",children:"Buy Transactions"}),
                      (0,t.jsxs)("span",{className:"rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-mono font-bold",children:[buyEntries.length," rows"]})
                    ]
                  }),
                  (0,t.jsxs)("div",{
                    className:"flex items-center gap-2",
                    children:[
                      A?(0,t.jsxs)("div",{
                        className:"flex items-center gap-1.5 normal-case",
                        children:[
                          (0,t.jsxs)("span",{
                            className:"rounded bg-white/20 px-2 py-0.5 text-[9.5px] font-bold text-white flex items-center gap-1",
                            children:[
                              (0,t.jsx)(ep,{className:"h-3 w-3 text-emerald-300"}),
                              `Selected Buy #${A.id} (${A.symbol} · ${B(A.remainingQuantity,2)} avail)`
                            ]
                          }),
                          (0,t.jsx)("button",{
                            type:"button",onClick:()=>i(A),
                            className:"rounded bg-amber-500 hover:bg-amber-600 px-3 py-0.5 text-[9.5px] font-bold text-white shadow transition active:scale-95",
                            title:"Sell from this Buy lot (vary quantity inside)",
                            children:"Sell"
                          }),
                          (0,t.jsx)("button",{
                            type:"button",onClick:()=>w(null),
                            className:"text-emerald-200 hover:text-white p-0.5",title:"Clear selected Buy",
                            children:(0,t.jsx)(I,{className:"h-3 w-3"})
                          })
                        ]
                      }):null,
                      (0,t.jsxs)("button",{
                        type:"button",onClick:()=>o("BUY"),
                        className:"flex items-center gap-1 rounded bg-white text-emerald-900 hover:bg-emerald-50 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-bold shadow-xs transition",
                        children:[(0,t.jsx)(ey,{className:"h-2.5 w-2.5"}),"+ Add Buy"]
                      })
                    ]
                  })
                ]
              }),
              (0,t.jsx)("div",{
                className:"freeze-header-scroll relative isolate w-full max-h-[42vh] overflow-auto bg-white",
                children:(0,t.jsxs)("table",{
                  className:"freeze-header-table table-fixed border-separate border-spacing-0 text-xs",
                  style:{width:buyTotalWidth},
                  children:[
                    (0,t.jsx)("colgroup",{children:buyColWidths.map((w,idx)=>(0,t.jsx)("col",{style:{width:w,minWidth:w,maxWidth:w}},buyVisibleCols[idx]?.id||idx))}),
                    renderTableHead(buyVisibleCols),
                    (0,t.jsx)("tbody",{
                      children:0===buyEntries.length?(0,t.jsx)("tr",{
                        children:(0,t.jsx)("td",{
                          colSpan:buyVisibleCols.length,
                          className:"border border-gray-300 px-4 py-6 text-center text-gray-500 italic bg-white whitespace-nowrap",
                          children:"No Buy transactions match the selected Account filter."
                        })
                      }):buyEntries.map((row,idx)=>renderTransactionRow(row,idx,buyVisibleCols,30))
                    })
                  ]
                })
              })
            ]
          }),

          // TABLE 2: SELL TRANSACTIONS
          (0,t.jsxs)("div",{
            className:"rounded-lg border border-amber-800/25 bg-white shadow-xs overflow-hidden",
            children:[
              (0,t.jsxs)("div",{
                className:"flex items-center justify-between bg-[linear-gradient(110deg,#92400e_0%,#b45309_60%,#92400e_100%)] px-3 py-1.5 text-white",
                children:[
                  (0,t.jsxs)("div",{
                    className:"flex items-center gap-2",
                    children:[
                      (0,t.jsx)("span",{className:"text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em]",children:"Sell Transactions"}),
                      (0,t.jsxs)("span",{className:"rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-mono font-bold",children:[sellEntries.length," rows"]})
                    ]
                  }),
                  (0,t.jsxs)("button",{
                    type:"button",onClick:()=>o("SELL"),
                    className:"flex items-center gap-1 rounded bg-white text-amber-900 hover:bg-amber-50 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-bold shadow-xs transition",
                    children:[(0,t.jsx)(ey,{className:"h-2.5 w-2.5"}),"+ Add Sell"]
                  })
                ]
              }),
              (0,t.jsx)("div",{
                className:"freeze-header-scroll relative isolate w-full max-h-[42vh] overflow-auto bg-white",
                children:(0,t.jsxs)("table",{
                  className:"freeze-header-table table-fixed border-separate border-spacing-0 text-xs",
                  style:{width:sellTotalWidth},
                  children:[
                    (0,t.jsx)("colgroup",{children:sellColWidths.map((w,idx)=>(0,t.jsx)("col",{style:{width:w,minWidth:w,maxWidth:w}},sellVisibleCols[idx]?.id||idx))}),
                    renderTableHead(sellVisibleCols),
                    (0,t.jsx)("tbody",{
                      children:0===sellEntries.length?(0,t.jsx)("tr",{
                        children:(0,t.jsx)("td",{
                          colSpan:sellVisibleCols.length,
                          className:"border border-gray-300 px-4 py-6 text-center text-gray-500 italic bg-white whitespace-nowrap",
                          children:"No Sell transactions match the selected Account filter."
                        })
                      }):sellEntries.map((row,idx)=>renderTransactionRow(row,idx,sellVisibleCols,300))
                    })
                  ]
                })
              })
            ]
          })
        ]
      })
    ]
  })
}let eA={name:"calculator",size:24,node:[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]};eA.node;let eT=i(eA),eC={name:"circle-alert",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],aliases:["alert-circle"]};eC.node;let eE=i(eC),ek={name:"arrow-right",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]};ek.node;let eS=i(ek),eN={name:"loader-circle",size:24,node:[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],aliases:["loader-2"]};eN.node;let e_=i(eN),eO={name:"search",size:24,node:[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]};eO.node;let eI=i(eO);function eF({isOpen:e,onClose:a,accounts:n,initialAccount:s,initialSymbol:o,initialAction:i="BUY",initialQuantity:l,maxQuantity:c,sourceTransactionId:f,initialCostBasis:h,onSubmit:d}){let[u,p]=(0,r.useState)(s||n[0]?.accountNumber||""),[m,g]=(0,r.useState)(i),[b,x]=(0,r.useState)(o||"GOOG"),[v,y]=(0,r.useState)("5"),[w,A]=(0,r.useState)(""),[T,C]=(0,r.useState)(""),[E,k]=(0,r.useState)(null),[S,N]=(0,r.useState)(!1),[_,O]=(0,r.useState)([]),[F,R]=(0,r.useState)(!1),[j,P]=(0,r.useState)(!1),[L,B]=(0,r.useState)(!1),[z,W]=(0,r.useState)(!1),[H,V]=(0,r.useState)(null),[avgCostInput,setAvgCostInput]=(0,r.useState)(""),G=r.default.useRef(0),X=r.default.useCallback(async e=>{let t=e.trim().toUpperCase();if(!t)return;let r=++G.current;N(!0);try{let e=await fetch(`/api/portfolio?symbol=${encodeURIComponent(t)}`),a=await e.json();if(r!==G.current)return;if(!e.ok||"number"!=typeof a?.price)throw Error(a?.error||`No market quote found for ${t}`);k(a.price),A(e=>e||a.price.toString())}catch(e){if(r!==G.current)return;console.warn("Failed to fetch quote",e),k(null)}finally{r===G.current&&N(!1)}},[]);(0,r.useEffect)(()=>{let nextAcc=s||n[0]?.accountNumber||"";let nextSym=(o||"GOOG").trim().toUpperCase();s&&p(s),o&&x(o),i&&g(i),y(void 0!==l?l.toString():"5"),A("");let accObj=n.find(item=>item.accountNumber===nextAcc)||n[0];let matchH=accObj?.holdings.filter(item=>item.symbol.toUpperCase()===nextSym)||[];let totQ=matchH.reduce((sum,item)=>sum+Number(item.quantity),0);let holdAvg=totQ>0?matchH.reduce((sum,item)=>sum+Number(item.quantity)*Number(item.purchasePrice),0)/totQ:null;let initAvg=void 0!==h&&null!==h&&h>0?Number(h).toFixed(2):holdAvg&&holdAvg>0?Number(holdAvg).toFixed(2):"";setAvgCostInput(initAvg),k(null),O([]),R(!1),B(!1),C(""),V(null)},[s,o,i,l,f,e]),(0,r.useEffect)(()=>{if(!e||f)return;let accObj=n.find(item=>item.accountNumber===u)||n[0];let matchH=accObj?.holdings.filter(item=>item.symbol.toUpperCase()===b.trim().toUpperCase())||[];let totQ=matchH.reduce((sum,item)=>sum+Number(item.quantity),0);let holdAvg=totQ>0?matchH.reduce((sum,item)=>sum+Number(item.quantity)*Number(item.purchasePrice),0)/totQ:null;setAvgCostInput(holdAvg&&holdAvg>0?Number(holdAvg).toFixed(2):"")},[u,b,e,f]),(0,r.useEffect)(()=>{let t=b.trim();if(!e||!L||!t)return void O([]);let r=new AbortController,a=window.setTimeout(async()=>{try{P(!0);let e=await fetch(`/api/market-search?q=${encodeURIComponent(t)}`,{signal:r.signal}),a=await e.json();O(a.suggestions||[]),R(!0)}catch(e){"AbortError"!==e.name&&O([])}finally{P(!1)}},250);return()=>{window.clearTimeout(a),r.abort()}},[b,e,L]),(0,r.useEffect)(()=>{if(!b||!e)return;let t=b.trim().toUpperCase();if(!t)return;let r=window.setTimeout(()=>{X(t)},350);return()=>window.clearTimeout(r)},[b,e,X]);let Y=e=>{let t=("string"==typeof e?e:e.symbol).trim().toUpperCase();t&&(x(t),A(""),k(null),R(!1),B(!1),X(t))};if(!e)return null;let K=n.find(e=>e.accountNumber===u)||n[0],q=parseFloat(v)||0,J=parseFloat(w)||(E??0),Q=Number((q*J).toFixed(2)),Z=K?.holdings.filter(e=>e.symbol.toUpperCase()===b.trim().toUpperCase())||[],ee=Z[0],et=Z.reduce((e,t)=>e+Number(t.quantity),0),er=et>0?Z.reduce((e,t)=>e+Number(t.quantity)*Number(t.purchasePrice),0)/et:null,ea=K?.cashAvailable||0,en="BUY"===m,es=en?ea-Q:ea+Q,eo=et,ei=ee?.purchasePrice||J;en?(eo=et+q)>0&&(ei=Number(((et*(ee?.purchasePrice||0)+q*J)/eo).toFixed(4))):eo=Math.max(0,et-q);let parsedAvgCost=parseFloat(avgCostInput),defaultAvgCost=h??er??J,ec="SELL"===m?(Number.isFinite(parsedAvgCost)&&parsedAvgCost>0?parsedAvgCost:defaultAvgCost):J,effOldAvg=er&&er>0?er:ec>0?ec:J,priorHoldInvest=Z.reduce((sum,item)=>{let inv=Number(item.investAmount)||Number(item.quantity)*(Number(item.purchasePrice)||effOldAvg);return sum+inv},0),isCustomAvg=Math.abs((ec||0)-effOldAvg)>0.005,deductAmt=isCustomAvg?q*(ec||0):q*J,rawRemInvest=Number((priorHoldInvest-deductAmt).toFixed(2)),sellNewHoldAvg=eo>0?(rawRemInvest>0?Number((rawRemInvest/eo).toFixed(2)):Number((isCustomAvg?ec:J).toFixed(2))):0,remHoldInvest=Number((eo*sellNewHoldAvg).toFixed(2)),el=E??J,ef="SELL"===m?J-ec:el-ec,eh=Number((ef*q).toFixed(2)),ed=ec>0?Number((ef/ec*100).toFixed(2)):0,eu=async e=>{if(e.preventDefault(),V(null),!u)return void V("Please select an account.");if(!b.trim())return void V("Please enter a stock symbol.");if(q<=0)return void V("Quantity must be greater than zero.");if(J<=0)return void V("Price per share must be greater than zero.");if(f&&void 0!==c&&q>c)return void V(`Only ${c} shares remain in the selected Buy transaction.`);if("SELL"===m&&(!ee||et<q))return void V(`Situation is not possible at this moment: Cannot sell ${q} shares of ${b}. Account ${u} only has ${et} shares.`);try{W(!0),await d({accountNumber:u,action:m,symbol:b.trim().toUpperCase(),quantity:q,pricePerShare:J,averageCost:"SELL"===m?Number((ec||J).toFixed(2)):void 0,costBasisPerShare:"SELL"===m?Number((ec||J).toFixed(2)):J,comments:T.trim(),sourceTransactionId:f}),a()}catch(e){V(e instanceof Error?e.message:"Failed to execute transaction")}finally{W(!1)}};return(0,t.jsx)("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150",children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-xl overflow-hidden flex flex-col",children:[(0,t.jsxs)("div",{className:"bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(eT,{className:"w-5 h-5 text-blue-200"}),(0,t.jsx)("h2",{className:"font-bold text-sm tracking-wide",children:"New Daily Transaction"})]}),(0,t.jsx)("button",{onClick:a,className:"text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition",children:(0,t.jsx)(I,{className:"w-4 h-4"})})]}),(0,t.jsxs)("form",{onSubmit:eu,className:"p-5 space-y-4 text-xs overflow-y-auto max-h-[85vh]",children:[H&&(0,t.jsxs)("div",{className:"p-3 bg-red-50 border border-red-300 rounded text-red-700 flex items-start gap-2",children:[(0,t.jsx)(eE,{className:"w-4 h-4 shrink-0 mt-0.5"}),(0,t.jsx)("span",{children:H})]}),f&&(0,t.jsxs)("div",{className:"p-3 bg-amber-50 border border-amber-300 rounded text-amber-900 flex items-start justify-between gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"font-bold",children:["Selling selected Buy #",f]}),(0,t.jsxs)("div",{className:"text-[10px] mt-0.5",children:[b," · ",u," · Maximum ",c," shares"]})]}),(0,t.jsx)("button",{type:"button",onClick:()=>void 0!==c&&y(c.toString()),className:"shrink-0 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold",children:"Use Full Quantity"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1.5 uppercase tracking-wide text-[11px]",children:"Order Type / Action"}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,t.jsx)("button",{type:"button",onClick:()=>g("BUY"),disabled:!!f,className:`py-2 px-3 rounded font-bold text-center border transition disabled:opacity-40 disabled:cursor-not-allowed ${"BUY"===m?"bg-emerald-600 text-white border-emerald-700 shadow":"bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`,children:"BUY (Add Shares, Deduct Cash)"}),(0,t.jsx)("button",{type:"button",onClick:()=>g("SELL"),disabled:!!f,className:`py-2 px-3 rounded font-bold text-center border transition disabled:opacity-70 disabled:cursor-not-allowed ${"SELL"===m?"bg-amber-600 text-white border-amber-700 shadow":"bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`,children:"SELL (Reduce Shares, Add Cash)"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Account (Linked)"}),(0,t.jsx)("select",{value:u,onChange:e=>p(e.target.value),disabled:!!f,className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] focus:bg-white outline-none disabled:bg-gray-100 disabled:text-gray-600",children:n.map(e=>(0,t.jsxs)("option",{value:e.accountNumber,children:[e.accountNumber," (",e.accountName,") — Cash: ",D(e.cashAvailable).text]},e.accountNumber))})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Stock Symbol"}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(eI,{className:"absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"}),(0,t.jsx)("input",{type:"text",value:b,disabled:!!f,onFocus:()=>{B(!0),b.trim()&&R(!0)},onBlur:()=>{window.setTimeout(()=>{B(!1),R(!1)},150)},onChange:e=>{x(e.target.value.toUpperCase()),O([]),k(null),A(""),R(!0)},onKeyDown:e=>{if("Enter"===e.key){e.preventDefault(),e.stopPropagation();let t=_.find(e=>e.symbol.toUpperCase()===b.trim().toUpperCase());t||_[0]?Y(t||_[0]):!j&&b.trim()&&Y(b)}"Escape"===e.key&&R(!1)},placeholder:"Type ticker or company name",className:"w-full bg-gray-50 border border-gray-300 rounded py-2 pl-8 pr-8 font-mono font-bold text-xs uppercase focus:ring-2 focus:ring-[#1F4E79] focus:bg-white outline-none disabled:bg-gray-100 disabled:text-gray-600",role:"combobox","aria-autocomplete":"list","aria-expanded":F,autoComplete:"off",required:!0}),j&&(0,t.jsx)(e_,{className:"absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin"})]}),F&&_.length>0&&(0,t.jsx)("div",{className:"absolute z-50 left-0 right-0 top-[55px] bg-white border border-gray-300 rounded shadow-xl max-h-56 overflow-y-auto",children:_.map(e=>(0,t.jsxs)("button",{type:"button",onMouseDown:e=>e.preventDefault(),onClick:()=>Y(e),className:"w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between gap-2",children:[(0,t.jsx)("span",{className:"font-mono font-black text-xs text-blue-900",children:e.symbol}),(0,t.jsx)("span",{className:"text-[9px] text-gray-400 whitespace-nowrap",children:e.exchange})]}),(0,t.jsxs)("div",{className:"text-[10px] text-gray-600 truncate",children:[e.name," · ",e.quoteType]})]},`${e.symbol}-${e.exchange}`))}),(0,t.jsx)("div",{className:"flex flex-wrap gap-1 mt-1 text-[10px]",children:["GOOG","NFLX","SOXL","NVDA","AAPL","MSFT","AMZN"].map(e=>(0,t.jsx)("button",{type:"button",onClick:()=>Y(e),className:"px-1.5 py-0.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-800 rounded border border-gray-200",children:e},e))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Live Market Quote"}),(0,t.jsx)("div",{className:"bg-blue-50 border border-blue-200 rounded p-2 text-xs",children:S?(0,t.jsx)("span",{className:"text-gray-500 italic",children:"Pulling quote..."}):null!==E?(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("span",{className:"font-mono font-bold text-blue-900 text-sm",children:["$",E.toFixed(2)]}),(0,t.jsx)("button",{type:"button",onClick:()=>A(E.toFixed(2)),className:"text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-medium px-1.5 py-0.5 rounded shadow-xs",children:"Use Live Price"})]}):(0,t.jsx)("span",{className:"text-gray-400",children:"Enter symbol"})})]})]}),"SELL"===m&&(0,t.jsxs)("div",{className:"flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-2 text-[11px]",children:[(0,t.jsx)("div",{className:"font-semibold text-blue-950",children:"Average Cost"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("span",{className:"font-mono text-xs font-bold text-blue-900",children:"$"}),(0,t.jsx)("input",{type:"number",step:"any",min:"0.0001",value:avgCostInput,onChange:e=>setAvgCostInput(e.target.value),placeholder:"0.00",className:"w-28 bg-white border border-blue-300 rounded px-2 py-1 text-right font-mono text-sm font-black text-blue-950 focus:ring-2 focus:ring-[#1F4E79] outline-none"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Quantity"}),(0,t.jsx)("input",{type:"number",step:"any",min:"0.0001",max:f&&void 0!==c?c:void 0,value:v,onChange:e=>y(e.target.value),placeholder:"Quantity",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] focus:bg-white outline-none",required:!0}),"SELL"===m&&(0,t.jsxs)("div",{className:"mt-1 text-[10px] text-gray-600",children:[f?"Selected Buy available:":"Currently owned:"," ",(0,t.jsxs)("button",{type:"button",onClick:()=>y(f&&void 0!==c?c.toString():et.toString()),className:"font-bold text-blue-600 underline",children:[f&&void 0!==c?c:et," shares"]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Price Per Share ($)"}),(0,t.jsx)("input",{type:"number",step:"any",min:"0.01",value:w,onChange:e=>A(e.target.value),placeholder:"e.g. 335.31",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] focus:bg-white outline-none",required:!0})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Comments (optional)"}),(0,t.jsx)("input",{type:"text",value:T,onChange:e=>C(e.target.value),placeholder:"e.g. Lot 2 rebalance, Dip buy, Stop loss",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] focus:bg-white outline-none"})]}),(0,t.jsxs)("div",{className:"bg-[#F0F7FF] border border-[#1F69C1]/40 rounded-lg p-3 space-y-2",children:[(0,t.jsxs)("div",{className:"font-bold text-[#1F4E79] flex items-center justify-between text-xs border-b border-blue-200 pb-1",children:[(0,t.jsx)("span",{children:"Automatic Consolidated Link Simulation"}),(0,t.jsxs)("span",{className:"font-mono text-emerald-800 font-extrabold",children:["Total: ",D(Q).text]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-2 text-[11px]",children:[(0,t.jsxs)("div",{className:"bg-white p-2 rounded border border-gray-200 shadow-xs",children:[(0,t.jsx)("span",{className:"text-gray-500 block",children:"Cash Balance Impact:"}),(0,t.jsxs)("div",{className:"flex items-center gap-1 font-mono font-bold mt-0.5",children:[(0,t.jsx)("span",{children:D(ea).text}),(0,t.jsx)(eS,{className:"w-3 h-3 text-gray-400"}),(0,t.jsx)("span",{className:en?"text-red-600":"text-emerald-700",children:D(es).text})]}),(0,t.jsx)("span",{className:"text-[10px] text-gray-400",children:en?`Deduct ${D(Q).text}`:`Add ${D(Q).text}`})]}),(0,t.jsxs)("div",{className:"bg-white p-2 rounded border border-gray-200 shadow-xs",children:[(0,t.jsxs)("span",{className:"text-gray-500 block",children:["Holding Impact (",b,"):"]}),"BUY"===m?ee?(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"font-mono font-bold text-blue-900 mt-0.5",children:[et," → ",eo," shares"]}),(0,t.jsxs)("div",{className:"text-[10px] text-gray-600",children:["New Avg: $",ei.toFixed(2),"/sh"]})]}):(0,t.jsxs)("div",{className:"text-emerald-700 font-bold mt-0.5",children:["New record: ",q," shares @ $",J.toFixed(2)]}):(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"font-mono font-bold text-amber-900 mt-0.5",children:[et," → ",eo," shares"]}),(0,t.jsx)("div",{className:"text-[10px] text-gray-600",children:0===eo?"Position closed":`New Avg: ${sellNewHoldAvg.toFixed(2)}/sh · Inv: ${remHoldInvest.toFixed(2)}`})]})]})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between pt-1 text-[11px] text-gray-600",children:[(0,t.jsx)("span",{children:"SELL"===m?"Realized Sell Gain/Loss:":"Unrealized Buy Gain/Loss:"}),(0,t.jsx)("span",{className:"font-mono",children:(0,t.jsxs)("span",{className:eh>=0?"text-emerald-700 font-bold":"text-red-600 font-bold",children:"SELL"===m?[M(eh).text," (",U(ed).text,") · Avg Cost: ",D(ec).text]:[M(eh).text," (",U(ed).text,")"]})})]})]}),(0,t.jsxs)("div",{className:"flex items-center justify-end gap-2 pt-2 border-t border-gray-200",children:[(0,t.jsx)("button",{type:"button",onClick:a,className:"px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium transition",children:"Cancel"}),(0,t.jsx)("button",{type:"submit",disabled:z,className:`px-5 py-2 rounded text-white font-bold transition shadow ${"BUY"===m?"bg-emerald-600 hover:bg-emerald-700":"bg-amber-600 hover:bg-amber-700"} ${z?"opacity-50 cursor-not-allowed":""}`,children:z?"Executing Order...":`Execute ${m} Order`})]})]})]})})}let eR={name:"pen-line",size:24,node:[["path",{d:"M13 21h8",key:"1jsn5i"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],aliases:["edit-3"]};eR.node;let ej=i(eR);function eP({isOpen:e,onClose:a,entry:n,accountNumbers:s,onSubmit:o}){let[i,l]=(0,r.useState)(""),[c,f]=(0,r.useState)("BUY"),[h,d]=(0,r.useState)(""),[u,p]=(0,r.useState)(""),[m,g]=(0,r.useState)(""),[b,x]=(0,r.useState)(""),[v,y]=(0,r.useState)(""),[epAvgCost,setEpAvgCost]=(0,r.useState)(""),[w,A]=(0,r.useState)(!1),[T,C]=(0,r.useState)(null);if((0,r.useEffect)(()=>{n&&(l(n.accountNumber),f("SELL"===n.action.toUpperCase()?"SELL":"BUY"),d(n.symbol),p(n.quantity.toString()),g(n.pricePerShare.toString()),setEpAvgCost(String(n.averageCost??n.costBasisPerShare??n.pricePerShare)),x(n.comments||""),n.dateTime&&y(new Date(n.dateTime).toISOString().slice(0,16)))},[n,e]),!e||!n)return null;let E=parseFloat(u)||0,k=parseFloat(m)||0,S=Number((E*k).toFixed(2)),N=async e=>{if(e.preventDefault(),C(null),E<=0)return void C("Quantity must be greater than zero.");if(k<=0)return void C("Price per share must be greater than zero.");try{A(!0),await o({id:n.id,accountNumber:i,action:c,symbol:h.trim().toUpperCase(),quantity:E,pricePerShare:k,averageCost:parseFloat(epAvgCost)||k,costBasisPerShare:parseFloat(epAvgCost)||k,comments:b.trim(),dateTime:v?new Date(v).toISOString():void 0}),a()}catch(e){C(e instanceof Error?e.message:"Failed to update future investment")}finally{A(!1)}};return(0,t.jsx)("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150",children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden flex flex-col",children:[(0,t.jsxs)("div",{className:"bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(ej,{className:"w-5 h-5 text-blue-200"}),(0,t.jsxs)("h2",{className:"font-bold text-sm tracking-wide",children:["Edit Daily Transaction #",n.id," (",n.symbol,")"]})]}),(0,t.jsx)("button",{onClick:a,className:"text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition",children:(0,t.jsx)(I,{className:"w-4 h-4"})})]}),(0,t.jsxs)("form",{onSubmit:N,className:"p-5 space-y-4 text-xs",children:[T&&(0,t.jsxs)("div",{className:"p-3 bg-red-50 border border-red-300 rounded text-red-700 flex items-start gap-2",children:[(0,t.jsx)(eE,{className:"w-4 h-4 shrink-0 mt-0.5"}),(0,t.jsx)("span",{children:T})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Account"}),(0,t.jsx)("select",{value:i,onChange:e=>l(e.target.value),className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none",children:s.map(e=>(0,t.jsx)("option",{value:e,children:e},e))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Action (Buy / Sell)"}),(0,t.jsxs)("select",{value:c,onChange:e=>f(e.target.value),className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs font-bold focus:ring-2 focus:ring-[#1F4E79] outline-none",children:[(0,t.jsx)("option",{value:"BUY",children:"BUY"}),(0,t.jsx)("option",{value:"SELL",children:"SELL"})]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Symbol"}),(0,t.jsx)("input",{type:"text",value:h,onChange:e=>d(e.target.value.toUpperCase()),className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono font-bold text-xs uppercase focus:ring-2 focus:ring-[#1F4E79] outline-none",required:!0})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Date / Time"}),(0,t.jsx)("input",{type:"datetime-local",value:v,onChange:e=>y(e.target.value),className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3 bg-blue-50/60 p-3 rounded border border-blue-200",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-blue-900 font-bold mb-1",children:"Quantity"}),(0,t.jsx)("input",{type:"number",step:"any",min:"0.0001",value:u,onChange:e=>p(e.target.value),placeholder:"e.g. 10",className:"w-full bg-white border border-blue-300 rounded p-2 font-mono font-bold text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none shadow-inner",required:!0})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-blue-900 font-bold mb-1",children:"Price Per Share ($)"}),(0,t.jsx)("input",{type:"number",step:"any",min:"0.01",value:m,onChange:e=>g(e.target.value),placeholder:"e.g. 117.28",className:"w-full bg-white border border-blue-300 rounded p-2 font-mono font-bold text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none shadow-inner",required:!0})]}),(0,t.jsxs)("div",{className:"col-span-2 pt-1 text-right text-gray-700 font-mono text-xs",children:["Recalculated Total Amount:"," ",(0,t.jsx)("span",{className:"font-bold text-emerald-800",children:D(S).text})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Comments"}),(0,t.jsx)("input",{type:"text",value:b,onChange:e=>x(e.target.value),placeholder:"e.g. Lot rebalance, Option execution",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"})]}),(0,t.jsxs)("div",{className:"flex items-center justify-end gap-2 pt-3 border-t border-gray-200",children:[(0,t.jsx)("button",{type:"button",onClick:a,className:"px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium transition",children:"Cancel"}),(0,t.jsx)("button",{type:"submit",disabled:w,className:"px-5 py-2 bg-[#1F4E79] hover:bg-[#163857] text-white rounded font-bold transition shadow",children:w?"Saving...":"Save Changes"})]})]})]})})}let eL={name:"dollar-sign",size:24,node:[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]};eL.node;let eD=i(eL);function eM({isOpen:e,onClose:a,holdingToEdit:n,defaultAccountNumber:s,accountNumbers:o,onSubmit:i}){let[l,c]=(0,r.useState)(""),[f,h]=(0,r.useState)(""),[d,u]=(0,r.useState)(""),[p,m]=(0,r.useState)(""),[g,b]=(0,r.useState)(""),[x,v]=(0,r.useState)(""),[y,w]=(0,r.useState)(""),[A,T]=(0,r.useState)(!1),[C,E]=(0,r.useState)(null),k=o[0]||"",S=n?.id;if((0,r.useEffect)(()=>{e&&(n?(c(n.accountNumber),h(n.symbol),u(n.quantity.toString()),m(n.purchasePrice.toString()),b(n.currentPrice.toString()),v(n.comments||""),w(n.highlight||"")):(c(s||k),h(""),u(""),m(""),b(""),v(""),w("")),E(null))},[e,S,s,k]),!e)return null;let N=async e=>{e.preventDefault(),E(null);let t=parseFloat(d),r=parseFloat(p),s=g?parseFloat(g):void 0;if(!l)return void E("Please select an account.");if(!f.trim())return void E("Please enter a stock symbol.");if(isNaN(t)||t<=0)return void E("Quantity must be greater than zero.");if(isNaN(r)||r<0)return void E("Purchase price must be non-negative.");try{T(!0),await i({id:n?.id,accountNumber:l,symbol:f.trim().toUpperCase(),quantity:t,purchasePrice:r,currentPrice:s,comments:x.trim(),highlight:y}),a()}catch(e){E(e instanceof Error?e.message:"Failed to save holding")}finally{T(!1)}};return(0,t.jsx)("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150",children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md overflow-hidden",children:[(0,t.jsxs)("div",{className:"bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(eD,{className:"w-5 h-5 text-blue-200"}),(0,t.jsx)("h2",{className:"font-bold text-sm tracking-wide",children:n?`Edit Inventory Holding (${n.symbol})`:"Add Consolidated View Holding"})]}),(0,t.jsx)("button",{onClick:a,className:"text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition",children:(0,t.jsx)(I,{className:"w-4 h-4"})})]}),(0,t.jsxs)("form",{onSubmit:N,className:"p-5 space-y-3.5 text-xs",children:[C&&(0,t.jsxs)("div",{className:"p-2.5 bg-red-50 border border-red-300 rounded text-red-700 flex items-center gap-2",children:[(0,t.jsx)(eE,{className:"w-4 h-4 shrink-0"}),(0,t.jsx)("span",{children:C})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Account"}),(0,t.jsx)("select",{value:l,onChange:e=>c(e.target.value),className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs font-semibold focus:ring-2 focus:ring-[#1F4E79] outline-none",children:o.map(e=>(0,t.jsx)("option",{value:e,children:e},e))})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Symbol"}),(0,t.jsx)("input",{type:"text",value:f,onChange:e=>h(e.target.value.toUpperCase()),placeholder:"e.g. GOOG, NFLX",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono font-bold text-xs uppercase focus:ring-2 focus:ring-[#1F4E79] outline-none",required:!0})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Quantity"}),(0,t.jsx)("input",{type:"number",step:"any",min:"0.0001",value:d,onChange:e=>u(e.target.value),placeholder:"e.g. 5",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none",required:!0})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Avg Price ($)"}),(0,t.jsx)("input",{type:"number",step:"any",min:"0.01",value:p,onChange:e=>m(e.target.value),placeholder:"e.g. 385.14",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none",required:!0})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Current Price ($)"}),(0,t.jsx)("input",{type:"number",step:"any",value:g,onChange:e=>b(e.target.value),placeholder:"Auto-fetched if blank",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Comments"}),(0,t.jsx)("input",{type:"text",value:x,onChange:e=>v(e.target.value),placeholder:"e.g. Heavy Loss, Long term, Core position",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Highlight Row"}),(0,t.jsxs)("select",{value:y,onChange:e=>w(e.target.value),className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none",children:[(0,t.jsx)("option",{value:"",children:"None (Standard White)"}),(0,t.jsx)("option",{value:"yellow",children:"Yellow Highlight (as seen in screenshot)"})]})]}),(0,t.jsxs)("div",{className:"flex items-center justify-end gap-2 pt-3 border-t border-gray-200",children:[(0,t.jsx)("button",{type:"button",onClick:a,className:"px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium transition",children:"Cancel"}),(0,t.jsx)("button",{type:"submit",disabled:A,className:"px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold transition shadow",children:A?"Saving...":"Save Holding"})]})]})]})})}let eU={name:"layers",size:24,node:[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],aliases:["layers-3"]};eU.node;let eB=i(eU);function e$({isOpen:e,onClose:a,accountToEdit:n,onSubmit:s}){let[o,i]=(0,r.useState)(""),[l,c]=(0,r.useState)(""),[f,h]=(0,r.useState)(""),[d,u]=(0,r.useState)(""),[p,m]=(0,r.useState)(!1),[g,b]=(0,r.useState)(null);if((0,r.useEffect)(()=>{n?(i(n.accountNumber),c(n.accountName),h(n.cashAvailable.toString()),u(n.comments||"")):(i(""),c(""),h("10000.00"),u(""))},[n,e]),!e)return null;let x=async e=>{e.preventDefault(),b(null);let t=parseFloat(f);if(!o.trim())return void b("Account number is required (e.g. CS - 9271).");if(isNaN(t))return void b("Valid cash balance is required.");try{m(!0),await s({id:n?.id,accountNumber:o.trim(),accountName:l.trim()||o.trim(),cashAvailable:t,comments:d.trim()}),a()}catch(e){b(e instanceof Error?e.message:"Failed to save account")}finally{m(!1)}};return(0,t.jsx)("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150",children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md overflow-hidden",children:[(0,t.jsxs)("div",{className:"bg-[#1F4E79] text-white px-5 py-3 flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(eB,{className:"w-5 h-5 text-blue-200"}),(0,t.jsx)("h2",{className:"font-bold text-sm tracking-wide",children:n?`Edit Account (${n.accountNumber})`:"Create New Investment Account"})]}),(0,t.jsx)("button",{onClick:a,className:"text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition",children:(0,t.jsx)(I,{className:"w-4 h-4"})})]}),(0,t.jsxs)("form",{onSubmit:x,className:"p-5 space-y-3.5 text-xs",children:[g&&(0,t.jsxs)("div",{className:"p-2.5 bg-red-50 border border-red-300 rounded text-red-700 flex items-center gap-2",children:[(0,t.jsx)(eE,{className:"w-4 h-4 shrink-0"}),(0,t.jsx)("span",{children:g})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Account Identifier (Linked ID)"}),(0,t.jsx)("input",{type:"text",value:o,onChange:e=>i(e.target.value),placeholder:"e.g. CS - 9271, CS - 9538, CS - 1042",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono font-bold text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none",required:!0}),(0,t.jsx)("p",{className:"text-[10px] text-gray-500 mt-0.5",children:"Used to link Account's Summary, Consolidated View - Account Level, and Daily Transactions."})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Account Full Name"}),(0,t.jsx)("input",{type:"text",value:l,onChange:e=>c(e.target.value),placeholder:"e.g. CS - 9271",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Cash Balance ($)"}),(0,t.jsx)("input",{type:"number",step:"any",value:f,onChange:e=>h(e.target.value),placeholder:"e.g. 64205.80",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 font-mono text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none",required:!0})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-gray-700 font-bold mb-1",children:"Comments (optional)"}),(0,t.jsx)("input",{type:"text",value:d,onChange:e=>u(e.target.value),placeholder:"e.g. Brokerage IRA, Taxable, Active Day Trading",className:"w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs focus:ring-2 focus:ring-[#1F4E79] outline-none"})]}),(0,t.jsxs)("div",{className:"flex items-center justify-end gap-2 pt-3 border-t border-gray-200",children:[(0,t.jsx)("button",{type:"button",onClick:a,className:"px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium transition",children:"Cancel"}),(0,t.jsx)("button",{type:"submit",disabled:p,className:"px-5 py-2 bg-[#1F4E79] hover:bg-[#163857] text-white rounded font-bold transition shadow",children:p?"Saving...":"Save Account"})]})]})]})})}let ez={name:"arrow-down-right",size:24,node:[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]]};ez.node;let eW=i(ez),eH={name:"arrow-up-right",size:24,node:[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]};eH.node;let eV=i(eH),eG={name:"trash",size:24,node:[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],aliases:["trash-2"]};eG.node;let eX=i(eG),eY={name:"trending-up",size:24,node:[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]};eY.node;let eK=i(eY);function eq({onQuickTrade:e,defaultAccount:a,onRefresh:n,isRefreshing:s}){let[o,i]=r.default.useState([]),[l,c]=r.default.useState({}),[f,h]=r.default.useState(!0),[d,u]=r.default.useState(""),[p,m]=r.default.useState([]),[g,b]=r.default.useState(!1),[x,v]=r.default.useState(!1),[y,w]=r.default.useState(!1),[A,C]=r.default.useState(null),E=r.default.useCallback(async e=>{if(0===e.length){c({}),h(!1);return}h(!0);let t=await Promise.all(e.map(async e=>{try{let t=await fetch(`/api/portfolio?symbol=${encodeURIComponent(e.symbol)}`);if(!t.ok)return[e.symbol,null];let r=await t.json();return[e.symbol,r]}catch{return[e.symbol,null]}})),r={};for(let[e,a]of t)a&&(r[e]=a);c(r),h(!1)},[]),k=r.default.useCallback(async()=>{try{h(!0);let e=await fetch("/api/watchlist",{cache:"no-store"}),t=await e.json();if(!e.ok)throw Error(t.error||"Unable to load watchlist");let r=t.items||[];i(r),await E(r)}catch(e){C(e instanceof Error?e.message:"Unable to load watchlist"),h(!1)}},[E]);r.default.useEffect(()=>{k()},[k]),r.default.useEffect(()=>{let e=window.setInterval(()=>E(o),6e4);return()=>window.clearInterval(e)},[o,E]),r.default.useEffect(()=>{let e=d.trim();if(!e){m([]),b(!1);return}let t=new AbortController,r=window.setTimeout(async()=>{try{v(!0);let r=await fetch(`/api/market-search?q=${encodeURIComponent(e)}`,{signal:t.signal}),a=await r.json();m(a.suggestions||[]),b(!0)}catch(e){"AbortError"!==e.name&&m([])}finally{v(!1)}},250);return()=>{window.clearTimeout(r),t.abort()}},[d]);let S=async e=>{let t=(e||d).trim().toUpperCase();if(t)try{w(!0),C(null);let e=await fetch("/api/watchlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({symbol:t})}),r=await e.json();if(!e.ok)throw Error(r.error||"Unable to add symbol");u(""),m([]),b(!1),await k()}catch(e){C(e instanceof Error?e.message:"Unable to add symbol")}finally{w(!1)}},N=async e=>{try{C(null);let t=await fetch(`/api/watchlist?symbol=${encodeURIComponent(e)}`,{method:"DELETE"}),r=await t.json();if(!t.ok)throw Error(r.error||"Unable to remove symbol");let a=o.filter(t=>t.symbol!==e);i(a),c(t=>{let r={...t};return delete r[e],r})}catch(e){C(e instanceof Error?e.message:"Unable to remove symbol")}},_=async()=>{n(),await E(o)};return(0,t.jsxs)("div",{className:"section-font-market p-3 sm:p-4 space-y-4 bg-gray-50/70 min-h-[calc(100vh-150px)]",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded border border-gray-300 shadow-xs",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("h2",{className:"text-base font-bold text-[#1F4E79] flex items-center gap-2",children:[(0,t.jsx)(eK,{className:"w-5 h-5 text-emerald-600"}),(0,t.jsx)("span",{children:"Market Data & Watch"})]}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-0.5",children:"Add any supported market symbol. Quotes refresh automatically every 60 seconds."})]}),(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-2",children:[(0,t.jsxs)("div",{className:"relative w-72 max-w-[75vw]",children:[(0,t.jsxs)("div",{className:"flex items-center bg-white border border-gray-300 rounded shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600/30 focus-within:border-emerald-600",children:[(0,t.jsx)(eI,{className:"w-3.5 h-3.5 ml-2.5 text-gray-400 shrink-0"}),(0,t.jsx)("input",{type:"text",value:d,onChange:e=>{u(e.target.value.toUpperCase()),m([])},onFocus:()=>d.trim()&&b(!0),onKeyDown:e=>{"Enter"===e.key&&(e.preventDefault(),S(p[0]?.symbol)),"Escape"===e.key&&b(!1)},placeholder:"Add symbol or company...",className:"min-w-0 flex-1 px-2 py-1.5 text-xs font-mono font-semibold outline-none uppercase","aria-label":"Add market watch symbol",autoComplete:"off"}),x&&(0,t.jsx)(e_,{className:"w-3.5 h-3.5 mr-2 text-gray-400 animate-spin"}),(0,t.jsxs)("button",{type:"button",onClick:()=>S(p[0]?.symbol),disabled:y||!d.trim(),className:"self-stretch inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 text-xs font-semibold disabled:opacity-50",children:[y?(0,t.jsx)(e_,{className:"w-3.5 h-3.5 animate-spin"}):(0,t.jsx)(L,{className:"w-3.5 h-3.5"}),"Add"]})]}),g&&p.length>0&&(0,t.jsx)("div",{className:"absolute z-40 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-xl overflow-hidden max-h-72 overflow-y-auto",children:p.map(e=>(0,t.jsxs)("button",{type:"button",onMouseDown:e=>e.preventDefault(),onClick:()=>S(e.symbol),className:"w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-emerald-50 border-b border-gray-100 last:border-b-0",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"font-mono font-bold text-xs text-gray-900",children:e.symbol}),(0,t.jsx)("span",{className:"ml-2 text-xs text-gray-600 truncate",children:e.name})]}),(0,t.jsx)("span",{className:"text-[10px] text-gray-400 whitespace-nowrap",children:e.exchange})]},`${e.symbol}-${e.exchange}`))})]}),(0,t.jsxs)("button",{type:"button",onClick:_,disabled:f||s,className:"flex items-center gap-1.5 bg-[#1F4E79] hover:bg-[#163857] text-white px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition disabled:opacity-60",children:[(0,t.jsx)(T,{className:`w-3.5 h-3.5 ${f||s?"animate-spin":""}`}),(0,t.jsx)("span",{children:f?"Fetching...":"Refresh Quotes"})]})]})]}),A&&(0,t.jsx)("div",{className:"bg-red-50 border border-red-300 text-red-700 rounded px-3 py-2 text-xs",children:A}),0!==o.length||f?(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3",children:o.map(r=>{let n=l[r.symbol],s=n?.price,o=n?.change??0,i=n?.changePercent??0,c=o>=0;return(0,t.jsxs)("div",{className:"bg-white border border-gray-200 rounded p-3.5 shadow-xs hover:shadow transition hover:border-[#1F4E79]/40 flex flex-col justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-start justify-between gap-2",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"font-mono font-black text-sm text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-300",children:r.symbol}),(0,t.jsx)("h3",{className:"text-xs font-semibold text-gray-700 mt-1.5 truncate",title:r.name,children:r.name}),(0,t.jsxs)("span",{className:"text-[10px] text-gray-400",children:[r.exchange||"Market"," · ",r.quoteType||"Security"]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsxs)("span",{className:`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded ${c?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`,children:[c?(0,t.jsx)(eV,{className:"w-3 h-3 mr-0.5"}):(0,t.jsx)(eW,{className:"w-3 h-3 mr-0.5"}),U(i).text]}),(0,t.jsx)("button",{type:"button",onClick:()=>N(r.symbol),className:"p-1 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded",title:`Remove ${r.symbol} from watchlist`,children:(0,t.jsx)(eX,{className:"w-3.5 h-3.5"})})]})]}),(0,t.jsx)("div",{className:"mt-3 font-mono font-black text-lg text-gray-900",children:void 0!==s?D(s).text:"Loading..."}),(0,t.jsxs)("div",{className:"text-[11px] font-mono text-gray-500",children:["Change:"," ",(0,t.jsxs)("span",{className:c?"text-emerald-700 font-bold":"text-red-600 font-bold",children:[o>0?"+":"",D(o).text]})]})]}),(0,t.jsxs)("div",{className:"mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1.5",children:[(0,t.jsx)("button",{onClick:()=>e(a,r.symbol,"BUY"),className:"flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded text-[11px] transition text-center",children:"Buy"}),(0,t.jsx)("button",{onClick:()=>e(a,r.symbol,"SELL"),className:"flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-2 rounded text-[11px] transition text-center",children:"Sell"})]})]},r.symbol)})}):(0,t.jsx)("div",{className:"bg-white border border-dashed border-gray-300 rounded p-12 text-center text-sm text-gray-500",children:"Your watchlist is empty. Search for a symbol above to add it."})]})}let eJ={name:"wallet",size:24,node:[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]};eJ.node;let eQ=i(eJ),eZ={name:"chart-pie",size:24,node:[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]],aliases:["pie-chart"]};eZ.node;let e0=i(eZ),e1={name:"chart-no-axes-column",size:24,node:[["path",{d:"M5 21v-6",key:"1hz6c0"}],["path",{d:"M12 21V3",key:"1lcnhd"}],["path",{d:"M19 21V9",key:"unv183"}]],aliases:["bar-chart-2"]};e1.node;let e2=i(e1);function e3({accounts:e,grandTotal:r}){let a=e.flatMap(e=>e.holdings),n=r.accountOverallMoney||1,s=(r.cashAvailable/n*100).toFixed(1),o=(r.investmentCurrent/n*100).toFixed(1);return(0,t.jsxs)("div",{className:"p-4 space-y-5 bg-gray-50/70 min-h-[500px]",children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",children:[(0,t.jsxs)("div",{className:"bg-white p-3.5 rounded border border-gray-200 shadow-xs",children:[(0,t.jsx)("span",{className:"text-[10px] font-bold text-gray-500 uppercase tracking-wider block",children:"Account Value"}),(0,t.jsx)("div",{className:"font-mono font-black text-lg text-gray-900 mt-1",children:D(r.accountOverallMoney).text}),(0,t.jsx)("span",{className:"text-[10px] text-gray-400",children:"Total Net Worth"})]}),(0,t.jsxs)("div",{className:"bg-white p-3.5 rounded border border-gray-200 shadow-xs",children:[(0,t.jsx)("span",{className:"text-[10px] font-bold text-gray-500 uppercase tracking-wider block",children:"Cash Balance"}),(0,t.jsx)("div",{className:"font-mono font-black text-lg text-emerald-700 mt-1",children:D(r.cashAvailable).text}),(0,t.jsxs)("span",{className:"text-[10px] text-gray-400",children:[s,"% of total"]})]}),(0,t.jsxs)("div",{className:"bg-white p-3.5 rounded border border-gray-200 shadow-xs",children:[(0,t.jsx)("span",{className:"text-[10px] font-bold text-gray-500 uppercase tracking-wider block",children:"Amount Invested"}),(0,t.jsx)("div",{className:"font-mono font-black text-lg text-gray-900 mt-1",children:D(r.amountInvested).text}),(0,t.jsx)("span",{className:"text-[10px] text-gray-400",children:"Cost Basis"})]}),(0,t.jsxs)("div",{className:"bg-white p-3.5 rounded border border-gray-200 shadow-xs",children:[(0,t.jsx)("span",{className:"text-[10px] font-bold text-gray-500 uppercase tracking-wider block",children:"Investment - Current Value"}),(0,t.jsx)("div",{className:"font-mono font-black text-lg text-blue-900 mt-1",children:D(r.investmentCurrent).text}),(0,t.jsxs)("span",{className:"text-[10px] text-gray-400",children:[o,"% of total"]})]}),(0,t.jsxs)("div",{className:"bg-white p-3.5 rounded border border-gray-200 shadow-xs",children:[(0,t.jsx)("span",{className:"text-[10px] font-bold text-gray-500 uppercase tracking-wider block",children:"Total Gain/Loss"}),(0,t.jsx)("div",{className:`font-mono font-black text-lg mt-1 ${r.gainLoss<0?"text-red-600":"text-emerald-700"}`,children:D(r.gainLoss).text}),(0,t.jsx)("span",{className:"text-[10px] text-gray-400",children:"Unrealized P&L"})]}),(0,t.jsxs)("div",{className:"bg-white p-3.5 rounded border border-gray-200 shadow-xs",children:[(0,t.jsx)("span",{className:"text-[10px] font-bold text-gray-500 uppercase tracking-wider block",children:"Total Return %"}),(0,t.jsx)("div",{className:`font-mono font-black text-lg mt-1 ${r.gainLossPercent<0?"text-red-600":"text-emerald-700"}`,children:U(r.gainLossPercent).text}),(0,t.jsx)("span",{className:"text-[10px] text-gray-400",children:"ROI on Invested"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"bg-white p-4 rounded border border-gray-200 shadow-xs space-y-3",children:[(0,t.jsxs)("h3",{className:"text-xs font-bold text-[#1F4E79] uppercase tracking-wide flex items-center gap-1.5",children:[(0,t.jsx)(e0,{className:"w-4 h-4 text-blue-600"}),(0,t.jsx)("span",{children:"Asset Composition (Cash vs Equity)"})]}),(0,t.jsxs)("div",{className:"h-6 w-full bg-gray-100 rounded-full overflow-hidden flex border border-gray-300",children:[(0,t.jsxs)("div",{style:{width:`${s}%`},className:"bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold",title:`Cash: ${s}%`,children:["Cash ",s,"%"]}),(0,t.jsxs)("div",{style:{width:`${o}%`},className:"bg-blue-600 h-full flex items-center justify-center text-[10px] text-white font-bold",title:`Equities: ${o}%`,children:["Equities ",o,"%"]})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between text-xs text-gray-600 pt-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("span",{className:"w-3 h-3 rounded-full bg-emerald-500 inline-block"}),(0,t.jsxs)("span",{children:["Cash: ",D(r.cashAvailable).text]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("span",{className:"w-3 h-3 rounded-full bg-blue-600 inline-block"}),(0,t.jsxs)("span",{children:["Equities: ",D(r.investmentCurrent).text]})]})]})]}),(0,t.jsxs)("div",{className:"bg-white p-4 rounded border border-gray-200 shadow-xs space-y-3",children:[(0,t.jsxs)("h3",{className:"text-xs font-bold text-[#1F4E79] uppercase tracking-wide flex items-center gap-1.5",children:[(0,t.jsx)(eQ,{className:"w-4 h-4 text-blue-600"}),(0,t.jsx)("span",{children:"Portfolio Split By Account"})]}),(0,t.jsx)("div",{className:"space-y-2",children:e.map(e=>{let r=n>0?(e.accountOverallMoney/n*100).toFixed(1):"0";return(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsxs)("div",{className:"flex justify-between text-xs font-medium text-gray-700",children:[(0,t.jsx)("span",{className:"font-bold",children:e.accountNumber}),(0,t.jsxs)("span",{className:"font-mono",children:[D(e.accountOverallMoney).text," (",r,"%)"]})]}),(0,t.jsx)("div",{className:"w-full bg-gray-100 rounded-full h-2.5 overflow-hidden",children:(0,t.jsx)("div",{style:{width:`${r}%`},className:"bg-[#1F4E79] h-full rounded-full"})})]},e.accountNumber)})})]})]}),(0,t.jsxs)("div",{className:"bg-white p-4 rounded border border-gray-200 shadow-xs",children:[(0,t.jsxs)("h3",{className:"text-xs font-bold text-[#1F4E79] uppercase tracking-wide mb-3 flex items-center gap-1.5",children:[(0,t.jsx)(e2,{className:"w-4 h-4 text-blue-600"}),(0,t.jsx)("span",{children:"Holdings Performance & Unrealized Profit / Loss"})]}),(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"w-full text-xs",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"border-b border-gray-200 text-gray-500 font-medium",children:[(0,t.jsx)("th",{className:"py-2 text-left",children:"Holding"}),(0,t.jsx)("th",{className:"py-2 text-left",children:"Account"}),(0,t.jsx)("th",{className:"py-2 text-right",children:"Shares"}),(0,t.jsx)("th",{className:"py-2 text-right",children:"Cost Basis"}),(0,t.jsx)("th",{className:"py-2 text-right",children:"Current Value"}),(0,t.jsx)("th",{className:"py-2 text-right",children:"Profit / Loss"}),(0,t.jsx)("th",{className:"py-2 text-right",children:"Gain / Loss %"})]})}),(0,t.jsx)("tbody",{className:"divide-y divide-gray-100",children:a.map(e=>{let r=e.profitLossAmt<0;return(0,t.jsxs)("tr",{className:"hover:bg-gray-50",children:[(0,t.jsxs)("td",{className:"py-2 font-bold text-gray-900 font-mono",children:[e.symbol,e.comments&&(0,t.jsxs)("span",{className:"ml-1.5 text-[10px] text-red-600 font-normal",children:["(",e.comments,")"]})]}),(0,t.jsx)("td",{className:"py-2 text-blue-900 font-semibold",children:e.accountNumber}),(0,t.jsx)("td",{className:"py-2 text-right font-mono",children:e.quantity}),(0,t.jsx)("td",{className:"py-2 text-right font-mono",children:D(e.investAmount).text}),(0,t.jsx)("td",{className:"py-2 text-right font-mono font-bold text-blue-900",children:D(e.overallCurrentPrice).text}),(0,t.jsx)("td",{className:`py-2 text-right font-mono font-bold ${r?"text-red-600":"text-emerald-700"}`,children:D(e.profitLossAmt).text}),(0,t.jsx)("td",{className:`py-2 text-right font-mono font-semibold ${r?"text-red-600":"text-emerald-700"}`,children:U(e.gainLossPercent).text})]},e.id)})})]})})]})]})}function e5(e){return e?`${M(e.gainLossAmount).text} (${U(e.gainLossPercent).text})`:"—"}function e4(e,t){return Math.ceil(Math.max(t,6.8*Math.max(0,...e.map(e=>e.length))+28))}function e6(){let[e,a]=r.default.useState([]),[n,s]=r.default.useState("WEEKLY"),[o,i]=r.default.useState(!0),[l,c]=r.default.useState(null),[f,d]=r.default.useState(new Set),u=r.default.useCallback(async(e=!1)=>{try{e||i(!0);let t=await fetch("/api/weekly-history",{cache:"no-store"}),r=await t.json();if(!t.ok)throw Error(r.error||"Unable to load account history");a(r.history||[]),c(null)}catch(e){c(e instanceof Error?e.message:"Unable to load account history")}finally{e||i(!1)}},[]);r.default.useEffect(()=>{u();let e=window.setInterval(()=>void u(!0),6e4);return()=>window.clearInterval(e)},[u]);let p=r.default.useMemo(()=>Array.from(new Set(e.map(e=>e.accountNumber))).sort((e,t)=>e.localeCompare(t)),[e]),m=r.default.useMemo(()=>{if("WEEKLY"===n){let t=new Map;return e.forEach(e=>{let r=t.get(e.snapshotWeek)||[];r.push(e),t.set(e.snapshotWeek,r)}),Array.from(t.entries()).sort(([e],[t])=>t.localeCompare(e)).slice(0,8).map(([e,t])=>({key:`W-${e}`,label:`Week ending ${new Intl.DateTimeFormat("en-US",{month:"2-digit",day:"2-digit",year:"numeric",timeZone:"UTC"}).format(new Date(`${e}T00:00:00.000Z`))}`,rows:t}))}let t=new Map;return e.slice().sort((e,t)=>t.snapshotWeek.localeCompare(e.snapshotWeek)).forEach(e=>{let r=e.snapshotWeek.slice(0,7),a=`${r}|${e.accountNumber}`;t.has(a)||t.set(a,e)}),Array.from(new Set(e.map(e=>e.snapshotWeek.slice(0,7)))).sort((e,t)=>t.localeCompare(e)).slice(0,12).map(e=>({key:`M-${e}`,label:`Month ${new Intl.DateTimeFormat("en-US",{month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(`${e}-01T00:00:00.000Z`))}`,rows:p.map(r=>t.get(`${e}|${r}`)).filter(e=>!!e)}))},[p,e,n]),g=Math.ceil(Math.max("Account".length,...p.map(x=>String(x||"").length))*7.3+24),b=m.flatMap(e=>{let isCollapsed=f.has(e.key),topBtnW=Math.ceil(String(e.label||"").length*7.3+32);if(isCollapsed){let snapVals=e.rows.flatMap(r=>[D(r.investmentCurrentValue).text,e5(r)]),maxSnapLen=Math.max(String(e.label||"").length,"Snapshot".length,...snapVals.map(x=>String(x||"").length)),snapW=Math.ceil(maxSnapLen*7.3+24);return[{key:`${e.key}-snapshot`,width:snapW}]}else{let curVals=e.rows.map(r=>D(r.investmentCurrentValue).text),maxCurLen=Math.max("Investment Current Value".length,...curVals.map(x=>String(x||"").length)),curW=Math.ceil(maxCurLen*7.3+20),gainVals=e.rows.map(r=>e5(r)),maxGainLen=Math.max("Gain/Loss".length,...gainVals.map(x=>String(x||"").length)),gainW=Math.ceil(maxGainLen*7.3+20);if(curW+gainW<topBtnW){let diff=Math.ceil((topBtnW-(curW+gainW))/2);curW+=diff;gainW+=diff}return[{key:`${e.key}-current`,width:curW},{key:`${e.key}-gain`,width:gainW}]}}),x=g+(b.length>0?b.reduce((e,t)=>e+t.width,0):160);return(0,t.jsxs)("section",{className:"my-3 w-full overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-[0_10px_26px_-22px_rgba(15,23,42,0.65)]",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/50 bg-[linear-gradient(110deg,#fff42a_0%,#ffe936_55%,#ffdc2a_100%)] px-3 py-1.5 text-slate-900",children:[(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsx)(h,{className:"h-3.5 w-3.5 text-amber-800"}),(0,t.jsx)("h2",{className:"text-[10px] font-black uppercase tracking-[0.04em] sm:text-[11px]",children:"Account Value History"}),(0,t.jsx)("span",{className:"hidden text-[9px] font-bold text-amber-900/70 sm:inline",children:"(Every Saturday 9 PM EST)"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsxs)("div",{className:"flex rounded-md border border-amber-700/20 bg-white/55 p-px text-[8px] font-bold",children:[(0,t.jsx)("button",{type:"button",onClick:()=>s("WEEKLY"),className:`rounded px-2 py-0.5 transition ${"WEEKLY"===n?"bg-amber-800 text-white shadow-sm":"text-amber-900 hover:bg-white/70"}`,children:"Weekly"}),(0,t.jsx)("button",{type:"button",onClick:()=>s("MONTHLY"),className:`rounded px-2 py-0.5 transition ${"MONTHLY"===n?"bg-amber-800 text-white shadow-sm":"text-amber-900 hover:bg-white/70"}`,children:"Monthly"})]}),(0,t.jsxs)("span",{className:"hidden items-center gap-1 rounded-full border border-amber-700/20 bg-white/55 px-1.5 py-0.5 text-[8px] font-bold text-amber-900 sm:inline-flex",children:[(0,t.jsx)(ep,{className:"h-2.5 w-2.5"}),"Backed up"]}),(0,t.jsx)("button",{type:"button",onClick:()=>void u(),disabled:o,className:"grid h-5 w-5 place-items-center rounded border border-amber-700/20 bg-white/60 text-amber-900 transition hover:bg-white disabled:opacity-50",title:"Refresh account history",children:(0,t.jsx)(T,{className:`h-2.5 w-2.5 ${o?"animate-spin":""}`})})]})]}),l&&(0,t.jsx)("div",{className:"border-b border-red-200 bg-red-50 px-3 py-1.5 text-[9px] text-red-700",children:l}),(0,t.jsx)("div",{className:"freeze-header-scroll relative isolate max-h-[58vh] overflow-auto",children:(0,t.jsxs)("table",{className:"freeze-header-table table-fixed border-separate border-spacing-0 text-[10px]",style:{width:x,minWidth:x},children:[(0,t.jsxs)("colgroup",{children:[(0,t.jsx)("col",{style:{width:g,minWidth:g,maxWidth:g}}),b.length>0?b.map(e=>(0,t.jsx)("col",{style:{width:e.width,minWidth:e.width,maxWidth:e.width}},e.key)):(0,t.jsx)("col",{style:{width:160,minWidth:160,maxWidth:160}})]}),(0,t.jsxs)("thead",{children:[(0,t.jsxs)("tr",{className:"bg-[#FCE4D6] text-slate-900",children:[(0,t.jsx)("th",{rowSpan:2,className:"frozen-history-column sticky left-0 z-40 whitespace-nowrap border-b-2 border-r border-slate-400 bg-[#FCE4D6] text-left font-black shadow-[3px_0_5px_-3px_rgba(0,0,0,0.35)]",children:"Account"}),m.length>0?m.map(e=>{let r=f.has(e.key);return(0,t.jsx)("th",{colSpan:r?1:2,className:"border-b border-r border-slate-400 bg-[#FFF8F1] p-0 text-center last:border-r-0",children:(0,t.jsxs)("button",{type:"button",onClick:()=>{var t;return t=e.key,void d(e=>{let r=new Set(e);return r.has(t)?r.delete(t):r.add(t),r})},"aria-expanded":!r,className:"flex w-full items-center justify-center gap-1 whitespace-nowrap px-2 py-1.5 transition hover:bg-amber-50",children:[r?(0,t.jsx)(X,{className:"h-3 w-3 text-amber-800"}):(0,t.jsx)(V,{className:"h-3 w-3 text-amber-800"}),e.label]})},e.key)}):(0,t.jsx)("th",{className:"border-b border-slate-400",children:"Period"})]}),(0,t.jsx)("tr",{className:"bg-[#FCE4D6] text-slate-800",children:m.length>0?m.flatMap(e=>f.has(e.key)?[(0,t.jsx)("th",{className:"whitespace-nowrap border-b-2 border-r border-slate-400 bg-amber-50/50 text-center last:border-r-0",children:"Snapshot"},`${e.key}-snapshot`)]:[(0,t.jsx)("th",{className:"whitespace-nowrap border-b-2 border-r border-slate-400 text-center",children:"Investment Current Value"},`${e.key}-current`),(0,t.jsx)("th",{className:"whitespace-nowrap border-b-2 border-r border-slate-400 text-center last:border-r-0",children:"Gain/Loss"},`${e.key}-gain`)]):(0,t.jsx)("th",{className:"border-b-2 border-slate-400",children:"Snapshot"})})]}),(0,t.jsx)("tbody",{children:p.length>0?p.map(e=>(0,t.jsxs)("tr",{className:"hover:bg-blue-50/35",children:[(0,t.jsx)("th",{className:"frozen-history-column sticky left-0 z-20 whitespace-nowrap border-b border-r border-slate-300 bg-slate-50 px-3 py-2 text-left font-mono font-bold text-blue-900 shadow-[3px_0_5px_-3px_rgba(0,0,0,0.3)]",children:e}),m.flatMap(r=>{let a=r.rows.find(t=>t.accountNumber===e),n=f.has(r.key),s=a?D(a.investmentCurrentValue).text:"—",o=e5(a),i=0>(a?.gainLossAmount||0);return n?[(0,t.jsxs)("td",{className:"whitespace-nowrap border-b border-r border-slate-300 bg-amber-50/20 px-2 py-1.5 text-right font-mono last:border-r-0",children:[(0,t.jsx)("div",{className:"font-bold text-slate-800",children:s}),(0,t.jsx)("div",{className:`mt-0.5 text-[8px] font-bold ${i?"text-red-600":"text-emerald-700"}`,children:o})]},`${r.key}-${e}-snapshot`)]:[(0,t.jsx)("td",{className:"whitespace-nowrap border-b border-r border-slate-300 px-2 py-2 text-right font-mono font-bold text-slate-800",children:s},`${r.key}-${e}-current`),(0,t.jsx)("td",{className:`whitespace-nowrap border-b border-r border-slate-300 px-2 py-2 text-right font-mono font-bold last:border-r-0 ${i?"text-red-600":"text-emerald-700"}`,children:o},`${r.key}-${e}-gain`)]})]},e)):(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:Math.max(2,b.length+1),className:"border-b border-slate-200 px-3 py-6 text-center text-[9px] text-slate-400",children:o?"Loading account history…":"No history available."})})})]})})]})}let e8={name:"arrow-left-right",size:24,node:[["path",{d:"M8 3 4 7l4 4",key:"9rb6wj"}],["path",{d:"M4 7h16",key:"6tx8e3"}],["path",{d:"m16 21 4-4-4-4",key:"siv7j2"}],["path",{d:"M20 17H4",key:"h6l3hr"}]]};e8.node;let e7=i(e8);function e9(e,t){return Math.ceil(Math.max(t,6.8*Math.max(0,...e.map(e=>e.length))+28))}function te(){let[e,a]=r.default.useState([]),[n,s]=r.default.useState("WEEKLY"),[o,i]=r.default.useState(!0),[l,c]=r.default.useState(null),[f,h]=r.default.useState(new Set),d=r.default.useCallback(async(e=!1)=>{try{e||i(!0);let t=await fetch("/api/transaction-history",{cache:"no-store"}),r=await t.json();if(!t.ok)throw Error(r.error||"Unable to load transaction history");a(r.history||[]),c(null)}catch(e){c(e instanceof Error?e.message:"Unable to load transaction history")}finally{e||i(!1)}},[]);r.default.useEffect(()=>{d();let e=window.setInterval(()=>void d(!0),6e4);return()=>window.clearInterval(e)},[d]);let u=r.default.useMemo(()=>Array.from(new Set(e.map(e=>e.accountNumber))).sort((e,t)=>e.localeCompare(t)),[e]),p=r.default.useMemo(()=>{if("WEEKLY"===n){let t=new Map;return e.forEach(e=>{let r=t.get(e.snapshotWeek)||[];r.push(e),t.set(e.snapshotWeek,r)}),Array.from(t.entries()).sort(([e],[t])=>t.localeCompare(e)).slice(0,8).map(([e,t])=>({key:`W-${e}`,label:`Week ending ${new Intl.DateTimeFormat("en-US",{month:"2-digit",day:"2-digit",year:"numeric",timeZone:"UTC"}).format(new Date(`${e}T00:00:00.000Z`))}`,rows:t}))}return Array.from(new Set(e.map(e=>e.snapshotWeek.slice(0,7)))).sort((e,t)=>t.localeCompare(e)).slice(0,12).map(t=>({key:`M-${t}`,label:`Month ${new Intl.DateTimeFormat("en-US",{month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(`${t}-01T00:00:00.000Z`))}`,rows:u.map(r=>{var a;return a=e.filter(e=>e.accountNumber===r&&e.snapshotWeek.startsWith(t)),{id:-1,accountNumber:r,snapshotWeek:t,buyValue:a.reduce((e,t)=>e+t.buyValue,0),sellValue:a.reduce((e,t)=>e+t.sellValue,0),netCashFlow:a.reduce((e,t)=>e+t.netCashFlow,0),realizedGainLoss:a.reduce((e,t)=>e+t.realizedGainLoss,0),buyCount:a.reduce((e,t)=>e+t.buyCount,0),sellCount:a.reduce((e,t)=>e+t.sellCount,0),capturedAt:null,source:"AGGREGATED"}})}))},[u,e,n]),m=Math.ceil(Math.max("Account".length,...u.map(x=>String(x||"").length))*7.3+24),g=p.flatMap(e=>{let isCollapsed=f.has(e.key),topBtnW=Math.ceil(String(e.label||"").length*7.3+32);if(isCollapsed){let sumVals=e.rows.flatMap(r=>[`Buy ${D(r.buyValue).text}`,`Sell ${D(r.sellValue).text}`]),maxSummaryLen=Math.max(String(e.label||"").length,"Transaction Summary".length,...sumVals.map(x=>String(x||"").length)),sumW=Math.ceil(maxSummaryLen*7.3+24);return[{key:`${e.key}-summary`,width:sumW}]}else{let buyVals=e.rows.map(r=>D(r.buyValue).text),maxBuyLen=Math.max("Buy Value".length,...buyVals.map(x=>String(x||"").length)),buyW=Math.ceil(maxBuyLen*7.3+20),sellVals=e.rows.map(r=>D(r.sellValue).text),maxSellLen=Math.max("Sell Value".length,...sellVals.map(x=>String(x||"").length)),sellW=Math.ceil(maxSellLen*7.3+20);if(buyW+sellW<topBtnW){let diff=Math.ceil((topBtnW-(buyW+sellW))/2);buyW+=diff;sellW+=diff}return[{key:`${e.key}-buy`,width:buyW},{key:`${e.key}-sell`,width:sellW}]}}),b=m+Math.max(160,g.reduce((e,t)=>e+t.width,0));return(0,t.jsxs)("section",{className:"my-3 w-full overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-[0_10px_26px_-22px_rgba(15,23,42,0.65)]",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-2 border-b border-blue-500/30 bg-[linear-gradient(110deg,#dbeafe_0%,#e0f2fe_55%,#dbeafe_100%)] px-3 py-1.5 text-slate-900",children:[(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsx)(e7,{className:"h-3.5 w-3.5 text-blue-800"}),(0,t.jsx)("h2",{className:"text-[10px] font-black uppercase tracking-[0.04em] text-blue-950 sm:text-[11px]",children:"Daily Transactions History"}),(0,t.jsx)("span",{className:"hidden text-[9px] font-bold text-blue-900/60 sm:inline",children:"Account level · (Every Saturday 9 PM EST)"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsxs)("div",{className:"flex rounded-md border border-blue-700/20 bg-white/60 p-px text-[8px] font-bold",children:[(0,t.jsx)("button",{type:"button",onClick:()=>s("WEEKLY"),className:`rounded px-2 py-0.5 transition ${"WEEKLY"===n?"bg-blue-800 text-white":"text-blue-900 hover:bg-white"}`,children:"Weekly"}),(0,t.jsx)("button",{type:"button",onClick:()=>s("MONTHLY"),className:`rounded px-2 py-0.5 transition ${"MONTHLY"===n?"bg-blue-800 text-white":"text-blue-900 hover:bg-white"}`,children:"Monthly"})]}),(0,t.jsxs)("span",{className:"hidden items-center gap-1 text-[8px] font-bold text-blue-800 sm:inline-flex",children:[(0,t.jsx)(ep,{className:"h-2.5 w-2.5"})," Backed up"]}),(0,t.jsx)("button",{type:"button",onClick:()=>void d(),disabled:o,className:"grid h-5 w-5 place-items-center rounded border border-blue-700/20 bg-white/70 text-blue-900 hover:bg-white disabled:opacity-50",title:"Refresh transaction history",children:(0,t.jsx)(T,{className:`h-2.5 w-2.5 ${o?"animate-spin":""}`})})]})]}),l&&(0,t.jsx)("div",{className:"border-b border-red-200 bg-red-50 px-3 py-1.5 text-[9px] text-red-700",children:l}),(0,t.jsx)("div",{className:"freeze-header-scroll relative isolate max-h-[58vh] overflow-auto",children:(0,t.jsxs)("table",{className:"freeze-header-table table-fixed border-separate border-spacing-0 text-[10px]",style:{width:b,minWidth:b},children:[(0,t.jsxs)("colgroup",{children:[(0,t.jsx)("col",{style:{width:m,minWidth:m,maxWidth:m}}),g.length>0?g.map(e=>(0,t.jsx)("col",{style:{width:e.width,minWidth:e.width,maxWidth:e.width}},e.key)):(0,t.jsx)("col",{style:{width:160,minWidth:160,maxWidth:160}})]}),(0,t.jsxs)("thead",{children:[(0,t.jsxs)("tr",{className:"bg-[#E8F1FA] text-slate-900",children:[(0,t.jsx)("th",{rowSpan:2,className:"frozen-history-column sticky left-0 z-40 border-b-2 border-r border-slate-400 bg-[#E8F1FA] text-left font-black",children:"Account"}),p.length>0?p.map(e=>{let r=f.has(e.key);return(0,t.jsx)("th",{colSpan:r?1:2,className:"border-b border-r border-slate-400 bg-blue-50 p-0 last:border-r-0",children:(0,t.jsxs)("button",{type:"button",onClick:()=>{var t;return t=e.key,void h(e=>{let r=new Set(e);return r.has(t)?r.delete(t):r.add(t),r})},className:"flex w-full items-center justify-center gap-1 whitespace-nowrap px-2 py-1.5 hover:bg-blue-100/60",children:[r?(0,t.jsx)(X,{className:"h-3 w-3"}):(0,t.jsx)(V,{className:"h-3 w-3"}),e.label]})},e.key)}):(0,t.jsx)("th",{className:"border-b border-slate-400",children:"Period"})]}),(0,t.jsx)("tr",{className:"bg-[#E8F1FA] text-slate-800",children:p.flatMap(e=>f.has(e.key)?[(0,t.jsx)("th",{className:"border-b-2 border-r border-slate-400 whitespace-nowrap",children:"Transaction Summary"},`${e.key}-summary`)]:["Buy Value","Sell Value"].map(r=>(0,t.jsx)("th",{className:"border-b-2 border-r border-slate-400 whitespace-nowrap text-center",children:r},`${e.key}-${r}`)))})]}),(0,t.jsx)("tbody",{children:u.length>0?u.map(e=>(0,t.jsxs)("tr",{className:"hover:bg-blue-50/30",children:[(0,t.jsx)("th",{className:"frozen-history-column sticky left-0 z-20 whitespace-nowrap border-b border-r border-slate-300 bg-slate-50 px-3 py-2 text-left font-mono font-bold text-blue-900",children:e}),p.flatMap(r=>{let a=r.rows.find(t=>t.accountNumber===e),n=a?[D(a.buyValue).text,D(a.sellValue).text]:["—","—"];return f.has(r.key)?[(0,t.jsxs)("td",{className:"border-b border-r border-slate-300 bg-blue-50/20 px-2 py-1.5 text-right font-mono whitespace-nowrap",children:[(0,t.jsxs)("div",{className:"font-bold text-slate-800",children:["Buy ",n[0]]}),(0,t.jsxs)("div",{className:"mt-0.5 text-[8px] text-slate-500",children:["Sell ",n[1]]})]},`${r.key}-${e}-summary`)]:n.map((a,n)=>(0,t.jsx)("td",{className:"border-b border-r border-slate-300 px-2 py-2 text-right font-mono font-bold text-slate-800 whitespace-nowrap",children:a},`${r.key}-${e}-${n}`))})]},e)):(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:Math.max(2,g.length+1),className:"px-3 py-6 text-center text-[9px] text-slate-400",children:o?"Loading transaction history…":"No transaction history available."})})})]})})]})}var tt=e.i(27584);let tr="1F4E78",ta="163A5C",tn="107C41",ts="D9EAF7",to="FCE4D6",ti="FFF200",tl="FFF9CC",tc="FFFFFF",tf="1F2937",th="9CA3AF",td="C00000",tu="FDE9E7",tp="08783E",tm="EAF6EF",tg="F8FAFC",tb="Arial",tx="$#,##0.00;[Red]($#,##0.00);-",tv="0.00%;[Red](0.00%);-",ty="#,##0.####",tw=(e=th)=>({top:{style:"thin",color:{rgb:e}},bottom:{style:"thin",color:{rgb:e}},left:{style:"thin",color:{rgb:e}},right:{style:"thin",color:{rgb:e}}}),tA=(e=tr)=>({font:{name:tb,sz:12,bold:!0,color:{rgb:tc}},fill:{patternType:"solid",fgColor:{rgb:e}},alignment:{horizontal:"center",vertical:"center"},border:tw(e)}),tT=(e=to)=>({font:{name:tb,sz:10,bold:!0,color:{rgb:tf}},fill:{patternType:"solid",fgColor:{rgb:e}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:tw(th)}),tC=(e="left")=>({font:{name:tb,sz:10,color:{rgb:tf}},fill:{patternType:"solid",fgColor:{rgb:tc}},alignment:{horizontal:e,vertical:"center"},border:tw("CBD5E1")}),tE=(e="right")=>({font:{name:tb,sz:10,bold:!0,color:{rgb:tf}},fill:{patternType:"solid",fgColor:{rgb:tl}},alignment:{horizontal:e,vertical:"center"},border:tw(th)}),tk=(e="right")=>({font:{name:tb,sz:10,bold:!0,color:{rgb:tf}},fill:{patternType:"solid",fgColor:{rgb:ti}},alignment:{horizontal:e,vertical:"center"},border:tw(th)});function tS(e,t){return tt.utils.encode_cell({r:e,c:t})}function tN(e,t,r,a,n){let s=function(e,t,r,a=""){let n=tS(t,r);return e[n]||(e[n]={t:"number"==typeof a?"n":"s",v:a}),e[n]}(e,t,r);s.s=a,n&&(s.z=n)}function t_(e,t,r,a,n,s){for(let o=t;o<=r;o+=1)for(let t=a;t<=n;t+=1)tN(e,o,t,s)}function tO(e,t=10,r=30){return Array.from({length:Math.max(0,...e.map(e=>e.length))},(a,n)=>({wch:Math.min(r,Math.max(t,...e.map(e=>String(e[n]??"").length+2)))}))}function tI(e,t,r){e["!freeze"]={xSplit:t,ySplit:r}}function tF(e){return e?new Date(e).toLocaleString():""}function tR(e){return new Intl.DateTimeFormat("en-US",{month:"2-digit",day:"2-digit",year:"numeric",timeZone:"UTC"}).format(new Date(`${e}T00:00:00.000Z`))}function tj(e,t){let r=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2}).format(Math.abs(e)),a=e<0?`-${r}`:r,n=`${t>0?"+":""}${t.toFixed(2)}%`;return`${a} (${n})`}let tP=e=>String(e??"").trim().toLowerCase().replace(/[\s_./%-]+/g,"");function tL(e,t=0){if("number"==typeof e)return Number.isFinite(e)?e:t;if(e instanceof Date)return t;let r=Number(String(e??"").trim().replace(/[$,%\s]/g,"").replace(/^\((.*)\)$/,"-$1"));return Number.isFinite(r)?r:t}function tD(e){if(e instanceof Date&&!Number.isNaN(e.getTime()))return e.toISOString();if("number"==typeof e){let t=tt.SSF.parse_date_code(e);if(t)return new Date(Date.UTC(t.y,t.m-1,t.d,t.H,t.M,t.S)).toISOString()}let t=new Date(String(e??""));return Number.isNaN(t.getTime())?new Date().toISOString():t.toISOString()}function tM(e){if(e instanceof Date&&!Number.isNaN(e.getTime()))return e.toISOString().slice(0,10);let t=String(e??"").trim().replace(/^week\s+ending\s*/i,"");if(/^\d{4}-\d{2}-\d{2}$/.test(t))return t;let r=t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(r)return`${r[3]}-${r[1].padStart(2,"0")}-${r[2].padStart(2,"0")}`;let a=new Date(t);return Number.isNaN(a.getTime())?"":a.toISOString().slice(0,10)}function tU(e,t){let r=e.Sheets[t];return r?tt.utils.sheet_to_json(r,{header:1,raw:!0,defval:""}):[]}function tB(e,t){for(let r of t){let t=tU(e,r);if(t.length>0)return t}return[]}function t$(e,t){return e.findIndex(e=>{let r=new Set(e.map(tP));return t.every(e=>r.has(tP(e)))})}function tz(e){let t=new Map;return e.forEach((e,r)=>t.set(tP(e),r)),t}function tW(e,t){for(let r of t){let t=e.get(tP(r));if(void 0!==t)return t}return -1}function tH(e,t){return t>=0?e[t]:""}e.s(["default",0,function(){let[e,a]=(0,r.useState)([]),[n,s]=(0,r.useState)({accountOverallMoney:0,cashAvailable:0,amountInvested:0,investmentCurrent:0,gainLoss:0,gainLossPercent:0}),[o,i]=(0,r.useState)([]),[l,c]=(0,r.useState)(null),[f,h]=(0,r.useState)(!0),[d,u]=(0,r.useState)(!1),[p,m]=(0,r.useState)(!1),[g,b]=(0,r.useState)("future"),[x,v]=(0,r.useState)("ALL"),[y,w]=(0,r.useState)({cellId:"C4",label:"CS - 9271 Account Value",value:"$66,038.85",formula:"=D4+F4"}),[A,C]=(0,r.useState)(60),[E,k]=(0,r.useState)(60),[N,_]=(0,r.useState)(!1),[O,I]=(0,r.useState)(!1),[R,j]=(0,r.useState)(null),[P,L]=(0,r.useState)(!1),[D,M]=(0,r.useState)(null),[U,B]=(0,r.useState)(!1),[z,H]=(0,r.useState)(null),[V,G]=(0,r.useState)(""),[X,Y]=(0,r.useState)(""),[K,q]=(0,r.useState)("BUY"),[J,Q]=(0,r.useState)(),[Z,ee]=(0,r.useState)(),[et,er]=(0,r.useState)(),[ea,en]=(0,r.useState)(),[es,eo]=(0,r.useState)(null),ei=(e,t="success")=>{eo({text:e,type:t}),setTimeout(()=>eo(null),4e3)},el=(0,r.useCallback)(async(e=!1)=>{try{e||h(!0);let t=await fetch("/api/portfolio");if(t.ok){let e=await t.json();a(e.accounts||[]),s(e.grandTotal||{}),i(e.futureInvestments||[]),c(e.lastRefreshed||new Date().toISOString())}}catch(e){console.error("Failed to load portfolio:",e),ei("Failed to load portfolio data","error")}finally{e||h(!1)}},[]),ec=(0,r.useCallback)(async()=>{try{u(!0);let e=await fetch("/api/portfolio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"refresh-market"})});if(e.ok){let t=await e.json();a(t.portfolio.accounts||[]),s(t.portfolio.grandTotal||{}),i(t.portfolio.futureInvestments||[]),c(new Date().toISOString()),k(A||60),ei("Market prices dynamically pulled & sections updated!")}}catch(e){console.error("Failed to pull market prices:",e),ei("Market fetch: cached values preserved","info")}finally{u(!1)}},[A]);(0,r.useEffect)(()=>{el()},[el]),(0,r.useEffect)(()=>{if(A<=0)return;k(A);let e=setInterval(()=>{k(e=>e<=1?(ec(),A):e-1)},1e3);return()=>clearInterval(e)},[A,ec]);let ef=async e=>{let t=await fetch("/api/portfolio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"future-trade",data:e})}),r=await t.json();if(!t.ok)throw Error(r.error||"Trade execution failed");a(r.portfolio.accounts||[]),s(r.portfolio.grandTotal||{}),i(r.portfolio.futureInvestments||[]),c(new Date().toISOString()),ei(`${e.action} order executed for ${e.quantity} ${e.symbol}. Linked account & current holdings updated!`)},eh=async(e,t)=>{let r=await fetch("/api/portfolio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"update-current-field",data:{id:e,...t}})}),n=await r.json();if(!r.ok)throw Error(n.error||"Failed to update current holding");a(n.portfolio.accounts||[]),s(n.portfolio.grandTotal||{}),i(n.portfolio.futureInvestments||[]),c(new Date().toISOString());let o=void 0!==t.quantity?"Quantity":void 0!==t.purchasePrice?"Purchase Price":void 0!==t.currentPrice?"Current Price":"Comments";ei(`${o} updated. Linked totals and accounts recalculated!`)},eu=async(e,t)=>{let r=await fetch("/api/portfolio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"edit-future",data:{id:e,...t}})}),n=await r.json();if(!r.ok)throw Error(n.error||"Failed to update future investment");a(n.portfolio.accounts||[]),s(n.portfolio.grandTotal||{}),i(n.portfolio.futureInvestments||[]),c(new Date().toISOString()),ei("Daily transaction updated. Inventory, cash, and gain/loss reconciled!")},em=async e=>{let t=await fetch("/api/portfolio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"edit-future",data:e})}),r=await t.json();if(!t.ok)throw Error(r.error||"Failed to update future investment");a(r.portfolio.accounts||[]),s(r.portfolio.grandTotal||{}),i(r.portfolio.futureInvestments||[]),c(new Date().toISOString()),ei(`Daily transaction #${e.id} (${e.symbol}) updated successfully!`)},eg=async e=>{let t=await fetch("/api/portfolio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"save-current",data:e})}),r=await t.json();if(!t.ok)throw Error(r.error||"Failed to save holding");a(r.portfolio.accounts||[]),s(r.portfolio.grandTotal||{}),i(r.portfolio.futureInvestments||[]),c(new Date().toISOString()),ei(`Holding for ${e.symbol} updated!`)},eb=async e=>{let t=await fetch("/api/portfolio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"save-account",data:e})}),r=await t.json();if(!t.ok)throw Error(r.error||"Failed to save account");a(r.portfolio.accounts||[]),s(r.portfolio.grandTotal||{}),i(r.portfolio.futureInvestments||[]),ei(`Account ${e.accountNumber} saved.`)},ex=async()=>{try{var t;let r,a,s,[i,l]=await Promise.all([fetch("/api/weekly-history",{cache:"no-store"}),fetch("/api/transaction-history",{cache:"no-store"})]),[c,f]=await Promise.all([i.json(),l.json()]);if(!i.ok)throw Error(c.error||"Unable to load account history");if(!l.ok)throw Error(f.error||"Unable to load transaction history");t={accounts:e,grandTotal:n,futureInvestments:o,weeklyHistory:c.history||[],transactionHistory:f.history||[]},(r=tt.utils.book_new()).Props={Title:"Portfolio Investment Workbook",Subject:"Accounts, holdings, transactions, and weekly history",Author:"Portfolio Tracker",Company:"Portfolio Tracker",CreatedDate:new Date},tt.utils.book_append_sheet(r,(a=[["DAILY TRANSACTIONS"],["Symbol","Account","Date/Time","Buy / Sell","Quantity","Price Per Share","Total Amount","Current Price","Gain/Loss","Comments","Transaction ID","Remaining Quantity","Source Buy ID","Status","Average Cost"],...t.futureInvestments.map(e=>[e.symbol,e.accountNumber,tF(e.dateTime),e.action,e.quantity,e.pricePerShare,e.totalAmount,e.currentPrice,tj(e.differenceAmount,e.differencePercent),e.comments||"",e.id??"",e.remainingQuantity??"",e.sourceTransactionId??"",e.status||"EXECUTED",e.costBasisPerShare??e.pricePerShare])],(s=tt.utils.aoa_to_sheet(a))["!merges"]=[{s:{r:0,c:0},e:{r:0,c:14}}],s["!cols"]=tO(a,10,28),s["!rows"]=[{hpt:24},{hpt:30}],s["!autofilter"]={ref:`A2:O${a.length}`},tI(s,1,2),t_(s,0,0,0,14,tA(tr)),t_(s,1,1,0,14,tT(to)),t.futureInvestments.forEach((e,t)=>{let r=t+2,a="BUY"===e.action?tm:tl;for(let e=0;e<=14;e+=1){let t=[4,5,6,7,8,14].includes(e)?"right":3===e?"center":"left";tN(s,r,e,tC(t))}for(let t of(s[tS(r,3)].s={...tC("center"),font:{name:tb,sz:10,bold:!0,color:{rgb:"BUY"===e.action?tp:"A05A00"}},fill:{patternType:"solid",fgColor:{rgb:a}}},tN(s,r,4,tC("right"),ty),[5,6,7,14]))tN(s,r,t,tC("right"),tx);tN(s,r,8,tC("right")),e.differenceAmount<0&&tN(s,r,8,{...tC("right"),font:{name:tb,sz:10,bold:!0,color:{rgb:td}},fill:{patternType:"solid",fgColor:{rgb:tu}}})}),s),"Daily Transactions"),tt.utils.book_append_sheet(r,function(e){let t=[["CONSOLIDATED VIEW - ACCOUNT LEVEL"],["Symbol","Account","Quantity","Avg Price","Invest Amount","Current Price","Overall Cur.Price","Comments","Gain/Loss","Last Updated"]],r=[];for(let a of e.accounts){for(let e of a.holdings)t.push([e.symbol,e.accountNumber,e.quantity,e.purchasePrice,e.investAmount,e.currentPrice,e.overallCurrentPrice,e.comments||"",tj(e.profitLossAmt,e.gainLossPercent),tF(e.updatedAt)]),r.push({type:"holding",gainLoss:e.profitLossAmt});t.push([`TOTAL — ${a.accountNumber}`,a.accountNumber,"","",a.amountInvested,"",a.investmentCurrent,"",tj(a.gainLoss,a.gainLossPercent),""]),r.push({type:"subtotal",account:a.accountNumber,gainLoss:a.gainLoss})}let a=tt.utils.aoa_to_sheet(t);return a["!merges"]=[{s:{r:0,c:0},e:{r:0,c:9}}],a["!cols"]=tO(t,10,28),a["!rows"]=[{hpt:24},{hpt:30}],a["!autofilter"]={ref:`A2:J${t.length}`},tI(a,1,2),t_(a,0,0,0,9,tA(tr)),t_(a,1,1,0,9,tT(to)),r.forEach((e,t)=>{let r=t+2,n="subtotal"===e.type?tE:tC;for(let e=0;e<=9;e+=1){let t=[2,3,4,5,6,8].includes(e)?"right":"left";tN(a,r,e,n(t))}for(let e of(tN(a,r,2,n("right"),ty),[3,4,5,6]))tN(a,r,e,n("right"),tx);void 0!==e.gainLoss&&e.gainLoss<0&&tN(a,r,8,{...n("right"),font:{name:tb,sz:10,bold:!0,color:{rgb:td}}})}),a}(t),"Consolidated View-Account Level"),tt.utils.book_append_sheet(r,function(e){let t=[["ACCOUNT'S SUMMARY"],["S. No.","Account","Account Name","Account Value","Cash Balance","Amount Invested","Investment - Current Value","Gain/Loss","Comments"],...e.accounts.map(e=>[e.sNo,e.accountNumber,e.accountName,e.accountOverallMoney,e.cashAvailable,e.amountInvested,e.investmentCurrent,tj(e.gainLoss,e.gainLossPercent),e.comments||""]),["TOTAL","All Accounts","",e.grandTotal.accountOverallMoney,e.grandTotal.cashAvailable,e.grandTotal.amountInvested,e.grandTotal.investmentCurrent,tj(e.grandTotal.gainLoss,e.grandTotal.gainLossPercent),""]],r=tt.utils.aoa_to_sheet(t),a=t.length-1;r["!merges"]=[{s:{r:0,c:0},e:{r:0,c:8}}],r["!cols"]=tO(t,10,32),r["!rows"]=[{hpt:24},{hpt:30}],r["!autofilter"]={ref:`A2:I${t.length}`},tI(r,0,2),t_(r,0,0,0,8,tA(tr)),t_(r,1,1,0,8,tT(ts));for(let t=2;t<a;t+=1){for(let e=0;e<=8;e+=1){let a=0===e?"center":e>=3&&e<=7?"right":"left";tN(r,t,e,tC(a))}for(let e of[3,4,5,6])tN(r,t,e,tC("right"),tx);let a=e.accounts[t-2]?.gainLoss??0;r[tS(t,7)].s={...tC("right"),font:{name:tb,sz:10,bold:!0,color:{rgb:a<0?td:tp}},fill:{patternType:"solid",fgColor:{rgb:a<0?tu:tm}}}}for(let e=0;e<=8;e+=1){let t=0===e?"center":e>=3&&e<=7?"right":"left";tN(r,a,e,tk(t))}for(let e of[3,4,5,6])tN(r,a,e,tk("right"),tx);return r[tS(a,7)].s={...tk("right"),font:{name:tb,sz:10,bold:!0,color:{rgb:e.grandTotal.gainLoss<0?td:tp}}},r}(t),"Account's Summary"),tt.utils.book_append_sheet(r,function(e){let t=[...e.weeklyHistory||[]].sort((e,t)=>t.snapshotWeek.localeCompare(e.snapshotWeek)||e.accountNumber.localeCompare(t.accountNumber)),r=Array.from(new Set(t.map(e=>e.snapshotWeek))).slice(0,3),a=Array.from(new Set([...e.accounts.map(e=>e.accountNumber),...t.map(e=>e.accountNumber)])).sort((e,t)=>e.localeCompare(t)),n=[["ACCOUNT VALUE HISTORY — EVERY SATURDAY 9 PM EST"],["Account"],[""]],s=[],o=1;for(let e of r)n[1][o]=`Week ending ${tR(e)}`,n[1][o+1]="",n[2][o]="Investment Current Value",n[2][o+1]="Gain/Loss",s.push({s:{r:1,c:o},e:{r:1,c:o+1}}),o+=2;for(let e of a){let a=[e];for(let n of r){let r=t.find(t=>t.snapshotWeek===n&&t.accountNumber===e);a.push(r?.investmentCurrentValue??"",r?tj(r.gainLossAmount,r.gainLossPercent):"")}n.push(a)}let i=Math.max(1,o-1);s.push({s:{r:0,c:0},e:{r:0,c:i}},{s:{r:1,c:0},e:{r:2,c:0}}),n.push([],["BACKUP AUDIT"],["Week Ending","Account","Investment Current Value","Gain/Loss Amount","Gain/Loss %","Captured At","Source"]),t.forEach(e=>{n.push([tR(e.snapshotWeek),e.accountNumber,e.investmentCurrentValue,e.gainLossAmount,e.gainLossPercent/100,tF(e.capturedAt),e.source])});let l=tt.utils.aoa_to_sheet(n);l["!merges"]=s,l["!cols"]=tO(n,12,34),l["!cols"]&&(l["!cols"][0]={wch:18}),l["!rows"]=[{hpt:25},{hpt:23},{hpt:24}],tI(l,1,3),t_(l,0,0,0,i,tA(tn)),t_(l,1,1,0,i,tT(ti)),t_(l,2,2,0,i,tT(to)),a.forEach((e,a)=>{let n=a+3;tN(l,n,0,tT(tg));for(let a=0;a<r.length;a+=1){let s=1+2*a,o=s+1,i=t.find(t=>t.snapshotWeek===r[a]&&t.accountNumber===e);tN(l,n,s,tC("right"),tx);let c=0>(i?.gainLossAmount||0);tN(l,n,o,{...tC("right"),font:{name:tb,sz:10,bold:!0,color:{rgb:c?td:tp}},fill:{patternType:"solid",fgColor:{rgb:c?tu:tm}}})}});let c=a.length+4,f=c+1;t_(l,c,c,0,6,tA(ta)),t_(l,f,f,0,6,tT(ts));for(let e=f+1;e<n.length;e+=1){for(let t=0;t<7;t+=1){let r=[2,3,4].includes(t)?"right":"left";tN(l,e,t,tC(r))}tN(l,e,2,tC("right"),tx),tN(l,e,3,tC("right"),"$#,##0.00;[Red]-$#,##0.00;-"),tN(l,e,4,tC("right"),tv)}return l}(t),"Weekly History"),tt.utils.book_append_sheet(r,function(e){let t=[...e.transactionHistory||[]].sort((e,t)=>t.snapshotWeek.localeCompare(e.snapshotWeek)||e.accountNumber.localeCompare(t.accountNumber)),r=Array.from(new Set(t.map(e=>e.snapshotWeek))).slice(0,3),a=Array.from(new Set([...e.accounts.map(e=>e.accountNumber),...t.map(e=>e.accountNumber)])).sort((e,t)=>e.localeCompare(t)),n=["Buy Value","Sell Value"],s=[["DAILY TRANSACTIONS HISTORY — EVERY SATURDAY 9 PM EST"],["Account"],[""]],o=[],i=1;for(let e of r){s[1][i]=`Week ending ${tR(e)}`;for(let e=1;e<n.length;e+=1)s[1][i+e]="";n.forEach((e,t)=>{s[2][i+t]=e}),o.push({s:{r:1,c:i},e:{r:1,c:i+n.length-1}}),i+=n.length}for(let e of a){let a=[e];for(let n of r){let r=t.find(t=>t.snapshotWeek===n&&t.accountNumber===e);a.push(r?.buyValue??"",r?.sellValue??"")}s.push(a)}let l=Math.max(1,i-1);o.push({s:{r:0,c:0},e:{r:0,c:l}},{s:{r:1,c:0},e:{r:2,c:0}}),s.push([],["BACKUP AUDIT"],["Week Ending","Account","Buy Value","Sell Value","Buy Count","Sell Count","Captured At","Source"]),t.forEach(e=>{s.push([tR(e.snapshotWeek),e.accountNumber,e.buyValue,e.sellValue,e.buyCount,e.sellCount,tF(e.capturedAt),e.source])});let c=tt.utils.aoa_to_sheet(s);c["!merges"]=o,c["!cols"]=tO(s,11,28),c["!cols"]&&(c["!cols"][0]={wch:18}),tI(c,1,3),t_(c,0,0,0,l,tA(tr)),t_(c,1,1,0,l,tT(ts)),t_(c,2,2,0,l,tT(to)),a.forEach((e,t)=>{let r=t+3;tN(c,r,0,tT(tg));for(let e=1;e<=l;e+=1)tN(c,r,e,tC("right"),tx)});let f=a.length+4,h=f+1;t_(c,f,f,0,7,tA(ta)),t_(c,h,h,0,7,tT(ts));for(let e=h+1;e<s.length;e+=1){for(let t=0;t<8;t+=1)tN(c,e,t,tC([2,3,4,5].includes(t)?"right":"left"));tN(c,e,2,tC("right"),tx),tN(c,e,3,tC("right"),tx)}return c}(t),"Transaction History"),tt.utils.book_append_sheet(r,function(e){let t=[["PORTFOLIO WORKBOOK"],["Generated",tF(new Date)],["Accounts",e.accounts.length],["Active Holdings",e.accounts.reduce((e,t)=>e+t.holdings.length,0)],["Transactions",e.futureInvestments.length],[],["Portfolio Snapshot"],["Account Value",e.grandTotal.accountOverallMoney],["Cash Balance",e.grandTotal.cashAvailable],["Amount Invested",e.grandTotal.amountInvested],["Investment - Current Value",e.grandTotal.investmentCurrent],["Gain/Loss",e.grandTotal.gainLoss],["Gain/Loss %",e.grandTotal.gainLossPercent/100],[],["Workbook Sections"],["Account's Summary","Balances and account-level portfolio totals"],["Consolidated View - Account Level","Current holdings, market values, and gain/loss"],["Daily Transactions","Buy and sell transaction history"],["Weekly History","Account value history with weekly and monthly views"],["Transaction History","Weekly and monthly account-level Buy and Sell values"]],r=tt.utils.aoa_to_sheet(t);r["!merges"]=[{s:{r:0,c:0},e:{r:0,c:3}},{s:{r:6,c:0},e:{r:6,c:3}},{s:{r:14,c:0},e:{r:14,c:3}}],r["!cols"]=[{wch:28},{wch:48},{wch:4},{wch:4}],r["!rows"]=[{hpt:28}],t_(r,0,0,0,3,tA(tn)),t_(r,6,6,0,3,tA(tr)),t_(r,14,14,0,3,tA(tr));for(let e=1;e<=4;e+=1)tN(r,e,0,tT("E2F0D9")),tN(r,e,1,tC("left"));for(let e=7;e<=12;e+=1)tN(r,e,0,tT(ts)),tN(r,e,1,tC("right"),12===e?tv:tx);for(let e=15;e<=19;e+=1)tN(r,e,0,tT(to)),tN(r,e,1,tC("left"));return r}(t),"Overview"),tt.writeFile(r,`Portfolio_Investments_${new Date().toISOString().slice(0,10)}.xlsx`,{cellStyles:!0,compression:!0}),ei("Excel exported with weekly history!")}catch(e){console.error(e),ei(e instanceof Error?`Export failed: ${e.message}`:"Export failed","error")}},ev=async e=>{if(!/\.(xlsx|xls)$/i.test(e.name))return void ei("Select an Excel .xlsx or .xls file.","error");try{m(!0);let t=function(e){let t=tt.read(e,{type:"array",cellDates:!0,cellStyles:!0}),r={accounts:function(e){let t=tB(e,["Account's Summary","Account Summary"]),r=t.findIndex(e=>{let t=new Set(e.map(tP));return t.has(tP("Account"))&&(t.has(tP("Cash Balance"))||t.has(tP("Cash Available")))});if(r<0)throw Error('The workbook is missing a valid "Account\'s Summary" sheet.');let a=tz(t[r]),n=tW(a,["Account"]),s=tW(a,["Account Name"]),o=tW(a,["Cash Balance","Cash Available"]),i=tW(a,["Comments"]);return t.slice(r+1).map(e=>{let t=String(tH(e,n)).trim(),r=String(e[0]??"").trim();return!t||/^total$/i.test(r)||/^total$/i.test(t)||/^all\s+accounts$/i.test(t)?null:{accountNumber:t,accountName:String(tH(e,s)).trim()||t,cashAvailable:tL(tH(e,o)),comments:String(tH(e,i)).trim()}}).filter(e=>null!==e)}(t),holdings:function(e){let t=tB(e,["Consolidated View-Account Level","Consolidation Inventory"]),r=t$(t,["Symbol","Account","Quantity"]);if(r<0)return[];let a=tz(t[r]),n=tW(a,["Symbol"]),s=tW(a,["Account"]),o=tW(a,["Quantity"]),i=tW(a,["Avg Price","Purchase Price/Average Cost"]),l=tW(a,["Current Price","Current Price/Share"]),c=tW(a,["Comments"]),f=tW(a,["Last Updated","Updated Date"]);return t.slice(r+1).map(e=>{let t=String(tH(e,n)).trim().toUpperCase(),r=String(tH(e,s)).trim();if(!t||!r||/^total\b/i.test(t))return null;let a=tL(tH(e,o)),h=tL(tH(e,i));return a<=0||h<0?null:{accountNumber:r,symbol:t,quantity:a,purchasePrice:h,currentPrice:tL(tH(e,l),h),comments:String(tH(e,c)).trim(),updatedAt:f>=0&&tH(e,f)?tD(tH(e,f)):void 0}}).filter(e=>null!==e)}(t),transactions:function(e){let t=tU(e,"Daily Transactions"),r=t$(t,["Symbol","Account","Quantity","Buy / Sell"]);if(r<0)return[];let a=tz(t[r]),n=tW(a,["Transaction ID","ID"]),s=tW(a,["Symbol"]),o=tW(a,["Account"]),i=tW(a,["Date/Time","Date/time"]),l=tW(a,["Buy / Sell","Action"]),c=tW(a,["Quantity"]),f=tW(a,["Price Per Share"]),h=tW(a,["Current Price"]),d=tW(a,["Comments"]),u=tW(a,["Status"]),p=tW(a,["Remaining Quantity"]),m=tW(a,["Source Buy ID"]),g=tW(a,["Average Cost","Cost Basis Per Share"]);return t.slice(r+1).map(e=>{let t=String(tH(e,s)).trim().toUpperCase(),r=String(tH(e,o)).trim(),a=String(tH(e,l)).trim().toUpperCase();if(!t||!r||!["BUY","SELL"].includes(a))return null;let b=tL(tH(e,c)),x=tL(tH(e,f));if(b<=0||x<=0)return null;let v=tL(tH(e,n),0),y=tL(tH(e,m),0),w=tL(tH(e,p),-1);return{importId:v>0?v:void 0,accountNumber:r,dateTime:tD(tH(e,i)),action:a,symbol:t,quantity:b,pricePerShare:x,currentPrice:tL(tH(e,h),x),costBasisPerShare:g>=0?tL(tH(e,g),x):void 0,comments:String(tH(e,d)).trim(),status:String(tH(e,u)).trim()||"EXECUTED",remainingQuantity:w>=0?w:"BUY"===a?b:void 0,sourceImportId:y>0?y:void 0}}).filter(e=>null!==e)}(t),weeklyHistory:function(e){let t=tU(e,"Weekly History");if(0===t.length)return[];let r=function(e){let t=t$(e,["Week Ending","Account","Source"]);if(t<0)return[];let r=tz(e[t]),a=tW(r,["Week Ending"]),n=tW(r,["Account"]),s=tW(r,["Investment Current Value"]),o=tW(r,["Gain/Loss Amount"]),i=tW(r,["Gain/Loss %"]),l=tW(r,["Captured At"]),c=tW(r,["Source"]);return s<0||o<0||i<0?[]:e.slice(t+1).map(e=>{let t=tM(tH(e,a)),r=String(tH(e,n)).trim();if(!t||!r)return null;let f=tL(tH(e,i));return{accountNumber:r,snapshotWeek:t,investmentCurrentValue:tL(tH(e,s)),gainLossAmount:tL(tH(e,o)),gainLossPercent:1>=Math.abs(f)?100*f:f,capturedAt:tH(e,l)?tD(tH(e,l)):void 0,source:String(tH(e,c)).trim()||"IMPORTED_EXCEL"}}).filter(e=>null!==e)}(t);return r.length>0?r:function(e){let t=e.findIndex(e=>e.some(e=>"periodaccount"===tP(e)));if(t<0||!e[t+1])return[];let r=e[t],a=e[t+1],n=e.slice(t+2,t+8),s=n.find(e=>tP(e[0]).includes("investmentcurrentvalue")),o=n.find(e=>tP(e[0]).includes("gainlossamount")),i=n.find(e=>tP(e[0]).includes("gainloss")&&tP(e[0]).includes("%"));if(!s||!o||!i)return[];let l=[],c="";for(let e=1;e<Math.max(r.length,a.length);e+=1){r[e]&&(c=tM(r[e]));let t=String(a[e]??"").trim();if(!c||!t||/summary/i.test(t))continue;let n=tL(i[e]);l.push({accountNumber:t,snapshotWeek:c,investmentCurrentValue:tL(s[e]),gainLossAmount:tL(o[e]),gainLossPercent:1>=Math.abs(n)?100*n:n,source:"IMPORTED_EXCEL"})}return l}(t)}(t),transactionHistory:function(e){let t=tU(e,"Transaction History"),r=t$(t,["Week Ending","Account","Buy Value","Sell Value"]);if(r<0)return[];let a=tz(t[r]),n=tW(a,["Week Ending"]),s=tW(a,["Account"]),o=tW(a,["Buy Value"]),i=tW(a,["Sell Value"]),l=tW(a,["Net Cash Flow"]),c=tW(a,["Realized Gain/Loss"]),f=tW(a,["Buy Count"]),h=tW(a,["Sell Count"]),d=tW(a,["Captured At"]),u=tW(a,["Source"]);return t.slice(r+1).map(e=>{let t=tM(tH(e,n)),r=String(tH(e,s)).trim();return t&&r?{accountNumber:r,snapshotWeek:t,buyValue:tL(tH(e,o)),sellValue:tL(tH(e,i)),netCashFlow:tL(tH(e,l)),realizedGainLoss:tL(tH(e,c)),buyCount:Math.max(0,Math.round(tL(tH(e,f)))),sellCount:Math.max(0,Math.round(tL(tH(e,h)))),capturedAt:tH(e,d)?tD(tH(e,d)):void 0,source:String(tH(e,u)).trim()||"IMPORTED_EXCEL"}:null}).filter(e=>null!==e)}(t)};if(0===r.accounts.length)throw Error("No account records were found in the Excel workbook.");return r}(await e.arrayBuffer());if(!window.confirm(`Import ${e.name}?

${t.accounts.length} accounts
${t.holdings.length} inventory holdings
${t.transactions.length} daily transactions
${t.weeklyHistory.length} account history rows
${t.transactionHistory.length} transaction history rows

This replaces the current accounts, inventory, and transactions.`))return;let r=await fetch("/api/portfolio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"import-excel-data",data:t})}),n=await r.json();if(!r.ok)throw Error(n.error||"Excel import failed");a(n.portfolio.accounts||[]),s(n.portfolio.grandTotal||{}),i(n.portfolio.futureInvestments||[]),c(new Date().toISOString()),b("future"),v("ALL"),ei(`Imported ${n.result.accounts} accounts, ${n.result.holdings} holdings, ${n.result.transactions} transactions, ${n.result.weeklyHistory} account history rows, and ${n.result.transactionHistory} transaction history rows.`)}catch(e){console.error(e),ei(e instanceof Error?`Import failed: ${e.message}`:"Import failed","error")}finally{m(!1)}},ey=e.map(e=>e.accountNumber);return(0,t.jsxs)("div",{className:"workbook-shell min-h-screen text-slate-800 flex flex-col font-sans selection:bg-emerald-200",children:[(0,t.jsx)(S,{onRefreshMarket:ec,isRefreshing:d,refreshCountdown:E,autoRefreshInterval:A,setAutoRefreshInterval:C,onExportExcel:ex,onImportExcel:ev,isImporting:p,lastRefreshed:l,activeSheet:g,onSelectSheet:e=>{b(e),"future"===e&&v("ALL")}}),es&&(0,t.jsxs)("div",{className:`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold animate-in slide-in-from-top-2 duration-200 ${"success"===es.type?"bg-emerald-800 text-white":"error"===es.type?"bg-red-800 text-white":"bg-blue-800 text-white"}`,children:["success"===es.type?(0,t.jsx)(ep,{className:"w-4 h-4 text-emerald-300"}):(0,t.jsx)(eE,{className:"w-4 h-4 text-amber-300"}),(0,t.jsx)("span",{children:es.text})]}),(0,t.jsx)("main",{className:`flex-1 w-full mx-auto ${"future"===g||"buy"===g||"sell"===g?"max-w-none px-1 sm:px-2 py-1":"max-w-[1700px] p-2 sm:p-4"}`,children:f?(0,t.jsxs)("div",{className:"flex flex-col items-center justify-center py-20 text-gray-500",children:[(0,t.jsx)(T,{className:"w-8 h-8 animate-spin text-emerald-600 mb-2"}),(0,t.jsx)("span",{className:"font-semibold text-sm",children:"Loading Excel Workbook & Market Data..."})]}):"analytics"===g?(0,t.jsx)(e3,{accounts:e,grandTotal:n}):"market"===g?(0,t.jsx)(eq,{defaultAccount:e[0]?.accountNumber||"CS - 9271",onQuickTrade:(e,t,r)=>{G(e),Y(t),q(r),Q(void 0),ee(void 0),er(void 0),en(void 0),_(!0)},onRefresh:ec,isRefreshing:d}):"inventory"===g?(0,t.jsx)(ed,{accountGroups:e.map(e=>({accountNumber:e.accountNumber,accountName:e.accountName,amountInvested:e.amountInvested,investmentCurrent:e.investmentCurrent,gainLoss:e.gainLoss,gainLossPercent:e.gainLossPercent,holdings:e.holdings||[]})),selectedCell:y,onSelectCell:w,onAddNewHolding:e=>{M(null),G(e),L(!0)},onSaveInlineField:eh}):"future"===g||"buy"===g||"sell"===g?(0,t.jsx)("div",{className:"space-y-4",children:(0,t.jsx)(ew,{entries:o,inventoryAccounts:e,selectedCell:y,onSelectCell:w,onOpenAddModal:(t="BUY")=>{G(e[0]?.accountNumber||""),Y("SELL"===t?"GOOG":"SOXL"),q(t),Q(void 0),ee(void 0),er(void 0),en(void 0),_(!0)},onSellSelected:e=>{G(e.accountNumber),Y(e.symbol),q("SELL"),ee(e.remainingQuantity),Q(e.remainingQuantity),er(e.id),en(e.pricePerShare??e.costBasisPerShare??e.averageCost),_(!0)},onSaveInlineField:eu,activeOrderTypeTab:"buy"===g?"BUY":"sell"===g?"SELL":x,onSelectOrderTypeTab:e=>{v(e),("buy"===g||"sell"===g)&&b("ALL"===e?"future":e.toLowerCase())}})}):(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(W,{accounts:e,grandTotal:n,selectedCell:y,onSelectCell:w,onEditAccount:e=>{H(e),B(!0)},onAddAccount:()=>{H(null),B(!0)}}),(0,t.jsx)(e6,{}),(0,t.jsx)(te,{})]})}),(0,t.jsx)(eF,{isOpen:N,onClose:()=>{_(!1),Q(void 0),ee(void 0),er(void 0),en(void 0)},accounts:e,initialAccount:V,initialSymbol:X,initialAction:K,initialQuantity:J,maxQuantity:Z,sourceTransactionId:et,initialCostBasis:ea,onSubmit:ef}),(0,t.jsx)(eP,{isOpen:O,onClose:()=>{I(!1),j(null)},entry:R,accountNumbers:ey,onSubmit:em}),(0,t.jsx)(eM,{isOpen:P,onClose:()=>{L(!1),M(null)},holdingToEdit:D,defaultAccountNumber:V||e[0]?.accountNumber,accountNumbers:ey,onSubmit:eg}),(0,t.jsx)(e$,{isOpen:U,onClose:()=>{B(!1),H(null)},accountToEdit:z,onSubmit:eb})]})}],52683)
})(e);

export default exportedDefault;
