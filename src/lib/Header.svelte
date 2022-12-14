<script lang="ts">
  import type {data} from "../model/types";

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
    <label class="form-label" for="">Spielberichtsbogen</label>
    <input
            bind:value={data.title}
            class="form-control"
            placeholder="Veranstaltungstitel"
            type="text"
    />
</div>
<div class="mb-3">
    <label class="form-label" for="locationTextarea">Spielort</label>
    <textarea
            bind:value={data.location}
            class="form-control"
            id="locationTextarea"
            placeholder="Anschrift Veranstaltungsort"
            type="text"
    />
</div>

<div class="row">
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label class="form-label" for="" on:click={setDate} on:keydown={setDate}
            >Datum</label
            >
            <input bind:value={data.date} class="form-control" type="date"/>
        </div>
    </div>
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label
                    class="form-label"
                    for=""
                    on:click={setStartTime}
                    on:keydown={setStartTime}>Beginn</label
            >
            <input bind:value={data.startTime} class="form-control" type="time"/>
        </div>
    </div>
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label
                    class="form-label"
                    for=""
                    on:click={setEndTime}
                    on:keydown={setEndTime}>Ende</label
            >
            <input bind:value={data.endTime} class="form-control" type="time"/>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label class="form-label" for="">Chief-Kommisär</label>
            <input bind:value={data.chiefReferee} class="form-control" type="text"/>
        </div>
    </div>
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label class="form-label" for="">Kommissär</label>
            <input bind:value={data.referee} class="form-control" type="text"/>
        </div>
    </div>
    <div class="col-sm-4 col-xs-12">
        <label class="form-label" for="">Spielzeit</label>
        <div class="input-group mb-3">
            <input bind:value={data.duration} class="form-control" type="text"/>
            <span class="input-group-text">Minuten</span>
        </div>
    </div>
</div>

<div class="mb-3">
    <label class="form-label" for="notPlayingTextarea">Spielfrei</label>
    <textarea
            bind:value={data.notPlaying}
            class="form-control"
            id="notPlayingTextarea"
            placeholder="Spielfrei"
            type="text"
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