<script>
  import Header from "./Header.svelte";
  import Teams from "./Teams.svelte";
  import Order from "./Order.svelte";
  import Table from "./Table.svelte";
  import Match from "../model/Match";

  export let data;
  export let teams;

  let list = [];

  function createMatches() {
    list = combinations(teams);
  }

  function combinations(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        result.push(new Match(arr[i].Id, arr[j].Id));
      }
    }
    return result;
  }

  /**
   * @param {string} matchId
   */
  function removeMatch(matchId) {
    list = list.filter((match) => match.Id !== matchId);
  }
</script>

<div class="accordion" id="main-accordion">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingInfo">
      <button
        class="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseInfo"
      >
        Info
      </button>
    </h2>
    <div id="collapseInfo" class="accordion-collapse collapse show">
      <!-- {data-bs-parent="#main-accordion"} -->
      <div class="accordion-body">
        <Header bind:data />
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button
        class="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseTeams"
      >
        Mannschaften
      </button>
    </h2>
    <div id="collapseTeams" class="accordion-collapse collapse show">
      <!-- {data-bs-parent="#main-accordion"} -->
      <div class="accordion-body">
        <Teams bind:teams on:createMatches={() => createMatches()} />
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseMatches"
      >
        Spielfolge
      </button>
    </h2>
    <div id="collapseMatches" class="accordion-collapse collapse">
      <!-- {data-bs-parent="#main-accordion"} -->
      <div class="accordion-body">
        <Order
          {teams}
          bind:list
          on:removeMatch={(e) => removeMatch(e.detail.matchId)}
        />
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseTable"
      >
        Tabelle
      </button>
    </h2>
    <div id="collapseTable" class="accordion-collapse collapse">
      <!-- {data-bs-parent="#main-accordion"} -->
      <div class="accordion-body">
        <Table {teams} {list} />
      </div>
    </div>
  </div>
</div>
