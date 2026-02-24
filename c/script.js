//密码（abc）
function ep(){
    var e=document.querySelector("#password input").value;
    "123"===e?(localStorage.setItem("p","true"),document.getElementById("password").close()):document.querySelector("#password input").style.background="#f004";
}
//页面切换
function showPage(e){
    var l=document.querySelectorAll("main"),
        n=document.getElementById(e),
        o=document.querySelectorAll("nav>div:nth-of-type(2)>div>div"),
        t=document.querySelector("nav>div:nth-of-type(1)>div>div");
    l.forEach(e=>{e.style.display="none"});
    window.scrollTo({top:0,behavior:"auto"});
    o.forEach(e=>{e.style.display="none"});
    document.querySelectorAll("nav button").forEach(e=>{e.classList.remove("active")});
    document.querySelector(`nav button[onclick*="${e}"]`).classList.add("active");
    n&&(n.style.display="block");
    t.style.display="EVE"==e?"block":"none";
    document.getElementById(e+"-l").style.display="block";
}
//关闭菜单
document.addEventListener("click",function(t){
    var e=document.querySelector("nav>div:nth-of-type(2)"),
        n=document.querySelector("nav button.fa-navicon");
    e.classList.contains("active")&&t.target!==n&&e.classList.remove("active");
});
//主题切换
function chT(e){document.body.setAttribute("data-t",e),localStorage.setItem("t",e);}
function chN(e){document.body.setAttribute("data-n",e),localStorage.setItem("n",e);}
function chF(e){document.body.setAttribute("data-tf",e),localStorage.setItem("f",e);search();}
document.getElementById('r1').addEventListener('input',function(){
    document.querySelector('body').style.setProperty("--o",this.value);
    localStorage.setItem("o",this.value);
});
document.getElementById('r2').addEventListener('input',function(){
    document.querySelector('body').style.setProperty("--bl",this.value+"px");
    localStorage.setItem("b",this.value);
});
//背景图片
let db;
const request=indexedDB.open("bgDB",1);
function lbg(){
    const e=db.transaction(["bg"],"readonly").objectStore("bg").get(1);
    e.onsuccess=function(){e.result&&(document.body.style.backgroundImage=`url(${e.result.image})`)}
}
function cbg(){
    var e=document.createElement("input");
    e.type="file";
    e.accept="image/*";
    e.onchange=function(e){
        var t,e=e.target.files[0];
        e&&((t=new FileReader).onload=function(e){
            db.transaction(["bg"],"readwrite").objectStore("bg").put({id:1,image:e.target.result});
            document.body.style.backgroundImage=`url(${e.target.result})`;
        },t.readAsDataURL(e))
    }
    e.click();
}
function ubg(){
    db.transaction(["bg"],"readwrite").objectStore("bg").delete(1);
    document.body.style.backgroundImage="";
}
request.onupgradeneeded=function(e){(db=e.target.result).objectStoreNames.contains("bg")||db.createObjectStore("bg",{keyPath:"id"})};
request.onsuccess=function(e){db=e.target.result,lbg()};
//替代图像
document.querySelectorAll("img").forEach(o=>{o.onerror=function(){this.classList.add("broken")}});
//日志页逻辑
function search(){
    var e=document.querySelector("nav input").value.trim(),
        t=document.getElementById("EVE");
    if (t&&"none"!==window.getComputedStyle(t).display){
        if(t=t.querySelectorAll("p,dd"),e){
            const i=new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");
            t.forEach(e=>{
                e.hasAttribute("data-or")||e.setAttribute("data-or",e.innerHTML);
                var t=e.getAttribute("data-or");
                i.test(t.replace(/<[^>]*>/g,""))?
                    (e.style.display="",
                     e.innerHTML=t.replace(/([^<]*)(<[^>]*>)?/g,(e,t,a)=>t?t.replace(i,e=>`<mark>${e}</mark>`)+(a||""):a||"")):
                e.style.display="none",i.lastIndex=0;
            })
        }else t.forEach(e=>{
            e.style.display="";
            e.hasAttribute("data-or")&&(e.innerHTML=e.getAttribute("data-or"),e.removeAttribute("data-or"));
        });
        heb();
    }
}
function hot(){
    const d=document.querySelector("nav>div:nth-of-type(1)>div>div>button").classList.contains('active');
    d?document.body.setAttribute("data-th","1"):document.body.setAttribute("data-th","2");
    document.querySelector("nav>div:nth-of-type(1)>div>div>button").classList.toggle("active");
    heb();
}
function heb(){
    document.querySelectorAll("#EVE>div").forEach(e=>{
        var t=Array.from(e.children).some(e=>"TIME"!==e.tagName&&"none"!==window.getComputedStyle(e).display);
        e.style.display=t?"":"none";});
    document.querySelectorAll("#EVE dl").forEach(e=>{
        var t=Array.from(e.querySelectorAll("dd")).every(e=>"none"===window.getComputedStyle(e).display);
        e.style.display=t?"none":"";});
    document.querySelectorAll("#EVE>h1").forEach(e=>{
        let t=e.nextElementSibling,l=!1;
        for(;t&&"H1"!==t.tagName;){"none"!==t.style.display&&(l=!0);t=t.nextElementSibling;}
        e.style.display=l?"":"none";
    });
}
heb();
const obs=new MutationObserver(heb);
obs.observe(document.getElementById("EVE"),{
    childList:!0,
    subtree:!0,
    attributes:!0,
    attributeFilter:["style"]
});
//外部链接在新页面打开
document.querySelectorAll('a[href^="http"]').forEach(link=>{
    link.setAttribute('target','_blank');
    link.setAttribute('rel','noopener noreferrer');
});
//加载文字轮播
const texts=["文本1","文本2"];
let ci=0;
const ct=document.querySelector('#loader>div>p');
ct.textContent=texts[ci];
function rotateText(){
    ci=(ci+1)%texts.length;
    ct.style.opacity='0';
    setTimeout(()=>{ct.textContent=texts[ci];ct.style.opacity='1';},200);
}
setInterval(rotateText,1000);
//加载动画
function fo(){
    const t=document.getElementById("loader"),o=performance.now();
    let a;
    requestAnimationFrame(function e(n){
        n-=o;
        a=1-(n=Math.min(n/300,1));
        t.style.opacity=a;
        n<1?requestAnimationFrame(e):t.style.display="none";
    });
}
window.addEventListener("load",function(){setTimeout(fo,300);});
window.addEventListener('DOMContentLoaded',function(){
    //菜单
    document.querySelectorAll('main').forEach(main=>{
        const mainId=main.id,mainTitle=main.querySelector('header>h1')?.textContent;
        if(mainId==='HOME')return;
        const divContainer=document.createElement('div');
        divContainer.id=`${mainId}-l`;
        divContainer.style.display='none';
        const h1Elements=main.querySelectorAll(':scope>h1');
        h1Elements.forEach(h1=>{
            const h1Id=h1.id;
            const h1Text=h1.textContent||h1Id;
            if (h1Id){
                const link=document.createElement('a');
                link.href=`#${h1Id}`;
                link.textContent=h1Text;
                divContainer.appendChild(link);
            }
        });
        const navButton=document.createElement('button');
        navButton.setAttribute('onclick',`showPage('${mainId}')`);
        navButton.textContent=mainTitle;
        document.querySelector('nav>div:nth-of-type(2)>div:nth-of-type(1)').appendChild(navButton);
        document.querySelector('nav>div:nth-of-type(2)>div:nth-of-type(2)').appendChild(divContainer);
    });
    //初始化
    const p=localStorage.getItem('p');
    p?document.getElementById('password').close():document.getElementById('password').showModal();
    const t=localStorage.getItem('t');t&&(chT(t),document.querySelector(`input[name="t"][onclick*="${t}"]`).checked=!0);
    const n=localStorage.getItem('n');n&&(chN(n),document.querySelector(`input[name="n"][onclick*="${n}"]`).checked=!0);
    const f=localStorage.getItem('f');f&&(chF(f),document.querySelector(`input[name="f"][onclick*="${f}"]`).checked=!0);
    const o=localStorage.getItem('o');
    o&&(document.querySelector('body').style.setProperty("--o",o),document.getElementById('r1').value=o);
    const b=localStorage.getItem('b');
    b&&(document.querySelector('body').style.setProperty("--bl",b+"px"),document.getElementById('r2').value=b);
    showPage('HOME');
});
//换页
window.addEventListener('DOMContentLoaded',function(){
    const mainElements=document.querySelectorAll('main');
    mainElements.forEach((currentMain,index)=>{
        const pageDiv=document.createElement('div');
        pageDiv.className='page';
        const prevButton=document.createElement('button');
        const nextButton=document.createElement('button');
        if(index>0){
            const prevMain=mainElements[index-1];
            const prevMainId=prevMain.id;
            const prevMainTitle=prevMain.querySelector('header h1')?.textContent;
            prevButton.setAttribute('onclick',`showPage("${prevMainId}")`);
            prevButton.textContent=prevMainTitle;
        }
        if(index<mainElements.length-1){
            const nextMain=mainElements[index+1];
            const nextMainId=nextMain.id;
            const nextMainTitle=nextMain.querySelector('header h1')?.textContent;
            nextButton.setAttribute('onclick',`showPage("${nextMainId}")`);
            nextButton.textContent=nextMainTitle;
        }
        pageDiv.appendChild(prevButton);
        pageDiv.appendChild(nextButton);
        currentMain.appendChild(pageDiv);
    });
});
//文本复制
document.querySelectorAll(".writing").forEach((e)=>{
    const ele=document.createElement("button");
    ele.className="fa fa-clone";
    e.prepend(ele);
    ele.onclick=function(){
        let copy=e.querySelectorAll("h1,p");
        text=Array.from(copy).map(e=>e.textContent.trim()).join('\n');
        navigator.clipboard.writeText(text).then(()=>{
            ele.className="fa fa-check";
            setTimeout(()=>{ele.className="fa fa-clone";},500);
        })
    };
});
//header目录
window.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('main').forEach(main=>{
        const header=main.querySelector('header');
        if(!header)return;
        const h1Elements=main.querySelectorAll('h1[id]');
        if(h1Elements.length===0)return;
        const toc=document.createElement('dl');
        toc.className='keywords';
        h1Elements.forEach(h1=>{
            const link=document.createElement('a');
            link.href=`#${h1.id}`;
            link.textContent=h1.textContent;
            const h2Dl=document.createElement('dl');
            let nextElement=h1.nextElementSibling;
            const h2sUnderCurrentH1=[];
            while(nextElement&&nextElement.tagName!=='H1'){
                if(nextElement.tagName==='H2'){h2sUnderCurrentH1.push(nextElement);}
                nextElement=nextElement.nextElementSibling;
            }
            h2sUnderCurrentH1.forEach(h2=>{
                const h2Text=h2.textContent;
                const h2Dd=document.createElement('dd');
                h2Dd.textContent=h2Text;
                h2Dl.appendChild(h2Dd);
                const h2Description = h2.getAttribute('data-des');
                if(h2Description){
                    const descriptions=h2Description.split(' ');
                    descriptions.forEach(desc=>{
                        if(desc.trim()){
                            const span=document.createElement('span');
                            span.textContent=desc.trim();
                            h2Dd.after(span);
                        }
                    });
                }
                const h3Dt=document.createElement('dt');
                let nextElementH2=h2.nextElementSibling;
                const h3sUnderCurrentH2=[];
                while(nextElementH2&&nextElementH2.tagName!=='H1'&&nextElementH2.tagName!=='H2'){
                    if(nextElementH2.tagName==='H3'){h3sUnderCurrentH2.push(nextElementH2);}
                    nextElementH2=nextElementH2.nextElementSibling;
                }
                h3sUnderCurrentH2.forEach(h3=>{
                    const h3Dt=document.createElement('dt'),
                          h3Dd=document.createElement('dd');
                    h3Dd.textContent=h3.textContent;
                    h3Dt.appendChild(h3Dd);
                    h2Dl.appendChild(h3Dt);
                    const h3Description=h3.getAttribute('data-des');
                    if(h3Description){
                        const descriptions=h3Description.split(' ');
                        descriptions.forEach(desc=>{
                            if(desc.trim()){
                                const span=document.createElement('span');
                                span.textContent=desc.trim();
                                h3Dd.after(span);
                            }
                        });
                    }
                });
            });
            toc.appendChild(link);
            if(h2sUnderCurrentH1.length>0){toc.appendChild(h2Dl);}
            const h1Description=h1.getAttribute('data-des');
            if(h1Description){
                const descriptions=h1Description.split(' ');
                descriptions.forEach(desc=>{
                    if(desc.trim()){
                        const span=document.createElement('span');
                        span.textContent=desc.trim();
                        h2Dl.prepend(span);
                    }
                });
            }
        });
        header.appendChild(toc);
    });
});