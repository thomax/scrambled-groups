<script>
  import {storedGroups} from './stores.js'
</script>

<div>
  <h4>These are your group members. Edit using this pattern:</h4>
  <ul class="groupEditRulesList">
    <li>One line per group</li>
    <li>Group name: Comma, separated, list, of, member, names</li>
  </ul>
  <textarea class="groupEditor" bind:value={$storedGroups} spellcheck="false" wrap="off" />
</div>
