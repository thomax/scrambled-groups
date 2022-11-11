<script>
  import {scrambleArray} from "./utils"

  export let membersByGroup
  $: membersByGroup

  const handleScrambleGroup = (index) => {
    let scrambledGroup = scrambleArray(membersByGroup[index])
    membersByGroup[index] = scrambledGroup
    membersByGroup = [...membersByGroup]
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

<style src="../app.css"></style>
