# Random groups

Need a way to way to divide up people in groups? Randomly? This app features:

- Manage your own groups (name of group and group members)
- Assign members randomly to groups
- Fixed group sizes (all groups are the same size)
  - Toggle whether remainders get their own group, or are distributed evenly among existing groups
- Custom group sizes (you decide the size of each group)
- Assign a specific member to a specific group (i.e. randomness override)
- Randomize order within each group
- All data in LocalStorage, so zero GDPR issues
- Optional animation on scramble
- Background image selector

## TODO

- Take a closer look at the data model
  - fewer writable stores
  - separate names and metadata (dont need to shuffle metadata such as selectedPosition)
- [ ] moar responsiver design

## Directly edited by the user

- group
  - name
  - members

storedGroups holds the raw data, all data as strings
allGroups holds the data when each group and members thereof are represented as objects

```
someGroup = {
  name: 'Peng',
  members:
  [
    {
      name: 'Jane',
      isSelected: true,
      selectedUnit: 3,
      selectedPosition: 1
    },
    {
      name: 'Eve',
      isSelected: true,
      selectedUnit: 3,
      selectedPosition: '-'
    },
    {
      name: 'Jim',
      isSelected: true,
      selectedUnit: '-',
      selectedPosition: '-'
    }
  ],
  ...
}
```
