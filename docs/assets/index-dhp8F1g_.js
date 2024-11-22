var ht=Object.defineProperty;var et=h=>{throw TypeError(h)};var ut=(h,t,s)=>t in h?ht(h,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):h[t]=s;var A=(h,t,s)=>ut(h,typeof t!="symbol"?t+"":t,s),y=(h,t,s)=>t.has(h)||et("Cannot "+s);var c=(h,t,s)=>(y(h,t,"read from private field"),s?s.call(h):t.get(h)),p=(h,t,s)=>t.has(h)?et("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(h):t.set(h,s),E=(h,t,s,e)=>(y(h,t,"write to private field"),e?e.call(h,s):t.set(h,s),s),d=(h,t,s)=>(y(h,t,"access private method"),s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();function lt(h,t){return[h[0]+t[0],h[1]+t[1],h[2]+t[2]]}function z(h,t){return[h[0]-t[0],h[1]-t[1],h[2]-t[2]]}function T(h,t,s=.5){const e=1-s;return[h[0]*e+t[0]*s,h[1]*e+t[1]*s,h[2]*e+t[2]*s]}var P,G,I,q,j,nt;const Q=class Q{constructor(t,s){p(this,j);p(this,P);p(this,G);p(this,I);p(this,q);const e=Math.sqrt(s[0]*s[0]+s[1]*s[1]+s[2]*s[2]);E(this,P,s[0]/e),E(this,G,s[1]/e),E(this,I,s[2]/e),E(this,q,-c(this,P)*t[0]-c(this,G)*t[1]-c(this,I)*t[2])}side(t){const s=c(this,P)*t[0]+c(this,G)*t[1]+c(this,I)*t[2]+c(this,q);return s<-Q.E?-1:s>Q.E?1:0}sides(t){const s=new Map;for(const e of t)s.set(e,this.side(e));return s}intersections(t){const s=new Map;for(const e of t){if(s.has(e))continue;const n=d(this,j,nt).call(this,e.getBegin(),e.getEnd());n&&(s.set(e,n),e.pair&&s.set(e.pair,n))}return s}};P=new WeakMap,G=new WeakMap,I=new WeakMap,q=new WeakMap,j=new WeakSet,nt=function(t,s){const e=c(this,P)*(t[0]-s[0])+c(this,G)*(t[1]-s[1])+c(this,I)*(t[2]-s[2]);if(Math.abs(e)<.001)return null;const n=(c(this,P)*t[0]+c(this,G)*t[1]+c(this,I)*t[2]+c(this,q))/e;return n<0||1<n?null:[t[0]+n*(s[0]-t[0]),t[1]+n*(s[1]-t[1]),t[2]+n*(s[2]-t[2])]},A(Q,"E",.001);let X=Q;var V,R;class W{constructor(t){p(this,V);p(this,R);A(this,"next",null);A(this,"pair",null);E(this,V,t)}setNext(t){this.next=t,E(this,R,c(t,V))}getBegin(){return c(this,V)}getEnd(){return c(this,R)}}V=new WeakMap,R=new WeakMap;var m,g,Y,Z,_,K,it,ot;const b=class b{constructor(t){p(this,g);p(this,m);const s=t.length;for(let e=0;e<s-1;++e)t[e].setNext(t[e+1]);t[s-1].setNext(t[0]),E(this,m,t[0])}length(){let t=0,s=c(this,m);do t+=1,s=s.next;while(s!==c(this,m));return t}verticesOf(t,s,e){const n=[];let i=c(this,m);do{const o=i.getBegin();s.get(o)*t>=0&&n.push(o),e.has(i)&&n.push(e.get(i)),i=i.next}while(i!==c(this,m));return n}countGridPoints(t,s,e){let n=0;const i=d(this,g,Y).call(this,t,s,e);n+=i;for(let o=1;;++o){const r=d(this,g,Y).call(this,t,s+o*e,e);if(r===0)break;n+=r}for(let o=1;;++o){const r=d(this,g,Y).call(this,t,s-o*e,e);if(r===0)break;n+=r}return n}getGridPoints(t,s,e){const n=[],i=c(this,m).getBegin()[2],o=d(this,g,Z).call(this,t,s,e);for(const r of o)n.push([r,s,i]);for(let r=1;;++r){const f=s+r*e,l=d(this,g,Z).call(this,t,f,e);if(l.length===0)break;for(const u of l)n.push([u,f,i])}for(let r=1;;++r){const f=s-r*e,l=d(this,g,Z).call(this,t,f,e);if(l.length===0)break;for(const u of l)n.push([u,f,i])}return n}};m=new WeakMap,g=new WeakSet,Y=function(t,s,e){const n=d(this,g,_).call(this,s);let[i,o]=n;i>o&&([i,o]=[o,i]);let r=0;i<t&&t<o&&(r+=1);for(let f=1;;++f){const l=r,u=t+f*e;if(i<u&&u<o&&(r+=1),r===l)break}for(let f=1;;++f){const l=r,u=t-f*e;if(i<u&&u<o&&(r+=1),r===l)break}return r},Z=function(t,s,e){const n=d(this,g,_).call(this,s);let[i,o]=n;i>o&&([i,o]=[o,i]);const r=[];i<t&&t<o&&r.push(t);for(let f=1;;++f){const l=r.length,u=t+f*e;if(i<u&&u<o&&r.push(u),r.length===l)break}for(let f=1;;++f){const l=r.length,u=t-f*e;if(i<u&&u<o&&r.push(u),r.length===l)break}return r},_=function(t){var e,n;const s=[];for(let i=c(this,m);;i=i.next){const o=d(e=b,K,it).call(e,i,t);if(s.push(...o),i.next===c(this,m))break}return d(n=b,K,ot).call(n,s)},K=new WeakSet,it=function(t,s){const[e,n]=t.getBegin(),[i,o]=t.getEnd();if(s<Math.min(n,o)||Math.max(n,o)<s)return[];if(Math.abs(n-o)<b.E)return[e,i];const r=o-n,f=-(i-e),l=-r*e-f*n;return Math.abs(r)<b.E?[]:[-(f*s+l)/r]},ot=function(t){if(t.length===0)return[];t.sort((n,i)=>n-i);const s=[];let e=t[0];for(let n=1;n<t.length;n++)b.E<t[n]-t[n-1]&&(s.push(e),e=t[n]);return s.push(e),s},p(b,K),A(b,"E",.001);let C=b;var O,B,D,k,$,tt;const S=class S{constructor(){p(this,O,[]);p(this,B,[]);p(this,D,[])}static buildMesh(t,s){var n;const e=new S;for(const i of t)c(e,O).push([...i]);for(const i of s){const o=[];for(const r of i)o.push(new W(c(e,O)[r]));c(e,B).push(...o),c(e,D).push(new C(o))}return d(n=S,k,$).call(n,c(e,B)),e}splitMesh(t,s){var u,U;const e=t.side(s);if(e===0)return;const n=t.intersections(c(this,B));if(n.size===0)return;const i=t.sides(c(this,O)),o=[],r=[],f=[];for(const a of c(this,D)){const v=a.verticesOf(e,i,n);if(v.length<=2)continue;const x=[];for(const H of v)o.includes(H)||o.push(H),x.push(new W(H));r.push(...x),f.push(new C(x))}d(u=S,k,$).call(u,r);const l=r.filter(a=>a.pair===null);if(l.length>0){const a=d(U=S,k,tt).call(U,l);r.push(...a),f.push(new C(a))}E(this,O,o),E(this,D,f),E(this,B,r)}crossSection(t,s){var u,U;const e=new X(t,s),n=e.side(lt(t,s));if(n===0)return null;const i=e.intersections(c(this,B));if(i.size===0)return null;const o=e.sides(c(this,O)),r=[],f=[];for(const a of c(this,D)){const v=a.verticesOf(n,o,i);if(v.length<=2)continue;const x=[];for(const H of v)x.push(new W(H));r.push(...x),f.push(new C(x))}d(u=S,k,$).call(u,r);const l=r.filter(a=>a.pair===null);if(l.length>0){const a=d(U=S,k,tt).call(U,l);if(a.length>2)return new C(a)}return null}};O=new WeakMap,B=new WeakMap,D=new WeakMap,k=new WeakSet,$=function(t){for(const s of t)if(s.pair===null){for(const e of t)if(!(s===e||e.pair!==null)&&s.getBegin()===e.getEnd()&&e.getBegin()===s.getEnd()){s.pair=e,e.pair=s;break}}},tt=function(t){const s=[];let e=t[0];do{if(e.next===null)break;let n=e.next;for(;n&&!t.includes(n);)n=n.pair.next;const i=new W(n.getBegin());s.push(i),i.pair=e,e.pair=i,e=n}while(e!==t[0]);return s.reverse(),s},p(S,k);let J=S;var F,w,M,N,rt,ct,ft;const L=class L{constructor(t,s,e,n,i,o){p(this,N);p(this,F);p(this,w,[]);p(this,M,[]);E(this,F,[[s,n,o],[t,n,o],[t,n,i],[s,n,i],[s,e,o],[t,e,o],[t,e,i],[s,e,i]])}addSite(t){c(this,w).push([...t])}createCells(t=null,s=null){c(this,M).length=0,!t&&!s?d(this,N,rt).call(this):t&&!s?d(this,N,ct).call(this,t):t&&s&&d(this,N,ft).call(this,t,s)}countGrids(t,s){let e=0;const n=[0,0,1],i=c(this,w)[t],o=c(this,M)[t],r=o.crossSection([0,0,i[2]],n);if(r){const f=r.countGridPoints(i[0],i[1],s);e+=f}for(let f=1;;++f){const l=o.crossSection([0,0,i[2]+f*s],n);if(!l)break;const u=l.countGridPoints(i[0],i[1],s);if(!u)break;e+=u}for(let f=1;;++f){const l=o.crossSection([0,0,i[2]-f*s],n);if(!l)break;const u=l.countGridPoints(i[0],i[1],s);if(!u)break;e+=u}return e}getGrids(t,s){const e=[],n=[0,0,1],i=c(this,w)[t],o=c(this,M)[t],r=o.crossSection([0,0,i[2]],n);r&&e.push(...r.getGridPoints(i[0],i[1],s));for(let f=1;;++f){const l=o.crossSection([0,0,i[2]+f*s],n);if(!l)break;const u=l.getGridPoints(i[0],i[1],s);if(!u.length)break;e.push(...u)}for(let f=1;;++f){const l=o.crossSection([0,0,i[2]-f*s],n);if(!l)break;const u=l.getGridPoints(i[0],i[1],s);if(!u.length)break;e.push(...u)}return e}};F=new WeakMap,w=new WeakMap,M=new WeakMap,N=new WeakSet,rt=function(){for(const t of c(this,w)){const s=J.buildMesh(c(this,F),L.FACE_INDEXES);for(const e of c(this,w)){if(t===e)continue;const n=new X(T(t,e),z(t,e));s.splitMesh(n,t)}c(this,M).push(s)}},ct=function(t){for(const[s,e]of c(this,w).entries()){const n=J.buildMesh(c(this,F),L.FACE_INDEXES);for(let i of t[s]){const o=c(this,w)[i],r=new X(T(e,o),z(e,o));n.splitMesh(r,e)}c(this,M).push(n)}},ft=function(t,s){for(const[e,n]of c(this,w).entries()){const i=J.buildMesh(c(this,F),L.FACE_INDEXES),o=t[e],r=s[e];for(let f=0;f<o.length;++f){const l=c(this,w)[o[f]],u=new X(T(n,l,r[f]),z(n,l));i.splitMesh(u,n)}c(this,M).push(i)}},A(L,"FACE_INDEXES",[[0,1,2,3],[1,0,4,5],[0,3,7,4],[2,1,5,6],[5,4,7,6],[3,2,6,7]]);let st=L;document.addEventListener("DOMContentLoaded",()=>{dt()});function dt(){const h=[[[0,3,1],[2,0,2]],[[0,0,1],[3,2,2]],[[0,1,0],[2,2,3]],[[2,3,0],[1,0,2]]];for(const t of h){const s=new st(0,3,0,3,0,3);for(const n of t)s.addSite(n);s.createCells();let e=0;for(let n=0;n<t.length;++n){const i=s.countGrids(n,.1);console.log(t[n].toString(),i),e+=i}console.log(e)}}
