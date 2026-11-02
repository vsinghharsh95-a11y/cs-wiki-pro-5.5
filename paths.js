(() => {
  const paths = [
    {
      id:'code-foundations', number:'01', eyebrow:'START WITH THE BUILDING BLOCKS', title:'From zeroes to software',
      summary:'Follow the chain from the bits inside a computer to the program ideas that make those bits useful.',
      level:'FIRST STEPS', duration:'15–20 MIN', steps:[
        {id:'binary',title:'Start with 0 and 1',description:'See how a few bits can represent numbers, letters, and everything a computer stores.',kind:'READ + TRY',href:'article.html?slug=binary',link:'Read Binary',extra:'labs.html?lab=binary',extraLabel:'Open the Binary Lab',extra2:'labs.html?lab=gates',extra2Label:'Build a logic gate',time:'3 MIN'},
        {id:'algorithm',title:'Give the steps a shape',description:'Meet algorithms: clear instructions that turn a problem into a result.',kind:'READ',href:'article.html?slug=algorithm',link:'Read Algorithm',time:'2 MIN'},
        {id:'variable',title:'Give a value a name',description:'Learn how a program keeps track of information while it runs.',kind:'READ',href:'article.html?slug=variable',link:'Read Variable',time:'2 MIN'},
        {id:'loop',title:'Repeat without repeating yourself',description:'Use loops to make one set of instructions do useful work over and over.',kind:'READ + TRY',href:'article.html?slug=loop',link:'Read Loop',extra:'labs.html?lab=sorting',extraLabel:'Watch sorting in the Lab',extra2:'labs.html?lab=structures',extra2Label:'Try a stack or queue',time:'4 MIN'},
        {id:'operating-system',title:'Meet the software in charge',description:'See how an operating system manages the hardware and gives programs room to run.',kind:'READ + EXPLORE',href:'article.html?slug=operating-system',link:'Read Operating System',extra:'labs.html?lab=cpu',extraLabel:'Simulate CPU scheduling',time:'3 MIN'}
      ]
    },
    {
      id:'web-journey', number:'02', eyebrow:'FOLLOW INFORMATION ACROSS THE WEB', title:'How a web page comes alive',
      summary:'Trace the ingredients behind a modern web experience: your device, a network, stored data, and a little security.',
      level:'FOLLOW THE FLOW', duration:'15–20 MIN', steps:[
        {id:'device',title:'Start with your device',description:'The operating system manages the apps and hardware that make a web request possible.',kind:'READ',href:'article.html?slug=operating-system',link:'Read Operating System',time:'2 MIN'},
        {id:'internet',title:'Cross the network',description:'Follow the packets moving between your device and computers around the world.',kind:'READ + EXPLORE',href:'article.html?slug=internet',link:'Read Internet',extra:'map.html?concept=internet',extraLabel:'Explore the concept map',time:'3 MIN'},
        {id:'database',title:'Find the information',description:'Discover how websites organize and retrieve the data behind pages, profiles, and search results.',kind:'READ + TRY',href:'article.html?slug=database',link:'Read Database',extra:'labs.html?lab=sql',extraLabel:'Query the sample database',time:'3 MIN'},
        {id:'encryption',title:'Protect the conversation',description:'See how encryption keeps private information unreadable to anyone without the right key.',kind:'READ + TRY',href:'article.html?slug=encryption',link:'Read Encryption',extra:'labs.html?lab=cipher',extraLabel:'Try the Cipher Lab',time:'4 MIN'},
        {id:'trace-the-web',title:'Connect the whole journey',description:'Bring the ideas together and explore how one concept leads into another.',kind:'EXPLORE',href:'map.html?concept=internet',link:'Open the Concept Map',time:'3 MIN'}
      ]
    }
  ];
  const grid=document.getElementById('path-grid');
  const completedCount=document.getElementById('completed-count');
  const pathCountLabel=document.getElementById('path-count-label');
  const ring=document.getElementById('overview-ring');
  const resumeTitle=document.getElementById('resume-title');
  const resumeCopy=document.getElementById('resume-copy');
  const resumeButton=document.getElementById('resume-button');
  const storageKey='csw-learning-paths';
  let progress={};let activePath='';
  try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');progress=saved.progress||{};activePath=saved.activePath||'';}catch{}
  function store(){try{localStorage.setItem(storageKey,JSON.stringify({progress,activePath}));}catch{}}
  function doneFor(path){return new Set(progress[path.id]||[]);}
  function percentFor(path){return Math.round(doneFor(path).size/path.steps.length*100);}
  function currentStep(path){return path.steps.findIndex(step=>!doneFor(path).has(step.id));}
  function esc(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function stepMarkup(path,step,index){
    const done=doneFor(path).has(step.id),firstIncomplete=currentStep(path),locked=!done&&index>firstIncomplete;
    const state=done?'step-done':locked?'step-locked':'step-current';
    return `<li class="path-step ${state}" id="step-${path.id}-${step.id}">
      <div class="step-marker">${done?'✓':String(index+1).padStart(2,'0')}</div>
      <div class="step-copy"><div class="step-meta"><span>${esc(step.kind)}</span><i>${esc(step.time)}</i></div><h3>${esc(step.title)}</h3><p>${esc(step.description)}</p>
        <div class="step-links">${locked?'<span class="step-lock">Complete the step above to unlock this</span>':`<a class="step-resource" href="${esc(step.href)}">${esc(step.link)} <span>↗</span></a>${step.extra?`<a class="step-extra" href="${esc(step.extra)}">${esc(step.extraLabel)} <span>↗</span></a>`:''}${step.extra2?`<a class="step-extra" href="${esc(step.extra2)}">${esc(step.extra2Label)} <span>↗</span></a>`:''}`}</div>
      </div>
      <button class="step-complete" data-action="complete" data-path="${path.id}" data-step="${step.id}" ${done||locked?'disabled':''}>${done?'Completed ✓':locked?'Locked':'Mark complete'}</button>
    </li>`;
  }
  function renderPath(path){
    const done=doneFor(path),pct=percentFor(path),complete=done.size===path.steps.length;
    const opened=activePath===path.id;
    const stepIndex=currentStep(path);
    const actionText=complete?'Path complete ✓':done.size?'Continue path ↗':'Start this path ↗';
    return `<article class="path-card path-${path.number}" id="path-card-${path.id}" data-path="${path.id}">
      <div class="path-cover" aria-hidden="true"><span>${path.number} / CS WIKI FIELD GUIDE</span><div class="path-cover-art"><i></i><b></b><em></em></div><strong>${path.number==='01'?'0101':'WWW'}</strong><small>${path.number==='01'?'IDEAS INTO INSTRUCTIONS':'A REQUEST IN MOTION'}</small></div>
      <div class="path-card-body"><div class="path-card-meta"><span>${esc(path.eyebrow)}</span><i>${esc(path.level)}</i></div><h3>${esc(path.title)}</h3><p>${esc(path.summary)}</p>
        <div class="path-facts"><span>${String(path.steps.length).padStart(2,'0')} STEPS</span><b>·</b><span>${esc(path.duration)}</span></div>
        <div class="path-progress"><div class="path-progress-label"><span>YOUR PROGRESS</span><b>${done.size} / ${path.steps.length}</b></div><div class="path-progress-track" role="progressbar" aria-label="Path progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div></div>
        <div class="path-card-actions"><button class="btn btn-primary path-start" data-action="start" data-path="${path.id}">${actionText}</button><button class="path-expand" data-action="toggle" data-path="${path.id}" aria-expanded="${opened}">${opened?'Hide steps':'View the steps'} <span>${opened?'−':'+'}</span></button>${complete?`<button class="path-restart" data-action="restart" data-path="${path.id}">Take this path again</button>`:''}</div>
      </div>
      <ol class="path-steps" ${opened?'':'hidden'}>${path.steps.map((step,index)=>stepMarkup(path,step,index)).join('')}</ol>
    </article>`;
  }
  function renderOverview(){
    const allCompleted=paths.reduce((sum,path)=>sum+doneFor(path).size,0);
    const total=paths.reduce((sum,path)=>sum+path.steps.length,0);
    completedCount.textContent=String(allCompleted).padStart(2,'0');
    pathCountLabel.textContent=`of ${total} lessons across ${paths.length} paths`;
    const pct=Math.round(allCompleted/total*100);ring.style.setProperty('--completion',pct+'%');ring.querySelector('span').textContent=pct===100?'✓':'✳';
    const active=paths.find(path=>path.id===activePath);
    if(active){
      const next=currentStep(active);
      resumeTitle.textContent=next<0?'You completed your trail.':`Your next step: ${active.steps[next].title}`;
      resumeCopy.textContent=next<0?`You finished “${active.title}”. Choose another trail or take this one again.`:`Continue “${active.title}” · step ${next+1} of ${active.steps.length}.`;
      resumeButton.innerHTML=next<0?'Choose another path <span>↘</span>':'Continue learning <span>↗</span>';
      resumeButton.href=`#path-card-${active.id}`;
      resumeButton.dataset.activePath=active.id;
    }else{
      resumeTitle.textContent='A good place to begin.';resumeCopy.textContent='Choose a path and we’ll keep your progress on this device.';
      resumeButton.innerHTML='Explore paths <span>↘</span>';resumeButton.href='#paths';delete resumeButton.dataset.activePath;
    }
  }
  function render(){grid.innerHTML=paths.map(renderPath).join('');renderOverview();}
  function findPath(id){return paths.find(path=>path.id===id);}
  grid.addEventListener('click',event=>{
    const control=event.target.closest('[data-action]');if(!control)return;
    const path=findPath(control.dataset.path);if(!path)return;
    const action=control.dataset.action;
    if(action==='start'){
      activePath=path.id;store();render();
      const card=document.getElementById('path-card-'+path.id);card.scrollIntoView({behavior:'smooth',block:'start'});
      const index=currentStep(path);if(index>=0)setTimeout(()=>document.getElementById(`step-${path.id}-${path.steps[index].id}`)?.scrollIntoView({behavior:'smooth',block:'center'}),450);
    }else if(action==='toggle'){
      const list=control.closest('.path-card').querySelector('.path-steps');list.hidden=!list.hidden;
      control.setAttribute('aria-expanded',String(!list.hidden));control.innerHTML=list.hidden?'View the steps <span>+</span>':'Hide steps <span>−</span>';
    }else if(action==='complete'){
      const completed=doneFor(path);if(completed.has(control.dataset.step)||currentStep(path)<path.steps.findIndex(step=>step.id===control.dataset.step))return;
      completed.add(control.dataset.step);progress[path.id]=[...completed];activePath=path.id;store();render();
      const next=currentStep(path);if(next>=0)document.getElementById(`step-${path.id}-${path.steps[next].id}`)?.scrollIntoView({behavior:'smooth',block:'center'});
    }else if(action==='restart'){
      progress[path.id]=[];activePath=path.id;store();render();
      document.getElementById(`path-card-${path.id}`)?.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
  resumeButton.addEventListener('click',event=>{
    if(!resumeButton.dataset.activePath)return;
    const path=findPath(resumeButton.dataset.activePath);if(!path)return;
    event.preventDefault();render();
    const index=currentStep(path);const target=index<0?document.getElementById('path-card-'+path.id):document.getElementById(`step-${path.id}-${path.steps[index].id}`);
    target?.scrollIntoView({behavior:'smooth',block:index<0?'start':'center'});
  });
  render();
})();
