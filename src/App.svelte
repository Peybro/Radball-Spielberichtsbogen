<script lang="ts">
  import Accordion from "./lib/Accordion.svelte";
  import ExportModal from "./lib/ExportModal.svelte";
  import ImportModal from "./lib/ImportModal.svelte";
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
    duration: "2 x 7",
    notPlaying: "",
  };
  let teams: Team[] = [];
  let list: Match[] = [];

  const url = new URL(window.location.href);
  if (url.searchParams.has("val")) {
    const jsonData = url.searchParams.get("val");
    try {
      importData(jsonData);
    } catch (err) {
      console.error(err);
    }
  }

  function createMatches(): void {
    list = combinations(teams);
  }

  function combinations(arr: Team[]): Match[] {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        result.push(new Match(arr[i].Id, arr[j].Id));
      }
    }
    return result;
  }

  function removeMatch(matchId: string): void {
    list = list.filter((match) => match.Id !== matchId);
  }

  function importData(jsonString: string): void {
    editMode = false;

    const fileContent = JSON.parse(jsonString);
    
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

  $: dataAsObject = {
    data,
    teams: [...teams].map((team) => team.toObject()),
    matches: [...list].map((match) => match.toObject()),
  };
</script>

<svelte:window
  on:beforeunload={(event) => {
    event.preventDefault();
    event.returnValue = "";
    return "[Dieser Text wird nicht angezeigt] Sicher neu laden/verlassen?";
  }}
/>

<main>
  <div class="container py-4">
    <Accordion
      bind:data
      bind:teams
      bind:list
      bind:editMode
      on:createMatches={() => createMatches()}
      on:removeMatch={(e) => removeMatch(e.detail.matchId)}
    />
    <div class="mt-3">
      <ImportModal on:import={(e) => importData(e.detail.data)} />
      <ExportModal data={dataAsObject} />
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
