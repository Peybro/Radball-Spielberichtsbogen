<script lang="ts">
  import { showClipboardSuccess } from "../stores/booleanStore";
  import {
    matchList,
    metaInfo,
    shortLink,
    teamList,
  } from "../stores/contentStore";

  let copySuccess = false;

  $: allDataAsObject = {
    data: { ...$metaInfo },
    teams: [...$teamList].map((team) => team.toObject()),
    matches: [...$matchList].map((match) => match.toObject()),
  };

  async function copyToClipboard() {
    const vercel = "https://radball-spielberichtsbogen.vercel.app";
    const longUrl = `${
      import.meta.env.DEV ? vercel : window.location.origin
    }/?val=${JSON.stringify(allDataAsObject)}`;

    await fetch(
      `https://api.tinyurl.com/create?api_token=${
        import.meta.env.VITE_TINYURL_APIKEY
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: longUrl,
          domain: "tinyurl.com",
          // alias: `${allDataAsObject.data.metaInfo.location.split(",")[0]}`,
          // tags: "example,link",
          // expires_at: "2024-10-25 10:11:12",
          // description: "string",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        navigator.clipboard.writeText(data.data.tiny_url);
        $shortLink = data.data.tiny_url;

        $showClipboardSuccess = true;
        copySuccess = true;
        setTimeout(() => {
          copySuccess = false;
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
</script>

<button class="btn btn-primary" on:click={copyToClipboard}
  >{#if copySuccess}
    <!-- large screen -->
    <span class="d-none d-md-block"
      >Link in Zwischenablage kopiert <i class="bi bi-clipboard-check" /></span
    >
    <!-- small screen -->
    <span class="d-md-none"><i class="bi bi-clipboard-check" /></span>
  {:else}
    <!-- large screen -->
    <span class="d-none d-md-block">Link teilen <i class="bi bi-share" /></span>
    <!-- small screen -->
    <span class="d-md-none"><i class="bi bi-share" /></span>
  {/if}
</button>
