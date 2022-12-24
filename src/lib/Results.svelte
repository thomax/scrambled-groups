<script>
  // @ts-nocheck
  import {afterUpdate} from 'svelte'
  import {scrambleArray} from './utils'
  import {membersByUnit} from './stores.js'

  let textAreaContent
  let localMembersByUnit = []

  afterUpdate(() => {
    setTextAreaHeight()
  })

  const handleScrambleUnit = (index) => {
    let scrambledUnit = scrambleArray(localMembersByUnit[index])
    localMembersByUnit[index] = scrambledUnit
    $membersByUnit = [...localMembersByUnit]
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
    localMembersByUnit.forEach((unit, index) => {
      textAreaContent += `Group ${index + 1}\n`
      textAreaContent += `${unit.map((member) => member.name).join(', ')}\n`
      textAreaContent += '\n'
    })
    textAreaContent = textAreaContent.trim()
  }

  membersByUnit.subscribe((value) => {
    if (value && value.length > 0) {
      localMembersByUnit = value
      produceTextAreaContent()
    }
  })
</script>

{#if localMembersByUnit && localMembersByUnit.length > 0}
  <div class="classroom">
    {#each localMembersByUnit as unit, index}
      <div class="unit boxProps">
        <span class="unitNumber boxProps" on:click={() => handleScrambleUnit(index)}
          >{index + 1}</span
        >
        {#each unit as member}
          <span class="name">
            {member.name}
          </span>
        {/each}
      </div>
    {/each}
  </div>

  <div>
    <textarea id="rawResultsTextArea" name="text" bind:value={textAreaContent} />
  </div>
{/if}

<style src="../app.css"></style>
