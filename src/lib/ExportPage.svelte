<script lang="ts">
  import hashjs from "hash.js";
  import {
    localSaves,
    matchList,
    metaInfo,
    teamList,
  } from "../stores/contentStore";
  import { importMode } from "../stores/booleanStore";

  //? Warum geht das wenn alle Felder privat sind; sind js Klassen einfach Objekte?
  //   $: allDataAsObject = {
  //     data: $metaInfo,
  //     teams: $teamList,
  //     matches: $matchList,
  //   };
  $: allDataAsObject = {
    data: { ...$metaInfo },
    teams: [...$teamList].map((team) => team.toObject()),
    matches: [...$matchList].map((match) => match.toObject()),
  };

  $: hash = hashjs
    .sha256()
    .update(JSON.stringify(allDataAsObject))
    .digest("hex");

  function exportFile(): void {
    // create a new Blob object representing a new file
    const file = new Blob([JSON.stringify(allDataAsObject)], {
      type: "text/plain",
    });

    // create a link element to simulate a click on the link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${allDataAsObject.data.date}_spielberichtsbogen_${allDataAsObject.data.title}.txt`;

    // simulate a click on the link to open the file dialog
    link.click();
  }

  $: multipleSaves = $localSaves.filter(
    (save, i) =>
      save.data.title === $metaInfo.title && save.data.date === $metaInfo.date
  );

  // alerts
  let showMultipleEntriesWarning = false;
  let showSaveSuccess = false;

  let saveBoth = false;
  function handleBrowserSave() {
    if (
      !$localSaves.some(
        (save, i) =>
          save.data.title === $metaInfo.title &&
          save.data.date === $metaInfo.date
      ) ||
      saveBoth
    ) {
      localSaves.update((prev) => [...prev, allDataAsObject]);
      saveBoth = false;
      showSaveSuccess = true;
      setTimeout(() => {
        showSaveSuccess = false;
      }, 4000);
    } else {
      showMultipleEntriesWarning = true;
    }
  }

  let overwriteVersion = 0;
  function handleOverwrite() {
    const tempLocalSaves = [...$localSaves];
    tempLocalSaves[overwriteVersion - 1] = allDataAsObject;
    $localSaves = tempLocalSaves;

    showMultipleEntriesWarning = false;
    saveBoth = false;
    overwriteVersion = 0;
    showSaveSuccess = true;
    setTimeout(() => {
      showSaveSuccess = false;
    }, 4000);
  }
</script>

<div>
  {#if showSaveSuccess}
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <h4 class="alert-heading">Speichern erfolgreich</h4>
      <p>
        <!-- svelte-ignore a11y-missing-attribute -->
        Schau zu
        <button class="btn btn-primary" on:click={() => ($importMode = true)}
          >Import</button
        > um alle gespeicherten Bögen zu sehen
      </p>
      <button
        type="button"
        class="btn-close"
        on:click={() => ($importMode = true)}
      />
    </div>
  {/if}
  {#if showMultipleEntriesWarning}
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <h4 class="alert-heading">
        Es gibt bereits {multipleSaves.length > 1
          ? `${multipleSaves.length} Speicherungen`
          : "eine Speicherung"} mit dem selben Titel
      </h4>
      <div class="d-flex justify-content-start">
        <div class="row g-0">
          <select
            id="versionSelect"
            class="form-select col"
            bind:value={overwriteVersion}
          >
            <option selected value={0}>Version...</option>
            {#each multipleSaves as save, i}
              <option value={i + 1}>{i + 1}</option>
            {/each}
          </select>
          <button
            id="overwriteButton"
            type="button"
            class="btn btn-warning col"
            disabled={overwriteVersion == 0}
            on:click={handleOverwrite}>Ersetzen</button
          >
        </div>

        <button
          class="btn btn-primary mx-2"
          on:click={() => {
            saveBoth = true;
            showMultipleEntriesWarning = false;
            handleBrowserSave();
          }}>Zusätzlich speichern</button
        >
        <button
          class="btn btn-secondary"
          on:click={() => (showMultipleEntriesWarning = false)}
          >Abbrechen</button
        >
      </div>
      <button
        type="button"
        class="btn-close"
        on:click={() => (showMultipleEntriesWarning = false)}
      />
    </div>
  {/if}
  <div class="d-flex justify-content-start">
    <button class="btn btn-primary" on:click={handleBrowserSave}
      >Im Browser speichern
    </button>
    <button class="btn btn-primary mx-2" on:click={() => exportFile()}
      >Als Datei speichern
    </button>

    <button
      class="btn btn-primary"
      on:click={() =>
        (window.location.href = `?val=${JSON.stringify(allDataAsObject)}`)}
      >In URL speichern
    </button>
  </div>
  <p class="my-2">
    <i class="bi bi-info-circle" /> Seite kann bei URL Export sicher verlassen werden
  </p>

  <textarea
    class="form-control my-3"
    disabled
    id="dataTextField"
    type="text"
    value={JSON.stringify(allDataAsObject)}
  />

  <label class="form-label" for="hashTextarea">Hash:</label>
  <textarea
    bind:value={hash}
    class="form-control"
    disabled
    id="hashTextarea"
    type="text"
  />
  <p class="my-2">
    <i class="bi bi-info-circle" /> Der Hash kann beim Importieren genutzt werden
    um die Daten zu validieren.
  </p>
</div>

<style>
  #versionSelect {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  #overwriteButton {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  #dataTextField {
    min-height: 400px;
  }
</style>
