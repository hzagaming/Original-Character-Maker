with open('src/docsContent/en.ts', 'r') as f:
    lines = f.readlines()

line = lines[1338]
# old: person\\' (two backslashes + quote)
# new: person\' (one backslash + quote)
old = "person\\\\'"
new = "person\\'"
line = line.replace(old, new)
lines[1338] = line

with open('src/docsContent/en.ts', 'w') as f:
    f.writelines(lines)

print('Fixed line 1339')
