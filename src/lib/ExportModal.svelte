<script lang="ts">
  import hashjs from "hash.js";

  export let data: any;

  $: hash = hashjs.sha256().update(JSON.stringify(data)).digest("hex");

  function exportFile(): void {
    // create a new Blob object representing a new file
    const file = new Blob([JSON.stringify(data)], {
      type: "text/plain",
    });

    // create a link element to simulate a click on the link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${data.data.date}_spielberichtsbogen_${data.data.title}.txt`;

    // simulate a click on the link to open the file dialog
    link.click();
  }
</script>

<!-- Button trigger modal -->
<button
  type="button"
  class="btn btn-primary"
  data-bs-toggle="modal"
  data-bs-target="#exportBackdrop"
>
  Exportieren
</button>

<!-- Modal -->
<div
  class="modal fade"
  id="exportBackdrop"
  data-bs-keyboard="false"
  tabindex="-1"
>
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exportBackdropLabel">
          Daten exportieren
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" />
      </div>
      <div class="modal-body">
        <button class="btn btn-primary" on:click={() => exportFile()}
          >Als Datei speichern</button
        >

        <button
          class="btn btn-primary"
          on:click={() =>
            (window.location.href = `?val=${JSON.stringify(data)}`)}
          >In URL speichern</button
        >
        <p>
          <i class="bi bi-info-circle" /> Seite kann bei URL Export sicher verlassen
          werden
        </p>

        <!-- <label for="" class="form-label">Spielort</label> -->
        <textarea
          id="dataTextField"
          type="text"
          class="form-control my-3"
          disabled
          value={JSON.stringify(data)}
        />

        <label for="" class="form-label">Hash:</label>
        <textarea type="text" class="form-control" disabled bind:value={hash} />
        <p>
          <i class="bi bi-info-circle" /> Der Hash kann beim Importieren genutzt
          werden um die Daten zu validieren.
        </p>
      </div>
      <!-- <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >zurück</button
        >
      </div> -->
    </div>
  </div>
</div>

<style>
  #dataTextField {
    min-height: 400px;
  }
</style>
