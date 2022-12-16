<script lang="ts">
  import { onMount } from "svelte";
  import { doc, getDoc, onSnapshot } from "firebase/firestore";
  import db from "../model/firebase";
  import { bigTableLiga } from "../stores/contentStore";

  //   const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
  //     console.log("Current data: ", doc.data());
  //   });

  $: docRef = doc(db, "spielbogen", $bigTableLiga.toLowerCase());
  let results = [];
  let teamTable = new Set();
  let table = [];

  onMount(async () => {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      docSnap.data().spiele.forEach((day, i) => {
        results.push(JSON.parse(day));
      });
      //   console.log(results);
      results.forEach((result) => {
        result.teams.forEach((team) => {
          teamTable = new Set([...teamTable, team.name]);
        });
      });
      //   console.log(teamTable);
      table = [...teamTable].map((team) => {
        let games = 0;
        let wins = 0;
        let ties = 0;
        let loses = 0;
        let goals = 0;
        let gegenGoals = 0;

        results.forEach((result) => {
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
    } else {
      console.log("No such document!");
    }

    // console.log(table);
  });

  function getPlayedDays() {
    return "x"
  }
</script>

<h3>{$bigTableLiga.toUpperCase()} nach dem {getPlayedDays()}. Spieltag</h3>
<div class="table-responsive">
  <table class="table table-sm">
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
          <td>{team.goals} : {team.gegenGoals}</td>
          <td>({team.difference > 0 ? "+" : ""}{team.difference})</td>
          <td><span class="fw-bold">{team.points}</span></td>
          <td>{team.games}</td>
        </tr>
      {/each}
      <tr>
        <td />
        <td />
        <td
          >{table.length > 0 ? table.reduce((a, b) => a.goals + b.goals) : ""} :
          {table.length > 0
            ? table.reduce((a, b) => a.gegenGoals + b.gegenGoals)
            : ""}</td
        >
        <td />
        <td />
        <td />
      </tr>
    </tbody>
  </table>
</div>
