(() => {
  const challenges = [
    {topic:'BITS & BYTES',title:'A number hiding in plain sight.',prompt:'What decimal number does 10110 represent in binary?',options:['18','20','22','24'],answer:2,hints:['Read the place values from right to left: 1, 2, 4, 8, 16.','Only the 16, 4, and 2 places are switched on.'],explanation:'10110₂ = 16 + 4 + 2 = 22. Binary digits mark which powers of two are included.',href:'article.html?slug=binary',link:'Read the Binary guide'},
    {topic:'DATA STRUCTURES',title:'Who gets served next?',prompt:'A queue holds A, then B, then C. Which item comes out first?',options:['A','B','C','It depends on its size'],answer:0,hints:['A queue works like a line at a shop.','Think about the rule FIFO: first in, first out.'],explanation:'A is first out. A queue follows FIFO: the first item added is the first item removed.',href:'labs.html?lab=structures',link:'Try the Stack & Queue lab'},
    {topic:'NETWORKS',title:'Find the right address.',prompt:'You type a website name into a browser. Which service helps find the IP address for that name?',options:['DNS','CPU','SQL','CSS'],answer:0,hints:['It is like a contacts list for the internet.','The initials stand for Domain Name System.'],explanation:'DNS looks up a domain name and returns the IP address computers use to reach it.',href:'article.html?slug=internet',link:'Read the Internet guide'},
    {topic:'DATABASES',title:'Filter the table.',prompt:'What does this query return?  SELECT name FROM people WHERE age >= 18',options:['Every column for every person','Names of people aged 18 or older','Only people younger than 18','The number of rows in the table'],answer:1,hints:['SELECT chooses what to show; WHERE chooses which rows qualify.','The comparison symbol means “greater than or equal to.”'],explanation:'The query shows the name column for rows where age is at least 18.',href:'labs.html?lab=sql',link:'Try the SQL playground'},
    {topic:'LOGIC GATES',title:'Two inputs, one decision.',prompt:'An XOR gate outputs 1 when its inputs are different. What is 1 XOR 1?',options:['0','1','2','It has no output'],answer:0,hints:['XOR asks whether exactly one input is on.','These inputs match each other.'],explanation:'XOR returns 1 only when the inputs differ. Since both are 1, the output is 0.',href:'labs.html?lab=gates',link:'Explore the Logic Gates lab'},
    {topic:'OPERATING SYSTEMS',title:'Share the processor.',prompt:'In round-robin scheduling, what happens when a process uses its time slice but still has work left?',options:['It is removed permanently','It moves to the back of the ready queue','It restarts from the beginning','The CPU shuts down'],answer:1,hints:['Round robin takes turns.','Unfinished work waits for its next turn.'],explanation:'The process goes to the back of the ready queue, giving other waiting processes a turn.',href:'labs.html?lab=cpu',link:'Simulate CPU scheduling'},
    {topic:'ALGORITHMS',title:'Count the work.',prompt:'An algorithm checks every item in a list exactly once. If the list has n items, how does its work grow?',options:['O(1)','O(log n)','O(n)','O(n²)'],answer:2,hints:['If the list doubles, the number of checks doubles too.','This is called linear time.'],explanation:'One check per item gives n checks, so the running time grows linearly: O(n).',href:'article.html?slug=algorithm',link:'Read the Algorithm guide'},
    {topic:'REGULAR EXPRESSIONS',title:'A tiny pattern with a strict rule.',prompt:'What kind of string matches the pattern ^\\d{4}$?',options:['Any string containing four digits','Exactly four digits and nothing else','A four-letter word','A number with four or more digits'],answer:1,hints:['The caret and dollar sign anchor the pattern to both ends.','\\d{4} means four digit characters.'],explanation:'The anchors require the whole string to match, and \\d{4} requires exactly four digits.',href:'labs.html?lab=regex',link:'Try the Regex lab'},
    {topic:'SECURITY',title:'Shift, then read.',prompt:'A Caesar cipher shifts each letter forward by 3. What does C become?',options:['A','D','F','Z'],answer:2,hints:['Move three places forward in the alphabet.','Start at C, then count D, E, F.'],explanation:'C shifted forward by three letters becomes F. Caesar ciphers use the same shift for every letter.',href:'article.html?slug=encryption',link:'Read the Encryption guide'}
  ];
  const storageKey='csw-daily-challenges-v1';
  const blank={completed:[],noHint:[],hints:{},attempts:{},wrong:{},revealed:[],showRewards:true};
  let state={...blank};
  try{state={...blank,...JSON.parse(localStorage.getItem(storageKey)||'{}')};}catch{}
  const today=new Date().toISOString().slice(0,10);
  const ordinal=Date.parse(`${today}T00:00:00Z`)/86400000;
  const challengeIndex=((ordinal%challenges.length)+challenges.length)%challenges.length;
  const challenge=challenges[challengeIndex];
  const $=id=>document.getElementById(id);
  const optionsEl=$('challenge-options');
  const feedbackEl=$('challenge-feedback');

  function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{}}
  function dateAt(day){return new Date(day*86400000).toISOString().slice(0,10);}
  function has(list,date){return Array.isArray(list)&&list.includes(date);}
  function currentStreak(){
    const done=new Set(Array.isArray(state.completed)?state.completed:[]);
    let cursor=done.has(today)?ordinal:done.has(dateAt(ordinal-1))?ordinal-1:null;
    if(cursor===null)return 0;
    let count=0;while(done.has(dateAt(cursor))){count++;cursor--;}
    return count;
  }
  function longestStreak(){
    const days=[...new Set(state.completed||[])].sort();let best=0,run=0,previous=null;
    days.forEach(day=>{const current=Date.parse(`${day}T00:00:00Z`)/86400000;if(previous!==null&&current===previous+1)run++;else run=1;best=Math.max(best,run);previous=current;});
    return best;
  }
  function makeBadge(title,description,icon,earned){return {title,description,icon,earned};}
  function renderRewards(){
    const total=(state.completed||[]).length,streak=currentStreak(),best=longestStreak();
    $('current-streak').textContent=String(streak).padStart(2,'0');
    $('solved-total').textContent=String(total).padStart(2,'0');
    $('reward-toggle').checked=state.showRewards!==false;
    $('badge-card').hidden=state.showRewards===false;
    $('week-track').innerHTML='';
    document.querySelector('.streak-card').classList.toggle('rewards-off',state.showRewards===false);
    for(let offset=6;offset>=0;offset--){
      const key=dateAt(ordinal-offset),date=new Date(`${key}T00:00:00Z`);
      const day=document.createElement('div');day.className='week-day'+(has(state.completed,key)?' is-solved':'')+(key===today?' is-today':'');
      day.innerHTML=`<span>${new Intl.DateTimeFormat(undefined,{timeZone:'UTC',weekday:'narrow'}).format(date)}</span><b>${date.getUTCDate()}</b>`;
      day.title=key+(has(state.completed,key)?' · challenge solved':'');$('week-track').appendChild(day);
    }
    const badges=[
      makeBadge('First spark','Solve your first daily challenge.','✳',total>=1),
      makeBadge('Three-day thread','Solve challenges three days in a row.','↗',best>=3),
      makeBadge('A week of wonder','Build a seven-day streak.','☼',best>=7),
      makeBadge('No hints needed','Solve a challenge without opening a hint.','◇',(state.noHint||[]).length>0),
      makeBadge('Pattern finder','Solve five daily challenges.','⌘',total>=5)
    ];
    const earned=badges.filter(badge=>badge.earned).length;
    $('badge-count').textContent=`${earned} / ${badges.length}`;
    $('badge-list').innerHTML=badges.map(badge=>`<div class="reward-badge ${badge.earned?'is-earned':'is-locked'}"><span>${badge.icon}</span><div><b>${badge.title}</b><small>${badge.description}</small></div><i>${badge.earned?'✓':'·'}</i></div>`).join('');
  }
  function setFeedback(kind,title,body,linkText,linkHref){
    feedbackEl.hidden=false;feedbackEl.className=`challenge-feedback is-${kind}`;feedbackEl.innerHTML='';
    const heading=document.createElement('strong');heading.textContent=title;
    const paragraph=document.createElement('p');paragraph.textContent=body;
    feedbackEl.append(heading,paragraph);
    if(linkText&&linkHref){const link=document.createElement('a');link.className='text-link';link.href=linkHref;link.textContent=linkText+' ↗';feedbackEl.appendChild(link);}
  }
  function showSolution(counted){
    optionsEl.querySelectorAll('button').forEach((button,index)=>{button.disabled=true;if(index===challenge.answer)button.classList.add('is-correct');});
    $('reveal-answer').disabled=true;
    if(counted){setFeedback('correct','Exactly right.',challenge.explanation,challenge.link,challenge.href);}
    else{setFeedback('reveal','Here’s the idea.',`${challenge.options[challenge.answer]}. ${challenge.explanation}`,challenge.link,challenge.href);}
  }
  function renderOptions(){
    optionsEl.innerHTML='';const wrong=new Set((state.wrong||{})[today]||[]),done=has(state.completed,today),revealed=has(state.revealed,today);
    challenge.options.forEach((option,index)=>{
      const button=document.createElement('button');button.type='button';button.className='challenge-option';button.dataset.choice=String(index);button.disabled=done||revealed||wrong.has(index);
      const letter=document.createElement('span');letter.className='option-key';letter.textContent=String.fromCharCode(65+index);
      const text=document.createElement('span');text.className='option-copy';text.textContent=option;
      const mark=document.createElement('i');mark.className='option-mark';mark.textContent=done&&index===challenge.answer?'✓':wrong.has(index)?'×':'↗';
      if(done&&index===challenge.answer)button.classList.add('is-correct');if(wrong.has(index))button.classList.add('is-wrong');
      button.append(letter,text,mark);button.addEventListener('click',()=>choose(index));optionsEl.appendChild(button);
    });
    if(done)showSolution(true);
    else if(revealed)showSolution(false);
    else if(wrong.size){
      const remaining=challenge.options.length-wrong.size;
      if(remaining<=1){state.revealed=[...new Set([...(state.revealed||[]),today])];save();showSolution(false);}
      else setFeedback('try-again','Not quite yet.',`That choice doesn’t fit. ${remaining} ${remaining===1?'option':'options'} remain—try again or open a hint.`);
    }
    const hints=Number((state.hints||{})[today]||0);$('hint-count').textContent=`${hints} / ${challenge.hints.length} hints`;
    $('hint-button').disabled=hints>=challenge.hints.length||done||revealed;
    $('hint-button').innerHTML=hints>=challenge.hints.length?'All hints revealed':'Reveal a hint <span>↘</span>';
    $('hint-text').textContent=hints?challenge.hints[Math.min(hints,challenge.hints.length)-1]:'Hints are there when you want them. Try a guess first if you like.';
    $('reveal-answer').disabled=done||revealed;
  }
  function choose(index){
    if(index===challenge.answer){
      state.completed=[...new Set([...(state.completed||[]),today])];
      if(Number((state.hints||{})[today]||0)===0)state.noHint=[...new Set([...(state.noHint||[]),today])];
      save();renderOptions();renderRewards();return;
    }
    const wrong=new Set((state.wrong||{})[today]||[]);wrong.add(index);state.wrong={...(state.wrong||{}),[today]:[...wrong]};state.attempts={...(state.attempts||{}),[today]:wrong.size};save();renderOptions();
  }
  $('hint-button').addEventListener('click',()=>{
    const hints=Number((state.hints||{})[today]||0);if(hints>=challenge.hints.length)return;
    state.hints={...(state.hints||{}),[today]:hints+1};save();renderOptions();
  });
  $('reveal-answer').addEventListener('click',()=>{state.revealed=[...new Set([...(state.revealed||[]),today])];save();renderOptions();});
  $('reward-toggle').addEventListener('change',event=>{state.showRewards=event.target.checked;save();renderRewards();});

  const date=new Date(`${today}T00:00:00Z`);
  $('challenge-date').textContent=new Intl.DateTimeFormat(undefined,{timeZone:'UTC',weekday:'long',month:'long',day:'numeric'}).format(date);
  $('challenge-topic').textContent=challenge.topic;
  $('challenge-number').textContent=`${String(challengeIndex+1).padStart(2,'0')} / ${String(challenges.length).padStart(2,'0')}`;
  $('challenge-title').textContent=challenge.title;
  $('challenge-prompt').textContent=challenge.prompt;
  renderOptions();renderRewards();
})();
