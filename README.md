ultravisual-2
=============

Ultravisual scroll zoom like http://capptivate.co/2014/01/10/ultra-visual/

Files
=============
1. ListView.js
2. PageListView.js
3. StripListView.js
 
### ListView
Init from main.js with a set of data (see index.html). The instance then call a PageListView and a modifier for it.

### PageListView
Create many instance of StripListView and a modifier for each one into arrays.

### StripListView
Contains and image (surf and mod), title (surf and mod), paragraph (surf and mod).

Finally
=============
I managed to make bouncy scroll effect like ios one. But this is faked and seems like native thanks to famous !
I would never make this effect work with a native scroll.

The hard part was to pipe all the events because I didn't understood why the touch event wasn't fired on stripListView (even if they were inside pageListView and ListView).
