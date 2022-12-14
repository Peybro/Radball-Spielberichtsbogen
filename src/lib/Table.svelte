<script lang="ts">
  import Result from "../model/Result";

  import { teamList, matchList } from "./../stores/store";

  $: result = [...$teamList].map((team) => {
    let games = 0;
    let wins = 0;
    let ties = 0;
    let loses = 0;
    let goals = 0;
    let conceded = 0;

    $matchList.forEach((match) => {
      if (team.Id === match.Team1Id && match.FinalScoreTeam1 !== undefined) {
        games++;
        if (match.FinalScoreTeam1 > match.FinalScoreTeam2) wins++;
        if (match.FinalScoreTeam1 === match.FinalScoreTeam2) ties++;
        if (match.FinalScoreTeam1 < match.FinalScoreTeam2) loses++;

        goals += match.FinalScoreTeam1;
        conceded += match.FinalScoreTeam2;
      } else if (
        team.Id === match.Team2Id &&
        match.FinalScoreTeam2 !== undefined
      ) {
        games++;
        if (match.FinalScoreTeam2 > match.FinalScoreTeam1) wins++;
        if (match.FinalScoreTeam2 === match.FinalScoreTeam1) ties++;
        if (match.FinalScoreTeam2 < match.FinalScoreTeam1) loses++;

        goals += match.FinalScoreTeam2;
        conceded += match.FinalScoreTeam1;
      }
    });

    return new Result(team.Name, games, wins, ties, loses, goals, conceded);
  });

  $: sortedResult = [...result]
    .sort((a, b) => b.Difference - a.Difference)
    .sort((a, b) => b.Points - a.Points);
</script>

<div class="table-responsive">
  <table class="table">
    {#if sortedResult.length > 0}
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Mannschaft</th>
          <th scope="col">Spiele</th>
          <th scope="col">s</th>
          <th scope="col">u</th>
          <th scope="col">n</th>
          <th scope="col">Punkte</th>
          <th scope="col">Tore</th>
          <th scope="col">GT</th>
          <th scope="col">Diff.</th>
        </tr>
      </thead>
    {/if}
    <tbody>
      {#each sortedResult as teamResult, index (`result-${index}`)}
        <tr>
          <td>{index + 1}</td>
          <td>{teamResult.Team}</td>
          <td>{teamResult.Games}</td>
          <td>{teamResult.Wins}</td>
          <td>{teamResult.Ties}</td>
          <td>{teamResult.Loses}</td>
          <td>{teamResult.Points}</td>
          <td>{teamResult.Goals}</td>
          <td>{teamResult.Conceded}</td>
          <td>{teamResult.Difference}</td>
        </tr>
      {:else}
        <p>Noch keine Ergebnisse.</p>
      {/each}
    </tbody>
  </table>
</div>
