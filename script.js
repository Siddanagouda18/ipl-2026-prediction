const matches = [

{date:"March 28", team1:"RCB", team2:"SRH", time:"7:30 PM", venue:"Bengaluru", winner:"RCB", prob:70},

{date:"March 29", team1:"MI", team2:"KKR", time:"7:30 PM", venue:"Mumbai", winner:"KKR", prob:65},

{date:"March 30", team1:"RR", team2:"CSK", time:"7:30 PM", venue:"Guwahati", winner:"CSK", prob:60},

{date:"March 31", team1:"PBKS", team2:"GT", time:"7:30 PM", venue:"Mullanpur", winner:"GT", prob:62},

{date:"April 1", team1:"LSG", team2:"DC", time:"7:30 PM", venue:"Lucknow", winner:"DC", prob:58},

{date:"April 2", team1:"KKR", team2:"SRH", time:"7:30 PM", venue:"Kolkata", winner:"KKR", prob:66},

{date:"April 3", team1:"CSK", team2:"PBKS", time:"7:30 PM", venue:"Chennai", winner:"PBKS", prob:55},

{date:"April 4", team1:"DC", team2:"MI", time:"3:30 PM", venue:"Delhi", winner:"MI", prob:63},

{date:"April 4", team1:"GT", team2:"RR", time:"7:30 PM", venue:"Ahmedabad", winner:"RR", prob:57},

{date:"April 5", team1:"SRH", team2:"LSG", time:"3:30 PM", venue:"Hyderabad", winner:"LSG", prob:60},

{date:"April 5", team1:"RCB", team2:"CSK", time:"7:30 PM", venue:"Bengaluru", winner:"RCB", prob:72},

{date:"April 6", team1:"KKR", team2:"PBKS", time:"7:30 PM", venue:"Kolkata", winner:"PBKS", prob:54},

{date:"April 7", team1:"RR", team2:"MI", time:"7:30 PM", venue:"Guwahati", winner:"MI", prob:61},

{date:"April 8", team1:"DC", team2:"GT", time:"7:30 PM", venue:"Delhi", winner:"GT", prob:64},

{date:"April 9", team1:"KKR", team2:"LSG", time:"7:30 PM", venue:"Kolkata", winner:"LSG", prob:56},

{date:"April 10", team1:"RR", team2:"RCB", time:"7:30 PM", venue:"Guwahati", winner:"RCB", prob:68},

{date:"April 11", team1:"PBKS", team2:"SRH", time:"3:30 PM", venue:"Mullanpur", winner:"SRH", prob:59},

{date:"April 11", team1:"CSK", team2:"DC", time:"7:30 PM", venue:"Chennai", winner:"CSK", prob:60},

// ✅ FINAL UPDATED MATCH
{date:"April 12", team1:"MI", team2:"RCB", time:"7:30 PM", venue:"Mumbai", winner:"RCB", prob:70}

];


// ================= VOTING SYSTEM =================

function getVotes(){
let votes = localStorage.getItem("votes");
return votes ? JSON.parse(votes) : {};
}

function saveVotes(v){
localStorage.setItem("votes", JSON.stringify(v));
}

function vote(team){
let votes = getVotes();
votes[team] = (votes[team] || 0) + 1;
saveVotes(votes);
renderMatches();
updateLeaderboard();
}


// ================= RENDER MATCHES =================

function renderMatches(){

const container = document.getElementById("matches");
container.innerHTML = "";

let votes = getVotes();
let search = document.getElementById("search").value.toLowerCase();

matches.forEach((m,index)=>{

if(!m.team1.toLowerCase().includes(search) &&
   !m.team2.toLowerCase().includes(search)) return;

let v1 = votes[index+"_"+m.team1] || 0;
let v2 = votes[index+"_"+m.team2] || 0;

let total = v1 + v2;

let p1 = total ? Math.round(v1*100/total) : 0;
let p2 = total ? Math.round(v2*100/total) : 0;

let card = document.createElement("div");
card.className = "match-card";

card.innerHTML = `
<h3>${m.date}</h3>

<div class="team">
<img src="images/${m.team1.toLowerCase()}.png">
${m.team1}
</div>

<button onclick="vote('${index}_${m.team1}')">Vote ${m.team1}</button>
${v1} votes (${p1}%)

<br><br>

<div class="team">
<img src="images/${m.team2.toLowerCase()}.png">
${m.team2}
</div>

<button onclick="vote('${index}_${m.team2}')">Vote ${m.team2}</button>
${v2} votes (${p2}%)

<div class="bar">
<div style="width:${p1}%"></div>
<div style="width:${p2}%"></div>
</div>

<p>${m.time} | ${m.venue}</p>

<p style="color:lightgreen;">
<b>Prediction:</b> ${m.winner} (${m.prob}%) 
${m.winner === "RCB" ? "🔥" : ""}
</p>
`;

container.appendChild(card);

});
}


// ================= LEADERBOARD =================

function updateLeaderboard(){

let votes = getVotes();
let teamVotes = {};

for(let key in votes){
let team = key.split("_")[1];
teamVotes[team] = (teamVotes[team] || 0) + votes[key];
}

let best = "";
let max = 0;

for(let t in teamVotes){
if(teamVotes[t] > max){
max = teamVotes[t];
best = t;
}
}

document.getElementById("leaderboard").innerHTML =
best
? `🔥 Most Supported Team: <b>${best}</b> (${max} votes)`
: "No votes yet";

}


// ================= DARK MODE =================

function toggleDark(){
document.body.classList.toggle("dark");
}

document.getElementById("search").addEventListener("input", renderMatches);
document.getElementById("darkBtn").addEventListener("click", toggleDark);


// ================= INITIAL LOAD =================

renderMatches();
updateLeaderboard();