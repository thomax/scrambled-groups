<script>
  // @ts-nocheck

  import {afterUpdate, beforeUpdate} from 'svelte'
  import {scrambleArray} from './utils'
  import {
    membersByUnit,
    selectedGroupMembers,
    isAnimationsEnabled,
    scrambledAt,
    numberOfAvailableUnits
  } from './stores.js'

  let unitSizes = []
  let members = []
  const defaultUnitSizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const defaultUnitSize = 3
  let unitSizeOptions = defaultUnitSizeOptions
  let selectedSize = defaultUnitSize
  let customSelectDropdown
  let mode = 'fixed'
  let isRemainderSeparate = true

  beforeUpdate(() => {
    if (mode == 'fixed') {
      applyFixedUnitSizes(selectedSize)
    }
  })

  afterUpdate(() => {
    if (isUnitPlanningComplete(members, unitSizes)) {
      $numberOfAvailableUnits = unitSizes.length
    } else {
      $numberOfAvailableUnits = undefined
    }
  })

  const isUnitPlanningComplete = (members, unitSizes) => {
    return (
      members.length ==
      unitSizes.reduce((acc, unitCount) => {
        return acc + unitCount
      }, 0)
    )
  }

  const handleSelectFixed = (event) => {
    selectedSize = parseInt(event.target.value)
    applyFixedUnitSizes(selectedSize)
  }

  const handleSelectCustom = (event) => {
    selectedSize = parseInt(event.target.value)
    unitSizes.push(selectedSize)
    // trigger svelte ui update
    unitSizes = [...unitSizes]
    // update dropdown content
    unitSizeOptions = calculateUnitSizeOptions(unitSizes, members.length)
    customSelectDropdown.selectedIndex = 0
  }

  const handleToggleMode = () => {
    unitSizes = []
    if (mode == 'fixed') {
      // all groups will be of same size
      selectedSize = defaultUnitSize
      unitSizeOptions = defaultUnitSizeOptions
    } else {
      // custom group sizes
      unitSizeOptions = calculateUnitSizeOptions(unitSizes, members.length)
    }
  }

  const handleRandomize = () => {
    $scrambledAt = new Date().toISOString()
    const randomizedMembers = scrambleArray(members)
    const tempMembersByUnit = assignMembersToUnits(randomizedMembers)
    // scramble each unit again, to camoflage members with preselected units
    $membersByUnit = []
    $membersByUnit = [...tempMembersByUnit.map(scrambleArray)]
  }

  const handleToggleRemainder = () => {
    isRemainderSeparate = !isRemainderSeparate
  }

  const handleToggleAnimations = () => {
    $isAnimationsEnabled = !$isAnimationsEnabled
  }

  const calculateUnitSizeOptions = (unitSizesSoFar, maximum) => {
    const assignableCount =
      maximum - (unitSizesSoFar.length ? unitSizesSoFar.reduce((a, b) => a + b) : 0)
    return Array.from({length: assignableCount + 1}, (_, index) => index)
  }

  const applyFixedUnitSizes = (selectedSize) => {
    unitSizes = []
    let membersLeft = members.length
    while (membersLeft > 0) {
      const index = unitSizes.length - 1
      if (unitSizes[index] < selectedSize) {
        unitSizes[index]++
      } else {
        unitSizes[index + 1] = 1
      }
      membersLeft--
    }
    if (!isRemainderSeparate && unitSizes[unitSizes.length - 1] < selectedSize) {
      // last group size is too small, make the last ones bigger
      let lastUnitSize = unitSizes.pop()
      while (lastUnitSize > 0) {
        // divide them up
        unitSizes.every((_, index) => {
          unitSizes[index]++
          lastUnitSize--
          return lastUnitSize > 0
        })
      }
    }
    unitSizes = [...unitSizes]
  }

  // This is where all the difficult stuff happens :)
  const assignMembersToUnits = (randomizedMembers) => {
    const result = []
    // do first pass, assigning members with specific wanted units
    randomizedMembers
      .filter((member) => member.selectedUnit !== '-')
      .forEach((member) => {
        const wantedUnitIndex = member.selectedUnit - 1
        const wantedUnit = result[wantedUnitIndex] || []
        wantedUnit.push(member)
        result[wantedUnitIndex] = wantedUnit
      })

    // do second pass, assigning the rest
    let unitIndex = 0
    let unit = result[unitIndex] || []
    randomizedMembers
      .filter((member) => member.selectedUnit === '-')
      .forEach((member) => {
        while (unitSizes[unitIndex] <= unit.length) {
          // if unit is full, write it back to result and handle next
          result[unitIndex] = unit
          unitIndex++
          unit = result[unitIndex] || []
        }
        unit.push(member)
      })
    result[unitIndex] = unit
    return result
  }

  // listen for changes in group members
  selectedGroupMembers.subscribe((value) => {
    // only care about selected members
    const previousFingerprint = members.map((member) => member.name).join(',')
    const updatedMembers = value ? value.filter((member) => member.isSelected) : []
    const updatedFingerprint = updatedMembers.map((member) => member.name).join(',')
    const isMemberListIdentical = previousFingerprint === updatedFingerprint
    members = updatedMembers
    // maybe update unit sizes
    if (mode == 'fixed') {
      applyFixedUnitSizes(selectedSize)
    } else {
      // Members or selected status have been updated, reset unitSizes
      if (!isMemberListIdentical) {
        unitSizes = []
        unitSizeOptions = calculateUnitSizeOptions(unitSizes, members.length)
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
        name="unitSelectMode"
        value={'fixed'}
        on:change={handleToggleMode}
      />

      <span class="labelCaption">Fixed group size</span>

      <select on:change={handleSelectFixed}>
        {#each unitSizeOptions as option}
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
        name="unitSelectMode"
        value={'custom'}
        on:change={handleToggleMode}
      />

      <span class="labelCaption">Custom group sizes</span>

      <select on:change={handleSelectCustom} bind:this={customSelectDropdown}>
        {#each unitSizeOptions as option}
          <option value={option} selected={false} disabled={mode !== 'custom'}>
            {option}
          </option>
        {/each}
      </select>
    </label>
  </div>
</div>

<h4>Groups will look like this</h4>
<div class="unitSizes">
  {#if unitSizes.length == 0}
    no groups
  {:else}
    {#each unitSizes as unitSize}
      <span class="unitSizesDisplay boxProps">{unitSize}</span>
    {/each}
  {/if}
</div>
<div>
  <button class="scrambleButton" on:click={handleRandomize}>Scramble!</button>
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
