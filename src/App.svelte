<script lang="ts">
  import Accordion from "./lib/Accordion.svelte";
  import ExportModal from "./lib/ExportModal.svelte";
  import ImportModal from "./lib/ImportModal.svelte";
  import Print from "./lib/Print.svelte";
  import Match from "./model/Match";
  import { onMount } from "svelte";
  import Team from "./model/Team";
  import { registerSW } from "virtual:pwa-register";
  import { slide } from "svelte/transition";

  const { offlineReady, needRefresh, updateServiceWorker } = registerSW({
    onRegistered(swr) {
      console.log(`SW registered: ${swr}`);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onOfflineReady() {
      console.log("SW ready for offline");
      setTimeout(() => close(), 5000);
    },
  });

  function close() {
    $offlineReady.set(false);
    $needRefresh.set(false);
  }
  $: toast = $offlineReady || $needRefresh;

  import { metaInfo, teamList, matchList } from "./stores/store";

  let editMode = true;

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
</script>

<svelte:window
  on:beforeunload={(event) => {
    event.preventDefault();
    event.returnValue = "";
    return "[Dieser Text wird nicht angezeigt] Sicher neu laden/verlassen?";
  }}
/>

{#if toast}
  <div
    class="fixed right-0 bottom-0 m-4 p-6 rounded shadow z-[100] bg-white border-blue-500 border max-w-sm"
    in:slide
    out:slide
    role="alert"
  >
    <div class="mb-4">
      <span>&#127881;</span>
      {#if $offlineReady}
        <span> This site is ready to use offline. </span>
      {:else}
        <span>
          A new version of this site is available! Click the reload button to
          update.
        </span>
      {/if}
    </div>
    {#if $needRefresh}
      <button class="button m-0" on:click={() => updateServiceWorker(true)}>
        Reload
      </button>
    {/if}
    <button class="button m-0" on:click={close}> Close </button>
  </div>
{/if}

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
    </div>
  </div>
</main>

<Print />

<style>
</style>
