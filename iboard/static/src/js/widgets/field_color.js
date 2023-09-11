/** @odoo-module **/
/**
 * @author: Miguel Cabrera Ramírez
 * @date: 10/05/2023
 * @description:
 * */


import {Component, useState} from "@odoo/owl";


import {registry} from "@web/core/registry";
import {standardFieldProps} from "@web/views/fields/standard_field_props";

class iBoardFieldColor extends Component {

    setup() {
        super.setup();
        console.log(this.props);
        this.state = useState({
            color: this.props.value,
            mode: this.props.readonly ? 'readonly' : '',
        })

    }

    onChangeColorUpdated(ev) {
        this.state.color = ev.target.value;
        this.props.update(ev.target.value, {
            save: this.props.autosave
        })
    }

}

iBoardFieldColor.description = 'iBoard color selected';
iBoardFieldColor.displayName = "Color"
iBoardFieldColor.supportedTypes = ["char"];
iBoardFieldColor.template = 'iBoardFieldColor';
iBoardFieldColor.props = {
    ...standardFieldProps,
}

registry.category("fields").add("icolor", iBoardFieldColor);

