Name: SEO Metadata
Description: Stores all SEO-related information for a specific 'Page' entry such as meta title, meta description, etc.

# Fields

1. Identifier (display field)
   id: identifier
   type: Short text/symbol
   hint text: Internal use only - used as the entry title and should match the page name.
   required

2. Meta title
   id: metaTitle
   type: Short text
   hint text: Recommended length: 50-60 characters
   required
   localised

3. Meta description
   id: metaDescription
   type: Rich text
   hint text: Recommended length: 50-160 characters
   required
   localised

4. Meta image
   id: metaImage
   type: @Image
   hint text: The image displayed when sharing the link in apps and messages
   optional
   localised

5. Indexable
   id: indexable
   type: boolean (yes/no)
   hint text: Is this page discoverable on Google search?
   required
   default: yes
