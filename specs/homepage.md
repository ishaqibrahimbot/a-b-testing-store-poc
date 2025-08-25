Name: Homepage
Description: Stores all the content blocks that are rendered on the homepage of the site

# Fields

1. Hero Banner (display field)
   id: heroBanner
   type: @Image
   required

2. Call to Action
   id: callToAction
   type: Short text
   optional
   localised
   validations: max length 20

3. Image Carousel
   id: imageCarousel
   type: Array
   items: Asset
   optional
   validations: min 3, max 8
