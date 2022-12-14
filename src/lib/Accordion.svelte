<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import Header from "./Header.svelte";
  import Teams from "./Teams.svelte";
  import Order from "./Order.svelte";
  import Table from "./Table.svelte";
  import type Team from "../model/Team";
  import type Match from "../model/Match";
  import type {data} from "../model/types";

  const dispatch = createEventDispatcher();

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
                    data-bs-target="#collapseInfo"
                    data-bs-toggle="collapse"
                    type="button"
            >
                Infos {data.title !== "" ? `zu ${data.title}` : ""}
            </button>
        </h2>
        <div class="accordion-collapse collapse show" id="collapseInfo">
            <!-- {data-bs-parent="#main-accordion"} -->
            <div class="accordion-body">
                <Header bind:data/>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
            <button
                    class="accordion-button"
                    data-bs-target="#collapseTeams"
                    data-bs-toggle="collapse"
                    type="button"
            >
                Mannschaften {`(${teams.length})`}
            </button>
        </h2>
        <div class="accordion-collapse collapse show" id="collapseTeams">
            <!-- {data-bs-parent="#main-accordion"} -->
            <div class="accordion-body">
                <Teams
                        bind:editMode
                        bind:teams
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
                    data-bs-target="#collapseMatches"
                    data-bs-toggle="collapse"
                    type="button"
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
        <div class="accordion-collapse collapse" id="collapseMatches">
            <!-- {data-bs-parent="#main-accordion"} -->
            <div class="accordion-body">
                <Order
                        bind:list
                        on:removeMatch={(e) =>
            dispatch("removeMatch", { matchId: e.detail.matchId })}
                        {teams}
                />
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header" id="headingThree">
            <button
                    class="accordion-button collapsed"
                    data-bs-target="#collapseTable"
                    data-bs-toggle="collapse"
                    type="button"
            >
                Tabelle
            </button>
        </h2>
        <div class="accordion-collapse collapse" id="collapseTable">
            <!-- {data-bs-parent="#main-accordion"} -->
            <div class="accordion-body">
                <Table {list} {teams}/>
            </div>
        </div>
    </div>
</div>
