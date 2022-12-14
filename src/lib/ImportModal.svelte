<script lang="ts">
    import hashjs from "hash.js";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let allData: string;
    $: hash =
        allData === undefined || allData === ""
            ? ""
            : hashjs.sha256().update(allData).digest("hex");

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

<!-- Button trigger modal -->
<button
        class="btn btn-primary"
        data-bs-target="#importBackdrop"
        data-bs-toggle="modal"
        type="button"
>
    Importieren
</button>

<!-- Modal -->
<div
        class="modal fade"
        data-bs-keyboard="false"
        id="importBackdrop"
        tabindex="-1"
>
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="importBackdropLabel">
                    Daten importieren
                </h1>
                <button class="btn-close" data-bs-dismiss="modal" type="button"/>
            </div>
            <div class="modal-body">
                <button class="btn btn-primary" on:click={() => importFile()}
                >Aus Datei Importieren
                </button
                >

                <!-- <label for="" class="form-label">Spielort</label> -->
                <textarea
                        bind:value={allData}
                        class="form-control my-3"
                        id="dataTextField"
                        on:input={() => (hashValid = undefined)}
                        type="text"
                />

                <label class="form-label" for="">Hash aus Exportierung:</label>
                <textarea bind:value={userHash} class="form-control" type="text"/>
                <button class="btn btn-primary mt-2" on:click={validateHash}
                >Validieren
                </button
                >
                {#if hashValid !== undefined}
                    {#if hashValid}
                        <span class="text-success">Die Daten sind valide.</span>
                    {:else}
                        <span class="text-danger">Die Daten passen nicht zu dem Hash!</span>
                    {/if}
                {/if}
            </div>
            <div class="modal-footer">
                <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                    >zurück</button
                  > -->
                <button
                        class="btn btn-primary"
                        disabled={allData === undefined || allData === ""}
                        on:click={() => dispatch("import", { data: allData })}
                >In Anwendung übertragen
                </button
                >
            </div>
        </div>
    </div>
</div>

<style>
    #dataTextField {
        min-height: 400px;
    }
</style>
