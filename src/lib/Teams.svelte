<script lang="ts">
  import Team from "../model/Team";
  import type Match from "../model/Match";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let teams: Team[];
  export let list: Match[];

  function addNewTeam():void {
    teams = [...teams, new Team()];
    dispatch("createMatches");
  }

  function removeTeam(index:number):void {
    teams = teams.filter((team, i) => i !== index);
    // TODO: bessere Lösung finden
    dispatch("createMatches");
  }

  export let editMode: boolean;
</script>

{#each teams as team, i}
  <div class={editMode ? "" : "disabled"}>
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder={`Mannschaft ${i + 1}`}
        bind:value={team.Name}
        on:input={() => dispatch("createMatches")}
      />
      <span
        class="input-group-text"
        data-bs-toggle="collapse"
        data-bs-target={`#collapseTeam${i}`}
        ><i class="bi bi-three-dots-vertical" /></span
      >
    </div>

    <div class="collapse" id={`collapseTeam${i}`}>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Spieler 1</span>
        <input
          type="text"
          class="form-control"
          placeholder="Vorname"
          bind:value={team.Player1.firstName}
        />
        <input
          type="text"
          class="form-control"
          placeholder="Nachname"
          bind:value={team.Player1.lastName}
        />
        <input
          type="text"
          class="form-control"
          placeholder="Lizenz"
          bind:value={team.Player1.licence}
        />
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Spieler 2</span>
        <input
          type="text"
          class="form-control"
          placeholder="Vorname"
          bind:value={team.Player2.firstName}
        />
        <input
          type="text"
          class="form-control"
          placeholder="Nachname"
          bind:value={team.Player2.lastName}
        />
        <input
          type="text"
          class="form-control"
          placeholder="Lizenz"
          bind:value={team.Player2.licence}
        />
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Spieler 3</span>
        <input
          type="text"
          class="form-control"
          placeholder="Vorname"
          bind:value={team.Player3.firstName}
        />
        <input
          type="text"
          class="form-control"
          placeholder="Nachname"
          bind:value={team.Player3.lastName}
        />
        <input
          type="text"
          class="form-control"
          placeholder="Lizenz"
          bind:value={team.Player3.licence}
        />
      </div>

      <button class="btn btn-danger mb-3 w-100" on:click={() => removeTeam(i)}
        ><i class="bi bi-trash" /> (Achtung, wird Spielfolge zurücksetzen!)
      </button>
      <hr />
    </div>
  </div>
{/each}
{#if editMode}
  <button
    class={`btn btn-${
      list.some(
        (match) =>
          match.HalfTimeScoreTeam1 !== undefined ||
          match.HalfTimeScoreTeam2 !== undefined ||
          match.FinalScoreTeam1 !== undefined ||
          match.FinalScoreTeam2 !== undefined
      )
        ? "warning"
        : "primary"
    } mb-3 w-100`}
    on:click={() => addNewTeam()}
    ><i class="bi bi-plus-circle" />{list.some(
      (match) =>
        match.HalfTimeScoreTeam1 !== undefined ||
        match.HalfTimeScoreTeam2 !== undefined ||
        match.FinalScoreTeam1 !== undefined ||
        match.FinalScoreTeam2 !== undefined
    )
      ? " (Achtung, wird die Spielfolge überschreiben!)"
      : ""}
  </button>
{/if}
<button
  class={`btn btn-${editMode ? "primary" : "warning"} mb-3 w-100`}
  on:click={() => (editMode = !editMode)}
  disabled={teams.length === 0 || teams.some((team) => team.Name === "")}
  >{editMode ? "Fertig" : "Bearbeiten"}</button
>
