Name: Header
Description: Header configuration including navigation, search, and cart settings

# Fields

1. Search Placeholder (display field)
   id: searchPlaceholder
   type: Short text
   required
   validations: max length 50

2. Navigation Items
   id: navigation
   type: JSON object
   required

3. Search Enabled
   id: searchEnabled
   type: boolean (yes/no)
   required

4. Cart Enabled
   id: cartEnabled
   type: boolean (yes/no)
   required

5. Cart Show Count
   id: cartShowCount
   type: boolean (yes/no)
   required
