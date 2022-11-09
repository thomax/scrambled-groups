<script>
  export let allGroups
  export let selectedGroup

  const urlParams = new URLSearchParams(window.location.search)
  const group = urlParams.get('group')

  const handleSelect = (event) => {
    const selectedLabel = event.target.value
    selectedGroup = getGroupByLabel(selectedLabel)
  }

  const getGroupByLabel = (label) => {
    return (selectedGroup = allGroups.find((group) => {
      return group.label === label
    }))
  }

  const wantedGroup = getGroupByLabel(urlParams.get('group'))
  selectedGroup = wantedGroup || allGroups[0]
</script>

<select on:change={handleSelect}>
  {#each allGroups as group}
    <option value={group.label} selected={group.label === selectedGroup.label}>
      {group.label}
    </option>
  {/each}
</select>
