with open('src/docsContent/en.ts', 'r') as f:
    content = f.read()

# Pattern to find: two backslashes followed by a single quote
old = chr(92) + chr(92) + "'"
# Replacement: one backslash followed by a single quote
new = chr(92) + "'"

content = content.replace(old, new)

with open('src/docsContent/en.ts', 'w') as f:
    f.write(content)

print('Fixed quotes, replacements:', content.count(new) - content.count(old))
