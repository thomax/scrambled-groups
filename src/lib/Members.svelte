<script>
  // @ts-nocheck

  import {selectedGroup, selectedGroupMembers, numberOfAvailableUnits} from './stores.js'

  let localGroupMembers

  let unitNumberOptions
  $: isUnitAssignEnabled = false

  const handleToggleMemberPresence = (memberIndex) => {
    localGroupMembers[memberIndex]['isSelected'] = !localGroupMembers[memberIndex]['isSelected']
    localGroupMembers = [...localGroupMembers]
    $selectedGroupMembers = localGroupMembers
  }

  const handleUnitAssign = (event, memberIndex) => {
    const unitNumber = isNaN(event.target.value) ? '-' : parseInt(event.target.value)
    localGroupMembers[memberIndex]['selectedUnit'] = unitNumber - 1
    localGroupMembers = [...localGroupMembers]
    $selectedGroupMembers = localGroupMembers
  }

  const handleToggleUnitAssign = () => {
    isUnitAssignEnabled = !isUnitAssignEnabled
  }

  // listen for change in group selection
  selectedGroup.subscribe((group) => {
    localGroupMembers = group ? [...group.members] : []
    $selectedGroupMembers = localGroupMembers
  })

  // listen for change in number of units available
  numberOfAvailableUnits.subscribe((value) => {
    if (value === undefined) {
      isUnitAssignEnabled = false
    } else {
      // Create correct number of units in options
      unitNumberOptions = ['-']
      for (let i = 0; i < value; i++) {
        unitNumberOptions.push(i + 1)
      }
    }
  })
</script>

<div class="membersContainer boxProps">
  <ul>
    {#each localGroupMembers as member, memberIndex}
      <li>
        <label>
          <input
            type="checkbox"
            on:change={() => handleToggleMemberPresence(memberIndex)}
            checked={member.isSelected}
          />
          {member.name}
        </label>
        {#if isUnitAssignEnabled}
          <select class="unitAssign" on:change={(event) => handleUnitAssign(event, memberIndex)}>
            {#each unitNumberOptions as option}
              <option value={option} selected={option == member.selectedUnit + 1}>
                {option}
              </option>
            {/each}
          </select>
        {/if}
      </li>
    {/each}
  </ul>
  <span class="toggleUnitAssign" on:click={handleToggleUnitAssign}>
    {#if $numberOfAvailableUnits !== undefined}
      {#if isUnitAssignEnabled}%{:else}/{/if}
    {/if}
  </span>
</div>

<style src="../app.css"></style>
