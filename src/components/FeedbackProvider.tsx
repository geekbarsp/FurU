"use client";
import { CheckCircle2,Info,X } from "lucide-react";
import { createContext,useCallback,useContext,useState } from "react";

type Toast={id:number;message:string;tone?:"success"|"info"};
const FeedbackContext=createContext<{notify:(message:string,tone?:Toast["tone"])=>void}>({notify:()=>undefined});

export function FeedbackProvider({children}:{children:React.ReactNode}){
 const [toasts,setToasts]=useState<Toast[]>([]);
 const notify=useCallback((message:string,tone:Toast["tone"]="success")=>{const id=Date.now();setToasts(items=>[...items,{id,message,tone}]);setTimeout(()=>setToasts(items=>items.filter(item=>item.id!==id)),3400)},[]);
 return <FeedbackContext.Provider value={{notify}}>{children}<div className="toast-stack" aria-live="polite">{toasts.map(toast=><div className="toast" key={toast.id}>{toast.tone==="success"?<CheckCircle2 size={19}/>:<Info size={19}/>}<span>{toast.message}</span><button onClick={()=>setToasts(items=>items.filter(item=>item.id!==toast.id))} aria-label="Dismiss"><X size={16}/></button></div>)}</div></FeedbackContext.Provider>
}
export const useFeedback=()=>useContext(FeedbackContext);

export function Dialog({open,title,children,onClose}:{open:boolean;title:string;children:React.ReactNode;onClose:()=>void}){if(!open)return null;return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={e=>e.stopPropagation()}><button className="icon-btn dialog-close" onClick={onClose} aria-label="Close dialog"><X size={18}/></button><h2 id="dialog-title">{title}</h2>{children}</section></div>}
