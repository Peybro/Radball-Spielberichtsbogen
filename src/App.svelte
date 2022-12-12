<script lang="ts">
  import Accordion from "./lib/Accordion.svelte";
  import Match from "./model/Match";
  import Team from "./model/Team";

  let data = {
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    chiefReferee: "",
    referee: "",
    duration: "2x7",
    notPlaying: "",
  };
  let teams = [];
  let list = [];

  function createMatches() {
    list = combinations(teams);
  }

  function combinations(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        result.push(new Match(arr[i].Id, arr[j].Id));
      }
    }
    return result;
  }

  function removeMatch(matchId: string) {
    console.log(matchId);

    list = list.filter((match) => match.Id !== matchId);
  }

  function importData() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".txt";

      input.addEventListener("change", function (event) {
        const file = (<HTMLInputElement>event.target).files[0];
        if (file) {
          const reader = new FileReader();
          reader.readAsText(file, "UTF-8");
          reader.onload = function (event) {
            const fileContent = JSON.parse(event.target.result);

            data = fileContent.data;

            teams = [];
            fileContent.teams.forEach((team) => {
              const newTeam = new Team(
                team.name,
                {
                  firstName: team.player1.firstName,
                  lastName: team.player1.lastName,
                  licence: team.player1.licence,
                },
                {
                  firstName: team.player2.firstName,
                  lastName: team.player2.lastName,
                  licence: team.player2.licence,
                },
                {
                  firstName: team.player3.firstName,
                  lastName: team.player3.lastName,
                  licence: team.player3.licence,
                }
              );
              newTeam.Id = team.id;

              teams = [...teams, newTeam];
            });

            list = [];
            fileContent.matches.forEach((match) => {
              const newMatch = new Match(
                match.team1Id,
                match.team2Id,
                match.referee
              );
              newMatch.Id = match.id;
              newMatch.HalfTimeScoreTeam1 = match.halfTimeScoreTeam1;
              newMatch.HalfTimeScoreTeam2 = match.halfTimeScoreTeam2;
              newMatch.FinalScoreTeam1 = match.finalScoreTeam1;
              newMatch.FinalScoreTeam2 = match.finalScoreTeam2;

              list = [...list, newMatch];
            });
          };
          reader.onerror = function (event) {
            console.error("Failed to read file.");
          };
        }
      });

      input.click();
    } else {
      console.error("The File APIs are not fully supported in this browser.");
    }
  }

  function exportData() {
    const teamsObject = [...teams].map((team) => team.toObject());
    const matchesObject = [...list].map((match) => match.toObject());

    // create a new Blob object representing a new file
    const file = new Blob(
      [JSON.stringify({ data, teams: teamsObject, matches: matchesObject })],
      { type: "text/plain" }
    );

    // create a link element to simulate a click on the link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${data.date}_spielberichtsbogen_${data.title}.txt`;

    // simulate a click on the link to open the file dialog
    link.click();
  }

  function formatDate(date: string) {
    const tempDate = new Date(date);
    return `${
      ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][tempDate.getDay()]
    }, ${tempDate.toLocaleDateString()}`;
  }

  function getTeamNameById(id: string) {
    return teams.find((team) => team.Id === id).Name;
  }
</script>

<svelte:window
  on:beforeunload={(event) => {
    event.preventDefault();
    event.returnValue = "";
    return "[Dieser Text wird nicht angezeigt] Sicher neu laden/verlassen?";
  }}
/>

<div class="print">
  <h1 id="title">{data.title}</h1>
  <div id="info">
    <p>Spieltag am {formatDate(data.date)}, {data.startTime} Uhr</p>
    <ul id="location">
      {#each data.location.split("\n") as line}
        <li>{line}</li>
      {/each}
    </ul>
    <p>
      <span id="chief">Chief-Kommisär: {data.chiefReferee}</span><span
        id="referees">Kommisär: {data.referee}</span
      >
    </p>
    <p id="duration">Spielzeit: {data.duration} Minuten</p>
    <div id="notPlaying" class="row">
      <div class="col-2">Spielfrei:</div>
      <div class="col-2">
        <ul>
          {#each data.notPlaying.split("\n") as line}
            <li>{line}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
  <section>
    <table>
      {#each list as match, i}
        <tr>
          <td>{i + 1}.</td>
          <td>{getTeamNameById(match.Team1Id)}</td>
          <td>-</td>
          <td>{getTeamNameById(match.Team2Id)}</td>
          <td>( {match.HalfTimeScoreTeam1} : {match.HalfTimeScoreTeam2} )</td>
          <td>{match.HalfTimeScoreTeam1} : {match.HalfTimeScoreTeam2}</td>
          <td>{match.Referee}</td>
        </tr>
      {/each}
    </table>
  </section>
</div>

<main>
  <div class="container my-4">
    <Accordion
      bind:data
      bind:teams
      bind:list
      on:createMatches={() => createMatches()}
      on:removeMatch={(e) => removeMatch(e.detail.matchId)}
    />
    <div class="mt-3">
      <button class="btn btn-primary" on:click={() => importData()}
        >Import</button
      >
      <button class="btn btn-primary" on:click={() => exportData()}
        >Export</button
      >
    </div>
  </div>
</main>

<style>
</style>
