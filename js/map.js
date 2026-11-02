(() => {
  const nodes = [
    { id:'binary', title:'Binary', category:'Foundations', related:['algorithm'], glyph:'01' },
    { id:'algorithm', title:'Algorithm', category:'Foundations', related:['binary','variable','operating-system'], glyph:'⌘' },
    { id:'variable', title:'Variable', category:'Programming', related:['algorithm','loop'], glyph:'x' },
    { id:'loop', title:'Loop', category:'Programming', related:['variable'], glyph:'↻' },
    { id:'operating-system', title:'Operating System', category:'Systems', related:['algorithm','internet'], glyph:'▧' },
    { id:'internet', title:'Internet', category:'Networks', related:['operating-system','database','encryption'], glyph:'⌁' },
    { id:'database', title:'Database', category:'Data', related:['internet','encryption'], glyph:'▤' },
    { id:'encryption', title:'Encryption', category:'Security', related:['internet','database'], glyph:'◈' }
  ];
  const edges = [...document.querySelectorAll('.map-edge')];
  const nodeButtons = [...document.querySelectorAll('.map-node')];
  const details = {
    number:document.getElementById('concept-number'),
    category:document.getElementById('concept-category'),
    title:document.getElementById('concept-title'),
    summary:document.getElementById('concept-summary'),
    related:document.getElementById('concept-related'),
    read:document.getElementById('concept-read'),
    status:document.getElementById('map-status')
  };
  const mapSearch=document.getElementById('map-search');
  let selected=nodes.find(node=>node.id===new URLSearchParams(location.search).get('concept')) || nodes[1];
  let activeFilter='all';

  function articleFor(node){
    return (typeof articles!=='undefined' ? articles : []).find(article=>article.title.toLowerCase()===node.title.toLowerCase());
  }
  function selectNode(node, updateUrl=true){
    selected=node;
    const article=articleFor(node);
    details.number.textContent=String(nodes.indexOf(node)+1).padStart(2,'0');
    details.category.textContent=node.category.toUpperCase()+' / CONCEPT';
    details.title.textContent=node.title;
    details.summary.textContent=article ? article.summary : 'Explore this idea and see how it connects to the rest of computer science.';
    details.read.href='article.html?slug='+encodeURIComponent(node.id);
    details.related.innerHTML='';
    node.related.forEach(id=>{
      const linked=nodes.find(item=>item.id===id);
      if(!linked)return;
      const button=document.createElement('button');
      button.type='button';button.className='related-concept';button.textContent=linked.title+' ↗';
      button.addEventListener('click',()=>selectNode(linked));
      details.related.appendChild(button);
    });
    nodeButtons.forEach(button=>{
      const isCurrent=button.dataset.id===node.id;
      const isRelated=node.related.includes(button.dataset.id);
      button.classList.toggle('is-selected',isCurrent);
      button.classList.toggle('is-related',isRelated);
      button.classList.toggle('is-dimmed',!isCurrent&&!isRelated);
      button.setAttribute('aria-pressed',String(isCurrent));
    });
    edges.forEach(edge=>edge.classList.toggle('is-active',edge.dataset.from===node.id||edge.dataset.to===node.id));
    if(updateUrl){
      const next=new URL(location.href);next.searchParams.set('concept',node.id);
      history.replaceState({},'',next.pathname+next.search);
    }
    details.status.textContent='';
  }
  function applyLens(){
    const query=mapSearch.value.trim().toLowerCase();
    const visible=new Set();
    nodes.forEach(node=>{
      const article=articleFor(node);
      const matchCategory=activeFilter==='all'||node.category===activeFilter;
      const matchSearch=!query||node.title.toLowerCase().includes(query)||node.category.toLowerCase().includes(query)||(article&&article.summary.toLowerCase().includes(query));
      const matches=matchCategory&&matchSearch;
      if(matches)visible.add(node.id);
      const button=nodeButtons.find(item=>item.dataset.id===node.id);
      button.classList.toggle('is-filtered',!matches);
    });
    edges.forEach(edge=>edge.classList.toggle('is-filtered',!visible.has(edge.dataset.from)||!visible.has(edge.dataset.to)));
  }
  nodeButtons.forEach(button=>button.addEventListener('click',()=>{
    const node=nodes.find(item=>item.id===button.dataset.id);if(node)selectNode(node);
  }));
  document.querySelectorAll('.map-filter').forEach(button=>button.addEventListener('click',()=>{
    activeFilter=button.dataset.filter;
    document.querySelectorAll('.map-filter').forEach(item=>item.classList.toggle('is-active',item===button));
    applyLens();
  }));
  mapSearch.addEventListener('input',applyLens);
  document.addEventListener('keydown',event=>{
    if(event.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
      event.preventDefault();mapSearch.focus();
    }
  });
  document.getElementById('copy-map-link').addEventListener('click',async()=>{
    const url=new URL(location.href);url.searchParams.set('concept',selected.id);
    try{await navigator.clipboard.writeText(url.href);details.status.textContent='Concept link copied.';}
    catch{details.status.textContent='Copy is unavailable in this browser.';}
  });
  selectNode(selected,false);
  applyLens();
})();
