(()=>{var y=(t,e)=>()=>(e||(e={exports:{}},t(e.exports,e)),e.exports);var i=y((p,d)=>{d.exports=["fruits","vegetables"]});var w=i(),a=w,c=[],f="abcdefghijklmnopqrstuvwxyz",n=0,o={autoGuess:!0};window.onload=function(){let t=document.getElementById("category-picker");for(let e in a){let r=a[e],s=document.createElement("option");s.value=r;let m=document.createTextNode(r);s.appendChild(m),t.appendChild(s)}document.getElementById("auto-guess").checked=o.autoGuess,document.getElementById("guess").addEventListener("keydown",()=>{event.key==="Enter"&&u()}),document.getElementById("guess").addEventListener("input",()=>{o.autoGuess&&u()}),document.getElementById("auto-guess").addEventListener("click",()=>{o.autoGuess=!o.autoGuess})};window.download_category=async function(t){try{return await(await fetch(t+".json")).json()}catch(e){return console.error("Error fetching JSON:",e),null}};window.load=function(t){currentLetter=0,n=0,download_category(t).then(e=>{c=e,console.log(e)}),document.getElementById("category").innerText=t,document.getElementById("category-backdrop").classList.toggle("hidden")};function E(){currentLetter=0,n=0}function l(){window.alert("win"+n),E()}function g(t){if(currentLetter===25)l();else for(currentLetter++,document.getElementById("guess").value="";c[currentLetter].length===0;)currentLetter++,currentLetter>25&&l();t&&n++,document.getElementById("letter").innerHTML=f[currentLetter]}window.increment=g;function u(t){let e=document.getElementById("guess").value.toLowerCase();c[currentLetter].indexOf(e)!==-1&&g(!0)}window.makeGuess=u;})();
//# sourceMappingURL=main.js.map
