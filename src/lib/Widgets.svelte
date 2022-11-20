<script>
  import {beforeUpdate} from 'svelte'
  import {scrambleArray} from './utils'
  export let members
  export let membersByUnit
  export let groupSizes = []

  const defaultGroupSizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let groupSizeOptions = defaultGroupSizeOptions
  let selectedSize = 3
  let individualSelectDropdown
  let groupSelectMode = 'uniform'
  let isRemainderSeparate = true

  beforeUpdate(() => {
    if (groupSelectMode == 'uniform') {
      applyUniformGroupSizes(selectedSize || 1)
    }
  })

  const handleSelectUniform = (event) => {
    selectedSize = parseInt(event.target.value)
    applyUniformGroupSizes(selectedSize)
  }

  const handleSelectIndividual = (event) => {
    selectedSize = parseInt(event.target.value)
    groupSizes.push(selectedSize)
    groupSizes = [...groupSizes]
    groupSizeOptions = calculateGroupSizeOptions(groupSizes, members.length)
    individualSelectDropdown.selectedIndex = 0
  }

  const handleToggleMode = () => {
    groupSizes = []
    if (groupSelectMode == 'uniform') {
      selectedSize = 1
      groupSizeOptions = defaultGroupSizeOptions
    } else {
      groupSizeOptions = calculateGroupSizeOptions(groupSizes, members.length)
    }
  }

  const calculateGroupSizeOptions = (groupSizesSoFar, maximum) => {
    const assignableCount =
      maximum - (groupSizesSoFar.length ? groupSizesSoFar.reduce((a, b) => a + b) : 0)
    return Array.from({length: assignableCount + 1}, (_, index) => index)
  }

  const applyUniformGroupSizes = (selectedSize) => {
    groupSizes = []
    let membersLeft = members.length
    while (membersLeft > 0) {
      const index = groupSizes.length - 1
      if (groupSizes[index] < selectedSize) {
        groupSizes[index]++
      } else {
        groupSizes[index + 1] = 1
      }
      membersLeft--
    }
    if (!isRemainderSeparate && groupSizes[groupSizes.length - 1] < selectedSize) {
      // last group size is too small, make the last ones bigger
      let lastGroupSize = groupSizes.pop()
      while (lastGroupSize > 0) {
        // divide them up
        groupSizes.every((_, index) => {
          groupSizes[index]++
          lastGroupSize--
          return lastGroupSize > 0
        })
      }
    }
    groupSizes = [...groupSizes]
  }

  const handleRandomize = () => {
    const randomizedMembers = scrambleArray(members)
    const tempmembersByUnit = assignMembersToGroups(randomizedMembers)
    // scramble each group again, to camoflage members with selected groups
    membersByUnit = tempmembersByUnit.map(scrambleArray)
  }

  const handleToggleRemainder = () => {
    isRemainderSeparate = !isRemainderSeparate
  }

  // This is where all the difficult stuff happens :)
  const assignMembersToGroups = (randomizedMembers) => {
    const result = []
    // do first pass, assigning members with specific wanted groups
    randomizedMembers
      .filter((member) => member.group !== '-')
      .forEach((member) => {
        const wantedGroupIndex = member.group - 1
        const wantedGroup = result[wantedGroupIndex] || []
        wantedGroup.push(member)
        result[wantedGroupIndex] = wantedGroup
      })

    // do second pass, assigning the rest
    let groupIndex = 0
    let group = result[groupIndex] || []

    randomizedMembers
      .filter((member) => member.group === '-')
      .forEach((member) => {
        while (groupSizes[groupIndex] <= group.length) {
          // if group is full, write it back to result and handle next
          result[groupIndex] = group
          groupIndex++
          group = result[groupIndex] || []
        }
        group.push(member)
      })
    result[groupIndex] = group
    return result
  }
</script>

<div class="radioButtonContainer boxProps">
  <div>
    <label>
      <input
        class="radio"
        type="radio"
        bind:group={groupSelectMode}
        name="groupSelectMode"
        value={'uniform'}
        on:change={handleToggleMode}
      />

      <span class="labelCaption">Group size</span>

      <select on:change={handleSelectUniform}>
        {#each groupSizeOptions as option}
          <option
            value={option}
            selected={option === selectedSize}
            disabled={groupSelectMode !== 'uniform'}
          >
            {option}
          </option>
        {/each}
      </select>
      <span class="remaindersWidget">
        <input
          type="checkbox"
          on:change={() => handleToggleRemainder()}
          checked={isRemainderSeparate}
          disabled={groupSelectMode !== 'uniform'}
        />
        Keep remainders separate
      </span>
    </label>
  </div>
  <div>
    <label>
      <input
        class="radio"
        type="radio"
        bind:group={groupSelectMode}
        name="groupSelectMode"
        value={'individual'}
        on:change={handleToggleMode}
      />

      <span class="labelCaption">Group sizes</span>

      <select on:change={handleSelectIndividual} bind:this={individualSelectDropdown}>
        {#each groupSizeOptions as option}
          <option value={option} selected={false} disabled={groupSelectMode !== 'individual'}>
            {option}
          </option>
        {/each}
      </select>
    </label>
  </div>
</div>

<h4>Groups will look like this</h4>
<div class="groupSizes">
  {#each groupSizes as groupSize}
    <span class="groupSizesDisplay boxProps">{groupSize}</span>
  {/each}
</div>
<div>
  <button class="scrambleButton" on:click={handleRandomize}>Scramble!</button>
</div>

<style src="../app.css"></style>
