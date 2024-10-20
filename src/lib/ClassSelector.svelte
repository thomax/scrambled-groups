<script>
  // @ts-nocheck

  import {onMount} from 'svelte'
  import {allClasses, selectedClass} from './stores.js'

  const url = new URL(window.location.toString())

  onMount(async () => {
    const matchingClass = getClassByName(
      // also use group for backwards compatibility
      url.searchParams.get('class') || url.searchParams.get('group')
    )
    $selectedClass = matchingClass || $allClasses[0]
  })

  const updateParams = (className) => {
    url.searchParams.set('class', className)
    history.replaceState({}, '', url)
  }

  const handleSelect = (event) => {
    const className = event.target.value
    $selectedClass = getClassByName(className)
    updateParams(className)
  }

  const getClassByName = (name) => {
    const klass = $allClasses.find((aClass) => {
      return aClass.name === name
    })
    return klass
  }
</script>

<select on:change={handleSelect}>
  {#each $allClasses as aClass}
    <option value={aClass.name} selected={$selectedClass.name == aClass.name}>
      {aClass.name}
    </option>
  {/each}
</select>

{#if $selectedClass.members}
  <span class="memberCount">
    {`[${$selectedClass.members.length} member${$selectedClass.members.length == 1 ? '' : 's'}]`}
  </span>
{/if}
