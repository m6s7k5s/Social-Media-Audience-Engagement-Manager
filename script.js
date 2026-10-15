const starterPosts = [
  { id: 1, title: "A little behind the scenes", subtitle: "Lifestyle · 2 days ago", icon: "✦", tone: "thumb-lilac", likes: 420, comments: 62, shares: 38, followers: 5000 },
  { id: 2, title: "Weekend photo diary", subtitle: "Photo · 4 days ago", icon: "▧", tone: "thumb-peach", likes: 310, comments: 44, shares: 26, followers: 5000 },
  { id: 3, title: "3 tips you should know", subtitle: "Carousel · 5 days ago", icon: "✎", tone: "thumb-blue", likes: 260, comments: 58, shares: 49, followers: 5000 },
  { id: 4, title: "Little moments, big memories", subtitle: "Lifestyle · 1 week ago", icon: "♡", tone: "thumb-mint", likes: 190, comments: 27, shares: 15, followers: 5000 },
  { id: 5, title: "Monday mood board", subtitle: "Inspiration · 1 week ago", icon: "☼", tone: "thumb-yellow", likes: 140, comments: 17, shares: 12, followers: 5000 }
];
let posts = loadPosts();
let engagementChart = null, mixChart = null;
const $ = (id) => document.getElementById(id);
const number = (n) => Number(n || 0).toLocaleString("en-US");
const engagement = (p) => ((p.likes + p.comments + p.shares) / Math.max(1, p.followers)) * 100;
function loadPosts(){ try { const saved = localStorage.getItem("pulse-posts"); return saved ? JSON.parse(saved) : structuredClone(starterPosts); } catch { return structuredClone(starterPosts); } }
function savePosts(){ localStorage.setItem("pulse-posts", JSON.stringify(posts)); }
function init(){
  $("today-date").textContent = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  render();
  if (typeof Chart === "undefined") { document.querySelector(".chart-wrap").innerHTML='<p class="empty-state">Charts need an internet connection to load.</p>'; return; }
  renderCharts();
}
function totals(){ return posts.reduce((a,p)=>({likes:a.likes+p.likes,comments:a.comments+p.comments,shares:a.shares+p.shares}),{likes:0,comments:0,shares:0}); }
function render(){
  const t=totals(), total=t.likes+t.comments+t.shares;
  const avg=posts.length?posts.reduce((sum,p)=>sum+engagement(p),0)/posts.length:0;
  $("total-engagement").textContent=number(total); $("total-likes").textContent=number(t.likes); $("total-comments").textContent=number(t.comments);
  $("avg-rate").textContent=avg.toFixed(1); $("rate-track-fill").style.width=Math.min(100,avg*10)+"%";
  $("engagement-post-count").textContent=`${posts.length} post${posts.length===1?"":"s"} analyzed`;
  $("mix-total").textContent=total>=1000?(total/1000).toFixed(1)+"k":number(total);
  $("mix-likes").textContent=total?Math.round(t.likes/total*100)+"%":"0%";
  $("mix-comments").textContent=total?Math.round(t.comments/total*100)+"%":"0%";
  $("mix-shares").textContent=total?Math.round(t.shares/total*100)+"%":"0%";
  $("post-count").textContent=posts.length;
  renderTable();
  const best=[...posts].sort((a,b)=>engagement(b)-engagement(a))[0];
  $("insight-title").textContent=best?`“${best.title}” is your strongest post.`:"Ready for your first post?";
  $("insight-copy").textContent=best?`It has an engagement rate of ${engagement(best).toFixed(1)}%. Compare its format and topic with your other posts to learn what your audience enjoys.`:"Add post metrics to see helpful performance insights here.";
  if(engagementChart && mixChart) updateCharts();
}
function renderTable(){
  const query=$("search-posts").value.toLowerCase(), sort=$("sort-posts").value;
  let list=posts.filter(p=>p.title.toLowerCase().includes(query));
  list.sort((a,b)=>sort==="rate"?engagement(b)-engagement(a):b[sort]-a[sort]);
  $("posts-table").innerHTML=list.length?list.map(p=>{
    const rate=engagement(p), level=rate>=8?"":rate>=4?"medium":"low";
    return `<tr><td><div class="post-cell"><div class="post-thumb ${p.tone||"thumb-lilac"}">${p.icon||"✦"}</div><div><div class="post-title">${escapeHTML(p.title)}</div><div class="post-subtitle">${escapeHTML(p.subtitle||"Custom post · Just now")}</div></div></div></td><td>${number(p.likes)}</td><td>${number(p.comments)}</td><td>${number(p.shares)}</td><td><span class="rate-value">${rate.toFixed(1)}%</span></td><td><span class="rate-badge ${level}">${rate>=8?"Excellent":rate>=4?"Good":"Growing"}</span></td></tr>`;
  }).join(""):`<tr><td colspan="6" class="empty-state">No posts match your search. Try another title or add a post.</td></tr>`;
  $("table-summary").textContent=`Showing ${list.length} of ${posts.length} post${posts.length===1?"":"s"}`;
}
function escapeHTML(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderCharts(){
  const labels=posts.map((p,i)=>p.title.length>15?p.title.slice(0,13)+"…":p.title);
  engagementChart=new Chart($("engagementChart"),{type:"bar",data:{labels,datasets:[
    {label:"Likes",data:posts.map(p=>p.likes),backgroundColor:"#8d7df6",borderRadius:5,maxBarThickness:22},
    {label:"Comments",data:posts.map(p=>p.comments),backgroundColor:"#ff9c93",borderRadius:5,maxBarThickness:22},
    {label:"Shares",data:posts.map(p=>p.shares),backgroundColor:"#60d2b6",borderRadius:5,maxBarThickness:22}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:"#24233f",padding:11,cornerRadius:8,titleFont:{family:"DM Sans"},bodyFont:{family:"DM Sans"}}},scales:{x:{grid:{display:false},border:{display:false},ticks:{color:"#a1a2b6",font:{family:"DM Sans",size:9},maxRotation:0,minRotation:0}},y:{beginAtZero:true,grid:{color:"#f0f0f6",drawTicks:false},border:{display:false},ticks:{color:"#b0b1c1",font:{family:"DM Sans",size:9},padding:8}}}}});
  const t=totals();
  mixChart=new Chart($("mixChart"),{type:"doughnut",data:{labels:["Likes","Comments","Shares"],datasets:[{data:[t.likes,t.comments,t.shares],backgroundColor:["#8d7df6","#ff9c93","#60d2b6"],borderWidth:0,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:"78%",plugins:{legend:{display:false},tooltip:{backgroundColor:"#24233f",padding:10,cornerRadius:8}}}});
}
function updateCharts(){
  engagementChart.data.labels=posts.map(p=>p.title.length>15?p.title.slice(0,13)+"…":p.title);
  engagementChart.data.datasets[0].data=posts.map(p=>p.likes);
  engagementChart.data.datasets[1].data=posts.map(p=>p.comments);
  engagementChart.data.datasets[2].data=posts.map(p=>p.shares);
  engagementChart.update();
  const t=totals(); mixChart.data.datasets[0].data=[t.likes,t.comments,t.shares]; mixChart.update();
}
function openModal(){ $("modal-backdrop").classList.add("show"); $("modal-backdrop").setAttribute("aria-hidden","false"); setTimeout(()=>$('post-form').elements.title.focus(),80); }
function closeModal(){ $("modal-backdrop").classList.remove("show"); $("modal-backdrop").setAttribute("aria-hidden","true"); $("form-error").textContent=""; }
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400);}
$("add-post-top").addEventListener("click",openModal);
$("close-modal").addEventListener("click",closeModal);
$("modal-backdrop").addEventListener("click",e=>{if(e.target===$("modal-backdrop"))closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
$("post-form").addEventListener("submit",e=>{
  e.preventDefault(); const f=new FormData(e.currentTarget);
  const title=String(f.get("title")).trim(), likes=Number(f.get("likes")), comments=Number(f.get("comments")), shares=Number(f.get("shares")), followers=Number(f.get("followers"));
  if(!title||[likes,comments,shares,followers].some(n=>!Number.isFinite(n)||n<0)||followers<1){$("form-error").textContent="Please enter a title and valid non-negative metrics. Followers must be at least 1.";return;}
  posts.unshift({id:Date.now(),title,subtitle:"Custom post · Just now",icon:"✦",tone:["thumb-lilac","thumb-peach","thumb-blue","thumb-mint","thumb-yellow"][Math.floor(Math.random()*5)],likes,comments,shares,followers});
  savePosts(); render(); closeModal(); e.currentTarget.reset(); e.currentTarget.elements.followers.value=2000; toast("Post added — dashboard updated ✓");
});
$("search-posts").addEventListener("input",renderTable);
$("sort-posts").addEventListener("change",renderTable);
$("reset-data").addEventListener("click",()=>{if(confirm("Reset the dashboard to its original sample posts?")){posts=structuredClone(starterPosts);savePosts();render();toast("Sample data restored ✓");}});
document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  const view=btn.dataset.view;
  $("crumb-title").textContent=btn.textContent.trim();
  if(view==="overview"){ $("page-title").innerHTML='Good afternoon, creator <span class="wave">✦</span>'; $("page-subtitle").textContent="Here's how your content is connecting with your audience.";window.scrollTo({top:0,behavior:"smooth"});}
  if(view==="posts"){ $("page-title").textContent="Post analytics"; $("page-subtitle").textContent="Compare content performance and find your strongest posts."; $("posts-section").scrollIntoView({behavior:"smooth",block:"start"});}
  if(view==="insights"){ $("page-title").textContent="Your insights"; $("page-subtitle").textContent="A simple read on what your engagement data is telling you."; $("insights-section").scrollIntoView({behavior:"smooth",block:"center"});}
}));
init();
