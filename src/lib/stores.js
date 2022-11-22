import { writable } from 'svelte/store'
import sampleGroups from './sampleGroups.txt?raw'

// Get the value out of local storage on load
// Use a sane default
const stored = localStorage.groups || sampleGroups

export let allGroups = [[]]
export let selectedGroup = allGroups[0]
export let membersByUnit = [[]]


// Used by StoredGroupsEditor
export const storedGroups = writable(stored)

// Whenever conent of LocalStorage changes
storedGroups.subscribe((value) => {
  localStorage.groups = value

  // Update allGroups
  allGroups = value.split('\n').map((rawGroup) => {
    const [name, rawMembers] = rawGroup.split(':')
    const members = rawMembers 
      ? rawMembers.split(',').map((member) => member.trim()) 
      : []
    return { name: name.trim(), members }
  })
})

