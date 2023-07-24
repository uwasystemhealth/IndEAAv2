import pandoc

md = """
# Hello world

## This is test text.

EA

> Test
"""

output = pandoc.convert_text(md, 'docx', format='md', extra_args=['--reference-doc=/app_code/config/custom-reference.docx'])

# Write the output to a file
with open('test.docx', 'wb') as f:
    f.write(output)