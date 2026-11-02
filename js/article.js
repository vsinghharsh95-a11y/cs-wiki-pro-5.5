(() => {
  const rich = {
    algorithm:{
      visualTitle:'A useful algorithm has a beginning, a process, and an outcome.',visualCaption:'A search through a short list: keep the best candidate so far, then compare the next item.',
      visual:`<div class="flow-diagram" aria-label="Input goes through ordered steps to produce an output"><div class="flow-box"><small>GIVE IT</small><b>A problem</b><i>Find the smallest value</i></div><span class="flow-arrow">→</span><div class="flow-box flow-highlight"><small>FOLLOW</small><b>Clear steps</b><i>Compare, remember, repeat</i></div><span class="flow-arrow">→</span><div class="flow-box"><small>GET</small><b>An answer</b><i>The smallest value</i></div></div>`,
      exampleIntro:'To find the smallest value in a list, scan from left to right and remember the smallest one seen so far.',exampleLabel:'PSEUDOCODE',example:'smallest = first item\nfor each next item:\n    if item < smallest:\n        smallest = item\nreturn smallest',
      glossary:[['Input','The information an algorithm starts with.'],['Output','The result produced after the steps finish.'],['Efficiency','How the time or memory needed grows as the input gets larger.']],related:['binary','loop','variable','operating-system'],
      quiz:{question:'What makes a recipe-like set of instructions an algorithm?',options:['It has clear steps that lead to a result','It uses a computer screen','It has to be written in binary'],correct:0,explanation:'An algorithm is a well-defined sequence of steps for solving a problem or completing a task.'},
      sources:[['MIT OpenCourseWare — Introduction to Algorithms','https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2008/','A university course on modeling problems and designing algorithms.']]
    },
    binary:{
      visualTitle:'Each bit contributes a power of two.',visualCaption:'The active place values add together. Here, 00000101 represents 4 + 1 = 5.',
      visual:`<div class="binary-diagram" aria-label="Eight binary places with the 4 and 1 places active"><div class="bit-place"><small>128</small><b>0</b></div><div class="bit-place"><small>64</small><b>0</b></div><div class="bit-place"><small>32</small><b>0</b></div><div class="bit-place"><small>16</small><b>0</b></div><div class="bit-place"><small>8</small><b>0</b></div><div class="bit-place is-on"><small>4</small><b>1</b></div><div class="bit-place"><small>2</small><b>0</b></div><div class="bit-place is-on"><small>1</small><b>1</b></div><div class="binary-sum">4 + 1 <span>=</span> 5</div></div>`,
      exampleIntro:'Convert the base-10 number 5 into binary by adding the place values that make 5: four and one.',exampleLabel:'NUMBER REPRESENTATION',example:'Decimal:  5\nBinary:   00000101\nPlaces:   4 + 1',
      glossary:[['Bit','A binary digit: either 0 or 1.'],['Byte','A group of eight bits.'],['Place value','The amount a digit contributes based on its position.']],related:['algorithm','internet','encryption'],
      quiz:{question:'What is the decimal value of binary 00000110?',options:['5','6','8'],correct:1,explanation:'The 4 place and 2 place are on, so 4 + 2 = 6.'},
      sources:[['Stanford CS106E — Bits, Bytes, and Binary','https://web.stanford.edu/class/cs106e/lectureNotes/L01NBitsBytesBinary.pdf','Lecture notes introducing binary representation and the relationship between bits and bytes.'],['Boston University — Binary Numbers','https://www.cs.bu.edu/courses/cs111/files/cs111_coursepack.pdf','Course notes on place values and reading binary numbers.']]
    },
    internet:{
      visualTitle:'Packets travel across a chain of networks.',visualCaption:'Internet Protocol provides addressing and moves datagrams toward their destinations; the route can pass through many networks.',
      visual:`<div class="route-diagram" aria-label="Your device sends a packet through networks to a server"><div class="route-stop"><i>⌂</i><b>Your device</b><small>request</small></div><div class="route-line"><span></span><span></span><span></span></div><div class="route-stop route-router"><i>⌁</i><b>Networks</b><small>routing</small></div><div class="route-line"><span></span><span></span><span></span></div><div class="route-stop route-server"><i>▤</i><b>Web server</b><small>response</small></div></div>`,
      exampleIntro:'When you request a webpage, data is split and addressed so network equipment can forward it toward the destination.',exampleLabel:'A SIMPLE REQUEST',example:'your device\n   ↓ request for a page\nnetwork routes packets\n   ↓ response returns\nyour browser displays it',
      glossary:[['Packet','A formatted unit of data carried across a network.'],['IP address','An address used to identify a source or destination on an IP network.'],['Router','A device that forwards packets between networks.']],related:['operating-system','database','encryption','binary'],
      quiz:{question:'What does a router mainly do with packets?',options:['Forward them toward a destination','Turn them into database tables','Store them permanently'],correct:0,explanation:'Routers use addressing information to forward packets along a path toward their destination.'},
      sources:[['RFC 791 — Internet Protocol','https://www.rfc-editor.org/rfc/rfc791.html','The Internet Protocol specification describes datagrams, addressing, and forwarding across interconnected networks.']]
    },
    database:{
      visualTitle:'A table organizes records into rows and columns.',visualCaption:'A query asks for a subset of stored data. A database system manages storage and retrieval.',
      visual:`<div class="database-diagram"><div class="db-query"><small>ASK</small><code>SELECT name<br>WHERE score &gt; 80</code></div><span class="db-arrow">↓</span><table aria-label="Sample student records"><thead><tr><th>name</th><th>score</th></tr></thead><tbody><tr><td>Ari</td><td>94</td></tr><tr class="db-hit"><td>Sam</td><td>87</td></tr><tr><td>Jo</td><td>62</td></tr></tbody></table><span class="db-result">2 records match</span></div>`,
      exampleIntro:'A query can ask for only the records that match a condition. SQL is a common language for working with relational databases.',exampleLabel:'SQL EXAMPLE',example:'SELECT name\nFROM students\nWHERE score > 80;',
      glossary:[['Record','One collection of related values, often stored as a row.'],['Query','A request to retrieve or change information.'],['SQL','A language commonly used to work with relational databases.']],related:['internet','encryption','operating-system'],
      quiz:{question:'In a table, what does a row usually represent?',options:['One record','One database program','A search query'],correct:0,explanation:'A row commonly holds one record, while columns describe the fields in that record.'},
      sources:[['PostgreSQL Documentation — What Is PostgreSQL?','https://www.postgresql.org/docs/17/intro-whatis.html','An introduction to a widely used relational database system and its SQL capabilities.']]
    },
    variable:{
      visualTitle:'A variable name points to a value a program can use.',visualCaption:'The name helps people and code refer to the current value. In this example, score is 7.',
      visual:`<div class="variable-diagram"><div class="var-label">PROGRAM MEMORY</div><div class="var-cell"><span>NAME</span><b>score</b></div><div class="var-arrow">→</div><div class="var-cell var-value"><span>VALUE</span><b>7</b></div><div class="var-foot">the value can change as the program runs</div></div>`,
      exampleIntro:'In JavaScript, let declares a variable whose value can be reassigned. const is used when the binding should not be reassigned.',exampleLabel:'JAVASCRIPT',example:'let score = 0;\nscore = score + 1;\n\n// score is now 1',
      glossary:[['Declaration','Introducing a named variable to a program.'],['Assignment','Giving a variable a value.'],['Type','The kind of value, such as a number, string, or boolean.']],related:['algorithm','loop','binary'],
      quiz:{question:'After these lines, what is the value of score?  let score = 2; score = score + 3;',options:['2','3','5'],correct:2,explanation:'The second line reads 2, adds 3, and assigns the result 5 back to score.'},
      sources:[['MDN — Storing the information you need: Variables','https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables','A practical guide to declaring, naming, and changing JavaScript variables.']]
    },
    loop:{
      visualTitle:'A loop checks a condition, does work, and repeats.',visualCaption:'A loop stops when its condition becomes false. If it never does, the program can run forever.',
      visual:`<div class="loop-diagram" aria-label="A loop checks a condition, runs a step, and repeats until finished"><div class="loop-start">START</div><div class="loop-node">Check<br>condition</div><div class="loop-branch"><span>YES</span><i></i></div><div class="loop-work">Run the<br>instructions</div><div class="loop-back">↶ repeat</div><div class="loop-stop">NO → STOP</div></div>`,
      exampleIntro:'This loop prints three messages. The counter changes each time, so the condition eventually becomes false.',exampleLabel:'JAVASCRIPT',example:'for (let step = 1; step <= 3; step++) {\n  console.log("Step " + step);\n}\n\n// Step 1, Step 2, Step 3',
      glossary:[['Iteration','One pass through a loop.'],['Condition','A test that decides whether a loop continues.'],['Infinite loop','A loop whose condition never becomes false.']],related:['variable','algorithm','operating-system'],
      quiz:{question:'What helps a counting loop eventually stop?',options:['A condition that can become false','Adding more instructions','Changing the variable name'],correct:0,explanation:'A loop needs a stopping condition, and its work should eventually make that condition false.'},
      sources:[['MDN — Loops and iteration','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration','Reference and examples for JavaScript loops, conditions, and iteration.']]
    },
    encryption:{
      visualTitle:'A key transforms readable text into ciphertext.',visualCaption:'Encryption aims to make information unreadable without the appropriate key. The Caesar example below is for learning only.',
      visual:`<div class="cipher-diagram"><div class="cipher-state"><small>PLAIN TEXT</small><b>HELLO</b></div><div class="cipher-key"><i>✳</i><span>KEY / SHIFT</span><strong>+3</strong></div><div class="cipher-state cipher-output"><small>CIPHER TEXT</small><b>KHOOR</b></div><div class="cipher-arrow">→</div></div>`,
      exampleIntro:'A Caesar cipher shifts each letter by a fixed amount. It is easy to understand, but it is not secure for real messages.',exampleLabel:'LEARNING EXAMPLE',example:'H  E  L  L  O\n↓  ↓  ↓  ↓  ↓   shift each letter +3\nK  H  O  O  R',
      glossary:[['Plaintext','Information in its readable form before encryption.'],['Ciphertext','The transformed, unreadable-looking output.'],['Key','Information that controls an encryption or decryption operation.']],related:['internet','database','binary'],
      quiz:{question:'In the Caesar example, what does the shift key control?',options:['How far each letter moves in the alphabet','How many people can see the message','The message length'],correct:0,explanation:'The shift amount specifies how many alphabet positions each letter moves.'},
      sources:[['NIST CSRC Glossary — Encryption','https://csrc.nist.gov/glossary/term/encryption','A standards glossary definition of encryption.'],['NIST CSRC Glossary — Cryptography','https://csrc.nist.gov/glossary/term/cryptography','Definitions and context for cryptographic methods and goals.']]
    },
    'operating-system':{
      visualTitle:'The operating system coordinates apps and hardware.',visualCaption:'Programs ask the OS for services; the OS manages resources such as the processor, memory, files, and devices.',
      visual:`<div class="os-diagram"><div class="os-layer os-apps"><small>01 / APPLICATIONS</small><b><span>Browser</span><span>Games</span><span>Tools</span></b></div><div class="os-connector">⇅</div><div class="os-layer os-manager"><small>02 / OPERATING SYSTEM</small><b>Coordinates resources</b><i>CPU · memory · files · devices</i></div><div class="os-connector">⇅</div><div class="os-layer os-hardware"><small>03 / HARDWARE</small><b>Processor & memory</b><i>Storage · screen · keyboard</i></div></div>`,
      exampleIntro:'When a browser needs to save a file, it asks the operating system to work with storage instead of controlling the hardware itself.',exampleLabel:'A SIMPLE REQUEST',example:'Browser app\n   ↓ asks the OS\nOperating system manages files\n   ↓ talks to storage\nFile is saved',
      glossary:[['Process','A program that is currently running.'],['Memory management','How the OS allocates and organizes working memory.'],['File system','The way files and folders are named, stored, and retrieved.']],related:['algorithm','internet','loop'],
      quiz:{question:'Which task is commonly handled by an operating system?',options:['Managing memory and devices','Writing every app’s content','Designing every website'],correct:0,explanation:'An OS coordinates hardware and software resources, including memory, storage, and connected devices.'},
      sources:[['IBM — What is an Operating System?','https://www.ibm.com/think/topics/operating-systems','An overview of how operating systems manage hardware, applications, and resources.']]
    }
  };

  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const slugify=value=>String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const slug=new URLSearchParams(location.search).get('slug')||'';
  let userArticles=[];try{userArticles=JSON.parse(localStorage.getItem('csw-articles')||'[]');}catch{}
  const all=[...(Array.isArray(articles)?articles:[]),...userArticles];
  const current=all.find(item=>{
    const userSlug=item.custom?slugify(item.title)+'-custom-'+item.id:slugify(item.title);
    return userSlug===slug;
  });
  if(!current){
    document.getElementById('article-title').textContent='Idea not found';
    document.getElementById('article-lead').textContent='This article may have moved, or it may be a custom article saved only in another browser.';
    document.getElementById('article-summary').textContent='Return to the library to choose another idea.';
    document.title='Article not found — CS Wiki';
    return;
  }
  const extra=rich[slug]||{};
  const paragraphs=Array.isArray(current.content)?current.content:[];
  const wordCount=paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
  const minutes=Math.max(1,Math.round(wordCount/200));
  document.title=current.title+' — CS Wiki';
  document.getElementById('article-title').textContent=current.title;
  document.getElementById('article-lead').textContent=current.summary;
  document.getElementById('article-summary').textContent=extra.inOneSentence||current.summary;
  document.getElementById('article-category').textContent=current.category;
  document.getElementById('article-crumb-category').textContent=current.category.toUpperCase();
  document.getElementById('article-reading-time').textContent=minutes+' MIN READ';
  document.getElementById('article-explanation').innerHTML=paragraphs.map(text=>'<p>'+esc(text)+'</p>').join('');
  document.getElementById('diagram-title').textContent=extra.visualTitle||'A visual model';
  document.getElementById('diagram-caption').textContent=extra.visualCaption||'';
  document.getElementById('article-diagram').innerHTML=extra.visual||'<div class="custom-article-note">This community article does not have a visual model yet.</div>';
  document.getElementById('example-description').textContent=extra.exampleIntro||'Read the idea again and look for where it appears in everyday computing.';
  document.getElementById('example-label').textContent=extra.exampleLabel||'CONCEPT NOTE';
  document.getElementById('article-example').textContent=extra.example||current.summary;
  document.getElementById('article-hero-art').dataset.category=slug;
  const glossary=extra.glossary||[];
  document.getElementById('article-glossary').innerHTML=glossary.length?glossary.map(([term,definition])=>'<div class="glossary-term"><dt>'+esc(term)+'</dt><dd>'+esc(definition)+'</dd></div>').join(''):'<div class="glossary-term"><dt>Key idea</dt><dd>'+esc(current.summary)+'</dd></div>';
  const related=(extra.related||[]).map(id=>all.find(item=>slugify(item.title)===id)).filter(Boolean).slice(0,4);
  document.getElementById('article-related').innerHTML=related.map(item=>{
    const relatedSlug=item.custom?slugify(item.title)+'-custom-'+item.id:slugify(item.title);
    return '<a class="related-article-card" href="article.html?slug='+encodeURIComponent(relatedSlug)+'"><span>'+esc(item.category)+'</span><b>'+esc(item.title)+'</b><small>'+esc(item.summary)+'</small><i>↗</i></a>';
  }).join('')||'<p class="no-related">More related guides are on the way.</p>';
  const sources=extra.sources||[];
  document.getElementById('article-sources').innerHTML=sources.length?sources.map(([title,url,note])=>'<li><div><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(title)+' ↗</a><p>'+esc(note)+'</p></div></li>').join(''):'<li><div><span>More sources will be added as this guide grows.</span></div></li>';
  const heroArt=document.getElementById('article-hero-art');heroArt.setAttribute('aria-hidden','true');
  const glyphs={algorithm:'⌘',binary:'01',internet:'⌁',database:'▤',variable:'x',loop:'↻',encryption:'◈','operating-system':'▧'};
  heroArt.querySelector('b').textContent=glyphs[slug]||'✳';
  const references=extra.sources||[];
  const schema=document.createElement('script');schema.type='application/ld+json';
  schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'LearningResource','name':current.title,'description':current.summary,'learningResourceType':'Article','educationalLevel':'Beginner','url':location.href,'citation':references.map(source=>source[1])});
  document.head.appendChild(schema);

  const bookmarkButton=document.getElementById('article-save');
  let bookmarks=[];try{bookmarks=JSON.parse(localStorage.getItem('csw-bookmarks')||'[]');}catch{}
  function updateBookmark(){const saved=bookmarks.includes(current.id);bookmarkButton.setAttribute('aria-pressed',String(saved));bookmarkButton.innerHTML=(saved?'★':'☆')+' <span>'+(saved?'Saved to your library':'Save this guide')+'</span>';}
  bookmarkButton.addEventListener('click',()=>{
    if(bookmarks.includes(current.id))bookmarks=bookmarks.filter(id=>id!==current.id);else bookmarks.push(current.id);
    try{localStorage.setItem('csw-bookmarks',JSON.stringify(bookmarks));}catch{}
    updateBookmark();
  });
  updateBookmark();
  document.getElementById('article-share').addEventListener('click',async()=>{
    const status=document.getElementById('article-status');
    try{await navigator.clipboard.writeText(location.href);status.textContent='Article link copied.';}
    catch{status.textContent='Copy is unavailable in this browser.';}
  });

  const quiz=extra.quiz;
  const quizForm=document.getElementById('article-quiz');
  if(!quiz){document.getElementById('quick-check').hidden=true;}
  else{
    quizForm.innerHTML='<fieldset><legend>'+esc(quiz.question)+'</legend>'+quiz.options.map((option,index)=>'<label class="quiz-option"><input type="radio" name="answer" value="'+index+'"><span>'+esc(option)+'</span></label>').join('')+'<button class="btn btn-primary quiz-submit" type="submit">Check answer</button><p class="quiz-feedback" id="quiz-feedback" role="status"></p></fieldset>';
    quizForm.addEventListener('submit',event=>{
      event.preventDefault();const answer=new FormData(quizForm).get('answer');const feedback=document.getElementById('quiz-feedback');
      if(answer===null){feedback.textContent='Choose an answer first.';feedback.className='quiz-feedback is-neutral';return;}
      const correct=Number(answer)===quiz.correct;feedback.textContent=(correct?'That’s right. ':'Not quite. ')+quiz.explanation;feedback.className='quiz-feedback '+(correct?'is-correct':'is-incorrect');
    });
  }
  const sections=[...document.querySelectorAll('.article-body section[id]')];
  const toc=[...document.querySelectorAll('.article-sidebar a[href^="#"]')];
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){toc.forEach(link=>link.classList.toggle('is-current',link.hash==='#'+entry.target.id));}
    }),{rootMargin:'-20% 0px -65% 0px'});sections.forEach(section=>observer.observe(section));
  }
})();
