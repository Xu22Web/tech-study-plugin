function t(t){return t<10?`0${t}`:`${t}`}function e(...e){!function(e,...n){const o=n.map((t=>!(t instanceof Function)&&t instanceof Object?t instanceof Error?t.stack:JSON.stringify(t):String(t))).join(" ");console.log(`%c[${function(e=Date.now()){const n=new Date(e),o=n.getSeconds(),i=n.getMinutes(),a=n.getHours(),c=n.getDate(),r=n.getMonth()+1;return`${[n.getFullYear(),r,c].map(t).join("-")} ${[a,i,o].map(t).join(":")}`}()}] %c${o}`,"",`color: ${e}`)}("dodgerblue",...e)}chrome.runtime.onInstalled.addListener((()=>{e("安装成功!")}));let n=null;chrome.windows.onRemoved.addListener((t=>{n?.id!==t||(n=null)})),chrome.action.onClicked.addListener(function(t,e){let n=-1;return function(...o){-1!==n&&clearTimeout(n),n=setTimeout((()=>{t.apply(this,o)}),e)}}((async()=>{n?.id?await chrome.windows.update(n.id,{focused:!0,drawAttention:!0}):(n=await chrome.windows.create({type:"popup",width:250,height:700,url:"/dist/popup/index.html",focused:!0}),n.tabs&&await chrome.tabs.update(n.tabs[0].id,{active:!0,autoDiscardable:!1}))}),300));
