<script lang="ts">
    import type {data} from "../model/types";

    export let metaInfo: data;
    export let teamList;
    export let matchList;

    function formatDate(date: string) {
        const tempDate = new Date(date);
        return `${
            ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][tempDate.getDay()]
        }, ${tempDate.toLocaleDateString()}`;
    }

    function getTeamNameById(id: string) {
        return teamList.find((team) => team.Id === id).Name;
    }
</script>

<div class="print">
    <h3 id="title">{metaInfo.title}</h3>
    <section class="row" id="info">
        <div class="col-2"/>
        <div class="col-auto mb-2" id="location">
            <div>Spieltag am {formatDate(metaInfo.date)} {metaInfo.startTime} Uhr</div>
            {#each metaInfo.location.split("\n") as line}
                <div>{line}</div>
            {/each}
        </div>
        <div>
            <span id="chief">Chief-Kommissär: {metaInfo.chiefReferee}</span><span
                id="referees">Kommissär: {metaInfo.referee}</span
        >
        </div>
        <div id="duration">Spielzeit: {metaInfo.duration} Minuten</div>
        <div class="row" id="notPlaying">
            <div class="col-2">Spielfrei:</div>
            <div class="col-auto">
                {#each metaInfo.notPlaying.split("\n") as line}
                    <div>{line}</div>
                {/each}
            </div>
        </div>
    </section>
    <section>
        <table class="w-100">
            <thead>
            <tr>
                <th/>
                <th/>
                <th/>
                <th/>
                <th>Halbzeit</th>
                <th>Endstand</th>
                <th>Kommissär</th>
            </tr>
            </thead>
            <tbody>
            {#each matchList as match, i}
                <tr>
                    <td>{i + 1}.</td>
                    <td>{getTeamNameById(match.Team1Id)}</td>
                    <td>-</td>
                    <td>{getTeamNameById(match.Team2Id)}</td>
                    <td>( {match.HalfTimeScoreTeam1} : {match.HalfTimeScoreTeam2} )</td>
                    <td>{match.HalfTimeScoreTeam1} : {match.HalfTimeScoreTeam2}</td>
                    <td>{match.Referee}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </section>
    <section class="mt-5">
        <div class="lines"/>
        <div class="lines"/>
        <div class="lines"/>
        <div class="lines"/>
        <div class="lines"/>
        <div class="lines"/>
        <div class="lines"/>
        <div class="row lines">
            <div class="col-6">Chief-Kommissär:</div>
            <div class="col-6">Kommissär:</div>
        </div>
        <div class="lines">Schriftführer:</div>
    </section>
</div>
