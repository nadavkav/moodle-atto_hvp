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
 * @package    atto_hvp
 * @author     Lea Cohen <leac@ort.org.il>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_hvp-button
 */

/**
 * Atto text editor hvp plugin.
 *
 * @namespace M.atto_hvp
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_hvp',
    CSS = {
        INPUTHVP: 'atto_hvp_inputhvp'
    },
    SELECTORS = {
        INPUTHVP: '.atto_hvp_inputhvp'
    },
    TEMPLATE = '' +
        '<form class="atto_form">' +
            '{{get_string "select_desc" component}}<br/><br/>' +
            '{{#if hvps}}' +
                '<label for="{{elementid}}_atto_hvp_">{{get_string "hvp" component}}</label>' +
                '<select class="{{CSS.INPUTHVP}}" id="{{elementid}}_hvp_inputhvp">' +
                    '{{#each hvps}}' +
                        '<option value="{{id}}">{{text}}</option>' +
                    '{{/each}}' +
                '</select>' +
                '<br/>' +
                '<div class="mdl-align">' +
                    '<br/>' +
                    '<button type="submit" class="submit">{{get_string "inserthvp" component}}</button>' +
                '</div>' +
            '{{else}}' +
                '{{get_string "nohvps" component}}' +
            '{{/if}}' +
        '</form>',
    IMAGETEMPLATE = '' +
        '<iframe src="{{hvpurl}}" class="filter_hvp" id="hvp_{{id}}" style="width:100%;border:0;">' + '</iframe>' +
        '<script>var filter_hvp = Y.one(".filter_hvp");filter_hvp.on("load", function (e) {this._node.height = this._node.contentWindow.document.body.scrollHeight + \'px\';});</script>';

Y.namespace('M.atto_hvp').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

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

    initializer: function () {
        // Add the hvp button first.
        this.addButton({
            icon: 'icon',
            iconComponent: 'atto_hvp',
            callback: this._displayDialogue
        });

    },

    /**
     * Display the hvp editor.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function () {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false || this._currentSelection.collapsed) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('pluginname', COMPONENTNAME),
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.INPUTHVP
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
    _getDialogueContent: function () {
        var template = Y.Handlebars.compile(TEMPLATE);
        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            hvps: this.get('hvps'),
            CSS: CSS
        }));

        if (this._content.one('.submit')) {
            this._content.one('.submit').on('click', this._inserthvp, this);
        }

        return this._content;
    },

    /**
     * The hvp was inserted, so make changes to the editor source.
     *
     * @method _inserthvp
     * @param {EventFacade} e
     * @private
     */
    _inserthvp: function (e) {
        var input,
            value,
            text,
            host = this.get('host');

        e.preventDefault();

        // Hide the dialogue.
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        input = this._content.one('.atto_hvp_inputhvp');
        text = input.get('text');
        value = input.get('value');

        host.focus();
        if (value !== '') {
            template = Y.Handlebars.compile(IMAGETEMPLATE);
            imagehtml = template({
                id: value,
                text: text,
                hvpurl: M.cfg.wwwroot + '/mod/hvp/view.php?id=' + value + '&isembedded=1'
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
         * The list of hvps to display.
         *
         * @attribute hvps
         * @type array
         * @default {}
         */
        hvps: {
            value: []
        }
    }
});
