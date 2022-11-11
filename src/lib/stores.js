import {writable} from 'svelte/store'
import sampleGroups from './sampleGroups.txt?raw'

// Get the value out of local storage on load
// Use a sane default
const stored = localStorage.groups || sampleGroups

export const storedGroups = writable(stored)

// Any time the store changes, update local storage
storedGroups.subscribe((value) => {
  localStorage.groups = value
})
