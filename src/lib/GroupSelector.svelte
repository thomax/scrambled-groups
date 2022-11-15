<script>
  import {onMount} from 'svelte'
  export let allGroups
  export let selectedGroup = allGroups[0]

  onMount(async () => {
    const groupFromPath = decodeURI(window.location.pathname).split('/')[1]
    const matchingGroup = getGroupByName(groupFromPath)
    if (matchingGroup) {
      selectedGroup = matchingGroup
    } else {
      selectedGroup = allGroups[0]
    }
    updateLocation(selectedGroup)
  })

  const updateLocation = (group) => {
    history.pushState(`/${group.name}`, '', `/${group.name}`)
  }

  const handleSelect = (event) => {
    const selectedName = event.target.value
    selectedGroup = getGroupByName(selectedName)
    updateLocation(selectedGroup)
  }

  const getGroupByName = (name) => {
    return (selectedGroup = allGroups.find((group) => {
      return group.name === name
    }))
  }
</script>

<select on:change={handleSelect}>
  {#each allGroups as group}
    <option value={group.name} selected={group.name === selectedGroup.name}>
      {group.name}
    </option>
  {/each}
</select>
