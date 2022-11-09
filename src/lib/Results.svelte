<script>
  export let membersByGroup
  $: membersByGroup

  const handleScrambleGroup = (index) => {
    let scrambledGroup = membersByGroup[index]
      .map((value) => ({value, sort: Math.random()}))
      .sort((a, b) => a.sort - b.sort)
      .map(({value}) => value)

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
