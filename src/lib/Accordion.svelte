<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import Header from "./Header.svelte";
  import Teams from "./Teams.svelte";
  import Order from "./Order.svelte";
  import Table from "./Table.svelte";
  import type Team from "../model/Team";
  import type Match from "../model/Match";
  import type { data } from "../model/types";

  export let data: data;
  export let teams: Team[];
  export let list: Match[];

  export let editMode: boolean;
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
        Infos {data.title !== "" ? `zu ${data.title}` : ""}
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
        Mannschaften {`(${teams.length})`}
      </button>
    </h2>
    <div id="collapseTeams" class="accordion-collapse collapse show">
      <!-- {data-bs-parent="#main-accordion"} -->
      <div class="accordion-body">
        <Teams
          bind:teams
          bind:editMode
          {list}
          on:createMatches={() => dispatch("createMatches")}
        />
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
        Spielfolge {`(${
          list.filter(
            (match) =>
              match.FinalScoreTeam1 != undefined &&
              match.FinalScoreTeam2 != undefined
          ).length
        }/${list.length})`}
      </button>
    </h2>
    <div id="collapseMatches" class="accordion-collapse collapse">
      <!-- {data-bs-parent="#main-accordion"} -->
      <div class="accordion-body">
        <Order
          {teams}
          bind:list
          on:removeMatch={(e) =>
            dispatch("removeMatch", { matchId: e.detail.matchId })}
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
