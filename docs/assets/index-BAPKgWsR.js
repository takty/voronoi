var it=Object.defineProperty;var _=c=>{throw TypeError(c)};var ot=(c,t,s)=>t in c?it(c,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):c[t]=s;var z=(c,t,s)=>ot(c,typeof t!="symbol"?t+"":t,s),W=(c,t,s)=>t.has(c)||_("Cannot "+s);var o=(c,t,s)=>(W(c,t,"read from private field"),s?s.call(c):t.get(c)),d=(c,t,s)=>t.has(c)?_("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(c):t.set(c,s),w=(c,t,s,e)=>(W(c,t,"write to private field"),e?e.call(c,s):t.set(c,s),s),a=(c,t,s)=>(W(c,t,"access private method"),s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&e(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();function rt(c,t){return[c[0]+t[0],c[1]+t[1],c[2]+t[2]]}function Y(c,t){return[c[0]-t[0],c[1]-t[1],c[2]-t[2]]}function Z(c,t,s=.5){const e=1-s;return[c[0]*e+t[0]*s,c[1]*e+t[1]*s,c[2]*e+t[2]*s]}var F,G,B,x,R,y;class J{constructor(t,s){d(this,R);d(this,F);d(this,G);d(this,B);d(this,x);const e=Math.sqrt(s[0]*s[0]+s[1]*s[1]+s[2]*s[2]);w(this,F,s[0]/e),w(this,G,s[1]/e),w(this,B,s[2]/e),w(this,x,-o(this,F)*t[0]-o(this,G)*t[1]-o(this,B)*t[2])}side(t){const s=o(this,F)*t[0]+o(this,G)*t[1]+o(this,B)*t[2]+o(this,x);return s<-.001?-1:s>.001?1:0}sides(t){const s=new Map;for(const e of t)s.set(e,this.side(e));return s}intersections(t){const s=new Map;for(const e of t){if(s.has(e))continue;const n=a(this,R,y).call(this,e.getBegin(),e.getEnd());n&&(s.set(e,n),e.pair&&s.set(e.pair,n))}return s}}F=new WeakMap,G=new WeakMap,B=new WeakMap,x=new WeakMap,R=new WeakSet,y=function(t,s){const e=o(this,F)*(t[0]-s[0])+o(this,G)*(t[1]-s[1])+o(this,B)*(t[2]-s[2]);if(Math.abs(e)<.001)return null;const n=(o(this,F)*t[0]+o(this,G)*t[1]+o(this,B)*t[2]+o(this,x))/e;return n<0||1<n?null:[t[0]+n*(s[0]-t[0]),t[1]+n*(s[1]-t[1]),t[2]+n*(s[2]-t[2])]};var X,U;class H{constructor(t){d(this,X);d(this,U);z(this,"next",null);z(this,"pair",null);w(this,X,t)}setNext(t){this.next=t,w(this,U,o(t,X))}getBegin(){return o(this,X)}getEnd(){return o(this,U)}}X=new WeakMap,U=new WeakMap;var N,g,v,T,tt;class V{constructor(t){d(this,g);d(this,N);const s=t.length;for(let e=0;e<s-1;++e)t[e].setNext(t[e+1]);t[s-1].setNext(t[0]),w(this,N,t[0])}length(){let t=0,s=o(this,N);do t+=1,s=s.next;while(s!==o(this,N));return t}verticesOf(t,s,e){const n=[];let i=o(this,N);do{const r=i.getBegin();s.get(r)*t>=0&&n.push(r),e.has(i)&&n.push(e.get(i)),i=i.next}while(i!==o(this,N));return n}countGridPoints(t,s,e){let n=0;const i=a(this,g,v).call(this,t,s,e);for(const r of i)n+=1;for(let r=1;;++r){const f=n,h=a(this,g,v).call(this,t,s+r*e,e);for(const l of h)n+=1;const u=a(this,g,v).call(this,t,s-r*e,e);for(const l of u)n+=1;if(n===f)break}return n}getGridPoints(t,s,e){const n=[],i=o(this,N).getBegin()[2],r=a(this,g,v).call(this,t,s,e);for(const f of r)n.push([f,s,i]);for(let f=1;;++f){const h=n.length,u=s+f*e,l=a(this,g,v).call(this,t,u,e);for(const P of l)n.push([P,u,i]);const E=s+-f*e,p=a(this,g,v).call(this,t,E,e);for(const P of p)n.push([P,E,i]);if(n.length===h)break}return n}}N=new WeakMap,g=new WeakSet,v=function(t,s,e){const n=[],i=a(this,g,T).call(this,s);if(i.length!==2)return n;let r=i[0],f=i[1];r>f&&([r,f]=[f,r]),r<t&&t<f&&n.push(t);for(let h=1;;++h){const u=n.length,l=t+h*e;r<l&&l<f&&n.push(l);const E=t+-h*e;if(r<E&&E<f&&n.push(E),n.length===u)break}return n},T=function(t){const s=[];for(let e=o(this,N);;e=e.next){const n=a(this,g,tt).call(this,e,t);if(Number.isNaN(n)||s.push(n),e.next===o(this,N))break}return s},tt=function(t,s){const e=t.getBegin(),n=t.getEnd();if(s<Math.min(e[1],n[1])||Math.max(e[1],n[1])<s)return Number.NaN;const i=n[1]-e[1],r=-(n[0]-e[0]),f=-i*e[0]-r*e[1];return Math.abs(i)<1e-4?Number.NaN:-(r*s+f)/i};var O,k,A,M,Q,$;const S=class S{constructor(){d(this,O,[]);d(this,k,[]);d(this,A,[])}static buildMesh(t,s){var n;const e=new S;for(const i of t)o(e,O).push([...i]);for(const i of s){const r=[];for(const f of i)r.push(new H(o(e,O)[f]));o(e,k).push(...r),o(e,A).push(new V(r))}return a(n=S,M,Q).call(n,o(e,k)),e}splitMesh(t,s){var l,E;const e=t.side(s);if(e===0)return;const n=t.intersections(o(this,k));if(n.size===0)return;const i=t.sides(o(this,O)),r=[],f=[],h=[];for(const p of o(this,A)){const P=p.verticesOf(e,i,n);if(P.length<=2)continue;const I=[];for(const q of P)r.includes(q)||r.push(q),I.push(new H(q));f.push(...I),h.push(new V(I))}a(l=S,M,Q).call(l,f);const u=f.filter(p=>p.pair===null);if(u.length>0){const p=a(E=S,M,$).call(E,u);f.push(...p),h.push(new V(p))}w(this,O,r),w(this,A,h),w(this,k,f)}crossSection(t,s){var l,E;const e=new J(t,s),n=e.side(rt(t,s));if(n===0)return null;const i=e.intersections(o(this,k));if(i.size===0)return null;const r=e.sides(o(this,O)),f=[],h=[];for(const p of o(this,A)){const P=p.verticesOf(n,r,i);if(P.length<=2)continue;const I=[];for(const q of P)I.push(new H(q));f.push(...I),h.push(new V(I))}a(l=S,M,Q).call(l,f);const u=f.filter(p=>p.pair===null);if(u.length>0){const p=a(E=S,M,$).call(E,u);if(p.length>2)return new V(p)}return null}};O=new WeakMap,k=new WeakMap,A=new WeakMap,M=new WeakSet,Q=function(t){for(const s of t)if(s.pair===null){for(const e of t)if(!(s===e||e.pair!==null)&&s.getBegin()===e.getEnd()&&e.getBegin()===s.getEnd()){s.pair=e,e.pair=s;break}}},$=function(t){const s=[];let e=t[0];do{if(e.next===null)break;let n=e.next;for(;n&&!t.includes(n);)n=n.pair.next;const i=new H(n.getBegin());s.push(i),i.pair=e,e.pair=i,e=n}while(e!==t[0]);return s.reverse(),s},d(S,M);let K=S;var D,m,b,C,st,et,nt;const L=class L{constructor(t,s,e,n,i,r){d(this,C);d(this,D);d(this,m,[]);d(this,b,[]);w(this,D,[[s,n,r],[t,n,r],[t,n,i],[s,n,i],[s,e,r],[t,e,r],[t,e,i],[s,e,i]])}addSite(t){o(this,m).push([...t])}createCells(t=null,s=null){o(this,b).length=0,!t&&!s?a(this,C,st).call(this):t&&!s?a(this,C,et).call(this,t):t&&s&&a(this,C,nt).call(this,t,s)}countGrids(t,s){let e=0;const n=[0,0,1],i=o(this,m)[t],r=o(this,b)[t],f=r.crossSection([0,0,i[2]],n);if(f){const h=f.countGridPoints(i[0],i[1],s);e+=h}for(let h=1;;++h){const u=r.crossSection([0,0,i[2]+h*s],n);if(!u)break;const l=u.countGridPoints(i[0],i[1],s);if(!l)break;e+=l}for(let h=1;;++h){const u=r.crossSection([0,0,i[2]-h*s],n);if(!u)break;const l=u.countGridPoints(i[0],i[1],s);if(!l)break;e+=l}return e}getGrids(t,s){const e=[],n=[0,0,1],i=o(this,m)[t],r=o(this,b)[t],f=r.crossSection([0,0,i[2]],n);f&&e.push(...f.getGridPoints(i[0],i[1],s));for(let h=1;;++h){const u=r.crossSection([0,0,i[2]+h*s],n);if(!u)break;const l=u.getGridPoints(i[0],i[1],s);if(!l.length)break;e.push(...l)}for(let h=1;;++h){const u=r.crossSection([0,0,i[2]-h*s],n);if(!u)break;const l=u.getGridPoints(i[0],i[1],s);if(!l.length)break;e.push(...l)}return e}};D=new WeakMap,m=new WeakMap,b=new WeakMap,C=new WeakSet,st=function(){for(const t of o(this,m)){const s=K.buildMesh(o(this,D),L.FACE_INDEXES);for(const e of o(this,m)){if(t===e)continue;const n=new J(Z(t,e),Y(t,e));s.splitMesh(n,t)}o(this,b).push(s)}},et=function(t){for(const[s,e]of o(this,m).entries()){const n=K.buildMesh(o(this,D),L.FACE_INDEXES);for(let i of t[s]){const r=o(this,m)[i],f=new J(Z(e,r),Y(e,r));n.splitMesh(f,e)}o(this,b).push(n)}},nt=function(t,s){for(const[e,n]of o(this,m).entries()){const i=K.buildMesh(o(this,D),L.FACE_INDEXES),r=t[e],f=s[e];for(let h=0;h<r.length;++h){const u=o(this,m)[r[h]],l=new J(Z(n,u,f[h]),Y(n,u));i.splitMesh(l,n)}o(this,b).push(i)}},z(L,"FACE_INDEXES",[[0,1,2,3],[1,0,4,5],[0,3,7,4],[2,1,5,6],[5,4,7,6],[3,2,6,7]]);let j=L;document.addEventListener("DOMContentLoaded",()=>{const c=[[0,6,5],[0,4,4]],t=new j(0,10,0,10,0,10);for(const s of c)t.addSite(s);t.createCells();for(let s=0;s<c.length;++s)console.log(c[s].toString(),t.countGrids(s,1))});
