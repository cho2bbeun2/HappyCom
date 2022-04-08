import zrender from 'zrender'
import mixin from '../help/mixin'
import common from './common'
var directData = zrender.Path.extend({
    type: 'directData',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function (ctx, shape) {
       let {x,y,width,height}=shape;
       var w=x+width;
     //  ctx.beginPath();
       ctx.moveTo(x+5,y);
       ctx.lineTo(w-5,y);
       ctx.quadraticCurveTo(w,y+height/6,w,y+height/2);
       ctx.quadraticCurveTo(w,y+height*5/6,w-5,y+height);
       ctx.lineTo(x+5,y+height);
       ctx.quadraticCurveTo(x,y+height*5/6,x,y+height/2);
       ctx.quadraticCurveTo(x,y+height/6,x+5,y);
       ctx.closePath();
      // ctx.beginPath();
       ctx.moveTo(w-5,y+height);
       ctx.quadraticCurveTo(x+width-10,y+height*5/6,w-10,y+height/2);
       ctx.quadraticCurveTo(x+width-10,y+height/6,w-5,y);
    }
});

class DirectData extends directData {
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
        var r = { x: box.x + box.width, y: box.y + box.height / 2, index: 2, node: this, direct: 'right' };
        var b = { x: box.x + box.width / 2, y: box.y + box.height, index: 3, node: this, direct: 'bottom' };
        var l = { x: box.x, y: box.y + box.height / 2, index: 4, node: this, direct: 'left' };
        this.anchors.push(t, r, b, l);
    }
}

mixin(common,DirectData.prototype);

export default DirectData;