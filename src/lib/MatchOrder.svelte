<script lang="ts">
  import { matchList, teamList } from "../stores/contentStore";

  function removeMatch(matchId: string): void {
    $matchList = $matchList.filter((match) => match.Id !== matchId);
  }

  function getTeamNameById(teamId: string) {
    return $teamList.find((team: any) => team.Id === teamId).Name;
  }

  let isDragging = false;
  let startIndex: number;
  let currentIndex: number;

  function handleDragStart(event: any, index: number): void {
    if (!editMode) return;

    isDragging = true;
    startIndex = index;
    currentIndex = index;

    event.dataTransfer.setData("text/plain", index.toString());
  }

  function handleDragMove(event: any, index: number): void {
    if (!editMode) return;
    if (!isDragging) return;

    currentIndex = index;

    event.preventDefault();
  }

  function handleDragEnd(): void {
    if (!isDragging) return;

    isDragging = false;

    // swap
    // const temp = list[startIndex];
    // list[startIndex] = list[currentIndex];
    // list[currentIndex] = temp;

    // insert at index
    if (startIndex !== currentIndex) {
      let draggedItem = $matchList[startIndex];
      $matchList = [
        ...$matchList.slice(0, startIndex),
        ...$matchList.slice(startIndex + 1),
      ];
      $matchList = [
        ...$matchList.slice(0, currentIndex),
        draggedItem,
        ...$matchList.slice(currentIndex),
      ];
    }
  }

  let deleteMode = false;
  let editMode = false;

  function handleEditButton(): void {
    if (editMode) deleteMode = false;
    editMode = !editMode;
  }
</script>

{#if editMode}
  <div><i class="bi bi-info-circle" /> Spiele per Drag and Drop anordnen.</div>
{/if}
<button class="btn btn-secondary my-1" on:click={handleEditButton}
  >{#if !editMode}<i class="bi bi-pencil-square" />{/if}
  {editMode ? "Fertig bearbeitet" : "bearbeiten"}</button
>
{#if editMode}
  <button
    class={`btn btn-outline-${deleteMode ? "primary" : "danger"} my-1`}
    on:click={() => (deleteMode = !deleteMode)}
    >{deleteMode ? "Entfernen beenden" : "einzelne Spiele entfernen"}</button
  >
{/if}

<hr />

{#if $matchList.length > 0}
  <div class="d-none d-md-block">
    <div class="row">
      <div class="col-6" />
      <div class="col text-center">Halbzeit</div>
      <div class="col text-center">Endstand</div>
      <div class="col text-center">Kommissär</div>
      <div class={`${deleteMode ? "col-2" : "d-none"}`} />
    </div>
  </div>
{/if}

<div class="list-group">
  {#each $matchList as match, index (`match-${index}`)}
    <li
      class="list-group-item pt-2"
      draggable={editMode}
      class:dragging={isDragging && currentIndex === index}
      on:touchstart={(e) => handleDragStart(e, index)}
      on:touchmove={(e) => handleDragMove(e, index)}
      on:touchend={handleDragEnd}
      on:dragstart={(e) => handleDragStart(e, index)}
      on:dragover={(e) => handleDragMove(e, index)}
      on:dragend={handleDragEnd}
    >
      <div class="row">
        {#if editMode}
          <div class="col-1 pgRow">
            <i
              class="bi bi-grip-vertical"
              style={`cursor: ${isDragging ? "grabbing" : "grab"};`}
            />
          </div>
        {/if}
        <div class="col row">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="row row-cols-12">
              <div class="col-1">{index + 1}.</div>
              <div class="col">
                {getTeamNameById(match.Team1Id) === ""
                  ? "[Bitte Teamname eingeben]"
                  : getTeamNameById(match.Team1Id)}
              </div>
              <div class="col">
                {#if editMode}
                  <i
                    class="bi bi-arrow-left-right"
                    style="cursor: pointer;"
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
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-2">
            <div class="input-group input-group-sm my-1">
              <span class="input-group-text d-block d-md-none">Halbzeit</span>
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

          <div class="col-xs-12 col-sm-12 col-md-2">
            <div class="input-group input-group-sm my-1">
              <span class="input-group-text d-block d-md-none">Endstand</span>
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

          <div class="col-xs-12 col-sm-12 col-md-2 position-relative">
            <div class="input-group input-group-sm my-1">
              <span class="input-group-text d-block d-md-none">Kommissär</span>
              <input
                type="text"
                class="form-control"
                placeholder="Kommissär"
                bind:value={match.Referee}
              />
            </div>
          </div>
        </div>
        {#if deleteMode}
          <div class="col-2 pgRow">
            <button
              class="btn btn-danger"
              on:click={() => removeMatch(match.Id)}
            >
              <i class="bi bi-trash" />
            </button>
          </div>
        {/if}
      </div>
    </li>
  {:else}
    <p>Noch keine Spiele - füge Mannschaften hinzu um welche zu generieren.</p>
  {/each}
</div>

<style>
  li.dragging {
    opacity: 0.8;
    background-color: #0b5dd5;
  }

  .pgRow {
    display: flex;
    align-items: center;
  }
</style>
