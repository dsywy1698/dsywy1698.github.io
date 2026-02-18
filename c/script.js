//密码（abc）
function ep(){
    var e=document.querySelector("#password input").value;
    "123"===e?(localStorage.setItem("p","true"),document.getElementById("password").close()):document.querySelector("#password input").style.background="#f004";
}
//页面切换
function showPage(e){
    var l=document.querySelectorAll("main"),
        n=document.getElementById(e),
        o=document.querySelectorAll("nav>div:nth-of-type(2)>div"),
        t=document.querySelector("nav>div:nth-of-type(1)>div>div");
    l.forEach(e=>{e.style.display="none"});
    window.scrollTo({top:0,behavior:'auto'});
    o.forEach(e=>{e.style.display="none"});
    n&&(n.style.display="block");
    t.style.display="EVENT"==e?"block":"none";
    document.getElementById(e+"-l").style.display="block";
}
//关闭菜单
document.addEventListener("click",function(t){
    var e=document.querySelector("nav>div:nth-of-type(2)"),
        n=document.querySelector("nav>div:nth-of-type(1) button.fa-navicon");
    e.classList.contains("active")&&!e.contains(t.target)&&t.target!==n&&e.classList.remove("active");
});
document.querySelectorAll("nav>div:nth-of-type(2) a,nav>div:nth-of-type(2) button").forEach(t=>{
    t.addEventListener("click",function(){
        document.querySelector("nav>div:nth-of-type(2)").classList.remove("active");
    })
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
document.querySelectorAll("img").forEach(m=>{m.onerror=function(){this.src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyB2aWV3Qm94PScwIDAgMzAwIDIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgZmlsbD0nIzhkZDQnLz48L3N2Zz4="}});
//日志页逻辑
function search(){
    var e=document.querySelector("nav input").value.trim(),
        t=document.getElementById("EVENT");
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
    const d=document.querySelector("nav>div:nth-of-type(1)>div:nth-of-type(2)>button").classList.contains('active');
    d?document.body.setAttribute("data-th","1"):document.body.setAttribute("data-th","2");
    document.querySelector("nav>div:nth-of-type(1)>div:nth-of-type(2)>button").classList.toggle("active");
    heb();
}
function heb(){
    document.querySelectorAll("#EVENT>div").forEach(e=>{
        var t=Array.from(e.children).some(e=>"TIME"!==e.tagName&&"none"!==window.getComputedStyle(e).display);
        e.style.display=t?"":"none";});
    document.querySelectorAll("#EVENT dl").forEach(e=>{
        var t=Array.from(e.querySelectorAll("dd")).every(e=>"none"===window.getComputedStyle(e).display);
        e.style.display=t?"none":"";});
    document.querySelectorAll("#EVENT>h1").forEach(e=>{
        let t=e.nextElementSibling,l=!1;
        for(;t&&"H1"!==t.tagName;){"none"!==t.style.display&&(l=!0);t=t.nextElementSibling;}
        e.style.display=l?"":"none";
    });
}
heb();
const obs=new MutationObserver(heb);
obs.observe(document.getElementById("EVENT"),{
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
//初始化
window.addEventListener('DOMContentLoaded',function(){
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