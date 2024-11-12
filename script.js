let today = new Date();
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0');
let day = String(today.getDate()).padStart(2, '0');
let formattedDate = year + month + day;

function generateApiUrl(type, league) {
    return `https://site.api.espn.com/apis/site/v2/sports/${type}/${league}/scoreboard?dates=${formattedDate}`;
}

async function fetchData(apiEndpoint, league, containerId) {
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        processFixtures(data, league, containerId);
    } catch (error) {
        console.error(`Failed to fetch data for ${league}: ${error}`);
    }
}

function createEventHtml(homeTeam, awayTeam, leagueAbbreviation, match_URL, estTimeStr) {
    return `


      <ul class="list-group">
      <li onclick="window.open('${match_URL}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>${leagueAbbreviation}</strong> ${homeTeam.team.displayName} vs ${awayTeam.team.displayName}  </li>                 
     </ul>`;
}

function processFixtures(data, league, containerId) {
    const today = new Date();
    const events = data.events;
    const leagueAbbreviation = data.leagues[0].abbreviation;
    const container = document.querySelector(`#${containerId}`);
    if (!container) {
        console.error(`Container with id ${containerId} not found`);
        return;
    }
    container.innerHTML = ''; // Clear previous events

    let matchesFound = false;

    for (const event of events) {
        if (event.status.type.description !== "Postponed") {
            const eventDate = new Date(event.date);
            const estTimeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (eventDate >= today || event.status.type.state === "in" || event.status.type.description === "Halftime" || event.status.type.description === "Full Time") {
                const homeTeam = event.competitions[0].competitors[0];
                const awayTeam = event.competitions[0].competitors[1];
                const eventId = event.id;
                const match_URL = `https://www.daddylivehd.info/p/livess.html#${homeTeam.team.shortDisplayName} vs ${awayTeam.team.shortDisplayName}`;

                if (event.status.type.state === "pre") {
                    let eventHtml = createEventHtml(homeTeam, awayTeam, leagueAbbreviation, match_URL, estTimeStr);
                    eventHtml += `</div></div>`;
                    const teamContainer = document.createElement('div');
                    teamContainer.classList.add('event'); // Add class for easy filtering
                    teamContainer.innerHTML = eventHtml;
                    container.appendChild(teamContainer);
                } else if (event.status.type.state === "in" || event.status.type.description === "Halftime") {
                    container.innerHTML += ` <ul class="list-group">
      <li onclick="window.open('${match_URL}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>${leagueAbbreviation}</strong> ${homeTeam.team.displayName} vs ${awayTeam.team.displayName} <strong style='color:red;'>LIVE NOW!</strong>  </li>                 
     </ul> 
                        `;
                } else if (event.status.type.state === "post") {
                    const homeTeamScore = homeTeam.score;
                    const awayTeamScore = awayTeam.score;
                 
                    container.innerHTML += `<ul class="list-group">
      <li onclick="window.open('${match_URL}' , '_blank')" class="list-group-item"> <strong style='color:red;'>FT!</strong>  | <strong>${leagueAbbreviation}</strong> ${homeTeam.team.displayName} <strong>${homeTeamScore}</strong> vs <strong>${awayTeamScore}</strong> ${awayTeam.team.displayName}  </li>                 
     </ul> `;
                }

                matchesFound = true;
            }
        }
    }

    if (!matchesFound) {
        container.style.display = "none";
    }
}

// Fetch data for each league
const leagues = [
    { id: 'UEFAChampionsLeague', name: 'UEFA.CHAMPIONS', type: 'soccer' },
    { id: 'UEFAEuropaLeague', name: 'UEFA.EUROPA', type: 'soccer' },
    { id: 'UEFAEuropaConferenceLeague', name: 'UEFA.EUROPA.CONF', type: 'soccer' },
    { id: 'EnglishPremierLeague', name: 'ENG.1', type: 'soccer' },
    { id: 'EnglishFACup', name: 'ENG.FA', type: 'soccer' },
    { id: 'EnglishCarabaoCup', name: 'ENG.LEAGUE_CUP', type: 'soccer' },
    { id: 'SpanishLaLiga', name: 'ESP.1', type: 'soccer' },
    { id: 'SpanishCopadelRey', name: 'ESP.COPA_DEL_REY', type: 'soccer' },
    { id: 'GermanBundesliga', name: 'GER.1', type: 'soccer' },
    { id: 'MLS', name: 'USA.1', type: 'soccer' },
    { id: 'ConcacafChampionsLeague', name: 'CONCACAF.CHAMPIONS', type: 'soccer' },
    { id: 'ItalianSerieA', name: 'ITA.1', type: 'soccer' },
    { id: 'FrenchLigue1', name: 'FRA.1', type: 'soccer' },
    { id: 'CoupedeFrance', name: 'FRA.COUPE_DE_FRANCE', type: 'soccer' },
    { id: 'MexicanLigaBBVAMX', name: 'MEX.1', type: 'soccer' },
    { id: 'EnglishLeagueChampionship', name: 'ENG.2', type: 'soccer' },
    { id: 'CoppaItalia', name: 'ITA.COPPA_ITALIA', type: 'soccer' },
    { id: 'SaudiKingsCup', name: 'KSA.KINGS.CUP', type: 'soccer' },
    { id: 'ScottishPremiership', name: 'SCO.1', type: 'soccer' },
    { id: 'ScottishCup', name: 'SCO.TENNENTS', type: 'soccer' },
    { id: 'LeaguesCup', name: 'CONCACAF.LEAGUES.CUP', type: 'soccer' },
    { id: 'MexicanLigadeExpansiónMX', name: 'MEX.2', type: 'soccer' },
    { id: 'MexicanCopaMX', name: 'MEX.COPA_MX', type: 'soccer' },
    { id: 'AustralianALeagueMen', name: 'AUS.1', type: 'soccer' },
    { id: 'CONMEBOLLibertadores', name: 'CONMEBOL.LIBERTADORES', type: 'soccer' },
    { id: 'TurkishSuperLig', name: 'TUR.1', type: 'soccer' },
    { id: 'InternationalFriendly', name: 'FIFA.FRIENDLY', type: 'soccer' },
    { id: 'FIFAWorldCup', name: 'FIFA.WORLD', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingCONMEBOL', name: 'FIFA.WORLDQ.CONMEBOL', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingConcacaf', name: 'FIFA.WORLDQ.CONCACAF', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingUEFA', name: 'FIFA.WORLDQ.UEFA', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingCAF', name: 'FIFA.WORLDQ.CAF', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingAFC', name: 'FIFA.WORLDQ.AFC', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingOFC', name: 'FIFA.WORLDQ.OFC', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingAFCCONMEBOLPlayoff', name: 'FIFA.WORLDQ.AFC.CONMEBOL', type: 'soccer' },
    { id: 'FIFAWorldCupQualifyingConcacafOFCPlayoff', name: 'FIFA.WORLDQ.CONCACAF.OFC', type: 'soccer' },
    { id: 'FIFAClubWorldCup', name: 'FIFA.CWC', type: 'soccer' },
    { id: 'ConcacafGoldCup', name: 'CONCACAF.GOLD', type: 'soccer' },
    { id: 'ConcacafGoldCupQualifying', name: 'CONCACAF.GOLD_QUAL', type: 'soccer' },
    { id: 'ConcacafNationsLeague', name: 'CONCACAF.NATIONS.LEAGUE', type: 'soccer' },
    { id: 'ConcacafNationsLeagueQualifying', name: 'CONCACAF.NATIONS.LEAGUE_QUAL', type: 'soccer' },
    { id: 'ConcacafCup', name: 'CONCACAF.CONFEDERATIONS_PLAYOFF', type: 'soccer' },
    { id: 'UEFAEuropeanChampionshipQualifying', name: 'UEFA.EUROPA_QUAL', type: 'soccer' },
    { id: 'UEFAEuropeanChampionship', name: 'UEFA.EURO', type: 'soccer' },
    { id: 'UEFANationsLeague', name: 'UEFA.NATIONS', type: 'soccer' },
    { id: 'CONMEBOLUEFACupofChampions', name: 'GLOBAL.FINALISSIMA', type: 'soccer' },
    { id: 'CopaAmérica', name: 'CONMEBOL.AMERICA', type: 'soccer' },
    { id: 'AFCAsianCup', name: 'AFC.ASIAN.CUP', type: 'soccer' },
    { id: 'AFCAsianCupQualifiers', name: 'AFC.CUPQ', type: 'soccer' },
    { id: 'AfricanNationsChampionship', name: 'CAF.CHAMPIONSHIP', type: 'soccer' },
    { id: 'AfricaCupofNations', name: 'CAF.NATIONS', type: 'soccer' },
    { id: 'AfricaCupofNationsQualifying', name: 'CAF.NATIONS_QUAL', type: 'soccer' },
    { id: 'AfricanNationsChampionshipQualifying', name: 'CAF.CHAMPIONSHIP_QUAL', type: 'soccer' },
    { id: 'WAFUCupofNations', name: 'WAFU.NATIONS', type: 'soccer' },
    { id: 'FIFAConfederationsCup', name: 'FIFA.CONFEDERATIONS', type: 'soccer' },
    { id: 'NonFIFAFriendly', name: 'NONFIFA', type: 'soccer' },
    { id: 'ScottishLeagueCup', name: 'SCO.CIS', type: 'soccer' },
    { id: 'SpanishLALIGA2', name: 'ESP.2', type: 'soccer' },
    { id: 'German2Bundesliga', name: 'GER.2', type: 'soccer' },
    { id: 'SwissSuperLeague', name: 'SUI.1', type: 'soccer' },
    { id: 'InternationalChampionsCup', name: 'GLOBAL.CHAMPS_CUP', type: 'soccer' },
    { id: 'NCAAMensSoccer', name: 'USA.NCAA.M.1', type: 'soccer' },
    { id: 'UEFAChampionsLeagueQualifying', name: 'UEFA.CHAMPIONS_QUAL', type: 'soccer' },
    { id: 'UEFAEuropaLeagueQualifying', name: 'UEFA.EUROPA_QUAL', type: 'soccer' },
    { id: 'UEFAEuropaConferenceLeagueQualifying', name: 'UEFA.EUROPA.CONF_QUAL', type: 'soccer' },
    { id: 'CONMEBOLUEFAClubChallenge', name: 'GLOBAL.CLUB_CHALLENGE', type: 'soccer' },
    { id: 'UEFASuperCup', name: 'UEFA.SUPER_CUP', type: 'soccer' },
    { id: 'SpanishSupercopa', name: 'ESP.SUPER_CUP', type: 'soccer' },
    { id: 'FrenchTropheedesChampions', name: 'FRA.SUPER_CUP', type: 'soccer' },
    { id: 'EnglishFACommunityShield', name: 'ENG.CHARITY', type: 'soccer' },
    { id: 'ItalianSupercoppa', name: 'ITA.SUPER_CUP', type: 'soccer' },
    { id: 'GermanDFLSupercup', name: 'GER.SUPER_CUP', type: 'soccer' },
    { id: 'AudiCup', name: 'GER.AUDI_CUP', type: 'soccer' },
    { id: 'DutchJohanCruyffShield', name: 'NED.SUPERCUP', type: 'soccer' },
    { id: 'ClubFriendly', name: 'CLUB.FRIENDLY', type: 'soccer' },
    { id: 'EmiratesCup', name: 'FRIENDLY.EMIRATES_CUP', type: 'soccer' },
    { id: 'MensOlympicTournament', name: 'FIFA.OLYMPICS', type: 'soccer' },
    { id: 'EnglishEFLTrophy', name: 'ENG.TROPHY', type: 'soccer' },
    { id: 'NBA', name: 'nba', type: 'basketball' },
    { id: 'MLB', name: 'mlb', type: 'baseball' },
    { id: 'NHL', name: 'nhl', type: 'hockey' },
    { id: 'NFL', name: 'nfl', type: 'football' },
// Add more leagues as needed
// Add more leagues as needed
];

for (const league of leagues) {
    const apiUrl = generateApiUrl(league.type, league.name);
    fetchData(apiUrl, league.name, league.id);
}




//  F1
const API_URLF1 = `https://site.api.espn.com/apis/site/v2/sports/racing/f1/scoreboard`;


async function getf1fixture() {
  const response = await fetch(`${API_URLF1}`);
  const data = await response.json();
  const events = data.events;
  console.log(events);
  let matchesFound = false;

  for (const event of events) {
   
      const nameofevent = event.shortName;
    const circuitfullname = event.circuit.fullName;
      const competitions = event.competitions;

      for (const competition of competitions) {
        if (competition.status.type.state !== "post") {
                  const eventDate = new Date(competition.date);
        const estTimeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const eventDayOfWeek = eventDate.getDay();
        const startTime = new Date(competition.date);
        const currentTime = new Date();

        const formula_URL = `https://live.crackstreamss.online#${nameofevent}`;
        if (competition.status.type.state === "pre") {
          const container = document.querySelector('#formula1');
          const teamContainer = document.createElement('div');

          teamContainer.innerHTML = `

           <ul class="list-group">
      <li onclick="window.open('${formula_URL}' , '_blank')" class="list-group-item"> <td id='timetd' width='1%'><div id='time'></div></td> | <strong>FORMULA 1</strong> ${nameofevent}</li>                 
     </ul>
`;

          // Countdown logic
          const countdownElement = teamContainer.querySelector('#time');
          const countdownDate = eventDate.getTime();

          function updateCountdown() {
            const currentTime = new Date().getTime();
            const distance = countdownDate - currentTime;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            if (distance < 0) {
              clearInterval(countdownInterval);
              countdownElement.textContent = "Event Started!";
            }
          }

          updateCountdown();
          const countdownInterval = setInterval(updateCountdown, 1000);

          container.appendChild(teamContainer);
          matchesFound = true;
        } else if (competition.status.type.state === "in" || (competition.status.type.description === "Halftime")) {
          const container = document.querySelector('#formula1');
          const teamContainer = document.createElement('div');

          teamContainer.innerHTML = `
           <ul class="list-group">
      <li onclick="window.open('${formula_URL}' , '_blank')" class="list-group-item"> <strong style="color:red;">LIVE NOW!</strong>  | <strong>FORMULA 1</strong> ${nameofevent}</li>                 
     </ul>
        `;

          container.appendChild(teamContainer);
          matchesFound = true;
        } else if (competition.status.type.state === "post") {
          const container = document.querySelector('#formula1');
          const teamContainer = document.createElement('div');

          teamContainer.innerHTML = `
          
          <ul class="list-group">
      <li onclick="window.open('${formula_URL}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>${leagueAbbreviation}</strong>${nameofevent} <strong style='color:red;'>FINISHED!</strong></li>                 
     </ul>`;

          container.appendChild(teamContainer);
          matchesFound = true;
        }


         } 
      }
  
  }

  if (!matchesFound) {
    document.getElementById("formula1").style.display = "none";
  }
}

getf1fixture();


// ufc //

const API_mma = `https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard?dates=${formattedDate}`;
async function getmmafixture() {
  const response = await fetch(`${API_mma}`);
  const data = await response.json();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const league = data.leagues;
  const Slug = league[0].slug;
  const ufclogo = league[0].logos[0].href;
  const events = data.events;
  let matchesFound = false;
  for (const event of events) {
      if (event.status.type.description !== "Postponed"){
        const fightnight = event.name;
        const detail = event.status.type.detail;
        const eventId = event.id;
        const eventDate = new Date(event.date);
        const estTimeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });   
        const eventDayOfWeek = eventDate.getDay();
        const startTime = new Date(event.date);
        const currentTime = new Date();

        console.log(events);
  const mma_URL = `https://www.daddylivehd.info/p/livess.html#${fightnight}`;
  if (event.status.type.state === "pre" ){
     const container = document.querySelector('#UFC');
    const teamContainer = document.createElement('div');
       
        teamContainer.innerHTML = `

 <ul class="list-group">
      <li onclick="window.open('${mma_URL}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>UFC</strong> ${fightnight}</li>                 
     </ul>
`;
    container.appendChild(teamContainer); 
      
  }
if (event.status.type.state === "in" || (event.status.type.description === "Halftime")) {
        const container = document.querySelector('#UFC');
    const teamContainer = document.createElement('div');
       
        teamContainer.innerHTML = `
 <ul class="list-group">
      <li onclick="window.open('${mma_URL}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>UFC</strong> ${fightnight} <strong style="color:red;">LIVE NOW!</strong></li>                 
     </ul>
`;
    container.appendChild(teamContainer);
   
}
// لو الماتش خلص // 
 if (event.status.type.state === "post") {
    
    const container = document.querySelector('#UFC');
    const teamContainer = document.createElement('div');
       
        teamContainer.innerHTML = `

         <ul class="list-group">
      <li onclick="window.open('${mma_URL}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>UFC</strong> ${fightnight} <strong style="color:red;">FINISHED!</strong></li>                 
     </ul>
       `;
    container.appendChild(teamContainer);
   
     
 }
 
matchesFound = true;
 
}
}
 //   IF NO MATCHES TODAY SHOW THIS CODE 
 if (!matchesFound) {document.getElementById("UFC").style.display = "none";}
}
getmmafixture()

// -- end mma fixtuers -- //



// Golf //
const apigolfPGA = `https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?dates=${formattedDate}`;
const apigolfLPGA = `https://site.api.espn.com/apis/site/v2/sports/golf/lpga/scoreboard?dates=${formattedDate}`;
const apigolfChampionsTour = `https://site.api.espn.com/apis/site/v2/sports/golf/champions-tour/scoreboard?dates=${formattedDate}`;
const apigolfLIV = `https://site.api.espn.com/apis/site/v2/sports/golf/liv/scoreboard?dates=${formattedDate}`;

async function fetchGolfData(apiUrl) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

async function processGolfData(data, containerId) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const league = data.leagues;
  const events = data.events;
  let matchesFound = false;

  for (const event of events) {
    if (event.status.type.description !== "Postponed") {
      const eventname = event.name;
      const detail = event.status.type.detail;
      const eventId = event.id;
      const eventDate = new Date(event.date);
      const estTimeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });   
      const startTime = new Date(event.date);
      const currentTime = new Date();

      const golfurl = `https://www.daddylivehd.info/p/livess.html#${eventname}`;
      const container = document.querySelector(`#${containerId}`);
      const teamContainer = document.createElement('div');
      let innerHTMLContent = `


       <ul class="list-group">
      <li onclick="window.open('${golfurl}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>${league[0].abbreviation}</strong> $${eventname}  </li>                 
     </ul>`;

      if (event.status.type.state === "pre") {
        teamContainer.innerHTML = innerHTMLContent;
      } else if (event.status.type.state === "in" || event.status.type.description === "Halftime") {
        innerHTMLContent = innerHTMLContent.replace(estTimeStr, '<strong style="color:red;">LIVE NOW!</strong>');
        teamContainer.innerHTML = innerHTMLContent;
      } else if (event.status.type.state === "post") {
        innerHTMLContent = innerHTMLContent.replace(estTimeStr, '<strong style="color:red;">FINISHED!</strong>');
        teamContainer.innerHTML = innerHTMLContent;
      }

      container.appendChild(teamContainer);
      matchesFound = true;
    }
  }

  if (!matchesFound) {
    document.getElementById(containerId).style.display = "none";
  }
}

async function getGolfFixtures() {
  const pgaData = await fetchGolfData(apigolfPGA);
  await processGolfData(pgaData, 'GOLF_PGA');

  const lpgaData = await fetchGolfData(apigolfLPGA);
  await processGolfData(lpgaData, 'GOLF_LPGA');

  const championsTourData = await fetchGolfData(apigolfChampionsTour);
  await processGolfData(championsTourData, 'GOLF_CHAMPIONS_TOUR');

  const livData = await fetchGolfData(apigolfLIV);
  await processGolfData(livData, 'GOLF_LIV');
}

getGolfFixtures();
// end of golf // 



// indy racing //

const indyapi = `https://site.api.espn.com/apis/site/v2/sports/racing/irl/scoreboard?dates=${formattedDate}`;
async function getindy() {
  const response = await fetch(`${indyapi}`);
  const data = await response.json();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const league = data.leagues;
  const Slug = league[0].slug;
  const indylogo = league[0].logos[0].href;
  const events = data.events;
  let matchesFound = false;
  for (const event of events) {
      if (event.status.type.description !== "Postponed"){
        const indyrace = event.name;
        const detail = event.status.type.detail;
        const eventId = event.id;
        const eventDate = new Date(event.date);
        const estTimeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });   
        const eventDayOfWeek = eventDate.getDay();
        const startTime = new Date(event.date);
        const currentTime = new Date();

        console.log(events);
  const indyurl = `https://www.daddylivehd.info/p/livess.html#${indyrace}`;
  if (event.status.type.state === "pre" ){
     const container = document.querySelector('#indy');
    const teamContainer = document.createElement('div');
       
        teamContainer.innerHTML = `

         <ul class="list-group">
      <li onclick="window.open('${indyurl}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>IndyCar</strong> ${indyrace} </li>                 
     </ul>
`;
    container.appendChild(teamContainer); 
      
  }
if (event.status.type.state === "in" || (event.status.type.description === "Halftime")) {
        const container = document.querySelector('#indy');
    const teamContainer = document.createElement('div');
       
        teamContainer.innerHTML = `
        
         <ul class="list-group">
      <li onclick="window.open('${indyurl}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>IndyCar</strong> ${indyrace} <strong style="color:red;">LIVE NOW!</strong></li>                  
     </ul> 
       `;
    container.appendChild(teamContainer);
   
}
// لو الماتش خلص // 
 if (event.status.type.state === "post") {
    
    const container = document.querySelector('#indy');
    const teamContainer = document.createElement('div');
       
        teamContainer.innerHTML = `<ul class="list-group">
      <li onclick="window.open('${indyurl}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>IndyCar</strong> ${indyrace} <strong style='color:red;'>FINISHED!</strong></li>                  
     </ul> `;
    container.appendChild(teamContainer);
   
     
 }
 
matchesFound = true;
 
}
}
 //   IF NO MATCHES TODAY SHOW THIS CODE 
 if (!matchesFound) {document.getElementById("indy").style.display = "none";}
}
getindy()


// -- end indy fixtuers -- //



// ufc new version//

const ufcmma = `https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard`;
const pflmma = `https://site.api.espn.com/apis/site/v2/sports/mma/pfl/scoreboard`;

async function getMMAFixtures() {
  const [ufcResponse, pflResponse] = await Promise.all([fetch(ufcmma), fetch(pflmma)]);
  const ufcData = await ufcResponse.json();
  const pflData = await pflResponse.json();

  const leagues = [...ufcData.leagues, ...pflData.leagues];
  const events = [...ufcData.events, ...pflData.events];
  const container = document.querySelector('#ufcmma');

  let matchesFound = false;

  for (const event of events) {
    if (event.status.type.description !== "Postponed") {
      const league = leagues.find(l => l.id === event.leagueId);
      const leagueName = league ? league.shortName : 'MMA';
      const fightnight = event.name;
      const eventDate = new Date(event.date);
      const estTimeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const eventday = event.date.split('T')[0];
      const mma_URL = `https://www.daddylivehd.info/p/livess.html#${fightnight}`;

      let statusHTML = '';
      if (event.status.type.state === "pre") {
        statusHTML = `${estTimeStr} - ${eventday}`;
      } else if (event.status.type.state === "in" || event.status.type.description === "Halftime") {
        statusHTML = `<span class="live">LIVE NOW!</span>`;
      } else if (event.status.type.state === "post") {
        statusHTML = `<span class="live">FINISHED!</span>`;
      }

      const teamContainer = document.createElement('div');
      teamContainer.innerHTML = `
      <ul class="list-group">
      <li onclick="window.open('${mma_URL}' , '_blank')" class="list-group-item"> ${statusHTML} | <strong>${leagueName}</strong> ${fightnight} </li>                 
     </ul>
`;
      container.appendChild(teamContainer);
      matchesFound = true;
    }
  }

  if (!matchesFound) {
    document.getElementById("ufcmma").style.display = "none";
  }
}

getMMAFixtures();
// end of new mma fixtures 


// SCORES365 // 
const fetchSportsData = async (apiUrl, containerId) => {
    let matchesFound = false;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const Sports = data.games;
    const leagueName = data.competitions[0].name;
    const leagueSlug = data.competitions[0].nameForURL;
    const container = document.querySelector(`#${containerId}`);
    container.innerHTML = ''; // Clear the container before adding today's fixtures

    // Render all scheduled and live games
    for (const sport of Sports) {
        if (sport.statusText !== "Ended" && sport.statusText !== "WalkOver" && sport.statusText !== "Postponed" && sport.statusText !== "Final" && sport.statusText !== "Final (OT)" && sport.statusText !== "After Penalties" && sport.statusText !== "Postponed" && sport.statusText !== "Final (SO)" && sport.statusText !== "Final (Ex)" && sport.statusText !== "Abandoned") {
            const gameDate = new Date(sport.startTime);
            if (sport.statusText === "Scheduled") {
                if (
                    gameDate.getDate() === today.getDate() &&
                    gameDate.getMonth() === today.getMonth() &&
                    gameDate.getFullYear() === today.getFullYear()
                ) {
                    const estTimeStr = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    matchesFound = true;
                    const homeTeam = sport.homeCompetitor.name;
                    const awayTeam = sport.awayCompetitor.name;
                    const HLogo = sport.homeCompetitor.id;
                    const ALogo = sport.awayCompetitor.id;
                    const link = `https://www.daddylivehd.info/p/livess.html#${homeTeam} vs ${awayTeam}`;

                    const teamContainer = document.createElement('div');
                    teamContainer.innerHTML = `

                    
      <ul class="list-group">
      <li onclick="window.open('${link}' , '_blank')" class="list-group-item"> ${estTimeStr}  | <strong>${leagueName}</strong> ${homeTeam} vs ${awayTeam}  </li>                 
     </ul>
            `;

                    container.appendChild(teamContainer);
                }
            }
            // If the game is live
            if (sport.statusText !== "Scheduled" && sport.statusText !== "Ended") {
                matchesFound = true;
                const homeTeam = sport.homeCompetitor.name;
                const awayTeam = sport.awayCompetitor.name;
                const HLogo = sport.homeCompetitor.id;
                const ALogo = sport.awayCompetitor.id;
                const hometeamscore = sport.homeCompetitor.score;
                const awayteamscore = sport.awayCompetitor.score;
                const minu = sport.gameTimeDisplay;
                const link = `https://www.daddylivehd.info/p/livess.html#${homeTeam} vs ${awayTeam}`;

                const teamContainer = document.createElement('div');
                teamContainer.innerHTML = `<ul class="list-group">
      <li onclick="window.open('${link}' , '_blank')" class="list-group-item"> <strong style='color:red;'>LIVE!</strong>   | <strong>${leagueName}</strong> ${homeTeam} vs ${awayTeam}</li>                 
     </ul>
           `;

                container.appendChild(teamContainer);
            }

            // If the game is ended
            if (sport.statusText === "Ended" || sport.statusText === "Final" || sport.statusText === "Final (OT)" || sport.statusText === "After Penalties") {
                const homeTeam = sport.homeCompetitor.name;
                const awayTeam = sport.awayCompetitor.name;
                const HLogo = sport.homeCompetitor.id;
                const ALogo = sport.awayCompetitor.id;
                const hometeamscore = sport.homeCompetitor.score;
                const awayteamscore = sport.awayCompetitor.score;
                const minu = sport.gameTimeDisplay;
                const link = `https://www.daddylivehd.info/p/livess.html#${homeTeam} vs ${awayTeam}`;

                const teamContainer = document.createElement('div');
                teamContainer.innerHTML = `
                <ul class="list-group">
      <li onclick="window.open('${link}' , '_blank')" class="list-group-item"> <strong style='color:red;'>FINISHED!</strong> | <strong>${leagueName}</strong>  ${homeTeam} <strong>${hometeamscore}</strong> : <strong>${awayTeam}</strong> ${awayteamscore}  </li>                 
     </ul> 
          `;

                container.appendChild(teamContainer);
            }
        }
    }

    if (!matchesFound) {
        container.style.display = 'none';
    } else {
        container.style.display = ''; // Ensure the container is visible if matches are found
    }
};

// Example usage for multiple leagues
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=624', 'cafleague');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=7', 'premierleague');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=103', 'nba');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=6064', 'rio');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=366', 'nhl');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=11', 'laliga');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=35', 'ligue1');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=102', 'Libertadores');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=25', 'budesliga');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=17', 'seriaA');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=572', 'championsleague');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=573', 'europaleague');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=13', 'delray');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=104', 'mls');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=649', 'saudi');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=8', 'facup');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=141', 'ligamx');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=623', 'afc');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=438', 'mlb');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=275', 'rolandgarroswomen');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=209', 'rolandgarrosmen');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=215', 'wimbledonmen');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=230', 'usopenmen');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=183', 'australianopenmen');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=106', 'wnba');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=216', 'stuttgart');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=7842', 'valencia');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=213', 'hertogenbosch');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=240', 'madridopen');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=6316', 'euro2024');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=595', 'copa-america');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=5100', 'cfl');
fetchSportsData('https://webws.365scores.com/web/games/current/?appTypeId=5&competitions=388', 'nito-atp');
