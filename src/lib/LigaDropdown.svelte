<script lang="ts">
  import { onMount } from "svelte";
  import { doc, getDoc } from "firebase/firestore";
  import db from "../model/firebase";
  import { matchToImport, bigTableLiga } from "../stores/contentStore";
  import { bigTableMode } from "../stores/booleanStore";

  export let ligaName: string;

  const docRef = doc(db, "spielbogen", ligaName.toLowerCase());
  let matches = [];

  onMount(async () => {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      matches = docSnap.data()["spieltage"];
    } else {
      console.log("No such document!");
    }
  });

  function handlePresaveSelect(index: number) {
    $matchToImport = matches[index];
  }
</script>

<li class="nav-item dropdown">
  <button
    class="nav-link dropdown-toggle btn"
    type="button"
    data-bs-toggle="dropdown"
  >
    {ligaName}
  </button>
  <ul class="dropdown-menu">
    <li>
      <button
        class="dropdown-item text-wrap"
        on:click={() => {
          $bigTableLiga = ligaName;
          $bigTableMode = true;
        }}>Tabelle</button
      >
    </li>
    {#each matches as match, i}
      <li><hr class="dropdown-divider" /></li>
      <li>
        <button
          class="dropdown-item text-wrap"
          on:click={() => handlePresaveSelect(i)}
          >{JSON.parse(match).data.title}
        </button>
      </li>
    {/each}
  </ul>
</li>
