import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'
var parallelogram = zrender.Path.extend({
    type: 'parallelogram',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function (ctx, shape) {
        var x = shape.x;
        var y = shape.y;
        var height = shape.height;
        var width = shape.width;
        ctx.moveTo(x + width / 6, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width * 5 / 6, y + height);
        ctx.lineTo(x, y + height);
        ctx.closePath();
    }
});

class Parallelogram extends parallelogram {
    constructor(data) {
        super(data);
        this.data = data;
        this.oldfill = this.data.style.fill;
        this.anchors = [];
        this.nodeType = "node";
        this.createAnchors();
    }

    createAnchors() {
        this.anchors = [];
        var g = new zrender.Group();
        var box = g.getBoundingRect([this]);
        var t = { x: box.x + box.width / 2, y: box.y, index: 1, node: this, direct: 'top' };
        var r = { x: box.x + box.width * 11 / 12, y: box.y + box.height / 2, index: 2, node: this, direct: 'right' };
        var b = { x: box.x + box.width / 2, y: box.y + box.height, index: 3, node: this, direct: 'bottom' };
        var l = { x: box.x + box.width / 12, y: box.y + box.height / 2, index: 4, node: this, direct: 'left' };
        this.anchors.push(t, r, b, l);
    }
}

mixin(common,Parallelogram.prototype);

export default Parallelogram;