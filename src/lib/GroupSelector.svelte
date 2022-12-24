<script>
  // @ts-nocheck

  import {onMount} from 'svelte'
  import {allGroups} from './stores.js'

  export let selectedGroup = allGroups[0]

  const url = new URL(window.location.toString())

  onMount(async () => {
    const matchingGroup = getGroupByName(url.searchParams.get('group'))
    selectedGroup = matchingGroup || allGroups[0]
    updateParams(selectedGroup.name)
  })

  const updateParams = (groupName) => {
    url.searchParams.set('group', groupName)
    history.replaceState({}, '', url)
  }

  const handleSelect = (event) => {
    const groupName = event.target.value
    selectedGroup = getGroupByName(groupName)
    updateParams(selectedGroup.name)
  }

  const getGroupByName = (name) => {
    return (selectedGroup = allGroups.find((group) => {
      return group.name === name
    }))
  }
</script>

<select on:change={handleSelect}>
  {#each allGroups as group}
    <option value={group.name} selected={selectedGroup.name == group.name}>
      {group.name}
    </option>
  {/each}
</select>

<span class="memberCount">
  {`[${selectedGroup.members.length} member${selectedGroup.members.length == 1 ? '' : 's'}]`}
</span>
