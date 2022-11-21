<script>
  // @ts-nocheck
  export let groupMembers

  const unitNumberOptions = ['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  $: isUnitAssignEnabled = false

  const handleToggle = (memberIndex) => {
    groupMembers[memberIndex]['isSelected'] = !groupMembers[memberIndex]['isSelected']
    groupMembers = [...groupMembers]
  }

  const handleUnitAssign = (event, memberIndex) => {
    const unitNumber = parseInt(event.target.value)
    groupMembers[memberIndex]['selectedUnit'] = unitNumber
    groupMembers = [...groupMembers]
  }

  const handleToggleUnitAssign = () => {
    isUnitAssignEnabled = !isUnitAssignEnabled
  }
</script>

<div class="membersContainer boxProps">
  <ul>
    {#each groupMembers as member, memberIndex}
      <li>
        <label>
          <input
            type="checkbox"
            on:change={() => handleToggle(memberIndex)}
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
