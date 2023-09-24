<script>
  // @ts-nocheck
  import {afterUpdate} from 'svelte'
  import {scrambleArray, random} from './utils'
  import {membersByUnit, isAnimationsEnabled, scrambledAt} from './stores.js'
  import PlusMark from './PlusMark.svelte'

  let textAreaContent // content of the copy/paste friendly version
  let previousScrambledAt // last time a scramble was performed
  $: localMembersByUnit = [] // local usage of units and members
  $: placeholdersByIndex = {} // keeps track of unit placeholders

  afterUpdate(() => {
    setTextAreaHeight()
    if ($isAnimationsEnabled && $scrambledAt !== previousScrambledAt) {
      startAnimation()
    }
    previousScrambledAt = $scrambledAt
  })

  const handleScrambleUnit = (index) => {
    let scrambledUnit = scrambleArray(localMembersByUnit[index])
    localMembersByUnit[index] = scrambledUnit
    $membersByUnit = [...localMembersByUnit]
  }

  const handleChangePlaceholderCount = (index, increment) => {
    let count = placeholdersByIndex[index] || 0
    count += increment
    placeholdersByIndex[index] = count
    placeholdersByIndex = Object.assign(placeholdersByIndex)
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
      localMembersByUnit = [...value]
      produceTextAreaContent()
    }
  })

  function startAnimation() {
    const nameElements = document.querySelectorAll('.memberName')

    nameElements.forEach((elem, index) => {
      const startX = random(-1000, 1600)
      const startY = -random(600, 1400)
      const direction = Math.random() > 0.5 ? 1 : -1
      const degrees = Math.random() > 0.5 ? 720 : 360
      const duration = random(2000, 4000)

      elem.animate(
        [
          {transform: `translateX(${startX}px) translateY(${startY}px) rotate(0deg)`},
          {
            transform: `translateX(0px) translateY(0px) rotate(${degrees * direction}deg)`
          }
        ],
        {
          duration,
          easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
          fill: 'forwards' // keep the end state after the animation
        }
      )
    })
  }
</script>

{#if localMembersByUnit && localMembersByUnit.length > 0}
  <div class="classroom">
    {#each localMembersByUnit as unit, index}
      <div class="unit boxProps">
        <span class="unitNumber boxProps" on:click={() => handleScrambleUnit(index)}
          >{index + 1}</span
        >
        {#each unit as member (member)}
          <span class="memberName" key={member.name}>
            {member.name}
          </span>
        {/each}
      </div>
      <span
        class="addPlaceholderButtonContainer"
        on:click={() => handleChangePlaceholderCount(index, 1)}
      >
        <PlusMark />
      </span>
      {#if placeholdersByIndex[index]}
        {#each Array(placeholdersByIndex[index]) as _, idx}
          <div
            class="unitPlaceholder boxProps"
            on:click={() => handleChangePlaceholderCount(index, -1)}
          >
            {''}
          </div>
        {/each}
      {/if}
    {/each}
  </div>

  <div>
    <textarea id="rawResultsTextArea" name="text" bind:value={textAreaContent} />
  </div>
{/if}
