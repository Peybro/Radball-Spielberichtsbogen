<script lang="ts">
  import type { data } from "../model/types";

  export let data: data;

  function setDate(): void {
    const today = new Date();
    data.date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
  }

  function setStartTime(): void {
    const today = new Date();
    data.startTime =
      `0${today.getHours()}`.slice(-2) +
      ":" +
      `0${today.getMinutes()}`.slice(-2);
  }

  function setEndTime(): void {
    const today = new Date();
    data.endTime =
      `0${today.getHours()}`.slice(-2) +
      ":" +
      `0${today.getMinutes()}`.slice(-2);
  }
</script>

<div class="mb-3">
  <label for="" class="form-label">Spielberichtsbogen</label>
  <input
    type="text"
    class="form-control"
    placeholder="Veranstaltungstitel"
    bind:value={data.title}
  />
</div>
<div class="mb-3">
  <label for="locationTextarea" class="form-label">Spielort</label>
  <textarea
    id="locationTextarea"
    type="text"
    class="form-control"
    placeholder="Anschrift Veranstaltungsort"
    bind:value={data.location}
  />
</div>

<div class="row">
  <div class="col-sm-4 col-xs-12">
    <div class="mb-3">
      <label for="" class="form-label" on:click={setDate} on:keydown={setDate}
        >Datum</label
      >
      <input type="date" class="form-control" bind:value={data.date} />
    </div>
  </div>
  <div class="col-sm-4 col-xs-12">
    <div class="mb-3">
      <label
        for=""
        class="form-label"
        on:click={setStartTime}
        on:keydown={setStartTime}>Beginn</label
      >
      <input type="time" class="form-control" bind:value={data.startTime} />
    </div>
  </div>
  <div class="col-sm-4 col-xs-12">
    <div class="mb-3">
      <label
        for=""
        class="form-label"
        on:click={setEndTime}
        on:keydown={setEndTime}>Ende</label
      >
      <input type="time" class="form-control" bind:value={data.endTime} />
    </div>
  </div>
</div>

<div class="row">
  <div class="col-sm-4 col-xs-12">
    <div class="mb-3">
      <label for="" class="form-label">Chief-Kommisär</label>
      <input type="text" class="form-control" bind:value={data.chiefReferee} />
    </div>
  </div>
  <div class="col-sm-4 col-xs-12">
    <div class="mb-3">
      <label for="" class="form-label">Kommissär</label>
      <input type="text" class="form-control" bind:value={data.referee} />
    </div>
  </div>
  <div class="col-sm-4 col-xs-12">
    <label for="" class="form-label">Spielzeit</label>
    <div class="input-group mb-3">
      <input type="text" class="form-control" bind:value={data.duration} />
      <span class="input-group-text">Minuten</span>
    </div>
  </div>
</div>

<div class="mb-3">
  <label for="notPlayingTextarea" class="form-label">Spielfrei</label>
  <textarea
  id="notPlayingTextarea"
    type="text"
    class="form-control"
    placeholder="Spielfrei"
    bind:value={data.notPlaying}
  />
</div>

<style>
  #locationTextarea {
    height: 6rem;
  }

  #notPlayingTextarea {
    height: 6rem;
  }
</style>