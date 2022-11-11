<script>
  export let allGroups
  export let selectedGroup

  const urlParams = new URLSearchParams(window.location.search)
  const group = urlParams.get('group')

  const handleSelect = (event) => {
    const selectedName = event.target.value
    selectedGroup = getGroupByName(selectedName)
  }

  const getGroupByName = (name) => {
    return (selectedGroup = allGroups.find((group) => {
      return group.name === name
    }))
  }

  const wantedGroup = getGroupByName(urlParams.get('group'))
  selectedGroup = wantedGroup || allGroups[0]
</script>

<select on:change={handleSelect}>
  {#each allGroups as group}
    <option value={group.name} selected={group.name === selectedGroup.name}>
      {group.name}
    </option>
  {/each}
</select>
