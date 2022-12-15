<script lang="ts">
    import {fly} from "svelte/transition";
    import {exportMode, importMode, menuMode, resetMode,} from "../stores/booleanStore";
    import {matchList, metaInfo, teamList} from "../stores/contentStore";
    import {initialMatchList, initialMetaInfo, initialTeamList,} from "../stores/initialValues";

    function resetData(): void {
        //? WTF??
        $metaInfo = {...initialMetaInfo, title: "", location: ""};
        $teamList = [...initialTeamList];
        $matchList = [...initialMatchList];

        $resetMode = false;
    }
</script>

<div
        class="ofc bg-dark container-fluid py-4 px-4"
        transition:fly={{ x: 1000, duration: 200 }}
>
    <div class="d-flex justify-content-between align-items-center">
        <h2>v0.2.1</h2>
        <button class="btn pe-0" on:click={() => ($menuMode = false)}>
            <h1>
                <i class="bi bi-list"/>
            </h1>
        </button>
    </div>

    <button
            class="btn btn-primary w-100 mb-2"
            on:click={() => {
      $menuMode = false;
      $importMode = false;
      $exportMode = false;
    }}>Spielberichtsbogen
    </button
    >
    <hr/>
    <button
            class="btn btn-primary w-100"
            on:click={() => {
      $menuMode = false;
      $importMode = true;
      $exportMode = false;
    }}>Importieren
    </button
    >
    <button
            class="btn btn-primary w-100 my-2"
            on:click={() => {
      $menuMode = false;
      $importMode = false;
      $exportMode = true;
    }}>Exportieren
    </button
    >
    <button class="btn btn-secondary w-100" on:click={() => window.print()}>
        Drucken
    </button>
    <div class="mt-2">
        <i class="bi bi-info-circle"/> Wähle als Drucker "Microsoft Print to PDF" um
        das Dokument als PDF zu speichern.
    </div>
    <hr/>
    <div class="d-flex justify-content-start mt-2">
        {#if $resetMode}
            <button class="btn btn-danger me-2" on:click={resetData}>
                Zurücksetzen!
            </button>
        {/if}
        <button class="btn btn-warning" on:click={() => ($resetMode = !$resetMode)}>
            {$resetMode ? "Doch nicht" : "Zurücksetzen"}
        </button>
    </div>
    {#if $resetMode}
        <div class="mt-2">
            <i class="bi bi-question-circle"/> Alles exportiert was du behalten willst?
        </div>
    {/if}
    <div class="w-100" id="signature">
        <div>❤️ Made by Thomas K.</div>
        <div class="ms-1 d-flex justify-content-start">
            <a href="https://github.com/Peybro/spielberichtsbogen"
            ><i class="bi bi-github"/></a
            >
            <span class="ms-2">v0.2.1</span>
        </div>
    </div>
</div>

<style>
    .ofc {
        position: fixed;
        right: 0;
        z-index: 100;
        height: 100vh;
        width: 300px;
    }

    #signature {
        position: fixed;
        bottom: 2rem;
    }
</style>
