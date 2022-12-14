<script lang="ts">
  import Accordion from "./lib/Accordion.svelte";
  import ExportModal from "./lib/ExportModal.svelte";
  import ImportModal from "./lib/ImportModal.svelte";
  import Print from "./lib/Print.svelte";
  import Match from "./model/Match";
  import { onMount } from "svelte";
  import Team from "./model/Team";

  import { metaInfo, teamList, matchList } from "./stores/store";
  import {
    initialMatchList,
    initialMetaInfo,
    initialTeamList,
  } from "./stores/initialValues";

  let editMode = true;
  let resetMode = false;

  onMount(async () => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("val")) {
      const jsonData = url.searchParams.get("val");
      try {
        importData(jsonData);
      } catch (err) {
        console.error(err);
      }
    }
  });

  function importData(jsonString: string): void {
    editMode = false;

    const fileContent = JSON.parse(jsonString);

    metaInfo.set(fileContent.data);

    $teamList = [];
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

      $teamList = [...$teamList, newTeam];
    });

    $matchList = [];
    fileContent.matches.forEach((match) => {
      const newMatch = new Match(match.team1Id, match.team2Id, match.referee);
      newMatch.Id = match.id;
      newMatch.HalfTimeScoreTeam1 = match.halfTimeScoreTeam1;
      newMatch.HalfTimeScoreTeam2 = match.halfTimeScoreTeam2;
      newMatch.FinalScoreTeam1 = match.finalScoreTeam1;
      newMatch.FinalScoreTeam2 = match.finalScoreTeam2;

      $matchList = [...$matchList, newMatch];
    });
  }

  function resetData(): void {
    $metaInfo = initialMetaInfo;
    $teamList = initialTeamList;
    $matchList = initialMatchList;
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
  <div class="container py-4">
    <Accordion bind:editMode />
    <div class="mt-3">
      <ImportModal on:import={(e) => importData(e.detail.data)} />
      <ExportModal />
      <button class="btn btn-primary" on:click={() => window.print()}>
        Drucken
      </button>
      <div class="mt-2">
        <i class="bi bi-info-circle" /> Wähle als Drucker "Microsoft Print to PDF"
        um das Dokument als PDF zu speichern.
      </div>
      <hr />
      <div class="mt-2">
        {#if resetMode}
          <button class="btn btn-danger" on:click={resetData}>
            Zurücksetzen!
          </button>
        {/if}
        <button
          class="btn btn-warning"
          on:click={() => (resetMode = !resetMode)}
        >
          {resetMode ? "Doch nicht" : "Zurücksetzen"}
        </button>
        {#if resetMode}
          <div class="mt-2">
            <i class="bi bi-question-circle" /> Alles exportiert was du behalten
            willst?
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>

<Print />

<style>
</style>
