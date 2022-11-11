<script>
  // @ts-nocheck

  export let groupMembers

  const groupOptions = ['-', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  $: isGroupAssignEnabled = false

  const handleToggle = (memberIndex) => {
    groupMembers[memberIndex]['isSelected'] = !groupMembers[memberIndex]['isSelected']
    groupMembers = [...groupMembers]
  }

  const handleGroupAssign = (event, memberIndex) => {
    const groupNumber = parseInt(event.target.value)
    groupMembers[memberIndex]['group'] = groupNumber
    groupMembers = [...groupMembers]
  }

  const handleToggleGroupAssign = () => {
    isGroupAssignEnabled = !isGroupAssignEnabled
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
        {#if isGroupAssignEnabled}
          <select class="groupAssign" on:change={(event) => handleGroupAssign(event, memberIndex)}>
            {#each groupOptions as option}
              <option value={option} selected={option == member.group}>
                {option}
              </option>
            {/each}
          </select>
        {/if}
      </li>
    {/each}
  </ul>
  <span class="toggleGroupAssign" on:click={handleToggleGroupAssign}>
    {#if isGroupAssignEnabled}%{:else}/{/if}
  </span>
</div>

<style src="../app.css"></style>
