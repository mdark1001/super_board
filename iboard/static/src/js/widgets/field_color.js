/**
 * @author: Miguel Cabrera Ramírez
 * @date: 10/05/2023
 * @description:
 * */
odoo.define('iboard.FieldColor', function (require) {
    "use strict";
    const AbstractField = require('web.AbstractFieldOwl');
    const {Component, useState} = owl;
    const fieldRegistry = require('web.field_registry_owl');

    class iBoardFieldColor extends AbstractField {
        static  supportedFieldTypes = ["char"]
        static  template = 'iBoardFieldColor'

        setup() {
            alert("aaa")
            super.setup();
            this.state = useState({
                color: '#b4b4b4',
                mode: 'readonly',
            })

        }

        async willStart() {
            this.state.mode = this.props.options.mode;
            this.state.color = this.props.record.data.color || '#b4b4b4'
        }

        onChangeColorUpdated(ev) {
            this._setValue(ev.target.value);
        }

    }

    fieldRegistry.add('iboard_color', iBoardFieldColor);
    return {
        iBoardFieldColor
    }


})