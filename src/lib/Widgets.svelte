<script>
  import {beforeUpdate} from 'svelte'
  import {scrambleArray} from './utils'
  export let members
  export let membersByUnit
  export let unitSizes = []

  const defaultUnitSizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let unitSizeOptions = defaultUnitSizeOptions
  let selectedSize = 3
  let individualSelectDropdown
  let unitSelectMode = 'uniform'
  let isRemainderSeparate = true

  beforeUpdate(() => {
    if (unitSelectMode == 'uniform') {
      applyUniformUnitSizes(selectedSize || 1)
    }
  })

  const handleSelectUniform = (event) => {
    selectedSize = parseInt(event.target.value)
    applyUniformUnitSizes(selectedSize)
  }

  const handleSelectIndividual = (event) => {
    selectedSize = parseInt(event.target.value)
    unitSizes.push(selectedSize)
    unitSizes = [...unitSizes]
    unitSizeOptions = calculateUnitSizeOptions(unitSizes, members.length)
    individualSelectDropdown.selectedIndex = 0
  }

  const handleToggleMode = () => {
    unitSizes = []
    if (unitSelectMode == 'uniform') {
      selectedSize = 1
      unitSizeOptions = defaultUnitSizeOptions
    } else {
      unitSizeOptions = calculateUnitSizeOptions(unitSizes, members.length)
    }
  }

  const calculateUnitSizeOptions = (unitSizesSoFar, maximum) => {
    const assignableCount =
      maximum - (unitSizesSoFar.length ? unitSizesSoFar.reduce((a, b) => a + b) : 0)
    return Array.from({length: assignableCount + 1}, (_, index) => index)
  }

  const applyUniformUnitSizes = (selectedSize) => {
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

  const handleRandomize = () => {
    const randomizedMembers = scrambleArray(members)
    const tempmembersByUnit = assignMembersToUnits(randomizedMembers)
    // scramble each unit again, to camoflage members with preselected units
    membersByUnit = tempmembersByUnit.map(scrambleArray)
  }

  const handleToggleRemainder = () => {
    isRemainderSeparate = !isRemainderSeparate
  }

  // This is where all the difficult stuff happens :)
  const assignMembersToUnits = (randomizedMembers) => {
    const result = []
    // do first pass, assigning members with specific wanted units
    randomizedMembers
      .filter((member) => member.group !== '-')
      .forEach((member) => {
        const wantedUnitIndex = member.group - 1
        const wantedUnit = result[wantedUnitIndex] || []
        wantedUnit.push(member)
        result[wantedUnitIndex] = wantedUnit
      })

    // do second pass, assigning the rest
    let unitIndex = 0
    let unit = result[unitIndex] || []

    randomizedMembers
      .filter((member) => member.group === '-')
      .forEach((member) => {
        while (unitSizes[unitIndex] <= unit.length) {
          // if group is full, write it back to result and handle next
          result[unitIndex] = unit
          unitIndex++
          unit = result[unitIndex] || []
        }
        unit.push(member)
      })
    result[unitIndex] = unit
    return result
  }
</script>

<div class="radioButtonContainer boxProps">
  <div>
    <label>
      <input
        class="radio"
        type="radio"
        bind:group={unitSelectMode}
        name="unitSelectMode"
        value={'uniform'}
        on:change={handleToggleMode}
      />

      <span class="labelCaption">Group size</span>

      <select on:change={handleSelectUniform}>
        {#each unitSizeOptions as option}
          <option
            value={option}
            selected={option === selectedSize}
            disabled={unitSelectMode !== 'uniform'}
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
          disabled={unitSelectMode !== 'uniform'}
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
        bind:group={unitSelectMode}
        name="unitSelectMode"
        value={'individual'}
        on:change={handleToggleMode}
      />

      <span class="labelCaption">Group sizes</span>

      <select on:change={handleSelectIndividual} bind:this={individualSelectDropdown}>
        {#each unitSizeOptions as option}
          <option value={option} selected={false} disabled={unitSelectMode !== 'individual'}>
            {option}
          </option>
        {/each}
      </select>
    </label>
  </div>
</div>

<h4>Groups will look like this</h4>
<div class="groupSizes">
  {#each unitSizes as groupSize}
    <span class="unitSizesDisplay boxProps">{groupSize}</span>
  {/each}
</div>
<div>
  <button class="scrambleButton" on:click={handleRandomize}>Scramble!</button>
</div>

<style src="../app.css"></style>
