#H5P atto plugin for Moodle
This plugin allows users to insert a pre-existing H5P (hvp) activity into any other content in the same system using the Atto editor.
Embedded hvp iframe is bound to viewing user's permissions in that context

The plugin is a hack, as it relays on a patch to the stable version of H5P activity.
We are considering using a filter instead (WIP)

This this plugin is based on an original code written by Adam Olley (adam.olley@netspot.com.au) for the University of New South Wales (http://www.unsw.edu.au).
It was adoped by [Nadav Kavalerchik](https://github.com/nadavkav/) and [Lea Cohen](https://github.com/leac) (ORT R&D Israel) 

##Install
### Getting it
It should be git cloned or downloaded and uncompressed into /your/system/path/moodle/lib/editor/atto/plugins/hvp
### After Install
After installing the plugin in Moodle, you'll need to add the button into the Atto text editor button bars where you'd like it to appear.  
- Go to: Site administration / ► Plugins / ► Text editors / ► Atto HTML editor / ► Atto toolbar settings  
- Then add 'hvp' in the toolbar setting box where you'd like it to appear.

## Dependancies
Get the latest H5P (hvp) plugin from: https://github.com/h5p/h5p-moodle-plugin
Apply the following patch to it, so It can support embedding (iframe) of an hvp activity anywhere in the same Moodle system.
https://github.com/h5p/h5p-moodle-plugin/issues/30#issuecomment-207549678

Feedback, forking and improvement are very much welcome :-)