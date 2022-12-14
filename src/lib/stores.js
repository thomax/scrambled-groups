import {writable} from 'svelte/store'
import sampleGroups from './sampleGroups.txt?raw'

// Get the value out of local storage on load
// Use a sane default
const stored = localStorage.groups || sampleGroups

export let allGroups = []

// Used by StoredGroupsEditor
export const storedGroups = writable(stored)

// Used by StoredGroupsEditor and MembersToggle
export let selectedGroup = writable(null)

// Used by MembersToggle and Widgets
export let selectedGroupMembers = writable(null)
// TODO: objectify members here somewhere on change

// Used by Widgets and Results
export let membersByUnit = writable([])

// Whenever content of LocalStorage changes
storedGroups.subscribe((value) => {
  localStorage.groups = value

  // Update allGroups
  allGroups = value.split('\n').map((rawGroup) => {
    const [name, rawMembers] = rawGroup.split(':')
    const members = rawMembers ? rawMembers.split(',').map((member) => member.trim()) : []
    return {name: name.trim(), members}
  })
})
