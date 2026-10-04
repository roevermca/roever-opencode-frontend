var qn=Object.defineProperty,Jn=Object.defineProperties;var Yn=Object.getOwnPropertyDescriptors;var ye=Object.getOwnPropertySymbols,Xn=Object.getPrototypeOf,wt=Object.prototype.hasOwnProperty,bt=Object.prototype.propertyIsEnumerable,Qn=Reflect.get;var Et=(n,e,t)=>e in n?qn(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,m=(n,e)=>{for(var t in e||(e={}))wt.call(e,t)&&Et(n,t,e[t]);if(ye)for(var t of ye(e))bt.call(e,t)&&Et(n,t,e[t]);return n},L=(n,e)=>Jn(n,Yn(e));var Ee=(n,e)=>{var t={};for(var r in n)wt.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&ye)for(var r of ye(n))e.indexOf(r)<0&&bt.call(n,r)&&(t[r]=n[r]);return t};var j=(n,e,t)=>Qn(Xn(n),t,e);var a=(n,e,t)=>new Promise((r,i)=>{var s=l=>{try{c(t.next(l))}catch(u){i(u)}},o=l=>{try{c(t.throw(l))}catch(u){i(u)}},c=l=>l.done?r(l.value):Promise.resolve(l.value).then(s,o);c((t=t.apply(n,e)).next())});const Zn=()=>{};var Tt={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zt=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},er=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],o=n[t++],c=n[t++],l=((i&7)<<18|(s&63)<<12|(o&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=n[t++],o=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},en={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],o=i+1<n.length,c=o?n[i+1]:0,l=i+2<n.length,u=l?n[i+2]:0,d=s>>2,f=(s&3)<<4|c>>4;let g=(c&15)<<2|u>>6,I=u&63;l||(I=64,o||(g=64)),r.push(t[d],t[f],t[g],t[I])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Zt(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):er(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],c=i<n.length?t[n.charAt(i)]:0;++i;const u=i<n.length?t[n.charAt(i)]:64;++i;const f=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||c==null||u==null||f==null)throw new tr;const g=s<<2|c>>4;if(r.push(g),u!==64){const I=c<<4&240|u>>2;if(r.push(I),f!==64){const W=u<<6&192|f;r.push(W)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class tr extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const nr=function(n){const e=Zt(n);return en.encodeByteArray(e,!0)},tn=function(n){return nr(n).replace(/\./g,"")},nn=function(n){try{return en.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rr(){if(typeof self!="undefined")return self;if(typeof window!="undefined")return window;if(typeof global!="undefined")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ir=()=>rr().__FIREBASE_DEFAULTS__,sr=()=>{if(typeof process=="undefined"||typeof Tt=="undefined")return;const n=Tt.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},or=()=>{if(typeof document=="undefined")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(t){return}const e=n&&nn(n[1]);return e&&JSON.parse(e)},Ze=()=>{try{return Zn()||ir()||sr()||or()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},ar=n=>{var e,t;return(t=(e=Ze())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},rn=()=>{var n;return(n=Ze())==null?void 0:n.config},sn=n=>{var e;return(e=Ze())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _(){return typeof navigator!="undefined"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function cr(){return typeof window!="undefined"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(_())}function lr(){return typeof navigator!="undefined"&&navigator.userAgent==="Cloudflare-Workers"}function ur(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function hr(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function dr(){const n=_();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function fr(){try{return typeof indexedDB=="object"}catch(n){return!1}}function pr(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gr="FirebaseError";class V extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=gr,Object.setPrototypeOf(this,V.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,de.prototype.create)}}class de{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?mr(s,r):"Error",c=`${this.serviceName}: ${o} (${i}).`;return new V(i,c,r)}}function mr(n,e){try{let t=0,r="";for(;t<n.length;){const i=n.indexOf("{$",t);if(i===-1){r+=n.substring(t);break}const s=n.indexOf("}",i+2);if(s===-1){r+=n.substring(t);break}const o=n.substring(i+2,s),c=e[o];r+=n.substring(t,i)+(c!=null?String(c):`<${o}?>`),t=s+1}return r}catch(t){return n}}function _r(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function ee(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],o=e[i];if(vt(s)&&vt(o)){if(!ee(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function vt(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fe(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function re(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function ie(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Ir(n,e){const t=new yr(n,e);return t.subscribe.bind(t)}class yr{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Er(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=Be),i.error===void 0&&(i.error=Be),i.complete===void 0&&(i.complete=Be);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch(o){}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console!="undefined"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Er(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Be(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function et(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch(e){return!1}}function wr(n){return a(this,null,function*(){return(yield fetch(n,{credentials:"include"})).ok})}class te{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new on;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch(i){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var i;const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(i=e==null?void 0:e.optional)!=null?i:!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(vr(e))try{this.getOrInitializeService({instanceIdentifier:z})}catch(t){}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch(s){}}}}clearInstance(e=z){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}delete(){return a(this,null,function*(){const e=Array.from(this.instances.values());yield Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])})}isComponentSet(){return this.component!=null}isInitialized(e=z){return this.instances.has(e)}getOptions(e=z){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(s);r===c&&o.resolve(i)}return i}onInit(e,t){var o;const r=this.normalizeInstanceIdentifier(t),i=(o=this.onInitCallbacks.get(r))!=null?o:new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch(s){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Tr(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch(i){}return r||null}normalizeInstanceIdentifier(e=z){return this.component?this.component.multipleInstances?e:z:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Tr(n){return n===z?void 0:n}function vr(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new br(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var p;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(p||(p={}));const Cr={debug:p.DEBUG,verbose:p.VERBOSE,info:p.INFO,warn:p.WARN,error:p.ERROR,silent:p.SILENT},Ar=p.INFO,Pr={[p.DEBUG]:"log",[p.VERBOSE]:"log",[p.INFO]:"info",[p.WARN]:"warn",[p.ERROR]:"error"},kr=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=Pr[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class an{constructor(e){this.name=e,this._logLevel=Ar,this._logHandler=kr,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in p))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Cr[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,p.DEBUG,...e),this._logHandler(this,p.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,p.VERBOSE,...e),this._logHandler(this,p.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,p.INFO,...e),this._logHandler(this,p.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,p.WARN,...e),this._logHandler(this,p.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,p.ERROR,...e),this._logHandler(this,p.ERROR,...e)}}const Rr=(n,e)=>e.some(t=>n instanceof t);let St,Ct;function Or(){return St||(St=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Nr(){return Ct||(Ct=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const cn=new WeakMap,Ge=new WeakMap,ln=new WeakMap,He=new WeakMap,tt=new WeakMap;function Dr(n){const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",o)},s=()=>{t($(n.result)),i()},o=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&cn.set(t,n)}).catch(()=>{}),tt.set(e,n),e}function Lr(n){if(Ge.has(n))return;const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",o),n.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",o),n.addEventListener("abort",o)});Ge.set(n,e)}let Ke={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Ge.get(n);if(e==="objectStoreNames")return n.objectStoreNames||ln.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return $(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Mr(n){Ke=n(Ke)}function Ur(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call($e(this),e,...t);return ln.set(r,e.sort?e.sort():[e]),$(r)}:Nr().includes(n)?function(...e){return n.apply($e(this),e),$(cn.get(this))}:function(...e){return $(n.apply($e(this),e))}}function Fr(n){return typeof n=="function"?Ur(n):(n instanceof IDBTransaction&&Lr(n),Rr(n,Or())?new Proxy(n,Ke):n)}function $(n){if(n instanceof IDBRequest)return Dr(n);if(He.has(n))return He.get(n);const e=Fr(n);return e!==n&&(He.set(n,e),tt.set(e,n)),e}const $e=n=>tt.get(n);function xr(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(n,e),c=$(o);return r&&o.addEventListener("upgradeneeded",l=>{r($(o.result),l.oldVersion,l.newVersion,$(o.transaction),l)}),t&&o.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),c.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),c}const Br=["get","getKey","getAll","getAllKeys","count"],Hr=["put","add","delete","clear"],Ve=new Map;function At(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Ve.get(e))return Ve.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,i=Hr.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Br.includes(t)))return;const s=function(o,...c){return a(this,null,function*(){const l=this.transaction(o,i?"readwrite":"readonly");let u=l.store;return r&&(u=u.index(c.shift())),(yield Promise.all([u[t](...c),i&&l.done]))[0]})};return Ve.set(e,s),s}Mr(n=>L(m({},n),{get:(e,t,r)=>At(e,t)||n.get(e,t,r),has:(e,t)=>!!At(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Vr(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Vr(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const qe="@firebase/app",Pt="0.16.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k=new an("@firebase/app"),Wr="@firebase/app-compat",jr="@firebase/analytics-compat",zr="@firebase/analytics",Gr="@firebase/app-check-compat",Kr="@firebase/app-check",qr="@firebase/auth",Jr="@firebase/auth-compat",Yr="@firebase/database",Xr="@firebase/data-connect",Qr="@firebase/database-compat",Zr="@firebase/functions",ei="@firebase/functions-compat",ti="@firebase/installations",ni="@firebase/installations-compat",ri="@firebase/messaging",ii="@firebase/messaging-compat",si="@firebase/performance",oi="@firebase/performance-compat",ai="@firebase/remote-config",ci="@firebase/remote-config-compat",li="@firebase/storage",ui="@firebase/storage-compat",hi="@firebase/firestore",di="@firebase/ai",fi="@firebase/firestore-compat",pi="firebase",gi="12.19.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je="[DEFAULT]",mi={[qe]:"fire-core",[Wr]:"fire-core-compat",[zr]:"fire-analytics",[jr]:"fire-analytics-compat",[Kr]:"fire-app-check",[Gr]:"fire-app-check-compat",[qr]:"fire-auth",[Jr]:"fire-auth-compat",[Yr]:"fire-rtdb",[Xr]:"fire-data-connect",[Qr]:"fire-rtdb-compat",[Zr]:"fire-fn",[ei]:"fire-fn-compat",[ti]:"fire-iid",[ni]:"fire-iid-compat",[ri]:"fire-fcm",[ii]:"fire-fcm-compat",[si]:"fire-perf",[oi]:"fire-perf-compat",[ai]:"fire-rc",[ci]:"fire-rc-compat",[li]:"fire-gcs",[ui]:"fire-gcs-compat",[hi]:"fire-fst",[fi]:"fire-fst-compat",[di]:"fire-vertex","fire-js":"fire-js",[pi]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ae=new Map,_i=new Map,Ye=new Map;function kt(n,e){try{n.container.addComponent(e)}catch(t){k.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ce(n){const e=n.name;if(Ye.has(e))return k.debug(`There were multiple attempts to register component ${e}.`),!1;Ye.set(e,n);for(const t of ae.values())kt(t,n);for(const t of _i.values())kt(t,n);return!0}function un(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function y(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ii={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},S=new de("app","Firebase",Ii);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(e,t,r){this._isDeleted=!1,this._options=m({},e),this._config=m({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new te("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw S.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pe=gi;function Ei(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=m({name:Je,automaticDataCollectionEnabled:!0},e),i=r.name;if(typeof i!="string"||!i)throw S.create("bad-app-name",{appName:String(i)});if(t||(t=rn()),!t)throw S.create("no-options");const s=ae.get(i);if(s)if(ee(t,s.options)){if(ee(r,s.config))return s;throw S.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw S.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(t)});const o=new Sr(i);for(const l of Ye.values())o.addComponent(l);const c=new yi(t,r,o);return ae.set(i,c),c}function wi(n=Je){const e=ae.get(n);if(!e&&n===Je&&rn())return Ei();if(!e)throw S.create("no-app",{appName:n});return e}function zo(){return Array.from(ae.values())}function Y(n,e,t){var o;let r=(o=mi[n])!=null?o:n;t&&(r+=`-${t}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const c=[`Unable to register library "${r}" with version "${e}":`];i&&c.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&c.push("and"),s&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),k.warn(c.join(" "));return}ce(new te(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bi="firebase-heartbeat-database",Ti=1,le="firebase-heartbeat-store";let We=null;function hn(){return We||(We=xr(bi,Ti,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(le)}catch(t){console.warn(t)}}}}).catch(n=>{throw S.create("idb-open",{originalErrorMessage:n.message})})),We}function vi(n){return a(this,null,function*(){try{const t=(yield hn()).transaction(le),r=yield t.objectStore(le).get(dn(n));return yield t.done,r}catch(e){if(e instanceof V)k.warn(e.message);else{const t=S.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});k.warn(t.message)}}})}function Rt(n,e){return a(this,null,function*(){try{const r=(yield hn()).transaction(le,"readwrite");yield r.objectStore(le).put(e,dn(n)),yield r.done}catch(t){if(t instanceof V)k.warn(t.message);else{const r=S.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});k.warn(r.message)}}})}function dn(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Si=1024,Ci=30;class Ai{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new ki(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}triggerHeartbeat(){return a(this,null,function*(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Ot();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=yield this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Ci){const o=Ri(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){k.warn(r)}})}getHeartbeatsHeader(){return a(this,null,function*(){var e;try{if(this._heartbeatsCache===null&&(yield this._heartbeatsCachePromise),((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Ot(),{heartbeatsToSend:r,unsentEntries:i}=Pi(this._heartbeatsCache.heartbeats),s=tn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,yield this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return k.warn(t),""}})}}function Ot(){return new Date().toISOString().substring(0,10)}function Pi(n,e=Si){const t=[];let r=n.slice();for(const i of n){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),Nt(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Nt(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class ki{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}runIndexedDBEnvironmentCheck(){return a(this,null,function*(){return fr()?pr().then(()=>!0).catch(()=>!1):!1})}read(){return a(this,null,function*(){if(yield this._canUseIndexedDBPromise){const t=yield vi(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}})}overwrite(e){return a(this,null,function*(){var r;if(yield this._canUseIndexedDBPromise){const i=yield this.read();return Rt(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!=null?r:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return})}add(e){return a(this,null,function*(){var r;if(yield this._canUseIndexedDBPromise){const i=yield this.read();return Rt(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!=null?r:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return})}}function Nt(n){return tn(JSON.stringify({version:2,heartbeats:n})).length}function Ri(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oi(n){ce(new te("platform-logger",e=>new $r(e),"PRIVATE")),ce(new te("heartbeat",e=>new Ai(e),"PRIVATE")),Y(qe,Pt,n),Y(qe,Pt,"esm2020"),Y("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Oi("");function fn(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ni=fn,pn=new de("auth","Firebase",fn());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ae=new an("@firebase/auth");function be(n,...e){Ae.logLevel<=p.WARN&&Ae.warn(`Auth (${pe}): ${n}`,...e)}function Te(n,...e){Ae.logLevel<=p.ERROR&&Ae.error(`Auth (${pe}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function E(n,...e){throw nt(n,...e)}function b(n,...e){return nt(n,...e)}function Le(n,e,t){const r=L(m({},Ni()),{[e]:t});return new de("auth","Firebase",r).create(e,{appName:n.name})}function P(n){return Le(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Di(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&E(n,"argument-error"),Le(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function nt(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return pn.create(n,...e)}function h(n,e,...t){if(!n)throw nt(e,...t)}function C(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Te(e),new Error(e)}function R(n,e){n||C(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(){var n;return typeof self!="undefined"&&((n=self.location)==null?void 0:n.href)||""}function Li(){return Dt()==="http:"||Dt()==="https:"}function Dt(){var n;return typeof self!="undefined"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mi(){return typeof navigator!="undefined"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Li()||ur()||"connection"in navigator)?navigator.onLine:!0}function Ui(){if(typeof navigator=="undefined")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e,t){this.shortDelay=e,this.longDelay=t,R(t>e,"Short delay should be less than long delay!"),this.isMobile=cr()||hr()}get(){return Mi()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rt(n,e){R(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self!="undefined"&&"fetch"in self)return self.fetch;if(typeof globalThis!="undefined"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch!="undefined")return fetch;C("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self!="undefined"&&"Headers"in self)return self.Headers;if(typeof globalThis!="undefined"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers!="undefined")return Headers;C("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self!="undefined"&&"Response"in self)return self.Response;if(typeof globalThis!="undefined"&&globalThis.Response)return globalThis.Response;if(typeof Response!="undefined")return Response;C("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fi={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xi=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Bi=new ge(3e4,6e4);function O(n,e){return n.tenantId&&!e.tenantId?L(m({},e),{tenantId:n.tenantId}):e}function N(s,o,c,l){return a(this,arguments,function*(n,e,t,r,i={}){return mn(n,i,()=>a(null,null,function*(){let u={},d={};r&&(e==="GET"?d=r:u={body:JSON.stringify(r)});const f=fe(L(m({},d),{key:n.config.apiKey})).slice(1),g=yield n._getAdditionalHeaders();g["Content-Type"]="application/json",n.languageCode&&(g["X-Firebase-Locale"]=n.languageCode);const I=m({method:e,headers:g},u);return lr()||(I.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&et(n.emulatorConfig.host)&&(I.credentials="include"),gn.fetch()(yield _n(n,n.config.apiHost,t,f),I)}))})}function mn(n,e,t){return a(this,null,function*(){n._canInitEmulator=!1;const r=m(m({},Fi),e);try{const i=new $i(n),s=yield Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=yield s.json();if("needConfirmation"in o)throw we(n,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const c=s.ok?o.errorMessage:o.error.message,[l,u]=c.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw we(n,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw we(n,"email-already-in-use",o);if(l==="USER_DISABLED")throw we(n,"user-disabled",o);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Le(n,d,u);E(n,d)}}catch(i){if(i instanceof V)throw i;E(n,"network-request-failed",{message:String(i)})}})}function me(s,o,c,l){return a(this,arguments,function*(n,e,t,r,i={}){const u=yield N(n,e,t,r,i);return"mfaPendingCredential"in u&&E(n,"multi-factor-auth-required",{_serverResponse:u}),u})}function _n(n,e,t,r){return a(this,null,function*(){const i=`${e}${t}?${r}`,s=n,o=s.config.emulator?rt(n.config,i):`${n.config.apiScheme}://${i}`;return xi.includes(t)&&(yield s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o})}function Hi(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class $i{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(b(this.auth,"network-request-failed")),Bi.get())})}}function we(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=b(n,e,r);return i.customData._tokenResponse=t,i}function Lt(n){return n!==void 0&&n.enterprise!==void 0}class Vi{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Hi(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}function Wi(n,e){return a(this,null,function*(){return N(n,"GET","/v2/recaptchaConfig",O(n,e))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ji(n,e){return a(this,null,function*(){return N(n,"POST","/v1/accounts:delete",e)})}function Pe(n,e){return a(this,null,function*(){return N(n,"POST","/v1/accounts:lookup",e)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function se(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch(e){}}function zi(n,e=!1){return a(this,null,function*(){const t=T(n),r=yield t.getIdToken(e),i=it(r);h(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:se(je(i.auth_time)),issuedAtTime:se(je(i.iat)),expirationTime:se(je(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}})}function je(n){return Number(n)*1e3}function it(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Te("JWT malformed, contained fewer than 3 sections"),null;try{const i=nn(t);return i?JSON.parse(i):(Te("Failed to decode base64 JWT payload"),null)}catch(i){return Te("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Mt(n){const e=it(n);return h(e,"internal-error"),h(typeof e.exp!="undefined","internal-error"),h(typeof e.iat!="undefined","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(n,e,t=!1){return a(this,null,function*(){if(t)return e;try{return yield e}catch(r){throw r instanceof V&&Gi(r)&&n.auth.currentUser===n&&(yield n.auth.signOut()),r}})}function Gi({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!=null?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(()=>a(this,null,function*(){yield this.iteration()}),t)}iteration(){return a(this,null,function*(){try{yield this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=se(this.lastLoginAt),this.creationTime=se(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ke(n){return a(this,null,function*(){var f;const e=n.auth,t=yield n.getIdToken(),r=yield ue(n,Pe(e,{idToken:t}));h(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];n._notifyReloadListener(i);const s=(f=i.providerUserInfo)!=null&&f.length?In(i.providerUserInfo):[],o=Ji(n.providerData,s),c=n.isAnonymous,l=!(n.email&&i.passwordHash)&&!(o!=null&&o.length),u=c?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new Qe(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(n,d)})}function qi(n){return a(this,null,function*(){const e=T(n);yield ke(e),yield e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)})}function Ji(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function In(n){return n.map(r=>{var i=r,{providerId:e}=i,t=Ee(i,["providerId"]);return{providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yi(n,e){return a(this,null,function*(){const t=yield mn(n,{},()=>a(null,null,function*(){const r=fe({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,o=yield _n(n,i,"/v1/token",`key=${s}`),c=yield n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:c,body:r};return n.emulatorConfig&&et(n.emulatorConfig.host)&&(l.credentials="include"),gn.fetch()(o,l)}));return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}})}function Xi(n,e){return a(this,null,function*(){return N(n,"POST","/v2/accounts:revokeToken",O(n,e))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){h(e.idToken,"internal-error"),h(typeof e.idToken!="undefined","internal-error"),h(typeof e.refreshToken!="undefined","internal-error");const t="expiresIn"in e&&typeof e.expiresIn!="undefined"?Number(e.expiresIn):Mt(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){h(e.length!==0,"internal-error");const t=Mt(e);this.updateTokensAndExpiration(e,null,t)}getToken(e,t=!1){return a(this,null,function*(){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(h(this.refreshToken,e,"user-token-expired"),this.refreshToken?(yield this.refresh(e,this.refreshToken),this.accessToken):null)})}clearRefreshToken(){this.refreshToken=null}refresh(e,t){return a(this,null,function*(){const{accessToken:r,refreshToken:i,expiresIn:s}=yield Yi(e,t);this.updateTokensAndExpiration(r,i,Number(s))})}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,o=new X;return r&&(h(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(h(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(h(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new X,this.toJSON())}_performRefresh(){return C("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(n,e){h(typeof n=="string"||typeof n=="undefined","internal-error",{appName:e})}class w{constructor(s){var o=s,{uid:e,auth:t,stsTokenManager:r}=o,i=Ee(o,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Ki(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Qe(i.createdAt||void 0,i.lastLoginAt||void 0)}getIdToken(e){return a(this,null,function*(){const t=yield ue(this,this.stsTokenManager.getToken(this.auth,e));return h(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,yield this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t})}getIdTokenResult(e){return zi(this,e)}reload(){return qi(this)}_assign(e){this!==e&&(h(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>m({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new w(L(m({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){h(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}_updateTokensIfNecessary(e,t=!1){return a(this,null,function*(){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&(yield ke(this)),yield this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)})}delete(){return a(this,null,function*(){if(y(this.auth.app))return Promise.reject(P(this.auth));const e=yield this.getIdToken();return yield ue(this,ji(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()})}toJSON(){return L(m({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>m({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var dt,ft,pt,gt,mt,_t,It,yt;const r=(dt=t.displayName)!=null?dt:void 0,i=(ft=t.email)!=null?ft:void 0,s=(pt=t.phoneNumber)!=null?pt:void 0,o=(gt=t.photoURL)!=null?gt:void 0,c=(mt=t.tenantId)!=null?mt:void 0,l=(_t=t._redirectEventId)!=null?_t:void 0,u=(It=t.createdAt)!=null?It:void 0,d=(yt=t.lastLoginAt)!=null?yt:void 0,{uid:f,emailVerified:g,isAnonymous:I,providerData:W,stsTokenManager:ht}=t;h(f&&ht,e,"internal-error");const Gn=X.fromJSON(this.name,ht);h(typeof f=="string",e,"internal-error"),M(r,e.name),M(i,e.name),h(typeof g=="boolean",e,"internal-error"),h(typeof I=="boolean",e,"internal-error"),M(s,e.name),M(o,e.name),M(c,e.name),M(l,e.name),M(u,e.name),M(d,e.name);const xe=new w({uid:f,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:I,photoURL:o,phoneNumber:s,tenantId:c,stsTokenManager:Gn,createdAt:u,lastLoginAt:d});return W&&Array.isArray(W)&&(xe.providerData=W.map(Kn=>m({},Kn))),l&&(xe._redirectEventId=l),xe}static _fromIdTokenResponse(e,t,r=!1){return a(this,null,function*(){const i=new X;i.updateFromServerResponse(t);const s=new w({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return yield ke(s),s})}static _fromGetAccountInfoResponse(e,t,r){return a(this,null,function*(){const i=t.users[0];h(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?In(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),c=new X;c.updateFromIdToken(r);const l=new w({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:o}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Qe(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,u),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ut=new Map;function A(n){R(n instanceof Function,"Expected a class definition");let e=Ut.get(n);return e?(R(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Ut.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(){this.type="NONE",this.storage={}}_isAvailable(){return a(this,null,function*(){return!0})}_set(e,t){return a(this,null,function*(){this.storage[e]=t})}_get(e){return a(this,null,function*(){const t=this.storage[e];return t===void 0?null:t})}_remove(e){return a(this,null,function*(){delete this.storage[e]})}_addListener(e,t){}_removeListener(e,t){}}yn.type="NONE";const Ft=yn;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(n,e,t){return`firebase:${n}:${e}:${t}`}class K{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=ve(this.userKey,i.apiKey,s),this.fullPersistenceKey=ve("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch(o){}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}getCurrentUser(){return a(this,null,function*(){const e=yield this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=yield Pe(this.auth,{idToken:e}).catch(()=>{});return t?w._fromGetAccountInfoResponse(this.auth,t,e):null}return w._fromJSON(this.auth,e)})}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}setPersistence(e){return a(this,null,function*(){if(this.persistence===e)return;const t=yield this.getCurrentUser();if(yield this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)})}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch(e){}}static create(e,t,r="authUser"){return a(this,null,function*(){if(!t.length)return new K(A(Ft),e,r);const i=(yield Promise.all(t.map(u=>a(null,null,function*(){try{if(yield u._isAvailable())return u}catch(d){return}})))).filter(u=>u);let s=i[0]||A(Ft);const o=ve(r,e.config.apiKey,e.name);let c=null;for(const u of t)try{const d=yield u._get(o);if(d){let f;if(typeof d=="string"){const g=yield Pe(e,{idToken:d}).catch(()=>{});if(!g)break;f=yield w._fromGetAccountInfoResponse(e,g,d)}else f=w._fromJSON(e,d);u!==s&&(c=f),s=u;break}}catch(d){}const l=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new K(s,e,r):(s=l[0],c&&(yield s._set(o,c.toJSON())),yield Promise.all(t.map(u=>a(null,null,function*(){if(u!==s)try{yield u._remove(o)}catch(d){}}))),new K(s,e,r))})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xt(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Tn(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(En(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Sn(e))return"Blackberry";if(Cn(e))return"Webos";if(wn(e))return"Safari";if((e.includes("chrome/")||bn(e))&&!e.includes("edge/"))return"Chrome";if(vn(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function En(n=_()){return/firefox\//i.test(n)}function wn(n=_()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function bn(n=_()){return/crios\//i.test(n)}function Tn(n=_()){return/iemobile/i.test(n)}function vn(n=_()){return/android/i.test(n)}function Sn(n=_()){return/blackberry/i.test(n)}function Cn(n=_()){return/webos/i.test(n)}function st(n=_()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Qi(n=_()){var e;return st(n)&&!!((e=window.navigator)!=null&&e.standalone)}function Zi(){return dr()&&document.documentMode===10}function An(n=_()){return st(n)||vn(n)||Cn(n)||Sn(n)||/windows phone/i.test(n)||Tn(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pn(n,e=[]){let t;switch(n){case"Browser":t=xt(_());break;case"Worker":t=`${xt(_())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${pe}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((o,c)=>{try{const l=e(s);o(l)}catch(l){c(l)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}runMiddleware(e){return a(this,null,function*(){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)yield r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch(s){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}})}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ts(t){return a(this,arguments,function*(n,e={}){return N(n,"GET","/v2/passwordPolicy",O(n,e))})}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ns=6;class rs{constructor(e){var r,i,s,o;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(r=t.minPasswordLength)!=null?r:ns,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(i=e.allowedNonAlphanumericCharacters)==null?void 0:i.join(""))!=null?s:"",this.forceUpgradeOnSignin=(o=e.forceUpgradeOnSignin)!=null?o:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var r,i,s,o,c,l;const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=(r=t.meetsMinPasswordLength)!=null?r:!0),t.isValid&&(t.isValid=(i=t.meetsMaxPasswordLength)!=null?i:!0),t.isValid&&(t.isValid=(s=t.containsLowercaseLetter)!=null?s:!0),t.isValid&&(t.isValid=(o=t.containsUppercaseLetter)!=null?o:!0),t.isValid&&(t.isValid=(c=t.containsNumericCharacter)!=null?c:!0),t.isValid&&(t.isValid=(l=t.containsNonAlphanumericCharacter)!=null?l:!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Bt(this),this.idTokenSubscription=new Bt(this),this.beforeStateQueue=new es(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=pn,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=A(t)),this._initializationPromise=this.queue(()=>a(this,null,function*(){var r,i,s;if(!this._deleted){try{this.persistenceManager=yield K.create(this,e)}catch(o){be(`Failed to initialize persistence: ${o}`),this.persistenceManager=yield K.create(this,[])}finally{(r=this._resolvePersistenceManagerAvailable)==null||r.call(this)}if(!this._deleted){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{yield this._popupRedirectResolver._initialize(this)}catch(o){}try{yield this.initializeCurrentUser(t)}catch(o){be(`Failed to initialize current user: ${o}`),yield this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}})),this._initializationPromise}_onStorageEvent(){return a(this,null,function*(){if(this._deleted)return;const e=yield this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),yield this.currentUser.getIdToken();return}yield this._updateCurrentUser(e,!0)}})}initializeCurrentUserFromIdToken(e){return a(this,null,function*(){try{const t=yield Pe(this,{idToken:e}),r=yield w._fromGetAccountInfoResponse(this,t,e);yield this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),yield this.directlySetCurrentUser(null)}})}initializeCurrentUser(e){return a(this,null,function*(){var s;if(y(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(c,c))}):this.directlySetCurrentUser(null)}const t=yield this.assertedPersistence.getCurrentUser();let r=t,i=!1;if(e&&this.config.authDomain){yield this.getOrInitRedirectPersistenceManager();const o=(s=this.redirectUser)==null?void 0:s._redirectEventId,c=r==null?void 0:r._redirectEventId,l=yield this.tryRedirectSignIn(e);(!o||o===c)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{yield this.beforeStateQueue.runMiddleware(r)}catch(o){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return h(this._popupRedirectResolver,this,"argument-error"),yield this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)})}tryRedirectSignIn(e){return a(this,null,function*(){let t=null;try{t=yield this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(r){yield this._setRedirectUser(null)}return t})}reloadAndSetCurrentUserOrClear(e){return a(this,null,function*(){try{yield ke(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)})}useDeviceLanguage(){this.languageCode=Ui()}_delete(){return a(this,null,function*(){this._deleted=!0})}updateCurrentUser(e){return a(this,null,function*(){if(y(this.app))return Promise.reject(P(this));const t=e?T(e):null;return t&&h(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))})}_updateCurrentUser(e,t=!1){return a(this,null,function*(){if(!this._deleted)return e&&h(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||(yield this.beforeStateQueue.runMiddleware(e)),this.queue(()=>a(this,null,function*(){yield this.directlySetCurrentUser(e),this.notifyAuthListeners()}))})}signOut(){return a(this,null,function*(){return y(this.app)?Promise.reject(P(this)):(yield this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&(yield this._setRedirectUser(null)),this._updateCurrentUser(null,!0))})}setPersistence(e){return y(this.app)?Promise.reject(P(this)):this.queue(()=>a(this,null,function*(){yield this.assertedPersistence.setPersistence(A(e))}))}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}validatePassword(e){return a(this,null,function*(){this._getPasswordPolicyInternal()||(yield this._updatePasswordPolicy());const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)})}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}_updatePasswordPolicy(){return a(this,null,function*(){const e=yield ts(this),t=new rs(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t})}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new de("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}revokeAccessToken(e){return a(this,null,function*(){if(this.currentUser){const t=yield this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),yield Xi(this,r)}})}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}_setRedirectUser(e,t){return a(this,null,function*(){const r=yield this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)})}getOrInitRedirectPersistenceManager(e){return a(this,null,function*(){if(!this.redirectPersistenceManager){const t=e&&A(e)||this._popupRedirectResolver;h(t,this,"argument-error"),this.redirectPersistenceManager=yield K.create(this,[A(t._redirectPersistence)],"redirectUser"),this.redirectUser=yield this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager})}_redirectUserForId(e){return a(this,null,function*(){var t,r;return this._isInitialized&&(yield this.queue(()=>a(this,null,function*(){}))),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null})}_persistUserIfCurrent(e){return a(this,null,function*(){if(e===this.currentUser)return this.queue(()=>a(this,null,function*(){return this.directlySetCurrentUser(e)}))})}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t,r;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=(r=(t=this.currentUser)==null?void 0:t.uid)!=null?r:null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(h(c,this,"internal-error"),c.then(()=>{o||s(this.currentUser)}).catch(l=>{if(!o)if(typeof t!="function"&&t.error)t.error(l);else if(r)r(l);else throw l}),typeof t=="function"){const l=e.addObserver(t,r,i);return()=>{o=!0,l()}}else{const l=e.addObserver(t);return()=>{o=!0,l()}}}directlySetCurrentUser(e){return a(this,null,function*(){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?yield this.persistenceManager.setCurrentUser(e):yield this.persistenceManager.removeCurrentUser()}catch(t){const r=(t==null?void 0:t.message)||String(t),i=Le(this,"internal-error",`An internal AuthError has occurred: ${r}`);throw i.customData={originalError:t},i}})}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return h(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Pn(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}_getAdditionalHeaders(){return a(this,null,function*(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=yield(i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);const r=yield this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e})}_getAppCheckToken(){return a(this,null,function*(){var t;if(y(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=yield(t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken();return e!=null&&e.error&&be(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token})}}function D(n){return T(n)}class Bt{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ir(t=>this.observer=t)}get next(){return h(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Me={loadJS(){return a(this,null,function*(){throw new Error("Unable to load external scripts")})},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ss(n){Me=n}function kn(n){return Me.loadJS(n)}function os(){return Me.recaptchaEnterpriseScript}function as(){return Me.gapiScript}function cs(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class ls{constructor(){this.enterprise=new us}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class us{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hs="recaptcha-enterprise",Rn="NO_RECAPTCHA",Ht="onFirebaseAuthREInstanceReady";class U{constructor(e){this.type=hs,this.auth=D(e)}verify(e="verify",t=!1){return a(this,null,function*(){function r(s){return a(this,null,function*(){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise((o,c)=>a(null,null,function*(){Wi(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const u=new Vi(l);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,o(u.siteKey)}}).catch(l=>{c(l)})}))})}function i(s,o,c){const l=window.grecaptcha;Lt(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(u=>{o(u)}).catch(()=>{o(Rn)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new ls().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{r(this.auth).then(c=>a(this,null,function*(){if(!t&&Lt(window.grecaptcha)&&U.scriptInjectionDeferred)yield U.scriptInjectionDeferred.promise,i(c,s,o);else{if(typeof window=="undefined"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let l=os();l.length!==0&&(l+=c+`&onload=${Ht}`),U.scriptInjectionDeferred=new on,window[Ht]=()=>{var u;(u=U.scriptInjectionDeferred)==null||u.resolve()},kn(l).then(()=>{var u;return(u=U.scriptInjectionDeferred)==null?void 0:u.promise}).then(()=>{i(c,s,o)}).catch(u=>{o(u)})}})).catch(c=>{o(c)})})})}}U.scriptInjectionDeferred=null;function $t(n,e,t,r=!1,i=!1){return a(this,null,function*(){const s=new U(n);let o;if(i)o=Rn;else try{o=yield s.verify(t)}catch(l){o=yield s.verify(t,!0)}const c=m({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const l=c.phoneEnrollmentInfo.phoneNumber,u=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const l=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:o}):Object.assign(c,{captchaResponse:o}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c})}function Re(n,e,t,r,i){return a(this,null,function*(){var s;if((s=n._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=yield $t(n,e,t,t==="getOobCode");return r(n,o)}else return r(n,e).catch(o=>a(null,null,function*(){if(o.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const c=yield $t(n,e,t,t==="getOobCode");return r(n,c)}else return Promise.reject(o)}))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ds(n,e){const t=un(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(ee(s,e!=null?e:{}))return i;E(i,"already-initialized")}return t.initialize({options:e})}function fs(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(A);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function ps(n,e,t){const r=D(n);h(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=On(e),{host:o,port:c}=gs(e),l=c===null?"":`:${c}`,u={url:`${s}//${o}${l}/`},d=Object.freeze({host:o,port:c,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){h(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),h(ee(u,r.config.emulator)&&ee(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=u,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,et(o)?wr(`${s}//${o}${l}`):ms()}function On(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function gs(n){const e=On(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Vt(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Vt(o)}}}function Vt(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function ms(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console!="undefined"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window!="undefined"&&typeof document!="undefined"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return C("not implemented")}_getIdTokenResponse(e){return C("not implemented")}_linkToIdToken(e,t){return C("not implemented")}_getReauthenticationResolver(e){return C("not implemented")}}function _s(n,e){return a(this,null,function*(){return N(n,"POST","/v1/accounts:signUp",e)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(n,e){return a(this,null,function*(){return me(n,"POST","/v1/accounts:signInWithPassword",O(n,e))})}function ys(n,e){return a(this,null,function*(){return N(n,"POST","/v1/accounts:sendOobCode",O(n,e))})}function Es(n,e){return a(this,null,function*(){return ys(n,e)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ws(n,e){return a(this,null,function*(){return me(n,"POST","/v1/accounts:signInWithEmailLink",O(n,e))})}function bs(n,e){return a(this,null,function*(){return me(n,"POST","/v1/accounts:signInWithEmailLink",O(n,e))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he extends ot{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new he(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new he(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}_getIdTokenResponse(e){return a(this,null,function*(){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Re(e,t,"signInWithPassword",Is);case"emailLink":return ws(e,{email:this._email,oobCode:this._password});default:E(e,"internal-error")}})}_linkToIdToken(e,t){return a(this,null,function*(){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Re(e,r,"signUpPassword",_s);case"emailLink":return bs(e,{idToken:t,email:this._email,oobCode:this._password});default:E(e,"internal-error")}})}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(n,e){return a(this,null,function*(){return me(n,"POST","/v1/accounts:signInWithIdp",O(n,e))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ts="http://localhost";class q extends ot{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new q(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):E("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const c=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=c,s=Ee(c,["providerId","signInMethod"]);if(!r||!i)return null;const o=new q(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Q(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Q(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Q(e,t)}buildRequest(){const e={requestUri:Ts,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=fe(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vs(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Ss(n){const e=re(ie(n)).link,t=e?re(ie(e)).deep_link_id:null,r=re(ie(n)).deep_link_id;return(r?re(ie(r)).link:null)||r||t||e||n}class at{constructor(e){var o,c,l,u,d,f;const t=re(ie(e)),r=(o=t.apiKey)!=null?o:null,i=(c=t.oobCode)!=null?c:null,s=vs((l=t.mode)!=null?l:null);h(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=(u=t.continueUrl)!=null?u:null,this.languageCode=(d=t.lang)!=null?d:null,this.tenantId=(f=t.tenantId)!=null?f:null}static parseLink(e){const t=Ss(e);try{return new at(t)}catch(r){return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{constructor(){this.providerId=ne.PROVIDER_ID}static credential(e,t){return he._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=at.parseLink(t);return h(r,"argument-error"),he._fromEmailAndCode(e,r.code,r.tenantId)}}ne.PROVIDER_ID="password";ne.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ne.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e extends ct{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F extends _e{constructor(){super("facebook.com")}static credential(e){return q._fromParams({providerId:F.PROVIDER_ID,signInMethod:F.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return F.credentialFromTaggedObject(e)}static credentialFromError(e){return F.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return F.credential(e.oauthAccessToken)}catch(t){return null}}}F.FACEBOOK_SIGN_IN_METHOD="facebook.com";F.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x extends _e{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return q._fromParams({providerId:x.PROVIDER_ID,signInMethod:x.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return x.credentialFromTaggedObject(e)}static credentialFromError(e){return x.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return x.credential(t,r)}catch(i){return null}}}x.GOOGLE_SIGN_IN_METHOD="google.com";x.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B extends _e{constructor(){super("github.com")}static credential(e){return q._fromParams({providerId:B.PROVIDER_ID,signInMethod:B.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return B.credentialFromTaggedObject(e)}static credentialFromError(e){return B.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return B.credential(e.oauthAccessToken)}catch(t){return null}}}B.GITHUB_SIGN_IN_METHOD="github.com";B.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H extends _e{constructor(){super("twitter.com")}static credential(e,t){return q._fromParams({providerId:H.PROVIDER_ID,signInMethod:H.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return H.credentialFromTaggedObject(e)}static credentialFromError(e){return H.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return H.credential(t,r)}catch(i){return null}}}H.TWITTER_SIGN_IN_METHOD="twitter.com";H.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cs(n,e){return a(this,null,function*(){return me(n,"POST","/v1/accounts:signUp",O(n,e))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static _fromIdTokenResponse(e,t,r,i=!1){return a(this,null,function*(){const s=yield w._fromIdTokenResponse(e,r,i),o=Wt(r);return new J({user:s,providerId:o,_tokenResponse:r,operationType:t})})}static _forOperation(e,t,r){return a(this,null,function*(){yield e._updateTokensIfNecessary(r,!0);const i=Wt(r);return new J({user:e,providerId:i,_tokenResponse:r,operationType:t})})}}function Wt(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe extends V{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Oe.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!=null?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new Oe(e,t,r,i)}}function Nn(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Oe._fromErrorAndOperation(n,s,e,r):s})}function As(n,e,t=!1){return a(this,null,function*(){const r=yield ue(n,e._linkToIdToken(n.auth,yield n.getIdToken()),t);return J._forOperation(n,"link",r)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ps(n,e,t=!1){return a(this,null,function*(){const{auth:r}=n;if(y(r.app))return Promise.reject(P(r));const i="reauthenticate";try{const s=yield ue(n,Nn(r,i,e,n),t);h(s.idToken,r,"internal-error");const o=it(s.idToken);h(o,r,"internal-error");const{sub:c}=o;return h(n.uid===c,r,"user-mismatch"),J._forOperation(n,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&E(r,"user-mismatch"),s}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dn(n,e,t=!1){return a(this,null,function*(){if(y(n.app))return Promise.reject(P(n));const r="signIn",i=yield Nn(n,r,e),s=yield J._fromIdTokenResponse(n,r,i);return t||(yield n._updateCurrentUser(s.user)),s})}function ks(n,e){return a(this,null,function*(){return Dn(D(n),e)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ln(n){return a(this,null,function*(){const e=D(n);e._getPasswordPolicyInternal()&&(yield e._updatePasswordPolicy())})}function Go(n,e,t){return a(this,null,function*(){const r=D(n);yield Re(r,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Es)})}function Ko(n,e,t){return a(this,null,function*(){if(y(n.app))return Promise.reject(P(n));const r=D(n),o=yield Re(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Cs).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Ln(n),l}),c=yield J._fromIdTokenResponse(r,"signIn",o);return yield r._updateCurrentUser(c.user),c})}function qo(n,e,t){return y(n.app)?Promise.reject(P(n)):ks(T(n),ne.credential(e,t)).catch(r=>a(null,null,function*(){throw r.code==="auth/password-does-not-meet-requirements"&&Ln(n),r}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jo(n,e){return T(n).setPersistence(e)}function Rs(n,e,t,r){return T(n).onIdTokenChanged(e,t,r)}function Os(n,e,t){return T(n).beforeAuthStateChanged(e,t)}function Yo(n,e,t,r){return T(n).onAuthStateChanged(e,t,r)}function Xo(n){return T(n).signOut()}function Qo(n){return a(this,null,function*(){return T(n).delete()})}const Ne="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ne,"1"),this.storage.removeItem(Ne),Promise.resolve(!0)):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ns=1e3,Ds=10;class Z extends Mn{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=An(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,l)=>{this.notifyListeners(o,l)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);Zi()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Ds):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Ns)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}_set(e,t){return a(this,null,function*(){yield j(Z.prototype,this,"_set").call(this,e,t),this.localCache[e]=JSON.stringify(t)})}_get(e){return a(this,null,function*(){const t=yield j(Z.prototype,this,"_get").call(this,e);return this.localCache[e]=JSON.stringify(t),t})}_remove(e){return a(this,null,function*(){yield j(Z.prototype,this,"_remove").call(this,e),delete this.localCache[e]})}}Z.type="LOCAL";const Ls=Z;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un extends Mn{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Un.type="SESSION";const Fn=Un;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ms(n){return Promise.all(n.map(e=>a(null,null,function*(){try{return{fulfilled:!0,value:yield e}}catch(t){return{fulfilled:!1,reason:t}}})))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new Ue(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}handleEvent(e){return a(this,null,function*(){const t=e,{eventId:r,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const c=Array.from(o).map(u=>a(this,null,function*(){return u(t.origin,s)})),l=yield Ms(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ue.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Us{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}_send(e,t,r=50){return a(this,null,function*(){const i=typeof MessageChannel!="undefined"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((c,l)=>{const u=lt("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(f){const g=f;if(g.data.eventId===u)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),c(g.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v(){return window}function Fs(n){v().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xn(){return typeof v().WorkerGlobalScope!="undefined"&&typeof v().importScripts=="function"}function xs(){return a(this,null,function*(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(yield navigator.serviceWorker.ready).active}catch(n){return null}})}function Bs(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function Hs(){return xn()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn="firebaseLocalStorageDb",$s=1,De="firebaseLocalStorage",Hn="fbase_key";class Ie{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Fe(n,e){return n.transaction([De],e?"readwrite":"readonly").objectStore(De)}function Vs(){const n=indexedDB.deleteDatabase(Bn);return new Ie(n).toPromise()}function $n(){const n=indexedDB.open(Bn,$s);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(De,{keyPath:Hn})}catch(i){t(i)}}),n.addEventListener("success",()=>a(null,null,function*(){const r=n.result;r.objectStoreNames.contains(De)?e(r):(r.close(),yield Vs(),e(yield $n()))}))})}function jt(n,e,t){return a(this,null,function*(){const r=Fe(n,!0).put({[Hn]:e,value:t});return new Ie(r).toPromise()})}function Ws(n,e){return a(this,null,function*(){const t=Fe(n,!1).get(e),r=yield new Ie(t).toPromise();return r===void 0?null:r.value})}function zt(n,e){const t=Fe(n,!0).delete(e);return new Ie(t).toPromise()}const js=800,zs=3;class Vn{registerLifecycleListeners(){typeof window!="undefined"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window!="undefined"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}_openDb(){return a(this,null,function*(){return this.dbPromise?this.dbPromise:(this.dbPromise=$n(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)})}_withRetries(e){return a(this,null,function*(){let t=0;for(;;)try{const r=yield this._openDb();return yield e(r)}catch(r){if(t++>zs)throw r;if(this.dbPromise){const i=this.dbPromise;this.dbPromise=null;try{(yield i).close()}catch(s){}}}})}initializeServiceWorkerMessaging(){return a(this,null,function*(){return xn()?this.initializeReceiver():this.initializeSender()})}initializeReceiver(){return a(this,null,function*(){this.receiver=Ue._getInstance(Hs()),this.receiver._subscribe("keyChanged",(e,t)=>a(this,null,function*(){return{keyProcessed:(yield this._poll()).includes(t.key)}})),this.receiver._subscribe("ping",(e,t)=>a(this,null,function*(){return["keyChanged"]}))})}initializeSender(){return a(this,null,function*(){var t,r;if(this.activeServiceWorker=yield xs(),!this.activeServiceWorker)return;this.sender=new Us(this.activeServiceWorker);const e=yield this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)})}notifyServiceWorker(e){return a(this,null,function*(){if(!(!this.sender||!this.activeServiceWorker||Bs()!==this.activeServiceWorker))try{yield this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(t){}})}_isAvailable(){return a(this,null,function*(){try{return indexedDB?(yield this._withRetries(e=>a(this,null,function*(){yield jt(e,Ne,"1"),yield zt(e,Ne)})),!0):!1}catch(e){}return!1})}_withPendingWrite(e){return a(this,null,function*(){this.pendingWrites++;try{yield e()}finally{this.pendingWrites--}})}_set(e,t){return a(this,null,function*(){return this._withPendingWrite(()=>a(this,null,function*(){return yield this._withRetries(r=>jt(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)}))})}_get(e){return a(this,null,function*(){const t=yield this._withRetries(r=>Ws(r,e));return this.localCache[e]=t,t})}_remove(e){return a(this,null,function*(){return this._withPendingWrite(()=>a(this,null,function*(){return yield this._withRetries(t=>zt(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)}))})}_poll(){return a(this,null,function*(){if(this.isClosing)return[];try{const e=yield this._withRetries(i=>{const s=Fe(i,!1).getAll();return new Ie(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}catch(e){return this.isClosing||be(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}})}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>a(this,null,function*(){return this._poll()}),js)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Vn.type="LOCAL";const Gs=Vn;new ge(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wn(n,e){return e?A(e):(h(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut extends ot{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Q(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Q(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Q(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Ks(n){return Dn(n.auth,new ut(n),n.bypassAuthState)}function qs(n){const{auth:e,user:t}=n;return h(t,e,"internal-error"),Ps(t,new ut(n),n.bypassAuthState)}function Js(n){return a(this,null,function*(){const{auth:e,user:t}=n;return h(t,e,"internal-error"),As(t,new ut(n),n.bypassAuthState)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise((e,t)=>a(this,null,function*(){this.pendingPromise={resolve:e,reject:t};try{this.eventManager=yield this.resolver._initialize(this.auth),yield this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}}))}onAuthEvent(e){return a(this,null,function*(){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:o,type:c}=e;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(yield this.getIdpTask(c)(l))}catch(u){this.reject(u)}})}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ks;case"linkViaPopup":case"linkViaRedirect":return Js;case"reauthViaPopup":case"reauthViaRedirect":return qs;default:E(this.auth,"internal-error")}}resolve(e){R(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){R(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ys=new ge(2e3,1e4);function Zo(n,e,t){return a(this,null,function*(){if(y(n.app))return Promise.reject(b(n,"operation-not-supported-in-this-environment"));const r=D(n);Di(n,e,ct);const i=Wn(r,t);return new G(r,"signInViaPopup",e,i).executeNotNull()})}class G extends jn{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,G.currentPopupAction&&G.currentPopupAction.cancel(),G.currentPopupAction=this}executeNotNull(){return a(this,null,function*(){const e=yield this.execute();return h(e,this.auth,"internal-error"),e})}onExecution(){return a(this,null,function*(){R(this.filter.length===1,"Popup operations only handle one event");const e=lt();this.authWindow=yield this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(b(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()})}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(b(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,G.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(b(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Ys.get())};e()}}G.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xs="pendingRedirect",Se=new Map;class oe extends jn{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}execute(){return a(this,null,function*(){let e=Se.get(this.auth._key());if(!e){try{const r=(yield Qs(this.resolver,this.auth))?yield j(oe.prototype,this,"execute").call(this):null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Se.set(this.auth._key(),e)}return this.bypassAuthState||Se.set(this.auth._key(),()=>Promise.resolve(null)),e()})}onAuthEvent(e){return a(this,null,function*(){if(e.type==="signInViaRedirect")return j(oe.prototype,this,"onAuthEvent").call(this,e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=yield this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,j(oe.prototype,this,"onAuthEvent").call(this,e);this.resolve(null)}})}onExecution(){return a(this,null,function*(){})}cleanUp(){}}function Qs(n,e){return a(this,null,function*(){const t=to(e),r=eo(n);if(!(yield r._isAvailable()))return!1;const i=(yield r._get(t))==="true";return yield r._remove(t),i})}function Zs(n,e){Se.set(n._key(),e)}function eo(n){return A(n._redirectPersistence)}function to(n){return ve(Xs,n.config.apiKey,n.name)}function no(n,e,t=!1){return a(this,null,function*(){if(y(n.app))return Promise.reject(P(n));const r=D(n),i=Wn(r,e),o=yield new oe(r,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,yield r._persistUserIfCurrent(o.user),yield r._setRedirectUser(null,e)),o})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ro=600*1e3;class io{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!so(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!zn(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(b(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=ro&&this.cachedEventUids.clear(),this.cachedEventUids.has(Gt(e))}saveEventToCache(e){this.cachedEventUids.add(Gt(e)),this.lastProcessedEventTime=Date.now()}}function Gt(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function zn({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function so(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return zn(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oo(t){return a(this,arguments,function*(n,e={}){return N(n,"GET","/v1/projects",e)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ao=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,co=/^https?/;function lo(n){return a(this,null,function*(){if(n.config.emulator)return;const{authorizedDomains:e}=yield oo(n);for(const t of e)try{if(uo(t))return}catch(r){}E(n,"unauthorized-domain")})}function uo(n){const e=Xe(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!co.test(t))return!1;if(ao.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ho=new ge(3e4,6e4);function Kt(){const n=v().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function fo(n){return new Promise((e,t)=>{var i,s,o;function r(){Kt(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Kt(),t(b(n,"network-request-failed"))},timeout:ho.get()})}if((s=(i=v().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((o=v().gapi)!=null&&o.load)r();else{const c=cs("iframefcb");return v()[c]=()=>{gapi.load?r():t(b(n,"network-request-failed"))},kn(`${as()}?onload=${c}`).catch(l=>t(l))}}).catch(e=>{throw Ce=null,e})}let Ce=null;function po(n){return Ce=Ce||fo(n),Ce}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const go=new ge(5e3,15e3),mo="__/auth/iframe",_o="emulator/auth/iframe",Io={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},yo=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Eo(n){const e=n.config;h(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?rt(e,_o):`https://${n.config.authDomain}/${mo}`,r={apiKey:e.apiKey,appName:n.name,v:pe},i=yo.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${fe(r).slice(1)}`}function wo(n){return a(this,null,function*(){const e=yield po(n),t=v().gapi;return h(t,n,"internal-error"),e.open({where:document.body,url:Eo(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Io,dontclear:!0},r=>new Promise((i,s)=>a(null,null,function*(){yield r.restyle({setHideOnLeave:!1});const o=b(n,"network-request-failed"),c=v().setTimeout(()=>{s(o)},go.get());function l(){v().clearTimeout(c),i(r)}r.ping(l).then(l,()=>{s(o)})})))})}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bo={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},To=500,vo=600,So="_blank",Co="http://localhost";class qt{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function Ao(n,e,t,r=To,i=vo){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const l=L(m({},bo),{width:r.toString(),height:i.toString(),top:s,left:o}),u=_().toLowerCase();t&&(c=bn(u)?So:t),En(u)&&(e=e||Co,l.scrollbars="yes");const d=Object.entries(l).reduce((g,[I,W])=>`${g}${I}=${W},`,"");if(Qi(u)&&c!=="_self")return Po(e||"",c),new qt(null);const f=window.open(e||"",c,d);h(f,n,"popup-blocked");try{f.focus()}catch(g){}return new qt(f)}function Po(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ko="__/auth/handler",Ro="emulator/auth/handler",Oo=encodeURIComponent("fac");function Jt(n,e,t,r,i,s){return a(this,null,function*(){h(n.config.authDomain,n,"auth-domain-config-required"),h(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:pe,eventId:i};if(e instanceof ct){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",_r(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,f]of Object.entries({}))o[d]=f}if(e instanceof _e){const d=e.getScopes().filter(f=>f!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const c=o;for(const d of Object.keys(c))c[d]===void 0&&delete c[d];const l=yield n._getAppCheckToken(),u=l?`#${Oo}=${encodeURIComponent(l)}`:"";return`${No(n)}?${fe(c).slice(1)}${u}`})}function No({config:n}){return n.emulator?rt(n,Ro):`https://${n.authDomain}/${ko}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze="webStorageSupport";class Do{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Fn,this._completeRedirectFn=no,this._overrideRedirectResult=Zs}_openPopup(e,t,r,i){return a(this,null,function*(){var o;R((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const s=yield Jt(e,t,r,Xe(),i);return Ao(e,s,lt())})}_openRedirect(e,t,r,i){return a(this,null,function*(){yield this._originValidation(e);const s=yield Jt(e,t,r,Xe(),i);return Fs(s),new Promise(()=>{})})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(R(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}initAndGetManager(e){return a(this,null,function*(){const t=yield wo(e),r=new io(e);return t.register("authEvent",i=>(h(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r})}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(ze,{type:ze},i=>{var o;const s=(o=i==null?void 0:i[0])==null?void 0:o[ze];s!==void 0&&t(!!s),E(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=lo(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return An()||wn()||st()}}const Lo=Do;var Yt="@firebase/auth",Xt="1.13.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}getToken(e){return a(this,null,function*(){return this.assertAuthConfigured(),yield this.auth._initializationPromise,this.auth.currentUser?{accessToken:yield this.auth.currentUser.getIdToken(e)}:null})}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){h(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Fo(n){ce(new te("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=r.options;h(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:o,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Pn(n)},u=new is(r,i,s,l);return fs(u,t),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),ce(new te("auth-internal",e=>{const t=D(e.getProvider("auth").getImmediate());return(r=>new Mo(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Y(Yt,Xt,Uo(n)),Y(Yt,Xt,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xo=300,Bo=sn("authIdTokenMaxAge")||xo;let Qt=null;const Ho=n=>e=>a(null,null,function*(){const t=e&&(yield e.getIdTokenResult()),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Bo)return;const i=t==null?void 0:t.token;Qt!==i&&(Qt=i,yield fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))});function ea(n=wi()){const e=un(n,"auth");if(e.isInitialized())return e.getImmediate();const t=ds(n,{popupRedirectResolver:Lo,persistence:[Gs,Ls,Fn]}),r=sn("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=Ho(s.toString());Os(t,o,()=>o(t.currentUser)),Rs(t,c=>o(c))}}const i=ar("auth");return i&&ps(t,`http://${i}`),t}function $o(){var n,e;return(e=(n=document.getElementsByTagName("head"))==null?void 0:n[0])!=null?e:document}ss({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=b("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",$o().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Fo("Browser");var Vo="firebase",Wo="12.19.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Y(Vo,Wo,"app");export{x as G,wi as a,ea as b,Go as c,Zo as d,Qo as e,Jo as f,zo as g,Ls as h,Ei as i,Fn as j,qo as k,Ko as l,Yo as o,Xo as s};
