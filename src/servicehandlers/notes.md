## What are service handlers

Service handlers are wrappers which provide a uniform api to frontend with regards to 3 main options

1. Bypassing cors
2. Storage and Retrival of items
3. CRUD (Create review update and delete) cookies

For eg.

ChromeWrapper.js - Communicates with chrome extension and calls appropriate functions
FirefoxWrapper.js - Communicates with firefox extension
