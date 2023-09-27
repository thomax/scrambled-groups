<script>
  // @ts-nocheck

  import Icon from 'mdi-svelte'
  import {mdiCog, mdiCogOff} from '@mdi/js'
  import GroupSelector from './lib/GroupSelector.svelte'
  import Members from './lib/Members.svelte'
  import Widgets from './lib/Widgets.svelte'
  import SettingsEditor from './lib/SettingsEditor.svelte'
  import Results from './lib/Results.svelte'

  let isEditingSettings = false

  const handleToggleEditSettings = () => {
    isEditingSettings = !isEditingSettings
  }
</script>

<main class="wrapper">
  <div class="headerPanel panel">
    <h1 title="Because they're more fun that way">Scrambled Groups</h1>
    <div class="subtitle">
      <a
        class="toggleEditMembers {isEditingSettings ? 'selected' : ''}"
        name="edit"
        on:click={handleToggleEditSettings}
      >
        {#if isEditingSettings}
          Done editing settings <Icon path={mdiCogOff} color="black" />
        {:else}
          Edit settings <Icon path={mdiCog} color="black" />
        {/if}
      </a>
      <span class="whoDunnit">
        Made with 🤨, 💚 and ☕️ by <a
          href="https://github.com/thomax/scrambled-groups"
          target="_blank">thomax</a
        >
      </span>
    </div>
  </div>

  {#if isEditingSettings}
    <div class="editSettingsPanel panel">
      <SettingsEditor />
    </div>
  {:else}
    <div class="groupPanel panel">
      <h2 class="panelHeading">Members</h2>
      <GroupSelector />
      <Members />
    </div>

    <div class="widgetsPanel panel">
      <h2 class="panelHeading">Group size</h2>
      <Widgets />
    </div>

    <div class="resultsPanel panel">
      <h2 class="panelHeading">Results</h2>
      <Results />
    </div>
  {/if}
</main>

<style src="./app.css"></style>
