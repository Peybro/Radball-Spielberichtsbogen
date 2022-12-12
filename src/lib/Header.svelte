<script lang="ts">
  export let data;

  function setDate() {
    const today = new Date();
    data.date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
  }

  function setStartTime() {
    const today = new Date();
    data.startTime =
      `0${today.getHours()}`.slice(-2) +
      ":" +
      `0${today.getMinutes()}`.slice(-2);
  }

  function setEndTime() {
    const today = new Date();
    data.endTime =
      `0${today.getHours()}`.slice(-2) +
      ":" +
      `0${today.getMinutes()}`.slice(-2);
  }
</script>

<div class="input-group mb-3">
  <span class="input-group-text">Spielberichtsbogen</span>
  <input
    type="text"
    class="form-control"
    placeholder="Veranstaltungstitel"
    bind:value={data.title}
  />
</div>
<div class="input-group mb-3">
  <span class="input-group-text">Spielort</span>
  <textarea
    type="text"
    class="form-control"
    placeholder="Anschrift Veranstaltungsort"
    bind:value={data.location}
  />
</div>

<div class="row">
  <div class="col-sm-4 col-xs-12">
    <div class="input-group mb-3">
      <button class="input-group-text" on:click={() => setDate()}>Datum</button>
      <input type="date" class="form-control" bind:value={data.date} />
    </div>
  </div>
  <div class="col-sm-4 col-xs-12">
    <div class="input-group mb-3">
      <button class="input-group-text" on:click={() => setStartTime()}
        >Beginn</button
      >
      <input type="time" class="form-control" bind:value={data.startTime} />
    </div>
  </div>
  <div class="col-sm-4 col-xs-12">
    <div class="input-group mb-3">
      <button class="input-group-text" on:click={() => setEndTime()}
        >Ende</button
      >
      <input type="time" class="form-control" bind:value={data.endTime} />
    </div>
  </div>
</div>

<div class="row">
  <div class="col-sm-4 col-xs-12">
    <div class="input-group mb-3">
      <span class="input-group-text">Chief-Kommisär</span>
      <input type="text" class="form-control" bind:value={data.chiefReferee} />
    </div>
  </div>
  <div class="col-sm-4 col-xs-12">
    <div class="input-group mb-3">
      <span class="input-group-text">Kommisär</span>
      <input type="text" class="form-control" bind:value={data.referee} />
    </div>
  </div>
  <div class="col-sm-4 col-xs-12">
    <div class="input-group mb-3">
      <span class="input-group-text">Spielzeit</span>
      <input type="text" class="form-control" bind:value={data.duration} />
      <span class="input-group-text">Minuten</span>
    </div>
  </div>
</div>

<div class="input-group mb-3">
  <span class="input-group-text">Spielfrei</span>
  <textarea
    type="text"
    class="form-control"
    placeholder="Spielfrei"
    bind:value={data.notPlaying}
  />
</div>
