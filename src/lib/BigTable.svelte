<script lang="ts">
  import { onMount } from "svelte";
  import { doc, getDoc, onSnapshot } from "firebase/firestore";
  import db from "../model/firebase";
  import { bigTableLiga } from "../stores/contentStore";
  import Navigation from "./Navigation.svelte";

  $: docRef = doc(db, "spielbogen", $bigTableLiga.toLowerCase());
  let results = [];
  let teamTable = new Set();
  let table = [];
  let playedDays = 0;

  let custom = false;
  let customDays = 0;

  function setData(data) {
    results = [];
    teamTable = new Set();
    table = [];
    playedDays = 0;

    data.data()["spieltage"].forEach((day, i) => {
      results.push(JSON.parse(day));
    });
    results.forEach((result) => {
      // create list (Set) with unique teams
      result.teams.forEach((team) => {
        teamTable = new Set([...teamTable, team.name]);
      });

      // get so far played days
      const finalMatch = result["matches"][result["matches"].length - 1];
      if (
        finalMatch.hasOwnProperty("finalScoreTeam1") &&
        finalMatch.hasOwnProperty("finalScoreTeam2")
      ) {
        playedDays++;
      }
      if (!custom) customDays = playedDays;
    });
    // get summed up stats for each team
    table = [...teamTable].map((team) => {
      let games = 0;
      let wins = 0;
      let ties = 0;
      let loses = 0;
      let goals = 0;
      let gegenGoals = 0;

      results.forEach((result, i) => {
        if (customDays > i) {
          const teamObj = result.teams.find((t) => t.name === team);
          if (teamObj !== undefined) {
            const teamId = teamObj.id;
            result.matches.forEach((match) => {
              if (match.team1Id === teamId) {
                if (!isNaN(match.finalScoreTeam1)) {
                  games++;
                  goals += match.finalScoreTeam1;
                  gegenGoals += match.finalScoreTeam2;
                  if (match.finalScoreTeam1 > match.finalScoreTeam2) {
                    wins++;
                  } else if (match.finalScoreTeam2 > match.finalScoreTeam1) {
                    loses++;
                  } else if (match.finalScoreTeam2 === match.finalScoreTeam1) {
                    ties++;
                  }
                }
              } else if (match.team2Id === teamId) {
                if (!isNaN(match.finalScoreTeam2)) {
                  games++;
                  goals += match.finalScoreTeam2;
                  gegenGoals += match.finalScoreTeam1;
                  if (match.finalScoreTeam2 > match.finalScoreTeam1) {
                    wins++;
                  } else if (match.finalScoreTeam1 > match.finalScoreTeam2) {
                    loses++;
                  } else if (match.finalScoreTeam1 === match.finalScoreTeam2) {
                    ties++;
                  }
                }
              }
            });
          }
        }
      });

      return {
        team,
        games,
        wins,
        ties,
        loses,
        goals,
        gegenGoals,
        difference: goals - gegenGoals,
        points: wins * 3 + ties,
      };
    });
  }

  async function prepareSetData() {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setData(docSnap);
    } else {
      console.log("No such document!");
    }
  }

  onMount(async () => {
    // onSnapshot(docRef, (doc) => {
    //   setData(doc);
    // });

    prepareSetData();
  });

  function sum(items: any[], prop: string) {
    return items.reduce(function (a, b) {
      return a + b[prop];
    }, 0);
  }
</script>

<h3>
  {$bigTableLiga.toUpperCase()} nach dem {custom ? customDays : playedDays}.
  Spieltag
  <a
    type="button"
    class="btn btn-primary"
    href={`?liga=${$bigTableLiga.toLowerCase()}`}><i class="bi bi-share" /></a
  >
</h3>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Mannschaft</th>
        <th scope="col">Tore</th>
        <th scope="col" />
        <th scope="col">Punkte</th>
        <th scope="col">Spiele</th>
      </tr>
    </thead>
    <tbody>
      {#each table
        .sort((a, b) => b.difference - a.difference)
        .sort((a, b) => b.points - a.points) as team, i}
        <tr>
          <th scope="row">{i + 1}.</th>
          <td>{team.team}</td>
          <td class="text-nowrap">{team.goals} : {team.gegenGoals}</td>
          <td>({team.difference > 0 ? "+" : ""}{team.difference})</td>
          <td><span class="fw-bold">{team.points}</span></td>
          <td>{team.games}</td>
        </tr>
      {:else}
        <div class="alert alert-warning" role="alert">
          <h4 class="alert-heading">
            Entweder es gibt keinen Eintrag mit dem Namen "{$bigTableLiga}",
            oder es wurden noch keine Spiele eingetragen.
          </h4>
        </div>
      {/each}
      <tr>
        <td />
        <td />
        <td class="text-nowrap"
          >{table.length > 0 ? sum(table, "goals") : ""} :
          {table.length > 0 ? sum(table, "gegenGoals") : ""}</td
        >
        <td />
        <td />
        <td />
      </tr>
    </tbody>
  </table>
</div>

<div>Nach Spieltagen:</div>
<div class="d-flex justify-content-between">
  {#each results as day, i}
    <button
      class={`btn btn-${i < playedDays ? "primary" : "secondary"}`}
      on:click={() => {
        custom = true;
        customDays = i + 1;
        prepareSetData();
      }}>{i + 1}</button
    >
  {/each}
</div>
