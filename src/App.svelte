<script lang="ts">
  import Accordion from "./lib/Accordion.svelte";
  import Print from "./lib/Print.svelte";
  import Match from "./model/Match";
  import Team from "./model/Team";

  let editMode = true;

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

  const url = new URL(window.location.href);
  if (url.searchParams.has("val")) {
    const jsonData = url.searchParams.get("val");
    try {
      importData(jsonData);
    } catch (err) {
      console.error(err);
    }
  }

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

  function importData(jsonData) {
    editMode = false;

    const fileContent = JSON.parse(jsonData);

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
      const newMatch = new Match(match.team1Id, match.team2Id, match.referee);
      newMatch.Id = match.id;
      newMatch.HalfTimeScoreTeam1 = match.halfTimeScoreTeam1;
      newMatch.HalfTimeScoreTeam2 = match.halfTimeScoreTeam2;
      newMatch.FinalScoreTeam1 = match.finalScoreTeam1;
      newMatch.FinalScoreTeam2 = match.finalScoreTeam2;

      list = [...list, newMatch];
    });
  }

  function importFile() {
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
            importData(event.target.result);
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
</script>

<svelte:window
  on:beforeunload={(event) => {
    event.preventDefault();
    event.returnValue = "";
    return "[Dieser Text wird nicht angezeigt] Sicher neu laden/verlassen?";
  }}
/>

<main>
  <div class="container my-4">
    <Accordion
      bind:data
      bind:teams
      bind:list
      bind:editMode
      on:createMatches={() => createMatches()}
      on:removeMatch={(e) => removeMatch(e.detail.matchId)}
    />
    <div class="mt-3">
      <button class="btn btn-primary" on:click={() => importFile()}
        >Import</button
      >
      <button class="btn btn-primary" on:click={() => exportData()}
        >Export</button
      >
      <button class="btn btn-primary" on:click={() => window.print()}>
        Drucken
      </button>
      <div class="mt-2">
        <i class="bi bi-info-circle" /> Wähle als Drucker "Microsoft Print to PDF"
        um das Dokument als PDF zu speichern.
      </div>
    </div>
  </div>
</main>

<Print {data} {teams} {list} />

<style>
</style>
