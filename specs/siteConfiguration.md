Name: Site Configuration
Description: Global site configuration including name, logo, and tagline

# Fields

1. Site Name (display field)
   id: name
   type: Short text
   required
   validations: max length 100

2. Logo Text
   id: logoText
   type: Short text
   optional
   validations: max length 100

3. Logo Image
   id: logoImage
   type: @Image
   optional

4. Tagline
   id: tagline
   type: Long text
   optional
   validations: max length 200
