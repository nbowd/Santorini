<h1>Satorini</h1>

Try the game here: https://nbowd.github.io/Santorini/

This is a two-player board game where the goal is to move one of your pieces onto a max-level tower before your opponent.

Each player gets two Workers, each turn the player has to move one piece to a valid neighboring tile and then build on a neighboring tile of the destination. 

They can only move up one level at a time. A player wins when they move a Worker onto a level 3 tower. Towers can be built up to level 4, which is considered a 'dome' piece. This completes a tower and makes it unavailable for players to move to. 

This is built with React. I originally wrote the game logic in Python for a class, but it didn't have a UI. This was a fun project to rebuild, it gave me a chance to clean up the existing logic and use some powerful Javascript/React features. 

Next steps:
<ul> 
  <li>Testing suite</li>
  <li>Multiplayer with web sockets</li>

</ul>