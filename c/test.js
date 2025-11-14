//密码（abc）
function ep(){var e=document.querySelector("#password input").value;"YWJj"===btoa(e)?(localStorage.setItem("p","true"),document.getElementById("password").close()):document.querySelector("#password input").style.background="#f004"}
//页面切换
function showPage(e){
    const p=document.querySelectorAll('main'),
    t=document.getElementById(e),
    n=document.querySelectorAll("nav>div:nth-of-type(2)>div"),
    s=document.querySelector("nav>div:nth-of-type(1)>div:nth-of-type(2)");
    p.forEach(p=>{p.style.display="none";});
    n.forEach(n=>{n.style.display="none";});
    if(t){t.style.display="block";}
    e=="EVENT"?s.style.display="inline-block":s.style.display="none";
    document.getElementById(e+"-l").style.display="block";
}
//关闭菜单
document.addEventListener("click",function(t){var e=document.querySelector("nav>div:nth-of-type(2)"),n=document.querySelector("nav>div:nth-of-type(1) button.fa-navicon");e.classList.contains("active")&&!e.contains(t.target)&&t.target!==n&&e.classList.remove("active")}),document.querySelectorAll("nav>div:nth-of-type(2) a,nav>div:nth-of-type(2) button").forEach(t=>{t.addEventListener("click",function(){document.querySelector("nav>div:nth-of-type(2)").classList.remove("active")})});
//关闭模态框
document.getElementById("sD").addEventListener("click",function(t){var e=this.getBoundingClientRect();(t.clientX<e.left||e.right<t.clientX||t.clientY<e.top||e.bottom<t.clientY)&&this.close()});
//进度条
window.addEventListener("scroll",()=>{var e=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;document.querySelector("nav").style.setProperty("--progress",e+"%")});
//主题切换
function chT(e){document.body.setAttribute("data-t",e),localStorage.setItem("t",e);document.getElementById("th").content=getComputedStyle(document.body).getPropertyValue('--th');}
function chW(e){document.body.setAttribute("data-w",e),localStorage.setItem("w",e);}
function chN(e){document.body.setAttribute("data-n",e),localStorage.setItem("n",e);}
function chF(e){document.body.setAttribute("data-f",e),localStorage.setItem("f",e);search();}
document.getElementById('r1').addEventListener('input',function(){document.querySelector('body>#main').style.setProperty("--opacity",this.value+"%");localStorage.setItem("o",this.value);});
document.getElementById('r2').addEventListener('input',function(){document.querySelector('body>#main').style.backdropFilter="blur("+this.value+"px)";localStorage.setItem("b",this.value);});
//背景图片
let db;const request=indexedDB.open("backgroundDB",1);
function loadBackground(){const e=db.transaction(["background"],"readonly").objectStore("background").get(1);e.onsuccess=function(){e.result&&(document.body.style.backgroundImage=`url(${e.result.image})`)}}
function cbg(){var e=document.createElement("input");e.type="file",e.accept="image/*",e.onchange=function(e){var t,e=e.target.files[0];e&&((t=new FileReader).onload=function(e){db.transaction(["background"],"readwrite").objectStore("background").put({id:1,image:e.target.result}),document.body.style.backgroundImage=`url(${e.target.result})`},t.readAsDataURL(e))},e.click()}
function ubg(){db.transaction(["background"],"readwrite").objectStore("background").delete(1),document.body.style.backgroundImage=""}request.onupgradeneeded=function(e){(db=e.target.result).objectStoreNames.contains("background")||db.createObjectStore("background",{keyPath:"id"})},request.onsuccess=function(e){db=e.target.result,loadBackground()};
//替代图像
document.querySelectorAll("img").forEach(M=>{M.onerror=function(){this.src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+DQo8cGF0aCBkPSJNMzA0LjEyOCA0NTYuMTkyYzQ4LjY0IDAgODguMDY0LTM5LjQyNCA4OC4wNjQtODguMDY0cy0zOS40MjQtODguMDY0LTg4LjA2NC04OC4wNjQtODguMDY0IDM5LjQyNC04OC4wNjQgODguMDY0IDM5LjQyNCA4OC4wNjQgODguMDY0IDg4LjA2NHptMC0xMTYuMjI0YzE1LjM2IDAgMjguMTYgMTIuMjg4IDI4LjE2IDI4LjE2cy0xMi4yODggMjguMTYtMjguMTYgMjguMTYtMjguMTYtMTIuMjg4LTI4LjE2LTI4LjE2IDEyLjI4OC0yOC4xNiAyOC4xNi0yOC4xNnoiIGZpbGw9IiNjY2ZmZmZjYyIvPg0KPHBhdGggZD0iTTg4Ny4yOTYgMTU5Ljc0NEgxMzYuNzA0Qzk2Ljc2OCAxNTkuNzQ0IDY0IDE5MiA2NCAyMzIuNDQ4djU1OS4xMDRjMCAzOS45MzYgMzIuMjU2IDcyLjcwNCA3Mi43MDQgNzIuNzA0aDE5OC4xNDRMNTAwLjIyNCA2ODguNjRsLTM2LjM1Mi0yMjIuNzIgMTYyLjMwNC0xMzAuNTYtNjEuNDQgMTQzLjg3MiA5Mi42NzIgMjE0LjAxNi0xMDUuNDcyIDE3MS4wMDhoMzM1LjM2QzkyNy4yMzIgODY0LjI1NiA5NjAgODMyIDk2MCA3OTEuNTUyVjIzMi40NDhjMC0zOS45MzYtMzIuMjU2LTcyLjcwNC03Mi43MDQtNzIuNzA0em0tMTM4Ljc1MiA3MS42OHYuNTEySDg1Ny42YzE2LjM4NCAwIDMwLjIwOCAxMy4zMTIgMzAuMjA4IDMwLjIwOHYzOTkuODcyTDY3My4yOCA0MDguMDY0bDc1LjI2NC0xNzYuNjR6TTMwNC42NCA3OTIuMDY0SDE2NS44ODhjLTE2LjM4NCAwLTMwLjIwOC0xMy4zMTItMzAuMjA4LTMwLjIwOHYtOS43MjhsMTM4Ljc1Mi0xNjQuMzUyIDEwNC45NiAxMjQuNDE2LTc0Ljc1MiA3OS44NzJ6bTgxLjkyLTM1NS44NGwzNy4zNzYgMjI4Ljg2NC0uNTEyLjUxMi0xNDIuODQ4LTE2OS45ODRjLTMuMDcyLTMuNTg0LTkuMjE2LTMuNTg0LTEyLjI4OCAwTDEzNS42OCA2NTIuOFYyNjIuMTQ0YzAtMTYuMzg0IDEzLjMxMi0zMC4yMDggMzAuMjA4LTMwLjIwOGg0NzQuNjI0TDM4Ni41NiA0MzYuMjI0em01MDEuMjQ4IDMyNS42MzJjMCAxNi44OTYtMTMuMzEyIDMwLjIwOC0yOS42OTYgMzAuMjA4SDY4MC45Nmw1Ny4zNDQtOTMuMTg0LTg3LjU1Mi0yMDIuMjQgNy4xNjgtNy42OCAyMjkuODg4IDI3Mi44OTZ6IiBmaWxsPSIjY2NmZmZmY2MiLz4NCjwvc3ZnPg=="}});
//搜索
function search(){var e=document.querySelector("nav input").value.trim(),t=document.getElementById("EVENT");if(t&&"none"!==window.getComputedStyle(t).display){if(t=t.querySelectorAll("p, dd"),e){const i=new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");t.forEach(e=>{e.hasAttribute("data-original")||e.setAttribute("data-original",e.innerHTML);var t=e.getAttribute("data-original");i.test(t.replace(/<[^>]*>/g,""))?(e.style.display="",e.innerHTML=t.replace(/([^<]*)(<[^>]*>)?/g,(e,t,a)=>t?t.replace(i,e=>`<mark>${e}</mark>`)+(a||""):a||"")):e.style.display="none",i.lastIndex=0})}else t.forEach(e=>{e.style.display="",e.hasAttribute("data-original")&&(e.innerHTML=e.getAttribute("data-original"),e.removeAttribute("data-original"))});heb()}}
function heb(){document.querySelectorAll("#EVENT>div").forEach(e=>{var t=Array.from(e.children).some(e=>"TIME"!==e.tagName&&"none"!==window.getComputedStyle(e).display);e.style.display=t?"":"none"}),document.querySelectorAll("#EVENT dl").forEach(e=>{var t=Array.from(e.querySelectorAll("dd")).every(e=>"none"===window.getComputedStyle(e).display);e.style.display=t?"none":""}),document.querySelectorAll("#EVENT>h1").forEach(e=>{let t=e.nextElementSibling,l=!1;for(;t&&"H1"!==t.tagName;){if("none"!==t.style.display){l=!0;break}t=t.nextElementSibling}e.style.display=l?"":"none"})}heb();const observer=new MutationObserver(heb);observer.observe(document.getElementById("EVENT"),{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style"]});
//外部链接在新页面打开
document.querySelectorAll('a[href^="http"]').forEach(link=>{link.setAttribute('target','_blank');});
//加载动画
function smoothFadeOut(){const n=document.getElementById("loader");let o=1;const a=performance.now();requestAnimationFrame(function t(e){e-=a,e=Math.min(e/300,1);o=1-e,n.style.opacity=o,e<1?requestAnimationFrame(t):n.style.display="none"})}
window.addEventListener("load",function(){setTimeout(smoothFadeOut,300)});
//初始化
window.addEventListener('DOMContentLoaded',function(){
    const p=localStorage.getItem('p');p?document.getElementById('password').close():document.getElementById('password').showModal();
    const t=localStorage.getItem('t');t?chT(t):(window.matchMedia("(prefers-color-scheme:dark)").matches?chT('d'):chT('l'));
    const w=localStorage.getItem('w');w&&chW(w);
    const n=localStorage.getItem('n');n&&chN(n);
    const f=localStorage.getItem('f');f&&chF(f);
    const o=localStorage.getItem('o');
    if(o){document.querySelector('body>#main').style.setProperty("--opacity",o+"%");document.getElementById('r1').value=o;}
    const b=localStorage.getItem('b');
    if(b){document.querySelector('body>#main').style.backdropFilter="blur("+b+"px)";document.getElementById('r2').value=b;}
    const s=["t","w","n","f"];
    s.forEach(e=>{var t=localStorage.getItem(e);t&&(e=document.querySelector(`input[name="${e}"][onclick*="${t}"]`))&&(e.checked=!0)});
    showPage(document.querySelector('body>#main'));
});