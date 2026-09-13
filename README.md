# Cách link với Claude với Copilot
1. Tạo folder .claude cùng cấp với .github
|--.claude
|--.github
|--|--skills
|--|--instruction
2. chạy lệnh để tạo folder và link skill của github copilot và Claude
rm -rf .claude/skills && ln -s ../.github/skills .claude/skills

# Cách link Copilot / Claude với skill repo

`git submodule add git@github.com:FreeDevTeam/AISKILL_Copilot_Shared_NodeJS_Backend.git AISKILL_Copilot_Shared_NodeJS_Backend`

## Link từng phần 

### Tạo link cho instructions
`rm -rf .github/instructions && ln -s ../AISKILL_Copilot_Shared_NodeJS_Backend/instructions .github/instructions`

### Tạo link cho skills
`rm -rf .github/skills && ln -s ../AISKILL_Copilot_Shared_NodeJS_Backend/skills .github/skills`