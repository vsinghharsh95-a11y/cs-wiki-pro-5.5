(() => {
  const $ = (id) => document.getElementById(id);

  // Logic gates -------------------------------------------------------------
  const gateState = { a:0, b:1 };
  const gateType = $('gate-type');
  const gateSpecs = {
    AND:  { symbol:'&',  fn:(a,b)=>a & b, description:'AND is 1 only when both inputs are 1.' },
    OR:   { symbol:'≥1', fn:(a,b)=>a | b, description:'OR is 1 when at least one input is 1.' },
    XOR:  { symbol:'=1', fn:(a,b)=>a ^ b, description:'XOR is 1 when the inputs are different.' },
    NAND: { symbol:'&̅', fn:(a,b)=>1-(a & b), description:'NAND is the opposite of AND: it is 0 only when both inputs are 1.' },
    NOR:  { symbol:'≥1̅', fn:(a,b)=>1-(a | b), description:'NOR is the opposite of OR: it is 1 only when both inputs are 0.' },
    NOT:  { symbol:'¬', fn:(a)=>1-a, description:'NOT flips input A: 0 becomes 1, and 1 becomes 0.' }
  };
  function renderGate() {
    const type = gateType.value;
    const spec = gateSpecs[type];
    const output = spec.fn(gateState.a, gateState.b);
    $('gate-a').querySelector('b').textContent = gateState.a;
    $('gate-b').querySelector('b').textContent = gateState.b;
    $('gate-a').setAttribute('aria-pressed', String(Boolean(gateState.a)));
    $('gate-b').setAttribute('aria-pressed', String(Boolean(gateState.b)));
    $('gate-b').hidden = type === 'NOT';
    $('gate-a-line').textContent = gateState.a;
    $('gate-b-line').textContent = gateState.b;
    $('gate-b-input').hidden = type === 'NOT';
    $('gate-symbol').textContent = spec.symbol;
    $('gate-output').textContent = output;
    $('gate-output').classList.toggle('is-one', Boolean(output));
    $('gate-rule').textContent = type === 'NOT' ? 'NOT A' : `A ${type} B`;
    $('gate-result').textContent = output;
    $('truth-heading').textContent = type === 'NOT' ? 'NOT A' : `A ${type} B`;
    $('gate-explain').textContent = spec.description;
    const rows = type === 'NOT' ? [[0,'—',1],[1,'—',0]] : [[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>[a,b,spec.fn(a,b)]);
    $('truth-table').innerHTML = rows.map(([a,b,result]) => `<tr class="${a===gateState.a && (type==='NOT'||b===gateState.b) ? 'truth-current' : ''}"><td>${a}</td><td>${b}</td><td>${result}</td></tr>`).join('');
  }
  $('gate-a').addEventListener('click',()=>{gateState.a^=1;renderGate();});
  $('gate-b').addEventListener('click',()=>{gateState.b^=1;renderGate();});
  gateType.addEventListener('change',renderGate);
  renderGate();

  // Stack and queue ---------------------------------------------------------
  let structure = 'stack';
  let items = ['M','A','P'];
  const structureView = $('structure-view');
  function renderStructure(message) {
    const isStack = structure === 'stack';
    structureView.className = `structure-view ${isStack?'stack-view':'queue-view'}`;
    structureView.innerHTML = '';
    if (!items.length) {
      const empty = document.createElement('div'); empty.className='structure-empty'; empty.textContent='The structure is empty'; structureView.appendChild(empty);
    }
    items.forEach((item,index) => {
      const block = document.createElement('div');
      block.className = 'structure-item';
      block.style.setProperty('--item-index',index);
      block.textContent = item;
      block.title = `${item}${isStack ? (index===items.length-1?' · next out':'') : (index===0?' · next out':'')}`;
      structureView.appendChild(block);
    });
    $('structure-caption').textContent = isStack ? 'TOP · newest · next out' : 'FRONT · oldest · next out';
    $('structure-tail').textContent = isStack ? 'BOTTOM · oldest · first in' : 'BACK · newest · last in';
    $('structure-explain').textContent = message || (isStack
      ? 'A stack follows LIFO: last in, first out. Add items to the top; remove the most recently added item.'
      : 'A queue follows FIFO: first in, first out. Add items at the back; remove the oldest item from the front.');
    $('structure-remove').disabled = !items.length;
    $('structure-add').disabled = items.length >= 8;
    $('structure-random').disabled = items.length >= 8;
  }
  document.querySelectorAll('.structure-mode').forEach(button => button.addEventListener('click',()=>{
    structure=button.dataset.structure;
    document.querySelectorAll('.structure-mode').forEach(other=>other.classList.toggle('active',other===button));
    renderStructure();
  }));
  $('structure-add').addEventListener('click',()=>{
    if(items.length>=8)return;
    const value=$('structure-value').value.trim();
    if(!value){$('structure-explain').textContent='Enter a short value first.';return;}
    items.push(value);$('structure-value').value='';renderStructure(`Added “${value}” to the ${structure}.`);
  });
  $('structure-remove').addEventListener('click',()=>{
    const removed=structure==='stack'?items.pop():items.shift();
    renderStructure(removed===undefined?'Nothing to remove.':`Removed “${removed}” from the ${structure}.`);
  });
  $('structure-random').addEventListener('click',()=>{
    if(items.length>=8)return;
    const value=['PIXEL','BYTE','NODE','LOOP','DATA'][Math.floor(Math.random()*5)];
    items.push(value);renderStructure(`Added sample item “${value}”.`);
  });
  $('structure-reset').addEventListener('click',()=>{items=[];renderStructure('Reset. Add a few values to see the structure in action.');});
  $('structure-value').addEventListener('keydown',event=>{if(event.key==='Enter')$('structure-add').click();});
  renderStructure();

  // Shortest network route (Dijkstra) --------------------------------------
  const links = [
    ['Device','Gateway',2],['Gateway','Campus',5],['Gateway','Exchange',9],['Campus','Exchange',3],
    ['Campus','Service',8],['Exchange','Service',4],['Exchange','Cloud',7],['Service','Cloud',2]
  ];
  function edgeKey(a,b){const match=links.find(([left,right])=>left===a&&right===b||left===b&&right===a);return match?match.slice(0,2).join('|'):'';}
  function shortestRoute(start,finish){
    const distance=new Map(), previous=new Map(), pending=new Set(['Device','Gateway','Campus','Exchange','Service','Cloud']);
    pending.forEach(node=>distance.set(node,Infinity));distance.set(start,0);
    while(pending.size){
      let current=null;
      pending.forEach(node=>{if(current===null||distance.get(node)<distance.get(current))current=node;});
      if(current===null||distance.get(current)===Infinity)break;
      pending.delete(current);if(current===finish)break;
      links.filter(link=>link[0]===current||link[1]===current).forEach(([a,b,cost])=>{
        const next=a===current?b:a;
        if(!pending.has(next))return;
        const candidate=distance.get(current)+cost;
        if(candidate<distance.get(next)){distance.set(next,candidate);previous.set(next,current);}
      });
    }
    if(start!==finish&&!previous.has(finish))return null;
    const route=[finish];while(route[0]!==start)route.unshift(previous.get(route[0]));
    return {route,cost:distance.get(finish)};
  }
  const routerNames={Device:'Your device',Gateway:'Home router',Campus:'Campus',Exchange:'Internet exchange',Service:'Web server',Cloud:'Cloud region'};
  function runRoute(){
    const start=$('route-source').value,finish=$('route-target').value,result=shortestRoute(start,finish);
    document.querySelectorAll('.router-node').forEach(node=>node.classList.remove('is-route','is-source','is-target'));
    document.querySelectorAll('.network-links line').forEach(line=>line.classList.remove('is-route'));
    if(!result){$('route-result').textContent='No route is available between those points.';return;}
    result.route.forEach(node=>document.querySelector(`[data-router="${node}"]`)?.classList.add('is-route'));
    document.querySelector(`[data-router="${start}"]`)?.classList.add('is-source');
    document.querySelector(`[data-router="${finish}"]`)?.classList.add('is-target');
    const hopRows=[];
    for(let i=0;i<result.route.length-1;i++){
      const a=result.route[i],b=result.route[i+1],link=links.find(item=>item[0]===a&&item[1]===b||item[0]===b&&item[1]===a);
      document.querySelector(`[data-edge="${edgeKey(a,b)}"]`)?.classList.add('is-route');
      hopRows.push(`${routerNames[a]} → ${routerNames[b]} · ${link[2]} ms`);
    }
    const resultBox=$('route-result');resultBox.innerHTML='';
    const strong=document.createElement('strong');strong.textContent=result.route.map(node=>routerNames[node]).join('  →  ');
    const summary=document.createElement('span');summary.textContent=`${result.cost} ms total · ${hopRows.length} ${hopRows.length===1?'link':'links'} · shortest route`;
    const hops=document.createElement('div');hops.className='route-hop-list';hopRows.forEach(label=>{const item=document.createElement('small');item.textContent=label;hops.appendChild(item);});
    resultBox.append(strong,summary,hops);
  }
  $('route-run').addEventListener('click',runRoute);runRoute();

  // Browser-side SQL teaching sandbox --------------------------------------
  const books=[
    {id:1,title:'Algorithms',category:'Basics',minutes:8},{id:2,title:'Binary',category:'Basics',minutes:4},
    {id:3,title:'Internet',category:'Networks',minutes:6},{id:4,title:'Database',category:'Data',minutes:7},
    {id:5,title:'Variable',category:'Programming',minutes:3},{id:6,title:'Loop',category:'Programming',minutes:5},
    {id:7,title:'Encryption',category:'Security',minutes:6},{id:8,title:'Operating System',category:'Systems',minutes:9}
  ];
  function runSql(){
    const query=$('sql-query').value.trim().replace(/;\s*$/,'');
    const syntax=/^select\s+([\w\s,*]+?)\s+from\s+books(?:\s+where\s+([a-z_][\w]*)\s*(=|!=|<>|>=|<=|>|<)\s*(?:'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?)))?(?:\s+order\s+by\s+([a-z_][\w]*)(?:\s+(asc|desc))?)?(?:\s+limit\s+(\d+))?$/i;
    const match=query.match(syntax),message=$('sql-message');
    if(!match){message.textContent='Could not read that query. Try SELECT columns FROM books, then add WHERE, ORDER BY, or LIMIT.';message.className='sql-message is-error';return;}
    const [,columnText,whereColumn,operator,singleQuoted,doubleQuoted,numeric,orderColumn,direction,limitText]=match;
    let rows=books.slice();
    if(whereColumn){
      const field=whereColumn.toLowerCase();if(!Object.prototype.hasOwnProperty.call(books[0],field)){message.textContent=`Unknown column “${whereColumn}”. Use id, title, category, or minutes.`;message.className='sql-message is-error';return;}
      const raw=singleQuoted??doubleQuoted??numeric;const expected=field==='id'||field==='minutes'?Number(raw):raw;
      rows=rows.filter(row=>{const actual=row[field];switch(operator){case'=':return actual===expected;case'!=':case'<>':return actual!==expected;case'>':return actual>expected;case'<':return actual<expected;case'>=':return actual>=expected;case'<=':return actual<=expected;default:return false;}});
    }
    if(orderColumn){const field=orderColumn.toLowerCase();if(!Object.prototype.hasOwnProperty.call(books[0],field)){message.textContent=`Unknown column “${orderColumn}”. Use id, title, category, or minutes.`;message.className='sql-message is-error';return;}rows.sort((a,b)=>a[field]<b[field]?-1:a[field]>b[field]?1:0);if(direction?.toLowerCase()==='desc')rows.reverse();}
    if(limitText)rows=rows.slice(0,Math.min(100,Number(limitText)));
    const columns=columnText.trim()==='*'?Object.keys(books[0]):columnText.split(',').map(column=>column.trim().toLowerCase());
    if(!columns.length||columns.some(column=>!Object.prototype.hasOwnProperty.call(books[0],column))){message.textContent='Unknown column in SELECT. Use id, title, category, or minutes.';message.className='sql-message is-error';return;}
    $('sql-head').innerHTML=`<tr>${columns.map(column=>`<th>${column}</th>`).join('')}</tr>`;
    $('sql-body').innerHTML=rows.length?rows.map(row=>`<tr>${columns.map(column=>`<td>${String(row[column])}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${columns.length}">No matching rows.</td></tr>`;
    message.textContent=`${rows.length} ${rows.length===1?'row':'rows'} returned from books.`;message.className='sql-message is-success';
  }
  $('sql-run').addEventListener('click',runSql);
  $('sql-query').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter')runSql();});
  $('sql-example').addEventListener('change',event=>{if(event.target.value){$('sql-query').value=event.target.value;runSql();}});
  runSql();

  // Regular expression tester ----------------------------------------------
  function escapeHtml(value){return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function renderRegex(){
    const pattern=$('regex-pattern').value,flags=$('regex-flags').value.trim();
    const source=$('regex-text').value.slice(0,4000);$('regex-text').value=source;
    try{
      const regex=new RegExp(pattern,flags);let matches=[],match;
      while((match=regex.exec(source))!==null){matches.push({value:match[0],index:match.index,groups:match.slice(1)});if(!regex.global)break;if(match[0]==='')regex.lastIndex++;}
      let html='',cursor=0;
      matches.forEach(item=>{html+=escapeHtml(source.slice(cursor,item.index))+`<mark>${escapeHtml(item.value)}</mark>`;cursor=item.index+item.value.length;});
      $('regex-highlight').innerHTML=html+escapeHtml(source.slice(cursor));
      $('regex-count').textContent=`${matches.length} ${matches.length===1?'match':'matches'}`;
      $('regex-match-list').innerHTML=matches.length?matches.map((item,index)=>`<div class="regex-match"><b>${String(index+1).padStart(2,'0')}</b><code>${escapeHtml(item.value||'(empty match)')}</code><span>at ${item.index}</span>${item.groups.length?`<small>groups: ${item.groups.map(escapeHtml).join(' · ')}</small>`:''}</div>`).join(''):'<p class="regex-empty">No matches yet. Adjust the pattern or sample text.</p>';
    }catch(error){$('regex-highlight').textContent=source;$('regex-count').textContent='Pattern error';$('regex-match-list').innerHTML='';const note=document.createElement('p');note.className='regex-error';note.textContent=error.message;$('regex-match-list').appendChild(note);}
  }
  ['regex-pattern','regex-flags','regex-text'].forEach(id=>$(id).addEventListener('input',renderRegex));
  $('regex-example').addEventListener('change',event=>{if(!event.target.value)return;const [pattern,flags]=event.target.value.split('|');$('regex-pattern').value=pattern;$('regex-flags').value=flags;renderRegex();});
  renderRegex();

  // CPU scheduling: FCFS, non-preemptive SJF, and round robin --------------
  const processes=[{id:'P1',arrival:0,burst:6},{id:'P2',arrival:1,burst:3},{id:'P3',arrival:2,burst:7},{id:'P4',arrival:3,burst:2}];
  const processColors=['#a55cf3','#28c8c9','#ef9c6d','#6e8cf5'];
  $('cpu-processes').innerHTML=processes.map((process,index)=>`<div class="cpu-process" style="--process-color:${processColors[index]}"><b>${process.id}</b><span>arrives ${process.arrival}</span><i>${process.burst} units</i></div>`).join('');
  function scheduleFcfs(){let time=0;const segments=[],stats={};processes.forEach(process=>{if(time<process.arrival){segments.push({id:'IDLE',start:time,end:process.arrival});time=process.arrival;}const start=time;time+=process.burst;segments.push({id:process.id,start,end:time});stats[process.id]={wait:start-process.arrival,turnaround:time-process.arrival};});return{segments,stats};}
  function scheduleSjf(){let time=0,remaining=processes.slice(),segments=[],stats={};while(remaining.length){const ready=remaining.filter(process=>process.arrival<=time).sort((a,b)=>a.burst-b.burst||a.arrival-b.arrival||a.id.localeCompare(b.id));if(!ready.length){const next=Math.min(...remaining.map(process=>process.arrival));segments.push({id:'IDLE',start:time,end:next});time=next;continue;}const process=ready[0],start=time;time+=process.burst;segments.push({id:process.id,start,end:time});stats[process.id]={wait:start-process.arrival,turnaround:time-process.arrival};remaining=remaining.filter(item=>item!==process);}return{segments,stats};}
  function scheduleRoundRobin(quantum){const remaining=new Map(processes.map(process=>[process.id,process.burst])),completion={},segments=[],queue=[];let time=0,arrivals=processes.slice().sort((a,b)=>a.arrival-b.arrival),next=0;while(Object.keys(completion).length<processes.length){while(next<arrivals.length&&arrivals[next].arrival<=time)queue.push(arrivals[next++].id);if(!queue.length){const nextTime=arrivals[next].arrival;segments.push({id:'IDLE',start:time,end:nextTime});time=nextTime;continue;}const id=queue.shift(),start=time,run=Math.min(quantum,remaining.get(id));time+=run;remaining.set(id,remaining.get(id)-run);segments.push({id,start,end:time});while(next<arrivals.length&&arrivals[next].arrival<=time)queue.push(arrivals[next++].id);if(remaining.get(id)>0)queue.push(id);else completion[id]=time;}const stats={};processes.forEach(process=>{const turnaround=completion[process.id]-process.arrival;stats[process.id]={wait:turnaround-process.burst,turnaround};});return{segments,stats};}
  function renderCpu(){
    const mode=$('cpu-algo').value,quantum=Math.max(1,Math.min(6,Number($('cpu-quantum').value)||2));$('cpu-quantum').value=quantum;$('quantum-wrap').hidden=mode!=='rr';
    const result=mode==='fcfs'?scheduleFcfs():mode==='sjf'?scheduleSjf():scheduleRoundRobin(quantum);const finish=Math.max(...result.segments.map(segment=>segment.end));
    $('cpu-gantt').innerHTML=result.segments.map((segment,index)=>`<div class="cpu-segment ${segment.id==='IDLE'?'is-idle':''}" style="--process-color:${segment.id==='IDLE'?'#41404e':processColors[Number(segment.id.slice(1))-1]};flex:${segment.end-segment.start} 1 0%" title="${segment.id}: ${segment.start} to ${segment.end}"><b>${segment.id}</b><small>${segment.start}–${segment.end}</small></div>`).join('');
    $('cpu-time-scale').innerHTML=`<span>0</span>${result.segments.map(segment=>`<span>${segment.end}</span>`).join('')}`;
    const values=Object.values(result.stats);const avgWait=values.reduce((sum,item)=>sum+item.wait,0)/values.length;const avgTurn=values.reduce((sum,item)=>sum+item.turnaround,0)/values.length;
    $('cpu-wait').textContent=avgWait.toFixed(1)+' units';$('cpu-turnaround').textContent=avgTurn.toFixed(1)+' units';$('cpu-finish').textContent=finish+' units';
    $('cpu-explain').textContent=mode==='fcfs'?'FCFS runs processes in arrival order. It is easy to follow, but one long job can make shorter jobs wait.':mode==='sjf'?'Shortest-job-first chooses the shortest process that has already arrived. It reduces average wait in this example, but long jobs can wait longer.':`Round robin gives each ready process up to ${quantum} time units, then moves unfinished work to the back of the queue. It shares CPU time fairly.`;
  }
  $('cpu-run').addEventListener('click',renderCpu);$('cpu-algo').addEventListener('change',renderCpu);$('cpu-quantum').addEventListener('input',renderCpu);renderCpu();
})();
