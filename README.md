## Task ##
* make an application for displaying presentations;
* think about displaying several presentations within one page;
* jQuery is highly recommended.

## Server ##
You need to run a server from the project root directory. I run the following command from my terminal:

```
python -m SimpleHTTPServer
```

All data is stored in */json* directory.

## Browser support ##
I carefully checked it only for Chrome 39, Firefox 34, but it looks like for modern Chrome and Firefox it is working too.

## Realised functionality ##

* Display presentation list which is fetched from the server;
* Display selected presentation in a modal window;
* Fullscreen mode;
* For navigation you can use a keyboard: left and right arrows and F2 for the fullscreen mode. 

## What would be great to do ##
* Add buttons in the modal window for switching between presentations; 
* Add slide navigation while presentation is displaying (for example, some scroll);
* Fetching of styles should depend on the presentation which is displayed (right now all styles are stored in ```styles.css```);
* Lazy presentation fetching;
* ? :).
