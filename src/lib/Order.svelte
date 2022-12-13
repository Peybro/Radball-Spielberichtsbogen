<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let teams: any;
  export let list: any;

  const dispatch = createEventDispatcher();

  function getTeamNameById(teamId: string) {
    return teams.find((team: any) => team.Id === teamId).name;
  }

  let isDragging = false;
  let startIndex;
  let currentIndex;

  function handleDragStart(event, index) {
    if (!editMode) return;

    isDragging = true;
    startIndex = index;
    currentIndex = index;

    event.dataTransfer.setData("text/plain", index.toString());
  }

  function handleDragMove(event, index) {
    if (!editMode) return;
    if (!isDragging) return;

    currentIndex = index;

    event.preventDefault();
  }

  function handleDragEnd() {
    if (!isDragging) return;

    isDragging = false;

    // swap the items in the array
    // const temp = list[startIndex];
    // list[startIndex] = list[currentIndex];
    // list[currentIndex] = temp;

    if (startIndex !== currentIndex) {
      let draggedItem = list[startIndex];
      list = [...list.slice(0, startIndex), ...list.slice(startIndex + 1)];
      list = [
        ...list.slice(0, currentIndex),
        draggedItem,
        ...list.slice(currentIndex),
      ];
    }
  }

  let deleteMode = false;
  let editMode = false;
</script>

{#if editMode}
  <div><i class="bi bi-info-circle" /> Spiele per Drag and Drop anordnen.</div>
{/if}
<button class="btn btn-primary my-1" on:click={() => (editMode = !editMode)}
  >{editMode ? "Fertig angeordnet" : "anordnen"}</button
>
<button
  class={`btn btn-outline-${deleteMode ? "primary" : "danger"} my-1`}
  on:click={() => (deleteMode = !deleteMode)}
  >{deleteMode
    ? "Entfernen beenden"
    : "einzelne Spiele entfernen"}</button
>

<hr />

<div class="d-none d-sm-block">
  <div class="row">
    <div class={`col-${deleteMode ? "5" : "6"}`} />
    <div class="col-2 text-center">Halbzeit</div>
    <div class="col-2 text-center">Endstand</div>
    <div class="col-2 text-center">Kommissär</div>
  </div>
</div>

<div class="list">
  {#each list as match, index (`match-${index}`)}
    <div
      class="row listItem"
      draggable={editMode}
      class:dragging={isDragging && currentIndex === index}
      on:touchstart={(e) => handleDragStart(e, index)}
      on:touchmove={(e) => handleDragMove(e, index)}
      on:touchend={handleDragEnd}
      on:dragstart={(e) => handleDragStart(e, index)}
      on:dragover={(e) => handleDragMove(e, index)}
      on:dragend={handleDragEnd}
    >
      <div class="col-1">{index + 1}.</div>

      <div class="col-2">
        {getTeamNameById(match.Team1Id) === ""
          ? "[Bitte Teamname eingeben]"
          : getTeamNameById(match.Team1Id)}
      </div>
      <div class={`col-${deleteMode ? "2" : "3"}`}>
        {#if editMode}
          <i
            class="bi bi-arrow-left-right"
            on:click={() => {
              match.switchTeams();
              // needed as manual state reload
              match.Referee = match.Referee;
            }}
            on:keydown={() => console.log("Das ist kein Button")}
          />
        {:else}
          <span>-</span>
        {/if}
        {getTeamNameById(match.Team2Id) === ""
          ? "[Bitte Teamname eingeben]"
          : getTeamNameById(match.Team2Id)}
      </div>

      <div class="col-2">
        <div class="input-group mb-3">
          <input
            type="number"
            class="form-control"
            min="0"
            max="99"
            bind:value={match.HalfTimeScoreTeam1}
          />
          <input
            type="number"
            class="form-control"
            min="0"
            max="99"
            bind:value={match.HalfTimeScoreTeam2}
          />
        </div>
      </div>

      <div class="col-2">
        <div class="input-group mb-3">
          <input
            type="number"
            class="form-control"
            min="0"
            max="99"
            bind:value={match.FinalScoreTeam1}
          />
          <input
            type="number"
            class="form-control"
            min="0"
            max="99"
            bind:value={match.FinalScoreTeam2}
          />
        </div>
      </div>

      <div class="col-2">
        <input
          type="text"
          class="form-control"
          placeholder="Kommissär"
          bind:value={match.Referee}
        />
      </div>

      {#if deleteMode}
        <div class="col-1">
          <button
            class="btn btn-danger"
            on:click={() => dispatch("removeMatch", { matchId: match.Id })}
            >X</button
          >
        </div>
      {/if}

      <hr />
    </div>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
  }

  .listItem {
    padding: 8px;
    cursor: pointer;
  }

  .listItem.dragging {
    opacity: 0.8;
    background-color: #0b5dd5;
  }
</style>
