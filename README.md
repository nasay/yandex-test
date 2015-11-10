## Server ##
You should run any server from the project root directory. I used

```
#!bash
python -m SimpleHTTPServer
```

All data is stored in */json* directory.

## Browser support ##
I carefully checked it only for Chrome 39, Firefox 34, but it looks like for modern Chrome and Firefox it is working too.

## Realised functionality ##

* Displaying presentation list which is fetched from server;
* Displaying selected presentation in modal window;
* Fullscreen mode;
* For navigation you can also use a keyboard: left and right arrows and F2 for fullscreen mode. 

## What would be great to do ##
* Add buttons in the modal window for switching between presentations; 
* Add slides navigation while presentation is displaying (for example, some scroll);
* Fetching styles should depend on the presentation which is displayed (right now they are all in styles.css);
* Lazy presentation fetching;
* ?.