function loading() {
document.getElementById("loading").style.display="none";
document.getElementById("div").style.display="block";
}

mybutton = document.getElementById("goTop");
function goTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}