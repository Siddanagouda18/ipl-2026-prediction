const matches = [

{date:"March 28", team1:"RCB", team2:"SRH", time:"7:30 PM", venue:"Bengaluru"},
{date:"March 29", team1:"MI", team2:"KKR", time:"7:30 PM", venue:"Mumbai"},
{date:"March 30", team1:"RR", team2:"CSK", time:"7:30 PM", venue:"Guwahati"},
{date:"March 31", team1:"PBKS", team2:"GT", time:"7:30 PM", venue:"Mullanpur"},
{date:"April 1", team1:"LSG", team2:"DC", time:"7:30 PM", venue:"Lucknow"},
{date:"April 2", team1:"KKR", team2:"SRH", time:"7:30 PM", venue:"Kolkata"},
{date:"April 3", team1:"CSK", team2:"PBKS", time:"7:30 PM", venue:"Chennai"},
{date:"April 4", team1:"DC", team2:"MI", time:"3:30 PM", venue:"Delhi"},
{date:"April 4", team1:"GT", team2:"RR", time:"7:30 PM", venue:"Ahmedabad"},
{date:"April 5", team1:"SRH", team2:"LSG", time:"3:30 PM", venue:"Hyderabad"},
{date:"April 5", team1:"RCB", team2:"CSK", time:"7:30 PM", venue:"Bengaluru"},
{date:"April 6", team1:"KKR", team2:"PBKS", time:"7:30 PM", venue:"Kolkata"},
{date:"April 7", team1:"RR", team2:"MI", time:"7:30 PM", venue:"Guwahati"},
{date:"April 8", team1:"DC", team2:"GT", time:"7:30 PM", venue:"Delhi"},
{date:"April 9", team1:"KKR", team2:"LSG", time:"7:30 PM", venue:"Kolkata"},
{date:"April 10", team1:"RR", team2:"RCB", time:"7:30 PM", venue:"Guwahati"},
{date:"April 11", team1:"PBKS", team2:"SRH", time:"3:30 PM", venue:"Mullanpur"},
{date:"April 11", team1:"CSK", team2:"DC", time:"7:30 PM", venue:"Chennai"},
{date:"April 12", team1:"LSG", team2:"GT", time:"3:30 PM", venue:"Lucknow"},
{date:"April 12", team1:"MI", team2:"RCB", time:"7:30 PM", venue:"Mumbai"}

];



function predict(team1,team2){

let prob1;
let prob2;

if(team1==="RCB"){
prob1=Math.floor(Math.random()*16)+60; 
prob2=100-prob1;
}

else if(team2==="RCB"){
prob2=Math.floor(Math.random()*16)+60;
prob1=100-prob2;
}

else{
prob1=Math.floor(Math.random()*50)+50;
prob2=100-prob1;
}

return prob1>prob2
? {winner:team1,prob:prob1}
: {winner:team2,prob:prob2};
}

function getVotes(){
let votes=localStorage.getItem("votes");
return votes?JSON.parse(votes):{};
}

function saveVotes(v){
localStorage.setItem("votes",JSON.stringify(v));
}

function vote(team){

let votes=getVotes();

votes[team]=(votes[team]||0)+1;

saveVotes(votes);

renderMatches();
updateLeaderboard();

}

function renderMatches(){

const container=document.getElementById("matches");

container.innerHTML="";

let votes=getVotes();

let search=document.getElementById("search").value.toLowerCase();

matches.forEach((m,index)=>{

if(!m.team1.toLowerCase().includes(search) &&
!m.team2.toLowerCase().includes(search)) return;

let result=predict(m.team1,m.team2);

let v1=votes[index+"_"+m.team1]||0;
let v2=votes[index+"_"+m.team2]||0;

let total=v1+v2;

let p1=total?Math.round(v1*100/total):0;
let p2=total?Math.round(v2*100/total):0;

let card=document.createElement("div");

card.className="match-card";

card.innerHTML=`

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
<div style="width:${p1}%;background:red"></div>
<div style="width:${p2}%;background:blue"></div>
</div>

<p>${m.time} | ${m.venue}</p>

<p><b>Prediction:</b> ${result.winner} (${result.prob}%)</p>

`;

container.appendChild(card);

});

}

function updateLeaderboard(){

let votes=getVotes();

let teamVotes={};

for(let key in votes){

let team=key.split("_")[1];

teamVotes[team]=(teamVotes[team]||0)+votes[key];

}

let best="";
let max=0;

for(let t in teamVotes){

if(teamVotes[t]>max){
max=teamVotes[t];
best=t;
}

}

document.getElementById("leaderboard").innerHTML=
best
? `🔥 Most Supported Team: <b>${best}</b> (${max} votes)`
: "No votes yet";

}

function toggleDark(){
document.body.classList.toggle("dark");
}

document.getElementById("search").addEventListener("input",renderMatches);

renderMatches();
updateLeaderboard();