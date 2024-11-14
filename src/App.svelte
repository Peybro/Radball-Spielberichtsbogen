<script lang="ts">
  import Accordion from "./lib/Accordion.svelte";
  import ExportModal from "./lib/ExportPage.svelte";
  import ImportModal from "./lib/ImportPage.svelte";
  import Print from "./lib/Print.svelte";
  import Match from "./model/Match";
  import { onMount } from "svelte";
  import Team from "./model/Team";

  import {
    mainMode,
    exportMode,
    importMode,
    bigTableMode,
    menuMode,
    teamEditMode,
  } from "./stores/booleanStore";
  import {
    matchList,
    metaInfo,
    teamList,
    bigTableLiga,
  } from "./stores/contentStore";
  import Offcanvas from "./lib/Offcanvas.svelte";
  import Navigation from "./lib/Navigation.svelte";
  import BigTable from "./lib/BigTable.svelte";
  import ShareButton from "./lib/ShareButton.svelte";

  onMount(async () => {
    $menuMode = window.innerWidth >= 1920;

    const url = new URL(window.location.href);
    if (url.searchParams.has("liga")) {
      const liga = url.searchParams.get("liga");
      $bigTableLiga = liga;
      $bigTableMode = true;
    }
    if (url.searchParams.has("val")) {
      const jsonData = url.searchParams.get("val");
      try {
        importData(jsonData);
        $teamEditMode = false;
      } catch (err) {
        // TODO: Banner
        console.error(err);
      }
    } else {
      // TODO: evtl LocalStorage einspielen
    }
  });

  function importData(jsonString: string): void {
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
</script>

<svelte:window
  on:beforeunload={(event) => {
    event.preventDefault();
    event.returnValue = "";
    return "[Dieser Text wird nicht angezeigt] Sicher neu laden/verlassen?";
  }}
/>

<main>
  {#if $menuMode}
    <Offcanvas />
  {/if}
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex justify-content-start">
        {#if $importMode || $exportMode || $bigTableMode}
          <button
            class="btn ps-0"
            on:click={() => {
              $mainMode = true;
            }}
          >
            <h2>
              <i class="bi bi-x" />
            </h2>
          </button>
        {/if}
        <h1>
          {$mainMode
            ? "Spielberichtsbogen"
            : $importMode
            ? "Daten importieren"
            : $exportMode
            ? "Daten exportieren"
            : "Tabelle"}
        </h1>
      </div>

      <div>
        <ShareButton />

        <button class="btn pe-0" on:click={() => ($menuMode = !$menuMode)}>
          <h1>
            <i class="bi bi-list" />
          </h1>
        </button>
      </div>
    </div>

    {#if $mainMode}
      <Accordion />
    {:else if $importMode}
      <ImportModal on:import={(e) => importData(e.detail.data)} />
    {:else if $exportMode}
      <ExportModal />
    {:else if $bigTableMode}
      <BigTable />
    {/if}
  </div>
</main>

<Print />

<style>
</style>
