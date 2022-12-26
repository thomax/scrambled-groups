<script>
  // @ts-nocheck

  import Icon from 'mdi-svelte'
  import {mdiCog, mdiCogOff} from '@mdi/js'
  import GroupSelector from './lib/GroupSelector.svelte'
  import MembersToggle from './lib/MembersToggle.svelte'
  import Widgets from './lib/Widgets.svelte'
  import StoredGroupsEditor from './lib/StoredGroupsEditor.svelte'
  import Results from './lib/Results.svelte'

  let isEditingGroups = false

  const handleToggleEditGroups = () => {
    isEditingGroups = !isEditingGroups
  }
</script>

<main class="wrapper">
  <div class="headerPanel panel">
    <h1 title="Because they're more fun that way">Scrambled Groups</h1>
    <div class="subtitle">
      <a
        class="toggleEditGroups {isEditingGroups ? 'selected' : ''}"
        name="edit"
        on:click={handleToggleEditGroups}
      >
        {#if isEditingGroups}
          Done editing groups <Icon path={mdiCogOff} color="black" />
        {:else}
          Edit groups <Icon path={mdiCog} color="black" />
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

  {#if isEditingGroups}
    <div class="editGroupsPanel panel">
      <StoredGroupsEditor />
    </div>
  {:else}
    <div class="groupPanel panel">
      <h2 class="panelHeading">Group</h2>
      <GroupSelector />
      <MembersToggle />
    </div>

    <div class="widgetsPanel panel">
      <h2 class="panelHeading">Widgets</h2>
      <Widgets />
    </div>

    <div class="resultsPanel panel">
      <h2 class="panelHeading">Results</h2>
      <Results />
    </div>
  {/if}
</main>

<style src="./app.css"></style>
