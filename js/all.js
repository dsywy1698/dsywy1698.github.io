function loading() {
var loading=document.getElementById("loading");
var word=document.getElementById("div");
loading.style.display="none";
word.style.display="block";
color.style.background_color="block";
}

mybutton = document.getElementById("goTop");
function goTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}