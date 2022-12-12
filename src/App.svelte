<script lang="ts">
  import Accordion from "./lib/Accordion.svelte";
  import Team from "./model/Team";
  
  let data = {
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    chiefReferee: "",
    referee: "",
    duration: "2x7",
    notPlaying: "",
  };
  let teams = [
    new Team("Team1"),
    new Team("Team2"),
    new Team("Team3"),
    new Team("Team4"),
  ];
</script>

<main>
  <div class="container my-4">
    <Accordion bind:data bind:teams />
  </div>
</main>

<style>
</style>
