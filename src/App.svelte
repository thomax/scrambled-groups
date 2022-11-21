<script>
  // @ts-nocheck

  import Icon from 'mdi-svelte'
  import {mdiCog, mdiCogOff} from '@mdi/js'
  import GroupSelector from './lib/GroupSelector.svelte'
  import MembersToggle from './lib/MembersToggle.svelte'
  import Widgets from './lib/Widgets.svelte'
  import StoredGroupsEditor from './lib/StoredGroupsEditor.svelte'
  import Results from './lib/Results.svelte'
  import {storedGroups} from './lib/stores.js'

  let allGroups = []
  let selectedGroup = allGroups[0]
  let groupMembers = []
  let membersByUnit = []
  let isEditingGroups = false

  const updateSelectedMembers = () => {
    groupMembers = selectedGroup ? selectedGroup.members.map(objectifyMember) : []
  }

  // Update allGroups whenever conent of LocalStorage changes
  storedGroups.subscribe((value) => {
    allGroups = value.split('\n').map((rawGroup) => {
      const [name, rawMembers] = rawGroup.split(':')
      const members = rawMembers ? rawMembers.split(',').map((member) => member.trim()) : []
      return {name: name.trim(), members}
    })
  })

  // Incoming members is an array of strings (names)
  // To enable member attributes, make each an object
  const objectifyMember = (member) => {
    if (member instanceof Object) {
      return member
    } else {
      return {name: member, selectedUnit: '-', isSelected: true}
    }
  }

  const handleToggleEditGroups = () => {
    isEditingGroups = !isEditingGroups
  }

  $: selectedGroup, updateSelectedMembers()
  $: groupMembers
  $: membersByUnit = []
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
      <GroupSelector bind:selectedGroup {allGroups} />
      <span class="memberCount">
        {`[${groupMembers.length} member${groupMembers.length == 1 ? '' : 's'}]`}
      </span>
      <MembersToggle bind:groupMembers />
    </div>

    <div class="widgetsPanel panel">
      <h2 class="panelHeading">Widgets</h2>
      <Widgets bind:membersByUnit members={groupMembers.filter((member) => member.isSelected)} />
    </div>

    <div class="resultsPanel panel">
      <h2 class="panelHeading">Results</h2>
      <Results {membersByUnit} />
    </div>
  {/if}
</main>

<style src="./app.css"></style>
