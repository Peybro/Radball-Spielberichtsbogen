<script lang="ts">
  import Match from "../model/Match";
  import Team from "../model/Team";
  import { matchList, teamList } from "../stores/contentStore";

  function removeMatch(matchId: string): void {
    $matchList = $matchList.filter((match) => match.Id !== matchId);
  }

  function getTeamNameById(teamId: string) {
    if (!teamId) return "";
    return $teamList.find((team: Team) => team.Id === teamId).Name;
  }

  let deleteMode = false;
  let editMode = false;

  function handleEditButton(): void {
    if (editMode) deleteMode = false;
    editMode = !editMode;
  }

  let duplicateMatches: string[] = [];

  $: {
    const matchMap = new Map();
    const result = new Set<string>();

    for (const match of $matchList) {
      const matchKey = [match.Team1Id, match.Team2Id].sort().join("-");

      if (matchMap.has(matchKey)) {
        matchMap.get(matchKey).push(match.Id);
      } else {
        matchMap.set(matchKey, [match.Id]);
      }
    }

    for (const ids of matchMap.values()) {
      if (ids.length > 1) {
        ids.forEach((id: string) => result.add(id));
      }
    }

    duplicateMatches = Array.from(result);
  }
</script>

{#if $matchList.length > 0}
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
{/if}

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
      class:bg-danger={match.Team1Id === match.Team2Id ||
        match.Team1Id === undefined ||
        match.Team2Id === undefined}
      class:bg-warning={editMode && duplicateMatches.includes(match.Id)}
    >
      <div class="row">
        <div class="col row">
          <div class="col-xs-12 col-sm-12 col-md-6">
            <div class="row row-cols-12">
              <div class="col-1">{index + 1}.</div>
              <div class="col">
                {#if !editMode}
                  {getTeamNameById(match.Team1Id) === "" || !match.Team1Id
                    ? "[Bitte Teamname eingeben]"
                    : getTeamNameById(match.Team1Id)}
                {:else}
                  <select
                    on:change={(e) =>
                      (match.Team1Id = $teamList.find(
                        (team) => team.Id === e.currentTarget.value
                      ).Id)}
                  >
                    <option
                      value={undefined}
                      disabled
                      selected={match.Team1Id === undefined}>Team wählen</option
                    >
                    {#each $teamList as team}
                      <option
                        selected={getTeamNameById(match.Team1Id) === team.Name}
                        value={team.Id}
                        >{team.Name !== ""
                          ? team.Name
                          : "Bitte Teamname eingeben"}</option
                      >
                    {/each}
                  </select>
                {/if}
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
                {#if !editMode}
                  {getTeamNameById(match.Team2Id) === "" || !match.Team2Id
                    ? "[Bitte Teamname eingeben]"
                    : getTeamNameById(match.Team2Id)}
                {:else}
                  <select
                    on:change={(e) =>
                      (match.Team2Id = $teamList.find(
                        (team) => team.Name === e.currentTarget.value
                      ).Id)}
                  >
                    <option
                      value={undefined}
                      disabled
                      selected={match.Team2Id === undefined}>Team wählen</option
                    >
                    {#each $teamList as team}
                      <option
                        selected={getTeamNameById(match.Team2Id) === team.Name}
                        >{team.Name !== ""
                          ? team.Name
                          : "Bitte Teamname eingeben"}</option
                      >
                    {/each}
                  </select>
                {/if}
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
{#if editMode}
  <button
    class="btn btn-primary w-100 mt-3"
    on:click={() => ($matchList = [...$matchList, new Match()])}
    ><i class="bi bi-plus-circle" /> Neue Begegnung</button
  >
{/if}

<style>
  .pgRow {
    display: flex;
    align-items: center;
  }
</style>
