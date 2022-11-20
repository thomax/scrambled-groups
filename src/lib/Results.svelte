<script>
  // @ts-nocheck
  import {afterUpdate} from 'svelte'
  import {scrambleArray} from './utils'

  let textAreaContent
  export let membersByUnit
  $: membersByUnit, membersByUnit && membersByUnit.length > 0 && produceTextAreaContent()

  afterUpdate(() => {
    setTextAreaHeight()
  })

  const handleScrambleUnit = (index) => {
    let scrambledUnit = scrambleArray(membersByUnit[index])
    membersByUnit[index] = scrambledUnit
    membersByUnit = [...membersByUnit]
  }

  const setTextAreaHeight = () => {
    const textArea = document.getElementById('rawResultsTextArea')
    if (textArea) {
      textArea.style.height = 0
      textArea.style.height = textArea.scrollHeight + 5 + 'px'
    }
  }

  const produceTextAreaContent = () => {
    textAreaContent = ''
    membersByUnit.forEach((unit, index) => {
      textAreaContent += `Group ${index + 1}\n`
      textAreaContent += `${unit.map((member) => member.name).join(', ')}\n`
      textAreaContent += '\n'
    })
    textAreaContent = textAreaContent.trim()
  }
</script>

<div class="classroom">
  {#each membersByUnit as unit, index}
    <div class="unit boxProps">
      <span class="unitNumber boxProps" on:click={() => handleScrambleUnit(index)}>{index + 1}</span
      >
      {#each unit as member}
        <span class="name">
          {member.name}
        </span>
      {/each}
    </div>
  {/each}
</div>

{#if membersByUnit && membersByUnit.length > 0}
  <div>
    <textarea id="rawResultsTextArea" name="text" bind:value={textAreaContent} />
  </div>
{/if}

<style src="../app.css"></style>
