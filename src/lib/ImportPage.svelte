<script lang="ts">
  import hashjs from "hash.js";
  import {createEventDispatcher} from "svelte";
  import {localSaves} from "../stores/contentStore";
  import {importMode, menuMode} from "../stores/booleanStore";

  const dispatch = createEventDispatcher();

    let allData = "";
    $: hash = hashjs.sha256().update(allData).digest("hex") || "";

    let userHash: string;
    let hashValid: boolean;

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
                        allData = <string>event.target.result;
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

    function validateHash(): void {
        hashValid = hash === userHash;
    }
</script>

<div>
    <label for="">Speicherungen in lokalem Speicher:</label>
    <ul class="list-group mb-3">
        {#each $localSaves as save, i}
            <li
                    class="list-group-item d-flex justify-content-between align-items-start"
                    type="button"
                    on:click={() => (allData = JSON.stringify(save))}
                    on:keydown={() => (allData = JSON.stringify(save))}
            >
                <div class="ms-2 me-auto">
                    <div class="fw-bold">{save.data.title}</div>
                    {save.data.date}
                </div>
                <button
                        class="btn btn-danger"
                        on:click={() =>
            ($localSaves = [...$localSaves].filter((item, j) => j !== i))}
                >
                    <i class="bi bi-trash"/>
                </button>
            </li>
        {:else}
            <p>- Keine lokalen Speicherstände -</p>
        {/each}
    </ul>

    <hr/>

    <button class="btn btn-primary" on:click={() => importFile()}
    >Aus Datei Importieren
    </button>

    <!-- <label for="" class="form-label">Spielort</label> -->
    <textarea
            bind:value={allData}
            class="form-control my-3"
            id="dataTextField"
            on:input={() => (hashValid = undefined)}
            type="text"
    />

    <label class="form-label" for="">Hash aus Export:</label>
    <textarea
            bind:value={userHash}
            class="form-control"
            on:input={() => (hashValid = undefined)}
            type="text"
    />

    <div class="d-flex justify-content-between align-items-center">
        <button class="btn btn-primary mt-2" on:click={validateHash}
        >Validieren
        </button>
        {#if hashValid !== undefined}
            {#if hashValid}
                <span class="text-success">Die Daten sind valide.</span>
            {:else}
                <span class="text-danger">Die Daten passen nicht zu dem Hash!</span>
            {/if}
        {/if}
    </div>

    <hr/>

    <button
            class="btn btn-primary"
            disabled={allData === undefined || allData === ""}
            on:click={() => {
      dispatch("import", { data: allData });
      $menuMode = false;
      $importMode = false;
    }}
    >In Anwendung übertragen
    </button>
</div>

<style>
    #dataTextField {
        min-height: 400px;
    }
</style>
