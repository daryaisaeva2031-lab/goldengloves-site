/* Календарь сайта «Золотые перчатки»: один компонент для всех дат.
   Дата рождения: <input data-dp data-years="20" data-start="8"> — на экране ДД.ММ.ГГГГ, в форму уходит ГГГГ-ММ-ДД (скрытое поле).
   Другие даты: GGCal(input, {min, max, off(d), iso:false, onPick}) */
(function(){
var M=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
function p2(n){return(n<10?'0':'')+n}
function day(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function parse(s){var m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(s||'');if(!m)return null;var d=new Date(+m[3],m[2]-1,+m[1]);return d.getDate()==+m[1]&&d.getMonth()==m[2]-1?d:null}
function isoS(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function ru(d){return p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()}
function GGCal(inp,o){o=o||{};var min=day(o.min),max=day(o.max),off=o.off||function(){return false},h=null;
  if(o.iso){h=document.createElement('input');h.type='hidden';h.name=inp.name;inp.removeAttribute('name');inp.after(h)}
  inp.type='text';inp.readOnly=false;inp.inputMode='numeric';inp.autocomplete='off';inp.placeholder='ДД.ММ.ГГГГ';inp.maxLength=10;
  var cal=document.createElement('div');cal.className='cal dp';cal.hidden=true;(inp.closest('label')||inp).after(cal);
  var st=o.start||max,y=st.getFullYear(),m=st.getMonth();
  function ok(d){return d&&d>=min&&d<=max&&!off(d)}
  function sync(){var d=parse(inp.value);if(h)h.value=d&&ok(d)?isoS(d):'';
    inp.setCustomValidity(inp.value&&!ok(d)?(o.msg||'Введите дату в формате ДД.ММ.ГГГГ'):'');return ok(d)?d:null}
  function clamp(){if(new Date(y,m+1,0)<min){y=min.getFullYear();m=min.getMonth()}if(new Date(y,m,1)>max){y=max.getFullYear();m=max.getMonth()}}
  function draw(){clamp();var sel=parse(inp.value),ys='',ms='',i;
    for(i=max.getFullYear();i>=min.getFullYear();i--)ys+='<option'+(i==y?' selected':'')+'>'+i+'</option>';
    M.forEach(function(n,k){var dis=new Date(y,k+1,0)<min||new Date(y,k,1)>max;ms+='<option value="'+k+'"'+(k==m?' selected':'')+(dis?' disabled':'')+'>'+n+'</option>'});
    var pv=new Date(y,m,0)<min,nx=new Date(y,m+1,1)>max;
    var t='<div class="calh"><button type="button" data-n="-1" aria-label="Предыдущий месяц"'+(pv?' disabled':'')+'>‹</button><span class="dps"><select aria-label="Месяц">'+ms+'</select><select aria-label="Год">'+ys+'</select></span><button type="button" data-n="1" aria-label="Следующий месяц"'+(nx?' disabled':'')+'>›</button></div><div class="calg">'+['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(function(d){return'<i>'+d+'</i>'}).join('');
    var f=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();for(i=0;i<f;i++)t+='<span></span>';
    for(i=1;i<=n;i++){var d=new Date(y,m,i);t+='<button type="button" data-d="'+i+'"'+(ok(d)?'':' disabled')+(sel&&+sel==+d?' class="on"':'')+'>'+i+'</button>'}
    cal.innerHTML=t+'</div>';var s=cal.querySelectorAll('select');s[0].onchange=function(){m=+this.value;draw()};s[1].onchange=function(){y=+this.value;draw()}}
  function open(){var d=parse(inp.value);if(d){y=d.getFullYear();m=d.getMonth()}cal.hidden=false;draw()}
  function pick(d){inp.value=ru(d);sync();cal.hidden=true;inp.dispatchEvent(new Event('change',{bubbles:true}));if(o.onPick)o.onPick(d)}
  cal.addEventListener('click',function(e){e.stopPropagation();var b=e.target.closest('button');if(!b||b.disabled)return;e.preventDefault();
    if(b.dataset.n){m+=+b.dataset.n;if(m<0){m=11;y--}if(m>11){m=0;y++}draw()}else if(b.dataset.d)pick(new Date(y,m,+b.dataset.d))});
  inp.addEventListener('click',open);inp.addEventListener('focus',open);
  inp.addEventListener('input',function(){var v=inp.value.replace(/\D/g,'').slice(0,8),s=v.slice(0,2);if(v.length>2)s+='.'+v.slice(2,4);if(v.length>4)s+='.'+v.slice(4);inp.value=s;var d=sync();if(d){y=d.getFullYear();m=d.getMonth();if(!cal.hidden)draw();if(o.onPick)o.onPick(d)}else if(o.onPick&&v.length==8)o.onPick(null)});
  inp.addEventListener('blur',sync);inp.addEventListener('invalid',function(){sync();open()});
  if(inp.form)inp.form.addEventListener('submit',sync,true);
  document.addEventListener('click',function(e){var p=e.composedPath?e.composedPath():[e.target];if(!cal.hidden&&p.indexOf(inp)<0&&p.indexOf(cal)<0)cal.hidden=true});
  document.addEventListener('keydown',function(e){if(e.key=='Escape')cal.hidden=true});
  return {get:function(){return sync()},redraw:function(){if(!cal.hidden)draw()}}}
window.GGCal=GGCal;
document.querySelectorAll('input[data-dp]').forEach(function(inp){var t=day(new Date()),yrs=+inp.dataset.years||100;
  GGCal(inp,{iso:true,min:new Date(t.getFullYear()-yrs,0,1),max:t,start:new Date(t.getFullYear()-(+inp.dataset.start||8),t.getMonth(),1),msg:'Введите дату рождения в формате ДД.ММ.ГГГГ, например 05.03.2018'})});
})();
