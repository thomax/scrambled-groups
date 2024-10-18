<script>
  // @ts-nocheck

  import {selectedClass, selectedClassMembers, numberOfAvailableUnits} from './stores.js'

  let localClassMembers

  let unitNumberOptions
  $: isUnitAssignEnabled = false

  const handleToggleMemberPresence = (memberIndex) => {
    localClassMembers[memberIndex]['isSelected'] = !localClassMembers[memberIndex]['isSelected']
    localClassMembers = [...localClassMembers]
    $selectedClassMembers = localClassMembers
  }

  const handleUnitAssign = (event, memberIndex) => {
    const unitNumber = isNaN(event.target.value) ? '-' : parseInt(event.target.value)
    localClassMembers[memberIndex]['selectedUnit'] = unitNumber - 1
    localClassMembers = [...localClassMembers]
    $selectedClassMembers = localClassMembers
  }

  const handleToggleUnitAssign = () => {
    isUnitAssignEnabled = !isUnitAssignEnabled
  }

  // listen for change in class selection
  selectedClass.subscribe((aClass) => {
    localClassMembers = aClass ? [...aClass.members] : []
    $selectedClassMembers = localClassMembers
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
    {#each localClassMembers as member, memberIndex}
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
