Playt
========

A web app to make prototype playtesting board games involving dice and/or cards a little easier.

A static demo online here: http://petevasi.github.io/playt/

When prototyping with cards, I often find myself making a lot of them.  If something doesn't work out quite how I hoped, I'm remaking almost as many.  Playt is an attempt to virtualize that process.  Simply make images for your cards and dice and drop them into either the "cards" or "dice" folder, in a folder describing what deck those images belong to.  Make a jpg card back with the same name as your card folder and include that too.  If you host these files on a PHP-enabled web server, you can just navigate to index.php and it will find all the directories for you.  If you don't have a web server, you'll have to edit playtStatic.js to add a reference to all of your images.  A sample is included.

On the table (or in the demo), you can click to open the configuration section and change the number of decks of each card set, or the number of dice that are included.  Cards can be dragged around the table, single-clicked to flip over, or double-clicked to rotate.  Dice can be dragged, single-clicked to rotate, or double-clicked to be re-rolled.


License
=======

/css/, /js/, sample dice, and sample cards Copyright and license by their respective owners.

Main source code Copyright (c) 2015 Peter Vasiliauskas
Available under the MIT License
