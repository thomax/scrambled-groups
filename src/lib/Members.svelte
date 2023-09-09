<script>
  // @ts-nocheck

  import {selectedGroup, selectedGroupMembers} from './stores.js'

  let localGroupMembers

  const unitNumberOptions = ['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  $: isUnitAssignEnabled = false

  const handleToggleMemberPresence = (memberIndex) => {
    localGroupMembers[memberIndex]['isSelected'] = !localGroupMembers[memberIndex]['isSelected']
    localGroupMembers = [...localGroupMembers]
    $selectedGroupMembers = localGroupMembers
  }

  const handleUnitAssign = (event, memberIndex) => {
    const unitNumber = parseInt(event.target.value)
    localGroupMembers[memberIndex]['selectedUnit'] = unitNumber
    localGroupMembers = [...localGroupMembers]
    $selectedGroupMembers = localGroupMembers
  }

  const handleToggleUnitAssign = () => {
    isUnitAssignEnabled = !isUnitAssignEnabled
  }

  selectedGroup.subscribe((group) => {
    localGroupMembers = group ? group.members : []
    $selectedGroupMembers = localGroupMembers
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
              <option value={option} selected={option == member.selectedUnit}>
                {option}
              </option>
            {/each}
          </select>
        {/if}
      </li>
    {/each}
  </ul>
  <span class="toggleUnitAssign" on:click={handleToggleUnitAssign}>
    {#if isUnitAssignEnabled}%{:else}/{/if}
  </span>
</div>

<style src="../app.css"></style>
