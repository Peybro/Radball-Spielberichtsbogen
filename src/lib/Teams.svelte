<script>
  import Team from "../model/Team";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let teams;

  function addNewTeam() {
    teams = [...teams, new Team()];
    dispatch("createMatches");
  }

  /**
   * @param {number} index
   */
  function removeTeam(index) {
    teams = teams.filter((team, i) => i !== index);
    dispatch("createMatches");
  }
</script>

{#each teams as team, i}
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      placeholder={`Mannschaft ${i + 1}`}
      bind:value={team.name}
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
      <input type="text" class="form-control" placeholder="Vorname" />
      <input type="text" class="form-control" placeholder="Nachname" />
      <input type="text" class="form-control" placeholder="Lizenz" />
    </div>
    <div class="input-group input-group-sm mb-3">
      <span class="input-group-text">Spieler 2</span>
      <input type="text" class="form-control" placeholder="Vorname" />
      <input type="text" class="form-control" placeholder="Nachname" />
      <input type="text" class="form-control" placeholder="Lizenz" />
    </div>
    <div class="input-group input-group-sm mb-3">
      <span class="input-group-text">Spieler 3</span>
      <input type="text" class="form-control" placeholder="Vorname" />
      <input type="text" class="form-control" placeholder="Nachname" />
      <input type="text" class="form-control" placeholder="Lizenz" />
    </div>

    <button class="btn btn-danger mb-3 w-100" on:click={() => removeTeam(i)}
      >X</button
    >
    <hr />
  </div>
{/each}
<button class="btn btn-primary mb-3 w-100" on:click={() => addNewTeam()}
  >+</button
>
