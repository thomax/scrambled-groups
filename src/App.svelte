<script>
  import GroupSelector from './lib/GroupSelector.svelte'
  import MembersToggle from './lib/MembersToggle.svelte'
  import Widgets from './lib/Widgets.svelte'
  import Results from './lib/Results.svelte'
  import allGroups from './lib/groups.json'

  let selectedGroup = allGroups[0]
  let groupMembers = []
  let membersByGroup = []

  const updateSelectedMembers = () => {
    groupMembers = objectifyMembers(selectedGroup.members)
    groupSizes = [0]
  }

  // Incoming members is an array of strings (names)
  // To enable group assign, each member needs a group variable
  const objectifyMembers = (members) => {
    return members.map((item) => {
      if (item instanceof Object) {
        return item
      } else {
        return {name: item, group: '-', isSelected: true}
      }
    })
  }

  $: selectedGroup, updateSelectedMembers()
  $: groupMembers
  $: membersByGroup = []
  $: groupSizes = []
</script>

<main class="wrapper">
  <div class="namesPanel panel">
    <h2 class="panelHeading">Names</h2>
    <GroupSelector bind:selectedGroup {allGroups} />
    <MembersToggle bind:groupMembers />
  </div>

  <div class="widgetsPanel panel">
    <h2 class="panelHeading">Widgets</h2>
    <Widgets
      bind:membersByGroup
      bind:groupSizes
      members={groupMembers.filter((member) => member.isSelected)}
    />
  </div>

  <div class="resultsPanel panel">
    <h2 class="panelHeading">Results</h2>
    <Results {membersByGroup} />
  </div>

  <div class="whoDunnitPanel panel">
    <span>Made with 🧐 and ☕️ by <a href="https://github.com/thomax">thomax</a></span>
  </div>
</main>

<style src="./app.css"></style>
