<script>
  import {selectedBackground} from './stores.js'
  import {updateBackground, backgroundImages} from './utils'

  const handleChangeBackground = () => {
    updateBackground($selectedBackground)
  }
</script>

<input
  type="range"
  min="0"
  max={backgroundImages.length - 1}
  bind:value={$selectedBackground}
  on:change={handleChangeBackground}
/>
