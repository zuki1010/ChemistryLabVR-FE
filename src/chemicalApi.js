const API = import.meta.env.VITE_API_BASE_URL || '';
const SESSION = 'clvr-session';
export function getSession(){try{return JSON.parse(sessionStorage.getItem(SESSION)||'null')}catch{return null}}
export function setSession(value){value?.accessToken?sessionStorage.setItem(SESSION,JSON.stringify(value)):sessionStorage.removeItem(SESSION)}
async function request(path,{token,method='GET',body}={}){
 const headers={Accept:'application/json'}; if(token)headers.Authorization='Bearer '+token;
 if(body!==undefined)headers['Content-Type']='application/json';
 let response; try{response=await fetch(API+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)})}
 catch{throw new Error('Không kết nối được backend. Kiểm tra server hoặc API URL.')}
 if(!response.ok){let message='Yêu cầu thất bại (HTTP '+response.status+')';try{const d=await response.json();message=d.message||d.error||message}catch{}const e=new Error(message);e.status=response.status;throw e}
 if(response.status===204)return null;
 return (response.headers.get('content-type')||'').includes('json')?response.json():response.text()
}
const stateLabel={LIQUID:'Lỏng',SOLID:'Rắn',GAS:'Khí'};
export function normalizeChemical(c){return {id:c.id,name:c.name,formula:c.formula,state:c.state,stateLabel:stateLabel[c.state]||c.state,color:c.colorHex||c.color_hex||'#bce9f0',danger:c.dangerLevel??c.danger_level??1,density:c.density??'',unit:c.unit||'',description:c.description||''}}
export const signIn=(email,password)=>request('/api/v1/auth/login',{method:'POST',body:{email,password}});
export const signUp=(fullName,email,password)=>request('/api/v1/auth/register',{method:'POST',body:{fullName,email,password}});
export const signOut=token=>request('/api/v1/auth/logout',{token,method:'POST'});
export async function listChemicals(token){return (await request('/api/v1/chemical/all',{token})||[]).map(normalizeChemical)}
export async function oneChemical(token,id){return normalizeChemical(await request('/api/v1/chemical/'+id,{token}))}
export const createChemical=(token,body)=>request('/api/v1/chemical/create',{token,method:'POST',body});
export const updateChemical=(token,id,body)=>request('/api/v1/chemical/update/'+id,{token,method:'PUT',body});
export const removeChemical=(token,id)=>request('/api/v1/chemical/delete/'+id,{token,method:'DELETE'});
export const listReactions=token=>request('/api/v1/reaction/all',{token});

