//===IndexedDB===
const DB_NAME='AppDB';
const STORES={text:'textStore',bg:'bgStore'};
const KEYS={text:'textContent',bg:'bg'};
function openDB(){
    return new Promise((resolve,reject)=>{
        const request=indexedDB.open(DB_NAME,1);
        request.onupgradeneeded=(event)=>{
            const db=event.target.result;
            for(const storeName of Object.values(STORES)){
                if(!db.objectStoreNames.contains(storeName)){
                    const store=db.createObjectStore(storeName);
                    if(storeName===STORES.bg){store.keyPath='id';}
                }
            }
        };
        request.onsuccess=(event)=>resolve(event.target.result);
        request.onerror=(event)=>reject(event.target.error);
    });
}
function saveData(storeName,key,value){
    return openDB().then(db=>{
        return new Promise((resolve,reject)=>{
            const tx=db.transaction(storeName,'readwrite');
            const store=tx.objectStore(storeName);
            const data=storeName===STORES.bg?{id: key,data:value}:value;
            const req=store.put(data,key);
            req.onsuccess=()=>resolve();
            req.onerror=()=>reject(req.error);
            tx.oncomplete=()=>db.close();
        });
    });
}
function loadData(storeName,key){
    return openDB().then(db=>{
        return new Promise((resolve,reject)=>{
            const tx=db.transaction(storeName,'readonly');
            const store=tx.objectStore(storeName);
            const req=store.get(key);
            req.onsuccess=()=>{
                const result=req.result;
                if(storeName===STORES.bg&&result){resolve(result.data);}
                else{resolve(result??null);}
            };
            req.onerror=()=>reject(req.error);
            tx.oncomplete=()=>db.close();
        });
    });
}
function deleteData(storeName,key){
    return openDB().then(db=>{
        return new Promise((resolve,reject)=>{
            const tx=db.transaction(storeName,'readwrite');
            const store=tx.objectStore(storeName);
            const req=store.delete(key);
            req.onsuccess=()=>resolve();
            req.onerror=()=>reject(req.error);
            tx.oncomplete=()=>db.close();
        });
    });
}
function deleteDB(){
    if(confirm('出现错误，是否清除数据库？')){
        const d=indexedDB.deleteDatabase(DB_NAME);
        d.onsuccess=function(){console.log('删除成功')};
        d.onerror=function(){console.log('删除失败')};
    }
}
//===文件===
function processText(text){
    saveData(STORES.text,KEYS.text,text).then(()=>{
        const pages=parseDocument(text);
        renderPages(pages);
        initApp();
    }).catch(()=>{deleteDB();});
}
function restoreFromDB(){
    return loadData(STORES.text,KEYS.text).then(text=>{
        if (text!==null&&text!==''){
            const pages=parseDocument(text);
            renderPages(pages);
        }
    }).catch(()=>{deleteDB();});
}
//===文本解析===
function processEscape(line){
    let result='',i=0;
    const specials='#-+:{}[]|*^$\\!<>';
    while(i<line.length){
        if(line[i]==='\\'){
            if(i+1<line.length){
                if(specials.includes(line[i+1])){result+=line[i+1];i+=2;}
                else{result+='<br>';i++;}
            }
            else{i++;}
        }
        else{result+=line[i];i++;}
    }
    return result;
}
function parseInlineA(str){
    str=str.replace(/\[([^\]]*)\]\(([^)]*)\)/g,'<a href="$2">$1</a>');
    str=str.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
    str=str.replace(/\*(.*?)\*/g,'<em>$1</em>');
    str=str.replace(/\$(.*?)\$/g,'<small>$1</small>');
    str=str.replace(/\^(.*?)\^/g,'<sup>$1</sup>');
    return str;
}
function parseInlineB(str){
    str=str.replace(/\[([^\]]*)\]\(([^)]*)\)/g,'<a href="$2">$1</a>');
    str=str.replace(/\[([^\]]*)\]/g,'<i>$1</i>');
    str=str.replace(/\(([^)]*)\)/g,'<b>$1</b>');
    return str;
}
function parseTable(rows){
    let html='<table';
    if(rows[0].trim()==='|::|'){html+=' class="scroll"';rows=rows.slice(1);}
    html+='>';
    for(let row of rows){
        let cells=row.slice(1,-1).split('|');
        let cellHtmls=[];
        for(let cell of cells){
            let leftSpaces=cell.match(/^\s*/)[0].length;
            let rightSpaces=cell.match(/\s*$/)[0].length;
            let content=cell.trim();
            let isTh=false;
            if(content.startsWith(':')){isTh=true;content=content.slice(1).trim();}
            let rowspan=leftSpaces>0?leftSpaces+1:1;
            let colspan=rightSpaces>0?rightSpaces+1:1;
            let tag=isTh?'th':'td';
            let attrs='';
            if(rowspan>1) attrs+=` rowspan="${rowspan}"`;
            if(colspan>1) attrs+=` colspan="${colspan}"`;
            cellHtmls.push(`<${tag}${attrs}>${parseInlineA(content)}</${tag}>`);
        }
        html+='<tr>'+cellHtmls.join('')+'</tr>';
    }
    html+='</table>';
    return html;
}
function parseList(items){
    let html='';
    let topIndices=[];
    for(let idx=0;idx<items.length;idx++){
        if(items[idx].indent===0){topIndices.push(idx);}
    }
    if(topIndices.length===0)return html;
    let outerTag=items[topIndices[0]].marker==='-'?'ul':'ol';
    html+=`<${outerTag}>`;
    for(let t=0;t<topIndices.length;t++){
        let idx=topIndices[t];
        let top=items[idx];
        let nextTopIdx=(t+1<topIndices.length)?topIndices[t+1]:items.length;
        let subItems=[];
        for(let j=idx+1;j<nextTopIdx;j++){
            if(items[j].indent===1){subItems.push(items[j]);}
        }
        html+=`<li>${parseInlineA(top.content)}</li>`;
        if(subItems.length>0){
            let innerTag=subItems[0].marker==='-'?'ul':'ol';
            html+=`<${innerTag}>`;
            for(let sub of subItems){
                html+=`<li>${parseInlineA(sub.content)}</li>`;
            }
            html+=`</${innerTag}>`;
        }
    }
    html+=`</${outerTag}>`;
    return html;
}
function parseDl(lines){
    let html='<dl>';
    for(let line of lines){
        if(line.startsWith(':: ')){html+=`<dt>${parseInlineA(line.slice(3))}</dt>`;}
        else if(line.startsWith(': ')){html+=`<dd>${parseInlineA(line.slice(2))}</dd>`;}
    }
    html+='</dl>';
    return html;
}
function parseArticle(lines){
    let className='';
    let contentLines=lines;
    let first=lines[0];
    let trimmedFirst=first.trim();
    if(trimmedFirst.match(/^\{[^}]*\}$/)){
        className=trimmedFirst.slice(1,-1);
        contentLines=lines.slice(1);
    }
    let innerLines=contentLines.map(line=>line.slice(2));
    let innerHtml=parseContentA(innerLines,true);
    let classAttr=className?` class="${className}"`:'';
    return `<article${classAttr}>${innerHtml}</article>`;
}
function parseContentA(lines,insideArticle){
    let html='', i=0;
    const inline=parseInlineA;
    while(i<lines.length){
        let line=lines[i];
        let trimmed=line.trim();
        if(trimmed===''){i++;continue;}
        if(line.startsWith('|')&&line.endsWith('|')&&line.length>1){
            let rows=[];
            while(i<lines.length&&lines[i].startsWith('|')&&lines[i].endsWith('|')){
                rows.push(lines[i]);i++;
            }
            html+=parseTable(rows,'A');
            continue;
        }
        if(line.startsWith(' ')&&line.length>2){
            let indented=[];
            while(i<lines.length&&lines[i].startsWith(' ')&&lines[i].length>2){
                indented.push(lines[i]);i++;
            }
            html+=parseArticle(indented,'A');
            continue;
        }
        if(line.match(/^( {0,1})([-+]) /)){
            let items=[];
            while(i<lines.length){
                let m=lines[i].match(/^( {0,1})([-+]) /);
                if(!m)break;
                items.push({indent:m[1].length,marker:m[2],content:lines[i].slice(m[0].length)});
                i++;
            }
            html+=parseList(items,'A');
            continue;
        }
        if(line.match(/^: /)||line.match(/^:: /)){
            let dlLines=[];
            while(i<lines.length&&(lines[i].match(/^: /)||lines[i].match(/^:: /))){
                dlLines.push(lines[i]);i++;
            }
            html+=parseDl(dlLines,'A');
            continue;
        }
        let imgMatch=trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if(imgMatch){html+=`<img src="${imgMatch[2]}" alt="${imgMatch[1]}"/>`;i++;continue;}
        if(trimmed==='---'){html+='<hr>';i++;continue;}
        let hMatch=trimmed.match(/^(#{1,6}) /);
        if(hMatch){
            let level=hMatch[1].length;
            let content=line.slice(hMatch[0].length);
            html+=`<h${level}>${inline(content)}</h${level}>`;
            i++;continue;
        }
        if(trimmed.startsWith('> ')){
            html+=`<q>${inline(line.slice(2))}</q>`;
            i++;continue;
        }
        if(trimmed.startsWith('= ')){
            html+=`<code>${inline(line.slice(2))}</code>`;
            i++;continue;
        }
        let pContent=line;
        if(insideArticle){
            const colonIndex=pContent.indexOf(' : ');
            if(colonIndex!==-1) {
                const leftPart = pContent.substring(0, colonIndex).trim();
                const rightPart = pContent.substring(colonIndex + 3).trim();
                html += `<b>${inline(leftPart)}</b><p>${inline(rightPart)}</p>`;
                i++;
                continue;
            }
        }
        html+=`<p>${inline(pContent)}</p>`;i++;
    }
    return html;
}
function parseContentB(lines){
    let html='';
    let currentDiv=null;
    const inline=parseInlineB;
    function closeDiv(){
        if(currentDiv){
            let innerHtml='';
            let j=0;
            const innerLines=currentDiv.contentLines;
            while(j<innerLines.length){
                let line=innerLines[j];
                let trimmed=line.trim();
                if(trimmed===''){j++;continue;}
                if(trimmed.startsWith('# ')){
                    innerHtml+=`<h1>${inline(line.slice(2))}</h1>`;
                    j++;continue;
                }
                let hot=false, unsure=false;
                let contentLine=line;
                if(trimmed.startsWith('!')){
                    hot=true;
                    contentLine=line.replace(/^!\s*/,'');
                }else if(trimmed.startsWith('?')){
                    unsure=true;
                    contentLine=line.replace(/^\?\s*/,'');
                }
                let attrs='';
                if(hot)attrs+=' data-hot';
                if(unsure)attrs+=' data-unsure';
                innerHtml+=`<p${attrs}>${inline(contentLine)}</p>`;
                j++;
            }
            let classAttr=currentDiv.classes.length>0?' class="'+currentDiv.classes.join(' ')+'"':'';
            html+=`<div time="${currentDiv.time}"${classAttr}>${innerHtml}</div>`;
            currentDiv=null;
        }
    }
    for(let line of lines){
        let trimmed=line.trim();
        if(trimmed==='')continue;
        if(trimmed.startsWith('# ')){
            closeDiv();
            let content=line.slice(2);
            html+=`<h1>${inline(content)}</h1>`;
            continue;
        }
        if(trimmed.startsWith('$ ')){
            closeDiv();
            let rest=line.slice(2);
            let parts=rest.match(/\S+/g);
            if(parts){
                let date=parts[0]||'';
                let classes=parts.slice(1);
                currentDiv={time:date, classes:classes, contentLines:[]};
            }else{
                currentDiv={time:'', classes:[], contentLines:[]};
            }
            continue;
        }
        if(!currentDiv){
            currentDiv={time:'', classes:[], contentLines:[]};
        }
        currentDiv.contentLines.push(line);
    }
    closeDiv();
    return html;
}
function parseDocument(text){
    const pages=[];
    const lines=text.split(/\r?\n/);
    let currentPage=null;
    let state='metadata';
    for(const rawLine of lines){
        const line=rawLine;
        if(line.trim()==='====='){
            if(currentPage!==null) pages.push(currentPage);
            currentPage=null;
            state='metadata';
            continue;
        }
        if(state==='metadata'){
            if(line.trim()==='') continue;
            const parts=line.trim().split(/\s+/);
            if(parts.length>=3){
                const title=parts.slice(0, -2).join(' ');
                const id=parts[parts.length-2];
                const theme=parts[parts.length-1];
                currentPage={metadata:{title,id,theme},contentLines:[]};
                state='content';
            }else{
                currentPage={metadata:{title:'',id:'',theme:''},contentLines:[]};
                state='content';
            }
        }else if(state==='content'){
            if(currentPage!==null) currentPage.contentLines.push(line);
        }
    }
    if(currentPage!==null) pages.push(currentPage);
    return pages.map(page=>{
        const processed=page.contentLines.map(line=>processEscape(line));
        let html='';
        if(page.metadata.id==='EVENT'){html=parseContentB(processed);}
        else{html=parseContentA(processed,false);}
        return {id:page.metadata.id, title:page.metadata.title, theme:page.metadata.theme, html};
    });
}
function renderPages(pages){
    document.querySelectorAll('main:not(#HOME)').forEach(e=>e.remove());
    for(const page of pages){
        if(page.id==='HOME')continue;
        const main=document.createElement('main');
        main.id=page.id;
        main.dataset.title=page.title;
        main.style.setProperty('--theme',page.theme);
        main.innerHTML=page.html;
        document.getElementById('root').appendChild(main);
    }
}
//===标题层级===
function extractStructure(){
    const result=[];
    document.querySelectorAll('main').forEach((main)=>{
        const structure=[];
        main.querySelectorAll(':scope>h1,:scope>h2,:scope>h3').forEach((el,index)=>{
            el.id=main.id+'-'+(index+1);
            structure.push({
                element:el.tagName.toLowerCase(),
                text:el.textContent,
                index:index+1,
                id:el.id
            });
        });
        const mainData={
            title:main.dataset.title,
            id:main.id,
            structure:structure
        };
        result.push(mainData);
    });
    return result;
};
let pageData=[];
//===页面切换===
function handleHashChange(){
    const hash=window.location.hash;
    if(!hash||hash==='#'){showPage('HOME');return;}
    const parts=hash.substring(1).split('-');
    const page=parts[0];
    const id=parts.slice(1).join('-');
    pageData.find(p=>p.id===page)?showPage(page,id):showPage('HOME');
}
function showPage(page,id){
    const updateHash=(hashValue)=>{
        const newHash=`#${hashValue}`;
        if(window.location.hash!==newHash)history.pushState(null,'',newHash);
    };
    document.querySelectorAll('main').forEach(main=>{main.style.display='none';});
    let targetMain=null;
    let targetId=null;
    if(id){
        const fullId=`${page}-${id}`;
        const element=document.getElementById(fullId);
        if(element){targetMain=element.closest('main');targetId=fullId;}
    }
    if(!targetMain){targetMain=document.querySelector(`main#${page}`);}
    if(!targetMain){targetMain=document.querySelector('main#HOME');updateHash('HOME');}
    else{updateHash((id&&targetId)?`${page}-${id}`:page);}
    targetMain.style.display='block';
    if(id&&targetId){
        const target=document.getElementById(targetId);
        if(target){target.scrollIntoView({behavior:'smooth',block:'start'});}
    }
    else{targetMain.scrollIntoView({behavior:'auto',block:'start'});}
    generateMenu();
    document.querySelectorAll('#menu button').forEach(e=>{e.classList.remove('active')});
    document.querySelector(`#menu button[onclick*="${page}"]`).classList.add('active');
    document.querySelector('#search').style.display=page==='EVENT'?'flex':'none';
}
//===菜单生成===
function getCurrentPageId(){
    const mains=document.querySelectorAll('main');
    for(const main of mains){if(main.style.display!=='none')return main.id;}
    return 'HOME';
}
function generateMenu(){
    const currentPageId=getCurrentPageId();
    const menu=document.getElementById('menu');
    let pageHtml='';
    pageData.forEach(p=>{
        pageHtml+=`<button onclick="showPage('${p.id}')">${p.title}</button>`;
    });
    menu.querySelector('div:first-child').innerHTML=pageHtml;
    const currentPage=pageData.find(p=>p.id===currentPageId);
    let headingHtml='';
    if(currentPage){
        currentPage.structure.filter(item=>item.element==='h1').forEach(item=>{
            headingHtml+=`<button onclick="showPage('${currentPageId}','${item.index}')">${item.text}</button>`;
        });
    }
    menu.querySelector('div:last-child').innerHTML=headingHtml;
}
//===目录生成===
function generateContents(){
    document.querySelectorAll('main').forEach(main=>{
        const container=main.querySelector('.content');
        if(!container)return;
        const pageId=main.id;
        if(pageId==='HOME')return;
        const pageInfo=pageData.find(p=>p.id===pageId);
        if(!pageInfo||pageInfo.structure.length===0)return;
        const dl=document.createElement('dl');
        const htmlParts=[];
        pageInfo.structure.forEach(item=>{
            const clickAttr=`onclick="showPage('${pageId}',${item.index})"`;
            let tag='';
            if(item.element==='h1')tag='dt';
            else if(item.element==='h2')tag='dd';
            else if(item.element==='h3')tag='span';
            if(tag)htmlParts.push(`<${tag} ${clickAttr}>${item.text}</${tag}>`);
        });
        if(htmlParts.length>0){
            dl.innerHTML=htmlParts.join('');
            container.appendChild(dl);
        }
    });
}
//===翻页按钮===
function generateNavigation(){
    document.querySelectorAll('main').forEach(main=>{
        const pageId=main.id;
        const dataIndex=pageData.findIndex(p=>p.id===pageId);
        if(pageId==='HOME')return;
        let prevHtml='';
        let nextHtml='';
        const prevIdx=dataIndex-1;
        const nextIdx=dataIndex+1;
        const prevPage=pageData[prevIdx];
        prevHtml=`<button onclick="showPage('${prevPage.id}')">${prevPage.title}</button>`;
        if(nextIdx<pageData.length){
            const nextPage=pageData[nextIdx];
            nextHtml=`<button onclick="showPage('${nextPage.id}')">${nextPage.title}</button>`;
        }
        const pagesDiv=document.createElement('div');
        pagesDiv.className='pages';
        pagesDiv.innerHTML=prevHtml+nextHtml;
        main.appendChild(pagesDiv);
    });
}
//===打开/关闭菜单===
document.addEventListener('click',function(e){
    const menuBtn=document.querySelector('#bar button:first-of-type');
    const settingBtn=document.querySelector('#bar button:last-of-type');
    const menu=document.getElementById('menu');
    const setting=document.getElementById('setting');
    const t=e.target;
    if(t===menuBtn||menuBtn.contains(t)){
        if(menu.classList.contains('show')){menu.classList.remove('show');}
        else{menu.classList.add('show');setting.classList.remove('show');}
        return;
    }
    if(t===settingBtn||settingBtn.contains(t)){
        if(setting.classList.contains('show')){setting.classList.remove('show');}
        else{setting.classList.add('show');menu.classList.remove('show');}
        return;
    }
    if(menu.classList.contains('show')){menu.classList.remove('show');}
    if(setting.classList.contains('show')&&!setting.contains(t)){setting.classList.remove('show');}
});
//===个性化===
async function applyBG(){
    const data=await loadData(STORES.bg,KEYS.bg);
    document.body.style.backgroundImage=data?`url(${data})`:'';
}
let settings={theme:'1',opacity:1,blur:0};
function applySettings(){
    document.documentElement.setAttribute('data-theme',settings.theme);
    document.querySelector(`#t${settings.theme}`).checked=true;
    document.getElementById('r1').value=settings.opacity;
    document.documentElement.style.setProperty('--opacity',settings.opacity);
    document.getElementById('r2').value=settings.blur;
    document.documentElement.style.setProperty('--blur',settings.blur+'px');
}
document.querySelectorAll('input[name="t"]').forEach(el=>{
    el.addEventListener('change',function(){
        if(this.checked){
            settings.theme=this.id.replace('t','');
            localStorage.setItem('setting',JSON.stringify(settings));
            applySettings();
        }
    });
});
document.getElementById('r1').addEventListener('input',function(){
    settings.opacity=this.value;
    localStorage.setItem('setting',JSON.stringify(settings));
    applySettings();
});
document.getElementById('r2').addEventListener('input',function(){
    settings.blur=this.value;
    localStorage.setItem('setting',JSON.stringify(settings));
    applySettings();
});
document.getElementById('updatebgBtn').addEventListener('click', () => {
    const inp=document.createElement('input');
    inp.type='file';
    inp.accept='image/*';
    inp.onchange=async function(e){
        const f=e.target.files[0];
        if(f){
            const reader=new FileReader();
            reader.onload=async function(ev){
                await saveData(STORES.bg,KEYS.bg,ev.target.result);
                await applyBG();
            };
            reader.readAsDataURL(f);
        }
    };
    inp.click();
});
document.getElementById('deletebgBtn').addEventListener('click',async ()=>{
    await deleteData(STORES.bg,KEYS.bg);
    await applyBG();
});
document.getElementById('updateDataBtn').addEventListener('click',function(){
    const inp=document.createElement('input');
    inp.type='file';
    inp.accept='.txt';
    inp.onchange=function(e){
        const file=e.target.files[0];
        if(!file) return;
        const reader=new FileReader();
        reader.onload=function(ev){processText(ev.target.result)};
        reader.readAsText(file,'UTF-8');
    };
    inp.click();
});
document.getElementById('deleteDataBtn').addEventListener('click',function(){
    deleteData(STORES.text,KEYS.text).then(()=>{initApp();}).catch(()=>{deleteDB();});
});
//===日志页面===
let hotMode=false;
let searchText='';
document.querySelector('#search>input').addEventListener('input',function(){
    searchText=this.value;
    filterEventContent();
});
document.querySelector('#search>button').addEventListener('click',function(){
    hotMode=!hotMode;
    this.classList.toggle('active');
    filterEventContent();
});
function filterEventContent(){
    const eventMain=document.getElementById('EVENT');
    eventMain.querySelectorAll('p').forEach(p=>{
        let show=true;
        if(
            (hotMode&&!p.hasAttribute('data-hot'))||
            (searchText.trim()!==''&&!p.textContent.toLowerCase().includes(searchText.trim().toLowerCase()))
        )show=false;
        p.style.display=show?'':'none';
    });
    eventMain.querySelectorAll(':scope>div:not(.pages)').forEach(div=>{
        let hasVisible=false;
        div.querySelectorAll('p').forEach(p=>{if(p.style.display!=='none')hasVisible=true;});
        div.style.display=hasVisible?'':'none';
    });
    const children=eventMain.children;
    let currentH1=null;
    let divsInRange=[];
    for(let i=0;i<children.length;i++){
        const child=children[i];
        if(child.tagName==='H1'){
            if(currentH1!==null){
                let allHidden=true;
                if(divsInRange.length===0){allHidden=false;}
                else{for(let div of divsInRange){if(div.style.display!=='none'){allHidden=false;break;}}}
                currentH1.style.display=(allHidden&&divsInRange.length>0)?'none':'';
            }
            currentH1=child;
            divsInRange=[];
        }
        else if(child.classList&&child.classList.contains('pages')){
            if(currentH1!==null){
                let allHidden=true;
                if(divsInRange.length===0){allHidden=false;}
                else{for(let div of divsInRange){if(div.style.display!=='none'){allHidden=false;break;}}}
                currentH1.style.display=(allHidden&&divsInRange.length>0)?'none':'';
            }
            currentH1=null;
            divsInRange=[];
        }
        else if(child.tagName==='DIV'&&!child.classList.contains('pages')){divsInRange.push(child);}
    }
    if(currentH1!==null){
        let allHidden=true;
        if(divsInRange.length===0){allHidden = false;}
        else{for(let div of divsInRange){if(div.style.display!=='none'){allHidden=false;break;}}}
        currentH1.style.display=(allHidden&&divsInRange.length>0)?'none':'';
    }
}
//===外部链接===
document.querySelectorAll('a[href^="http"]').forEach(link=>{
    link.setAttribute('target','_blank');
    link.setAttribute('rel','noopener noreferrer');
});
//===初始化===
function initApp(){
    pageData=extractStructure();
    window.addEventListener('hashchange',handleHashChange);
    handleHashChange();
    generateContents();
    generateNavigation();
    const stored=localStorage.getItem('setting');
    if(stored){settings=JSON.parse(stored);}
    else{localStorage.setItem('setting',JSON.stringify(settings));}
    applySettings();
    applyBG();
}
window.addEventListener('DOMContentLoaded',function(){
    restoreFromDB().then(()=>{initApp()}).catch(()=>{deleteDB();initApp()});
});