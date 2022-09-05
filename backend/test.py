import pandoc

md = """
# Hello world

## This is test text.

EA

> Test
"""

doc = pandoc.read(md, format="markdown")

pandoc.write(doc, format="docx", file="test.docx", options={"--reference-doc=/app_code/config/custom-reference.docx"})
# print(pandoc.write(doc, format="docx"))
