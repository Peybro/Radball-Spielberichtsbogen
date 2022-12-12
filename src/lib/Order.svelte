<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let teams: any;
  export let list: any;

  const dispatch = createEventDispatcher();

  function getTeamNameById(teamId: string) {
    return teams.find((team: any) => team.Id === teamId).name;
  }

  let hovering = false;

  let isDragging = false;
  let startIndex;
  let currentIndex;

  function handleTouchStart(event, index) {
    isDragging = true;
    startIndex = index;
    currentIndex = index;

    event.dataTransfer.setData("text/plain", index.toString());
  }

  function handleTouchMove(event, index) {
    if (!isDragging) return;

    currentIndex = index;

    event.preventDefault();
  }

  function handleTouchEnd() {
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
</script>

<button
  class="btn btn-outline-danger"
  data-bs-toggle="collapse"
  data-bs-target="#editMatches">einzelne Spiele entfernen</button
>

<hr />

<div class="d-none d-sm-block">
  <div class="row">
    <div class="col-5" />
    <div class="col-2 text-center">Halbzeit</div>
    <div class="col-2 text-center">Endstand</div>
    <div class="col-2 text-center">Kommisär</div>
  </div>
</div>

<div class="list">
  {#each list as match, index (`match-${index}`)}
    <div
      class="row listItem"
      draggable="true"
      class:dragging={isDragging && currentIndex === index}
      on:touchstart={(e) => handleTouchStart(e, index)}
      on:touchmove={(e) => handleTouchMove(e, index)}
      on:touchend={handleTouchEnd}
      on:dragstart={(e) => handleTouchStart(e, index)}
      on:dragover={(e) => handleTouchMove(e, index)}
      on:dragend={handleTouchEnd}
    >
      <div class="col-1">{index + 1}.</div>

      <div class="col-2">{getTeamNameById(match.Team1Id)}</div>
      <div class="col-2">
        <span
          id="switch"
          on:click={() => {
            match.switchTeams();
            // needed as manual state reload
            match.Referee = match.Referee;
          }}
          on:mouseenter={() => (hovering = true)}
          on:mouseleave={() => (hovering = false)}
          on:keydown={() => console.log("Das ist kein Button")}
          >{hovering ? "<" : ""}--{hovering ? ">" : ""}</span
        >
        {getTeamNameById(match.Team2Id)}
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
          placeholder="Kommisär"
          bind:value={match.Referee}
        />
      </div>

      <div class="collapse col-1" id="editMatches">
        <button
          class="btn btn-danger"
          on:click={() => dispatch("removeMatch", { matchId: match.Id })}
          >X</button
        >
      </div>

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
    /* opacity: 0.5; */
    background-color: #0b5dd5;
  }

  #switch {
    cursor: pointer;
    font-weight: bold;
  }
</style>
