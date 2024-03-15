<script lang="ts">
  import hashjs from "hash.js";
  import { createEventDispatcher } from "svelte";
  import { localSaves, matchToImport } from "../stores/contentStore";
  import { mainMode, menuMode } from "../stores/booleanStore";
  import Navigation from "./Navigation.svelte";

  const dispatch = createEventDispatcher();

  $: hash = hashjs.sha256().update($matchToImport).digest("hex") || "";

  let userHash: string;
  let hashValid: boolean;
  let showInValidData = false;
  let editSavesMode = false;

  function importFile(): void {
    hashValid = undefined;

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
            $matchToImport = <string>event.target.result;
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

  function handleDataImport() {
    try {
      dispatch("import", { data: $matchToImport });
      $menuMode = false;
      $mainMode = true;
    } catch (err) {
      showInValidData = true;
      setTimeout(() => {
        showInValidData = false;
      }, 4000);
    }
  }

  function validateHash(): void {
    hashValid = hash === userHash;
  }

  let isDragging = false;
  let startIndex: number;
  let currentIndex: number;

  function handleDragStart(event: any, index: number): void {
    if (!editSavesMode) return;

    isDragging = true;
    startIndex = index;
    currentIndex = index;

    event.dataTransfer.setData("text/plain", index.toString());
  }

  function handleDragMove(event: any, index: number): void {
    if (!editSavesMode) return;
    if (!isDragging) return;

    currentIndex = index;

    event.preventDefault();
  }

  function handleDragEnd(): void {
    if (!isDragging) return;

    isDragging = false;

    // swap
    // const temp = list[startIndex];
    // list[startIndex] = list[currentIndex];
    // list[currentIndex] = temp;

    // insert at index
    if (startIndex !== currentIndex) {
      let draggedItem = $localSaves[startIndex];
      $localSaves = [
        ...$localSaves.slice(0, startIndex),
        ...$localSaves.slice(startIndex + 1),
      ];
      $localSaves = [
        ...$localSaves.slice(0, currentIndex),
        draggedItem,
        ...$localSaves.slice(currentIndex),
      ];
    }
  }
</script>

<div>
  {#if showInValidData}
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <h4 class="alert-heading">Import nicht möglich</h4>
      <p>Die Daten scheinen fehlerhaft zu sein.</p>
      <button
        type="button"
        class="btn-close"
        on:click={() => {
          showInValidData = false;
        }}
      />
    </div>
  {/if}

  <div class="accordion mb-2" id="localSavesAccordion">
    <!-- <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsePresaves"
        >
          Fertige Sicherungen
        </button>
      </h2>
      <div
        id="collapsePresaves"
        class="accordion-collapse collapse"
        data-bs-parent="#localSavesAccordion"
      >
        <div class="accordion-body">
          <Navigation />
        </div>
      </div>
    </div> -->

    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseLokalSaves"
        >
          Sicherungen in lokalem Speicher
        </button>
      </h2>
      <div
        id="collapseLokalSaves"
        class="accordion-collapse collapse show"
        data-bs-parent="#localSavesAccordion"
      >
        <div class="accordion-body">
          <button
            class="btn btn-secondary mb-1"
            on:click={() => (editSavesMode = !editSavesMode)}
          >
            {#if !editSavesMode}<i class="bi bi-pencil-square" />{/if}
            {editSavesMode ? "Fertig bearbeitet" : "bearbeiten"}
          </button>
          <hr />
          <ul class="list-group mb-3" id="localSavesList">
            {#each $localSaves as save, i}
              <li
                class="list-group-item d-flex justify-content-between align-items-start align-items-center"
                type="button"
                on:click={() => ($matchToImport = JSON.stringify(save))}
                on:keydown={() => ($matchToImport = JSON.stringify(save))}
                draggable={editSavesMode && $localSaves.length > 1}
                class:dragging={isDragging && currentIndex === i}
                on:touchstart={(e) => handleDragStart(e, i)}
                on:touchmove={(e) => handleDragMove(e, i)}
                on:touchend={handleDragEnd}
                on:dragstart={(e) => handleDragStart(e, i)}
                on:dragover={(e) => handleDragMove(e, i)}
                on:dragend={handleDragEnd}
              >
                {#if editSavesMode && $localSaves.length > 1}
                  <i class="bi bi-grip-vertical" />
                {/if}
                <div class="ms-2 me-auto">
                  <div class="fw-bold">
                    {save.data.title === ""
                      ? "[Kein Titel angegeben]"
                      : save.data.title}
                  </div>
                  {save.data.date === ""
                    ? "[Kein Datum angegeben]"
                    : save.data.date}
                </div>
                {#if editSavesMode}
                  <button
                    class="btn btn-danger"
                    on:click={() =>
                      ($localSaves = [...$localSaves].filter(
                        (item, j) => j !== i
                      ))}
                  >
                    <i class="bi bi-trash" />
                  </button>
                {/if}
              </li>
            {:else}
              <p>- Keine lokalen Speicherstände -</p>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="d-flex justify-content-between">
    <button class="btn btn-primary" on:click={() => importFile()}
      >Aus Datei Importieren
    </button>
    <button
      class="btn btn-danger ms-1"
      disabled={$matchToImport === undefined || $matchToImport === ""}
      on:click={handleDataImport}
      >In Anwendung übertragen
    </button>
  </div>
  {#if !($matchToImport === undefined || $matchToImport === "")}
    <div class="text-end">
      <i class="bi bi-info-circle" /> Achtung, das wird alle ungespeicherten Daten
      überschreiben
    </div>
  {/if}

  <!-- <label for="" class="form-label">Spielort</label> -->
  <textarea
    bind:value={$matchToImport}
    class="form-control my-3"
    id="dataTextField"
    on:input={() => (hashValid = undefined)}
  />

  <label class="form-label" for="">Hash aus Export:</label>
  <textarea
    bind:value={userHash}
    class="form-control"
    on:input={validateHash}
  />

  <div class="d-flex justify-content-between align-items-center">
    <!-- <button class="btn btn-primary mt-2" on:click={validateHash}
      >Validieren
    </button> -->
    {#if hashValid !== undefined}
      {#if hashValid}
        <span class="text-success">Die Daten sind valide.</span>
      {:else}
        <span class="text-danger">Die Daten passen nicht zu dem Hash!</span>
      {/if}
    {/if}
  </div>
</div>

<style>
  li.dragging {
    opacity: 0.8;
    background-color: #0b5dd5;
  }

  #dataTextField {
    min-height: 400px;
  }
</style>
