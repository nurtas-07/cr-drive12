const config=window.CR_DRIVE_CONFIG||{};
const byId=id=>document.getElementById(id);
const loginPanel=byId('login-panel'),livePanel=byId('live-panel'),loginStatus=byId('login-status');
let timer,refreshing=false,selectedDriverId=null,deferredInstall=null;
const configured=()=>/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl||'')&&Boolean(config.publishableKey);
const readSession=()=>{try{return JSON.parse(localStorage.getItem('crdrive-dispatcher-session'))}catch{return null}};
const storeSession=value=>localStorage.setItem('crdrive-dispatcher-session',JSON.stringify(value));
const clearSession=()=>{localStorage.removeItem('crdrive-dispatcher-session');clearInterval(timer);timer=undefined};
const headers=token=>({apikey:config.publishableKey,authorization:`Bearer ${token}`});
const showLive=enabled=>{loginPanel.hidden=enabled;livePanel.hidden=!enabled};
const value=(id,next)=>{byId(id).textContent=next??'—'};

async function login(email,password){
  const response=await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:config.publishableKey,'content-type':'application/json'},body:JSON.stringify({email,password})});
  if(!response.ok)throw new Error('Неверный email или пароль');
  saveAuth(await response.json());
}
function saveAuth(body){storeSession({accessToken:body.access_token,refreshToken:body.refresh_token,expiresAt:Date.now()+body.expires_in*1000})}
async function accessToken(){
  const auth=readSession();if(!auth)return null;
  if(auth.expiresAt>Date.now()+60000)return auth.accessToken;
  if(!auth.refreshToken)return null;
  const response=await fetch(`${config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:config.publishableKey,'content-type':'application/json'},body:JSON.stringify({refresh_token:auth.refreshToken})});
  if(!response.ok)return null;const body=await response.json();saveAuth(body);return body.access_token;
}
function renderDriverList(rows){
  const list=byId('driver-list');list.replaceChildren();
  rows.forEach((row,index)=>{const vehicle=row.vehicle_number||(row.source?.startsWith('wear-os:')?row.source.slice(8):'');const button=document.createElement('button');button.type='button';button.className='driver-chip';button.setAttribute('aria-pressed',String(row.driver_id===selectedDriverId));button.textContent=vehicle||`Водитель ${index+1}`;const status=document.createElement('small');const age=Date.now()-Date.parse(row.captured_at);status.textContent=`Водитель ${index+1} · ${age>=0&&age<=30000?'на связи':`${Math.max(0,Math.floor(age/1000))} сек назад`}`;button.append(status);button.addEventListener('click',()=>{selectedDriverId=row.driver_id;renderDriverList(rows);renderDriver(row)});list.append(button)})
}
function renderDriver(row){
  const age=Date.now()-Date.parse(row.captured_at),fresh=age>=0&&age<=30000;
  byId('connection').replaceChildren();if(fresh){const pulse=document.createElement('span');pulse.className='pulse';pulse.setAttribute('aria-hidden','true');byId('connection').append(pulse)}byId('connection').append(fresh?(row.low_pulse_alert?'ТРЕВОГА · низкий пульс':'Связь активна · данные устройства'):`Нет свежих данных · ${Math.floor(age/1000)} сек назад`);
  byId('connection').classList.toggle('danger',Boolean(row.low_pulse_alert));
  value('heart',fresh?row.bpm:null);value('oxygen',fresh?row.oxygen_percent:null);value('battery',fresh?row.battery_percent:null);
  const vehicle=row.vehicle_number||(row.source?.startsWith('wear-os:')?row.source.slice(8):'');value('vehicle',vehicle||'Не назначен');
  byId('on-body').textContent=!fresh?'—':row.on_body===false?'Сняты':row.on_body===true?'На руке':'Нет данных';
  byId('updated-at').textContent=new Date(row.captured_at).toLocaleString('ru-RU');
  const hasLocation=fresh&&Number.isFinite(row.latitude)&&Number.isFinite(row.longitude);
  byId('location').textContent=hasLocation?`${row.latitude.toFixed(5)}, ${row.longitude.toFixed(5)} · точность ${Math.round(row.accuracy_m||0)} м`:'Нет свежей GPS-точки';
  const map=byId('map-link');map.hidden=!hasLocation;if(hasLocation)map.href=`https://www.openstreetmap.org/?mlat=${encodeURIComponent(row.latitude)}&mlon=${encodeURIComponent(row.longitude)}#map=17/${encodeURIComponent(row.latitude)}/${encodeURIComponent(row.longitude)}`;
}
async function refresh(){
  if(refreshing||!navigator.onLine)return;refreshing=true;
  try{
    const token=await accessToken();if(!token){clearSession();showLive(false);loginStatus.textContent='Сессия завершена. Войдите снова.';return}
    const response=await fetch(`${config.supabaseUrl}/rest/v1/driver_live?select=*&order=received_at.desc`,{headers:headers(token),cache:'no-store'});
    if(response.status===401){clearSession();showLive(false);return}if(!response.ok)throw new Error(`Сервер не ответил: ${response.status}`);
    const rows=await response.json();if(!rows.length){byId('connection').textContent='Нет доступных водителей';byId('driver-list').replaceChildren();return}
    if(!selectedDriverId||!rows.some(row=>row.driver_id===selectedDriverId))selectedDriverId=rows[0].driver_id;
    renderDriverList(rows);renderDriver(rows.find(row=>row.driver_id===selectedDriverId)||rows[0]);
    byId('network-status').textContent='Обновлено только что';byId('network-status').classList.remove('offline');
  }finally{refreshing=false}
}
function updateNetwork(){const online=navigator.onLine;byId('network-status').textContent=online?'Интернет подключён':'Нет интернета · ожидаем восстановление связи';byId('network-status').classList.toggle('offline',!online);if(online&&readSession())refresh().catch(()=>{})}
function startUpdates(){clearInterval(timer);timer=setInterval(()=>refresh().catch(()=>{byId('network-status').textContent='Повторяем подключение…';byId('network-status').classList.add('offline')}),3000);refresh().catch(()=>{})}

byId('login-form').addEventListener('submit',async event=>{event.preventDefault();loginStatus.textContent='Проверяем доступ…';try{await login(byId('email').value,byId('password').value);showLive(true);startUpdates()}catch(error){loginStatus.textContent=error.message}});
byId('logout').addEventListener('click',()=>{clearSession();showLive(false)});
addEventListener('online',updateNetwork);addEventListener('offline',updateNetwork);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&readSession())refresh().catch(()=>{})});
addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;byId('install-app').hidden=false});
byId('install-app').addEventListener('click',async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;byId('install-app').hidden=true});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./dispatcher-sw.js').catch(()=>{});
updateNetwork();
if(!configured())loginStatus.textContent='Сервер ещё не подключён администратором CR Drive.';else if(readSession()){showLive(true);startUpdates()}
