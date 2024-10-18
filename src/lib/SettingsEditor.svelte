<script>
  import {storedClasses} from './stores.js'
  import BackgroundSelector from './BackgroundSelector.svelte'
</script>

<div class="settingsBox">
  <h4>These are your classes, and their members. Edit using this pattern:</h4>
  <ul class="classEditRulesList">
    <li>One line per class</li>
    <li>Class name: Comma, separated, list, of, member, names</li>
  </ul>

  <textarea class="classEditor" bind:value={$storedClasses} spellcheck="false" wrap="off" />

  <div class="backgroundSelectBox">
    <h4>Experimental feature, try me :)</h4>
    <BackgroundSelector />
  </div>
</div>
