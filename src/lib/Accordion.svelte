<script lang="ts">
  import Header from "./Header.svelte";
  import Teams from "./Teams.svelte";
  import Order from "./Order.svelte";
  import Table from "./Table.svelte";

  import {matchList, metaInfo, teamList} from "../stores/contentStore";

  export let editMode: boolean;
</script>

<div class="accordion" id="main-accordion">
    <div class="accordion-item">
        <h2 class="accordion-header" id="headingInfo">
            <button
                    class="accordion-button collapsed"
                    data-bs-target="#collapseInfo"
                    data-bs-toggle="collapse"
                    type="button"
            >
                Infos {$metaInfo.title !== "" ? `zu ${$metaInfo.title}` : ""}
            </button>
        </h2>
        <div class="accordion-collapse collapse show" id="collapseInfo">
            <!-- {data-bs-parent="#main-accordion"} -->
            <div class="accordion-body">
                <Header/>
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
                Mannschaften {`(${$teamList.length})`}
            </button>
        </h2>
        <div class="accordion-collapse collapse show" id="collapseTeams">
            <!-- {data-bs-parent="#main-accordion"} -->
            <div class="accordion-body">
                <Teams bind:editMode/>
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
                $matchList.filter(
                    (match) =>
                        match.FinalScoreTeam1 != undefined &&
                        match.FinalScoreTeam2 != undefined
                ).length
            }/${$matchList.length})`}
            </button>
        </h2>
        <div class="accordion-collapse collapse" id="collapseMatches">
            <!-- {data-bs-parent="#main-accordion"} -->
            <div class="accordion-body">
                <Order/>
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
                <Table/>
            </div>
        </div>
    </div>
</div>
