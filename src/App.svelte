<script>
  // @ts-nocheck

  import Icon from 'mdi-svelte'
  import {mdiCog, mdiCogOff} from '@mdi/js'
  import GroupSelector from './lib/GroupSelector.svelte'
  import MembersToggle from './lib/MembersToggle.svelte'
  import Widgets from './lib/Widgets.svelte'
  import StoredGroupsEditor from './lib/StoredGroupsEditor.svelte'
  import Results from './lib/Results.svelte'

  let isEditingMembers = false

  const handleToggleEditMembers = () => {
    isEditingMembers = !isEditingMembers
  }
</script>

<main class="wrapper">
  <div class="headerPanel panel">
    <h1 title="Because they're more fun that way">Scrambled Groups</h1>
    <div class="subtitle">
      <a
        class="toggleEditMembers {isEditingMembers ? 'selected' : ''}"
        name="edit"
        on:click={handleToggleEditMembers}
      >
        {#if isEditingMembers}
          Done editing members <Icon path={mdiCogOff} color="black" />
        {:else}
          Edit members <Icon path={mdiCog} color="black" />
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

  {#if isEditingMembers}
    <div class="editGroupsPanel panel">
      <StoredGroupsEditor />
    </div>
  {:else}
    <div class="groupPanel panel">
      <h2 class="panelHeading">Members</h2>
      <GroupSelector />
      <MembersToggle />
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
