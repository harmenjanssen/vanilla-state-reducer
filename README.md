# Vanilla state reducer

This tries to implement the common case of a tab switcher, without the use of `let`, or any kind of mutable state.  
Usually this works pretty well until you have to come up with a solution for keeping track of the current tab.

Note: this follows the pattern as proposed by our very own Hansel, and uses RXjs to provide an event stream.   
This gives us an interface to program against, instead of supporting various event handlers, which almost by definition requires some kind of mutable thingy to keep track of stuff.

Run the example with you favourite web server, such as `php -S localhost:2001`.
