<script lang="ts">
  import hashjs from "hash.js";
  import {
    localSaves,
    matchList,
    metaInfo,
    teamList,
  } from "../stores/contentStore";

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
</script>

<div>
  <div class="d-flex justify-content-start">
    <button
      class="btn btn-primary"
      on:click={() => localSaves.update((prev) => [...prev, allDataAsObject])}
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
  #dataTextField {
    min-height: 400px;
  }
</style>
