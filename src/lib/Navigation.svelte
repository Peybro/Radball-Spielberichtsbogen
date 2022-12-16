<script lang="ts">
  import { onMount } from "svelte";
  import { doc, getDoc, onSnapshot } from "firebase/firestore";
  import db from "../model/firebase";
  import { matchToImport, bigTableLiga } from "../stores/contentStore";
  import { bigTableMode } from "../stores/booleanStore";

  //   const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
  //     console.log("Current data: ", doc.data());
  //   });

  const ligaName = "Oberfrankenliga";
  const docRef = doc(db, "spielbogen", ligaName.toLowerCase());
  let matches = [];

  onMount(async () => {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      matches = docSnap.data().spiele;
    } else {
      console.log("No such document!");
    }
  });

  function handlePresaveSelect(index: number) {
    $matchToImport = matches[index];
  }
</script>

<nav class="navbar bg-dark">
  <div class="container">
    <ul class="navbar-nav">
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
                >{JSON.parse(match).data.title}</button
              >
            </li>
          {/each}
        </ul>
      </li>
    </ul>
  </div>
</nav>
