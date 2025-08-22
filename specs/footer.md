Name: Footer
Description: Footer configuration including sections and copyright information

# Fields

1. Copyright Text (display field)
   id: copyrightText
   type: Long text
   required
   validations: max length 500

2. Footer Sections
   id: sections
   type: JSON object
   required

3. Copyright Year
   id: copyrightYear
   type: integer/number
   required
   validations: range 2000–3000
