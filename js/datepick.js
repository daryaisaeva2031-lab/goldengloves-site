/* Свой календарь для дат (дата рождения): ДД.ММ.ГГГГ на экране, ГГГГ-ММ-ДД в форме */
(function(){
var M=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
function p2(n){return(n<10?'0':'')+n}
function parse(s){var m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(s||'');if(!m)return null;var d=new Date(+m[3],m[2]-1,+m[1]);return d.getDate()==+m[1]&&d.getMonth()==m[2]-1?d:null}
function iso(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function ru(d){return p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()}
document.querySelectorAll('input[data-dp]').forEach(function(inp){
  var name=inp.name,h=document.createElement('input');h.type='hidden';h.name=name;inp.removeAttribute('name');inp.after(h);
  inp.type='text';inp.inputMode='numeric';inp.autocomplete='off';inp.placeholder='ДД.ММ.ГГГГ';inp.maxLength=10;
  var now=new Date(),maxY=now.getFullYear(),minY=maxY-(+inp.dataset.years||100);
  var cal=document.createElement('div');cal.className='cal dp';cal.hidden=true;(inp.closest('label')||inp).after(cal);
  var y=maxY-(+inp.dataset.start||8),m=now.getMonth();
  function sync(){var d=parse(inp.value);h.value=d?iso(d):'';
    var bad=inp.value&&(!d||d>now||d.getFullYear()<minY);inp.setCustomValidity(bad?'Введите дату в формате ДД.ММ.ГГГГ, например 05.03.2018':'');return d}
  function draw(){var sel=parse(inp.value),ys='',ms='';
    for(var i=maxY;i>=minY;i--)ys+='<option'+(i==y?' selected':'')+'>'+i+'</option>';
    M.forEach(function(n,i){ms+='<option value="'+i+'"'+(i==m?' selected':'')+'>'+n+'</option>'});
    var t='<div class="calh"><button type="button" data-n="-1" aria-label="Предыдущий месяц">‹</button><span class="dps"><select aria-label="Месяц">'+ms+'</select><select aria-label="Год">'+ys+'</select></span><button type="button" data-n="1" aria-label="Следующий месяц">›</button></div><div class="calg">'+['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(function(d){return'<i>'+d+'</i>'}).join('');
    var f=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();for(i=0;i<f;i++)t+='<span></span>';
    for(i=1;i<=n;i++){var d=new Date(y,m,i);t+='<button type="button" data-d="'+i+'"'+(d>now?' disabled':'')+(sel&&+sel==+d?' class="on"':'')+'>'+i+'</button>'}
    cal.innerHTML=t+'</div>';var s=cal.querySelectorAll('select');s[0].onchange=function(){m=+this.value;draw()};s[1].onchange=function(){y=+this.value;draw()}}
  function open(){var d=parse(inp.value);if(d){y=d.getFullYear();m=d.getMonth()}cal.hidden=false;draw()}
  cal.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;e.preventDefault();
    if(b.dataset.n){m+=+b.dataset.n;if(m<0){m=11;y--}if(m>11){m=0;y++}if(y>maxY){y=maxY;m=11}if(y<minY){y=minY;m=0}draw()}
    else if(b.dataset.d){inp.value=ru(new Date(y,m,+b.dataset.d));sync();cal.hidden=true;inp.dispatchEvent(new Event('change',{bubbles:true}))}});
  inp.addEventListener('click',open);inp.addEventListener('focus',open);
  inp.addEventListener('input',function(){var v=inp.value.replace(/\D/g,'').slice(0,8),o=v.slice(0,2);if(v.length>2)o+='.'+v.slice(2,4);if(v.length>4)o+='.'+v.slice(4);inp.value=o;var d=sync();if(d){y=d.getFullYear();m=d.getMonth();if(!cal.hidden)draw()}});
  inp.addEventListener('blur',sync);inp.addEventListener('invalid',sync);
  if(inp.form)inp.form.addEventListener('submit',sync,true);
  document.addEventListener('click',function(e){if(!cal.hidden&&e.target!=inp&&!cal.contains(e.target))cal.hidden=true});
  document.addEventListener('keydown',function(e){if(e.key=='Escape')cal.hidden=true});
});})();
