=============
DIME frontend
=============

DIME frontend is - as it's name suggests - a frontend for a DIME timetracking
server.

This is under heavy development, but should be ready for production until Summer
2016.

Development
===========

We are using the power of [Mithril](https://lhorie.github.io/mithril/), which is
a great framework to writefrontend Javascript using functional programming.

To find the origin of a specific element in your DOM, you may add ``?mdebug`` as
a URL parameter and you will see it as a title on hover after reload.

Our design is based on [Daemonite](http://daemonite.github.io/material/), that
we converted to [Stylus](http://stylus-lang.com/) and all our styles are written
in Stylus, too.

Btw. you may convert existing CSS to Stylus by calling

    node_modules/.bin/stylus -C <path/to/your/css> <path/to/your/styl>``

and that's what we did with Daemonite), but you should not need that.
