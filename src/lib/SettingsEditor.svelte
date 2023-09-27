<script>
  import {storedGroups} from './stores.js'
  import BackgroundSelector from './BackgroundSelector.svelte'
</script>

<div class="settingsBox">
  <h4>These are your group members. Edit using this pattern:</h4>
  <ul class="groupEditRulesList">
    <li>One line per group</li>
    <li>Group name: Comma, separated, list, of, member, names</li>
  </ul>

  <textarea class="groupEditor" bind:value={$storedGroups} spellcheck="false" wrap="off" />

  <div class="backgroundSelectBox">
    <h4>Experimental feature, try me :)</h4>
    <BackgroundSelector />
  </div>
</div>
