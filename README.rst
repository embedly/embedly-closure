embedly
-------

Embedly javascript client library.  To find out what Embedly is all about, please
visit http://embed.ly.  To see our api documentation, visit
http://api.embed.ly/docs.

Prerequisites
^^^^^^^^^^^^^

The following prerequisites are only needed for building embedly.min.js.
If you simply want to use the library, then feel free to use the `latest 
version <http://static.embed.ly/js/closure/embed.min.js>`_ on our public
server.

* `closure-compiler <http://code.google.com/closure/compiler/>`_
* `closure-library <http://code.google.com/closure/library/>`_

Building
^^^^^^^^

Edit build.sh and update the paths to your local closure-compiler and 
closure-library trees.  Run `./build.sh` to build the embedly.min.js
file.

If you plan on using embedly in a closure-library app, then you can safely
remove the last few lines of embedly.js before compiling.  There is a comment
in the code.

Note on Patches/Pull Requests
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Fork the project.
* Make your feature addition or bug fix.
* Add tests for it. This is important so I don't break it in a
  future version unintentionally.
* Commit, do not mess with rakefile, version, or history.
  (if you want to have your own version, that is fine but bump version in a commit by itself I can ignore when I pull)
* Send me a pull request. Bonus points for topic branches.

Copyright
^^^^^^^^^

Copyright (c) 2011 Embed.ly, Inc. See MIT-LICENSE for details.
