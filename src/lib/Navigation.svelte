<script lang="ts">
  import LigaDropdown from "./LigaDropdown.svelte";
</script>

<nav class="navbar bg-dark">
  <div class="container">
    <ul class="navbar-nav">
      {#each ["Oberfranken_22-23"] as ligaName}
        <LigaDropdown {ligaName} />
      {/each}
    </ul>
  </div>
</nav>
