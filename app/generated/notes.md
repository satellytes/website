1. install a sitemap generator
❯ npm install -g sitemap-static

2. 
switch to already build dist folder
❯  sitemap-static --prefix=https://www.satellytes.com/ . > sitemap.xml

3. 
put sitemap file here in app/generated to be picked up durign following builds.

manual, but working.