<script>
  import {selectedBackground} from './stores.js'
  import {updateBackground, backgroundImages} from './utils'

  const handleChangeBackground = (index) => {
    $selectedBackground = index
    updateBackground($selectedBackground)
  }
</script>

<div class="backgroundImageList">
  {#each backgroundImages as imgUrl, index}
    <input type="radio" name="bgImage" checked={$selectedBackground === index} />
    <label for={`backgroundImage-${index}`} on:click={() => handleChangeBackground(index)}>
      <img width="20" src={imgUrl} alt={`backgroundImage-${index}`} />
    </label>
  {/each}
</div>
