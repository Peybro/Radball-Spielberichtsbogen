<script lang="ts">
    import {metaInfo} from "./../stores/store"

    function setDate(): void {
        const today = new Date();
        $metaInfo.date = `${today.getFullYear()}-${
            today.getMonth() + 1
        }-${today.getDate()}`;
    }

    function setStartTime(): void {
        const today = new Date();
        $metaInfo.startTime =
            `0${today.getHours()}`.slice(-2) +
            ":" +
            `0${today.getMinutes()}`.slice(-2);
    }

    function setEndTime(): void {
        const today = new Date();
        $metaInfo.endTime =
            `0${today.getHours()}`.slice(-2) +
            ":" +
            `0${today.getMinutes()}`.slice(-2);
    }
</script>

<div class="mb-3">
    <label class="form-label" for="titleInput">Spielberichtsbogen</label>
    <input
            bind:value={$metaInfo.title}
            class="form-control"
            id="titleInput"
            placeholder="Veranstaltungstitel"
            type="text"
    />
</div>
<div class="mb-3">
    <label class="form-label" for="locationTextarea">Spielort</label>
    <textarea
            bind:value={$metaInfo.location}
            class="form-control"
            id="locationTextarea"
            placeholder="Anschrift Veranstaltungsort"
            type="text"
    />
</div>

<div class="row">
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label class="form-label" for="dateInput" on:click={setDate} on:keydown={setDate}
            >Datum</label
            >
            <input bind:value={$metaInfo.date} class="form-control" id="dateInput" type="date"/>
        </div>
    </div>
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label
                    class="form-label"
                    for="startTimeInput"
                    on:click={setStartTime}
                    on:keydown={setStartTime}>Beginn</label
            >
            <input bind:value={$metaInfo.startTime} class="form-control" id="startTimeInput" type="time"/>
        </div>
    </div>
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label
                    class="form-label"
                    for="endTimeInput"
                    on:click={setEndTime}
                    on:keydown={setEndTime}>Ende</label
            >
            <input bind:value={$metaInfo.endTime} class="form-control" id="endTimeInput" type="time"/>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label class="form-label" for="chiefRefereeInput">Chief-Kommisär</label>
            <input bind:value={$metaInfo.chiefReferee} class="form-control" id="chiefRefereeInput" type="text"/>
        </div>
    </div>
    <div class="col-sm-4 col-xs-12">
        <div class="mb-3">
            <label class="form-label" for="refereeInput">Kommissär</label>
            <input bind:value={$metaInfo.referee} class="form-control" id="refereeInput" type="text"/>
        </div>
    </div>
    <div class="col-sm-4 col-xs-12">
        <label class="form-label" for="durationInput">Spielzeit</label>
        <div class="input-group mb-3">
            <input bind:value={$metaInfo.duration} class="form-control" id="durationInput" type="text"/>
            <span class="input-group-text">Minuten</span>
        </div>
    </div>
</div>

<div class="mb-3">
    <label class="form-label" for="notPlayingTextarea">Spielfrei</label>
    <textarea
            bind:value={$metaInfo.notPlaying}
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