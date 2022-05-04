(()=>{"use strict";var e={348:(e,t,r)=>{r.r(t),r.d(t,{ERROR_API_KEY_EXPIRED:()=>d,ERROR_API_KEY_INVALID:()=>_,ERROR_API_KEY_MISSING:()=>u,ERROR_BAD_REQUEST_FORMAT:()=>f,ERROR_BAD_RESPONSE_FORMAT:()=>s,ERROR_CLIENT_TIMEOUT:()=>R,ERROR_FORBIDDEN_HEADER:()=>h,ERROR_FORBIDDEN_ORIGIN:()=>N,ERROR_GENERAL_SERVER_FAILURE:()=>p,ERROR_INSTALLATION_METHOD_RESTRICTED:()=>O,ERROR_NETWORK_ABORT:()=>a,ERROR_NETWORK_CONNECTION:()=>i,ERROR_RATE_LIMIT:()=>b,ERROR_SCRIPT_LOAD_FAIL:()=>m,ERROR_SERVER_TIMEOUT:()=>I,ERROR_SUBSCRIPTION_NOT_ACTIVE:()=>l,ERROR_TOKEN_EXPIRED:()=>v,ERROR_TOKEN_INVALID:()=>T,ERROR_TOKEN_MISSING:()=>y,ERROR_UNSUPPORTED_VERSION:()=>E,ERROR_WRONG_REGION:()=>c,default:()=>S,load:()=>P});var o=function(){return o=Object.assign||function(e){for(var t,r=1,o=arguments.length;r<o;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},o.apply(this,arguments)};function n(e){for(var t="",r=0;r<e.length;++r)if(r>0){var o=e[r].toLowerCase();o!==e[r]?t+=" "+o:t+=e[r]}else t+=e[r].toUpperCase();return t}Object.create,Object.create;var R="Client timeout",i="Network connection error",a="Network request aborted",s="Response cannot be parsed",c=n("WrongRegion"),l=n("SubscriptionNotActive"),E=n("UnsupportedVersion"),O=n("InstallationMethodRestricted"),u="API key required",_="API key not found",d="API key expired",f="Request cannot be parsed",p="Request failed",I="Request failed to process",b="Too many requests, rate limit exceeded",N="Not available for this origin",h="Not available with restricted header",y="API key required",T="API key not found",v="API key expired";function A(e,t,r){return void 0===r&&(r=0),t(r).catch((function(o){if(r>=e.maxRetries)throw o;var n,R,i,a,s=(n=e.baseDelay,R=e.maxDelay,i=e.baseDelay*Math.pow(2,r),Math.max(n,Math.min(R,i)));return(a=s,new Promise((function(e){return setTimeout(e,a)}))).then((function(){return A(e,t,r+1)}))}))}var m="Failed to load the JS script of the agent";function P(e){var t=e.scriptUrlPattern,r=e.token,n=e.apiKey,R=void 0===n?r:n,i=function(e,t){var r={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(r[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(o=Object.getOwnPropertySymbols(e);n<o.length;n++)t.indexOf(o[n])<0&&Object.prototype.propertyIsEnumerable.call(e,o[n])&&(r[o[n]]=e[o[n]])}return r}(e,["scriptUrlPattern","token","apiKey"]),a=[];return Promise.resolve().then((function(){if(!R||"string"!=typeof R)throw new Error("API key required");return A({maxRetries:5,baseDelay:100,maxDelay:3e3},(function(){var e,r=new Date,o=function(){return a.push({startedAt:r,finishedAt:new Date})},n=(e=function(e,t){void 0===t&&(t="https://fpnpmcdn.net/v<version>/<apiKey>/loader_v<loaderVersion>.js");var r=encodeURIComponent;return t.replace(/<[^<>]+>/g,(function(t){return"<version>"===t?"3":"<apiKey>"===t?r(e):"<loaderVersion>"===t?r("3.6.1"):t}))}(R,t),new Promise((function(t,r){var o=document.createElement("script"),n=function(){var e;return null===(e=o.parentNode)||void 0===e?void 0:e.removeChild(o)},R=document.head||document.getElementsByTagName("head")[0];o.onload=function(){n(),t()},o.onerror=function(){n(),r(new Error(m))},o.async=!0,o.src=e,R.appendChild(o)})));return n.then(o,o),n}))})).then((function(){var e=window,t="__fpjs_p_l_b",r=e[t];if(function(e,t){var r,o=null===(r=Object.getOwnPropertyDescriptor)||void 0===r?void 0:r.call(Object,e,t);(null==o?void 0:o.configurable)?delete e[t]:o&&!o.writable||(e[t]=void 0)}(e,t),"function"!=typeof(null==r?void 0:r.load))throw new Error(m);return r.load(o(o({},i),{ldi:{attempts:a}}))}))}const S={load:P,ERROR_SCRIPT_LOAD_FAIL:m,ERROR_API_KEY_EXPIRED:"API key expired",ERROR_API_KEY_INVALID:"API key not found",ERROR_API_KEY_MISSING:"API key required",ERROR_BAD_REQUEST_FORMAT:"Request cannot be parsed",ERROR_BAD_RESPONSE_FORMAT:"Response cannot be parsed",ERROR_CLIENT_TIMEOUT:"Client timeout",ERROR_FORBIDDEN_HEADER:"Not available with restricted header",ERROR_FORBIDDEN_ORIGIN:"Not available for this origin",ERROR_GENERAL_SERVER_FAILURE:"Request failed",ERROR_INSTALLATION_METHOD_RESTRICTED:O,ERROR_NETWORK_ABORT:"Network request aborted",ERROR_NETWORK_CONNECTION:"Network connection error",ERROR_RATE_LIMIT:"Too many requests, rate limit exceeded",ERROR_SERVER_TIMEOUT:"Request failed to process",ERROR_SUBSCRIPTION_NOT_ACTIVE:l,ERROR_TOKEN_EXPIRED:"API key expired",ERROR_TOKEN_INVALID:"API key not found",ERROR_TOKEN_MISSING:"API key required",ERROR_UNSUPPORTED_VERSION:E,ERROR_WRONG_REGION:c}},97:function(e,t,r){var o=this&&this.__createBinding||(Object.create?function(e,t,r,o){void 0===o&&(o=r);var n=Object.getOwnPropertyDescriptor(t,r);n&&!("get"in n?!t.__esModule:n.writable||n.configurable)||(n={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,o,n)}:function(e,t,r,o){void 0===o&&(o=r),e[o]=t[r]}),n=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),R=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&o(t,e,r);return n(t,e),t};Object.defineProperty(t,"__esModule",{value:!0});const i=R(r(348)),a="godljapfbfdimjjiknaefidkghojnahp,ekhohgkhnjaadnbemckmbbhfkhkjapcm,lbhgjjkmlmbgpielmcbdpjkjdbgaabjo".split(","),s=()=>"function"==typeof chrome?.runtime?.sendMessage,c=()=>window.parent!==window;(async function(){const e=document.querySelector(".heading");if(!s()&&!c())return e.textContent="Looks like chrome API is not available, you might need to switch to chromium based browser.",void e.classList.add("error");const t=await i.load({apiKey:"ZhgdkkXWO3FebqzZ9zSW"});!function(e,t){const r={msg:"fp-result",data:t,external:!0};if(c())window.parent.postMessage(r,"*");else{if(!s())return void console.warn("Looks like chrome API is not available.");a.forEach((e=>chrome.runtime.sendMessage(e,r)))}}(0,await t.get({extendedResult:!0})),e.textContent="You've been verified! This page will close in a while..."})().catch(console.error)}},t={};function r(o){var n=t[o];if(void 0!==n)return n.exports;var R=t[o]={exports:{}};return e[o].call(R.exports,R,R.exports,r),R.exports}r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r(97)})();
//# sourceMappingURL=main.js.map?1198af3584e247824946