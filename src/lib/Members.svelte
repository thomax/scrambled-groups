<script>
  // @ts-nocheck

  import {selectedClass, selectedClassMembers, numberOfAvailableGroups} from './stores.js'

  let localClassMembers

  let groupNumberOptions
  $: isGroupAssignEnabled = false

  const handleToggleMemberPresence = (memberIndex) => {
    localClassMembers[memberIndex]['isSelected'] = !localClassMembers[memberIndex]['isSelected']
    localClassMembers = [...localClassMembers]
    $selectedClassMembers = localClassMembers
  }

  const handleGroupAssign = (event, memberIndex) => {
    const groupNumber = isNaN(event.target.value) ? '-' : parseInt(event.target.value)
    localClassMembers[memberIndex]['selectedGroup'] = groupNumber - 1
    localClassMembers = [...localClassMembers]
    $selectedClassMembers = localClassMembers
  }

  const handleToggleGroupAssign = () => {
    isGroupAssignEnabled = !isGroupAssignEnabled
  }

  // listen for change in class selection
  selectedClass.subscribe((aClass) => {
    localClassMembers = aClass?.members ? [...aClass.members] : []
    $selectedClassMembers = localClassMembers
  })

  // listen for change in number of groups available
  numberOfAvailableGroups.subscribe((value) => {
    if (value === undefined) {
      isGroupAssignEnabled = false
    } else {
      // Create correct number of groups in options
      groupNumberOptions = ['-']
      for (let i = 0; i < value; i++) {
        groupNumberOptions.push(i + 1)
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
        {#if isGroupAssignEnabled}
          <select class="groupAssign" on:change={(event) => handleGroupAssign(event, memberIndex)}>
            {#each groupNumberOptions as option}
              <option value={option} selected={option === member.selectedGroup + 1}>
                {option}
              </option>
            {/each}
          </select>
        {/if}
      </li>
    {/each}
  </ul>
  <span class="toggleGroupAssign" on:click={handleToggleGroupAssign}>
    {#if $numberOfAvailableGroups !== undefined}
      {#if isGroupAssignEnabled}%{:else}/{/if}
    {/if}
  </span>
</div>

<style src="../app.css"></style>
