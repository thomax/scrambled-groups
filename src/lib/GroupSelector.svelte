<script>
  // @ts-nocheck

  import {onMount} from 'svelte'
  import {allGroups, selectedGroup} from './stores.js'

  const url = new URL(window.location.toString())
  let localSelectedGroup = allGroups[0]

  onMount(async () => {
    const matchingGroup = getGroupByName(url.searchParams.get('group'))
    $selectedGroup = matchingGroup || allGroups[0]
  })

  const updateParams = (groupName) => {
    url.searchParams.set('group', groupName)
    history.replaceState({}, '', url)
  }

  const handleSelect = (event) => {
    const groupName = event.target.value
    localSelectedGroup = getGroupByName(groupName)
    $selectedGroup = localSelectedGroup
  }

  const getGroupByName = (name) => {
    return (localSelectedGroup = allGroups.find((group) => {
      return group.name === name
    }))
  }

  selectedGroup.subscribe((value) => {
    if (value) {
      localSelectedGroup = value
      updateParams(localSelectedGroup.name)
    }
  })

  $: localSelectedGroup
</script>

<select on:change={handleSelect}>
  {#each allGroups as group}
    <option value={group.name} selected={localSelectedGroup.name == group.name}>
      {group.name}
    </option>
  {/each}
</select>

{#if localSelectedGroup}
  <span class="memberCount">
    {`[${localSelectedGroup.members.length} member${
      localSelectedGroup.members.length == 1 ? '' : 's'
    }]`}
  </span>
{/if}
