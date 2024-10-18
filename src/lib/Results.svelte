<script>
  // @ts-nocheck
  import {afterUpdate} from 'svelte'
  import {scrambleArray, random, getRandomEmptyIndex} from './utils'
  import {membersByGroup, isAnimationsEnabled, scrambledAt} from './stores.js'
  import PlusMark from './PlusMark.svelte'
  import {loop_guard} from 'svelte/internal'

  let textAreaContent // content of the copy/paste friendly version
  let previousScrambledAt // last time a scramble was performed
  $: localMembersByGroup = [] // local usage of groups and members
  $: placeholdersByIndex = {} // keeps track of group placeholders

  afterUpdate(() => {
    setTextAreaHeight()
    if ($isAnimationsEnabled && $scrambledAt !== previousScrambledAt) {
      startAnimation()
    }
    previousScrambledAt = $scrambledAt
  })

  const handleScrambleGroup = (index) => {
    const group = localMembersByGroup[index]
    const scrambledGroup = new Array(group.length)
    // first pass, assign members with fixed positions
    group
      .filter((member) => member.selectedPosition !== '-')
      .forEach((member) => {
        scrambledGroup[member.selectedPosition] = member
      })

    // second pass, assign members with no fixed positions
    group
      .filter((member) => member.selectedPosition === '-')
      .forEach((member) => {
        const randomIndex = getRandomEmptyIndex(scrambledGroup)
        scrambledGroup[randomIndex] = member
      })

    localMembersByGroup[index] = scrambledGroup
    $membersByGroup = [...localMembersByGroup]
  }

  const handleChangePlaceholderCount = (index, increment) => {
    let count = placeholdersByIndex[index] || 0
    count += increment
    placeholdersByIndex[index] = count
    placeholdersByIndex = Object.assign(placeholdersByIndex)
  }

  const handleToggleSelectPosition = (groupIndex, memberIndex) => {
    const group = $membersByGroup[groupIndex]
    const member = group[memberIndex]
    if (member.selectedPosition === '-') {
      member.selectedGroup = groupIndex
      member.selectedPosition = memberIndex
    } else {
      member.selectedGroup = '-'
      member.selectedPosition = '-'
    }
    $membersByGroup = [...$membersByGroup]
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
    localMembersByGroup.forEach((group, index) => {
      textAreaContent += `Group ${index + 1}\n`
      textAreaContent += `${group.map((member) => member.name).join(', ')}\n`
      textAreaContent += '\n'
    })
    textAreaContent = textAreaContent.trim()
  }

  const startAnimation = () => {
    const nameElements = document.querySelectorAll('.memberName')

    nameElements.forEach((elem) => {
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

  // listen for changes in members
  membersByGroup.subscribe((value) => {
    if (value && value.length > 0) {
      localMembersByGroup = [...value]
      produceTextAreaContent()
    }
  })
</script>

{#if localMembersByGroup && localMembersByGroup.length > 0}
  <div class="classroom">
    {#each localMembersByGroup as group, groupIndex}
      <div class="group boxProps" key={`group-${groupIndex}`}>
        <span class="groupNumber boxProps" on:click={() => handleScrambleGroup(groupIndex)}
          >{groupIndex + 1}</span
        >
        {#each group as member, memberIndex (member.name)}
          <span
            class={`memberName ${member.selectedPosition === '-' ? '' : 'fixedPositionMember'}`}
            on:click={() => handleToggleSelectPosition(groupIndex, memberIndex)}
          >
            {member.name}
          </span>
        {/each}
      </div>
      <span
        class="addPlaceholderButtonContainer"
        on:click={() => handleChangePlaceholderCount(groupIndex, 1)}
      >
        <PlusMark />
      </span>
      {#if placeholdersByIndex[groupIndex]}
        {#each Array(placeholdersByIndex[groupIndex]) as _}
          <div
            class="groupPlaceholder boxProps"
            on:click={() => handleChangePlaceholderCount(groupIndex, -1)}
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
