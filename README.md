# Random groups

Need a way to way to divide up people in groups? Randomly? This app features:

- Manage your own groups (name of group and group members)
- Assign members randomly to groups
- Manual group sizes (you decide the size of each group)
- Uniform group sizes (all groups are the same size)
  - Toggle whether remainders get their own group, or are distributed evenly among existing groups
- Assign a specific member to a specific group (i.e. randomness override)
- Randomize order within each group
- All data in LocalStorage, so zero GDPR issues

## TODO

- [ ] also assign members to group in results view
- [ ] moar responsiver design
- [ ] 4 seconds of dramatic animation "while scrambling"

## Known bugs

- [ ] assigning a wanted group to a member, with a higher number than there are groups, will crash the app

## Internal data structures

### Directly edited by the user

- group
  - name
  - members

storedGroups holds the raw data, all data as strings
allGroups holds the data when each group and members thereof are represented as objects

```
someGroup = {
  name: 'Peng',
  member:
  [
    {
      name: 'Jane',
      isSelected: true,
      selectedUnit: 3,
      selectedSlot: 1
    },
    {
      name: 'Jim',
      isSelected: true,
      selectedUnit: '-'
    }
  ]

]
```

### Produced by randomization

membersByUnits
--> membersByUnits?

member.group --> member.selectedUnit
