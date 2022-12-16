<script lang="ts">
  import { fly } from "svelte/transition";
  import {
    exportMode,
    importMode,
    menuMode,
    menuRight,
    resetMode,
    teamEditMode,
  } from "../stores/booleanStore";
  import { matchList, metaInfo, teamList } from "../stores/contentStore";
  import {
    initialMatchList,
    initialMetaInfo,
    initialTeamList,
  } from "../stores/initialValues";

  function resetData(): void {
    //? Warum geht das nicht?
    // $metaInfo = { ...initialMetaInfo };
    $metaInfo = {
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
    $teamList = [...initialTeamList];
    $matchList = [...initialMatchList];

    $resetMode = false;
    $teamEditMode = true;
  }
</script>

<div
  class="ofc bg-dark container py-4 px-4 text-light"
  style={$menuRight ? "right:0" : "left:0"}
  transition:fly={{ x: $menuRight ? 1000 : -1000, duration: 200 }}
>
  <div class="d-flex justify-content-between align-items-center">
    <button class="btn fs-4" on:click={() => ($menuRight = !$menuRight)}>
      <i class="bi bi-arrow-left-right text-light" />
    </button>
    <button
      class={`btn ${$menuRight ? "order-last pe-0" : "order-first ps-0"}`}
      on:click={() => ($menuMode = false)}
    >
      <h1>
        <i class="bi bi-list text-light" />
      </h1>
    </button>
  </div>

  <button
    class="btn btn-primary w-100 mb-2"
    on:click={() => {
      $menuMode = false;
      $importMode = false;
      $exportMode = false;
    }}
    >Spielberichtsbogen
  </button>
  <hr />
  <button
    class="btn btn-primary w-100"
    on:click={() => {
      $menuMode = false;
      $importMode = true;
      $exportMode = false;
    }}
    >Importieren
  </button>
  <button
    class="btn btn-primary w-100 my-2"
    on:click={() => {
      $menuMode = false;
      $importMode = false;
      $exportMode = true;
    }}
    >Speichern
  </button>
  <button class="btn btn-secondary w-100" on:click={() => window.print()}>
    Drucken
  </button>
  <div class="mt-2">
    <i class="bi bi-info-circle" /> Wähle als Drucker "Microsoft Print to PDF" um
    das Dokument als PDF zu speichern.
  </div>
  <hr />
  <div class="d-flex justify-content-start mt-2">
    {#if $resetMode}
      <button class="btn btn-danger me-2" on:click={resetData}>
        Zurücksetzen!
      </button>
    {/if}
    <button class="btn btn-warning" on:click={() => ($resetMode = !$resetMode)}>
      {$resetMode ? "Doch nicht" : "Zurücksetzen"}
    </button>
  </div>
  {#if $resetMode}
    <div class="mt-2">
      <i class="bi bi-question-circle" /> Alles exportiert was du behalten willst?
    </div>
  {/if}
  <div id="signature">
    <div>
      <i class="bi bi-chat-right-heart" />
      <span class="ms-1">Made by Thomas K.</span>
    </div>
    <div class="d-flex justify-content-start">
      <a href="https://github.com/Peybro/spielberichtsbogen"
        ><i class="bi bi-github" /></a
      >
      <span class="ms-2">v1.0.7</span>
    </div>
  </div>
</div>

<style>
  .ofc {
    position: fixed;
    z-index: 100;
    height: 100vh;
    width: 300px;
  }

  #signature {
    position: fixed;
    bottom: 2rem;
  }
</style>
