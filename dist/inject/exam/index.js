let e;const t=new WeakMap,n=new WeakMap,o=n=>{if(!e)return;let o=t.get(n);if(!o){o=new Map;const r=new Set;return r.add(e),o.set("value",r),void t.set(n,o)}let r=o.get("value");if(!r)return r=new Set,r.add(e),o.set("value",r),void t.set(n,o);r.add(e)};function r(e,o,r,i){if(!n.get(e))return;const a=t.get(e);if(!a)return;let s=a.get(o);if(s)for(const e of s)e(r,i)}var i;!function(e){e.IS_REF="_isRef",e.IS_SHALLOW="_isShallow",e.IS_REACTIVE="_isReactive",e.IS_READONLY="_isReadonly"}(i||(i={}));class a{_isShallow=!1;_isRef=!0;_value;value;constructor(e,n=!1){const r=this;if(this._isShallow=n,e&&"object"==typeof e&&n){const t=w(e);this._value=t,this.value=e}else this._value=e,this.value=e;Object.defineProperty(this,"value",{get(){return o(this),r._value},set(e){const n=this._value;n!==e&&(r._value=e,function(e,n,o){const r=t.get(e);if(!r)return;let i=r.get("value");if(i)for(const e of i)e instanceof Function&&e(n,o)}(this,e,n))}})}toJSON(){return this._value}}const s=e=>!(!e||!e[i.IS_REF]),u=(e,t)=>new a(e,t),c=e=>s(e)?e.value:e,l=e=>s(e)?e:u(e,!0),f=e=>s(e)?e:u(e,!1),d=(o,r)=>function(a,u,c){if(u===i.IS_REACTIVE)return!o;if(u===i.IS_READONLY)return o;if(u===i.IS_SHALLOW)return r;const l=Reflect.get(a,u,c);return o||((o,r)=>{if(!e)return;if(!n.get(o))return;let i=t.get(o);if(!i){i=new Map;const n=new Set;return n.add(e),i.set(r,n),void t.set(o,i)}let a=i.get(r);if(!a)return a=new Set,a.add(e),i.set(r,a),void t.set(o,i);a.add(e)})(a,u),r?l:s(l)?l.value:l&&"object"==typeof l?l instanceof Element?l:o?m(l):w(l):l},p=(e,t)=>function(n,o,i,a){if(e)return!1;const u=n[o];if(h(u)&&s(u)&&!s(i))return!1;if(!t&&s(u)&&!s(i))return u.value=i,!0;const c=Reflect.set(n,o,i,a);return Array.isArray(n)&&"length"===o?(r(n,o,i,u),c):(u!==i&&r(n,o,i,u),c)},v=(e,t,o)=>{const r=n.get(e);if(r)return r;const i=new Proxy(e,((e,t)=>({get:d(e,t),set:p(e,t)}))(t,o));return n.set(e,i),i},h=e=>!(!e||!e[i.IS_READONLY]),g=e=>{return!(!(t=e)||!t[i.IS_REACTIVE])||h(e);var t},w=e=>(e=>v(e,!1,!1))(e),m=e=>(e=>v(e,!0,!1))(e),y=(t,n,r=!1)=>{if(r&&n(c(t),c(t)),Array.isArray(t)&&t.every((e=>s(e)))){for(const e in t)g(t[e])&&y(t[e],(()=>{const e=t.map((e=>c(e)));n(e,e)}));y((()=>t.map((e=>c(e)))),n)}else if(t instanceof Function)y(M(t),((e,t)=>{n(c(e),c(t))}));else{if(!g(t))return s(t)?(g(t.value)&&y(t.value,(()=>{n(c(t),c(t))})),e=n,o(t),void(e=void 0)):void 0;for(const o in t){e=()=>{n(t,t)};const r=t[o];e=void 0,y(r,(()=>{n(t,t)}))}}},b=t=>{e=t,t(),e=void 0},x=(e,t)=>{const n=f(t());return y(e,(()=>n.value=c(t()))),n},M=e=>{const t=f(void 0);return b((()=>t.value=c(e()))),t};function D(e,t,n,o,r){const i=l(!1),a=l(!1),u=l(!1),c=l(!1),{onCreated:f,beforeCreat:d,onMounted:p,beforeMount:v,beforeDestroy:h,onDestroyed:g}=r||{},w=e=>{const{onMounted:t,beforeMount:n,beforeDestroy:o,onDestroyed:r}=e;n&&y(i,(()=>{i.value&&n()}),!0),t&&y(a,(()=>{a.value&&t()}),!0),o&&y(u,(()=>{u.value&&o()}),!0),r&&y(c,(()=>{c.value&&r()}),!0)};d&&d();const m=document.createElement(e);!function(e,t){for(const n in t)if(s(t[n])){const o=t[n];b((()=>e[n]=o.value))}else e[n]=t[n]}(m,t),function(e,t,n,o){if(t)for(const o in t)S(e,o,t[o],n)}(m,n,w),function(e,t,n,o){if(s(t)){const r=document.createComment("");if(y(t,(async(t,i)=>{if(t||!i)if(t){if(i){if(i instanceof Promise){const e=await i;e&&e.forEach((e=>{o&&o(e),e.beforeDestroy&&e.beforeDestroy()}))}i instanceof Promise||i.forEach((e=>{o&&o(e),e.beforeDestroy&&e.beforeDestroy()}))}if(t instanceof Promise){const o=await t;if(o){const t=o.map((e=>((e.beforeMount||e.onMounted)&&n&&n(e),e.ele)));e.replaceChildren(C(t))}return}const r=t.map((e=>((e.beforeMount||e.onMounted)&&n&&n(e),e.ele)));if(e.replaceChildren(C(r)),i){if(i instanceof Promise){const e=await i;e&&e.forEach((e=>{e.onDestroyed&&e.onDestroyed()}))}i instanceof Promise||i.forEach((e=>{e.onDestroyed&&e.onDestroyed()}))}}else;else{if(i instanceof Promise){const e=await i;e&&e.forEach((e=>{o&&o(e),e.beforeDestroy&&e.beforeDestroy()}))}if(i instanceof Promise||i.forEach((e=>{o&&o(e),e.beforeDestroy&&e.beforeDestroy()})),e.replaceChildren(r),i instanceof Promise){const e=await i;e&&e.forEach((e=>{e.onDestroyed&&e.onDestroyed()}))}i instanceof Promise||i.forEach((e=>{e.onDestroyed&&e.onDestroyed()}))}})),t.value instanceof Promise)return e.appendChild(r),void t.value.then((t=>{if(t){const o=t.map((e=>((e.beforeMount||e.onMounted)&&n&&n(e),e.ele)));e.replaceChildren(C(o))}}));if(t.value){const o=t.value.map((e=>((e.beforeMount||e.onMounted)&&n&&n(e),e.ele)));return void e.appendChild(C(o))}return void e.appendChild(r)}if(t instanceof Promise){const o=document.createComment("");return e.appendChild(o),void t.then((e=>{if(e){const{beforeMount:t,onMounted:r}=e;(t||r)&&n&&n(e),o.replaceWith(e.ele)}}))}if(Array.isArray(t)){const r=[];for(const e in t){const i=t[e];if(s(i)){const t=document.createComment("");if(y(i,(async(e,r)=>{if(e||!r)if(!e||r){if(e&&r){if(e instanceof Promise&&r instanceof Promise){return void E(await e,await r,t,n,o)}if(e instanceof Promise&&!(r instanceof Promise)){return void E(await e,r,t,n,o)}if(!(e instanceof Promise)&&r instanceof Promise){return void E(e,await r,t,n,o)}if(!(r instanceof Promise||e instanceof Promise))return void E(e,r,t,n,o)}}else{if(e instanceof Promise){const i=await e;return void(i&&E(i,r,t,n,o))}E(e,r,t,n,o)}else{if(r instanceof Promise){const i=await r;return void(i&&E(e,i,t,n,o))}E(e,r,t,n,o)}})),i.value instanceof Promise){r[e]={ele:t},i.value.then((e=>{if(e){const{beforeMount:o,onMounted:r}=e;(o||r)&&n&&n(e),t.replaceWith(e.ele)}}));continue}if(i.value){const{beforeMount:t,onMounted:n,ele:o}=i.value;r[e]={ele:o,beforeMount:t,onMounted:n};continue}r[e]={ele:t}}else if(i instanceof Promise){const t=document.createComment("");r[e]={ele:t},i.then((e=>{if(e){const{beforeMount:o,onMounted:r}=e;(o||r)&&n&&n(e),t.replaceWith(e.ele)}}))}else if(i){const{beforeMount:t,onMounted:n,ele:o}=i;r[e]={ele:o,beforeMount:t,onMounted:n}}}const i=r.map((e=>((e.beforeMount||e.onMounted)&&n&&n(e),e.ele)));return void e.appendChild(C(i))}if(t){const{beforeMount:o,onMounted:r}=t;return(o||r)&&n&&n(t),void e.appendChild(t.ele)}}(m,o,w,(e=>{}));return f&&f(),{ele:m,beforeMount:()=>{i.value=!0,v&&v()},onMounted:()=>{a.value=!0,p&&p()},beforeDestroy:()=>{u.value=!0,h&&h()},onDestroyed:()=>{c.value=!0,g&&g()}}}function S(e,t,n,o,r){const i=t.toLowerCase();if(i.startsWith("on")){const[t]=i.match(/(?<=on).*/);if(t){const[o,...r]=t.split("_"),i=function(e){if(e.length)return{capture:e.includes("capture"),once:e.includes("once"),passive:e.includes("passive")}}(r);if(s(n)){const t=n,a=x(t,(()=>t.value?e=>{r.includes("prevent")&&e.preventDefault(),r.includes("stop")&&e.stopPropagation();(0,t.value)(e)}:void 0));return a.value&&e.addEventListener(o,a.value,i),void y(a,((t,n)=>{n&&e.removeEventListener(o,n),t&&e.addEventListener(o,t,i)}))}n instanceof Function&&e.addEventListener(o,n,i)}return}if(["checked","selected","disabled","enabled"].includes(i)){if(s(n)){const t=n;return void b((()=>{t.value?e.setAttribute(i,""):e.removeAttribute(i)}))}n?e.setAttribute(i,""):e.removeAttribute(i)}else if("ref"!==t)if(t.startsWith("xlink:")){const o="http://www.w3.org/1999/xlink";n?e.setAttributeNS(o,t,n):e.removeAttributeNS(o,t)}else if(t&&s(n)){const o=n;b((()=>{e.setAttribute(t,o.value)}))}else t&&e.setAttribute(t,n);else{if(s(n)){const t=n;return void(o&&o({onMounted(){t.value=e}}))}if(n instanceof Function){const t=n;return void(o&&o({onMounted(){t(e)}}))}}}function E(e,t,n,o,r){if(e&&t){const{beforeMount:n,onMounted:r}=e;return(n||r)&&o&&o(e),t.beforeDestroy&&t.beforeDestroy(),t.ele.replaceWith(e.ele),void(t.onDestroyed&&t.onDestroyed())}if(e&&!t){const{beforeMount:t,onMounted:r}=e;return(t||r)&&o&&o(e),void n.replaceWith(e.ele)}if(!e&&t)return r&&r(t),t.beforeDestroy&&t.beforeDestroy(),t.ele.replaceWith(n),void(t.onDestroyed&&t.onDestroyed())}function j(e,t=document){return Array.from(t.querySelectorAll(e))}function C(e){const t=document.createDocumentFragment();for(const n in e)t.appendChild(e[n]);return t}const P={userInfo:"https://pc-api.xuexi.cn/open/api/user/info",totalScore:"https://pc-proxy-api.xuexi.cn/delegate/score/get",todayScore:"https://pc-proxy-api.xuexi.cn/delegate/score/today/query",taskList:"https://pc-proxy-api.xuexi.cn/delegate/score/days/listScoreProgress?sence=score&deviceType=2",todayNews:["https://www.xuexi.cn/lgdata/35il6fpn0ohq.json","https://www.xuexi.cn/lgdata/1ap1igfgdn2.json","https://www.xuexi.cn/lgdata/vdppiu92n1.json","https://www.xuexi.cn/lgdata/152mdtl3qn1.json"],todayVideos:["https://www.xuexi.cn/lgdata/525pi8vcj24p.json","https://www.xuexi.cn/lgdata/11vku6vt6rgom.json","https://www.xuexi.cn/lgdata/2qfjjjrprmdh.json","https://www.xuexi.cn/lgdata/3o3ufqgl8rsn.json","https://www.xuexi.cn/lgdata/591ht3bc22pi.json","https://www.xuexi.cn/lgdata/1742g60067k.json","https://www.xuexi.cn/lgdata/1novbsbi47k.json"],paperList:"https://pc-proxy-api.xuexi.cn/api/exam/service/paper/pc/list",answerSave:"https://a6.qikekeji.com/txt/data/save",answerSearch:"https://a6.qikekeji.com/txt/data/detail",push:"https://www.pushplus.plus/send",generateQRCode:"https://login.xuexi.cn/user/qrcode/generate",loginWithQRCode:"https://login.xuexi.cn/login/login_with_qr",sign:"https://pc-api.xuexi.cn/open/api/sns/sign",secureCheck:"https://pc-api.xuexi.cn/login/secure_check",qrcode:"https://api.qrserver.com/v1/create-qr-code"};var _="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function A(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var L,k={exports:{}};L=k,function(e){function t(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function n(e,n,o,r,i,a){return t((s=t(t(n,e),t(r,a)))<<(u=i)|s>>>32-u,o);var s,u}function o(e,t,o,r,i,a,s){return n(t&o|~t&r,e,t,i,a,s)}function r(e,t,o,r,i,a,s){return n(t&r|o&~r,e,t,i,a,s)}function i(e,t,o,r,i,a,s){return n(t^o^r,e,t,i,a,s)}function a(e,t,o,r,i,a,s){return n(o^(t|~r),e,t,i,a,s)}function s(e,n){var s,u,c,l,f;e[n>>5]|=128<<n%32,e[14+(n+64>>>9<<4)]=n;var d=1732584193,p=-271733879,v=-1732584194,h=271733878;for(s=0;s<e.length;s+=16)u=d,c=p,l=v,f=h,d=o(d,p,v,h,e[s],7,-680876936),h=o(h,d,p,v,e[s+1],12,-389564586),v=o(v,h,d,p,e[s+2],17,606105819),p=o(p,v,h,d,e[s+3],22,-1044525330),d=o(d,p,v,h,e[s+4],7,-176418897),h=o(h,d,p,v,e[s+5],12,1200080426),v=o(v,h,d,p,e[s+6],17,-1473231341),p=o(p,v,h,d,e[s+7],22,-45705983),d=o(d,p,v,h,e[s+8],7,1770035416),h=o(h,d,p,v,e[s+9],12,-1958414417),v=o(v,h,d,p,e[s+10],17,-42063),p=o(p,v,h,d,e[s+11],22,-1990404162),d=o(d,p,v,h,e[s+12],7,1804603682),h=o(h,d,p,v,e[s+13],12,-40341101),v=o(v,h,d,p,e[s+14],17,-1502002290),d=r(d,p=o(p,v,h,d,e[s+15],22,1236535329),v,h,e[s+1],5,-165796510),h=r(h,d,p,v,e[s+6],9,-1069501632),v=r(v,h,d,p,e[s+11],14,643717713),p=r(p,v,h,d,e[s],20,-373897302),d=r(d,p,v,h,e[s+5],5,-701558691),h=r(h,d,p,v,e[s+10],9,38016083),v=r(v,h,d,p,e[s+15],14,-660478335),p=r(p,v,h,d,e[s+4],20,-405537848),d=r(d,p,v,h,e[s+9],5,568446438),h=r(h,d,p,v,e[s+14],9,-1019803690),v=r(v,h,d,p,e[s+3],14,-187363961),p=r(p,v,h,d,e[s+8],20,1163531501),d=r(d,p,v,h,e[s+13],5,-1444681467),h=r(h,d,p,v,e[s+2],9,-51403784),v=r(v,h,d,p,e[s+7],14,1735328473),d=i(d,p=r(p,v,h,d,e[s+12],20,-1926607734),v,h,e[s+5],4,-378558),h=i(h,d,p,v,e[s+8],11,-2022574463),v=i(v,h,d,p,e[s+11],16,1839030562),p=i(p,v,h,d,e[s+14],23,-35309556),d=i(d,p,v,h,e[s+1],4,-1530992060),h=i(h,d,p,v,e[s+4],11,1272893353),v=i(v,h,d,p,e[s+7],16,-155497632),p=i(p,v,h,d,e[s+10],23,-1094730640),d=i(d,p,v,h,e[s+13],4,681279174),h=i(h,d,p,v,e[s],11,-358537222),v=i(v,h,d,p,e[s+3],16,-722521979),p=i(p,v,h,d,e[s+6],23,76029189),d=i(d,p,v,h,e[s+9],4,-640364487),h=i(h,d,p,v,e[s+12],11,-421815835),v=i(v,h,d,p,e[s+15],16,530742520),d=a(d,p=i(p,v,h,d,e[s+2],23,-995338651),v,h,e[s],6,-198630844),h=a(h,d,p,v,e[s+7],10,1126891415),v=a(v,h,d,p,e[s+14],15,-1416354905),p=a(p,v,h,d,e[s+5],21,-57434055),d=a(d,p,v,h,e[s+12],6,1700485571),h=a(h,d,p,v,e[s+3],10,-1894986606),v=a(v,h,d,p,e[s+10],15,-1051523),p=a(p,v,h,d,e[s+1],21,-2054922799),d=a(d,p,v,h,e[s+8],6,1873313359),h=a(h,d,p,v,e[s+15],10,-30611744),v=a(v,h,d,p,e[s+6],15,-1560198380),p=a(p,v,h,d,e[s+13],21,1309151649),d=a(d,p,v,h,e[s+4],6,-145523070),h=a(h,d,p,v,e[s+11],10,-1120210379),v=a(v,h,d,p,e[s+2],15,718787259),p=a(p,v,h,d,e[s+9],21,-343485551),d=t(d,u),p=t(p,c),v=t(v,l),h=t(h,f);return[d,p,v,h]}function u(e){var t,n="",o=32*e.length;for(t=0;t<o;t+=8)n+=String.fromCharCode(e[t>>5]>>>t%32&255);return n}function c(e){var t,n=[];for(n[(e.length>>2)-1]=void 0,t=0;t<n.length;t+=1)n[t]=0;var o=8*e.length;for(t=0;t<o;t+=8)n[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return n}function l(e){var t,n,o="0123456789abcdef",r="";for(n=0;n<e.length;n+=1)t=e.charCodeAt(n),r+=o.charAt(t>>>4&15)+o.charAt(15&t);return r}function f(e){return unescape(encodeURIComponent(e))}function d(e){return function(e){return u(s(c(e),8*e.length))}(f(e))}function p(e,t){return function(e,t){var n,o,r=c(e),i=[],a=[];for(i[15]=a[15]=void 0,r.length>16&&(r=s(r,8*e.length)),n=0;n<16;n+=1)i[n]=909522486^r[n],a[n]=1549556828^r[n];return o=s(i.concat(c(t)),512+8*t.length),u(s(a.concat(o),640))}(f(e),f(t))}function v(e,t,n){return t?n?p(t,e):l(p(t,e)):n?d(e):l(d(e))}L.exports?L.exports=v:e.md5=v}(_);var T=A(k.exports);async function q(e){const t={txt_name:T(e),password:""};try{const e=new URLSearchParams(t),n=await fetch(P.answerSearch,{method:"POST",mode:"cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e.toString()});if(n.ok){const e=await n.json(),{data:t,status:o}=e;if(0!==o){const e=JSON.parse(t.txt_content);return e[0].content.split(/[;\s]/).map((e=>e.trim())).filter((e=>e.length))}}}catch(e){}return[]}function I(){return j(".q-body")[0]}function R(){return I().innerText}function O(){return j(".line-feed font[color]").map((e=>e.innerText.trim())).filter((e=>e))}function W(){return j(".q-header")[0].innerText.substring(0,3)}function N(){return j(".q-answer").map((e=>e.innerText.trim())).filter((e=>e))}function $(e,t){return t.map((t=>{const n={value:"",index:-1};return e.forEach(((e,o)=>{const r=e.replaceAll(/[、，,。 ]/g,""),i=t.replaceAll(/[、，,。 ]/g,"");(e===t||e.includes(t)||t.includes(e)||r.includes(i))&&(n.value.length?n.value.length>e.length&&(n.value=e,n.index=o):(n.value=e,n.index=o))})),n.value.length?n.index:-1})).filter((e=>!!(e+1)))}function F(e,t,n){const o=n.map((e=>t.join(e)));for(const t in o){const n=$(e,[o[t]]);if(1===n.length)return n}}async function Y(){const e=R(),t=j(".blank").length,n=O();if(n.length){if(n.length===t)return n;if(1===t&&n.length>1){return[n.join("")]}}const o=await q(e);if(console.log("answersNetwork",o),o.length){if(o.length===t)return o;if(1===t&&o.length>1){return[o.join("")]}}}function V(e){return e<10?`0${e}`:`${e}`}async function X(e,t){const{data:n,type:o}=t;return"tab"===o?await chrome.tabs.sendMessage(t.id,{data:n,action:e}):"runtime"===o?await chrome.runtime.sendMessage({data:n,action:e}):void 0}function H(e,t,n){const{once:o}=n||{},r=(n,r,a)=>{const{action:s,data:u}=n;if(s&&e===s)return t(u,r,a),void(o&&i())},i=()=>{chrome.runtime.onMessage.removeListener(r)};return chrome.runtime.onMessage.addListener(r),i}function J(){const e=l(0),t=l(0),n=Object.entries({width:"20px",height:"20px",position:"absolute",transform:"translate(-50%, -50%)",background:"#00000050","border-radius":"50%","z-index":"9999","pointer-events":"none",border:"2px solid #00000050"}).map((e=>`${e[0]}: ${e[1]};`)).join(""),o=D("div",void 0,{style:M((()=>`left: ${e.value}px;top: ${t.value}px;${n}`))},void 0,{onMounted(){const{x:n,y:o}=function(){const e=l(0),t=l(0);return window.addEventListener("mousedown",(n=>{e.value=n.pageX,t.value=n.pageY}),{passive:!0}),window.addEventListener("mousemove",(n=>{e.value=n.pageX,t.value=n.pageY}),{passive:!0}),window.addEventListener("mouseup",(n=>{e.value=n.pageX,t.value=n.pageY}),{passive:!0}),window.addEventListener("wheel",(n=>{e.value=n.pageX,t.value=n.pageY}),{passive:!0}),{x:e,y:t}}();b((()=>e.value=n.value)),b((()=>t.value=o.value))}});Object.entries({position:"relative"}).forEach((e=>document.body.style.setProperty(e[0],e[1]))),async function(e,t=document.body){if(e instanceof Promise){const{ele:n,beforeMount:o,onMounted:r}=await e;return void(n&&t&&(o&&o(),t.appendChild(n),r&&r()))}const{ele:n,beforeMount:o,onMounted:r}=e;n&&t&&(o&&o(),t.appendChild(n),r&&r())}(o)}!function(...e){!function(e,...t){const n=t.map((e=>!(e instanceof Function)&&e instanceof Object?e instanceof Error?e.stack:JSON.stringify(e):String(e))).join(" ");console.log(`%c[${function(e=Date.now()){const t=new Date(e),n=t.getSeconds(),o=t.getMinutes(),r=t.getHours(),i=t.getDate(),a=t.getMonth()+1;return`${[t.getFullYear(),a,i].map(V).join("-")} ${[r,o,n].map(V).join(":")}`}()}] %c${n}`,"",`color: ${e}`)}("dodgerblue",...e)}("答题 脚本注入成功");const z=()=>{H("load",(()=>{const e=!!I();if(e){const e=j("#app > div > div.layout-body > div > div.header-row")[0],t=j("#app > div > div.layout-body > div > div.detail-body")[0];e.style.width="auto",e.style.margin="0",t.style.width="auto"}X("load",{data:e,type:"runtime"})})),H("wheel",(()=>{const e=function(e,t){let n=-1;return function(...o){-1!==n&&clearTimeout(n),n=setTimeout((()=>{e.apply(this,o)}),t)}}((()=>{clearTimeout(n),X("wheel",{type:"runtime"})}),300);let t=!1;window.addEventListener("wheel",(()=>{t=!0,e()}));const n=setTimeout((()=>{t||X("wheel",{type:"runtime"})}),3e3)})),H("questionData",(()=>{const e=W(),{current:t,total:n}=function(){const e=j(".pager")[0],[t,n]=e.innerText.split("/").map((e=>Number(e)));return{current:t,total:n}}();X("questionData",{type:"runtime",data:{type:e,total:n,current:t}})})),H("next",(async()=>{X("next",{type:"runtime",data:await new Promise((e=>{const t=setInterval((()=>{const n=j(".ant-btn").filter((e=>e.innerText)).map((e=>e.innerText.replace(/\s/g,"")));if(n.length){if(clearInterval(t),2===n.length)return void e(n[1]);e(n[0])}}),500)}))})})),H("answers",(async()=>{const e=W();if("单选题"!==e)if("多选题"!==e)if("填空题"!==e);else{X("answers",{type:"runtime",data:await Y()})}else{X("answers",{type:"runtime",data:await async function(){const e=R(),t=N(),n=O();if(n.length){const o=t.map((e=>e.split(/[A-Z]./)[1].trim())).join(""),r=e.match(/（）/g)||[];if(t.length===r.length||e===o||2===t.length)return t.map(((e,t)=>t));if(t.length>=n.length){const e=$(t,n);if(e.length)return e}}const o=await q(e);if(console.log("answersNetwork",o),o.length){const e=$(t,o);if(e.length)return e}}()})}else{X("answers",{type:"runtime",data:await async function(){const e=R(),t=N(),n=O();if(n.length)if(1===n.length){const e=$(t,n);if(1===e.length)return e}else{const e=F(t,n,[""," ",",",";",",","、","-","|","+","/"]);if(1===e?.length)return e}const o=await q(e);if(o.length)if(1===o.length){const e=$(t,o);if(1===e.length)return e}else{const e=F(t,n,[""," "]);if(1===e?.length)return e}}()})}})),H("slideVerify",(async()=>{X("slideVerify",{type:"runtime",data:await function(){const e=j("#nc_mask")[0],t=!!e&&"none"!==getComputedStyle(e).display;return t&&(e.style.zIndex="999"),t}()})}))};window.addEventListener("load",(()=>{z(),J(),window.addEventListener("beforeunload",(()=>{X("unload",{type:"runtime",data:null})}))}));
