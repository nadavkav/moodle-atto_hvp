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
 * @package    atto_hvp
 * @author     Lea Cohen <leac@ort.org.il>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

//use \mod_hvp\collection;

defined('MOODLE_INTERNAL') || die();

/**
 * Initialise this plugin
 * @param string $elementid
 */
function atto_hvp_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('hvp',
        'inserthvp',
        'nohvps',
        'select_desc',
        'title'),
        'atto_hvp');
}

function atto_hvp_params_for_js($elementid, $options, $fpoptions) {
    if ($options['context']->contextlevel < CONTEXT_COURSE) {
        return array();
    }
    $list = array();
    $hvps = get_my_hvps_by_contextid();
    foreach ($hvps as $hvp) {
        $list[] = array('id' => $hvp->id, 'text' => $hvp->name);
    }

    return array('hvps' => $list);
}

// Load H5P list data
function get_my_hvps_by_contextid() {
    $h5ps = [];
    global $DB, $PAGE;

    $rawh5ps = $DB->get_records_sql("SELECT cm.id AS id,
                                   --  cw.section,
                                   --  cm.visible,
                                     h.name
                                   --  hl.title AS librarytitle
                                FROM {course_modules} cm,
                                     {course_sections} cw,
                                     {modules} md,
                                     {hvp} h,
                                     {hvp_libraries} hl
                               WHERE cm.course = ?
                                 AND cm.instance = h.id
                                 AND cm.section = cw.id
                                 AND md.name = 'hvp'
                                 AND md.id = cm.module
                                 AND hl.id = h.main_library_id
                             ", array($PAGE->course->id));

    $modinfo = get_fast_modinfo($PAGE->course, NULL);
    if (empty($modinfo->instances['hvp'])) {
        $h5ps = $rawh5ps;
    } else {
        // Lets try to order these bad boys
        foreach ($modinfo->instances['hvp'] as $cm) {
            if (!$cm->uservisible || !isset($rawh5ps[$cm->id])) {
                continue; // Not visible or not found
            }
            if (!empty($cm->extra)) {
                $rawh5ps[$cm->id]->extra = $cm->extra;
            }
            $h5ps[] = $rawh5ps[$cm->id];
        }
    }
    return $h5ps;
}
