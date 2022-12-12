<script lang="ts">
  import Accordion from "./lib/Accordion.svelte";
  import Team from "./model/Team";

  import { count } from "./stores/store";

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

  let countValue;

  count.subscribe((value) => {
    countValue = value;
  });
</script>

<main>
  {countValue}
  <button on:click={() => count.update((c) => c + 1)}>+</button>
  <button on:click={() => count.update((c) => c - 1)}>-</button>
  <button on:click={() => count.set(0)}>reset</button>
  <div class="container my-4">
    <Accordion bind:data bind:teams />
  </div>
</main>

<style>
</style>
