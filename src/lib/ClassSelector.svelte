<script>
  // @ts-nocheck

  import {onMount} from 'svelte'
  import {allClasses, selectedClass} from './stores.js'

  const url = new URL(window.location.toString())
  let localSelectedClass = allClasses[0]

  onMount(async () => {
    const matchingClass = getClassByName(
      // also use group for backwards compatibility
      url.searchParams.get('class') || url.searchParams.get('group')
    )
    $selectedClass = matchingClass || allClasses[0]
  })

  const updateParams = (className) => {
    url.searchParams.set('class', className)
    history.replaceState({}, '', url)
  }

  const handleSelect = (event) => {
    const className = event.target.value
    localSelectedClass = getGroupByName(className)
    $selectedClass = localSelectedClass
  }

  const getClassByName = (name) => {
    return (localSelectedClass = allClasses.find((aClass) => {
      return aClass.name === name
    }))
  }

  selectedClass.subscribe((value) => {
    if (value) {
      localSelectedClass = value
      updateParams(localSelectedClass.name)
    }
  })

  $: localSelectedClass
</script>

<select on:change={handleSelect}>
  {#each allClasses as aClass}
    <option value={aClass.name} selected={localSelectedClass.name == aClass.name}>
      {aClass.name}
    </option>
  {/each}
</select>

{#if localSelectedClass}
  <span class="memberCount">
    {`[${localSelectedClass.members.length} member${
      localSelectedClass.members.length == 1 ? '' : 's'
    }]`}
  </span>
{/if}
