<?php
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

/**
 * Atto text editor integration version file.
 *
 * @package    atto_mediagallery
 * @copyright  2014 NetSpot Pty Ltd
 * @author     Adam Olley <adam.olley@netspot.com.au>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use \mod_mediagallery\collection;

defined('MOODLE_INTERNAL') || die();

/**
 * Initialise this plugin
 * @param string $elementid
 */
function atto_mediagallery_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('gallery',
                                          'insertgallery',
                                          'nogalleries',
                                          'select_desc',
                                          'title'),
                                    'atto_mediagallery');
}

function atto_mediagallery_params_for_js($elementid, $options, $fpoptions) {
    if ($options['context']->contextlevel < CONTEXT_COURSE) {
        return array();
    }
    $galleries = collection::get_my_galleries_by_contextid($options['context']->id);
    $list = array();
    foreach ($galleries as $id => $text) {
        $list[] = array('id' => $id, 'text' => $text);
    }
    return array('galleries' => $list);
}
