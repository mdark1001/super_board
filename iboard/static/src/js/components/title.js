/** @odoo-module **/
import {iBoardBase} from "./base";
import {iboardFormat} from "./helpers";

export class Title extends iBoardBase {

    constructor(element, chart, colors) {
        super(chart, colors);
        this.el = d3.select(element.el)

        console.log(this.el);
    }

    draw() {
        super.draw();
        let template = this.getTemplate()
        this.el.html(template)
    }

    getTemplate() {
        return `
                   <div class="row">
                            <div class="col-8">
                                <div class="container o_kanban_card_content" modifiers="{}">
                                    <div class="row  ml-3" modifiers="{}">
                                        <div class="col-4 p-0" modifiers="{}">
                                                <span class="indicator-card-number" modifiers="{}">
                                                    ${iboardFormat(this.data.data.total, 'number')}
                                                </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ${this.getIcon()}

                </div>
        `
    }

    getIcon() {
        if (this.data.set_icon) {
            return `  <div class="col-2 text-left pl-0" style="font-size: 60px">
                                <i  class="fa ${this.data.icon}"
                                    style="color: ${this.colors[0]}">
                                    </i>
                            </div>`
        }
        return ''
    }
}