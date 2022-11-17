<script>
  // @ts-nocheck
  import {afterUpdate} from 'svelte'

  import {scrambleArray} from './utils'

  let textAreaContent
  export let membersByGroup
  $: membersByGroup, membersByGroup && membersByGroup.length > 0 && produceTextAreaContent()

  afterUpdate(() => {
    setTextAreaHeight()
  })

  const handleScrambleGroup = (index) => {
    let scrambledGroup = scrambleArray(membersByGroup[index])
    membersByGroup[index] = scrambledGroup
    membersByGroup = [...membersByGroup]
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
    membersByGroup.forEach((group, index) => {
      textAreaContent += `Group ${index + 1}\n`
      textAreaContent += `${group.map((member) => member.name).join(', ')}\n`
      textAreaContent += '\n'
    })
    textAreaContent = textAreaContent.trim()
  }
</script>

<div class="classroom">
  {#each membersByGroup as group, index}
    <div class="group boxProps">
      <span class="groupNumber boxProps" on:click={() => handleScrambleGroup(index)}
        >{index + 1}</span
      >
      {#each group as member}
        <span class="name">
          {member.name}
        </span>
      {/each}
    </div>
  {/each}
</div>

{#if membersByGroup && membersByGroup.length > 0}
  <div>
    <textarea id="rawResultsTextArea" name="text" bind:value={textAreaContent} />
  </div>
{/if}

<style src="../app.css"></style>
