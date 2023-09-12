/** @odoo-module **/
/**
 * @author: Miguel Cabrera Ramírez
 * @date: 10/05/2023
 * @description:
 * */


import {Component, useState} from "@odoo/owl";


import {registry} from "@web/core/registry";
import {standardFieldProps} from "@web/views/fields/standard_field_props";
import {ICONS} from './icons';
import Dialog from 'web.OwlDialog';

class iBoardFieldIcon extends Component {

    setup() {
        super.setup();
        this.state = useState({
            icon: this.props.value,
            showModal: false,
            icons: ICONS,
            color: this.props.record.data?.color_id[1] || "#000000"
        })

    }

    changeModalState(ev) {
        this.state.showModal = true;
    }

    _onFilterIcons(ev) {
        let value = ev.target.value.toString().toLowerCase()
        this.state.icons = ICONS.filter(icon => {
            return icon.name.includes(value);
        })
    }

    _onSelectNewIcon(ev, icon) {
        this.state.icon = icon['className']
        this.props.update(icon['className'], {
            save: this.props.autosave
        })
        this.state.showModal = false;
    }

}

iBoardFieldIcon.description = 'iBoard Icon Select';
iBoardFieldIcon.displayName = "Icon"
iBoardFieldIcon.supportedTypes = ["char"];
iBoardFieldIcon.template = 'iBoardFieldIcon';
iBoardFieldIcon.props = {
    ...standardFieldProps,
}
iBoardFieldIcon.components = {
    Dialog,
}

registry.category("fields").add("iboard_icon", iBoardFieldIcon);

