<script>
  // @ts-nocheck

  import {afterUpdate, beforeUpdate} from 'svelte'
  import {scrambleArray, getRandomEmptyIndex} from './utils'
  import {
    membersByGroup,
    selectedClassMembers,
    isAnimationsEnabled,
    scrambledAt,
    numberOfAvailableGroups
  } from './stores.js'

  let groupSizes = []
  let members = []
  const defaultGroupSizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const defaultGroupSize = 2
  let groupSizeOptions = defaultGroupSizeOptions
  let selectedSize = defaultGroupSize
  let customSelectDropdown
  let mode = 'fixed'
  let isRemainderSeparate = true

  beforeUpdate(() => {
    if (mode == 'fixed') {
      applyFixedGroupSizes(selectedSize)
    }
  })

  afterUpdate(() => {
    if (isGroupPlanningComplete(members, groupSizes)) {
      $numberOfAvailableGroups = groupSizes.length
    } else {
      $numberOfAvailableGroups = undefined
    }
  })

  // Check if we know the size of all groups
  const isGroupPlanningComplete = (members, groupSizes) => {
    return (
      members.length ==
      groupSizes.reduce((acc, groupCount) => {
        return acc + groupCount
      }, 0)
    )
  }

  const handleSelectFixed = (event) => {
    selectedSize = parseInt(event.target.value)
    applyFixedGroupSizes(selectedSize)
  }

  const handleSelectCustom = (event) => {
    selectedSize = parseInt(event.target.value)
    groupSizes.push(selectedSize)
    // trigger svelte ui update
    groupSizes = [...groupSizes]
    // update dropdown content
    groupSizeOptions = calculateGroupSizeOptions(groupSizes, members.length)
    customSelectDropdown.selectedIndex = 0
  }

  const handleToggleMode = () => {
    groupSizes = []
    if (mode == 'fixed') {
      // all groups will be of same size
      selectedSize = defaultGroupSize
      groupSizeOptions = defaultGroupSizeOptions
    } else {
      // custom group sizes
      groupSizeOptions = calculateGroupSizeOptions(groupSizes, members.length)
    }
  }

  const handleRandomize = () => {
    $scrambledAt = new Date().toISOString()
    const randomizedMembers = scrambleArray(members)
    $membersByGroup = [...assignMembersToGroups(randomizedMembers)]
  }

  const handleToggleRemainder = () => {
    isRemainderSeparate = !isRemainderSeparate
  }

  const handleToggleAnimations = () => {
    $isAnimationsEnabled = !$isAnimationsEnabled
  }

  const calculateGroupSizeOptions = (groupSizesSoFar, maximum) => {
    const assignableCount =
      maximum - (groupSizesSoFar.length ? groupSizesSoFar.reduce((a, b) => a + b) : 0)
    return Array.from({length: assignableCount + 1}, (_, index) => index)
  }

  const applyFixedGroupSizes = (selectedSize) => {
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

  // This is where all the difficult stuff happens :)
  const assignMembersToGroups = (randomizedMembers) => {
    const result = []

    // init result
    groupSizes.forEach((groupSize, index) => {
      result[index] = new Array(groupSize)
    })

    // do first pass, assigning members with preferences (selectedGroup and maybe also selectedPosition)
    randomizedMembers
      .filter((member) => member.selectedGroup !== '-')
      .forEach((member) => {
        const wantedGroupIndex = member.selectedGroup
        const wantedGroup = result[wantedGroupIndex]
        if (member.selectedPosition === '-') {
          // no selected position, use random index
          const randomIndex = getRandomEmptyIndex(wantedGroup)
          wantedGroup[randomIndex] = member
        } else {
          // use the specified index
          wantedGroup[member.selectedPosition] = member
        }
        result[wantedGroupIndex] = wantedGroup
      })

    // do second pass, assigning users with no preference
    let groupIndex = 0
    let group = result[groupIndex]
    randomizedMembers
      .filter((member) => member.selectedGroup === '-')
      .forEach((member) => {
        let nextIndex = getRandomEmptyIndex(group)

        while (nextIndex == -1 && groupIndex < result.length - 1) {
          // if group is full, write it back to result and handle next
          groupIndex++
          group = result[groupIndex]
          nextIndex = getRandomEmptyIndex(group)
        }
        group[nextIndex] = member
        result[groupIndex] = group
      })
    result[groupIndex] = group
    return result
  }

  // listen for changes in class members
  selectedClassMembers.subscribe((value) => {
    // only care about selected members
    const previousFingerprint = members.map((member) => member.name).join(',')
    const updatedMembers = value ? value.filter((member) => member.isSelected) : []
    const updatedFingerprint = updatedMembers.map((member) => member.name).join(',')
    const isMemberListIdentical = previousFingerprint === updatedFingerprint
    members = updatedMembers
    // maybe update group sizes
    if (mode == 'fixed') {
      applyFixedGroupSizes(selectedSize)
    } else {
      // Members or selected status have been updated, reset groupSizes
      if (!isMemberListIdentical) {
        groupSizes = []
        groupSizeOptions = calculateGroupSizeOptions(groupSizes, members.length)
      }
    }
  })
</script>

<div class="radioButtonContainer boxProps">
  <div>
    <label>
      <input
        class="radio"
        type="radio"
        bind:group={mode}
        name="groupSelectMode"
        value={'fixed'}
        on:change={handleToggleMode}
      />

      <span class="labelCaption">Fixed group size</span>

      <select on:change={handleSelectFixed}>
        {#each groupSizeOptions as option}
          <option value={option} selected={option === selectedSize} disabled={mode !== 'fixed'}>
            {option}
          </option>
        {/each}
      </select>
      <span class="remaindersWidget">
        <input
          type="checkbox"
          on:change={() => handleToggleRemainder()}
          checked={isRemainderSeparate}
          disabled={mode !== 'fixed'}
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
        bind:group={mode}
        name="groupSelectMode"
        value={'custom'}
        on:change={handleToggleMode}
      />

      <span class="labelCaption">Custom group sizes</span>

      <select on:change={handleSelectCustom} bind:this={customSelectDropdown}>
        {#each groupSizeOptions as option}
          <option value={option} selected={false} disabled={mode !== 'custom'}>
            {option}
          </option>
        {/each}
      </select>
    </label>
  </div>
</div>

<h4>Members in each group</h4>
<div class="groupSizes">
  {#if groupSizes.length == 0}
    None. Assign custom group sizes in the above box.
  {:else}
    {#each groupSizes as groupSize}
      <span class="groupSizesDisplay boxProps">{groupSize}</span>
    {/each}
  {/if}
</div>
<div>
  <button class="scrambleButton" on:click={handleRandomize} disabled={groupSizes.length === 0}
    >Scramble!</button
  >
  <span class="remaindersWidget">
    <input
      type="checkbox"
      on:change={() => handleToggleAnimations()}
      checked={$isAnimationsEnabled}
    />
    Animate on scramble
  </span>
</div>

<style src="../app.css"></style>
