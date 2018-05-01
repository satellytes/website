# Satellytes

This is an easy webpack4 + HtmlWebPackPlugin setup
with Typescript support and sass & postcss pipeline enabled.

## Deployment
The repository on bitbucket.org has some hooks registered
that will trigger a build automatically whenever you push
an update to the `master`branch.

The result will be visible here:
https://beep.satellytes.com/

It's planned to create a stable branch
to hold the deployment for the production version under:
https://www.satellytes.com/

netlify.com is our deployment service.

## Forms
We won't create any scripts but use an external service
like Airtable or some email sending service.

## Grid
There is no grid.
I disabled theg grid class generating part with `grid-enable-classes: false` and only use the mixins for the moment to keep the grid footprint small.

## Todos
+ Integrate a Form Service to send Mails

