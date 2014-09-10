YUI.add('moodle-atto_mediagallery-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_mediagallery
 * @copyright  2014 NetSpot Pty Ltd
 * @author     Adam Olley <adam.olley@netspot.com.au>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_mediagallery-button
 */

/**
 * Atto text editor mediagallery plugin.
 *
 * @namespace M.atto_mediagallery
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_mediagallery',
    CSS = {
        INPUTGALLERY: 'atto_mediagallery_inputgallery'
    },
    SELECTORS = {
        INPUTGALLERY: '.atto_mediagallery_inputgallery'
    },
    TEMPLATE = '' +
            '<form class="atto_form">' +
                '{{get_string "select_desc" component}}<br/><br/>' +
                '{{#if galleries}}' +
                    '<label for="{{elementid}}_atto_mediagallery_">{{get_string "gallery" component}}</label>' +
                    '<select class="{{CSS.INPUTGALLERY}}" id="{{elementid}}_mediagallery_inputgallery">' +
                        '{{#each galleries}}' +
                            '<option value="{{id}}">{{text}}</option>' +
                        '{{/each}}' +
                    '</select>' +
                    '<br/>' +
                    '<div class="mdl-align">' +
                        '<br/>' +
                        '<button type="submit" class="submit">{{get_string "insertgallery" component}}</button>' +
                    '</div>' +
                '{{else}}' +
                    '{{get_string "nogalleries" component}}' +
                '{{/if}}' +
            '</form>',
    IMAGETEMPLATE = '' +
            '<a href="{{galleryurl}}" class="filter_mediagallery">' +
                '<img src="{{imageurl}}" title="{{text}}" alt="{{id}}" data-gallery="{{id}}"/>' +
            '</a>';

Y.namespace('M.atto_mediagallery').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * A reference to the dialogue content.
     *
     * @property _content
     * @type Node
     * @private
     */
    _content: null,

    initializer: function() {
        // Add the mediagallery button first.
        this.addButton({
            icon: 'icon',
            iconComponent: 'atto_mediagallery',
            callback: this._displayDialogue
        });

    },

    /**
     * Display the mediagallery editor.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false || this._currentSelection.collapsed) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('pluginname', COMPONENTNAME),
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.INPUTGALLERY
        });

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent());

        dialogue.show();
    },

    /**
     * Generates the content of the dialogue.
     *
     * @method _getDialogueContent
     * @return {Node} Node containing the dialogue content
     * @private
     */
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE);
        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            galleries: this.get('galleries'),
            CSS: CSS
        }));

        if (this._content.one('.submit')) {
            this._content.one('.submit').on('click', this._insertmediagallery, this);
        }

        return this._content;
    },

    /**
     * The mediagallery was inserted, so make changes to the editor source.
     *
     * @method _insertmediagallery
     * @param {EventFacade} e
     * @private
     */
    _insertmediagallery: function(e) {
        var input,
            value,
            text,
            host = this.get('host');

        e.preventDefault();

        // Hide the dialogue.
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        input = this._content.one('.atto_mediagallery_inputgallery');
        text = input.get('text');
        value = input.get('value');

        host.focus();
        if (value !== '') {
            template = Y.Handlebars.compile(IMAGETEMPLATE);
            imagehtml = template({
                id: value,
                text: text,
                imageurl: M.cfg.wwwroot + '/mod/mediagallery/pix/icon.gif',
                galleryurl: M.cfg.wwwroot + '/mod/mediagallery/view.php?g=' + value
            });

            host.insertContentAtFocusPoint(imagehtml);

            this.markUpdated();
        }

        this.getDialogue({
            focusAfterHide: null
        }).hide();
    }

}, {
    ATTRS: {
        /**
         * The list of galleries to display.
         *
         * @attribute galleries
         * @type array
         * @default {}
         */
        galleries: {
            value: []
        }
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
