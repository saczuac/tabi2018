(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],3:[function(require,module,exports){
// contains, add, remove, toggle
var indexof = require('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},{"indexof":7}],4:[function(require,module,exports){
/*
 Highcharts JS v7.0.0 (2018-12-11)

 (c) 2009-2018 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(O,J){"object"===typeof module&&module.exports?module.exports=O.document?J(O):J:"function"===typeof define&&define.amd?define(function(){return J(O)}):O.Highcharts=J(O)})("undefined"!==typeof window?window:this,function(O){var J=function(){var a="undefined"===typeof O?window:O,y=a.document,G=a.navigator&&a.navigator.userAgent||"",E=y&&y.createElementNS&&!!y.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,h=/(edge|msie|trident)/i.test(G)&&!a.opera,d=-1!==G.indexOf("Firefox"),
r=-1!==G.indexOf("Chrome"),u=d&&4>parseInt(G.split("Firefox/")[1],10);return a.Highcharts?a.Highcharts.error(16,!0):{product:"Highcharts",version:"7.0.0",deg2rad:2*Math.PI/360,doc:y,hasBidiBug:u,hasTouch:y&&void 0!==y.documentElement.ontouchstart,isMS:h,isWebKit:-1!==G.indexOf("AppleWebKit"),isFirefox:d,isChrome:r,isSafari:!r&&-1!==G.indexOf("Safari"),isTouchDevice:/(Mobile|Android|Windows Phone)/.test(G),SVG_NS:"http://www.w3.org/2000/svg",chartCount:0,seriesTypes:{},symbolSizes:{},svg:E,win:a,marginNames:["plotTop",
"marginRight","marginBottom","plotLeft"],noop:function(){},charts:[]}}();(function(a){a.timers=[];var y=a.charts,G=a.doc,E=a.win;a.error=function(h,d,r){var u=a.isNumber(h)?"Highcharts error #"+h+": www.highcharts.com/errors/"+h:h;r&&a.fireEvent(r,"displayError",{code:h});if(d)throw Error(u);E.console&&console.log(u)};a.Fx=function(a,d,r){this.options=d;this.elem=a;this.prop=r};a.Fx.prototype={dSetter:function(){var a=this.paths[0],d=this.paths[1],r=[],u=this.now,v=a.length,w;if(1===u)r=this.toD;
else if(v===d.length&&1>u)for(;v--;)w=parseFloat(a[v]),r[v]=isNaN(w)?d[v]:u*parseFloat(d[v]-w)+w;else r=d;this.elem.attr("d",r,null,!0)},update:function(){var a=this.elem,d=this.prop,r=this.now,u=this.options.step;if(this[d+"Setter"])this[d+"Setter"]();else a.attr?a.element&&a.attr(d,r,null,!0):a.style[d]=r+this.unit;u&&u.call(a,r,this)},run:function(h,d,r){var u=this,v=u.options,w=function(a){return w.stopped?!1:u.step(a)},n=E.requestAnimationFrame||function(a){setTimeout(a,13)},g=function(){for(var c=
0;c<a.timers.length;c++)a.timers[c]()||a.timers.splice(c--,1);a.timers.length&&n(g)};h!==d||this.elem["forceAnimate:"+this.prop]?(this.startTime=+new Date,this.start=h,this.end=d,this.unit=r,this.now=this.start,this.pos=0,w.elem=this.elem,w.prop=this.prop,w()&&1===a.timers.push(w)&&n(g)):(delete v.curAnim[this.prop],v.complete&&0===Object.keys(v.curAnim).length&&v.complete.call(this.elem))},step:function(h){var d=+new Date,r,u=this.options,v=this.elem,w=u.complete,n=u.duration,g=u.curAnim;v.attr&&
!v.element?h=!1:h||d>=n+this.startTime?(this.now=this.end,this.pos=1,this.update(),r=g[this.prop]=!0,a.objectEach(g,function(a){!0!==a&&(r=!1)}),r&&w&&w.call(v),h=!1):(this.pos=u.easing((d-this.startTime)/n),this.now=this.start+(this.end-this.start)*this.pos,this.update(),h=!0);return h},initPath:function(h,d,r){function u(a){var b,k;for(f=a.length;f--;)b="M"===a[f]||"L"===a[f],k=/[a-zA-Z]/.test(a[f+3]),b&&k&&a.splice(f+1,0,a[f+1],a[f+2],a[f+1],a[f+2])}function v(a,l){for(;a.length<b;){a[0]=l[b-a.length];
var k=a.slice(0,p);[].splice.apply(a,[0,0].concat(k));x&&(k=a.slice(a.length-p),[].splice.apply(a,[a.length,0].concat(k)),f--)}a[0]="M"}function w(a,f){for(var k=(b-a.length)/p;0<k&&k--;)l=a.slice().splice(a.length/t-p,p*t),l[0]=f[b-p-k*p],m&&(l[p-6]=l[p-2],l[p-5]=l[p-1]),[].splice.apply(a,[a.length/t,0].concat(l)),x&&k--}d=d||"";var n,g=h.startX,c=h.endX,m=-1<d.indexOf("C"),p=m?7:3,b,l,f;d=d.split(" ");r=r.slice();var x=h.isArea,t=x?2:1,H;m&&(u(d),u(r));if(g&&c){for(f=0;f<g.length;f++)if(g[f]===
c[0]){n=f;break}else if(g[0]===c[c.length-g.length+f]){n=f;H=!0;break}void 0===n&&(d=[])}d.length&&a.isNumber(n)&&(b=r.length+n*t*p,H?(v(d,r),w(r,d)):(v(r,d),w(d,r)));return[d,r]},fillSetter:function(){a.Fx.prototype.strokeSetter.apply(this,arguments)},strokeSetter:function(){this.elem.attr(this.prop,a.color(this.start).tweenTo(a.color(this.end),this.pos),null,!0)}};a.merge=function(){var h,d=arguments,r,u={},v=function(d,n){"object"!==typeof d&&(d={});a.objectEach(n,function(g,c){!a.isObject(g,!0)||
a.isClass(g)||a.isDOMElement(g)?d[c]=n[c]:d[c]=v(d[c]||{},g)});return d};!0===d[0]&&(u=d[1],d=Array.prototype.slice.call(d,2));r=d.length;for(h=0;h<r;h++)u=v(u,d[h]);return u};a.pInt=function(a,d){return parseInt(a,d||10)};a.isString=function(a){return"string"===typeof a};a.isArray=function(a){a=Object.prototype.toString.call(a);return"[object Array]"===a||"[object Array Iterator]"===a};a.isObject=function(h,d){return!!h&&"object"===typeof h&&(!d||!a.isArray(h))};a.isDOMElement=function(h){return a.isObject(h)&&
"number"===typeof h.nodeType};a.isClass=function(h){var d=h&&h.constructor;return!(!a.isObject(h,!0)||a.isDOMElement(h)||!d||!d.name||"Object"===d.name)};a.isNumber=function(a){return"number"===typeof a&&!isNaN(a)&&Infinity>a&&-Infinity<a};a.erase=function(a,d){for(var h=a.length;h--;)if(a[h]===d){a.splice(h,1);break}};a.defined=function(a){return void 0!==a&&null!==a};a.attr=function(h,d,r){var u;a.isString(d)?a.defined(r)?h.setAttribute(d,r):h&&h.getAttribute&&((u=h.getAttribute(d))||"class"!==
d||(u=h.getAttribute(d+"Name"))):a.defined(d)&&a.isObject(d)&&a.objectEach(d,function(a,d){h.setAttribute(d,a)});return u};a.splat=function(h){return a.isArray(h)?h:[h]};a.syncTimeout=function(a,d,r){if(d)return setTimeout(a,d,r);a.call(0,r)};a.clearTimeout=function(h){a.defined(h)&&clearTimeout(h)};a.extend=function(a,d){var h;a||(a={});for(h in d)a[h]=d[h];return a};a.pick=function(){var a=arguments,d,r,u=a.length;for(d=0;d<u;d++)if(r=a[d],void 0!==r&&null!==r)return r};a.css=function(h,d){a.isMS&&
!a.svg&&d&&void 0!==d.opacity&&(d.filter="alpha(opacity\x3d"+100*d.opacity+")");a.extend(h.style,d)};a.createElement=function(h,d,r,u,v){h=G.createElement(h);var w=a.css;d&&a.extend(h,d);v&&w(h,{padding:0,border:"none",margin:0});r&&w(h,r);u&&u.appendChild(h);return h};a.extendClass=function(h,d){var r=function(){};r.prototype=new h;a.extend(r.prototype,d);return r};a.pad=function(a,d,r){return Array((d||2)+1-String(a).replace("-","").length).join(r||0)+a};a.relativeLength=function(a,d,r){return/%$/.test(a)?
d*parseFloat(a)/100+(r||0):parseFloat(a)};a.wrap=function(a,d,r){var h=a[d];a[d]=function(){var a=Array.prototype.slice.call(arguments),d=arguments,n=this;n.proceed=function(){h.apply(n,arguments.length?arguments:d)};a.unshift(h);a=r.apply(this,a);n.proceed=null;return a}};a.datePropsToTimestamps=function(h){a.objectEach(h,function(d,r){a.isObject(d)&&"function"===typeof d.getTime?h[r]=d.getTime():(a.isObject(d)||a.isArray(d))&&a.datePropsToTimestamps(d)})};a.formatSingle=function(h,d,r){var u=/\.([0-9])/,
v=a.defaultOptions.lang;/f$/.test(h)?(r=(r=h.match(u))?r[1]:-1,null!==d&&(d=a.numberFormat(d,r,v.decimalPoint,-1<h.indexOf(",")?v.thousandsSep:""))):d=(r||a.time).dateFormat(h,d);return d};a.format=function(h,d,r){for(var u="{",v=!1,w,n,g,c,m=[],p;h;){u=h.indexOf(u);if(-1===u)break;w=h.slice(0,u);if(v){w=w.split(":");n=w.shift().split(".");c=n.length;p=d;for(g=0;g<c;g++)p&&(p=p[n[g]]);w.length&&(p=a.formatSingle(w.join(":"),p,r));m.push(p)}else m.push(w);h=h.slice(u+1);u=(v=!v)?"}":"{"}m.push(h);
return m.join("")};a.getMagnitude=function(a){return Math.pow(10,Math.floor(Math.log(a)/Math.LN10))};a.normalizeTickInterval=function(h,d,r,u,v){var w,n=h;r=a.pick(r,1);w=h/r;d||(d=v?[1,1.2,1.5,2,2.5,3,4,5,6,8,10]:[1,2,2.5,5,10],!1===u&&(1===r?d=d.filter(function(a){return 0===a%1}):.1>=r&&(d=[1/r])));for(u=0;u<d.length&&!(n=d[u],v&&n*r>=h||!v&&w<=(d[u]+(d[u+1]||d[u]))/2);u++);return n=a.correctFloat(n*r,-Math.round(Math.log(.001)/Math.LN10))};a.stableSort=function(a,d){var h=a.length,u,v;for(v=0;v<
h;v++)a[v].safeI=v;a.sort(function(a,n){u=d(a,n);return 0===u?a.safeI-n.safeI:u});for(v=0;v<h;v++)delete a[v].safeI};a.arrayMin=function(a){for(var d=a.length,h=a[0];d--;)a[d]<h&&(h=a[d]);return h};a.arrayMax=function(a){for(var d=a.length,h=a[0];d--;)a[d]>h&&(h=a[d]);return h};a.destroyObjectProperties=function(h,d){a.objectEach(h,function(a,u){a&&a!==d&&a.destroy&&a.destroy();delete h[u]})};a.discardElement=function(h){var d=a.garbageBin;d||(d=a.createElement("div"));h&&d.appendChild(h);d.innerHTML=
""};a.correctFloat=function(a,d){return parseFloat(a.toPrecision(d||14))};a.setAnimation=function(h,d){d.renderer.globalAnimation=a.pick(h,d.options.chart.animation,!0)};a.animObject=function(h){return a.isObject(h)?a.merge(h):{duration:h?500:0}};a.timeUnits={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5,month:24192E5,year:314496E5};a.numberFormat=function(h,d,r,u){h=+h||0;d=+d;var v=a.defaultOptions.lang,w=(h.toString().split(".")[1]||"").split("e")[0].length,n,g,c=h.toString().split("e");
-1===d?d=Math.min(w,20):a.isNumber(d)?d&&c[1]&&0>c[1]&&(n=d+ +c[1],0<=n?(c[0]=(+c[0]).toExponential(n).split("e")[0],d=n):(c[0]=c[0].split(".")[0]||0,h=20>d?(c[0]*Math.pow(10,c[1])).toFixed(d):0,c[1]=0)):d=2;g=(Math.abs(c[1]?c[0]:h)+Math.pow(10,-Math.max(d,w)-1)).toFixed(d);w=String(a.pInt(g));n=3<w.length?w.length%3:0;r=a.pick(r,v.decimalPoint);u=a.pick(u,v.thousandsSep);h=(0>h?"-":"")+(n?w.substr(0,n)+u:"");h+=w.substr(n).replace(/(\d{3})(?=\d)/g,"$1"+u);d&&(h+=r+g.slice(-d));c[1]&&0!==+h&&(h+=
"e"+c[1]);return h};Math.easeInOutSine=function(a){return-.5*(Math.cos(Math.PI*a)-1)};a.getStyle=function(h,d,r){if("width"===d)return Math.max(0,Math.min(h.offsetWidth,h.scrollWidth,h.getBoundingClientRect?Math.floor(h.getBoundingClientRect().width):Infinity)-a.getStyle(h,"padding-left")-a.getStyle(h,"padding-right"));if("height"===d)return Math.max(0,Math.min(h.offsetHeight,h.scrollHeight)-a.getStyle(h,"padding-top")-a.getStyle(h,"padding-bottom"));E.getComputedStyle||a.error(27,!0);if(h=E.getComputedStyle(h,
void 0))h=h.getPropertyValue(d),a.pick(r,"opacity"!==d)&&(h=a.pInt(h));return h};a.inArray=function(a,d,r){return d.indexOf(a,r)};a.find=Array.prototype.find?function(a,d){return a.find(d)}:function(a,d){var h,u=a.length;for(h=0;h<u;h++)if(d(a[h],h))return a[h]};a.keys=Object.keys;a.offset=function(a){var d=G.documentElement;a=a.parentElement||a.parentNode?a.getBoundingClientRect():{top:0,left:0};return{top:a.top+(E.pageYOffset||d.scrollTop)-(d.clientTop||0),left:a.left+(E.pageXOffset||d.scrollLeft)-
(d.clientLeft||0)}};a.stop=function(h,d){for(var r=a.timers.length;r--;)a.timers[r].elem!==h||d&&d!==a.timers[r].prop||(a.timers[r].stopped=!0)};a.objectEach=function(a,d,r){for(var h in a)a.hasOwnProperty(h)&&d.call(r||a[h],a[h],h,a)};a.objectEach({map:"map",each:"forEach",grep:"filter",reduce:"reduce",some:"some"},function(h,d){a[d]=function(a){return Array.prototype[h].apply(a,[].slice.call(arguments,1))}});a.addEvent=function(h,d,r,u){var v,w=h.addEventListener||a.addEventListenerPolyfill;v="function"===
typeof h&&h.prototype?h.prototype.protoEvents=h.prototype.protoEvents||{}:h.hcEvents=h.hcEvents||{};a.Point&&h instanceof a.Point&&h.series&&h.series.chart&&(h.series.chart.runTrackerClick=!0);w&&w.call(h,d,r,!1);v[d]||(v[d]=[]);v[d].push(r);u&&a.isNumber(u.order)&&(r.order=u.order,v[d].sort(function(a,g){return a.order-g.order}));return function(){a.removeEvent(h,d,r)}};a.removeEvent=function(h,d,r){function u(g,c){var m=h.removeEventListener||a.removeEventListenerPolyfill;m&&m.call(h,g,c,!1)}function v(g){var c,
m;h.nodeName&&(d?(c={},c[d]=!0):c=g,a.objectEach(c,function(a,b){if(g[b])for(m=g[b].length;m--;)u(b,g[b][m])}))}var w,n;["protoEvents","hcEvents"].forEach(function(a){var c=h[a];c&&(d?(w=c[d]||[],r?(n=w.indexOf(r),-1<n&&(w.splice(n,1),c[d]=w),u(d,r)):(v(c),c[d]=[])):(v(c),h[a]={}))})};a.fireEvent=function(h,d,r,u){var v,w,n,g,c;r=r||{};G.createEvent&&(h.dispatchEvent||h.fireEvent)?(v=G.createEvent("Events"),v.initEvent(d,!0,!0),a.extend(v,r),h.dispatchEvent?h.dispatchEvent(v):h.fireEvent(d,v)):["protoEvents",
"hcEvents"].forEach(function(m){if(h[m])for(w=h[m][d]||[],n=w.length,r.target||a.extend(r,{preventDefault:function(){r.defaultPrevented=!0},target:h,type:d}),g=0;g<n;g++)(c=w[g])&&!1===c.call(h,r)&&r.preventDefault()});u&&!r.defaultPrevented&&u.call(h,r)};a.animate=function(h,d,r){var u,v="",w,n,g;a.isObject(r)||(g=arguments,r={duration:g[2],easing:g[3],complete:g[4]});a.isNumber(r.duration)||(r.duration=400);r.easing="function"===typeof r.easing?r.easing:Math[r.easing]||Math.easeInOutSine;r.curAnim=
a.merge(d);a.objectEach(d,function(c,g){a.stop(h,g);n=new a.Fx(h,r,g);w=null;"d"===g?(n.paths=n.initPath(h,h.d,d.d),n.toD=d.d,u=0,w=1):h.attr?u=h.attr(g):(u=parseFloat(a.getStyle(h,g))||0,"opacity"!==g&&(v="px"));w||(w=c);w&&w.match&&w.match("px")&&(w=w.replace(/px/g,""));n.run(u,w,v)})};a.seriesType=function(h,d,r,u,v){var w=a.getOptions(),n=a.seriesTypes;w.plotOptions[h]=a.merge(w.plotOptions[d],r);n[h]=a.extendClass(n[d]||function(){},u);n[h].prototype.type=h;v&&(n[h].prototype.pointClass=a.extendClass(a.Point,
v));return n[h]};a.uniqueKey=function(){var a=Math.random().toString(36).substring(2,9),d=0;return function(){return"highcharts-"+a+"-"+d++}}();a.isFunction=function(a){return"function"===typeof a};E.jQuery&&(E.jQuery.fn.highcharts=function(){var h=[].slice.call(arguments);if(this[0])return h[0]?(new (a[a.isString(h[0])?h.shift():"Chart"])(this[0],h[0],h[1]),this):y[a.attr(this[0],"data-highcharts-chart")]})})(J);(function(a){var y=a.isNumber,G=a.merge,E=a.pInt;a.Color=function(h){if(!(this instanceof
a.Color))return new a.Color(h);this.init(h)};a.Color.prototype={parsers:[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(a){return[E(a[1]),E(a[2]),E(a[3]),parseFloat(a[4],10)]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(a){return[E(a[1]),E(a[2]),E(a[3]),1]}}],names:{white:"#ffffff",black:"#000000"},init:function(h){var d,r,u,v;if((this.input=h=this.names[h&&h.toLowerCase?h.toLowerCase():
""]||h)&&h.stops)this.stops=h.stops.map(function(d){return new a.Color(d[1])});else if(h&&h.charAt&&"#"===h.charAt()&&(d=h.length,h=parseInt(h.substr(1),16),7===d?r=[(h&16711680)>>16,(h&65280)>>8,h&255,1]:4===d&&(r=[(h&3840)>>4|(h&3840)>>8,(h&240)>>4|h&240,(h&15)<<4|h&15,1])),!r)for(u=this.parsers.length;u--&&!r;)v=this.parsers[u],(d=v.regex.exec(h))&&(r=v.parse(d));this.rgba=r||[]},get:function(a){var d=this.input,h=this.rgba,u;this.stops?(u=G(d),u.stops=[].concat(u.stops),this.stops.forEach(function(d,
h){u.stops[h]=[u.stops[h][0],d.get(a)]})):u=h&&y(h[0])?"rgb"===a||!a&&1===h[3]?"rgb("+h[0]+","+h[1]+","+h[2]+")":"a"===a?h[3]:"rgba("+h.join(",")+")":d;return u},brighten:function(a){var d,h=this.rgba;if(this.stops)this.stops.forEach(function(d){d.brighten(a)});else if(y(a)&&0!==a)for(d=0;3>d;d++)h[d]+=E(255*a),0>h[d]&&(h[d]=0),255<h[d]&&(h[d]=255);return this},setOpacity:function(a){this.rgba[3]=a;return this},tweenTo:function(a,d){var h=this.rgba,u=a.rgba;u.length&&h&&h.length?(a=1!==u[3]||1!==
h[3],d=(a?"rgba(":"rgb(")+Math.round(u[0]+(h[0]-u[0])*(1-d))+","+Math.round(u[1]+(h[1]-u[1])*(1-d))+","+Math.round(u[2]+(h[2]-u[2])*(1-d))+(a?","+(u[3]+(h[3]-u[3])*(1-d)):"")+")"):d=a.input||"none";return d}};a.color=function(h){return new a.Color(h)}})(J);(function(a){var y,G,E=a.addEvent,h=a.animate,d=a.attr,r=a.charts,u=a.color,v=a.css,w=a.createElement,n=a.defined,g=a.deg2rad,c=a.destroyObjectProperties,m=a.doc,p=a.extend,b=a.erase,l=a.hasTouch,f=a.isArray,x=a.isFirefox,t=a.isMS,H=a.isObject,
F=a.isString,z=a.isWebKit,k=a.merge,A=a.noop,D=a.objectEach,C=a.pick,e=a.pInt,q=a.removeEvent,L=a.splat,I=a.stop,R=a.svg,K=a.SVG_NS,M=a.symbolSizes,S=a.win;y=a.SVGElement=function(){return this};p(y.prototype,{opacity:1,SVG_NS:K,textProps:"direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline cursor".split(" "),init:function(a,e){this.element="span"===e?w(e):m.createElementNS(this.SVG_NS,e);this.renderer=a},animate:function(e,q,
b){q=a.animObject(C(q,this.renderer.globalAnimation,!0));0!==q.duration?(b&&(q.complete=b),h(this,e,q)):(this.attr(e,null,b),q.step&&q.step.call(this));return this},complexColor:function(e,q,b){var B=this.renderer,l,c,p,g,A,K,m,N,x,d,t,I=[],L;a.fireEvent(this.renderer,"complexColor",{args:arguments},function(){e.radialGradient?c="radialGradient":e.linearGradient&&(c="linearGradient");c&&(p=e[c],A=B.gradients,m=e.stops,d=b.radialReference,f(p)&&(e[c]=p={x1:p[0],y1:p[1],x2:p[2],y2:p[3],gradientUnits:"userSpaceOnUse"}),
"radialGradient"===c&&d&&!n(p.gradientUnits)&&(g=p,p=k(p,B.getRadialAttr(d,g),{gradientUnits:"userSpaceOnUse"})),D(p,function(a,e){"id"!==e&&I.push(e,a)}),D(m,function(a){I.push(a)}),I=I.join(","),A[I]?t=A[I].attr("id"):(p.id=t=a.uniqueKey(),A[I]=K=B.createElement(c).attr(p).add(B.defs),K.radAttr=g,K.stops=[],m.forEach(function(e){0===e[1].indexOf("rgba")?(l=a.color(e[1]),N=l.get("rgb"),x=l.get("a")):(N=e[1],x=1);e=B.createElement("stop").attr({offset:e[0],"stop-color":N,"stop-opacity":x}).add(K);
K.stops.push(e)})),L="url("+B.url+"#"+t+")",b.setAttribute(q,L),b.gradient=I,e.toString=function(){return L})})},applyTextOutline:function(e){var B=this.element,q,f,k,l,c;-1!==e.indexOf("contrast")&&(e=e.replace(/contrast/g,this.renderer.getContrast(B.style.fill)));e=e.split(" ");f=e[e.length-1];if((k=e[0])&&"none"!==k&&a.svg){this.fakeTS=!0;e=[].slice.call(B.getElementsByTagName("tspan"));this.ySetter=this.xSetter;k=k.replace(/(^[\d\.]+)(.*?)$/g,function(a,e,B){return 2*e+B});for(c=e.length;c--;)q=
e[c],"highcharts-text-outline"===q.getAttribute("class")&&b(e,B.removeChild(q));l=B.firstChild;e.forEach(function(a,e){0===e&&(a.setAttribute("x",B.getAttribute("x")),e=B.getAttribute("y"),a.setAttribute("y",e||0),null===e&&B.setAttribute("y",0));a=a.cloneNode(1);d(a,{"class":"highcharts-text-outline",fill:f,stroke:f,"stroke-width":k,"stroke-linejoin":"round"});B.insertBefore(a,l)})}},symbolCustomAttribs:"x y width height r start end innerR anchorX anchorY rounded".split(" "),attr:function(e,q,b,
f){var B,k=this.element,l,c=this,p,g,A=this.symbolCustomAttribs;"string"===typeof e&&void 0!==q&&(B=e,e={},e[B]=q);"string"===typeof e?c=(this[e+"Getter"]||this._defaultGetter).call(this,e,k):(D(e,function(B,q){p=!1;f||I(this,q);this.symbolName&&-1!==a.inArray(q,A)&&(l||(this.symbolAttr(e),l=!0),p=!0);!this.rotation||"x"!==q&&"y"!==q||(this.doTransform=!0);p||(g=this[q+"Setter"]||this._defaultSetter,g.call(this,B,q,k),!this.styledMode&&this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(q)&&
this.updateShadows(q,B,g))},this),this.afterSetters());b&&b.call(this);return c},afterSetters:function(){this.doTransform&&(this.updateTransform(),this.doTransform=!1)},updateShadows:function(a,e,q){for(var B=this.shadows,b=B.length;b--;)q.call(B[b],"height"===a?Math.max(e-(B[b].cutHeight||0),0):"d"===a?this.d:e,a,B[b])},addClass:function(a,e){var B=this.attr("class")||"";-1===B.indexOf(a)&&(e||(a=(B+(B?" ":"")+a).replace("  "," ")),this.attr("class",a));return this},hasClass:function(a){return-1!==
(this.attr("class")||"").split(" ").indexOf(a)},removeClass:function(a){return this.attr("class",(this.attr("class")||"").replace(a,""))},symbolAttr:function(a){var e=this;"x y r start end width height innerR anchorX anchorY".split(" ").forEach(function(B){e[B]=C(a[B],e[B])});e.attr({d:e.renderer.symbols[e.symbolName](e.x,e.y,e.width,e.height,e)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":"none")},crisp:function(a,e){var B;e=e||a.strokeWidth||0;B=Math.round(e)%
2/2;a.x=Math.floor(a.x||this.x||0)+B;a.y=Math.floor(a.y||this.y||0)+B;a.width=Math.floor((a.width||this.width||0)-2*B);a.height=Math.floor((a.height||this.height||0)-2*B);n(a.strokeWidth)&&(a.strokeWidth=e);return a},css:function(a){var B=this.styles,q={},b=this.element,k,f="",l,c=!B,g=["textOutline","textOverflow","width"];a&&a.color&&(a.fill=a.color);B&&D(a,function(a,e){a!==B[e]&&(q[e]=a,c=!0)});c&&(B&&(a=p(B,q)),a&&(null===a.width||"auto"===a.width?delete this.textWidth:"text"===b.nodeName.toLowerCase()&&
a.width&&(k=this.textWidth=e(a.width))),this.styles=a,k&&!R&&this.renderer.forExport&&delete a.width,b.namespaceURI===this.SVG_NS?(l=function(a,e){return"-"+e.toLowerCase()},D(a,function(a,e){-1===g.indexOf(e)&&(f+=e.replace(/([A-Z])/g,l)+":"+a+";")}),f&&d(b,"style",f)):v(b,a),this.added&&("text"===this.element.nodeName&&this.renderer.buildText(this),a&&a.textOutline&&this.applyTextOutline(a.textOutline)));return this},getStyle:function(a){return S.getComputedStyle(this.element||this,"").getPropertyValue(a)},
strokeWidth:function(){if(!this.renderer.styledMode)return this["stroke-width"]||0;var a=this.getStyle("stroke-width"),q;a.indexOf("px")===a.length-2?a=e(a):(q=m.createElementNS(K,"rect"),d(q,{width:a,"stroke-width":0}),this.element.parentNode.appendChild(q),a=q.getBBox().width,q.parentNode.removeChild(q));return a},on:function(a,e){var q=this,B=q.element;l&&"click"===a?(B.ontouchstart=function(a){q.touchEventFired=Date.now();a.preventDefault();e.call(B,a)},B.onclick=function(a){(-1===S.navigator.userAgent.indexOf("Android")||
1100<Date.now()-(q.touchEventFired||0))&&e.call(B,a)}):B["on"+a]=e;return this},setRadialReference:function(a){var e=this.renderer.gradients[this.element.gradient];this.element.radialReference=a;e&&e.radAttr&&e.animate(this.renderer.getRadialAttr(a,e.radAttr));return this},translate:function(a,e){return this.attr({translateX:a,translateY:e})},invert:function(a){this.inverted=a;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,e=this.translateY||0,q=this.scaleX,
b=this.scaleY,f=this.inverted,k=this.rotation,l=this.matrix,c=this.element;f&&(a+=this.width,e+=this.height);a=["translate("+a+","+e+")"];n(l)&&a.push("matrix("+l.join(",")+")");f?a.push("rotate(90) scale(-1,1)"):k&&a.push("rotate("+k+" "+C(this.rotationOriginX,c.getAttribute("x"),0)+" "+C(this.rotationOriginY,c.getAttribute("y")||0)+")");(n(q)||n(b))&&a.push("scale("+C(q,1)+" "+C(b,1)+")");a.length&&c.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);
return this},align:function(a,e,q){var B,f,k,l,c={};f=this.renderer;k=f.alignedObjects;var p,g;if(a){if(this.alignOptions=a,this.alignByTranslate=e,!q||F(q))this.alignTo=B=q||"renderer",b(k,this),k.push(this),q=null}else a=this.alignOptions,e=this.alignByTranslate,B=this.alignTo;q=C(q,f[B],f);B=a.align;f=a.verticalAlign;k=(q.x||0)+(a.x||0);l=(q.y||0)+(a.y||0);"right"===B?p=1:"center"===B&&(p=2);p&&(k+=(q.width-(a.width||0))/p);c[e?"translateX":"x"]=Math.round(k);"bottom"===f?g=1:"middle"===f&&(g=
2);g&&(l+=(q.height-(a.height||0))/g);c[e?"translateY":"y"]=Math.round(l);this[this.placed?"animate":"attr"](c);this.placed=!0;this.alignAttr=c;return this},getBBox:function(a,e){var q,B=this.renderer,b,f=this.element,k=this.styles,l,c=this.textStr,A,K=B.cache,m=B.cacheKeys,x=f.namespaceURI===this.SVG_NS,d;e=C(e,this.rotation);b=e*g;l=B.styledMode?f&&y.prototype.getStyle.call(f,"font-size"):k&&k.fontSize;n(c)&&(d=c.toString(),-1===d.indexOf("\x3c")&&(d=d.replace(/[0-9]/g,"0")),d+=["",e||0,l,this.textWidth,
k&&k.textOverflow].join());d&&!a&&(q=K[d]);if(!q){if(x||B.forExport){try{(A=this.fakeTS&&function(a){[].forEach.call(f.querySelectorAll(".highcharts-text-outline"),function(e){e.style.display=a})})&&A("none"),q=f.getBBox?p({},f.getBBox()):{width:f.offsetWidth,height:f.offsetHeight},A&&A("")}catch(W){}if(!q||0>q.width)q={width:0,height:0}}else q=this.htmlGetBBox();B.isSVG&&(a=q.width,B=q.height,x&&(q.height=B={"11px,17":14,"13px,20":16}[k&&k.fontSize+","+Math.round(B)]||B),e&&(q.width=Math.abs(B*Math.sin(b))+
Math.abs(a*Math.cos(b)),q.height=Math.abs(B*Math.cos(b))+Math.abs(a*Math.sin(b))));if(d&&0<q.height){for(;250<m.length;)delete K[m.shift()];K[d]||m.push(d);K[d]=q}}return q},show:function(a){return this.attr({visibility:a?"inherit":"visible"})},hide:function(){return this.attr({visibility:"hidden"})},fadeOut:function(a){var e=this;e.animate({opacity:0},{duration:a||150,complete:function(){e.attr({y:-9999})}})},add:function(a){var e=this.renderer,q=this.element,B;a&&(this.parentGroup=a);this.parentInverted=
a&&a.inverted;void 0!==this.textStr&&e.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)B=this.zIndexSetter();B||(a?a.element:e.box).appendChild(q);if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var e=a.parentNode;e&&e.removeChild(a)},destroy:function(){var a=this,e=a.element||{},q=a.renderer,f=q.isSVG&&"SPAN"===e.nodeName&&a.parentGroup,k=e.ownerSVGElement,l=a.clipPath;e.onclick=e.onmouseout=e.onmouseover=e.onmousemove=e.point=null;I(a);l&&k&&([].forEach.call(k.querySelectorAll("[clip-path],[CLIP-PATH]"),
function(a){var e=a.getAttribute("clip-path"),q=l.element.id;(-1<e.indexOf("(#"+q+")")||-1<e.indexOf('("#'+q+'")'))&&a.removeAttribute("clip-path")}),a.clipPath=l.destroy());if(a.stops){for(k=0;k<a.stops.length;k++)a.stops[k]=a.stops[k].destroy();a.stops=null}a.safeRemoveChild(e);for(q.styledMode||a.destroyShadows();f&&f.div&&0===f.div.childNodes.length;)e=f.parentGroup,a.safeRemoveChild(f.div),delete f.div,f=e;a.alignTo&&b(q.alignedObjects,a);D(a,function(e,q){delete a[q]});return null},shadow:function(a,
e,q){var b=[],f,B,k=this.element,l,c,p,g;if(!a)this.destroyShadows();else if(!this.shadows){c=C(a.width,3);p=(a.opacity||.15)/c;g=this.parentInverted?"(-1,-1)":"("+C(a.offsetX,1)+", "+C(a.offsetY,1)+")";for(f=1;f<=c;f++)B=k.cloneNode(0),l=2*c+1-2*f,d(B,{stroke:a.color||"#000000","stroke-opacity":p*f,"stroke-width":l,transform:"translate"+g,fill:"none"}),B.setAttribute("class",(B.getAttribute("class")||"")+" highcharts-shadow"),q&&(d(B,"height",Math.max(d(B,"height")-l,0)),B.cutHeight=l),e?e.element.appendChild(B):
k.parentNode&&k.parentNode.insertBefore(B,k),b.push(B);this.shadows=b}return this},destroyShadows:function(){(this.shadows||[]).forEach(function(a){this.safeRemoveChild(a)},this);this.shadows=void 0},xGetter:function(a){"circle"===this.element.nodeName&&("x"===a?a="cx":"y"===a&&(a="cy"));return this._defaultGetter(a)},_defaultGetter:function(a){a=C(this[a+"Value"],this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,e,q){a&&
a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");this[e]!==a&&(q.setAttribute(e,a),this[e]=a)},dashstyleSetter:function(a){var q,f=this["stroke-width"];"inherit"===f&&(f=1);if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(q=a.length;q--;)a[q]=e(a[q])*f;a=a.join(",").replace(/NaN/g,
"none");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){this.alignValue=a;this.element.setAttribute("text-anchor",{left:"start",center:"middle",right:"end"}[a])},opacitySetter:function(a,e,q){this[e]=a;q.setAttribute(e,a)},titleSetter:function(a){var e=this.element.getElementsByTagName("title")[0];e||(e=m.createElementNS(this.SVG_NS,"title"),this.element.appendChild(e));e.firstChild&&e.removeChild(e.firstChild);e.appendChild(m.createTextNode(String(C(a),"").replace(/<[^>]*>/g,
"").replace(/&lt;/g,"\x3c").replace(/&gt;/g,"\x3e")))},textSetter:function(a){a!==this.textStr&&(delete this.bBox,this.textStr=a,this.added&&this.renderer.buildText(this))},fillSetter:function(a,e,q){"string"===typeof a?q.setAttribute(e,a):a&&this.complexColor(a,e,q)},visibilitySetter:function(a,e,q){"inherit"===a?q.removeAttribute(e):this[e]!==a&&q.setAttribute(e,a);this[e]=a},zIndexSetter:function(a,q){var f=this.renderer,b=this.parentGroup,k=(b||f).element||f.box,l,c=this.element,B,p,f=k===f.box;
l=this.added;var g;n(a)?(c.setAttribute("data-z-index",a),a=+a,this[q]===a&&(l=!1)):n(this[q])&&c.removeAttribute("data-z-index");this[q]=a;if(l){(a=this.zIndex)&&b&&(b.handleZ=!0);q=k.childNodes;for(g=q.length-1;0<=g&&!B;g--)if(b=q[g],l=b.getAttribute("data-z-index"),p=!n(l),b!==c)if(0>a&&p&&!f&&!g)k.insertBefore(c,q[g]),B=!0;else if(e(l)<=a||p&&(!n(a)||0<=a))k.insertBefore(c,q[g+1]||null),B=!0;B||(k.insertBefore(c,q[f?3:0]||null),B=!0)}return B},_defaultSetter:function(a,e,q){q.setAttribute(e,a)}});
y.prototype.yGetter=y.prototype.xGetter;y.prototype.translateXSetter=y.prototype.translateYSetter=y.prototype.rotationSetter=y.prototype.verticalAlignSetter=y.prototype.rotationOriginXSetter=y.prototype.rotationOriginYSetter=y.prototype.scaleXSetter=y.prototype.scaleYSetter=y.prototype.matrixSetter=function(a,e){this[e]=a;this.doTransform=!0};y.prototype["stroke-widthSetter"]=y.prototype.strokeSetter=function(a,e,q){this[e]=a;this.stroke&&this["stroke-width"]?(y.prototype.fillSetter.call(this,this.stroke,
"stroke",q),q.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0):"stroke-width"===e&&0===a&&this.hasStroke&&(q.removeAttribute("stroke"),this.hasStroke=!1)};G=a.SVGRenderer=function(){this.init.apply(this,arguments)};p(G.prototype,{Element:y,SVG_NS:K,init:function(a,e,q,f,b,k,l){var c;c=this.createElement("svg").attr({version:"1.1","class":"highcharts-root"});l||c.css(this.getStyle(f));f=c.element;a.appendChild(f);d(a,"dir","ltr");-1===a.innerHTML.indexOf("xmlns")&&d(f,"xmlns",this.SVG_NS);
this.isSVG=!0;this.box=f;this.boxWrapper=c;this.alignedObjects=[];this.url=(x||z)&&m.getElementsByTagName("base").length?S.location.href.split("#")[0].replace(/<[^>]*>/g,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(m.createTextNode("Created with Highcharts 7.0.0"));this.defs=this.createElement("defs").add();this.allowHTML=k;this.forExport=b;this.styledMode=l;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(e,
q,!1);var B;x&&a.getBoundingClientRect&&(e=function(){v(a,{left:0,top:0});B=a.getBoundingClientRect();v(a,{left:Math.ceil(B.left)-B.left+"px",top:Math.ceil(B.top)-B.top+"px"})},e(),this.unSubPixelFix=E(S,"resize",e))},definition:function(a){function e(a,f){var b;L(a).forEach(function(a){var k=q.createElement(a.tagName),l={};D(a,function(a,e){"tagName"!==e&&"children"!==e&&"textContent"!==e&&(l[e]=a)});k.attr(l);k.add(f||q.defs);a.textContent&&k.element.appendChild(m.createTextNode(a.textContent));
e(a.children||[],k);b=k});return b}var q=this;return e(a)},getStyle:function(a){return this.style=p({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},setStyle:function(a){this.boxWrapper.css(this.getStyle(a))},isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();c(this.gradients||{});this.gradients=null;a&&(this.defs=a.destroy());this.unSubPixelFix&&
this.unSubPixelFix();return this.alignedObjects=null},createElement:function(a){var e=new this.Element;e.init(this,a);return e},draw:A,getRadialAttr:function(a,e){return{cx:a[0]-a[2]/2+e.cx*a[2],cy:a[1]-a[2]/2+e.cy*a[2],r:e.r*a[2]}},truncate:function(a,e,q,f,b,k,l){var c=this,p=a.rotation,B,g=f?1:0,A=(q||f).length,K=A,d=[],x=function(a){e.firstChild&&e.removeChild(e.firstChild);a&&e.appendChild(m.createTextNode(a))},n=function(k,p){p=p||k;if(void 0===d[p])if(e.getSubStringLength)try{d[p]=b+e.getSubStringLength(0,
f?p+1:p)}catch(X){}else c.getSpanWidth&&(x(l(q||f,k)),d[p]=b+c.getSpanWidth(a,e));return d[p]},t,I;a.rotation=0;t=n(e.textContent.length);if(I=b+t>k){for(;g<=A;)K=Math.ceil((g+A)/2),f&&(B=l(f,K)),t=n(K,B&&B.length-1),g===A?g=A+1:t>k?A=K-1:g=K;0===A?x(""):q&&A===q.length-1||x(B||l(q||f,K))}f&&f.splice(0,K);a.actualWidth=t;a.rotation=p;return I},escapes:{"\x26":"\x26amp;","\x3c":"\x26lt;","\x3e":"\x26gt;","'":"\x26#39;",'"':"\x26quot;"},buildText:function(a){var q=a.element,f=this,k=f.forExport,b=C(a.textStr,
"").toString(),l=-1!==b.indexOf("\x3c"),c=q.childNodes,p,g=d(q,"x"),B=a.styles,A=a.textWidth,x=B&&B.lineHeight,n=B&&B.textOutline,t=B&&"ellipsis"===B.textOverflow,I=B&&"nowrap"===B.whiteSpace,L=B&&B.fontSize,z,H,h=c.length,B=A&&!a.added&&this.box,F=function(a){var b;f.styledMode||(b=/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:L||f.style.fontSize||12);return x?e(x):f.fontMetrics(b,a.getAttribute("style")?a:q).h},M=function(a,e){D(f.escapes,function(q,f){e&&-1!==e.indexOf(q)||(a=a.toString().replace(new RegExp(q,
"g"),f))});return a},w=function(a,e){var q;q=a.indexOf("\x3c");a=a.substring(q,a.indexOf("\x3e")-q);q=a.indexOf(e+"\x3d");if(-1!==q&&(q=q+e.length+1,e=a.charAt(q),'"'===e||"'"===e))return a=a.substring(q+1),a.substring(0,a.indexOf(e))};z=[b,t,I,x,n,L,A].join();if(z!==a.textCache){for(a.textCache=z;h--;)q.removeChild(c[h]);l||n||t||A||-1!==b.indexOf(" ")?(B&&B.appendChild(q),l?(b=f.styledMode?b.replace(/<(b|strong)>/g,'\x3cspan class\x3d"highcharts-strong"\x3e').replace(/<(i|em)>/g,'\x3cspan class\x3d"highcharts-emphasized"\x3e'):
b.replace(/<(b|strong)>/g,'\x3cspan style\x3d"font-weight:bold"\x3e').replace(/<(i|em)>/g,'\x3cspan style\x3d"font-style:italic"\x3e'),b=b.replace(/<a/g,"\x3cspan").replace(/<\/(b|strong|i|em|a)>/g,"\x3c/span\x3e").split(/<br.*?>/g)):b=[b],b=b.filter(function(a){return""!==a}),b.forEach(function(e,b){var l,c=0,B=0;e=e.replace(/^\s+|\s+$/g,"").replace(/<span/g,"|||\x3cspan").replace(/<\/span>/g,"\x3c/span\x3e|||");l=e.split("|||");l.forEach(function(e){if(""!==e||1===l.length){var x={},n=m.createElementNS(f.SVG_NS,
"tspan"),D,C;(D=w(e,"class"))&&d(n,"class",D);if(D=w(e,"style"))D=D.replace(/(;| |^)color([ :])/,"$1fill$2"),d(n,"style",D);(C=w(e,"href"))&&!k&&(d(n,"onclick",'location.href\x3d"'+C+'"'),d(n,"class","highcharts-anchor"),f.styledMode||v(n,{cursor:"pointer"}));e=M(e.replace(/<[a-zA-Z\/](.|\n)*?>/g,"")||" ");if(" "!==e){n.appendChild(m.createTextNode(e));c?x.dx=0:b&&null!==g&&(x.x=g);d(n,x);q.appendChild(n);!c&&H&&(!R&&k&&v(n,{display:"block"}),d(n,"dy",F(n)));if(A){var z=e.replace(/([^\^])-/g,"$1- ").split(" "),
x=!I&&(1<l.length||b||1<z.length);C=0;var h=F(n);if(t)p=f.truncate(a,n,e,void 0,0,Math.max(0,A-parseInt(L||12,10)),function(a,e){return a.substring(0,e)+"\u2026"});else if(x)for(;z.length;)z.length&&!I&&0<C&&(n=m.createElementNS(K,"tspan"),d(n,{dy:h,x:g}),D&&d(n,"style",D),n.appendChild(m.createTextNode(z.join(" ").replace(/- /g,"-"))),q.appendChild(n)),f.truncate(a,n,null,z,0===C?B:0,A,function(a,e){return z.slice(0,e).join(" ").replace(/- /g,"-")}),B=a.actualWidth,C++}c++}}});H=H||q.childNodes.length}),
t&&p&&a.attr("title",M(a.textStr,["\x26lt;","\x26gt;"])),B&&B.removeChild(q),n&&a.applyTextOutline&&a.applyTextOutline(n)):q.appendChild(m.createTextNode(M(b)))}},getContrast:function(a){a=u(a).rgba;a[0]*=1;a[1]*=1.2;a[2]*=.5;return 459<a[0]+a[1]+a[2]?"#000000":"#FFFFFF"},button:function(a,e,q,f,b,l,c,g,A){var B=this.label(a,e,q,A,null,null,null,null,"button"),K=0,n=this.styledMode;B.attr(k({padding:8,r:2},b));if(!n){var m,x,d,I;b=k({fill:"#f7f7f7",stroke:"#cccccc","stroke-width":1,style:{color:"#333333",
cursor:"pointer",fontWeight:"normal"}},b);m=b.style;delete b.style;l=k(b,{fill:"#e6e6e6"},l);x=l.style;delete l.style;c=k(b,{fill:"#e6ebf5",style:{color:"#000000",fontWeight:"bold"}},c);d=c.style;delete c.style;g=k(b,{style:{color:"#cccccc"}},g);I=g.style;delete g.style}E(B.element,t?"mouseover":"mouseenter",function(){3!==K&&B.setState(1)});E(B.element,t?"mouseout":"mouseleave",function(){3!==K&&B.setState(K)});B.setState=function(a){1!==a&&(B.state=K=a);B.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-"+
["normal","hover","pressed","disabled"][a||0]);n||B.attr([b,l,c,g][a||0]).css([m,x,d,I][a||0])};n||B.attr(b).css(p({cursor:"default"},m));return B.on("click",function(a){3!==K&&f.call(B,a)})},crispLine:function(a,e){a[1]===a[4]&&(a[1]=a[4]=Math.round(a[1])-e%2/2);a[2]===a[5]&&(a[2]=a[5]=Math.round(a[2])+e%2/2);return a},path:function(a){var e=this.styledMode?{}:{fill:"none"};f(a)?e.d=a:H(a)&&p(e,a);return this.createElement("path").attr(e)},circle:function(a,e,q){a=H(a)?a:void 0===a?{}:{x:a,y:e,r:q};
e=this.createElement("circle");e.xSetter=e.ySetter=function(a,e,q){q.setAttribute("c"+e,a)};return e.attr(a)},arc:function(a,e,q,b,f,k){H(a)?(b=a,e=b.y,q=b.r,a=b.x):b={innerR:b,start:f,end:k};a=this.symbol("arc",a,e,q,q,b);a.r=q;return a},rect:function(a,e,q,b,f,k){f=H(a)?a.r:f;var l=this.createElement("rect");a=H(a)?a:void 0===a?{}:{x:a,y:e,width:Math.max(q,0),height:Math.max(b,0)};this.styledMode||(void 0!==k&&(a.strokeWidth=k,a=l.crisp(a)),a.fill="none");f&&(a.r=f);l.rSetter=function(a,e,q){d(q,
{rx:a,ry:a})};return l.attr(a)},setSize:function(a,e,q){var b=this.alignedObjects,f=b.length;this.width=a;this.height=e;for(this.boxWrapper.animate({width:a,height:e},{step:function(){this.attr({viewBox:"0 0 "+this.attr("width")+" "+this.attr("height")})},duration:C(q,!0)?void 0:0});f--;)b[f].align()},g:function(a){var e=this.createElement("g");return a?e.attr({"class":"highcharts-"+a}):e},image:function(a,e,q,b,f,k){var l={preserveAspectRatio:"none"},c,g=function(a,e){a.setAttributeNS?a.setAttributeNS("http://www.w3.org/1999/xlink",
"href",e):a.setAttribute("hc-svg-href",e)},A=function(e){g(c.element,a);k.call(c,e)};1<arguments.length&&p(l,{x:e,y:q,width:b,height:f});c=this.createElement("image").attr(l);k?(g(c.element,"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw\x3d\x3d"),l=new S.Image,E(l,"load",A),l.src=a,l.complete&&A({})):g(c.element,a);return c},symbol:function(a,e,q,b,f,k){var l=this,c,g=/^url\((.*?)\)$/,A=g.test(a),K=!A&&(this.symbols[a]?a:"circle"),B=K&&this.symbols[K],x=n(e)&&B&&B.call(this.symbols,
Math.round(e),Math.round(q),b,f,k),d,t;B?(c=this.path(x),l.styledMode||c.attr("fill","none"),p(c,{symbolName:K,x:e,y:q,width:b,height:f}),k&&p(c,k)):A&&(d=a.match(g)[1],c=this.image(d),c.imgwidth=C(M[d]&&M[d].width,k&&k.width),c.imgheight=C(M[d]&&M[d].height,k&&k.height),t=function(){c.attr({width:c.width,height:c.height})},["width","height"].forEach(function(a){c[a+"Setter"]=function(a,e){var q={},b=this["img"+e],f="width"===e?"translateX":"translateY";this[e]=a;n(b)&&(this.element&&this.element.setAttribute(e,
b),this.alignByTranslate||(q[f]=((this[e]||0)-b)/2,this.attr(q)))}}),n(e)&&c.attr({x:e,y:q}),c.isImg=!0,n(c.imgwidth)&&n(c.imgheight)?t():(c.attr({width:0,height:0}),w("img",{onload:function(){var a=r[l.chartIndex];0===this.width&&(v(this,{position:"absolute",top:"-999em"}),m.body.appendChild(this));M[d]={width:this.width,height:this.height};c.imgwidth=this.width;c.imgheight=this.height;c.element&&t();this.parentNode&&this.parentNode.removeChild(this);l.imgCount--;if(!l.imgCount&&a&&a.onload)a.onload()},
src:d}),this.imgCount++));return c},symbols:{circle:function(a,e,q,b){return this.arc(a+q/2,e+b/2,q/2,b/2,{start:0,end:2*Math.PI,open:!1})},square:function(a,e,q,b){return["M",a,e,"L",a+q,e,a+q,e+b,a,e+b,"Z"]},triangle:function(a,e,q,b){return["M",a+q/2,e,"L",a+q,e+b,a,e+b,"Z"]},"triangle-down":function(a,e,q,b){return["M",a,e,"L",a+q,e,a+q/2,e+b,"Z"]},diamond:function(a,e,q,b){return["M",a+q/2,e,"L",a+q,e+b/2,a+q/2,e+b,a,e+b/2,"Z"]},arc:function(a,e,q,b,f){var k=f.start,c=f.r||q,l=f.r||b||q,p=f.end-
.001;q=f.innerR;b=C(f.open,.001>Math.abs(f.end-f.start-2*Math.PI));var g=Math.cos(k),A=Math.sin(k),K=Math.cos(p),p=Math.sin(p);f=.001>f.end-k-Math.PI?0:1;c=["M",a+c*g,e+l*A,"A",c,l,0,f,1,a+c*K,e+l*p];n(q)&&c.push(b?"M":"L",a+q*K,e+q*p,"A",q,q,0,f,0,a+q*g,e+q*A);c.push(b?"":"Z");return c},callout:function(a,e,q,b,f){var k=Math.min(f&&f.r||0,q,b),c=k+6,l=f&&f.anchorX;f=f&&f.anchorY;var p;p=["M",a+k,e,"L",a+q-k,e,"C",a+q,e,a+q,e,a+q,e+k,"L",a+q,e+b-k,"C",a+q,e+b,a+q,e+b,a+q-k,e+b,"L",a+k,e+b,"C",a,e+
b,a,e+b,a,e+b-k,"L",a,e+k,"C",a,e,a,e,a+k,e];l&&l>q?f>e+c&&f<e+b-c?p.splice(13,3,"L",a+q,f-6,a+q+6,f,a+q,f+6,a+q,e+b-k):p.splice(13,3,"L",a+q,b/2,l,f,a+q,b/2,a+q,e+b-k):l&&0>l?f>e+c&&f<e+b-c?p.splice(33,3,"L",a,f+6,a-6,f,a,f-6,a,e+k):p.splice(33,3,"L",a,b/2,l,f,a,b/2,a,e+k):f&&f>b&&l>a+c&&l<a+q-c?p.splice(23,3,"L",l+6,e+b,l,e+b+6,l-6,e+b,a+k,e+b):f&&0>f&&l>a+c&&l<a+q-c&&p.splice(3,3,"L",l-6,e,l,e-6,l+6,e,q-k,e);return p}},clipRect:function(e,q,b,f){var k=a.uniqueKey(),l=this.createElement("clipPath").attr({id:k}).add(this.defs);
e=this.rect(e,q,b,f,0).add(l);e.id=k;e.clipPath=l;e.count=0;return e},text:function(a,e,q,b){var f={};if(b&&(this.allowHTML||!this.forExport))return this.html(a,e,q);f.x=Math.round(e||0);q&&(f.y=Math.round(q));n(a)&&(f.text=a);a=this.createElement("text").attr(f);b||(a.xSetter=function(a,e,q){var b=q.getElementsByTagName("tspan"),f,k=q.getAttribute(e),l;for(l=0;l<b.length;l++)f=b[l],f.getAttribute(e)===k&&f.setAttribute(e,a);q.setAttribute(e,a)});return a},fontMetrics:function(a,q){a=this.styledMode?
q&&y.prototype.getStyle.call(q,"font-size"):a||q&&q.style&&q.style.fontSize||this.style&&this.style.fontSize;a=/px/.test(a)?e(a):/em/.test(a)?parseFloat(a)*(q?this.fontMetrics(null,q.parentNode).f:16):12;q=24>a?a+3:Math.round(1.2*a);return{h:q,b:Math.round(.8*q),f:a}},rotCorr:function(a,e,q){var b=a;e&&q&&(b=Math.max(b*Math.cos(e*g),4));return{x:-a/3*Math.sin(e*g),y:b}},label:function(e,b,f,l,c,g,A,K,d){var m=this,x=m.styledMode,t=m.g("button"!==d&&"label"),I=t.text=m.text("",0,0,A).attr({zIndex:1}),
D,L,B=0,C=3,z=0,H,h,F,M,R,w={},r,u,S=/^url\((.*?)\)$/.test(l),v=x||S,N=function(){return x?D.strokeWidth()%2/2:(r?parseInt(r,10):0)%2/2},P,T,E;d&&t.addClass("highcharts-"+d);P=function(){var a=I.element.style,e={};L=(void 0===H||void 0===h||R)&&n(I.textStr)&&I.getBBox();t.width=(H||L.width||0)+2*C+z;t.height=(h||L.height||0)+2*C;u=C+Math.min(m.fontMetrics(a&&a.fontSize,I).b,L?L.height:Infinity);v&&(D||(t.box=D=m.symbols[l]||S?m.symbol(l):m.rect(),D.addClass(("button"===d?"":"highcharts-label-box")+
(d?" highcharts-"+d+"-box":"")),D.add(t),a=N(),e.x=a,e.y=(K?-u:0)+a),e.width=Math.round(t.width),e.height=Math.round(t.height),D.attr(p(e,w)),w={})};T=function(){var a=z+C,e;e=K?0:u;n(H)&&L&&("center"===R||"right"===R)&&(a+={center:.5,right:1}[R]*(H-L.width));if(a!==I.x||e!==I.y)I.attr("x",a),I.hasBoxWidthChanged&&(L=I.getBBox(!0),P()),void 0!==e&&I.attr("y",e);I.x=a;I.y=e};E=function(a,e){D?D.attr(a,e):w[a]=e};t.onAdd=function(){I.add(t);t.attr({text:e||0===e?e:"",x:b,y:f});D&&n(c)&&t.attr({anchorX:c,
anchorY:g})};t.widthSetter=function(e){H=a.isNumber(e)?e:null};t.heightSetter=function(a){h=a};t["text-alignSetter"]=function(a){R=a};t.paddingSetter=function(a){n(a)&&a!==C&&(C=t.padding=a,T())};t.paddingLeftSetter=function(a){n(a)&&a!==z&&(z=a,T())};t.alignSetter=function(a){a={left:0,center:.5,right:1}[a];a!==B&&(B=a,L&&t.attr({x:F}))};t.textSetter=function(a){void 0!==a&&I.textSetter(a);P();T()};t["stroke-widthSetter"]=function(a,e){a&&(v=!0);r=this["stroke-width"]=a;E(e,a)};x?t.rSetter=function(a,
e){E(e,a)}:t.strokeSetter=t.fillSetter=t.rSetter=function(a,e){"r"!==e&&("fill"===e&&a&&(v=!0),t[e]=a);E(e,a)};t.anchorXSetter=function(a,e){c=t.anchorX=a;E(e,Math.round(a)-N()-F)};t.anchorYSetter=function(a,e){g=t.anchorY=a;E(e,a-M)};t.xSetter=function(a){t.x=a;B&&(a-=B*((H||L.width)+2*C),t["forceAnimate:x"]=!0);F=Math.round(a);t.attr("translateX",F)};t.ySetter=function(a){M=t.y=Math.round(a);t.attr("translateY",M)};var Q=t.css;A={css:function(a){if(a){var e={};a=k(a);t.textProps.forEach(function(q){void 0!==
a[q]&&(e[q]=a[q],delete a[q])});I.css(e);"width"in e&&P();"fontSize"in e&&(P(),T())}return Q.call(t,a)},getBBox:function(){return{width:L.width+2*C,height:L.height+2*C,x:L.x-C,y:L.y-C}},destroy:function(){q(t.element,"mouseenter");q(t.element,"mouseleave");I&&(I=I.destroy());D&&(D=D.destroy());y.prototype.destroy.call(t);t=m=P=T=E=null}};x||(A.shadow=function(a){a&&(P(),D&&D.shadow(a));return t});return p(t,A)}});a.Renderer=G})(J);(function(a){var y=a.attr,G=a.createElement,E=a.css,h=a.defined,d=
a.extend,r=a.isFirefox,u=a.isMS,v=a.isWebKit,w=a.pick,n=a.pInt,g=a.SVGRenderer,c=a.win,m=a.wrap;d(a.SVGElement.prototype,{htmlCss:function(a){var b="SPAN"===this.element.tagName&&a&&"width"in a,l=w(b&&a.width,void 0),f;b&&(delete a.width,this.textWidth=l,f=!0);a&&"ellipsis"===a.textOverflow&&(a.whiteSpace="nowrap",a.overflow="hidden");this.styles=d(this.styles,a);E(this.element,a);f&&this.htmlUpdateTransform();return this},htmlGetBBox:function(){var a=this.element;return{x:a.offsetLeft,y:a.offsetTop,
width:a.offsetWidth,height:a.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,b=this.element,l=this.translateX||0,f=this.translateY||0,c=this.x||0,g=this.y||0,m=this.textAlign||"left",d={left:0,center:.5,right:1}[m],z=this.styles,k=z&&z.whiteSpace;E(b,{marginLeft:l,marginTop:f});!a.styledMode&&this.shadows&&this.shadows.forEach(function(a){E(a,{marginLeft:l+1,marginTop:f+1})});this.inverted&&b.childNodes.forEach(function(e){a.invertChild(e,b)});if("SPAN"===b.tagName){var z=
this.rotation,A=this.textWidth&&n(this.textWidth),D=[z,m,b.innerHTML,this.textWidth,this.textAlign].join(),C;(C=A!==this.oldTextWidth)&&!(C=A>this.oldTextWidth)&&((C=this.textPxLength)||(E(b,{width:"",whiteSpace:k||"nowrap"}),C=b.offsetWidth),C=C>A);C&&(/[ \-]/.test(b.textContent||b.innerText)||"ellipsis"===b.style.textOverflow)?(E(b,{width:A+"px",display:"block",whiteSpace:k||"normal"}),this.oldTextWidth=A,this.hasBoxWidthChanged=!0):this.hasBoxWidthChanged=!1;D!==this.cTT&&(k=a.fontMetrics(b.style.fontSize,
b).b,!h(z)||z===(this.oldRotation||0)&&m===this.oldAlign||this.setSpanRotation(z,d,k),this.getSpanCorrection(!h(z)&&this.textPxLength||b.offsetWidth,k,d,z,m));E(b,{left:c+(this.xCorr||0)+"px",top:g+(this.yCorr||0)+"px"});this.cTT=D;this.oldRotation=z;this.oldAlign=m}}else this.alignOnAdd=!0},setSpanRotation:function(a,b,l){var f={},c=this.renderer.getTransformKey();f[c]=f.transform="rotate("+a+"deg)";f[c+(r?"Origin":"-origin")]=f.transformOrigin=100*b+"% "+l+"px";E(this.element,f)},getSpanCorrection:function(a,
b,l){this.xCorr=-a*l;this.yCorr=-b}});d(g.prototype,{getTransformKey:function(){return u&&!/Edge/.test(c.navigator.userAgent)?"-ms-transform":v?"-webkit-transform":r?"MozTransform":c.opera?"-o-transform":""},html:function(c,b,l){var f=this.createElement("span"),g=f.element,p=f.renderer,n=p.isSVG,h=function(a,b){["opacity","visibility"].forEach(function(f){m(a,f+"Setter",function(a,e,q,f){a.call(this,e,q,f);b[q]=e})});a.addedSetters=!0},z=a.charts[p.chartIndex],z=z&&z.styledMode;f.textSetter=function(a){a!==
g.innerHTML&&delete this.bBox;this.textStr=a;g.innerHTML=w(a,"");f.doTransform=!0};n&&h(f,f.element.style);f.xSetter=f.ySetter=f.alignSetter=f.rotationSetter=function(a,b){"align"===b&&(b="textAlign");f[b]=a;f.doTransform=!0};f.afterSetters=function(){this.doTransform&&(this.htmlUpdateTransform(),this.doTransform=!1)};f.attr({text:c,x:Math.round(b),y:Math.round(l)}).css({position:"absolute"});z||f.css({fontFamily:this.style.fontFamily,fontSize:this.style.fontSize});g.style.whiteSpace="nowrap";f.css=
f.htmlCss;n&&(f.add=function(a){var b,l=p.box.parentNode,c=[];if(this.parentGroup=a){if(b=a.div,!b){for(;a;)c.push(a),a=a.parentGroup;c.reverse().forEach(function(a){function e(e,q){a[q]=e;"translateX"===q?k.left=e+"px":k.top=e+"px";a.doTransform=!0}var k,g=y(a.element,"class");g&&(g={className:g});b=a.div=a.div||G("div",g,{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px",display:a.display,opacity:a.opacity,pointerEvents:a.styles&&a.styles.pointerEvents},b||l);k=b.style;
d(a,{classSetter:function(a){return function(e){this.element.setAttribute("class",e);a.className=e}}(b),on:function(){c[0].div&&f.on.apply({element:c[0].div},arguments);return a},translateXSetter:e,translateYSetter:e});a.addedSetters||h(a,k)})}}else b=l;b.appendChild(g);f.added=!0;f.alignOnAdd&&f.htmlUpdateTransform();return f});return f}})})(J);(function(a){var y=a.defined,G=a.extend,E=a.merge,h=a.pick,d=a.timeUnits,r=a.win;a.Time=function(a){this.update(a,!1)};a.Time.prototype={defaultOptions:{},
update:function(a){var d=h(a&&a.useUTC,!0),w=this;this.options=a=E(!0,this.options||{},a);this.Date=a.Date||r.Date;this.timezoneOffset=(this.useUTC=d)&&a.timezoneOffset;this.getTimezoneOffset=this.timezoneOffsetFunction();(this.variableTimezone=!(d&&!a.getTimezoneOffset&&!a.timezone))||this.timezoneOffset?(this.get=function(a,g){var c=g.getTime(),m=c-w.getTimezoneOffset(g);g.setTime(m);a=g["getUTC"+a]();g.setTime(c);return a},this.set=function(a,g,c){var m;if("Milliseconds"===a||"Seconds"===a||"Minutes"===
a&&0===g.getTimezoneOffset()%60)g["set"+a](c);else m=w.getTimezoneOffset(g),m=g.getTime()-m,g.setTime(m),g["setUTC"+a](c),a=w.getTimezoneOffset(g),m=g.getTime()+a,g.setTime(m)}):d?(this.get=function(a,g){return g["getUTC"+a]()},this.set=function(a,g,c){return g["setUTC"+a](c)}):(this.get=function(a,g){return g["get"+a]()},this.set=function(a,g,c){return g["set"+a](c)})},makeTime:function(d,r,w,n,g,c){var m,p,b;this.useUTC?(m=this.Date.UTC.apply(0,arguments),p=this.getTimezoneOffset(m),m+=p,b=this.getTimezoneOffset(m),
p!==b?m+=b-p:p-36E5!==this.getTimezoneOffset(m-36E5)||a.isSafari||(m-=36E5)):m=(new this.Date(d,r,h(w,1),h(n,0),h(g,0),h(c,0))).getTime();return m},timezoneOffsetFunction:function(){var d=this,h=this.options,w=r.moment;if(!this.useUTC)return function(a){return 6E4*(new Date(a)).getTimezoneOffset()};if(h.timezone){if(w)return function(a){return 6E4*-w.tz(a,h.timezone).utcOffset()};a.error(25)}return this.useUTC&&h.getTimezoneOffset?function(a){return 6E4*h.getTimezoneOffset(a)}:function(){return 6E4*
(d.timezoneOffset||0)}},dateFormat:function(d,h,w){if(!a.defined(h)||isNaN(h))return a.defaultOptions.lang.invalidDate||"";d=a.pick(d,"%Y-%m-%d %H:%M:%S");var n=this,g=new this.Date(h),c=this.get("Hours",g),m=this.get("Day",g),p=this.get("Date",g),b=this.get("Month",g),l=this.get("FullYear",g),f=a.defaultOptions.lang,x=f.weekdays,t=f.shortWeekdays,H=a.pad,g=a.extend({a:t?t[m]:x[m].substr(0,3),A:x[m],d:H(p),e:H(p,2," "),w:m,b:f.shortMonths[b],B:f.months[b],m:H(b+1),o:b+1,y:l.toString().substr(2,2),
Y:l,H:H(c),k:c,I:H(c%12||12),l:c%12||12,M:H(n.get("Minutes",g)),p:12>c?"AM":"PM",P:12>c?"am":"pm",S:H(g.getSeconds()),L:H(Math.floor(h%1E3),3)},a.dateFormats);a.objectEach(g,function(a,b){for(;-1!==d.indexOf("%"+b);)d=d.replace("%"+b,"function"===typeof a?a.call(n,h):a)});return w?d.substr(0,1).toUpperCase()+d.substr(1):d},resolveDTLFormat:function(d){return a.isObject(d,!0)?d:(d=a.splat(d),{main:d[0],from:d[1],to:d[2]})},getTimeTicks:function(a,r,w,n){var g=this,c=[],m,p={},b;m=new g.Date(r);var l=
a.unitRange,f=a.count||1,x;n=h(n,1);if(y(r)){g.set("Milliseconds",m,l>=d.second?0:f*Math.floor(g.get("Milliseconds",m)/f));l>=d.second&&g.set("Seconds",m,l>=d.minute?0:f*Math.floor(g.get("Seconds",m)/f));l>=d.minute&&g.set("Minutes",m,l>=d.hour?0:f*Math.floor(g.get("Minutes",m)/f));l>=d.hour&&g.set("Hours",m,l>=d.day?0:f*Math.floor(g.get("Hours",m)/f));l>=d.day&&g.set("Date",m,l>=d.month?1:Math.max(1,f*Math.floor(g.get("Date",m)/f)));l>=d.month&&(g.set("Month",m,l>=d.year?0:f*Math.floor(g.get("Month",
m)/f)),b=g.get("FullYear",m));l>=d.year&&g.set("FullYear",m,b-b%f);l===d.week&&(b=g.get("Day",m),g.set("Date",m,g.get("Date",m)-b+n+(b<n?-7:0)));b=g.get("FullYear",m);n=g.get("Month",m);var t=g.get("Date",m),H=g.get("Hours",m);r=m.getTime();g.variableTimezone&&(x=w-r>4*d.month||g.getTimezoneOffset(r)!==g.getTimezoneOffset(w));r=m.getTime();for(m=1;r<w;)c.push(r),r=l===d.year?g.makeTime(b+m*f,0):l===d.month?g.makeTime(b,n+m*f):!x||l!==d.day&&l!==d.week?x&&l===d.hour&&1<f?g.makeTime(b,n,t,H+m*f):r+
l*f:g.makeTime(b,n,t+m*f*(l===d.day?1:7)),m++;c.push(r);l<=d.hour&&1E4>c.length&&c.forEach(function(a){0===a%18E5&&"000000000"===g.dateFormat("%H%M%S%L",a)&&(p[a]="day")})}c.info=G(a,{higherRanks:p,totalRange:l*f});return c}}})(J);(function(a){var y=a.color,G=a.merge;a.defaultOptions={colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),
shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{},time:a.Time.prototype.defaultOptions,chart:{styledMode:!1,borderRadius:0,colorCount:10,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],resetZoomButton:{theme:{zIndex:6},position:{align:"right",
x:-10,y:10}},width:null,height:null,borderColor:"#335cad",backgroundColor:"#ffffff",plotBorderColor:"#cccccc"},title:{text:"Chart title",align:"center",margin:15,widthAdjust:-44},subtitle:{text:"",align:"center",widthAdjust:-44},plotOptions:{},labels:{style:{position:"absolute",color:"#333333"}},legend:{enabled:!0,align:"center",alignColumns:!0,layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#999999",borderRadius:0,navigation:{activeColor:"#003399",inactiveColor:"#cccccc"},
itemStyle:{color:"#333333",cursor:"pointer",fontSize:"12px",fontWeight:"bold",textOverflow:"ellipsis"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#cccccc"},shadow:!1,itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},squareSymbol:!0,symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"#ffffff",opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,
animation:a.svg,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",padding:8,snap:a.isTouchDevice?25:10,headerFormat:'\x3cspan style\x3d"font-size: 10px"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e',pointFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e',
backgroundColor:y("#f7f7f7").setOpacity(.85).get(),borderWidth:1,shadow:!0,style:{color:"#333333",cursor:"default",fontSize:"12px",pointerEvents:"none",whiteSpace:"nowrap"}},credits:{enabled:!0,href:"https://www.highcharts.com?credits",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#999999",fontSize:"9px"},text:"Highcharts.com"}};a.setOptions=function(y){a.defaultOptions=G(!0,a.defaultOptions,y);a.time.update(G(a.defaultOptions.global,a.defaultOptions.time),
!1);return a.defaultOptions};a.getOptions=function(){return a.defaultOptions};a.defaultPlotOptions=a.defaultOptions.plotOptions;a.time=new a.Time(G(a.defaultOptions.global,a.defaultOptions.time));a.dateFormat=function(y,h,d){return a.time.dateFormat(y,h,d)}})(J);(function(a){var y=a.correctFloat,G=a.defined,E=a.destroyObjectProperties,h=a.fireEvent,d=a.isNumber,r=a.merge,u=a.pick,v=a.deg2rad;a.Tick=function(a,d,g,c,m){this.axis=a;this.pos=d;this.type=g||"";this.isNewLabel=this.isNew=!0;this.parameters=
m||{};this.tickmarkOffset=this.parameters.tickmarkOffset;this.options=this.parameters.options;g||c||this.addLabel()};a.Tick.prototype={addLabel:function(){var d=this,n=d.axis,g=n.options,c=n.chart,m=n.categories,p=n.names,b=d.pos,l=u(d.options&&d.options.labels,g.labels),f=n.tickPositions,x=b===f[0],t=b===f[f.length-1],m=this.parameters.category||(m?u(m[b],p[b],b):b),h=d.label,f=f.info,F,z,k,A;n.isDatetimeAxis&&f&&(z=c.time.resolveDTLFormat(g.dateTimeLabelFormats[!g.grid&&f.higherRanks[b]||f.unitName]),
F=z.main);d.isFirst=x;d.isLast=t;d.formatCtx={axis:n,chart:c,isFirst:x,isLast:t,dateTimeLabelFormat:F,tickPositionInfo:f,value:n.isLog?y(n.lin2log(m)):m,pos:b};g=n.labelFormatter.call(d.formatCtx,this.formatCtx);if(A=z&&z.list)d.shortenLabel=function(){for(k=0;k<A.length;k++)if(h.attr({text:n.labelFormatter.call(a.extend(d.formatCtx,{dateTimeLabelFormat:A[k]}))}),h.getBBox().width<n.getSlotWidth(d)-2*u(l.padding,5))return;h.attr({text:""})};if(G(h))h&&h.textStr!==g&&(!h.textWidth||l.style&&l.style.width||
h.styles.width||h.css({width:null}),h.attr({text:g}));else{if(d.label=h=G(g)&&l.enabled?c.renderer.text(g,0,0,l.useHTML).add(n.labelGroup):null)c.styledMode||h.css(r(l.style)),h.textPxLength=h.getBBox().width;d.rotation=0}},getLabelSize:function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0},handleOverflow:function(a){var d=this.axis,g=d.options.labels,c=a.x,m=d.chart.chartWidth,p=d.chart.spacing,b=u(d.labelLeft,Math.min(d.pos,p[3])),p=u(d.labelRight,Math.max(d.isRadial?
0:d.pos+d.len,m-p[1])),l=this.label,f=this.rotation,x={left:0,center:.5,right:1}[d.labelAlign||l.attr("align")],t=l.getBBox().width,h=d.getSlotWidth(this),F=h,z=1,k,A={};if(f||"justify"!==u(g.overflow,"justify"))0>f&&c-x*t<b?k=Math.round(c/Math.cos(f*v)-b):0<f&&c+x*t>p&&(k=Math.round((m-c)/Math.cos(f*v)));else if(m=c+(1-x)*t,c-x*t<b?F=a.x+F*(1-x)-b:m>p&&(F=p-a.x+F*x,z=-1),F=Math.min(h,F),F<h&&"center"===d.labelAlign&&(a.x+=z*(h-F-x*(h-Math.min(t,F)))),t>F||d.autoRotation&&(l.styles||{}).width)k=F;
k&&(this.shortenLabel?this.shortenLabel():(A.width=Math.floor(k),(g.style||{}).textOverflow||(A.textOverflow="ellipsis"),l.css(A)))},getPosition:function(d,n,g,c){var m=this.axis,p=m.chart,b=c&&p.oldChartHeight||p.chartHeight;d={x:d?a.correctFloat(m.translate(n+g,null,null,c)+m.transB):m.left+m.offset+(m.opposite?(c&&p.oldChartWidth||p.chartWidth)-m.right-m.left:0),y:d?b-m.bottom+m.offset-(m.opposite?m.height:0):a.correctFloat(b-m.translate(n+g,null,null,c)-m.transB)};h(this,"afterGetPosition",{pos:d});
return d},getLabelPosition:function(a,d,g,c,m,p,b,l){var f=this.axis,x=f.transA,t=f.reversed,n=f.staggerLines,F=f.tickRotCorr||{x:0,y:0},z=m.y,k=c||f.reserveSpaceDefault?0:-f.labelOffset*("center"===f.labelAlign?.5:1),A={};G(z)||(z=0===f.side?g.rotation?-8:-g.getBBox().height:2===f.side?F.y+8:Math.cos(g.rotation*v)*(F.y-g.getBBox(!1,0).height/2));a=a+m.x+k+F.x-(p&&c?p*x*(t?-1:1):0);d=d+z-(p&&!c?p*x*(t?1:-1):0);n&&(g=b/(l||1)%n,f.opposite&&(g=n-g-1),d+=f.labelOffset/n*g);A.x=a;A.y=Math.round(d);h(this,
"afterGetLabelPosition",{pos:A});return A},getMarkPath:function(a,d,g,c,m,p){return p.crispLine(["M",a,d,"L",a+(m?0:-g),d+(m?g:0)],c)},renderGridLine:function(a,d,g){var c=this.axis,m=c.options,p=this.gridLine,b={},l=this.pos,f=this.type,x=u(this.tickmarkOffset,c.tickmarkOffset),t=c.chart.renderer,n=f?f+"Grid":"grid",h=m[n+"LineWidth"],z=m[n+"LineColor"],m=m[n+"LineDashStyle"];p||(c.chart.styledMode||(b.stroke=z,b["stroke-width"]=h,m&&(b.dashstyle=m)),f||(b.zIndex=1),a&&(d=0),this.gridLine=p=t.path().attr(b).addClass("highcharts-"+
(f?f+"-":"")+"grid-line").add(c.gridGroup));if(p&&(g=c.getPlotLinePath(l+x,p.strokeWidth()*g,a,"pass")))p[a||this.isNew?"attr":"animate"]({d:g,opacity:d})},renderMark:function(a,d,g){var c=this.axis,m=c.options,p=c.chart.renderer,b=this.type,l=b?b+"Tick":"tick",f=c.tickSize(l),x=this.mark,t=!x,n=a.x;a=a.y;var h=u(m[l+"Width"],!b&&c.isXAxis?1:0),m=m[l+"Color"];f&&(c.opposite&&(f[0]=-f[0]),t&&(this.mark=x=p.path().addClass("highcharts-"+(b?b+"-":"")+"tick").add(c.axisGroup),c.chart.styledMode||x.attr({stroke:m,
"stroke-width":h})),x[t?"attr":"animate"]({d:this.getMarkPath(n,a,f[0],x.strokeWidth()*g,c.horiz,p),opacity:d}))},renderLabel:function(a,n,g,c){var m=this.axis,p=m.horiz,b=m.options,l=this.label,f=b.labels,x=f.step,m=u(this.tickmarkOffset,m.tickmarkOffset),t=!0,h=a.x;a=a.y;l&&d(h)&&(l.xy=a=this.getLabelPosition(h,a,l,p,f,m,c,x),this.isFirst&&!this.isLast&&!u(b.showFirstLabel,1)||this.isLast&&!this.isFirst&&!u(b.showLastLabel,1)?t=!1:!p||f.step||f.rotation||n||0===g||this.handleOverflow(a),x&&c%x&&
(t=!1),t&&d(a.y)?(a.opacity=g,l[this.isNewLabel?"attr":"animate"](a),this.isNewLabel=!1):(l.attr("y",-9999),this.isNewLabel=!0))},render:function(d,n,g){var c=this.axis,m=c.horiz,p=this.pos,b=u(this.tickmarkOffset,c.tickmarkOffset),p=this.getPosition(m,p,b,n),b=p.x,l=p.y,c=m&&b===c.pos+c.len||!m&&l===c.pos?-1:1;g=u(g,1);this.isActive=!0;this.renderGridLine(n,g,c);this.renderMark(p,g,c);this.renderLabel(p,n,g,d);this.isNew=!1;a.fireEvent(this,"afterRender")},destroy:function(){E(this,this.axis)}}})(J);
var V=function(a){var y=a.addEvent,G=a.animObject,E=a.arrayMax,h=a.arrayMin,d=a.color,r=a.correctFloat,u=a.defaultOptions,v=a.defined,w=a.deg2rad,n=a.destroyObjectProperties,g=a.extend,c=a.fireEvent,m=a.format,p=a.getMagnitude,b=a.isArray,l=a.isNumber,f=a.isString,x=a.merge,t=a.normalizeTickInterval,H=a.objectEach,F=a.pick,z=a.removeEvent,k=a.splat,A=a.syncTimeout,D=a.Tick,C=function(){this.init.apply(this,arguments)};a.extend(C.prototype,{defaultOptions:{dateTimeLabelFormats:{millisecond:{main:"%H:%M:%S.%L",
range:!1},second:{main:"%H:%M:%S",range:!1},minute:{main:"%H:%M",range:!1},hour:{main:"%H:%M",range:!1},day:{main:"%e. %b"},week:{main:"%e. %b"},month:{main:"%b '%y"},year:{main:"%Y"}},endOnTick:!1,labels:{enabled:!0,indentation:10,x:0,style:{color:"#666666",cursor:"default",fontSize:"11px"}},maxPadding:.01,minorTickLength:2,minorTickPosition:"outside",minPadding:.01,startOfWeek:1,startOnTick:!1,tickLength:10,tickPixelInterval:100,tickmarkPlacement:"between",tickPosition:"outside",title:{align:"middle",
style:{color:"#666666"}},type:"linear",minorGridLineColor:"#f2f2f2",minorGridLineWidth:1,minorTickColor:"#999999",lineColor:"#ccd6eb",lineWidth:1,gridLineColor:"#e6e6e6",tickColor:"#ccd6eb"},defaultYAxisOptions:{endOnTick:!0,maxPadding:.05,minPadding:.05,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{allowOverlap:!1,enabled:!1,formatter:function(){return a.numberFormat(this.total,-1)},style:{color:"#000000",fontSize:"11px",fontWeight:"bold",
textOutline:"1px contrast"}},gridLineWidth:1,lineWidth:0},defaultLeftAxisOptions:{labels:{x:-15},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15},title:{rotation:90}},defaultBottomAxisOptions:{labels:{autoRotation:[-45],x:0},title:{rotation:0}},defaultTopAxisOptions:{labels:{autoRotation:[-45],x:0},title:{rotation:0}},init:function(a,q){var e=q.isX,b=this;b.chart=a;b.horiz=a.inverted&&!b.isZAxis?!e:e;b.isXAxis=e;b.coll=b.coll||(e?"xAxis":"yAxis");c(this,"init",{userOptions:q});b.opposite=
q.opposite;b.side=q.side||(b.horiz?b.opposite?0:2:b.opposite?1:3);b.setOptions(q);var f=this.options,l=f.type;b.labelFormatter=f.labels.formatter||b.defaultLabelFormatter;b.userOptions=q;b.minPixelPadding=0;b.reversed=f.reversed;b.visible=!1!==f.visible;b.zoomEnabled=!1!==f.zoomEnabled;b.hasNames="category"===l||!0===f.categories;b.categories=f.categories||b.hasNames;b.names||(b.names=[],b.names.keys={});b.plotLinesAndBandsGroups={};b.isLog="logarithmic"===l;b.isDatetimeAxis="datetime"===l;b.positiveValuesOnly=
b.isLog&&!b.allowNegativeLog;b.isLinked=v(f.linkedTo);b.ticks={};b.labelEdge=[];b.minorTicks={};b.plotLinesAndBands=[];b.alternateBands={};b.len=0;b.minRange=b.userMinRange=f.minRange||f.maxZoom;b.range=f.range;b.offset=f.offset||0;b.stacks={};b.oldStacks={};b.stacksTouched=0;b.max=null;b.min=null;b.crosshair=F(f.crosshair,k(a.options.tooltip.crosshairs)[e?0:1],!1);q=b.options.events;-1===a.axes.indexOf(b)&&(e?a.axes.splice(a.xAxis.length,0,b):a.axes.push(b),a[b.coll].push(b));b.series=b.series||
[];a.inverted&&!b.isZAxis&&e&&void 0===b.reversed&&(b.reversed=!0);H(q,function(a,e){y(b,e,a)});b.lin2log=f.linearToLogConverter||b.lin2log;b.isLog&&(b.val2lin=b.log2lin,b.lin2val=b.lin2log);c(this,"afterInit")},setOptions:function(a){this.options=x(this.defaultOptions,"yAxis"===this.coll&&this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],x(u[this.coll],a));c(this,"afterSetOptions",{userOptions:a})},
defaultLabelFormatter:function(){var e=this.axis,q=this.value,b=e.chart.time,f=e.categories,l=this.dateTimeLabelFormat,c=u.lang,k=c.numericSymbols,c=c.numericSymbolMagnitude||1E3,g=k&&k.length,d,p=e.options.labels.format,e=e.isLog?Math.abs(q):e.tickInterval;if(p)d=m(p,this,b);else if(f)d=q;else if(l)d=b.dateFormat(l,q);else if(g&&1E3<=e)for(;g--&&void 0===d;)b=Math.pow(c,g+1),e>=b&&0===10*q%b&&null!==k[g]&&0!==q&&(d=a.numberFormat(q/b,-1)+k[g]);void 0===d&&(d=1E4<=Math.abs(q)?a.numberFormat(q,-1):
a.numberFormat(q,-1,void 0,""));return d},getSeriesExtremes:function(){var a=this,q=a.chart;c(this,"getSeriesExtremes",null,function(){a.hasVisibleSeries=!1;a.dataMin=a.dataMax=a.threshold=null;a.softThreshold=!a.isXAxis;a.buildStacks&&a.buildStacks();a.series.forEach(function(e){if(e.visible||!q.options.chart.ignoreHiddenSeries){var b=e.options,f=b.threshold,c;a.hasVisibleSeries=!0;a.positiveValuesOnly&&0>=f&&(f=null);if(a.isXAxis)b=e.xData,b.length&&(e=h(b),c=E(b),l(e)||e instanceof Date||(b=b.filter(l),
e=h(b),c=E(b)),b.length&&(a.dataMin=Math.min(F(a.dataMin,b[0],e),e),a.dataMax=Math.max(F(a.dataMax,b[0],c),c)));else if(e.getExtremes(),c=e.dataMax,e=e.dataMin,v(e)&&v(c)&&(a.dataMin=Math.min(F(a.dataMin,e),e),a.dataMax=Math.max(F(a.dataMax,c),c)),v(f)&&(a.threshold=f),!b.softThreshold||a.positiveValuesOnly)a.softThreshold=!1}})});c(this,"afterGetSeriesExtremes")},translate:function(a,q,b,f,c,k){var e=this.linkedParent||this,d=1,g=0,p=f?e.oldTransA:e.transA;f=f?e.oldMin:e.min;var A=e.minPixelPadding;
c=(e.isOrdinal||e.isBroken||e.isLog&&c)&&e.lin2val;p||(p=e.transA);b&&(d*=-1,g=e.len);e.reversed&&(d*=-1,g-=d*(e.sector||e.len));q?(a=(a*d+g-A)/p+f,c&&(a=e.lin2val(a))):(c&&(a=e.val2lin(a)),a=l(f)?d*(a-f)*p+g+d*A+(l(k)?p*k:0):void 0);return a},toPixels:function(a,q){return this.translate(a,!1,!this.horiz,null,!0)+(q?0:this.pos)},toValue:function(a,q){return this.translate(a-(q?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,q,b,f,c){var e=this.chart,k=this.left,d=this.top,g,p,A=b&&
e.oldChartHeight||e.chartHeight,t=b&&e.oldChartWidth||e.chartWidth,m;g=this.transB;var x=function(a,e,q){if("pass"!==f&&a<e||a>q)f?a=Math.min(Math.max(e,a),q):m=!0;return a};c=F(c,this.translate(a,null,null,b));c=Math.min(Math.max(-1E5,c),1E5);a=b=Math.round(c+g);g=p=Math.round(A-c-g);l(c)?this.horiz?(g=d,p=A-this.bottom,a=b=x(a,k,k+this.width)):(a=k,b=t-this.right,g=p=x(g,d,d+this.height)):(m=!0,f=!1);return m&&!f?null:e.renderer.crispLine(["M",a,g,"L",b,p],q||1)},getLinearTickPositions:function(a,
q,b){var e,f=r(Math.floor(q/a)*a);b=r(Math.ceil(b/a)*a);var c=[],k;r(f+a)===f&&(k=20);if(this.single)return[q];for(q=f;q<=b;){c.push(q);q=r(q+a,k);if(q===e)break;e=q}return c},getMinorTickInterval:function(){var a=this.options;return!0===a.minorTicks?F(a.minorTickInterval,"auto"):!1===a.minorTicks?null:a.minorTickInterval},getMinorTickPositions:function(){var a=this,q=a.options,b=a.tickPositions,f=a.minorTickInterval,c=[],k=a.pointRangePadding||0,l=a.min-k,k=a.max+k,g=k-l;if(g&&g/f<a.len/3)if(a.isLog)this.paddedTicks.forEach(function(e,
q,b){q&&c.push.apply(c,a.getLogTickPositions(f,b[q-1],b[q],!0))});else if(a.isDatetimeAxis&&"auto"===this.getMinorTickInterval())c=c.concat(a.getTimeTicks(a.normalizeTimeTickInterval(f),l,k,q.startOfWeek));else for(q=l+(b[0]-l)%f;q<=k&&q!==c[0];q+=f)c.push(q);0!==c.length&&a.trimTicks(c);return c},adjustForMinRange:function(){var a=this.options,q=this.min,b=this.max,f,c,k,l,g,d,p,A;this.isXAxis&&void 0===this.minRange&&!this.isLog&&(v(a.min)||v(a.max)?this.minRange=null:(this.series.forEach(function(a){d=
a.xData;for(l=p=a.xIncrement?1:d.length-1;0<l;l--)if(g=d[l]-d[l-1],void 0===k||g<k)k=g}),this.minRange=Math.min(5*k,this.dataMax-this.dataMin)));b-q<this.minRange&&(c=this.dataMax-this.dataMin>=this.minRange,A=this.minRange,f=(A-b+q)/2,f=[q-f,F(a.min,q-f)],c&&(f[2]=this.isLog?this.log2lin(this.dataMin):this.dataMin),q=E(f),b=[q+A,F(a.max,q+A)],c&&(b[2]=this.isLog?this.log2lin(this.dataMax):this.dataMax),b=h(b),b-q<A&&(f[0]=b-A,f[1]=F(a.min,b-A),q=E(f)));this.min=q;this.max=b},getClosest:function(){var a;
this.categories?a=1:this.series.forEach(function(e){var q=e.closestPointRange,b=e.visible||!e.chart.options.chart.ignoreHiddenSeries;!e.noSharedTooltip&&v(q)&&b&&(a=v(a)?Math.min(a,q):q)});return a},nameToX:function(a){var e=b(this.categories),f=e?this.categories:this.names,c=a.options.x,k;a.series.requireSorting=!1;v(c)||(c=!1===this.options.uniqueNames?a.series.autoIncrement():e?f.indexOf(a.name):F(f.keys[a.name],-1));-1===c?e||(k=f.length):k=c;void 0!==k&&(this.names[k]=a.name,this.names.keys[a.name]=
k);return k},updateNames:function(){var a=this,q=this.names;0<q.length&&(Object.keys(q.keys).forEach(function(a){delete q.keys[a]}),q.length=0,this.minRange=this.userMinRange,(this.series||[]).forEach(function(e){e.xIncrement=null;if(!e.points||e.isDirtyData)a.max=Math.max(a.max,e.xData.length-1),e.processData(),e.generatePoints();e.data.forEach(function(q,b){var f;q&&q.options&&void 0!==q.name&&(f=a.nameToX(q),void 0!==f&&f!==q.x&&(q.x=f,e.xData[b]=f))})}))},setAxisTranslation:function(a){var e=
this,b=e.max-e.min,k=e.axisPointRange||0,l,g=0,d=0,p=e.linkedParent,A=!!e.categories,t=e.transA,m=e.isXAxis;if(m||A||k)l=e.getClosest(),p?(g=p.minPointOffset,d=p.pointRangePadding):e.series.forEach(function(a){var b=A?1:m?F(a.options.pointRange,l,0):e.axisPointRange||0;a=a.options.pointPlacement;k=Math.max(k,b);e.single||(g=Math.max(g,f(a)?0:b/2),d=Math.max(d,"on"===a?0:b))}),p=e.ordinalSlope&&l?e.ordinalSlope/l:1,e.minPointOffset=g*=p,e.pointRangePadding=d*=p,e.pointRange=Math.min(k,b),m&&(e.closestPointRange=
l);a&&(e.oldTransA=t);e.translationSlope=e.transA=t=e.staticScale||e.len/(b+d||1);e.transB=e.horiz?e.left:e.bottom;e.minPixelPadding=t*g;c(this,"afterSetAxisTranslation")},minFromRange:function(){return this.max-this.range},setTickInterval:function(e){var b=this,f=b.chart,k=b.options,g=b.isLog,d=b.isDatetimeAxis,A=b.isXAxis,m=b.isLinked,x=k.maxPadding,n=k.minPadding,D,h=k.tickInterval,C=k.tickPixelInterval,z=b.categories,H=l(b.threshold)?b.threshold:null,w=b.softThreshold,u,y,E;d||z||m||this.getTickAmount();
y=F(b.userMin,k.min);E=F(b.userMax,k.max);m?(b.linkedParent=f[b.coll][k.linkedTo],D=b.linkedParent.getExtremes(),b.min=F(D.min,D.dataMin),b.max=F(D.max,D.dataMax),k.type!==b.linkedParent.options.type&&a.error(11,1,f)):(!w&&v(H)&&(b.dataMin>=H?(D=H,n=0):b.dataMax<=H&&(u=H,x=0)),b.min=F(y,D,b.dataMin),b.max=F(E,u,b.dataMax));g&&(b.positiveValuesOnly&&!e&&0>=Math.min(b.min,F(b.dataMin,b.min))&&a.error(10,1,f),b.min=r(b.log2lin(b.min),15),b.max=r(b.log2lin(b.max),15));b.range&&v(b.max)&&(b.userMin=b.min=
y=Math.max(b.dataMin,b.minFromRange()),b.userMax=E=b.max,b.range=null);c(b,"foundExtremes");b.beforePadding&&b.beforePadding();b.adjustForMinRange();!(z||b.axisPointRange||b.usePercentage||m)&&v(b.min)&&v(b.max)&&(f=b.max-b.min)&&(!v(y)&&n&&(b.min-=f*n),!v(E)&&x&&(b.max+=f*x));l(k.softMin)&&!l(b.userMin)&&(b.min=Math.min(b.min,k.softMin));l(k.softMax)&&!l(b.userMax)&&(b.max=Math.max(b.max,k.softMax));l(k.floor)&&(b.min=Math.min(Math.max(b.min,k.floor),Number.MAX_VALUE));l(k.ceiling)&&(b.max=Math.max(Math.min(b.max,
k.ceiling),F(b.userMax,-Number.MAX_VALUE)));w&&v(b.dataMin)&&(H=H||0,!v(y)&&b.min<H&&b.dataMin>=H?b.min=H:!v(E)&&b.max>H&&b.dataMax<=H&&(b.max=H));b.tickInterval=b.min===b.max||void 0===b.min||void 0===b.max?1:m&&!h&&C===b.linkedParent.options.tickPixelInterval?h=b.linkedParent.tickInterval:F(h,this.tickAmount?(b.max-b.min)/Math.max(this.tickAmount-1,1):void 0,z?1:(b.max-b.min)*C/Math.max(b.len,C));A&&!e&&b.series.forEach(function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);
b.beforeSetTickPositions&&b.beforeSetTickPositions();b.postProcessTickInterval&&(b.tickInterval=b.postProcessTickInterval(b.tickInterval));b.pointRange&&!h&&(b.tickInterval=Math.max(b.pointRange,b.tickInterval));e=F(k.minTickInterval,b.isDatetimeAxis&&b.closestPointRange);!h&&b.tickInterval<e&&(b.tickInterval=e);d||g||h||(b.tickInterval=t(b.tickInterval,null,p(b.tickInterval),F(k.allowDecimals,!(.5<b.tickInterval&&5>b.tickInterval&&1E3<b.max&&9999>b.max)),!!this.tickAmount));this.tickAmount||(b.tickInterval=
b.unsquish());this.setTickPositions()},setTickPositions:function(){var e=this.options,b,f=e.tickPositions;b=this.getMinorTickInterval();var k=e.tickPositioner,l=e.startOnTick,g=e.endOnTick;this.tickmarkOffset=this.categories&&"between"===e.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===b&&this.tickInterval?this.tickInterval/5:b;this.single=this.min===this.max&&v(this.min)&&!this.tickAmount&&(parseInt(this.min,10)===this.min||!1!==e.allowDecimals);this.tickPositions=
b=f&&f.slice();!b&&(!this.ordinalPositions&&(this.max-this.min)/this.tickInterval>Math.max(2*this.len,200)?(b=[this.min,this.max],a.error(19,!1,this.chart)):b=this.isDatetimeAxis?this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,e.units),this.min,this.max,e.startOfWeek,this.ordinalPositions,this.closestPointRange,!0):this.isLog?this.getLogTickPositions(this.tickInterval,this.min,this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max),b.length>this.len&&(b=[b[0],
b.pop()],b[0]===b[1]&&(b.length=1)),this.tickPositions=b,k&&(k=k.apply(this,[this.min,this.max])))&&(this.tickPositions=b=k);this.paddedTicks=b.slice(0);this.trimTicks(b,l,g);this.isLinked||(this.single&&2>b.length&&(this.min-=.5,this.max+=.5),f||k||this.adjustTickAmount());c(this,"afterSetTickPositions")},trimTicks:function(a,b,f){var e=a[0],k=a[a.length-1],q=this.minPointOffset||0;if(!this.isLinked){if(b&&-Infinity!==e)this.min=e;else for(;this.min-q>a[0];)a.shift();if(f)this.max=k;else for(;this.max+
q<a[a.length-1];)a.pop();0===a.length&&v(e)&&!this.options.tickPositions&&a.push((k+e)/2)}},alignToOthers:function(){var a={},b,f=this.options;!1===this.chart.options.chart.alignTicks||!1===f.alignTicks||!1===f.startOnTick||!1===f.endOnTick||this.isLog||this.chart[this.coll].forEach(function(e){var f=e.options,f=[e.horiz?f.left:f.top,f.width,f.height,f.pane].join();e.series.length&&(a[f]?b=!0:a[f]=1)});return b},getTickAmount:function(){var a=this.options,b=a.tickAmount,f=a.tickPixelInterval;!v(a.tickInterval)&&
this.len<f&&!this.isRadial&&!this.isLog&&a.startOnTick&&a.endOnTick&&(b=2);!b&&this.alignToOthers()&&(b=Math.ceil(this.len/f)+1);4>b&&(this.finalTickAmt=b,b=5);this.tickAmount=b},adjustTickAmount:function(){var a=this.tickInterval,b=this.tickPositions,f=this.tickAmount,k=this.finalTickAmt,c=b&&b.length,l=F(this.threshold,this.softThreshold?0:null);if(this.hasData()){if(c<f){for(;b.length<f;)b.length%2||this.min===l?b.push(r(b[b.length-1]+a)):b.unshift(r(b[0]-a));this.transA*=(c-1)/(f-1);this.min=
b[0];this.max=b[b.length-1]}else c>f&&(this.tickInterval*=2,this.setTickPositions());if(v(k)){for(a=f=b.length;a--;)(3===k&&1===a%2||2>=k&&0<a&&a<f-1)&&b.splice(a,1);this.finalTickAmt=void 0}}},setScale:function(){var a,b;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();b=this.len!==this.oldAxisLength;this.series.forEach(function(e){if(e.isDirtyData||e.isDirty||e.xAxis.isDirty)a=!0});b||a||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==
this.oldUserMax||this.alignToOthers()?(this.resetStacks&&this.resetStacks(),this.forceRedraw=!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,this.isDirty||(this.isDirty=b||this.min!==this.oldMin||this.max!==this.oldMax)):this.cleanStacks&&this.cleanStacks();c(this,"afterSetScale")},setExtremes:function(a,b,f,k,l){var e=this,q=e.chart;f=F(f,!0);e.series.forEach(function(a){delete a.kdTree});l=g(l,{min:a,max:b});c(e,"setExtremes",l,function(){e.userMin=
a;e.userMax=b;e.eventArgs=l;f&&q.redraw(k)})},zoom:function(a,b){var e=this.dataMin,f=this.dataMax,k=this.options,c=Math.min(e,F(k.min,e)),k=Math.max(f,F(k.max,f));if(a!==this.min||b!==this.max)this.allowZoomOutside||(v(e)&&(a<c&&(a=c),a>k&&(a=k)),v(f)&&(b<c&&(b=c),b>k&&(b=k))),this.displayBtn=void 0!==a||void 0!==b,this.setExtremes(a,b,!1,void 0,{trigger:"zoom"});return!0},setAxisSize:function(){var e=this.chart,b=this.options,f=b.offsets||[0,0,0,0],k=this.horiz,c=this.width=Math.round(a.relativeLength(F(b.width,
e.plotWidth-f[3]+f[1]),e.plotWidth)),l=this.height=Math.round(a.relativeLength(F(b.height,e.plotHeight-f[0]+f[2]),e.plotHeight)),g=this.top=Math.round(a.relativeLength(F(b.top,e.plotTop+f[0]),e.plotHeight,e.plotTop)),b=this.left=Math.round(a.relativeLength(F(b.left,e.plotLeft+f[3]),e.plotWidth,e.plotLeft));this.bottom=e.chartHeight-l-g;this.right=e.chartWidth-c-b;this.len=Math.max(k?c:l,0);this.pos=k?b:g},getExtremes:function(){var a=this.isLog;return{min:a?r(this.lin2log(this.min)):this.min,max:a?
r(this.lin2log(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var e=this.isLog,b=e?this.lin2log(this.min):this.min,e=e?this.lin2log(this.max):this.max;null===a||-Infinity===a?a=b:Infinity===a?a=e:b>a?a=b:e<a&&(a=e);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=(F(a,0)-90*this.side+720)%360;return 15<a&&165>a?"right":195<a&&345>a?"left":"center"},tickSize:function(a){var e=this.options,b=e[a+"Length"],
f=F(e[a+"Width"],"tick"===a&&this.isXAxis?1:0);if(f&&b)return"inside"===e[a+"Position"]&&(b=-b),[b,f]},labelMetrics:function(){var a=this.tickPositions&&this.tickPositions[0]||0;return this.chart.renderer.fontMetrics(this.options.labels.style&&this.options.labels.style.fontSize,this.ticks[a]&&this.ticks[a].label)},unsquish:function(){var a=this.options.labels,b=this.horiz,f=this.tickInterval,k=f,c=this.len/(((this.categories?1:0)+this.max-this.min)/f),l,g=a.rotation,d=this.labelMetrics(),p,A=Number.MAX_VALUE,
t,m=function(a){a/=c||1;a=1<a?Math.ceil(a):1;return r(a*f)};b?(t=!a.staggerLines&&!a.step&&(v(g)?[g]:c<F(a.autoRotationLimit,80)&&a.autoRotation))&&t.forEach(function(a){var e;if(a===g||a&&-90<=a&&90>=a)p=m(Math.abs(d.h/Math.sin(w*a))),e=p+Math.abs(a/360),e<A&&(A=e,l=a,k=p)}):a.step||(k=m(d.h));this.autoRotation=t;this.labelRotation=F(l,g);return k},getSlotWidth:function(a){var e=this.chart,b=this.horiz,f=this.options.labels,k=Math.max(this.tickPositions.length-(this.categories?0:1),1),c=e.margin[3];
return a&&a.slotWidth||b&&2>(f.step||0)&&!f.rotation&&(this.staggerLines||1)*this.len/k||!b&&(f.style&&parseInt(f.style.width,10)||c&&c-e.spacing[3]||.33*e.chartWidth)},renderUnsquish:function(){var a=this.chart,b=a.renderer,k=this.tickPositions,c=this.ticks,l=this.options.labels,g=l&&l.style||{},d=this.horiz,p=this.getSlotWidth(),A=Math.max(1,Math.round(p-2*(l.padding||5))),t={},m=this.labelMetrics(),x=l.style&&l.style.textOverflow,n,D,h=0,C;f(l.rotation)||(t.rotation=l.rotation||0);k.forEach(function(a){(a=
c[a])&&a.label&&a.label.textPxLength>h&&(h=a.label.textPxLength)});this.maxLabelLength=h;if(this.autoRotation)h>A&&h>m.h?t.rotation=this.labelRotation:this.labelRotation=0;else if(p&&(n=A,!x))for(D="clip",A=k.length;!d&&A--;)if(C=k[A],C=c[C].label)C.styles&&"ellipsis"===C.styles.textOverflow?C.css({textOverflow:"clip"}):C.textPxLength>p&&C.css({width:p+"px"}),C.getBBox().height>this.len/k.length-(m.h-m.f)&&(C.specificTextOverflow="ellipsis");t.rotation&&(n=h>.5*a.chartHeight?.33*a.chartHeight:h,x||
(D="ellipsis"));if(this.labelAlign=l.align||this.autoLabelAlign(this.labelRotation))t.align=this.labelAlign;k.forEach(function(a){var b=(a=c[a])&&a.label,e=g.width,f={};b&&(b.attr(t),a.shortenLabel?a.shortenLabel():n&&!e&&"nowrap"!==g.whiteSpace&&(n<b.textPxLength||"SPAN"===b.element.tagName)?(f.width=n,x||(f.textOverflow=b.specificTextOverflow||D),b.css(f)):b.styles&&b.styles.width&&!f.width&&!e&&b.css({width:null}),delete b.specificTextOverflow,a.rotation=t.rotation)},this);this.tickRotCorr=b.rotCorr(m.b,
this.labelRotation||0,0!==this.side)},hasData:function(){return this.hasVisibleSeries||v(this.min)&&v(this.max)&&this.tickPositions&&0<this.tickPositions.length},addTitle:function(a){var b=this.chart.renderer,e=this.horiz,f=this.opposite,k=this.options.title,c,l=this.chart.styledMode;this.axisTitle||((c=k.textAlign)||(c=(e?{low:"left",middle:"center",high:"right"}:{low:f?"right":"left",middle:"center",high:f?"left":"right"})[k.align]),this.axisTitle=b.text(k.text,0,0,k.useHTML).attr({zIndex:7,rotation:k.rotation||
0,align:c}).addClass("highcharts-axis-title"),l||this.axisTitle.css(x(k.style)),this.axisTitle.add(this.axisGroup),this.axisTitle.isNew=!0);l||k.style.width||this.isRadial||this.axisTitle.css({width:this.len});this.axisTitle[a?"show":"hide"](!0)},generateTick:function(a){var b=this.ticks;b[a]?b[a].addLabel():b[a]=new D(this,a)},getOffset:function(){var a=this,b=a.chart,f=b.renderer,k=a.options,l=a.tickPositions,g=a.ticks,d=a.horiz,p=a.side,A=b.inverted&&!a.isZAxis?[1,0,3,2][p]:p,t,m,x=0,n,D=0,h=k.title,
C=k.labels,z=0,r=b.axisOffset,b=b.clipOffset,w=[-1,1,1,-1][p],u=k.className,y=a.axisParent;t=a.hasData();a.showAxis=m=t||F(k.showEmpty,!0);a.staggerLines=a.horiz&&C.staggerLines;a.axisGroup||(a.gridGroup=f.g("grid").attr({zIndex:k.gridZIndex||1}).addClass("highcharts-"+this.coll.toLowerCase()+"-grid "+(u||"")).add(y),a.axisGroup=f.g("axis").attr({zIndex:k.zIndex||2}).addClass("highcharts-"+this.coll.toLowerCase()+" "+(u||"")).add(y),a.labelGroup=f.g("axis-labels").attr({zIndex:C.zIndex||7}).addClass("highcharts-"+
a.coll.toLowerCase()+"-labels "+(u||"")).add(y));t||a.isLinked?(l.forEach(function(b,e){a.generateTick(b,e)}),a.renderUnsquish(),a.reserveSpaceDefault=0===p||2===p||{1:"left",3:"right"}[p]===a.labelAlign,F(C.reserveSpace,"center"===a.labelAlign?!0:null,a.reserveSpaceDefault)&&l.forEach(function(a){z=Math.max(g[a].getLabelSize(),z)}),a.staggerLines&&(z*=a.staggerLines),a.labelOffset=z*(a.opposite?-1:1)):H(g,function(a,b){a.destroy();delete g[b]});h&&h.text&&!1!==h.enabled&&(a.addTitle(m),m&&!1!==h.reserveSpace&&
(a.titleOffset=x=a.axisTitle.getBBox()[d?"height":"width"],n=h.offset,D=v(n)?0:F(h.margin,d?5:10)));a.renderLine();a.offset=w*F(k.offset,r[p]);a.tickRotCorr=a.tickRotCorr||{x:0,y:0};f=0===p?-a.labelMetrics().h:2===p?a.tickRotCorr.y:0;D=Math.abs(z)+D;z&&(D=D-f+w*(d?F(C.y,a.tickRotCorr.y+8*w):C.x));a.axisTitleMargin=F(n,D);a.getMaxLabelDimensions&&(a.maxLabelDimensions=a.getMaxLabelDimensions(g,l));d=this.tickSize("tick");r[p]=Math.max(r[p],a.axisTitleMargin+x+w*a.offset,D,t&&l.length&&d?d[0]+w*a.offset:
0);k=k.offset?0:2*Math.floor(a.axisLine.strokeWidth()/2);b[A]=Math.max(b[A],k);c(this,"afterGetOffset")},getLinePath:function(a){var b=this.chart,e=this.opposite,f=this.offset,k=this.horiz,c=this.left+(e?this.width:0)+f,f=b.chartHeight-this.bottom-(e?this.height:0)+f;e&&(a*=-1);return b.renderer.crispLine(["M",k?this.left:c,k?f:this.top,"L",k?b.chartWidth-this.right:c,k?f:b.chartHeight-this.bottom],a)},renderLine:function(){this.axisLine||(this.axisLine=this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),
this.chart.styledMode||this.axisLine.attr({stroke:this.options.lineColor,"stroke-width":this.options.lineWidth,zIndex:7}))},getTitlePosition:function(){var a=this.horiz,b=this.left,f=this.top,k=this.len,c=this.options.title,l=a?b:f,g=this.opposite,d=this.offset,p=c.x||0,A=c.y||0,t=this.axisTitle,m=this.chart.renderer.fontMetrics(c.style&&c.style.fontSize,t),t=Math.max(t.getBBox(null,0).height-m.h-1,0),k={low:l+(a?0:k),middle:l+k/2,high:l+(a?k:0)}[c.align],b=(a?f+this.height:b)+(a?1:-1)*(g?-1:1)*this.axisTitleMargin+
[-t,t,m.f,-t][this.side];return{x:a?k+p:b+(g?this.width:0)+d+p,y:a?b+A-(g?this.height:0)+d:k+A}},renderMinorTick:function(a){var b=this.chart.hasRendered&&l(this.oldMin),e=this.minorTicks;e[a]||(e[a]=new D(this,a,"minor"));b&&e[a].isNew&&e[a].render(null,!0);e[a].render(null,!1,1)},renderTick:function(a,b){var e=this.isLinked,f=this.ticks,k=this.chart.hasRendered&&l(this.oldMin);if(!e||a>=this.min&&a<=this.max)f[a]||(f[a]=new D(this,a)),k&&f[a].isNew&&f[a].render(b,!0,-1),f[a].render(b)},render:function(){var b=
this,f=b.chart,k=b.options,g=b.isLog,d=b.isLinked,p=b.tickPositions,t=b.axisTitle,m=b.ticks,x=b.minorTicks,n=b.alternateBands,h=k.stackLabels,C=k.alternateGridColor,z=b.tickmarkOffset,F=b.axisLine,r=b.showAxis,w=G(f.renderer.globalAnimation),u,v;b.labelEdge.length=0;b.overlap=!1;[m,x,n].forEach(function(a){H(a,function(a){a.isActive=!1})});if(b.hasData()||d)b.minorTickInterval&&!b.categories&&b.getMinorTickPositions().forEach(function(a){b.renderMinorTick(a)}),p.length&&(p.forEach(function(a,e){b.renderTick(a,
e)}),z&&(0===b.min||b.single)&&(m[-1]||(m[-1]=new D(b,-1,null,!0)),m[-1].render(-1))),C&&p.forEach(function(e,k){v=void 0!==p[k+1]?p[k+1]+z:b.max-z;0===k%2&&e<b.max&&v<=b.max+(f.polar?-z:z)&&(n[e]||(n[e]=new a.PlotLineOrBand(b)),u=e+z,n[e].options={from:g?b.lin2log(u):u,to:g?b.lin2log(v):v,color:C},n[e].render(),n[e].isActive=!0)}),b._addedPlotLB||((k.plotLines||[]).concat(k.plotBands||[]).forEach(function(a){b.addPlotBandOrLine(a)}),b._addedPlotLB=!0);[m,x,n].forEach(function(a){var b,e=[],k=w.duration;
H(a,function(a,b){a.isActive||(a.render(b,!1,0),a.isActive=!1,e.push(b))});A(function(){for(b=e.length;b--;)a[e[b]]&&!a[e[b]].isActive&&(a[e[b]].destroy(),delete a[e[b]])},a!==n&&f.hasRendered&&k?k:0)});F&&(F[F.isPlaced?"animate":"attr"]({d:this.getLinePath(F.strokeWidth())}),F.isPlaced=!0,F[r?"show":"hide"](!0));t&&r&&(k=b.getTitlePosition(),l(k.y)?(t[t.isNew?"attr":"animate"](k),t.isNew=!1):(t.attr("y",-9999),t.isNew=!0));h&&h.enabled&&b.renderStackTotals();b.isDirty=!1;c(this,"afterRender")},redraw:function(){this.visible&&
(this.render(),this.plotLinesAndBands.forEach(function(a){a.render()}));this.series.forEach(function(a){a.isDirty=!0})},keepProps:"extKey hcEvents names series userMax userMin".split(" "),destroy:function(a){var b=this,e=b.stacks,f=b.plotLinesAndBands,k;c(this,"destroy",{keepEvents:a});a||z(b);H(e,function(a,b){n(a);e[b]=null});[b.ticks,b.minorTicks,b.alternateBands].forEach(function(a){n(a)});if(f)for(a=f.length;a--;)f[a].destroy();"stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" ").forEach(function(a){b[a]&&
(b[a]=b[a].destroy())});for(k in b.plotLinesAndBandsGroups)b.plotLinesAndBandsGroups[k]=b.plotLinesAndBandsGroups[k].destroy();H(b,function(a,e){-1===b.keepProps.indexOf(e)&&delete b[e]})},drawCrosshair:function(a,b){var e,f=this.crosshair,k=F(f.snap,!0),l,g=this.cross;c(this,"drawCrosshair",{e:a,point:b});a||(a=this.cross&&this.cross.e);if(this.crosshair&&!1!==(v(b)||!k)){k?v(b)&&(l=F(b.crosshairPos,this.isXAxis?b.plotX:this.len-b.plotY)):l=a&&(this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos);
v(l)&&(e=this.getPlotLinePath(b&&(this.isXAxis?b.x:F(b.stackY,b.y)),null,null,null,l)||null);if(!v(e)){this.hideCrosshair();return}k=this.categories&&!this.isRadial;g||(this.cross=g=this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-"+(k?"category ":"thin ")+f.className).attr({zIndex:F(f.zIndex,2)}).add(),this.chart.styledMode||(g.attr({stroke:f.color||(k?d("#ccd6eb").setOpacity(.25).get():"#cccccc"),"stroke-width":F(f.width,1)}).css({"pointer-events":"none"}),f.dashStyle&&
g.attr({dashstyle:f.dashStyle})));g.show().attr({d:e});k&&!f.width&&g.attr({"stroke-width":this.transA});this.cross.e=a}else this.hideCrosshair();c(this,"afterDrawCrosshair",{e:a,point:b})},hideCrosshair:function(){this.cross&&this.cross.hide()}});return a.Axis=C}(J);(function(a){var y=a.Axis,G=a.getMagnitude,E=a.normalizeTickInterval,h=a.timeUnits;y.prototype.getTimeTicks=function(){return this.chart.time.getTimeTicks.apply(this.chart.time,arguments)};y.prototype.normalizeTimeTickInterval=function(a,
r){var d=r||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]];r=d[d.length-1];var v=h[r[0]],w=r[1],n;for(n=0;n<d.length&&!(r=d[n],v=h[r[0]],w=r[1],d[n+1]&&a<=(v*w[w.length-1]+h[d[n+1][0]])/2);n++);v===h.year&&a<5*v&&(w=[1,2,5]);a=E(a/v,w,"year"===r[0]?Math.max(G(a/v),1):1);return{unitRange:v,count:a,unitName:r[0]}}})(J);(function(a){var y=a.Axis,G=a.getMagnitude,
E=a.normalizeTickInterval,h=a.pick;y.prototype.getLogTickPositions=function(a,r,u,v){var d=this.options,n=this.len,g=[];v||(this._minorAutoInterval=null);if(.5<=a)a=Math.round(a),g=this.getLinearTickPositions(a,r,u);else if(.08<=a)for(var n=Math.floor(r),c,m,p,b,l,d=.3<a?[1,2,4]:.15<a?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];n<u+1&&!l;n++)for(m=d.length,c=0;c<m&&!l;c++)p=this.log2lin(this.lin2log(n)*d[c]),p>r&&(!v||b<=u)&&void 0!==b&&g.push(b),b>u&&(l=!0),b=p;else r=this.lin2log(r),u=this.lin2log(u),a=v?this.getMinorTickInterval():
d.tickInterval,a=h("auto"===a?null:a,this._minorAutoInterval,d.tickPixelInterval/(v?5:1)*(u-r)/((v?n/this.tickPositions.length:n)||1)),a=E(a,null,G(a)),g=this.getLinearTickPositions(a,r,u).map(this.log2lin),v||(this._minorAutoInterval=a/5);v||(this.tickInterval=a);return g};y.prototype.log2lin=function(a){return Math.log(a)/Math.LN10};y.prototype.lin2log=function(a){return Math.pow(10,a)}})(J);(function(a,y){var G=a.arrayMax,E=a.arrayMin,h=a.defined,d=a.destroyObjectProperties,r=a.erase,u=a.merge,
v=a.pick;a.PlotLineOrBand=function(a,d){this.axis=a;d&&(this.options=d,this.id=d.id)};a.PlotLineOrBand.prototype={render:function(){a.fireEvent(this,"render");var d=this,n=d.axis,g=n.horiz,c=d.options,m=c.label,p=d.label,b=c.to,l=c.from,f=c.value,x=h(l)&&h(b),t=h(f),H=d.svgElem,F=!H,z=[],k=c.color,A=v(c.zIndex,0),D=c.events,z={"class":"highcharts-plot-"+(x?"band ":"line ")+(c.className||"")},C={},e=n.chart.renderer,q=x?"bands":"lines";n.isLog&&(l=n.log2lin(l),b=n.log2lin(b),f=n.log2lin(f));n.chart.styledMode||
(t?(z.stroke=k,z["stroke-width"]=c.width,c.dashStyle&&(z.dashstyle=c.dashStyle)):x&&(k&&(z.fill=k),c.borderWidth&&(z.stroke=c.borderColor,z["stroke-width"]=c.borderWidth)));C.zIndex=A;q+="-"+A;(k=n.plotLinesAndBandsGroups[q])||(n.plotLinesAndBandsGroups[q]=k=e.g("plot-"+q).attr(C).add());F&&(d.svgElem=H=e.path().attr(z).add(k));if(t)z=n.getPlotLinePath(f,H.strokeWidth());else if(x)z=n.getPlotBandPath(l,b,c);else return;F&&z&&z.length?(H.attr({d:z}),D&&a.objectEach(D,function(a,b){H.on(b,function(a){D[b].apply(d,
[a])})})):H&&(z?(H.show(),H.animate({d:z})):(H.hide(),p&&(d.label=p=p.destroy())));m&&h(m.text)&&z&&z.length&&0<n.width&&0<n.height&&!z.isFlat?(m=u({align:g&&x&&"center",x:g?!x&&4:10,verticalAlign:!g&&x&&"middle",y:g?x?16:10:x?6:-4,rotation:g&&!x&&90},m),this.renderLabel(m,z,x,A)):p&&p.hide();return d},renderLabel:function(a,d,g,c){var m=this.label,p=this.axis.chart.renderer;m||(m={align:a.textAlign||a.align,rotation:a.rotation,"class":"highcharts-plot-"+(g?"band":"line")+"-label "+(a.className||
"")},m.zIndex=c,this.label=m=p.text(a.text,0,0,a.useHTML).attr(m).add(),this.axis.chart.styledMode||m.css(a.style));c=d.xBounds||[d[1],d[4],g?d[6]:d[1]];d=d.yBounds||[d[2],d[5],g?d[7]:d[2]];g=E(c);p=E(d);m.align(a,!1,{x:g,y:p,width:G(c)-g,height:G(d)-p});m.show()},destroy:function(){r(this.axis.plotLinesAndBands,this);delete this.axis;d(this)}};a.extend(y.prototype,{getPlotBandPath:function(a,d){var g=this.getPlotLinePath(d,null,null,!0),c=this.getPlotLinePath(a,null,null,!0),m=[],p=this.horiz,b=
1,l;a=a<this.min&&d<this.min||a>this.max&&d>this.max;if(c&&g)for(a&&(l=c.toString()===g.toString(),b=0),a=0;a<c.length;a+=6)p&&g[a+1]===c[a+1]?(g[a+1]+=b,g[a+4]+=b):p||g[a+2]!==c[a+2]||(g[a+2]+=b,g[a+5]+=b),m.push("M",c[a+1],c[a+2],"L",c[a+4],c[a+5],g[a+4],g[a+5],g[a+1],g[a+2],"z"),m.isFlat=l;return m},addPlotBand:function(a){return this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){return this.addPlotBandOrLine(a,"plotLines")},addPlotBandOrLine:function(d,n){var g=(new a.PlotLineOrBand(this,
d)).render(),c=this.userOptions;g&&(n&&(c[n]=c[n]||[],c[n].push(d)),this.plotLinesAndBands.push(g));return g},removePlotBandOrLine:function(a){for(var d=this.plotLinesAndBands,g=this.options,c=this.userOptions,m=d.length;m--;)d[m].id===a&&d[m].destroy();[g.plotLines||[],c.plotLines||[],g.plotBands||[],c.plotBands||[]].forEach(function(c){for(m=c.length;m--;)c[m].id===a&&r(c,c[m])})},removePlotBand:function(a){this.removePlotBandOrLine(a)},removePlotLine:function(a){this.removePlotBandOrLine(a)}})})(J,
V);(function(a){var y=a.doc,G=a.extend,E=a.format,h=a.isNumber,d=a.merge,r=a.pick,u=a.splat,v=a.syncTimeout,w=a.timeUnits;a.Tooltip=function(){this.init.apply(this,arguments)};a.Tooltip.prototype={init:function(a,d){this.chart=a;this.options=d;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.split=d.split&&!a.inverted;this.shared=d.shared||this.split;this.outside=d.outside&&!this.split},cleanSplit:function(a){this.chart.series.forEach(function(d){var c=d&&d.tt;c&&(!c.isActive||a?d.tt=c.destroy():
c.isActive=!1)})},applyFilter:function(){var a=this.chart;a.renderer.definition({tagName:"filter",id:"drop-shadow-"+a.index,opacity:.5,children:[{tagName:"feGaussianBlur",in:"SourceAlpha",stdDeviation:1},{tagName:"feOffset",dx:1,dy:1},{tagName:"feComponentTransfer",children:[{tagName:"feFuncA",type:"linear",slope:.3}]},{tagName:"feMerge",children:[{tagName:"feMergeNode"},{tagName:"feMergeNode",in:"SourceGraphic"}]}]});a.renderer.definition({tagName:"style",textContent:".highcharts-tooltip-"+a.index+
"{filter:url(#drop-shadow-"+a.index+")}"})},getLabel:function(){var d=this.chart.renderer,g=this.chart.styledMode,c=this.options,m;this.label||(this.outside&&(this.container=m=a.doc.createElement("div"),m.className="highcharts-tooltip-container",a.css(m,{position:"absolute",top:"1px",pointerEvents:c.style&&c.style.pointerEvents}),a.doc.body.appendChild(m),this.renderer=d=new a.Renderer(m,0,0)),this.split?this.label=d.g("tooltip"):(this.label=d.label("",0,0,c.shape||"callout",null,null,c.useHTML,null,
"tooltip").attr({padding:c.padding,r:c.borderRadius}),g||this.label.attr({fill:c.backgroundColor,"stroke-width":c.borderWidth}).css(c.style).shadow(c.shadow)),g&&(this.applyFilter(),this.label.addClass("highcharts-tooltip-"+this.chart.index)),this.outside&&(this.label.attr({x:this.distance,y:this.distance}),this.label.xSetter=function(a){m.style.left=a+"px"},this.label.ySetter=function(a){m.style.top=a+"px"}),this.label.attr({zIndex:8}).add());return this.label},update:function(a){this.destroy();
d(!0,this.chart.options.tooltip.userOptions,a);this.init(this.chart,d(!0,this.options,a))},destroy:function(){this.label&&(this.label=this.label.destroy());this.split&&this.tt&&(this.cleanSplit(this.chart,!0),this.tt=this.tt.destroy());this.renderer&&(this.renderer=this.renderer.destroy(),a.discardElement(this.container));a.clearTimeout(this.hideTimer);a.clearTimeout(this.tooltipTimeout)},move:function(d,g,c,m){var p=this,b=p.now,l=!1!==p.options.animation&&!p.isHidden&&(1<Math.abs(d-b.x)||1<Math.abs(g-
b.y)),f=p.followPointer||1<p.len;G(b,{x:l?(2*b.x+d)/3:d,y:l?(b.y+g)/2:g,anchorX:f?void 0:l?(2*b.anchorX+c)/3:c,anchorY:f?void 0:l?(b.anchorY+m)/2:m});p.getLabel().attr(b);l&&(a.clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){p&&p.move(d,g,c,m)},32))},hide:function(d){var g=this;a.clearTimeout(this.hideTimer);d=r(d,this.options.hideDelay,500);this.isHidden||(this.hideTimer=v(function(){g.getLabel()[d?"fadeOut":"hide"]();g.isHidden=!0},d))},getAnchor:function(a,d){var c=
this.chart,g=c.pointer,p=c.inverted,b=c.plotTop,l=c.plotLeft,f=0,x=0,t,h;a=u(a);this.followPointer&&d?(void 0===d.chartX&&(d=g.normalize(d)),a=[d.chartX-c.plotLeft,d.chartY-b]):a[0].tooltipPos?a=a[0].tooltipPos:(a.forEach(function(a){t=a.series.yAxis;h=a.series.xAxis;f+=a.plotX+(!p&&h?h.left-l:0);x+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!p&&t?t.top-b:0)}),f/=a.length,x/=a.length,a=[p?c.plotWidth-x:f,this.shared&&!p&&1<a.length&&d?d.chartY-b:p?c.plotHeight-f:x]);return a.map(Math.round)},getPosition:function(a,
d,c){var g=this.chart,p=this.distance,b={},l=g.inverted&&c.h||0,f,x=this.outside,t=x?y.documentElement.clientWidth-2*p:g.chartWidth,h=x?Math.max(y.body.scrollHeight,y.documentElement.scrollHeight,y.body.offsetHeight,y.documentElement.offsetHeight,y.documentElement.clientHeight):g.chartHeight,n=g.pointer.chartPosition,z=["y",h,d,(x?n.top-p:0)+c.plotY+g.plotTop,x?0:g.plotTop,x?h:g.plotTop+g.plotHeight],k=["x",t,a,(x?n.left-p:0)+c.plotX+g.plotLeft,x?0:g.plotLeft,x?t:g.plotLeft+g.plotWidth],A=!this.followPointer&&
r(c.ttBelow,!g.inverted===!!c.negative),D=function(a,e,f,k,c,d){var g=f<k-p,q=k+p+f<e,t=k-p-f;k+=p;if(A&&q)b[a]=k;else if(!A&&g)b[a]=t;else if(g)b[a]=Math.min(d-f,0>t-l?t:t-l);else if(q)b[a]=Math.max(c,k+l+f>e?k:k+l);else return!1},C=function(a,e,f,k){var c;k<p||k>e-p?c=!1:b[a]=k<f/2?1:k>e-f/2?e-f-2:k-f/2;return c},e=function(a){var b=z;z=k;k=b;f=a},q=function(){!1!==D.apply(0,z)?!1!==C.apply(0,k)||f||(e(!0),q()):f?b.x=b.y=0:(e(!0),q())};(g.inverted||1<this.len)&&e();q();return b},defaultFormatter:function(a){var d=
this.points||u(this),c;c=[a.tooltipFooterHeaderFormatter(d[0])];c=c.concat(a.bodyFormatter(d));c.push(a.tooltipFooterHeaderFormatter(d[0],!0));return c},refresh:function(d,g){var c,m=this.options,p,b=d,l,f={},x=[];c=m.formatter||this.defaultFormatter;var f=this.shared,t,h=this.chart.styledMode;m.enabled&&(a.clearTimeout(this.hideTimer),this.followPointer=u(b)[0].series.tooltipOptions.followPointer,l=this.getAnchor(b,g),g=l[0],p=l[1],!f||b.series&&b.series.noSharedTooltip?f=b.getLabelConfig():(b.forEach(function(a){a.setState("hover");
x.push(a.getLabelConfig())}),f={x:b[0].category,y:b[0].y},f.points=x,b=b[0]),this.len=x.length,f=c.call(f,this),t=b.series,this.distance=r(t.tooltipOptions.distance,16),!1===f?this.hide():(c=this.getLabel(),this.isHidden&&c.attr({opacity:1}).show(),this.split?this.renderSplit(f,u(d)):(m.style.width&&!h||c.css({width:this.chart.spacingBox.width}),c.attr({text:f&&f.join?f.join(""):f}),c.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-"+r(b.colorIndex,t.colorIndex)),h||c.attr({stroke:m.borderColor||
b.color||t.color||"#666666"}),this.updatePosition({plotX:g,plotY:p,negative:b.negative,ttBelow:b.ttBelow,h:l[2]||0})),this.isHidden=!1))},renderSplit:function(d,g){var c=this,m=[],p=this.chart,b=p.renderer,l=!0,f=this.options,x=0,t,h=this.getLabel(),n=p.plotTop;a.isString(d)&&(d=[!1,d]);d.slice(0,g.length+1).forEach(function(a,k){if(!1!==a&&""!==a){k=g[k-1]||{isHeader:!0,plotX:g[0].plotX,plotY:p.plotHeight};var d=k.series||c,D=d.tt,C=k.series||{},e="highcharts-color-"+r(k.colorIndex,C.colorIndex,
"none");D||(D={padding:f.padding,r:f.borderRadius},p.styledMode||(D.fill=f.backgroundColor,D.stroke=f.borderColor||k.color||C.color||"#333333",D["stroke-width"]=f.borderWidth),d.tt=D=b.label(null,null,null,(k.isHeader?f.headerShape:f.shape)||"callout",null,null,f.useHTML).addClass("highcharts-tooltip-box "+e).attr(D).add(h));D.isActive=!0;D.attr({text:a});p.styledMode||D.css(f.style).shadow(f.shadow);a=D.getBBox();C=a.width+D.strokeWidth();k.isHeader?(x=a.height,p.xAxis[0].opposite&&(t=!0,n-=x),C=
Math.max(0,Math.min(k.plotX+p.plotLeft-C/2,p.chartWidth+(p.scrollablePixels?p.scrollablePixels-p.marginRight:0)-C))):C=k.plotX+p.plotLeft-r(f.distance,16)-C;0>C&&(l=!1);a=(k.series&&k.series.yAxis&&k.series.yAxis.pos)+(k.plotY||0);a-=n;k.isHeader&&(a=t?-x:p.plotHeight+x);m.push({target:a,rank:k.isHeader?1:0,size:d.tt.getBBox().height+1,point:k,x:C,tt:D})}});this.cleanSplit();f.positioner&&m.forEach(function(a){var b=f.positioner.call(c,a.tt.getBBox().width,a.size,a.point);a.x=b.x;a.align=0;a.target=
b.y;a.rank=r(b.rank,a.rank)});a.distribute(m,p.plotHeight+x);m.forEach(function(a){var b=a.point,c=b.series;a.tt.attr({visibility:void 0===a.pos?"hidden":"inherit",x:l||b.isHeader||f.positioner?a.x:b.plotX+p.plotLeft+r(f.distance,16),y:a.pos+n,anchorX:b.isHeader?b.plotX+p.plotLeft:b.plotX+c.xAxis.pos,anchorY:b.isHeader?p.plotTop+p.plotHeight/2:b.plotY+c.yAxis.pos})})},updatePosition:function(a){var d=this.chart,c=this.getLabel(),m=(this.options.positioner||this.getPosition).call(this,c.width,c.height,
a),p=a.plotX+d.plotLeft;a=a.plotY+d.plotTop;var b;this.outside&&(b=(this.options.borderWidth||0)+2*this.distance,this.renderer.setSize(c.width+b,c.height+b,!1),p+=d.pointer.chartPosition.left-m.x,a+=d.pointer.chartPosition.top-m.y);this.move(Math.round(m.x),Math.round(m.y||0),p,a)},getDateFormat:function(a,d,c,m){var g=this.chart.time,b=g.dateFormat("%m-%d %H:%M:%S.%L",d),l,f,x={millisecond:15,second:12,minute:9,hour:6,day:3},t="millisecond";for(f in w){if(a===w.week&&+g.dateFormat("%w",d)===c&&"00:00:00.000"===
b.substr(6)){f="week";break}if(w[f]>a){f=t;break}if(x[f]&&b.substr(x[f])!=="01-01 00:00:00.000".substr(x[f]))break;"week"!==f&&(t=f)}f&&(l=g.resolveDTLFormat(m[f]).main);return l},getXDateFormat:function(a,d,c){d=d.dateTimeLabelFormats;var g=c&&c.closestPointRange;return(g?this.getDateFormat(g,a.x,c.options.startOfWeek,d):d.day)||d.year},tooltipFooterHeaderFormatter:function(a,d){d=d?"footer":"header";var c=a.series,g=c.tooltipOptions,p=g.xDateFormat,b=c.xAxis,l=b&&"datetime"===b.options.type&&h(a.key),
f=g[d+"Format"];l&&!p&&(p=this.getXDateFormat(a,g,b));l&&p&&(a.point&&a.point.tooltipDateKeys||["key"]).forEach(function(a){f=f.replace("{point."+a+"}","{point."+a+":"+p+"}")});c.chart.styledMode&&(f=this.styledModeFormat(f));return E(f,{point:a,series:c},this.chart.time)},bodyFormatter:function(a){return a.map(function(a){var c=a.series.tooltipOptions;return(c[(a.point.formatPrefix||"point")+"Formatter"]||a.point.tooltipFormatter).call(a.point,c[(a.point.formatPrefix||"point")+"Format"]||"")})},
styledModeFormat:function(a){return a.replace('style\x3d"font-size: 10px"','class\x3d"highcharts-header"').replace(/style="color:{(point|series)\.color}"/g,'class\x3d"highcharts-color-{$1.colorIndex}"')}}})(J);(function(a){var y=a.addEvent,G=a.attr,E=a.charts,h=a.color,d=a.css,r=a.defined,u=a.extend,v=a.find,w=a.fireEvent,n=a.isNumber,g=a.isObject,c=a.offset,m=a.pick,p=a.splat,b=a.Tooltip;a.Pointer=function(a,b){this.init(a,b)};a.Pointer.prototype={init:function(a,f){this.options=f;this.chart=a;this.runChartClick=
f.chart.events&&!!f.chart.events.click;this.pinchDown=[];this.lastValidTouch={};b&&(a.tooltip=new b(a,f.tooltip),this.followTouchMove=m(f.tooltip.followTouchMove,!0));this.setDOMEvents()},zoomOption:function(a){var b=this.chart,c=b.options.chart,l=c.zoomType||"",b=b.inverted;/touch/.test(a.type)&&(l=m(c.pinchType,l));this.zoomX=a=/x/.test(l);this.zoomY=l=/y/.test(l);this.zoomHor=a&&!b||l&&b;this.zoomVert=l&&!b||a&&b;this.hasZoom=a||l},normalize:function(a,b){var f;f=a.touches?a.touches.length?a.touches.item(0):
a.changedTouches[0]:a;b||(this.chartPosition=b=c(this.chart.container));return u(a,{chartX:Math.round(f.pageX-b.left),chartY:Math.round(f.pageY-b.top)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};this.chart.axes.forEach(function(f){b[f.isXAxis?"xAxis":"yAxis"].push({axis:f,value:f.toValue(a[f.horiz?"chartX":"chartY"])})});return b},findNearestKDPoint:function(a,b,c){var f;a.forEach(function(a){var l=!(a.noSharedTooltip&&b)&&0>a.options.findNearestPointBy.indexOf("y");a=a.searchPoint(c,
l);if((l=g(a,!0))&&!(l=!g(f,!0)))var l=f.distX-a.distX,d=f.dist-a.dist,k=(a.series.group&&a.series.group.zIndex)-(f.series.group&&f.series.group.zIndex),l=0<(0!==l&&b?l:0!==d?d:0!==k?k:f.series.index>a.series.index?-1:1);l&&(f=a)});return f},getPointFromEvent:function(a){a=a.target;for(var b;a&&!b;)b=a.point,a=a.parentNode;return b},getChartCoordinatesFromPoint:function(a,b){var f=a.series,c=f.xAxis,f=f.yAxis,l=m(a.clientX,a.plotX),d=a.shapeArgs;if(c&&f)return b?{chartX:c.len+c.pos-l,chartY:f.len+
f.pos-a.plotY}:{chartX:l+c.pos,chartY:a.plotY+f.pos};if(d&&d.x&&d.y)return{chartX:d.x,chartY:d.y}},getHoverData:function(a,b,c,d,p,h,n){var f,l=[],t=n&&n.isBoosting;d=!(!d||!a);n=b&&!b.stickyTracking?[b]:c.filter(function(a){return a.visible&&!(!p&&a.directTouch)&&m(a.options.enableMouseTracking,!0)&&a.stickyTracking});b=(f=d?a:this.findNearestKDPoint(n,p,h))&&f.series;f&&(p&&!b.noSharedTooltip?(n=c.filter(function(a){return a.visible&&!(!p&&a.directTouch)&&m(a.options.enableMouseTracking,!0)&&!a.noSharedTooltip}),
n.forEach(function(a){var b=v(a.points,function(a){return a.x===f.x&&!a.isNull});g(b)&&(t&&(b=a.getPoint(b)),l.push(b))})):l.push(f));return{hoverPoint:f,hoverSeries:b,hoverPoints:l}},runPointActions:function(b,f){var c=this.chart,d=c.tooltip&&c.tooltip.options.enabled?c.tooltip:void 0,l=d?d.shared:!1,g=f||c.hoverPoint,p=g&&g.series||c.hoverSeries,p=this.getHoverData(g,p,c.series,"touchmove"!==b.type&&(!!f||p&&p.directTouch&&this.isDirectTouch),l,b,{isBoosting:c.isBoosting}),k,g=p.hoverPoint;k=p.hoverPoints;
f=(p=p.hoverSeries)&&p.tooltipOptions.followPointer;l=l&&p&&!p.noSharedTooltip;if(g&&(g!==c.hoverPoint||d&&d.isHidden)){(c.hoverPoints||[]).forEach(function(a){-1===k.indexOf(a)&&a.setState()});(k||[]).forEach(function(a){a.setState("hover")});if(c.hoverSeries!==p)p.onMouseOver();c.hoverPoint&&c.hoverPoint.firePointEvent("mouseOut");if(!g.series)return;g.firePointEvent("mouseOver");c.hoverPoints=k;c.hoverPoint=g;d&&d.refresh(l?k:g,b)}else f&&d&&!d.isHidden&&(g=d.getAnchor([{}],b),d.updatePosition({plotX:g[0],
plotY:g[1]}));this.unDocMouseMove||(this.unDocMouseMove=y(c.container.ownerDocument,"mousemove",function(b){var f=E[a.hoverChartIndex];if(f)f.pointer.onDocumentMouseMove(b)}));c.axes.forEach(function(f){var c=m(f.crosshair.snap,!0),d=c?a.find(k,function(a){return a.series[f.coll]===f}):void 0;d||!c?f.drawCrosshair(b,d):f.hideCrosshair()})},reset:function(a,b){var f=this.chart,c=f.hoverSeries,d=f.hoverPoint,l=f.hoverPoints,g=f.tooltip,k=g&&g.shared?l:d;a&&k&&p(k).forEach(function(b){b.series.isCartesian&&
void 0===b.plotX&&(a=!1)});if(a)g&&k&&(g.refresh(k),g.shared&&l?l.forEach(function(a){a.setState(a.state,!0);a.series.isCartesian&&(a.series.xAxis.crosshair&&a.series.xAxis.drawCrosshair(null,a),a.series.yAxis.crosshair&&a.series.yAxis.drawCrosshair(null,a))}):d&&(d.setState(d.state,!0),f.axes.forEach(function(a){a.crosshair&&a.drawCrosshair(null,d)})));else{if(d)d.onMouseOut();l&&l.forEach(function(a){a.setState()});if(c)c.onMouseOut();g&&g.hide(b);this.unDocMouseMove&&(this.unDocMouseMove=this.unDocMouseMove());
f.axes.forEach(function(a){a.hideCrosshair()});this.hoverX=f.hoverPoints=f.hoverPoint=null}},scaleGroups:function(a,b){var f=this.chart,c;f.series.forEach(function(d){c=a||d.getPlotBox();d.xAxis&&d.xAxis.zoomEnabled&&d.group&&(d.group.attr(c),d.markerGroup&&(d.markerGroup.attr(c),d.markerGroup.clip(b?f.clipRect:null)),d.dataLabelsGroup&&d.dataLabelsGroup.attr(c))});f.clipRect.attr(b||f.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=
a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,c=b.options.chart,d=a.chartX,l=a.chartY,g=this.zoomHor,p=this.zoomVert,k=b.plotLeft,m=b.plotTop,D=b.plotWidth,C=b.plotHeight,e,q=this.selectionMarker,n=this.mouseDownX,r=this.mouseDownY,u=c.panKey&&a[c.panKey+"Key"];q&&q.touch||(d<k?d=k:d>k+D&&(d=k+D),l<m?l=m:l>m+C&&(l=m+C),this.hasDragged=Math.sqrt(Math.pow(n-d,2)+Math.pow(r-l,2)),10<this.hasDragged&&(e=b.isInsidePlot(n-k,r-m),b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&
e&&!u&&!q&&(this.selectionMarker=q=b.renderer.rect(k,m,g?1:D,p?1:C,0).attr({"class":"highcharts-selection-marker",zIndex:7}).add(),b.styledMode||q.attr({fill:c.selectionMarkerFill||h("#335cad").setOpacity(.25).get()})),q&&g&&(d-=n,q.attr({width:Math.abs(d),x:(0<d?0:d)+n})),q&&p&&(d=l-r,q.attr({height:Math.abs(d),y:(0<d?0:d)+r})),e&&!q&&c.panning&&b.pan(a,c.panning)))},drop:function(a){var b=this,c=this.chart,l=this.hasPinched;if(this.selectionMarker){var g={originalEvent:a,xAxis:[],yAxis:[]},p=this.selectionMarker,
m=p.attr?p.attr("x"):p.x,k=p.attr?p.attr("y"):p.y,A=p.attr?p.attr("width"):p.width,D=p.attr?p.attr("height"):p.height,h;if(this.hasDragged||l)c.axes.forEach(function(e){if(e.zoomEnabled&&r(e.min)&&(l||b[{xAxis:"zoomX",yAxis:"zoomY"}[e.coll]])){var f=e.horiz,c="touchend"===a.type?e.minPixelPadding:0,d=e.toValue((f?m:k)+c),f=e.toValue((f?m+A:k+D)-c);g[e.coll].push({axis:e,min:Math.min(d,f),max:Math.max(d,f)});h=!0}}),h&&w(c,"selection",g,function(a){c.zoom(u(a,l?{animation:!1}:null))});n(c.index)&&
(this.selectionMarker=this.selectionMarker.destroy());l&&this.scaleGroups()}c&&n(c.index)&&(d(c.container,{cursor:c._cursor}),c.cancelClick=10<this.hasDragged,c.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[])},onContainerMouseDown:function(a){a=this.normalize(a);2!==a.button&&(this.zoomOption(a),a.preventDefault&&a.preventDefault(),this.dragStart(a))},onDocumentMouseUp:function(b){E[a.hoverChartIndex]&&E[a.hoverChartIndex].pointer.drop(b)},onDocumentMouseMove:function(a){var b=this.chart,
c=this.chartPosition;a=this.normalize(a,c);!c||this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)||this.reset()},onContainerMouseLeave:function(b){var f=E[a.hoverChartIndex];f&&(b.relatedTarget||b.toElement)&&(f.pointer.reset(),f.pointer.chartPosition=null)},onContainerMouseMove:function(b){var f=this.chart;r(a.hoverChartIndex)&&E[a.hoverChartIndex]&&E[a.hoverChartIndex].mouseIsDown||(a.hoverChartIndex=f.index);b=this.normalize(b);b.returnValue=!1;
"mousedown"===f.mouseIsDown&&this.drag(b);!this.inClass(b.target,"highcharts-tracker")&&!f.isInsidePlot(b.chartX-f.plotLeft,b.chartY-f.plotTop)||f.openMenu||this.runPointActions(b)},inClass:function(a,b){for(var f;a;){if(f=G(a,"class")){if(-1!==f.indexOf(b))return!0;if(-1!==f.indexOf("highcharts-container"))return!1}a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries;a=a.relatedTarget||a.toElement;this.isDirectTouch=!1;if(!(!b||!a||b.stickyTracking||this.inClass(a,"highcharts-tooltip")||
this.inClass(a,"highcharts-series-"+b.index)&&this.inClass(a,"highcharts-tracker")))b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,l=b.plotTop;a=this.normalize(a);b.cancelClick||(c&&this.inClass(a.target,"highcharts-tracker")?(w(c.series,"click",u(a,{point:c})),b.hoverPoint&&c.firePointEvent("click",a)):(u(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-d,a.chartY-l)&&w(b,"click",a)))},setDOMEvents:function(){var b=this,f=b.chart.container,c=f.ownerDocument;
f.onmousedown=function(a){b.onContainerMouseDown(a)};f.onmousemove=function(a){b.onContainerMouseMove(a)};f.onclick=function(a){b.onContainerClick(a)};this.unbindContainerMouseLeave=y(f,"mouseleave",b.onContainerMouseLeave);a.unbindDocumentMouseUp||(a.unbindDocumentMouseUp=y(c,"mouseup",b.onDocumentMouseUp));a.hasTouch&&(f.ontouchstart=function(a){b.onContainerTouchStart(a)},f.ontouchmove=function(a){b.onContainerTouchMove(a)},a.unbindDocumentTouchEnd||(a.unbindDocumentTouchEnd=y(c,"touchend",b.onDocumentTouchEnd)))},
destroy:function(){var b=this;b.unDocMouseMove&&b.unDocMouseMove();this.unbindContainerMouseLeave();a.chartCount||(a.unbindDocumentMouseUp&&(a.unbindDocumentMouseUp=a.unbindDocumentMouseUp()),a.unbindDocumentTouchEnd&&(a.unbindDocumentTouchEnd=a.unbindDocumentTouchEnd()));clearInterval(b.tooltipTimeout);a.objectEach(b,function(a,c){b[c]=null})}}})(J);(function(a){var y=a.charts,G=a.extend,E=a.noop,h=a.pick;G(a.Pointer.prototype,{pinchTranslate:function(a,h,u,v,w,n){this.zoomHor&&this.pinchTranslateDirection(!0,
a,h,u,v,w,n);this.zoomVert&&this.pinchTranslateDirection(!1,a,h,u,v,w,n)},pinchTranslateDirection:function(a,h,u,v,w,n,g,c){var d=this.chart,p=a?"x":"y",b=a?"X":"Y",l="chart"+b,f=a?"width":"height",x=d["plot"+(a?"Left":"Top")],t,r,F=c||1,z=d.inverted,k=d.bounds[a?"h":"v"],A=1===h.length,D=h[0][l],C=u[0][l],e=!A&&h[1][l],q=!A&&u[1][l],L;u=function(){!A&&20<Math.abs(D-e)&&(F=c||Math.abs(C-q)/Math.abs(D-e));r=(x-C)/F+D;t=d["plot"+(a?"Width":"Height")]/F};u();h=r;h<k.min?(h=k.min,L=!0):h+t>k.max&&(h=
k.max-t,L=!0);L?(C-=.8*(C-g[p][0]),A||(q-=.8*(q-g[p][1])),u()):g[p]=[C,q];z||(n[p]=r-x,n[f]=t);n=z?1/F:F;w[f]=t;w[p]=h;v[z?a?"scaleY":"scaleX":"scale"+b]=F;v["translate"+b]=n*x+(C-n*D)},pinch:function(a){var d=this,u=d.chart,v=d.pinchDown,w=a.touches,n=w.length,g=d.lastValidTouch,c=d.hasZoom,m=d.selectionMarker,p={},b=1===n&&(d.inClass(a.target,"highcharts-tracker")&&u.runTrackerClick||d.runChartClick),l={};1<n&&(d.initiated=!0);c&&d.initiated&&!b&&a.preventDefault();[].map.call(w,function(a){return d.normalize(a)});
"touchstart"===a.type?([].forEach.call(w,function(a,b){v[b]={chartX:a.chartX,chartY:a.chartY}}),g.x=[v[0].chartX,v[1]&&v[1].chartX],g.y=[v[0].chartY,v[1]&&v[1].chartY],u.axes.forEach(function(a){if(a.zoomEnabled){var b=u.bounds[a.horiz?"h":"v"],f=a.minPixelPadding,c=a.toPixels(h(a.options.min,a.dataMin)),d=a.toPixels(h(a.options.max,a.dataMax)),l=Math.max(c,d);b.min=Math.min(a.pos,Math.min(c,d)-f);b.max=Math.max(a.pos+a.len,l+f)}}),d.res=!0):d.followTouchMove&&1===n?this.runPointActions(d.normalize(a)):
v.length&&(m||(d.selectionMarker=m=G({destroy:E,touch:!0},u.plotBox)),d.pinchTranslate(v,w,p,m,l,g),d.hasPinched=c,d.scaleGroups(p,l),d.res&&(d.res=!1,this.reset(!1,0)))},touch:function(d,r){var u=this.chart,v,w;if(u.index!==a.hoverChartIndex)this.onContainerMouseLeave({relatedTarget:!0});a.hoverChartIndex=u.index;1===d.touches.length?(d=this.normalize(d),(w=u.isInsidePlot(d.chartX-u.plotLeft,d.chartY-u.plotTop))&&!u.openMenu?(r&&this.runPointActions(d),"touchmove"===d.type&&(r=this.pinchDown,v=r[0]?
4<=Math.sqrt(Math.pow(r[0].chartX-d.chartX,2)+Math.pow(r[0].chartY-d.chartY,2)):!1),h(v,!0)&&this.pinch(d)):r&&this.reset()):2===d.touches.length&&this.pinch(d)},onContainerTouchStart:function(a){this.zoomOption(a);this.touch(a,!0)},onContainerTouchMove:function(a){this.touch(a)},onDocumentTouchEnd:function(d){y[a.hoverChartIndex]&&y[a.hoverChartIndex].pointer.drop(d)}})})(J);(function(a){var y=a.addEvent,G=a.charts,E=a.css,h=a.doc,d=a.extend,r=a.noop,u=a.Pointer,v=a.removeEvent,w=a.win,n=a.wrap;
if(!a.hasTouch&&(w.PointerEvent||w.MSPointerEvent)){var g={},c=!!w.PointerEvent,m=function(){var b=[];b.item=function(a){return this[a]};a.objectEach(g,function(a){b.push({pageX:a.pageX,pageY:a.pageY,target:a.target})});return b},p=function(b,c,f,d){"touch"!==b.pointerType&&b.pointerType!==b.MSPOINTER_TYPE_TOUCH||!G[a.hoverChartIndex]||(d(b),d=G[a.hoverChartIndex].pointer,d[c]({type:f,target:b.currentTarget,preventDefault:r,touches:m()}))};d(u.prototype,{onContainerPointerDown:function(a){p(a,"onContainerTouchStart",
"touchstart",function(a){g[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){p(a,"onContainerTouchMove","touchmove",function(a){g[a.pointerId]={pageX:a.pageX,pageY:a.pageY};g[a.pointerId].target||(g[a.pointerId].target=a.currentTarget)})},onDocumentPointerUp:function(a){p(a,"onDocumentTouchEnd","touchend",function(a){delete g[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,c?"pointerdown":"MSPointerDown",this.onContainerPointerDown);
a(this.chart.container,c?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(h,c?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});n(u.prototype,"init",function(a,c,f){a.call(this,c,f);this.hasZoom&&E(c.container,{"-ms-touch-action":"none","touch-action":"none"})});n(u.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(y)});n(u.prototype,"destroy",function(a){this.batchMSEvents(v);a.call(this)})}})(J);(function(a){var y=a.addEvent,
G=a.css,E=a.discardElement,h=a.defined,d=a.fireEvent,r=a.isFirefox,u=a.marginNames,v=a.merge,w=a.pick,n=a.setAnimation,g=a.stableSort,c=a.win,m=a.wrap;a.Legend=function(a,b){this.init(a,b)};a.Legend.prototype={init:function(a,b){this.chart=a;this.setOptions(b);b.enabled&&(this.render(),y(this.chart,"endResize",function(){this.legend.positionCheckboxes()}),this.proximate?this.unchartrender=y(this.chart,"render",function(){this.legend.proximatePositions();this.legend.positionItems()}):this.unchartrender&&
this.unchartrender())},setOptions:function(a){var b=w(a.padding,8);this.options=a;this.chart.styledMode||(this.itemStyle=a.itemStyle,this.itemHiddenStyle=v(this.itemStyle,a.itemHiddenStyle));this.itemMarginTop=a.itemMarginTop||0;this.padding=b;this.initialItemY=b-5;this.symbolWidth=w(a.symbolWidth,16);this.pages=[];this.proximate="proximate"===a.layout&&!this.chart.inverted},update:function(a,b){var c=this.chart;this.setOptions(v(!0,this.options,a));this.destroy();c.isDirtyLegend=c.isDirtyBox=!0;
w(b,!0)&&c.redraw();d(this,"afterUpdate")},colorizeItem:function(a,b){a.legendGroup[b?"removeClass":"addClass"]("highcharts-legend-item-hidden");if(!this.chart.styledMode){var c=this.options,f=a.legendItem,g=a.legendLine,p=a.legendSymbol,m=this.itemHiddenStyle.color,c=b?c.itemStyle.color:m,h=b?a.color||m:m,n=a.options&&a.options.marker,k={fill:h};f&&f.css({fill:c,color:c});g&&g.attr({stroke:h});p&&(n&&p.isMarker&&(k=a.pointAttribs(),b||(k.stroke=k.fill=m)),p.attr(k))}d(this,"afterColorizeItem",{item:a,
visible:b})},positionItems:function(){this.allItems.forEach(this.positionItem,this);this.chart.isResizing||this.positionCheckboxes()},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,f=a._legendItemPos,d=f[0],f=f[1],g=a.checkbox;if((a=a.legendGroup)&&a.element)a[h(a.translateY)?"animate":"attr"]({translateX:b?d:this.legendWidth-d-2*c-4,translateY:f});g&&(g.x=d,g.y=f)},destroyItem:function(a){var b=a.checkbox;["legendItem","legendLine","legendSymbol","legendGroup"].forEach(function(b){a[b]&&
(a[b]=a[b].destroy())});b&&E(a.checkbox)},destroy:function(){function a(a){this[a]&&(this[a]=this[a].destroy())}this.getAllItems().forEach(function(b){["legendItem","legendGroup"].forEach(a,b)});"clipRect up down pager nav box title group".split(" ").forEach(a,this);this.display=null},positionCheckboxes:function(){var a=this.group&&this.group.alignAttr,b,c=this.clipHeight||this.legendHeight,f=this.titleHeight;a&&(b=a.translateY,this.allItems.forEach(function(d){var g=d.checkbox,l;g&&(l=b+f+g.y+(this.scrollOffset||
0)+3,G(g,{left:a.translateX+d.checkboxOffset+g.x-20+"px",top:l+"px",display:this.proximate||l>b-6&&l<b+c-6?"":"none"}))},this))},renderTitle:function(){var a=this.options,b=this.padding,c=a.title,f=0;c.text&&(this.title||(this.title=this.chart.renderer.label(c.text,b-3,b-4,null,null,null,a.useHTML,null,"legend-title").attr({zIndex:1}),this.chart.styledMode||this.title.css(c.style),this.title.add(this.group)),a=this.title.getBBox(),f=a.height,this.offsetWidth=a.width,this.contentGroup.attr({translateY:f}));
this.titleHeight=f},setText:function(c){var b=this.options;c.legendItem.attr({text:b.labelFormat?a.format(b.labelFormat,c,this.chart.time):b.labelFormatter.call(c)})},renderItem:function(a){var b=this.chart,c=b.renderer,f=this.options,d=this.symbolWidth,g=f.symbolPadding,p=this.itemStyle,m=this.itemHiddenStyle,h="horizontal"===f.layout?w(f.itemDistance,20):0,k=!f.rtl,A=a.legendItem,D=!a.series,n=!D&&a.series.drawLegendSymbol?a.series:a,e=n.options,e=this.createCheckboxForItem&&e&&e.showCheckbox,h=
d+g+h+(e?20:0),q=f.useHTML,r=a.options.className;A||(a.legendGroup=c.g("legend-item").addClass("highcharts-"+n.type+"-series highcharts-color-"+a.colorIndex+(r?" "+r:"")+(D?" highcharts-series-"+a.index:"")).attr({zIndex:1}).add(this.scrollGroup),a.legendItem=A=c.text("",k?d+g:-g,this.baseline||0,q),b.styledMode||A.css(v(a.visible?p:m)),A.attr({align:k?"left":"right",zIndex:2}).add(a.legendGroup),this.baseline||(this.fontMetrics=c.fontMetrics(b.styledMode?12:p.fontSize,A),this.baseline=this.fontMetrics.f+
3+this.itemMarginTop,A.attr("y",this.baseline)),this.symbolHeight=f.symbolHeight||this.fontMetrics.f,n.drawLegendSymbol(this,a),this.setItemEvents&&this.setItemEvents(a,A,q),e&&this.createCheckboxForItem(a));this.colorizeItem(a,a.visible);!b.styledMode&&p.width||A.css({width:(f.itemWidth||f.width||b.spacingBox.width)-h});this.setText(a);b=A.getBBox();a.itemWidth=a.checkboxOffset=f.itemWidth||a.legendItemWidth||b.width+h;this.maxItemWidth=Math.max(this.maxItemWidth,a.itemWidth);this.totalItemWidth+=
a.itemWidth;this.itemHeight=a.itemHeight=Math.round(a.legendItemHeight||b.height||this.symbolHeight)},layoutItem:function(a){var b=this.options,c=this.padding,f="horizontal"===b.layout,d=a.itemHeight,g=b.itemMarginBottom||0,p=this.itemMarginTop,m=f?w(b.itemDistance,20):0,h=b.width,k=h||this.chart.spacingBox.width-2*c-b.x,b=b.alignColumns&&this.totalItemWidth>k?this.maxItemWidth:a.itemWidth;f&&this.itemX-c+b>k&&(this.itemX=c,this.itemY+=p+this.lastLineHeight+g,this.lastLineHeight=0);this.lastItemY=
p+this.itemY+g;this.lastLineHeight=Math.max(d,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];f?this.itemX+=b:(this.itemY+=p+d+g,this.lastLineHeight=d);this.offsetWidth=h||Math.max((f?this.itemX-c-(a.checkbox?0:m):b)+c,this.offsetWidth)},getAllItems:function(){var a=[];this.chart.series.forEach(function(b){var c=b&&b.options;b&&w(c.showInLegend,h(c.linkedTo)?!1:void 0,!0)&&(a=a.concat(b.legendItems||("point"===c.legendType?b.data:b)))});d(this,"afterGetAllItems",{allItems:a});return a},
getAlignment:function(){var a=this.options;return this.proximate?a.align.charAt(0)+"tv":a.floating?"":a.align.charAt(0)+a.verticalAlign.charAt(0)+a.layout.charAt(0)},adjustMargins:function(a,b){var c=this.chart,f=this.options,d=this.getAlignment();d&&[/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/].forEach(function(g,l){g.test(d)&&!h(a[l])&&(c[u[l]]=Math.max(c[u[l]],c.legend[(l+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][l]*f[l%2?"x":"y"]+w(f.margin,12)+b[l]+(0===l&&void 0!==c.options.title.margin?
c.titleOffset+c.options.title.margin:0)))})},proximatePositions:function(){var c=this.chart,b=[],d="left"===this.options.align;this.allItems.forEach(function(f){var g,l;g=d;f.xAxis&&f.points&&(f.xAxis.options.reversed&&(g=!g),g=a.find(g?f.points:f.points.slice(0).reverse(),function(b){return a.isNumber(b.plotY)}),l=f.legendGroup.getBBox().height,b.push({target:f.visible?(g?g.plotY:f.xAxis.height)-.3*l:c.plotHeight,size:l,item:f}))},this);a.distribute(b,c.plotHeight);b.forEach(function(a){a.item._legendItemPos[1]=
c.plotTop-c.spacing[0]+a.pos})},render:function(){var a=this.chart,b=a.renderer,c=this.group,f,d,m,h=this.box,n=this.options,z=this.padding;this.itemX=z;this.itemY=this.initialItemY;this.lastItemY=this.offsetWidth=0;c||(this.group=c=b.g("legend").attr({zIndex:7}).add(),this.contentGroup=b.g().attr({zIndex:1}).add(c),this.scrollGroup=b.g().add(this.contentGroup));this.renderTitle();f=this.getAllItems();g(f,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||
0)});n.reversed&&f.reverse();this.allItems=f;this.display=d=!!f.length;this.itemHeight=this.totalItemWidth=this.maxItemWidth=this.lastLineHeight=0;f.forEach(this.renderItem,this);f.forEach(this.layoutItem,this);f=(n.width||this.offsetWidth)+z;m=this.lastItemY+this.lastLineHeight+this.titleHeight;m=this.handleOverflow(m);m+=z;h||(this.box=h=b.rect().addClass("highcharts-legend-box").attr({r:n.borderRadius}).add(c),h.isNew=!0);a.styledMode||h.attr({stroke:n.borderColor,"stroke-width":n.borderWidth||
0,fill:n.backgroundColor||"none"}).shadow(n.shadow);0<f&&0<m&&(h[h.isNew?"attr":"animate"](h.crisp.call({},{x:0,y:0,width:f,height:m},h.strokeWidth())),h.isNew=!1);h[d?"show":"hide"]();a.styledMode&&"none"===c.getStyle("display")&&(f=m=0);this.legendWidth=f;this.legendHeight=m;d&&(b=a.spacingBox,/(lth|ct|rth)/.test(this.getAlignment())&&(b=v(b,{y:b.y+a.titleOffset+a.options.title.margin})),c.align(v(n,{width:f,height:m,verticalAlign:this.proximate?"top":n.verticalAlign}),!0,b));this.proximate||this.positionItems()},
handleOverflow:function(a){var b=this,c=this.chart,f=c.renderer,d=this.options,g=d.y,m=this.padding,g=c.spacingBox.height+("top"===d.verticalAlign?-g:g)-m,p=d.maxHeight,h,k=this.clipRect,A=d.navigation,D=w(A.animation,!0),n=A.arrowSize||12,e=this.nav,q=this.pages,r,u=this.allItems,v=function(a){"number"===typeof a?k.attr({height:a}):k&&(b.clipRect=k.destroy(),b.contentGroup.clip());b.contentGroup.div&&(b.contentGroup.div.style.clip=a?"rect("+m+"px,9999px,"+(m+a)+"px,0)":"auto")};"horizontal"!==d.layout||
"middle"===d.verticalAlign||d.floating||(g/=2);p&&(g=Math.min(g,p));q.length=0;a>g&&!1!==A.enabled?(this.clipHeight=h=Math.max(g-20-this.titleHeight-m,0),this.currentPage=w(this.currentPage,1),this.fullHeight=a,u.forEach(function(a,b){var e=a._legendItemPos[1],c=Math.round(a.legendItem.getBBox().height),f=q.length;if(!f||e-q[f-1]>h&&(r||e)!==q[f-1])q.push(r||e),f++;a.pageIx=f-1;r&&(u[b-1].pageIx=f-1);b===u.length-1&&e+c-q[f-1]>h&&e!==r&&(q.push(e),a.pageIx=f);e!==r&&(r=e)}),k||(k=b.clipRect=f.clipRect(0,
m,9999,0),b.contentGroup.clip(k)),v(h),e||(this.nav=e=f.g().attr({zIndex:1}).add(this.group),this.up=f.symbol("triangle",0,0,n,n).on("click",function(){b.scroll(-1,D)}).add(e),this.pager=f.text("",15,10).addClass("highcharts-legend-navigation"),c.styledMode||this.pager.css(A.style),this.pager.add(e),this.down=f.symbol("triangle-down",0,0,n,n).on("click",function(){b.scroll(1,D)}).add(e)),b.scroll(0),a=g):e&&(v(),this.nav=e.destroy(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0);return a},
scroll:function(a,b){var c=this.pages,f=c.length;a=this.currentPage+a;var d=this.clipHeight,g=this.options.navigation,m=this.pager,p=this.padding;a>f&&(a=f);0<a&&(void 0!==b&&n(b,this.chart),this.nav.attr({translateX:p,translateY:d+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({"class":1===a?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"}),m.attr({text:a+"/"+f}),this.down.attr({x:18+this.pager.getBBox().width,"class":a===f?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"}),
this.chart.styledMode||(this.up.attr({fill:1===a?g.inactiveColor:g.activeColor}).css({cursor:1===a?"default":"pointer"}),this.down.attr({fill:a===f?g.inactiveColor:g.activeColor}).css({cursor:a===f?"default":"pointer"})),this.scrollOffset=-c[a-1]+this.initialItemY,this.scrollGroup.animate({translateY:this.scrollOffset}),this.currentPage=a,this.positionCheckboxes())}};a.LegendSymbolMixin={drawRectangle:function(a,b){var c=a.symbolHeight,f=a.options.squareSymbol;b.legendSymbol=this.chart.renderer.rect(f?
(a.symbolWidth-c)/2:0,a.baseline-c+1,f?c:a.symbolWidth,c,w(a.options.symbolRadius,c/2)).addClass("highcharts-point").attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=this.options,c=b.marker,f=a.symbolWidth,d=a.symbolHeight,g=d/2,m=this.chart.renderer,p=this.legendGroup;a=a.baseline-Math.round(.3*a.fontMetrics.b);var h={};this.chart.styledMode||(h={"stroke-width":b.lineWidth||0},b.dashStyle&&(h.dashstyle=b.dashStyle));this.legendLine=m.path(["M",0,a,"L",f,a]).addClass("highcharts-graph").attr(h).add(p);
c&&!1!==c.enabled&&f&&(b=Math.min(w(c.radius,g),g),0===this.symbol.indexOf("url")&&(c=v(c,{width:d,height:d}),b=0),this.legendSymbol=c=m.symbol(this.symbol,f/2-b,a-b,2*b,2*b,c).addClass("highcharts-point").add(p),c.isMarker=!0)}};(/Trident\/7\.0/.test(c.navigator.userAgent)||r)&&m(a.Legend.prototype,"positionItem",function(a,b){var c=this,f=function(){b._legendItemPos&&a.call(c,b)};f();c.bubbleLegend||setTimeout(f)})})(J);(function(a){var y=a.addEvent,G=a.animate,E=a.animObject,h=a.attr,d=a.doc,r=
a.Axis,u=a.createElement,v=a.defaultOptions,w=a.discardElement,n=a.charts,g=a.css,c=a.defined,m=a.extend,p=a.find,b=a.fireEvent,l=a.isNumber,f=a.isObject,x=a.isString,t=a.Legend,H=a.marginNames,F=a.merge,z=a.objectEach,k=a.Pointer,A=a.pick,D=a.pInt,C=a.removeEvent,e=a.seriesTypes,q=a.splat,L=a.syncTimeout,I=a.win,R=a.Chart=function(){this.getArgs.apply(this,arguments)};a.chart=function(a,b,e){return new R(a,b,e)};m(R.prototype,{callbacks:[],getArgs:function(){var a=[].slice.call(arguments);if(x(a[0])||
a[0].nodeName)this.renderTo=a.shift();this.init(a[0],a[1])},init:function(e,c){var f,k,d=e.series,g=e.plotOptions||{};b(this,"init",{args:arguments},function(){e.series=null;f=F(v,e);for(k in f.plotOptions)f.plotOptions[k].tooltip=g[k]&&F(g[k].tooltip)||void 0;f.tooltip.userOptions=e.chart&&e.chart.forExport&&e.tooltip.userOptions||e.tooltip;f.series=e.series=d;this.userOptions=e;var q=f.chart,l=q.events;this.margin=[];this.spacing=[];this.bounds={h:{},v:{}};this.labelCollectors=[];this.callback=
c;this.isResizing=0;this.options=f;this.axes=[];this.series=[];this.time=e.time&&Object.keys(e.time).length?new a.Time(e.time):a.time;this.styledMode=q.styledMode;this.hasCartesianSeries=q.showAxes;var m=this;m.index=n.length;n.push(m);a.chartCount++;l&&z(l,function(a,b){y(m,b,a)});m.xAxis=[];m.yAxis=[];m.pointCount=m.colorCounter=m.symbolCounter=0;b(m,"afterInit");m.firstRender()})},initSeries:function(b){var c=this.options.chart;(c=e[b.type||c.type||c.defaultSeriesType])||a.error(17,!0,this);c=
new c;c.init(this,b);return c},orderSeries:function(a){var b=this.series;for(a=a||0;a<b.length;a++)b[a]&&(b[a].index=a,b[a].name=b[a].getName())},isInsidePlot:function(a,b,e){var c=e?b:a;a=e?a:b;return 0<=c&&c<=this.plotWidth&&0<=a&&a<=this.plotHeight},redraw:function(e){b(this,"beforeRedraw");var c=this.axes,f=this.series,k=this.pointer,d=this.legend,g=this.userOptions.legend,q=this.isDirtyLegend,l,p,A=this.hasCartesianSeries,h=this.isDirtyBox,D,t=this.renderer,n=t.isHidden(),C=[];this.setResponsive&&
this.setResponsive(!1);a.setAnimation(e,this);n&&this.temporaryDisplay();this.layOutTitles();for(e=f.length;e--;)if(D=f[e],D.options.stacking&&(l=!0,D.isDirty)){p=!0;break}if(p)for(e=f.length;e--;)D=f[e],D.options.stacking&&(D.isDirty=!0);f.forEach(function(a){a.isDirty&&("point"===a.options.legendType?(a.updateTotals&&a.updateTotals(),q=!0):g&&(g.labelFormatter||g.labelFormat)&&(q=!0));a.isDirtyData&&b(a,"updatedData")});q&&d&&d.options.enabled&&(d.render(),this.isDirtyLegend=!1);l&&this.getStacks();
A&&c.forEach(function(a){a.updateNames();a.updateYNames&&a.updateYNames();a.setScale()});this.getMargins();A&&(c.forEach(function(a){a.isDirty&&(h=!0)}),c.forEach(function(a){var e=a.min+","+a.max;a.extKey!==e&&(a.extKey=e,C.push(function(){b(a,"afterSetExtremes",m(a.eventArgs,a.getExtremes()));delete a.eventArgs}));(h||l)&&a.redraw()}));h&&this.drawChartBox();b(this,"predraw");f.forEach(function(a){(h||a.isDirty)&&a.visible&&a.redraw();a.isDirtyData=!1});k&&k.reset(!0);t.draw();b(this,"redraw");
b(this,"render");n&&this.temporaryDisplay(!0);C.forEach(function(a){a.call()})},get:function(a){function b(b){return b.id===a||b.options&&b.options.id===a}var e,c=this.series,f;e=p(this.axes,b)||p(this.series,b);for(f=0;!e&&f<c.length;f++)e=p(c[f].points||[],b);return e},getAxes:function(){var a=this,e=this.options,c=e.xAxis=q(e.xAxis||{}),e=e.yAxis=q(e.yAxis||{});b(this,"getAxes");c.forEach(function(a,b){a.index=b;a.isX=!0});e.forEach(function(a,b){a.index=b});c.concat(e).forEach(function(b){new r(a,
b)});b(this,"afterGetAxes")},getSelectedPoints:function(){var a=[];this.series.forEach(function(b){a=a.concat((b.data||[]).filter(function(a){return a.selected}))});return a},getSelectedSeries:function(){return this.series.filter(function(a){return a.selected})},setTitle:function(a,b,e){var c=this,f=c.options,k=c.styledMode,d;d=f.title=F(!k&&{style:{color:"#333333",fontSize:f.isStock?"16px":"18px"}},f.title,a);f=f.subtitle=F(!k&&{style:{color:"#666666"}},f.subtitle,b);[["title",a,d],["subtitle",b,
f]].forEach(function(a,b){var e=a[0],f=c[e],d=a[1];a=a[2];f&&d&&(c[e]=f=f.destroy());a&&!f&&(c[e]=c.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":"highcharts-"+e,zIndex:a.zIndex||4}).add(),c[e].update=function(a){c.setTitle(!b&&a,b&&a)},k||c[e].css(a.style))});c.layOutTitles(e)},layOutTitles:function(a){var b=0,e,c=this.renderer,f=this.spacingBox;["title","subtitle"].forEach(function(a){var e=this[a],k=this.options[a];a="title"===a?-3:k.verticalAlign?0:b+2;var d;e&&(this.styledMode||
(d=k.style.fontSize),d=c.fontMetrics(d,e).b,e.css({width:(k.width||f.width+k.widthAdjust)+"px"}).align(m({y:a+d},k),!1,"spacingBox"),k.floating||k.verticalAlign||(b=Math.ceil(b+e.getBBox(k.useHTML).height)))},this);e=this.titleOffset!==b;this.titleOffset=b;!this.isDirtyBox&&e&&(this.isDirtyBox=this.isDirtyLegend=e,this.hasRendered&&A(a,!0)&&this.isDirtyBox&&this.redraw())},getChartSize:function(){var b=this.options.chart,e=b.width,b=b.height,f=this.renderTo;c(e)||(this.containerWidth=a.getStyle(f,
"width"));c(b)||(this.containerHeight=a.getStyle(f,"height"));this.chartWidth=Math.max(0,e||this.containerWidth||600);this.chartHeight=Math.max(0,a.relativeLength(b,this.chartWidth)||(1<this.containerHeight?this.containerHeight:400))},temporaryDisplay:function(b){var e=this.renderTo;if(b)for(;e&&e.style;)e.hcOrigStyle&&(a.css(e,e.hcOrigStyle),delete e.hcOrigStyle),e.hcOrigDetached&&(d.body.removeChild(e),e.hcOrigDetached=!1),e=e.parentNode;else for(;e&&e.style;){d.body.contains(e)||e.parentNode||
(e.hcOrigDetached=!0,d.body.appendChild(e));if("none"===a.getStyle(e,"display",!1)||e.hcOricDetached)e.hcOrigStyle={display:e.style.display,height:e.style.height,overflow:e.style.overflow},b={display:"block",overflow:"hidden"},e!==this.renderTo&&(b.height=0),a.css(e,b),e.offsetWidth||e.style.setProperty("display","block","important");e=e.parentNode;if(e===d.body)break}},setClassName:function(a){this.container.className="highcharts-container "+(a||"")},getContainer:function(){var e,c=this.options,
f=c.chart,k,q;e=this.renderTo;var p=a.uniqueKey(),A,t;e||(this.renderTo=e=f.renderTo);x(e)&&(this.renderTo=e=d.getElementById(e));e||a.error(13,!0,this);k=D(h(e,"data-highcharts-chart"));l(k)&&n[k]&&n[k].hasRendered&&n[k].destroy();h(e,"data-highcharts-chart",this.index);e.innerHTML="";f.skipClone||e.offsetWidth||this.temporaryDisplay();this.getChartSize();k=this.chartWidth;q=this.chartHeight;g(e,{overflow:"hidden"});this.styledMode||(A=m({position:"relative",overflow:"hidden",width:k+"px",height:q+
"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},f.style));this.container=e=u("div",{id:p},A,e);this._cursor=e.style.cursor;this.renderer=new (a[f.renderer]||a.Renderer)(e,k,q,null,f.forExport,c.exporting&&c.exporting.allowHTML,this.styledMode);this.setClassName(f.className);if(this.styledMode)for(t in c.defs)this.renderer.definition(c.defs[t]);else this.renderer.setStyle(f.style);this.renderer.chartIndex=this.index;b(this,"afterGetContainer")},getMargins:function(a){var e=
this.spacing,f=this.margin,k=this.titleOffset;this.resetMargins();k&&!c(f[0])&&(this.plotTop=Math.max(this.plotTop,k+this.options.title.margin+e[0]));this.legend&&this.legend.display&&this.legend.adjustMargins(f,e);b(this,"getMargins");a||this.getAxisMargins()},getAxisMargins:function(){var a=this,b=a.axisOffset=[0,0,0,0],e=a.margin;a.hasCartesianSeries&&a.axes.forEach(function(a){a.visible&&a.getOffset()});H.forEach(function(f,k){c(e[k])||(a[f]+=b[k])});a.setChartSize()},reflow:function(b){var e=
this,f=e.options.chart,k=e.renderTo,g=c(f.width)&&c(f.height),q=f.width||a.getStyle(k,"width"),f=f.height||a.getStyle(k,"height"),k=b?b.target:I;if(!g&&!e.isPrinting&&q&&f&&(k===I||k===d)){if(q!==e.containerWidth||f!==e.containerHeight)a.clearTimeout(e.reflowTimeout),e.reflowTimeout=L(function(){e.container&&e.setSize(void 0,void 0,!1)},b?100:0);e.containerWidth=q;e.containerHeight=f}},setReflow:function(a){var b=this;!1===a||this.unbindReflow?!1===a&&this.unbindReflow&&(this.unbindReflow=this.unbindReflow()):
(this.unbindReflow=y(I,"resize",function(a){b.reflow(a)}),y(this,"destroy",this.unbindReflow))},setSize:function(e,c,f){var k=this,d=k.renderer,q;k.isResizing+=1;a.setAnimation(f,k);k.oldChartHeight=k.chartHeight;k.oldChartWidth=k.chartWidth;void 0!==e&&(k.options.chart.width=e);void 0!==c&&(k.options.chart.height=c);k.getChartSize();k.styledMode||(q=d.globalAnimation,(q?G:g)(k.container,{width:k.chartWidth+"px",height:k.chartHeight+"px"},q));k.setChartSize(!0);d.setSize(k.chartWidth,k.chartHeight,
f);k.axes.forEach(function(a){a.isDirty=!0;a.setScale()});k.isDirtyLegend=!0;k.isDirtyBox=!0;k.layOutTitles();k.getMargins();k.redraw(f);k.oldChartHeight=null;b(k,"resize");L(function(){k&&b(k,"endResize",null,function(){--k.isResizing})},E(q).duration)},setChartSize:function(a){var e=this.inverted,c=this.renderer,f=this.chartWidth,k=this.chartHeight,d=this.options.chart,g=this.spacing,q=this.clipOffset,l,m,p,A;this.plotLeft=l=Math.round(this.plotLeft);this.plotTop=m=Math.round(this.plotTop);this.plotWidth=
p=Math.max(0,Math.round(f-l-this.marginRight));this.plotHeight=A=Math.max(0,Math.round(k-m-this.marginBottom));this.plotSizeX=e?A:p;this.plotSizeY=e?p:A;this.plotBorderWidth=d.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:g[3],y:g[0],width:f-g[3]-g[1],height:k-g[0]-g[2]};this.plotBox=c.plotBox={x:l,y:m,width:p,height:A};f=2*Math.floor(this.plotBorderWidth/2);e=Math.ceil(Math.max(f,q[3])/2);c=Math.ceil(Math.max(f,q[0])/2);this.clipBox={x:e,y:c,width:Math.floor(this.plotSizeX-Math.max(f,q[1])/
2-e),height:Math.max(0,Math.floor(this.plotSizeY-Math.max(f,q[2])/2-c))};a||this.axes.forEach(function(a){a.setAxisSize();a.setAxisTranslation()});b(this,"afterSetChartSize",{skipAxes:a})},resetMargins:function(){b(this,"resetMargins");var a=this,e=a.options.chart;["margin","spacing"].forEach(function(b){var c=e[b],k=f(c)?c:[c,c,c,c];["Top","Right","Bottom","Left"].forEach(function(c,f){a[b][f]=A(e[b+c],k[f])})});H.forEach(function(b,e){a[b]=A(a.margin[e],a.spacing[e])});a.axisOffset=[0,0,0,0];a.clipOffset=
[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,e=this.renderer,c=this.chartWidth,f=this.chartHeight,k=this.chartBackground,d=this.plotBackground,g=this.plotBorder,q,l=this.styledMode,m=this.plotBGImage,p=a.backgroundColor,A=a.plotBackgroundColor,h=a.plotBackgroundImage,D,t=this.plotLeft,n=this.plotTop,C=this.plotWidth,x=this.plotHeight,r=this.plotBox,z=this.clipRect,u=this.clipBox,v="animate";k||(this.chartBackground=k=e.rect().addClass("highcharts-background").add(),v="attr");if(l)q=
D=k.strokeWidth();else{q=a.borderWidth||0;D=q+(a.shadow?8:0);p={fill:p||"none"};if(q||k["stroke-width"])p.stroke=a.borderColor,p["stroke-width"]=q;k.attr(p).shadow(a.shadow)}k[v]({x:D/2,y:D/2,width:c-D-q%2,height:f-D-q%2,r:a.borderRadius});v="animate";d||(v="attr",this.plotBackground=d=e.rect().addClass("highcharts-plot-background").add());d[v](r);l||(d.attr({fill:A||"none"}).shadow(a.plotShadow),h&&(m?m.animate(r):this.plotBGImage=e.image(h,t,n,C,x).add()));z?z.animate({width:u.width,height:u.height}):
this.clipRect=e.clipRect(u);v="animate";g||(v="attr",this.plotBorder=g=e.rect().addClass("highcharts-plot-border").attr({zIndex:1}).add());l||g.attr({stroke:a.plotBorderColor,"stroke-width":a.plotBorderWidth||0,fill:"none"});g[v](g.crisp({x:t,y:n,width:C,height:x},-g.strokeWidth()));this.isDirtyBox=!1;b(this,"afterDrawChartBox")},propFromSeries:function(){var a=this,b=a.options.chart,c,f=a.options.series,k,d;["inverted","angular","polar"].forEach(function(g){c=e[b.type||b.defaultSeriesType];d=b[g]||
c&&c.prototype[g];for(k=f&&f.length;!d&&k--;)(c=e[f[k].type])&&c.prototype[g]&&(d=!0);a[g]=d})},linkSeries:function(){var a=this,e=a.series;e.forEach(function(a){a.linkedSeries.length=0});e.forEach(function(b){var e=b.options.linkedTo;x(e)&&(e=":previous"===e?a.series[b.index-1]:a.get(e))&&e.linkedParent!==b&&(e.linkedSeries.push(b),b.linkedParent=e,b.visible=A(b.options.visible,e.options.visible,b.visible))});b(this,"afterLinkSeries")},renderSeries:function(){this.series.forEach(function(a){a.translate();
a.render()})},renderLabels:function(){var a=this,b=a.options.labels;b.items&&b.items.forEach(function(e){var c=m(b.style,e.style),f=D(c.left)+a.plotLeft,k=D(c.top)+a.plotTop+12;delete c.left;delete c.top;a.renderer.text(e.html,f,k).attr({zIndex:2}).css(c).add()})},render:function(){var a=this.axes,b=this.renderer,e=this.options,c,f,k;this.setTitle();this.legend=new t(this,e.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();e=this.plotWidth;c=this.plotHeight=Math.max(this.plotHeight-
21,0);a.forEach(function(a){a.setScale()});this.getAxisMargins();f=1.1<e/this.plotWidth;k=1.05<c/this.plotHeight;if(f||k)a.forEach(function(a){(a.horiz&&f||!a.horiz&&k)&&a.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries&&a.forEach(function(a){a.visible&&a.render()});this.seriesGroup||(this.seriesGroup=b.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.addCredits();this.setResponsive&&this.setResponsive();this.hasRendered=!0},
addCredits:function(a){var b=this;a=F(!0,this.options.credits,a);a.enabled&&!this.credits&&(this.credits=this.renderer.text(a.text+(this.mapCredits||""),0,0).addClass("highcharts-credits").on("click",function(){a.href&&(I.location.href=a.href)}).attr({align:a.position.align,zIndex:8}),b.styledMode||this.credits.css(a.style),this.credits.add().align(a.position),this.credits.update=function(a){b.credits=b.credits.destroy();b.addCredits(a)})},destroy:function(){var e=this,c=e.axes,f=e.series,k=e.container,
d,g=k&&k.parentNode;b(e,"destroy");e.renderer.forExport?a.erase(n,e):n[e.index]=void 0;a.chartCount--;e.renderTo.removeAttribute("data-highcharts-chart");C(e);for(d=c.length;d--;)c[d]=c[d].destroy();this.scroller&&this.scroller.destroy&&this.scroller.destroy();for(d=f.length;d--;)f[d]=f[d].destroy();"title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" ").forEach(function(a){var b=e[a];
b&&b.destroy&&(e[a]=b.destroy())});k&&(k.innerHTML="",C(k),g&&w(k));z(e,function(a,b){delete e[b]})},firstRender:function(){var a=this,e=a.options;if(!a.isReadyToRender||a.isReadyToRender()){a.getContainer();a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();(e.series||[]).forEach(function(b){a.initSeries(b)});a.linkSeries();b(a,"beforeRender");k&&(a.pointer=new k(a,e));a.render();if(!a.renderer.imgCount&&a.onload)a.onload();a.temporaryDisplay(!0)}},onload:function(){[this.callback].concat(this.callbacks).forEach(function(a){a&&
void 0!==this.index&&a.apply(this,[this])},this);b(this,"load");b(this,"render");c(this.index)&&this.setReflow(this.options.chart.reflow);this.onload=null}})})(J);(function(a){var y=a.addEvent,G=a.Chart;y(G,"afterSetChartSize",function(y){var h=this.options.chart.scrollablePlotArea;(h=h&&h.minWidth)&&!this.renderer.forExport&&(this.scrollablePixels=h=Math.max(0,h-this.chartWidth))&&(this.plotWidth+=h,this.clipBox.width+=h,y.skipAxes||this.axes.forEach(function(d){1===d.side?d.getPlotLinePath=function(){var h=
this.right,u;this.right=h-d.chart.scrollablePixels;u=a.Axis.prototype.getPlotLinePath.apply(this,arguments);this.right=h;return u}:(d.setAxisSize(),d.setAxisTranslation())}))});y(G,"render",function(){this.scrollablePixels?(this.setUpScrolling&&this.setUpScrolling(),this.applyFixed()):this.fixedDiv&&this.applyFixed()});G.prototype.setUpScrolling=function(){this.scrollingContainer=a.createElement("div",{className:"highcharts-scrolling"},{overflowX:"auto",WebkitOverflowScrolling:"touch"},this.renderTo);
this.innerContainer=a.createElement("div",{className:"highcharts-inner-container"},null,this.scrollingContainer);this.innerContainer.appendChild(this.container);this.setUpScrolling=null};G.prototype.applyFixed=function(){var y=this.container,h,d,r=!this.fixedDiv;r&&(this.fixedDiv=a.createElement("div",{className:"highcharts-fixed"},{position:"absolute",overflow:"hidden",pointerEvents:"none",zIndex:2},null,!0),this.renderTo.insertBefore(this.fixedDiv,this.renderTo.firstChild),this.fixedRenderer=h=
new a.Renderer(this.fixedDiv,0,0),this.scrollableMask=h.path().attr({fill:a.color(this.options.chart.backgroundColor||"#fff").setOpacity(.85).get(),zIndex:-1}).addClass("highcharts-scrollable-mask").add(),[this.inverted?".highcharts-xaxis":".highcharts-yaxis",this.inverted?".highcharts-xaxis-labels":".highcharts-yaxis-labels",".highcharts-contextbutton",".highcharts-credits",".highcharts-legend",".highcharts-subtitle",".highcharts-title",".highcharts-legend-checkbox"].forEach(function(a){[].forEach.call(y.querySelectorAll(a),
function(a){(a.namespaceURI===h.SVG_NS?h.box:h.box.parentNode).appendChild(a);a.style.pointerEvents="auto"})}));this.fixedRenderer.setSize(this.chartWidth,this.chartHeight);d=this.chartWidth+this.scrollablePixels;a.stop(this.container);this.container.style.width=d+"px";this.renderer.boxWrapper.attr({width:d,height:this.chartHeight,viewBox:[0,0,d,this.chartHeight].join(" ")});this.chartBackground.attr({width:d});r&&(d=this.options.chart.scrollablePlotArea,d.scrollPositionX&&(this.scrollingContainer.scrollLeft=
this.scrollablePixels*d.scrollPositionX));r=this.axisOffset;d=this.plotTop-r[0]-1;var r=this.plotTop+this.plotHeight+r[2],u=this.plotLeft+this.plotWidth-this.scrollablePixels;this.scrollableMask.attr({d:this.scrollablePixels?["M",0,d,"L",this.plotLeft-1,d,"L",this.plotLeft-1,r,"L",0,r,"Z","M",u,d,"L",this.chartWidth,d,"L",this.chartWidth,r,"L",u,r,"Z"]:["M",0,0]})}})(J);(function(a){var y,G=a.extend,E=a.erase,h=a.fireEvent,d=a.format,r=a.isArray,u=a.isNumber,v=a.pick,w=a.uniqueKey,n=a.defined,g=a.removeEvent;
a.Point=y=function(){};a.Point.prototype={init:function(a,d,g){var b;b=a.chart.options.chart.colorCount;var c=a.chart.styledMode;this.series=a;c||(this.color=a.color);this.applyOptions(d,g);this.id=n(this.id)?this.id:w();a.options.colorByPoint?(c||(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter],b=b.length),d=a.colorCounter,a.colorCounter++,a.colorCounter===b&&(a.colorCounter=0)):d=a.colorIndex;this.colorIndex=v(this.colorIndex,d);a.chart.pointCount++;h(this,"afterInit");
return this},applyOptions:function(a,d){var c=this.series,b=c.options.pointValKey||c.pointValKey;a=y.prototype.optionsToObject.call(this,a);G(this,a);this.options=this.options?G(this.options,a):a;a.group&&delete this.group;a.dataLabels&&delete this.dataLabels;b&&(this.y=this[b]);this.isNull=v(this.isValid&&!this.isValid(),null===this.x||!u(this.y,!0));this.selected&&(this.state="select");"name"in this&&void 0===d&&c.xAxis&&c.xAxis.hasNames&&(this.x=c.xAxis.nameToX(this));void 0===this.x&&c&&(this.x=
void 0===d?c.autoIncrement(this):d);return this},setNestedProperty:function(c,d,g){g.split(".").reduce(function(b,c,f,g){b[c]=g.length-1===f?d:a.isObject(b[c],!0)?b[c]:{};return b[c]},c);return c},optionsToObject:function(c){var d={},g=this.series,b=g.options.keys,l=b||g.pointArrayMap||["y"],f=l.length,h=0,t=0;if(u(c)||null===c)d[l[0]]=c;else if(r(c))for(!b&&c.length>f&&(g=typeof c[0],"string"===g?d.name=c[0]:"number"===g&&(d.x=c[0]),h++);t<f;)b&&void 0===c[h]||(0<l[t].indexOf(".")?a.Point.prototype.setNestedProperty(d,
c[h],l[t]):d[l[t]]=c[h]),h++,t++;else"object"===typeof c&&(d=c,c.dataLabels&&(g._hasPointLabels=!0),c.marker&&(g._hasPointMarkers=!0));return d},getClassName:function(){return"highcharts-point"+(this.selected?" highcharts-point-select":"")+(this.negative?" highcharts-negative":"")+(this.isNull?" highcharts-null-point":"")+(void 0!==this.colorIndex?" highcharts-color-"+this.colorIndex:"")+(this.options.className?" "+this.options.className:"")+(this.zone&&this.zone.className?" "+this.zone.className.replace("highcharts-negative",
""):"")},getZone:function(){var a=this.series,d=a.zones,a=a.zoneAxis||"y",g=0,b;for(b=d[g];this[a]>=b.value;)b=d[++g];this.nonZonedColor||(this.nonZonedColor=this.color);this.color=b&&b.color&&!this.options.color?b.color:this.nonZonedColor;return b},destroy:function(){var a=this.series.chart,d=a.hoverPoints,h;a.pointCount--;d&&(this.setState(),E(d,this),d.length||(a.hoverPoints=null));if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel||this.dataLabels)g(this),this.destroyElements();
this.legendItem&&a.legend.destroyItem(this);for(h in this)this[h]=null},destroyElements:function(){for(var a=["graphic","dataLabel","dataLabelUpper","connector","shadowGroup"],d,g=6;g--;)d=a[g],this[d]&&(this[d]=this[d].destroy());this.dataLabels&&(this.dataLabels.forEach(function(a){a.element&&a.destroy()}),delete this.dataLabels);this.connectors&&(this.connectors.forEach(function(a){a.element&&a.destroy()}),delete this.connectors)},getLabelConfig:function(){return{x:this.category,y:this.y,color:this.color,
colorIndex:this.colorIndex,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var c=this.series,g=c.tooltipOptions,b=v(g.valueDecimals,""),l=g.valuePrefix||"",f=g.valueSuffix||"";c.chart.styledMode&&(a=c.chart.tooltip.styledModeFormat(a));(c.pointArrayMap||["y"]).forEach(function(c){c="{point."+c;if(l||f)a=a.replace(RegExp(c+"}","g"),l+c+"}"+f);a=a.replace(RegExp(c+"}","g"),c+":,."+b+"f}")});return d(a,
{point:this,series:this.series},c.chart.time)},firePointEvent:function(a,d,g){var b=this,c=this.series.options;(c.point.events[a]||b.options&&b.options.events&&b.options.events[a])&&this.importEvents();"click"===a&&c.allowPointSelect&&(g=function(a){b.select&&b.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});h(this,a,d,g)},visible:!0}})(J);(function(a){var y=a.addEvent,G=a.animObject,E=a.arrayMax,h=a.arrayMin,d=a.correctFloat,r=a.defaultOptions,u=a.defaultPlotOptions,v=a.defined,w=a.erase,n=a.extend,
g=a.fireEvent,c=a.isArray,m=a.isNumber,p=a.isString,b=a.merge,l=a.objectEach,f=a.pick,x=a.removeEvent,t=a.splat,H=a.SVGElement,F=a.syncTimeout,z=a.win;a.Series=a.seriesType("line",null,{lineWidth:2,allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},marker:{lineWidth:0,lineColor:"#ffffff",enabledThreshold:2,radius:4,states:{normal:{animation:!0},hover:{animation:{duration:50},enabled:!0,radiusPlus:2,lineWidthPlus:1},select:{fillColor:"#cccccc",lineColor:"#000000",lineWidth:2}}},
point:{events:{}},dataLabels:{align:"center",formatter:function(){return null===this.y?"":a.numberFormat(this.y,-1)},style:{fontSize:"11px",fontWeight:"bold",color:"contrast",textOutline:"1px contrast"},verticalAlign:"bottom",x:0,y:0,padding:5},cropThreshold:300,pointRange:0,softThreshold:!0,states:{normal:{animation:!0},hover:{animation:{duration:50},lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{}},stickyTracking:!0,turboThreshold:1E3,findNearestPointBy:"x"},{isCartesian:!0,pointClass:a.Point,
sorted:!0,requireSorting:!0,directTouch:!1,axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],coll:"series",init:function(a,b){g(this,"init",{options:b});var c=this,k,e=a.series,d;c.chart=a;c.options=b=c.setOptions(b);c.linkedSeries=[];c.bindAxes();n(c,{name:b.name,state:"",visible:!1!==b.visible,selected:!0===b.selected});k=b.events;l(k,function(a,b){y(c,b,a)});if(k&&k.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;c.getColor();c.getSymbol();
c.parallelArrays.forEach(function(a){c[a+"Data"]=[]});c.setData(b.data,!1);c.isCartesian&&(a.hasCartesianSeries=!0);e.length&&(d=e[e.length-1]);c._i=f(d&&d._i,-1)+1;a.orderSeries(this.insert(e));g(this,"afterInit")},insert:function(a){var b=this.options.index,c;if(m(b)){for(c=a.length;c--;)if(b>=f(a[c].options.index,a[c]._i)){a.splice(c+1,0,this);break}-1===c&&a.unshift(this);c+=1}else a.push(this);return f(c,a.length-1)},bindAxes:function(){var b=this,c=b.options,f=b.chart,d;(b.axisTypes||[]).forEach(function(e){f[e].forEach(function(a){d=
a.options;if(c[e]===d.index||void 0!==c[e]&&c[e]===d.id||void 0===c[e]&&0===d.index)b.insert(a.series),b[e]=a,a.isDirty=!0});b[e]||b.optionalAxis===e||a.error(18,!0,f)})},updateParallelArrays:function(a,b){var c=a.series,f=arguments,e=m(b)?function(e){var f="y"===e&&c.toYData?c.toYData(a):a[e];c[e+"Data"][b]=f}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(f,2))};c.parallelArrays.forEach(e)},autoIncrement:function(){var a=this.options,b=this.xIncrement,c,d=a.pointIntervalUnit,
e=this.chart.time,b=f(b,a.pointStart,0);this.pointInterval=c=f(this.pointInterval,a.pointInterval,1);d&&(a=new e.Date(b),"day"===d?e.set("Date",a,e.get("Date",a)+c):"month"===d?e.set("Month",a,e.get("Month",a)+c):"year"===d&&e.set("FullYear",a,e.get("FullYear",a)+c),c=a.getTime()-b);this.xIncrement=b+c;return b},setOptions:function(a){var c=this.chart,d=c.options,k=d.plotOptions,e=(c.userOptions||{}).plotOptions||{},q=k[this.type],l=c.styledMode;this.userOptions=a;c=b(q,k.series,a);this.tooltipOptions=
b(r.tooltip,r.plotOptions.series&&r.plotOptions.series.tooltip,r.plotOptions[this.type].tooltip,d.tooltip.userOptions,k.series&&k.series.tooltip,k[this.type].tooltip,a.tooltip);this.stickyTracking=f(a.stickyTracking,e[this.type]&&e[this.type].stickyTracking,e.series&&e.series.stickyTracking,this.tooltipOptions.shared&&!this.noSharedTooltip?!0:c.stickyTracking);null===q.marker&&delete c.marker;this.zoneAxis=c.zoneAxis;a=this.zones=(c.zones||[]).slice();!c.negativeColor&&!c.negativeFillColor||c.zones||
(d={value:c[this.zoneAxis+"Threshold"]||c.threshold||0,className:"highcharts-negative"},l||(d.color=c.negativeColor,d.fillColor=c.negativeFillColor),a.push(d));a.length&&v(a[a.length-1].value)&&a.push(l?{}:{color:this.color,fillColor:this.fillColor});g(this,"afterSetOptions",{options:c});return c},getName:function(){return this.name||"Series "+(this.index+1)},getCyclic:function(a,b,c){var d,e=this.chart,k=this.userOptions,g=a+"Index",l=a+"Counter",m=c?c.length:f(e.options.chart[a+"Count"],e[a+"Count"]);
b||(d=f(k[g],k["_"+g]),v(d)||(e.series.length||(e[l]=0),k["_"+g]=d=e[l]%m,e[l]+=1),c&&(b=c[d]));void 0!==d&&(this[g]=d);this[a]=b},getColor:function(){this.chart.styledMode?this.getCyclic("color"):this.options.colorByPoint?this.options.color=null:this.getCyclic("color",this.options.color||u[this.type].color,this.chart.options.colors)},getSymbol:function(){this.getCyclic("symbol",this.options.marker.symbol,this.chart.options.symbols)},drawLegendSymbol:a.LegendSymbolMixin.drawLineMarker,updateData:function(b){var c=
this.options,f=this.points,d=[],e,k,g,l=this.requireSorting;this.xIncrement=null;b.forEach(function(b){var k,q,h;k=a.defined(b)&&this.pointClass.prototype.optionsToObject.call({series:this},b)||{};h=k.x;if((k=k.id)||m(h))k&&(q=(q=this.chart.get(k))&&q.x),void 0===q&&m(h)&&(q=this.xData.indexOf(h,g)),-1===q||void 0===q||f[q].touched?d.push(b):b!==c.data[q]?(f[q].update(b,!1,null,!1),f[q].touched=!0,l&&(g=q+1)):f[q]&&(f[q].touched=!0),e=!0},this);if(e)for(b=f.length;b--;)k=f[b],k.touched||k.remove(!1),
k.touched=!1;else if(b.length===f.length)b.forEach(function(a,b){f[b].update&&a!==c.data[b]&&f[b].update(a,!1,null,!1)});else return!1;d.forEach(function(a){this.addPoint(a,!1)},this);return!0},setData:function(b,d,g,l){var e=this,k=e.points,h=k&&k.length||0,A,t=e.options,n=e.chart,D=null,C=e.xAxis,x=t.turboThreshold,r=this.xData,z=this.yData,u=(A=e.pointArrayMap)&&A.length,v;b=b||[];A=b.length;d=f(d,!0);!1!==l&&A&&h&&!e.cropped&&!e.hasGroupedData&&e.visible&&!e.isSeriesBoosting&&(v=this.updateData(b));
if(!v){e.xIncrement=null;e.colorCounter=0;this.parallelArrays.forEach(function(a){e[a+"Data"].length=0});if(x&&A>x){for(g=0;null===D&&g<A;)D=b[g],g++;if(m(D))for(g=0;g<A;g++)r[g]=this.autoIncrement(),z[g]=b[g];else if(c(D))if(u)for(g=0;g<A;g++)D=b[g],r[g]=D[0],z[g]=D.slice(1,u+1);else for(g=0;g<A;g++)D=b[g],r[g]=D[0],z[g]=D[1];else a.error(12,!1,n)}else for(g=0;g<A;g++)void 0!==b[g]&&(D={series:e},e.pointClass.prototype.applyOptions.apply(D,[b[g]]),e.updateParallelArrays(D,g));z&&p(z[0])&&a.error(14,
!0,n);e.data=[];e.options.data=e.userOptions.data=b;for(g=h;g--;)k[g]&&k[g].destroy&&k[g].destroy();C&&(C.minRange=C.userMinRange);e.isDirty=n.isDirtyBox=!0;e.isDirtyData=!!k;g=!1}"point"===t.legendType&&(this.processData(),this.generatePoints());d&&n.redraw(g)},processData:function(b){var c=this.xData,f=this.yData,d=c.length,e;e=0;var k,g,l=this.xAxis,m,h=this.options;m=h.cropThreshold;var p=this.getExtremesFromAll||h.getExtremesFromAll,t=this.isCartesian,h=l&&l.val2lin,n=l&&l.isLog,x=this.requireSorting,
r,z;if(t&&!this.isDirty&&!l.isDirty&&!this.yAxis.isDirty&&!b)return!1;l&&(b=l.getExtremes(),r=b.min,z=b.max);t&&this.sorted&&!p&&(!m||d>m||this.forceCrop)&&(c[d-1]<r||c[0]>z?(c=[],f=[]):this.yData&&(c[0]<r||c[d-1]>z)&&(e=this.cropData(this.xData,this.yData,r,z),c=e.xData,f=e.yData,e=e.start,k=!0));for(m=c.length||1;--m;)d=n?h(c[m])-h(c[m-1]):c[m]-c[m-1],0<d&&(void 0===g||d<g)?g=d:0>d&&x&&(a.error(15,!1,this.chart),x=!1);this.cropped=k;this.cropStart=e;this.processedXData=c;this.processedYData=f;this.closestPointRange=
g},cropData:function(a,b,c,d,e){var k=a.length,g=0,l=k,m;e=f(e,this.cropShoulder,1);for(m=0;m<k;m++)if(a[m]>=c){g=Math.max(0,m-e);break}for(c=m;c<k;c++)if(a[c]>d){l=c+e;break}return{xData:a.slice(g,l),yData:b.slice(g,l),start:g,end:l}},generatePoints:function(){var a=this.options,b=a.data,c=this.data,f,e=this.processedXData,d=this.processedYData,g=this.pointClass,l=e.length,m=this.cropStart||0,h,p=this.hasGroupedData,a=a.keys,x,r=[],z;c||p||(c=[],c.length=b.length,c=this.data=c);a&&p&&(this.options.keys=
!1);for(z=0;z<l;z++)h=m+z,p?(x=(new g).init(this,[e[z]].concat(t(d[z]))),x.dataGroup=this.groupMap[z],x.dataGroup.options&&(x.options=x.dataGroup.options,n(x,x.dataGroup.options))):(x=c[h])||void 0===b[h]||(c[h]=x=(new g).init(this,b[h],e[z])),x&&(x.index=h,r[z]=x);this.options.keys=a;if(c&&(l!==(f=c.length)||p))for(z=0;z<f;z++)z!==m||p||(z+=l),c[z]&&(c[z].destroyElements(),c[z].plotX=void 0);this.data=c;this.points=r},getExtremes:function(a){var b=this.yAxis,f=this.processedXData,d,e=[],k=0;d=this.xAxis.getExtremes();
var g=d.min,l=d.max,p,t,n=this.requireSorting?1:0,x,z;a=a||this.stackedYData||this.processedYData||[];d=a.length;for(z=0;z<d;z++)if(t=f[z],x=a[z],p=(m(x,!0)||c(x))&&(!b.positiveValuesOnly||x.length||0<x),t=this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||(f[z+n]||t)>=g&&(f[z-n]||t)<=l,p&&t)if(p=x.length)for(;p--;)"number"===typeof x[p]&&(e[k++]=x[p]);else e[k++]=x;this.dataMin=h(e);this.dataMax=E(e)},translate:function(){this.processedXData||this.processData();this.generatePoints();
var a=this.options,b=a.stacking,c=this.xAxis,l=c.categories,e=this.yAxis,q=this.points,h=q.length,p=!!this.modifyValue,t=a.pointPlacement,n="between"===t||m(t),x=a.threshold,z=a.startFromThreshold?x:0,r,u,F,H,w=Number.MAX_VALUE;"between"===t&&(t=.5);m(t)&&(t*=f(a.pointRange||c.pointRange));for(a=0;a<h;a++){var y=q[a],E=y.x,G=y.y;u=y.low;var J=b&&e.stacks[(this.negStacks&&G<(z?0:x)?"-":"")+this.stackKey],U;e.positiveValuesOnly&&null!==G&&0>=G&&(y.isNull=!0);y.plotX=r=d(Math.min(Math.max(-1E5,c.translate(E,
0,0,0,1,t,"flags"===this.type)),1E5));b&&this.visible&&!y.isNull&&J&&J[E]&&(H=this.getStackIndicator(H,E,this.index),U=J[E],G=U.points[H.key],u=G[0],G=G[1],u===z&&H.key===J[E].base&&(u=f(m(x)&&x,e.min)),e.positiveValuesOnly&&0>=u&&(u=null),y.total=y.stackTotal=U.total,y.percentage=U.total&&y.y/U.total*100,y.stackY=G,U.setOffset(this.pointXOffset||0,this.barW||0));y.yBottom=v(u)?Math.min(Math.max(-1E5,e.translate(u,0,1,0,1)),1E5):null;p&&(G=this.modifyValue(G,y));y.plotY=u="number"===typeof G&&Infinity!==
G?Math.min(Math.max(-1E5,e.translate(G,0,1,0,1)),1E5):void 0;y.isInside=void 0!==u&&0<=u&&u<=e.len&&0<=r&&r<=c.len;y.clientX=n?d(c.translate(E,0,0,0,1,t)):r;y.negative=y.y<(x||0);y.category=l&&void 0!==l[y.x]?l[y.x]:y.x;y.isNull||(void 0!==F&&(w=Math.min(w,Math.abs(r-F))),F=r);y.zone=this.zones.length&&y.getZone()}this.closestPointRangePx=w;g(this,"afterTranslate")},getValidPoints:function(a,b){var c=this.chart;return(a||this.points||[]).filter(function(a){return b&&!c.isInsidePlot(a.plotX,a.plotY,
c.inverted)?!1:!a.isNull})},setClip:function(a){var b=this.chart,c=this.options,f=b.renderer,e=b.inverted,d=this.clipBox,k=d||b.clipBox,g=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,k.height,c.xAxis,c.yAxis].join(),l=b[g],m=b[g+"m"];l||(a&&(k.width=0,e&&(k.x=b.plotSizeX),b[g+"m"]=m=f.clipRect(e?b.plotSizeX+99:-99,e?-b.plotLeft:-b.plotTop,99,e?b.chartWidth:b.chartHeight)),b[g]=l=f.clipRect(k),l.count={length:0});a&&!l.count[this.index]&&(l.count[this.index]=!0,l.count.length+=1);!1!==
c.clip&&(this.group.clip(a||d?l:b.clipRect),this.markerGroup.clip(m),this.sharedClipKey=g);a||(l.count[this.index]&&(delete l.count[this.index],--l.count.length),0===l.count.length&&g&&b[g]&&(d||(b[g]=b[g].destroy()),b[g+"m"]&&(b[g+"m"]=b[g+"m"].destroy())))},animate:function(a){var b=this.chart,c=G(this.options.animation),f;a?this.setClip(c):(f=this.sharedClipKey,(a=b[f])&&a.animate({width:b.plotSizeX,x:0},c),b[f+"m"]&&b[f+"m"].animate({width:b.plotSizeX+99,x:0},c),this.animate=null)},afterAnimate:function(){this.setClip();
g(this,"afterAnimate");this.finishedAnimating=!0},drawPoints:function(){var a=this.points,b=this.chart,c,d,e,g,l=this.options.marker,m,h,p,t=this[this.specialGroup]||this.markerGroup;c=this.xAxis;var n,x=f(l.enabled,!c||c.isRadial?!0:null,this.closestPointRangePx>=l.enabledThreshold*l.radius);if(!1!==l.enabled||this._hasPointMarkers)for(c=0;c<a.length;c++)d=a[c],g=d.graphic,m=d.marker||{},h=!!d.marker,e=x&&void 0===m.enabled||m.enabled,p=!1!==d.isInside,e&&!d.isNull?(e=f(m.symbol,this.symbol),n=this.markerAttribs(d,
d.selected&&"select"),g?g[p?"show":"hide"](!0).animate(n):p&&(0<n.width||d.hasImage)&&(d.graphic=g=b.renderer.symbol(e,n.x,n.y,n.width,n.height,h?m:l).add(t)),g&&!b.styledMode&&g.attr(this.pointAttribs(d,d.selected&&"select")),g&&g.addClass(d.getClassName(),!0)):g&&(d.graphic=g.destroy())},markerAttribs:function(a,b){var c=this.options.marker,d=a.marker||{},e=d.symbol||c.symbol,k=f(d.radius,c.radius);b&&(c=c.states[b],b=d.states&&d.states[b],k=f(b&&b.radius,c&&c.radius,k+(c&&c.radiusPlus||0)));a.hasImage=
e&&0===e.indexOf("url");a.hasImage&&(k=0);a={x:Math.floor(a.plotX)-k,y:a.plotY-k};k&&(a.width=a.height=2*k);return a},pointAttribs:function(a,b){var c=this.options.marker,d=a&&a.options,e=d&&d.marker||{},g=this.color,k=d&&d.color,l=a&&a.color,d=f(e.lineWidth,c.lineWidth);a=a&&a.zone&&a.zone.color;g=k||a||l||g;a=e.fillColor||c.fillColor||g;g=e.lineColor||c.lineColor||g;b&&(c=c.states[b],b=e.states&&e.states[b]||{},d=f(b.lineWidth,c.lineWidth,d+f(b.lineWidthPlus,c.lineWidthPlus,0)),a=b.fillColor||c.fillColor||
a,g=b.lineColor||c.lineColor||g);return{stroke:g,"stroke-width":d,fill:a}},destroy:function(){var b=this,c=b.chart,f=/AppleWebKit\/533/.test(z.navigator.userAgent),d,e,q=b.data||[],m,h;g(b,"destroy");x(b);(b.axisTypes||[]).forEach(function(a){(h=b[a])&&h.series&&(w(h.series,b),h.isDirty=h.forceRedraw=!0)});b.legendItem&&b.chart.legend.destroyItem(b);for(e=q.length;e--;)(m=q[e])&&m.destroy&&m.destroy();b.points=null;a.clearTimeout(b.animationTimeout);l(b,function(a,b){a instanceof H&&!a.survive&&(d=
f&&"group"===b?"hide":"destroy",a[d]())});c.hoverSeries===b&&(c.hoverSeries=null);w(c.series,b);c.orderSeries();l(b,function(a,e){delete b[e]})},getGraphPath:function(a,b,c){var f=this,e=f.options,d=e.step,g,k=[],l=[],m;a=a||f.points;(g=a.reversed)&&a.reverse();(d={right:1,center:2}[d]||d&&3)&&g&&(d=4-d);!e.connectNulls||b||c||(a=this.getValidPoints(a));a.forEach(function(g,q){var h=g.plotX,p=g.plotY,t=a[q-1];(g.leftCliff||t&&t.rightCliff)&&!c&&(m=!0);g.isNull&&!v(b)&&0<q?m=!e.connectNulls:g.isNull&&
!b?m=!0:(0===q||m?q=["M",g.plotX,g.plotY]:f.getPointSpline?q=f.getPointSpline(a,g,q):d?(q=1===d?["L",t.plotX,p]:2===d?["L",(t.plotX+h)/2,t.plotY,"L",(t.plotX+h)/2,p]:["L",h,t.plotY],q.push("L",h,p)):q=["L",h,p],l.push(g.x),d&&(l.push(g.x),2===d&&l.push(g.x)),k.push.apply(k,q),m=!1)});k.xMap=l;return f.graphPath=k},drawGraph:function(){var a=this,b=this.options,c=(this.gappedPath||this.getGraphPath).call(this),f=this.chart.styledMode,e=[["graph","highcharts-graph"]];f||e[0].push(b.lineColor||this.color,
b.dashStyle);e=a.getZonesGraphs(e);e.forEach(function(e,d){var g=e[0],k=a[g];k?(k.endX=a.preventGraphAnimation?null:c.xMap,k.animate({d:c})):c.length&&(a[g]=a.chart.renderer.path(c).addClass(e[1]).attr({zIndex:1}).add(a.group),f||(k={stroke:e[2],"stroke-width":b.lineWidth,fill:a.fillGraph&&a.color||"none"},e[3]?k.dashstyle=e[3]:"square"!==b.linecap&&(k["stroke-linecap"]=k["stroke-linejoin"]="round"),k=a[g].attr(k).shadow(2>d&&b.shadow)));k&&(k.startX=c.xMap,k.isArea=c.isArea)})},getZonesGraphs:function(a){this.zones.forEach(function(b,
c){c=["zone-graph-"+c,"highcharts-graph highcharts-zone-graph-"+c+" "+(b.className||"")];this.chart.styledMode||c.push(b.color||this.color,b.dashStyle||this.options.dashStyle);a.push(c)},this);return a},applyZones:function(){var a=this,b=this.chart,c=b.renderer,d=this.zones,e,g,l=this.clips||[],m,h=this.graph,p=this.area,t=Math.max(b.chartWidth,b.chartHeight),n=this[(this.zoneAxis||"y")+"Axis"],x,z,r=b.inverted,u,v,F,H,w=!1;d.length&&(h||p)&&n&&void 0!==n.min&&(z=n.reversed,u=n.horiz,h&&!this.showLine&&
h.hide(),p&&p.hide(),x=n.getExtremes(),d.forEach(function(d,k){e=z?u?b.plotWidth:0:u?0:n.toPixels(x.min)||0;e=Math.min(Math.max(f(g,e),0),t);g=Math.min(Math.max(Math.round(n.toPixels(f(d.value,x.max),!0)||0),0),t);w&&(e=g=n.toPixels(x.max));v=Math.abs(e-g);F=Math.min(e,g);H=Math.max(e,g);n.isXAxis?(m={x:r?H:F,y:0,width:v,height:t},u||(m.x=b.plotHeight-m.x)):(m={x:0,y:r?H:F,width:t,height:v},u&&(m.y=b.plotWidth-m.y));r&&c.isVML&&(m=n.isXAxis?{x:0,y:z?F:H,height:m.width,width:b.chartWidth}:{x:m.y-b.plotLeft-
b.spacingBox.x,y:0,width:m.height,height:b.chartHeight});l[k]?l[k].animate(m):(l[k]=c.clipRect(m),h&&a["zone-graph-"+k].clip(l[k]),p&&a["zone-area-"+k].clip(l[k]));w=d.value>x.max;a.resetZones&&0===g&&(g=void 0)}),this.clips=l)},invertGroups:function(a){function b(){["group","markerGroup"].forEach(function(b){c[b]&&(f.renderer.isVML&&c[b].attr({width:c.yAxis.len,height:c.xAxis.len}),c[b].width=c.yAxis.len,c[b].height=c.xAxis.len,c[b].invert(a))})}var c=this,f=c.chart,e;c.xAxis&&(e=y(f,"resize",b),
y(c,"destroy",e),b(a),c.invertGroups=b)},plotGroup:function(a,b,c,f,e){var d=this[a],g=!d;g&&(this[a]=d=this.chart.renderer.g().attr({zIndex:f||.1}).add(e));d.addClass("highcharts-"+b+" highcharts-series-"+this.index+" highcharts-"+this.type+"-series "+(v(this.colorIndex)?"highcharts-color-"+this.colorIndex+" ":"")+(this.options.className||"")+(d.hasClass("highcharts-tracker")?" highcharts-tracker":""),!0);d.attr({visibility:c})[g?"attr":"animate"](this.getPlotBox());return d},getPlotBox:function(){var a=
this.chart,b=this.xAxis,c=this.yAxis;a.inverted&&(b=c,c=this.xAxis);return{translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,c,f=a.options,e=!!a.animate&&b.renderer.isSVG&&G(f.animation).duration,d=a.visible?"inherit":"hidden",l=f.zIndex,m=a.hasRendered,h=b.seriesGroup,p=b.inverted;c=a.plotGroup("group","series",d,l,h);a.markerGroup=a.plotGroup("markerGroup","markers",d,l,h);e&&a.animate(!0);c.inverted=a.isCartesian?p:!1;a.drawGraph&&
(a.drawGraph(),a.applyZones());a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&!1!==a.options.enableMouseTracking&&a.drawTracker();a.invertGroups(p);!1===f.clip||a.sharedClipKey||m||c.clip(b.clipRect);e&&a.animate();m||(a.animationTimeout=F(function(){a.afterAnimate()},e));a.isDirty=!1;a.hasRendered=!0;g(a,"afterRender")},redraw:function(){var a=this.chart,b=this.isDirty||this.isDirtyData,c=this.group,d=this.xAxis,e=this.yAxis;c&&(a.inverted&&c.attr({width:a.plotWidth,
height:a.plotHeight}),c.animate({translateX:f(d&&d.left,a.plotLeft),translateY:f(e&&e.top,a.plotTop)}));this.translate();this.render();b&&delete this.kdTree},kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var c=this.xAxis,f=this.yAxis,e=this.chart.inverted;return this.searchKDTree({clientX:e?c.len-a.chartY+c.pos:a.chartX-c.pos,plotY:e?f.len-a.chartX+f.pos:a.chartY-f.pos},b)},buildKDTree:function(){function a(c,e,f){var d,g;if(g=c&&c.length)return d=b.kdAxisArray[e%f],c.sort(function(a,
b){return a[d]-b[d]}),g=Math.floor(g/2),{point:c[g],left:a(c.slice(0,g),e+1,f),right:a(c.slice(g+1),e+1,f)}}this.buildingKdTree=!0;var b=this,c=-1<b.options.findNearestPointBy.indexOf("y")?2:1;delete b.kdTree;F(function(){b.kdTree=a(b.getValidPoints(null,!b.directTouch),c,c);b.buildingKdTree=!1},b.options.kdNow?0:1)},searchKDTree:function(a,b){function c(a,b,k,l){var m=b.point,h=f.kdAxisArray[k%l],q,p,t=m;p=v(a[e])&&v(m[e])?Math.pow(a[e]-m[e],2):null;q=v(a[d])&&v(m[d])?Math.pow(a[d]-m[d],2):null;
q=(p||0)+(q||0);m.dist=v(q)?Math.sqrt(q):Number.MAX_VALUE;m.distX=v(p)?Math.sqrt(p):Number.MAX_VALUE;h=a[h]-m[h];q=0>h?"left":"right";p=0>h?"right":"left";b[q]&&(q=c(a,b[q],k+1,l),t=q[g]<t[g]?q:m);b[p]&&Math.sqrt(h*h)<t[g]&&(a=c(a,b[p],k+1,l),t=a[g]<t[g]?a:t);return t}var f=this,e=this.kdAxisArray[0],d=this.kdAxisArray[1],g=b?"distX":"dist";b=-1<f.options.findNearestPointBy.indexOf("y")?2:1;this.kdTree||this.buildingKdTree||this.buildKDTree();if(this.kdTree)return c(a,this.kdTree,b,b)}})})(J);(function(a){var y=
a.Axis,G=a.Chart,E=a.correctFloat,h=a.defined,d=a.destroyObjectProperties,r=a.format,u=a.objectEach,v=a.pick,w=a.Series;a.StackItem=function(a,d,c,m,h){var b=a.chart.inverted;this.axis=a;this.isNegative=c;this.options=d;this.x=m;this.total=null;this.points={};this.stack=h;this.rightCliff=this.leftCliff=0;this.alignOptions={align:d.align||(b?c?"left":"right":"center"),verticalAlign:d.verticalAlign||(b?"middle":c?"bottom":"top"),y:v(d.y,b?4:c?14:-6),x:v(d.x,b?c?-6:6:0)};this.textAlign=d.textAlign||
(b?c?"right":"left":"center")};a.StackItem.prototype={destroy:function(){d(this,this.axis)},render:function(a){var d=this.axis.chart,c=this.options,m=c.format,m=m?r(m,this,d.time):c.formatter.call(this);this.label?this.label.attr({text:m,visibility:"hidden"}):this.label=d.renderer.text(m,null,null,c.useHTML).css(c.style).attr({align:this.textAlign,rotation:c.rotation,visibility:"hidden"}).add(a);this.label.labelrank=d.plotHeight},setOffset:function(a,d){var c=this.axis,g=c.chart,p=c.translate(c.usePercentage?
100:this.total,0,0,0,1),b=c.translate(0),b=h(p)&&Math.abs(p-b);a=g.xAxis[0].translate(this.x)+a;c=h(p)&&this.getStackBox(g,this,a,p,d,b,c);(d=this.label)&&c&&(d.align(this.alignOptions,null,c),c=d.alignAttr,d[!1===this.options.crop||g.isInsidePlot(c.x,c.y)?"show":"hide"](!0))},getStackBox:function(a,d,c,m,h,b,l){var f=d.axis.reversed,g=a.inverted;a=l.height+l.pos-(g?a.plotLeft:a.plotTop);d=d.isNegative&&!f||!d.isNegative&&f;return{x:g?d?m:m-b:c,y:g?a-c-h:d?a-m-b:a-m,width:g?b:h,height:g?h:b}}};G.prototype.getStacks=
function(){var a=this;a.yAxis.forEach(function(a){a.stacks&&a.hasVisibleSeries&&(a.oldStacks=a.stacks)});a.series.forEach(function(d){!d.options.stacking||!0!==d.visible&&!1!==a.options.chart.ignoreHiddenSeries||(d.stackKey=d.type+v(d.options.stack,""))})};y.prototype.buildStacks=function(){var a=this.series,d=v(this.options.reversedStacks,!0),c=a.length,m;if(!this.isXAxis){this.usePercentage=!1;for(m=c;m--;)a[d?m:c-m-1].setStackedPoints();for(m=0;m<c;m++)a[m].modifyStacks()}};y.prototype.renderStackTotals=
function(){var a=this.chart,d=a.renderer,c=this.stacks,m=this.stackTotalGroup;m||(this.stackTotalGroup=m=d.g("stack-labels").attr({visibility:"visible",zIndex:6}).add());m.translate(a.plotLeft,a.plotTop);u(c,function(a){u(a,function(a){a.render(m)})})};y.prototype.resetStacks=function(){var a=this,d=a.stacks;a.isXAxis||u(d,function(c){u(c,function(d,g){d.touched<a.stacksTouched?(d.destroy(),delete c[g]):(d.total=null,d.cumulative=null)})})};y.prototype.cleanStacks=function(){var a;this.isXAxis||(this.oldStacks&&
(a=this.stacks=this.oldStacks),u(a,function(a){u(a,function(a){a.cumulative=a.total})}))};w.prototype.setStackedPoints=function(){if(this.options.stacking&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var d=this.processedXData,g=this.processedYData,c=[],m=g.length,p=this.options,b=p.threshold,l=v(p.startFromThreshold&&b,0),f=p.stack,p=p.stacking,x=this.stackKey,t="-"+x,r=this.negStacks,u=this.yAxis,z=u.stacks,k=u.oldStacks,A,D,C,e,q,w,y;u.stacksTouched+=1;for(q=0;q<m;q++)w=
d[q],y=g[q],A=this.getStackIndicator(A,w,this.index),e=A.key,C=(D=r&&y<(l?0:b))?t:x,z[C]||(z[C]={}),z[C][w]||(k[C]&&k[C][w]?(z[C][w]=k[C][w],z[C][w].total=null):z[C][w]=new a.StackItem(u,u.options.stackLabels,D,w,f)),C=z[C][w],null!==y?(C.points[e]=C.points[this.index]=[v(C.cumulative,l)],h(C.cumulative)||(C.base=e),C.touched=u.stacksTouched,0<A.index&&!1===this.singleStacks&&(C.points[e][0]=C.points[this.index+","+w+",0"][0])):C.points[e]=C.points[this.index]=null,"percent"===p?(D=D?x:t,r&&z[D]&&
z[D][w]?(D=z[D][w],C.total=D.total=Math.max(D.total,C.total)+Math.abs(y)||0):C.total=E(C.total+(Math.abs(y)||0))):C.total=E(C.total+(y||0)),C.cumulative=v(C.cumulative,l)+(y||0),null!==y&&(C.points[e].push(C.cumulative),c[q]=C.cumulative);"percent"===p&&(u.usePercentage=!0);this.stackedYData=c;u.oldStacks={}}};w.prototype.modifyStacks=function(){var a=this,d=a.stackKey,c=a.yAxis.stacks,m=a.processedXData,h,b=a.options.stacking;a[b+"Stacker"]&&[d,"-"+d].forEach(function(d){for(var f=m.length,g,l;f--;)if(g=
m[f],h=a.getStackIndicator(h,g,a.index,d),l=(g=c[d]&&c[d][g])&&g.points[h.key])a[b+"Stacker"](l,g,f)})};w.prototype.percentStacker=function(a,d,c){d=d.total?100/d.total:0;a[0]=E(a[0]*d);a[1]=E(a[1]*d);this.stackedYData[c]=a[1]};w.prototype.getStackIndicator=function(a,d,c,m){!h(a)||a.x!==d||m&&a.key!==m?a={x:d,index:0,key:m}:a.index++;a.key=[c,d,a.index].join();return a}})(J);(function(a){var y=a.addEvent,G=a.animate,E=a.Axis,h=a.Chart,d=a.createElement,r=a.css,u=a.defined,v=a.erase,w=a.extend,n=
a.fireEvent,g=a.isNumber,c=a.isObject,m=a.isArray,p=a.merge,b=a.objectEach,l=a.pick,f=a.Point,x=a.Series,t=a.seriesTypes,H=a.setAnimation,F=a.splat;a.cleanRecursively=function(d,f){var g=0,k=0;b(d,function(b,e){c(d[e],!0)&&f[e]?a.cleanRecursively(d[e],f[e])&&delete d[e]:c(d[e])||d[e]!==f[e]||(delete d[e],k++);g++});return g===k};w(h.prototype,{addSeries:function(a,b,c){var d,f=this;a&&(b=l(b,!0),n(f,"addSeries",{options:a},function(){d=f.initSeries(a);f.isDirtyLegend=!0;f.linkSeries();n(f,"afterAddSeries");
b&&f.redraw(c)}));return d},addAxis:function(a,b,c,d){var f=b?"xAxis":"yAxis",e=this.options;a=p(a,{index:this[f].length,isX:b});b=new E(this,a);e[f]=F(e[f]||{});e[f].push(a);l(c,!0)&&this.redraw(d);return b},showLoading:function(a){var b=this,c=b.options,f=b.loadingDiv,g=c.loading,e=function(){f&&r(f,{left:b.plotLeft+"px",top:b.plotTop+"px",width:b.plotWidth+"px",height:b.plotHeight+"px"})};f||(b.loadingDiv=f=d("div",{className:"highcharts-loading highcharts-loading-hidden"},null,b.container),b.loadingSpan=
d("span",{className:"highcharts-loading-inner"},null,f),y(b,"redraw",e));f.className="highcharts-loading";b.loadingSpan.innerHTML=a||c.lang.loading;b.styledMode||(r(f,w(g.style,{zIndex:10})),r(b.loadingSpan,g.labelStyle),b.loadingShown||(r(f,{opacity:0,display:""}),G(f,{opacity:g.style.opacity||.5},{duration:g.showDuration||0})));b.loadingShown=!0;e()},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&(b.className="highcharts-loading highcharts-loading-hidden",this.styledMode||G(b,{opacity:0},
{duration:a.loading.hideDuration||100,complete:function(){r(b,{display:"none"})}}));this.loadingShown=!1},propsRequireDirtyBox:"backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),propsRequireUpdateSeries:"chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),
collectionsWithUpdate:"xAxis yAxis zAxis series colorAxis pane".split(" "),update:function(c,d,f,m){var k=this,e={credits:"addCredits",title:"setTitle",subtitle:"setSubtitle"},h,t,x,r=[];n(k,"update",{options:c});a.cleanRecursively(c,k.options);if(h=c.chart){p(!0,k.options.chart,h);"className"in h&&k.setClassName(h.className);"reflow"in h&&k.setReflow(h.reflow);if("inverted"in h||"polar"in h||"type"in h)k.propFromSeries(),t=!0;"alignTicks"in h&&(t=!0);b(h,function(a,b){-1!==k.propsRequireUpdateSeries.indexOf("chart."+
b)&&(x=!0);-1!==k.propsRequireDirtyBox.indexOf(b)&&(k.isDirtyBox=!0)});!k.styledMode&&"style"in h&&k.renderer.setStyle(h.style)}!k.styledMode&&c.colors&&(this.options.colors=c.colors);c.plotOptions&&p(!0,this.options.plotOptions,c.plotOptions);b(c,function(a,b){if(k[b]&&"function"===typeof k[b].update)k[b].update(a,!1);else if("function"===typeof k[e[b]])k[e[b]](a);"chart"!==b&&-1!==k.propsRequireUpdateSeries.indexOf(b)&&(x=!0)});this.collectionsWithUpdate.forEach(function(a){var b;c[a]&&("series"===
a&&(b=[],k[a].forEach(function(a,c){a.options.isInternal||b.push(l(a.options.index,c))})),F(c[a]).forEach(function(c,e){(e=u(c.id)&&k.get(c.id)||k[a][b?b[e]:e])&&e.coll===a&&(e.update(c,!1),f&&(e.touched=!0));if(!e&&f)if("series"===a)k.addSeries(c,!1).touched=!0;else if("xAxis"===a||"yAxis"===a)k.addAxis(c,"xAxis"===a,!1).touched=!0}),f&&k[a].forEach(function(a){a.touched||a.options.isInternal?delete a.touched:r.push(a)}))});r.forEach(function(a){a.remove&&a.remove(!1)});t&&k.axes.forEach(function(a){a.update({},
!1)});x&&k.series.forEach(function(a){a.update({},!1)});c.loading&&p(!0,k.options.loading,c.loading);t=h&&h.width;h=h&&h.height;g(t)&&t!==k.chartWidth||g(h)&&h!==k.chartHeight?k.setSize(t,h,m):l(d,!0)&&k.redraw(m);n(k,"afterUpdate",{options:c})},setSubtitle:function(a){this.setTitle(void 0,a)}});w(f.prototype,{update:function(a,b,d,f){function g(){e.applyOptions(a);null===e.y&&h&&(e.graphic=h.destroy());c(a,!0)&&(h&&h.element&&a&&a.marker&&void 0!==a.marker.symbol&&(e.graphic=h.destroy()),a&&a.dataLabels&&
e.dataLabel&&(e.dataLabel=e.dataLabel.destroy()),e.connector&&(e.connector=e.connector.destroy()));m=e.index;k.updateParallelArrays(e,m);t.data[m]=c(t.data[m],!0)||c(a,!0)?e.options:l(a,t.data[m]);k.isDirty=k.isDirtyData=!0;!k.fixedBox&&k.hasCartesianSeries&&(p.isDirtyBox=!0);"point"===t.legendType&&(p.isDirtyLegend=!0);b&&p.redraw(d)}var e=this,k=e.series,h=e.graphic,m,p=k.chart,t=k.options;b=l(b,!0);!1===f?g():e.firePointEvent("update",{options:a},g)},remove:function(a,b){this.series.removePoint(this.series.data.indexOf(this),
a,b)}});w(x.prototype,{addPoint:function(a,b,c,d){var f=this.options,e=this.data,g=this.chart,k=this.xAxis,k=k&&k.hasNames&&k.names,h=f.data,m,p,t=this.xData,n,x;b=l(b,!0);m={series:this};this.pointClass.prototype.applyOptions.apply(m,[a]);x=m.x;n=t.length;if(this.requireSorting&&x<t[n-1])for(p=!0;n&&t[n-1]>x;)n--;this.updateParallelArrays(m,"splice",n,0,0);this.updateParallelArrays(m,n);k&&m.name&&(k[x]=m.name);h.splice(n,0,a);p&&(this.data.splice(n,0,null),this.processData());"point"===f.legendType&&
this.generatePoints();c&&(e[0]&&e[0].remove?e[0].remove(!1):(e.shift(),this.updateParallelArrays(m,"shift"),h.shift()));this.isDirtyData=this.isDirty=!0;b&&g.redraw(d)},removePoint:function(a,b,c){var d=this,f=d.data,e=f[a],g=d.points,k=d.chart,h=function(){g&&g.length===f.length&&g.splice(a,1);f.splice(a,1);d.options.data.splice(a,1);d.updateParallelArrays(e||{series:d},"splice",a,1);e&&e.destroy();d.isDirty=!0;d.isDirtyData=!0;b&&k.redraw()};H(c,k);b=l(b,!0);e?e.firePointEvent("remove",null,h):
h()},remove:function(a,b,c){function d(){f.destroy();f.remove=null;e.isDirtyLegend=e.isDirtyBox=!0;e.linkSeries();l(a,!0)&&e.redraw(b)}var f=this,e=f.chart;!1!==c?n(f,"remove",null,d):d()},update:function(b,c){a.cleanRecursively(b,this.userOptions);var d=this,f=d.chart,g=d.userOptions,e=d.oldType||d.type,k=b.type||g.type||f.options.chart.type,h=t[e].prototype,m,x=["group","markerGroup","dataLabelsGroup"],r=["navigatorSeries","baseSeries"],u=d.finishedAnimating&&{animation:!1},z=["data","name","turboThreshold"],
v=Object.keys(b),F=0<v.length;v.forEach(function(a){-1===z.indexOf(a)&&(F=!1)});if(F)b.data&&this.setData(b.data,!1),b.name&&this.setName(b.name,!1);else{r=x.concat(r);r.forEach(function(a){r[a]=d[a];delete d[a]});b=p(g,u,{index:d.index,pointStart:l(g.pointStart,d.xData[0])},{data:d.options.data},b);d.remove(!1,null,!1);for(m in h)d[m]=void 0;t[k||e]?w(d,t[k||e].prototype):a.error(17,!0,f);r.forEach(function(a){d[a]=r[a]});d.init(f,b);b.zIndex!==g.zIndex&&x.forEach(function(a){d[a]&&d[a].attr({zIndex:b.zIndex})});
d.oldType=e;f.linkSeries()}n(this,"afterUpdate");l(c,!0)&&f.redraw(F?void 0:!1)},setName:function(a){this.name=this.options.name=this.userOptions.name=a;this.chart.isDirtyLegend=!0}});w(E.prototype,{update:function(a,c){var d=this.chart,f=a&&a.events||{};a=p(this.userOptions,a);d.options[this.coll].indexOf&&(d.options[this.coll][d.options[this.coll].indexOf(this.userOptions)]=a);b(d.options[this.coll].events,function(a,b){"undefined"===typeof f[b]&&(f[b]=void 0)});this.destroy(!0);this.init(d,w(a,
{events:f}));d.isDirtyBox=!0;l(c,!0)&&d.redraw()},remove:function(a){for(var b=this.chart,c=this.coll,d=this.series,f=d.length;f--;)d[f]&&d[f].remove(!1);v(b.axes,this);v(b[c],this);m(b.options[c])?b.options[c].splice(this.options.index,1):delete b.options[c];b[c].forEach(function(a,b){a.options.index=a.userOptions.index=b});this.destroy();b.isDirtyBox=!0;l(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}})})(J);(function(a){var y=
a.color,G=a.pick,E=a.Series,h=a.seriesType;h("area","line",{softThreshold:!1,threshold:0},{singleStacks:!1,getStackPoints:function(d){var h=[],u=[],v=this.xAxis,w=this.yAxis,n=w.stacks[this.stackKey],g={},c=this.index,m=w.series,p=m.length,b,l=G(w.options.reversedStacks,!0)?1:-1,f;d=d||this.points;if(this.options.stacking){for(f=0;f<d.length;f++)d[f].leftNull=d[f].rightNull=null,g[d[f].x]=d[f];a.objectEach(n,function(a,b){null!==a.total&&u.push(b)});u.sort(function(a,b){return a-b});b=m.map(function(a){return a.visible});
u.forEach(function(a,d){var m=0,t,x;if(g[a]&&!g[a].isNull)h.push(g[a]),[-1,1].forEach(function(k){var h=1===k?"rightNull":"leftNull",m=0,r=n[u[d+k]];if(r)for(f=c;0<=f&&f<p;)t=r.points[f],t||(f===c?g[a][h]=!0:b[f]&&(x=n[a].points[f])&&(m-=x[1]-x[0])),f+=l;g[a][1===k?"rightCliff":"leftCliff"]=m});else{for(f=c;0<=f&&f<p;){if(t=n[a].points[f]){m=t[1];break}f+=l}m=w.translate(m,0,1,0,1);h.push({isNull:!0,plotX:v.translate(a,0,0,0,1),x:a,plotY:m,yBottom:m})}})}return h},getGraphPath:function(a){var d=E.prototype.getGraphPath,
h=this.options,v=h.stacking,w=this.yAxis,n,g,c=[],m=[],p=this.index,b,l=w.stacks[this.stackKey],f=h.threshold,x=w.getThreshold(h.threshold),t,h=h.connectNulls||"percent"===v,H=function(d,g,k){var h=a[d];d=v&&l[h.x].points[p];var t=h[k+"Null"]||0;k=h[k+"Cliff"]||0;var n,e,h=!0;k||t?(n=(t?d[0]:d[1])+k,e=d[0]+k,h=!!t):!v&&a[g]&&a[g].isNull&&(n=e=f);void 0!==n&&(m.push({plotX:b,plotY:null===n?x:w.getThreshold(n),isNull:h,isCliff:!0}),c.push({plotX:b,plotY:null===e?x:w.getThreshold(e),doCurve:!1}))};a=
a||this.points;v&&(a=this.getStackPoints(a));for(n=0;n<a.length;n++)if(g=a[n].isNull,b=G(a[n].rectPlotX,a[n].plotX),t=G(a[n].yBottom,x),!g||h)h||H(n,n-1,"left"),g&&!v&&h||(m.push(a[n]),c.push({x:n,plotX:b,plotY:t})),h||H(n,n+1,"right");n=d.call(this,m,!0,!0);c.reversed=!0;g=d.call(this,c,!0,!0);g.length&&(g[0]="L");g=n.concat(g);d=d.call(this,m,!1,h);g.xMap=n.xMap;this.areaPath=g;return d},drawGraph:function(){this.areaPath=[];E.prototype.drawGraph.apply(this);var a=this,h=this.areaPath,u=this.options,
v=[["area","highcharts-area",this.color,u.fillColor]];this.zones.forEach(function(d,h){v.push(["zone-area-"+h,"highcharts-area highcharts-zone-area-"+h+" "+d.className,d.color||a.color,d.fillColor||u.fillColor])});v.forEach(function(d){var n=d[0],g=a[n];g?(g.endX=a.preventGraphAnimation?null:h.xMap,g.animate({d:h})):(g={zIndex:0},a.chart.styledMode||(g.fill=G(d[3],y(d[2]).setOpacity(G(u.fillOpacity,.75)).get())),g=a[n]=a.chart.renderer.path(h).addClass(d[1]).attr(g).add(a.group),g.isArea=!0);g.startX=
h.xMap;g.shiftUnit=u.step?2:1})},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle})})(J);(function(a){var y=a.pick;a=a.seriesType;a("spline","line",{},{getPointSpline:function(a,E,h){var d=E.plotX,r=E.plotY,u=a[h-1];h=a[h+1];var v,w,n,g;if(u&&!u.isNull&&!1!==u.doCurve&&!E.isCliff&&h&&!h.isNull&&!1!==h.doCurve&&!E.isCliff){a=u.plotY;n=h.plotX;h=h.plotY;var c=0;v=(1.5*d+u.plotX)/2.5;w=(1.5*r+a)/2.5;n=(1.5*d+n)/2.5;g=(1.5*r+h)/2.5;n!==v&&(c=(g-w)*(n-d)/(n-v)+r-g);w+=c;g+=c;w>a&&w>r?(w=Math.max(a,r),
g=2*r-w):w<a&&w<r&&(w=Math.min(a,r),g=2*r-w);g>h&&g>r?(g=Math.max(h,r),w=2*r-g):g<h&&g<r&&(g=Math.min(h,r),w=2*r-g);E.rightContX=n;E.rightContY=g}E=["C",y(u.rightContX,u.plotX),y(u.rightContY,u.plotY),y(v,d),y(w,r),d,r];u.rightContX=u.rightContY=null;return E}})})(J);(function(a){var y=a.seriesTypes.area.prototype,G=a.seriesType;G("areaspline","spline",a.defaultPlotOptions.area,{getStackPoints:y.getStackPoints,getGraphPath:y.getGraphPath,drawGraph:y.drawGraph,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle})})(J);
(function(a){var y=a.animObject,G=a.color,E=a.extend,h=a.defined,d=a.isNumber,r=a.merge,u=a.pick,v=a.Series,w=a.seriesType,n=a.svg;w("column","line",{borderRadius:0,crisp:!0,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{halo:!1,brightness:.1},select:{color:"#cccccc",borderColor:"#000000"}},dataLabels:{align:null,verticalAlign:null,y:null},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0,borderColor:"#ffffff"},
{cropShoulder:0,directTouch:!0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){v.prototype.init.apply(this,arguments);var a=this,c=a.chart;c.hasRendered&&c.series.forEach(function(c){c.type===a.type&&(c.isDirty=!0)})},getColumnMetrics:function(){var a=this,c=a.options,d=a.xAxis,h=a.yAxis,b=d.options.reversedStacks,b=d.reversed&&!b||!d.reversed&&b,l,f={},n=0;!1===c.grouping?n=1:a.chart.series.forEach(function(b){var c=b.options,d=b.yAxis,g;b.type!==a.type||!b.visible&&a.chart.options.chart.ignoreHiddenSeries||
h.len!==d.len||h.pos!==d.pos||(c.stacking?(l=b.stackKey,void 0===f[l]&&(f[l]=n++),g=f[l]):!1!==c.grouping&&(g=n++),b.columnIndex=g)});var t=Math.min(Math.abs(d.transA)*(d.ordinalSlope||c.pointRange||d.closestPointRange||d.tickInterval||1),d.len),r=t*c.groupPadding,v=(t-2*r)/(n||1),c=Math.min(c.maxPointWidth||d.len,u(c.pointWidth,v*(1-2*c.pointPadding)));a.columnMetrics={width:c,offset:(v-c)/2+(r+((a.columnIndex||0)+(b?1:0))*v-t/2)*(b?-1:1)};return a.columnMetrics},crispCol:function(a,c,d,h){var b=
this.chart,g=this.borderWidth,f=-(g%2?.5:0),g=g%2?.5:1;b.inverted&&b.renderer.isVML&&(g+=1);this.options.crisp&&(d=Math.round(a+d)+f,a=Math.round(a)+f,d-=a);h=Math.round(c+h)+g;f=.5>=Math.abs(c)&&.5<h;c=Math.round(c)+g;h-=c;f&&h&&(--c,h+=1);return{x:a,y:c,width:d,height:h}},translate:function(){var a=this,c=a.chart,d=a.options,p=a.dense=2>a.closestPointRange*a.xAxis.transA,p=a.borderWidth=u(d.borderWidth,p?0:1),b=a.yAxis,l=d.threshold,f=a.translatedThreshold=b.getThreshold(l),n=u(d.minPointLength,
5),t=a.getColumnMetrics(),r=t.width,F=a.barW=Math.max(r,1+2*p),z=a.pointXOffset=t.offset;c.inverted&&(f-=.5);d.pointPadding&&(F=Math.ceil(F));v.prototype.translate.apply(a);a.points.forEach(function(d){var g=u(d.yBottom,f),k=999+Math.abs(g),m=r,k=Math.min(Math.max(-k,d.plotY),b.len+k),e=d.plotX+z,q=F,p=Math.min(k,g),t,x=Math.max(k,g)-p;n&&Math.abs(x)<n&&(x=n,t=!b.reversed&&!d.negative||b.reversed&&d.negative,d.y===l&&a.dataMax<=l&&b.min<l&&(t=!t),p=Math.abs(p-f)>n?g-n:f-(t?n:0));h(d.options.pointWidth)&&
(m=q=Math.ceil(d.options.pointWidth),e-=Math.round((m-r)/2));d.barX=e;d.pointWidth=m;d.tooltipPos=c.inverted?[b.len+b.pos-c.plotLeft-k,a.xAxis.len-e-q/2,x]:[e+q/2,k+b.pos-c.plotTop,x];d.shapeType=d.shapeType||"rect";d.shapeArgs=a.crispCol.apply(a,d.isNull?[e,f,q,0]:[e,p,q,x])})},getSymbol:a.noop,drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,drawGraph:function(){this.group[this.dense?"addClass":"removeClass"]("highcharts-dense-data")},pointAttribs:function(a,c){var d=this.options,g,b=this.pointAttrToOptions||
{};g=b.stroke||"borderColor";var l=b["stroke-width"]||"borderWidth",f=a&&a.color||this.color,h=a&&a[g]||d[g]||this.color||f,t=a&&a[l]||d[l]||this[l]||0,b=d.dashStyle;a&&this.zones.length&&(f=a.getZone(),f=a.options.color||f&&f.color||this.color);c&&(a=r(d.states[c],a.options.states&&a.options.states[c]||{}),c=a.brightness,f=a.color||void 0!==c&&G(f).brighten(a.brightness).get()||f,h=a[g]||h,t=a[l]||t,b=a.dashStyle||b);g={fill:f,stroke:h,"stroke-width":t};b&&(g.dashstyle=b);return g},drawPoints:function(){var a=
this,c=this.chart,h=a.options,p=c.renderer,b=h.animationLimit||250,l;a.points.forEach(function(f){var g=f.graphic,m=g&&c.pointCount<b?"animate":"attr";if(d(f.plotY)&&null!==f.y){l=f.shapeArgs;if(g)g[m](r(l));else f.graphic=g=p[f.shapeType](l).add(f.group||a.group);h.borderRadius&&g.attr({r:h.borderRadius});c.styledMode||g[m](a.pointAttribs(f,f.selected&&"select")).shadow(h.shadow,null,h.stacking&&!h.borderRadius);g.addClass(f.getClassName(),!0)}else g&&(f.graphic=g.destroy())})},animate:function(a){var c=
this,d=this.yAxis,g=c.options,b=this.chart.inverted,h={},f=b?"translateX":"translateY",x;n&&(a?(h.scaleY=.001,a=Math.min(d.pos+d.len,Math.max(d.pos,d.toPixels(g.threshold))),b?h.translateX=a-d.len:h.translateY=a,c.group.attr(h)):(x=c.group.attr(f),c.group.animate({scaleY:1},E(y(c.options.animation),{step:function(a,b){h[f]=x+b.pos*(d.pos-x);c.group.attr(h)}})),c.animate=null))},remove:function(){var a=this,c=a.chart;c.hasRendered&&c.series.forEach(function(c){c.type===a.type&&(c.isDirty=!0)});v.prototype.remove.apply(a,
arguments)}})})(J);(function(a){a=a.seriesType;a("bar","column",null,{inverted:!0})})(J);(function(a){var y=a.Series;a=a.seriesType;a("scatter","line",{lineWidth:0,findNearestPointBy:"xy",marker:{enabled:!0},tooltip:{headerFormat:'\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cspan style\x3d"font-size: 10px"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e',pointFormat:"x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e"}},{sorted:!1,requireSorting:!1,
noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1,drawGraph:function(){this.options.lineWidth&&y.prototype.drawGraph.call(this)}})})(J);(function(a){var y=a.deg2rad,G=a.isNumber,E=a.pick,h=a.relativeLength;a.CenteredSeriesMixin={getCenter:function(){var a=this.options,r=this.chart,u=2*(a.slicedOffset||0),v=r.plotWidth-2*u,r=r.plotHeight-2*u,w=a.center,w=[E(w[0],"50%"),E(w[1],"50%"),a.size||"100%",a.innerSize||0],n=Math.min(v,r),g,c;for(g=0;4>g;++g)c=
w[g],a=2>g||2===g&&/%$/.test(c),w[g]=h(c,[v,r,n,w[2]][g])+(a?u:0);w[3]>w[2]&&(w[3]=w[2]);return w},getStartAndEndRadians:function(a,h){a=G(a)?a:0;h=G(h)&&h>a&&360>h-a?h:a+360;return{start:y*(a+-90),end:y*(h+-90)}}}})(J);(function(a){var y=a.addEvent,G=a.CenteredSeriesMixin,E=a.defined,h=a.extend,d=G.getStartAndEndRadians,r=a.noop,u=a.pick,v=a.Point,w=a.Series,n=a.seriesType,g=a.setAnimation;n("pie","line",{center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{allowOverlap:!0,connectorPadding:5,distance:30,
enabled:!0,formatter:function(){return this.point.isNull?void 0:this.point.name},softConnector:!0,x:0,connectorShape:"fixedOffset",crookDistance:"70%"},ignoreHiddenPoint:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,stickyTracking:!1,tooltip:{followPointer:!0},borderColor:"#ffffff",borderWidth:1,states:{hover:{brightness:.1}}},{isCartesian:!1,requireSorting:!1,directTouch:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttribs:a.seriesTypes.column.prototype.pointAttribs,
animate:function(a){var c=this,d=c.points,b=c.startAngleRad;a||(d.forEach(function(a){var d=a.graphic,g=a.shapeArgs;d&&(d.attr({r:a.startR||c.center[3]/2,start:b,end:b}),d.animate({r:g.r,start:g.start,end:g.end},c.options.animation))}),c.animate=null)},updateTotals:function(){var a,d=0,g=this.points,b=g.length,h,f=this.options.ignoreHiddenPoint;for(a=0;a<b;a++)h=g[a],d+=f&&!h.visible?0:h.isNull?0:h.y;this.total=d;for(a=0;a<b;a++)h=g[a],h.percentage=0<d&&(h.visible||!f)?h.y/d*100:0,h.total=d},generatePoints:function(){w.prototype.generatePoints.call(this);
this.updateTotals()},getX:function(a,d,g){var b=this.center,c=this.radii?this.radii[g.index]:b[2]/2;return b[0]+(d?-1:1)*Math.cos(Math.asin(Math.max(Math.min((a-b[1])/(c+g.labelDistance),1),-1)))*(c+g.labelDistance)+(0<g.labelDistance?(d?-1:1)*this.options.dataLabels.padding:0)},translate:function(a){this.generatePoints();var c=0,g=this.options,b=g.slicedOffset,h=b+(g.borderWidth||0),f,n,t=d(g.startAngle,g.endAngle),r=this.startAngleRad=t.start,t=(this.endAngleRad=t.end)-r,v=this.points,z,k,A=g.dataLabels.distance,
g=g.ignoreHiddenPoint,w,C=v.length,e;a||(this.center=a=this.getCenter());for(w=0;w<C;w++){e=v[w];e.labelDistance=u(e.options.dataLabels&&e.options.dataLabels.distance,A);this.maxLabelDistance=Math.max(this.maxLabelDistance||0,e.labelDistance);f=r+c*t;if(!g||e.visible)c+=e.percentage/100;n=r+c*t;e.shapeType="arc";e.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:Math.round(1E3*f)/1E3,end:Math.round(1E3*n)/1E3};n=(n+f)/2;n>1.5*Math.PI?n-=2*Math.PI:n<-Math.PI/2&&(n+=2*Math.PI);e.slicedTranslation=
{translateX:Math.round(Math.cos(n)*b),translateY:Math.round(Math.sin(n)*b)};z=Math.cos(n)*a[2]/2;k=Math.sin(n)*a[2]/2;e.tooltipPos=[a[0]+.7*z,a[1]+.7*k];e.half=n<-Math.PI/2||n>Math.PI/2?1:0;e.angle=n;f=Math.min(h,e.labelDistance/5);e.labelPosition={natural:{x:a[0]+z+Math.cos(n)*e.labelDistance,y:a[1]+k+Math.sin(n)*e.labelDistance},final:{},alignment:0>e.labelDistance?"center":e.half?"right":"left",connectorPosition:{breakAt:{x:a[0]+z+Math.cos(n)*f,y:a[1]+k+Math.sin(n)*f},touchingSliceAt:{x:a[0]+z,
y:a[1]+k}}}}},drawGraph:null,drawPoints:function(){var a=this,d=a.chart,g=d.renderer,b,l,f,n,t=a.options.shadow;!t||a.shadowGroup||d.styledMode||(a.shadowGroup=g.g("shadow").add(a.group));a.points.forEach(function(c){l=c.graphic;if(c.isNull)l&&(c.graphic=l.destroy());else{n=c.shapeArgs;b=c.getTranslate();if(!d.styledMode){var m=c.shadowGroup;t&&!m&&(m=c.shadowGroup=g.g("shadow").add(a.shadowGroup));m&&m.attr(b);f=a.pointAttribs(c,c.selected&&"select")}l?(l.setRadialReference(a.center),d.styledMode||
l.attr(f),l.animate(h(n,b))):(c.graphic=l=g[c.shapeType](n).setRadialReference(a.center).attr(b).add(a.group),d.styledMode||l.attr(f).attr({"stroke-linejoin":"round"}).shadow(t,m));l.attr({visibility:c.visible?"inherit":"hidden"});l.addClass(c.getClassName())}})},searchPoint:r,sortByAngle:function(a,d){a.sort(function(a,b){return void 0!==a.angle&&(b.angle-a.angle)*d})},drawLegendSymbol:a.LegendSymbolMixin.drawRectangle,getCenter:G.getCenter,getSymbol:r},{init:function(){v.prototype.init.apply(this,
arguments);var a=this,d;a.name=u(a.name,"Slice");d=function(c){a.slice("select"===c.type)};y(a,"select",d);y(a,"unselect",d);return a},isValid:function(){return a.isNumber(this.y,!0)&&0<=this.y},setVisible:function(a,d){var c=this,b=c.series,g=b.chart,f=b.options.ignoreHiddenPoint;d=u(d,f);a!==c.visible&&(c.visible=c.options.visible=a=void 0===a?!c.visible:a,b.options.data[b.data.indexOf(c)]=c.options,["graphic","dataLabel","connector","shadowGroup"].forEach(function(b){if(c[b])c[b][a?"show":"hide"](!0)}),
c.legendItem&&g.legend.colorizeItem(c,a),a||"hover"!==c.state||c.setState(""),f&&(b.isDirty=!0),d&&g.redraw())},slice:function(a,d,h){var b=this.series;g(h,b.chart);u(d,!0);this.sliced=this.options.sliced=E(a)?a:!this.sliced;b.options.data[b.data.indexOf(this)]=this.options;this.graphic.animate(this.getTranslate());this.shadowGroup&&this.shadowGroup.animate(this.getTranslate())},getTranslate:function(){return this.sliced?this.slicedTranslation:{translateX:0,translateY:0}},haloPath:function(a){var c=
this.shapeArgs;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(c.x,c.y,c.r+a,c.r+a,{innerR:this.shapeArgs.r-1,start:c.start,end:c.end})},connectorShapes:{fixedOffset:function(a,d,g){var b=d.breakAt;d=d.touchingSliceAt;return["M",a.x,a.y].concat(g.softConnector?["C",a.x+("left"===a.alignment?-5:5),a.y,2*b.x-d.x,2*b.y-d.y,b.x,b.y]:["L",b.x,b.y]).concat(["L",d.x,d.y])},straight:function(a,d){d=d.touchingSliceAt;return["M",a.x,a.y,"L",d.x,d.y]},crookedLine:function(c,d,g){d=
d.touchingSliceAt;var b=this.series,h=b.center[0],f=b.chart.plotWidth,m=b.chart.plotLeft,b=c.alignment,t=this.shapeArgs.r;g=a.relativeLength(g.crookDistance,1);g="left"===b?h+t+(f+m-h-t)*(1-g):m+(h-t)*g;h=["L",g,c.y];if("left"===b?g>c.x||g<d.x:g<c.x||g>d.x)h=[];return["M",c.x,c.y].concat(h).concat(["L",d.x,d.y])}},getConnectorPath:function(){var a=this.labelPosition,d=this.series.options.dataLabels,g=d.connectorShape,b=this.connectorShapes;b[g]&&(g=b[g]);return g.call(this,{x:a.final.x,y:a.final.y,
alignment:a.alignment},a.connectorPosition,d)}})})(J);(function(a){var y=a.addEvent,G=a.arrayMax,E=a.defined,h=a.extend,d=a.format,r=a.merge,u=a.noop,v=a.pick,w=a.relativeLength,n=a.Series,g=a.seriesTypes,c=a.stableSort,m=a.isArray,p=a.splat;a.distribute=function(b,d,f){function g(a,b){return a.target-b.target}var h,l=!0,m=b,p=[],k;k=0;var n=m.reducedLen||d;for(h=b.length;h--;)k+=b[h].size;if(k>n){c(b,function(a,b){return(b.rank||0)-(a.rank||0)});for(k=h=0;k<=n;)k+=b[h].size,h++;p=b.splice(h-1,b.length)}c(b,
g);for(b=b.map(function(a){return{size:a.size,targets:[a.target],align:v(a.align,.5)}});l;){for(h=b.length;h--;)l=b[h],k=(Math.min.apply(0,l.targets)+Math.max.apply(0,l.targets))/2,l.pos=Math.min(Math.max(0,k-l.size*l.align),d-l.size);h=b.length;for(l=!1;h--;)0<h&&b[h-1].pos+b[h-1].size>b[h].pos&&(b[h-1].size+=b[h].size,b[h-1].targets=b[h-1].targets.concat(b[h].targets),b[h-1].align=.5,b[h-1].pos+b[h-1].size>d&&(b[h-1].pos=d-b[h-1].size),b.splice(h,1),l=!0)}m.push.apply(m,p);h=0;b.some(function(b){var c=
0;if(b.targets.some(function(){m[h].pos=b.pos+c;if(Math.abs(m[h].pos-m[h].target)>f)return m.slice(0,h+1).forEach(function(a){delete a.pos}),m.reducedLen=(m.reducedLen||d)-.1*d,m.reducedLen>.1*d&&a.distribute(m,d,f),!0;c+=m[h].size;h++}))return!0});c(m,g)};n.prototype.drawDataLabels=function(){function b(a,b){var d=b.filter;return d?(b=d.operator,a=a[d.property],d=d.value,"\x3e"===b&&a>d||"\x3c"===b&&a<d||"\x3e\x3d"===b&&a>=d||"\x3c\x3d"===b&&a<=d||"\x3d\x3d"===b&&a==d||"\x3d\x3d\x3d"===b&&a===d?
!0:!1):!0}function c(a,b){var d=[],c;if(m(a)&&!m(b))d=a.map(function(a){return r(a,b)});else if(m(b)&&!m(a))d=b.map(function(b){return r(a,b)});else if(m(a)||m(b))for(c=Math.max(a.length,b.length);c--;)d[c]=r(a[c],b[c]);else d=r(a,b);return d}var f=this,g=f.chart,h=f.options,n=h.dataLabels,u=f.points,z,k=f.hasRendered||0,A,w=v(n.defer,!!h.animation),C=g.renderer,n=c(c(g.options.plotOptions&&g.options.plotOptions.series&&g.options.plotOptions.series.dataLabels,g.options.plotOptions&&g.options.plotOptions[f.type]&&
g.options.plotOptions[f.type].dataLabels),n);a.fireEvent(this,"drawDataLabels");if(m(n)||n.enabled||f._hasPointLabels)A=f.plotGroup("dataLabelsGroup","data-labels",w&&!k?"hidden":"visible",n.zIndex||6),w&&(A.attr({opacity:+k}),k||y(f,"afterAnimate",function(){f.visible&&A.show(!0);A[h.animation?"animate":"attr"]({opacity:1},{duration:200})})),u.forEach(function(e){z=p(c(n,e.dlOptions||e.options&&e.options.dataLabels));z.forEach(function(c,k){var l=c.enabled&&!e.isNull&&b(e,c),m,q,t,p,n=e.dataLabels?
e.dataLabels[k]:e.dataLabel,r=e.connectors?e.connectors[k]:e.connector,u=!n;l&&(m=e.getLabelConfig(),q=c[e.formatPrefix+"Format"]||c.format,m=E(q)?d(q,m,g.time):(c[e.formatPrefix+"Formatter"]||c.formatter).call(m,c),q=c.style,t=c.rotation,g.styledMode||(q.color=v(c.color,q.color,f.color,"#000000"),"contrast"===q.color&&(e.contrastColor=C.getContrast(e.color||f.color),q.color=c.inside||0>v(c.distance,e.labelDistance)||h.stacking?e.contrastColor:"#000000"),h.cursor&&(q.cursor=h.cursor)),p={r:c.borderRadius||
0,rotation:t,padding:c.padding,zIndex:1},g.styledMode||(p.fill=c.backgroundColor,p.stroke=c.borderColor,p["stroke-width"]=c.borderWidth),a.objectEach(p,function(a,b){void 0===a&&delete p[b]}));!n||l&&E(m)?l&&E(m)&&(n?p.text=m:(e.dataLabels=e.dataLabels||[],n=e.dataLabels[k]=t?C.text(m,0,-9999).addClass("highcharts-data-label"):C.label(m,0,-9999,c.shape,null,null,c.useHTML,null,"data-label"),k||(e.dataLabel=n),n.addClass(" highcharts-data-label-color-"+e.colorIndex+" "+(c.className||"")+(c.useHTML?
" highcharts-tracker":""))),n.options=c,n.attr(p),g.styledMode||n.css(q).shadow(c.shadow),n.added||n.add(A),f.alignDataLabel(e,n,c,null,u)):(e.dataLabel=e.dataLabel&&e.dataLabel.destroy(),e.dataLabels&&(1===e.dataLabels.length?delete e.dataLabels:delete e.dataLabels[k]),k||delete e.dataLabel,r&&(e.connector=e.connector.destroy(),e.connectors&&(1===e.connectors.length?delete e.connectors:delete e.connectors[k])))})});a.fireEvent(this,"afterDrawDataLabels")};n.prototype.alignDataLabel=function(a,c,
d,g,m){var b=this.chart,f=this.isCartesian&&b.inverted,l=v(a.dlBox&&a.dlBox.centerX,a.plotX,-9999),k=v(a.plotY,-9999),n=c.getBBox(),p,t=d.rotation,e=d.align,q=this.visible&&(a.series.forceDL||b.isInsidePlot(l,Math.round(k),f)||g&&b.isInsidePlot(l,f?g.x+1:g.y+g.height-1,f)),r="justify"===v(d.overflow,"justify");if(q&&(p=b.renderer.fontMetrics(b.styledMode?void 0:d.style.fontSize,c).b,g=h({x:f?this.yAxis.len-k:l,y:Math.round(f?this.xAxis.len-l:k),width:0,height:0},g),h(d,{width:n.width,height:n.height}),
t?(r=!1,l=b.renderer.rotCorr(p,t),l={x:g.x+d.x+g.width/2+l.x,y:g.y+d.y+{top:0,middle:.5,bottom:1}[d.verticalAlign]*g.height},c[m?"attr":"animate"](l).attr({align:e}),k=(t+720)%360,k=180<k&&360>k,"left"===e?l.y-=k?n.height:0:"center"===e?(l.x-=n.width/2,l.y-=n.height/2):"right"===e&&(l.x-=n.width,l.y-=k?0:n.height),c.placed=!0,c.alignAttr=l):(c.align(d,null,g),l=c.alignAttr),r&&0<=g.height?a.isLabelJustified=this.justifyDataLabel(c,d,l,n,g,m):v(d.crop,!0)&&(q=b.isInsidePlot(l.x,l.y)&&b.isInsidePlot(l.x+
n.width,l.y+n.height)),d.shape&&!t))c[m?"attr":"animate"]({anchorX:f?b.plotWidth-a.plotY:a.plotX,anchorY:f?b.plotHeight-a.plotX:a.plotY});q||(c.attr({y:-9999}),c.placed=!1)};n.prototype.justifyDataLabel=function(a,c,d,g,h,m){var b=this.chart,f=c.align,k=c.verticalAlign,l,n,p=a.box?0:a.padding||0;l=d.x+p;0>l&&("right"===f?c.align="left":c.x=-l,n=!0);l=d.x+g.width-p;l>b.plotWidth&&("left"===f?c.align="right":c.x=b.plotWidth-l,n=!0);l=d.y+p;0>l&&("bottom"===k?c.verticalAlign="top":c.y=-l,n=!0);l=d.y+
g.height-p;l>b.plotHeight&&("top"===k?c.verticalAlign="bottom":c.y=b.plotHeight-l,n=!0);n&&(a.placed=!m,a.align(c,null,h));return n};g.pie&&(g.pie.prototype.dataLabelPositioners={radialDistributionY:function(a){return a.top+a.distributeBox.pos},radialDistributionX:function(a,c,d,g){return a.getX(d<c.top+2||d>c.bottom-2?g:d,c.half,c)},justify:function(a,c,d){return d[0]+(a.half?-1:1)*(c+a.labelDistance)},alignToPlotEdges:function(a,c,d,g){a=a.getBBox().width;return c?a+g:d-a-g},alignToConnectors:function(a,
c,d,g){var b=0,f;a.forEach(function(a){f=a.dataLabel.getBBox().width;f>b&&(b=f)});return c?b+g:d-b-g}},g.pie.prototype.drawDataLabels=function(){var b=this,c=b.data,d,g=b.chart,h=b.options.dataLabels,m=h.connectorPadding,p=v(h.connectorWidth,1),r=g.plotWidth,k=g.plotHeight,u=g.plotLeft,w=Math.round(g.chartWidth/3),y,e=b.center,q=e[2]/2,L=e[1],I,J,K,M,S=[[],[]],B,N,P,T,Q=[0,0,0,0],O=b.dataLabelPositioners;b.visible&&(h.enabled||b._hasPointLabels)&&(c.forEach(function(a){a.dataLabel&&a.visible&&a.dataLabel.shortened&&
(a.dataLabel.attr({width:"auto"}).css({width:"auto",textOverflow:"clip"}),a.dataLabel.shortened=!1)}),n.prototype.drawDataLabels.apply(b),c.forEach(function(a){a.dataLabel&&(a.visible?(S[a.half].push(a),a.dataLabel._pos=null,!E(h.style.width)&&!E(a.options.dataLabels&&a.options.dataLabels.style&&a.options.dataLabels.style.width)&&a.dataLabel.getBBox().width>w&&(a.dataLabel.css({width:.7*w}),a.dataLabel.shortened=!0)):(a.dataLabel=a.dataLabel.destroy(),a.dataLabels&&1===a.dataLabels.length&&delete a.dataLabels))}),
S.forEach(function(c,f){var l,n,p=c.length,t=[],x;if(p)for(b.sortByAngle(c,f-.5),0<b.maxLabelDistance&&(l=Math.max(0,L-q-b.maxLabelDistance),n=Math.min(L+q+b.maxLabelDistance,g.plotHeight),c.forEach(function(a){0<a.labelDistance&&a.dataLabel&&(a.top=Math.max(0,L-q-a.labelDistance),a.bottom=Math.min(L+q+a.labelDistance,g.plotHeight),x=a.dataLabel.getBBox().height||21,a.distributeBox={target:a.labelPosition.natural.y-a.top+x/2,size:x,rank:a.y},t.push(a.distributeBox))}),l=n+x-l,a.distribute(t,l,l/5)),
T=0;T<p;T++){d=c[T];K=d.labelPosition;I=d.dataLabel;P=!1===d.visible?"hidden":"inherit";N=l=K.natural.y;t&&E(d.distributeBox)&&(void 0===d.distributeBox.pos?P="hidden":(M=d.distributeBox.size,N=O.radialDistributionY(d)));delete d.positionIndex;if(h.justify)B=O.justify(d,q,e);else switch(h.alignTo){case "connectors":B=O.alignToConnectors(c,f,r,u);break;case "plotEdges":B=O.alignToPlotEdges(I,f,r,u);break;default:B=O.radialDistributionX(b,d,N,l)}I._attr={visibility:P,align:K.alignment};I._pos={x:B+
h.x+({left:m,right:-m}[K.alignment]||0),y:N+h.y-10};K.final.x=B;K.final.y=N;v(h.crop,!0)&&(J=I.getBBox().width,l=null,B-J<m&&1===f?(l=Math.round(J-B+m),Q[3]=Math.max(l,Q[3])):B+J>r-m&&0===f&&(l=Math.round(B+J-r+m),Q[1]=Math.max(l,Q[1])),0>N-M/2?Q[0]=Math.max(Math.round(-N+M/2),Q[0]):N+M/2>k&&(Q[2]=Math.max(Math.round(N+M/2-k),Q[2])),I.sideOverflow=l)}}),0===G(Q)||this.verifyDataLabelOverflow(Q))&&(this.placeDataLabels(),p&&this.points.forEach(function(a){var c;y=a.connector;if((I=a.dataLabel)&&I._pos&&
a.visible&&0<a.labelDistance){P=I._attr.visibility;if(c=!y)a.connector=y=g.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-"+a.colorIndex+(a.className?" "+a.className:"")).add(b.dataLabelsGroup),g.styledMode||y.attr({"stroke-width":p,stroke:h.connectorColor||a.color||"#666666"});y[c?"attr":"animate"]({d:a.getConnectorPath()});y.attr("visibility",P)}else y&&(a.connector=y.destroy())}))},g.pie.prototype.placeDataLabels=function(){this.points.forEach(function(a){var b=a.dataLabel;
b&&a.visible&&((a=b._pos)?(b.sideOverflow&&(b._attr.width=b.getBBox().width-b.sideOverflow,b.css({width:b._attr.width+"px",textOverflow:(this.options.dataLabels.style||{}).textOverflow||"ellipsis"}),b.shortened=!0),b.attr(b._attr),b[b.moved?"animate":"attr"](a),b.moved=!0):b&&b.attr({y:-9999}))},this)},g.pie.prototype.alignDataLabel=u,g.pie.prototype.verifyDataLabelOverflow=function(a){var b=this.center,c=this.options,d=c.center,g=c.minSize||80,h,m=null!==c.size;m||(null!==d[0]?h=Math.max(b[2]-Math.max(a[1],
a[3]),g):(h=Math.max(b[2]-a[1]-a[3],g),b[0]+=(a[3]-a[1])/2),null!==d[1]?h=Math.max(Math.min(h,b[2]-Math.max(a[0],a[2])),g):(h=Math.max(Math.min(h,b[2]-a[0]-a[2]),g),b[1]+=(a[0]-a[2])/2),h<b[2]?(b[2]=h,b[3]=Math.min(w(c.innerSize||0,h),h),this.translate(b),this.drawDataLabels&&this.drawDataLabels()):m=!0);return m});g.column&&(g.column.prototype.alignDataLabel=function(a,c,d,g,h){var b=this.chart.inverted,f=a.series,l=a.dlBox||a.shapeArgs,k=v(a.below,a.plotY>v(this.translatedThreshold,f.yAxis.len)),
m=v(d.inside,!!this.options.stacking);l&&(g=r(l),0>g.y&&(g.height+=g.y,g.y=0),l=g.y+g.height-f.yAxis.len,0<l&&(g.height-=l),b&&(g={x:f.yAxis.len-g.y-g.height,y:f.xAxis.len-g.x-g.width,width:g.height,height:g.width}),m||(b?(g.x+=k?0:g.width,g.width=0):(g.y+=k?g.height:0,g.height=0)));d.align=v(d.align,!b||m?"center":k?"right":"left");d.verticalAlign=v(d.verticalAlign,b||m?"middle":k?"top":"bottom");n.prototype.alignDataLabel.call(this,a,c,d,g,h);a.isLabelJustified&&a.contrastColor&&c.css({color:a.contrastColor})})})(J);
(function(a){var y=a.Chart,G=a.isArray,E=a.objectEach,h=a.pick,d=a.addEvent,r=a.fireEvent;d(y,"render",function(){var a=[];(this.labelCollectors||[]).forEach(function(d){a=a.concat(d())});(this.yAxis||[]).forEach(function(d){d.options.stackLabels&&!d.options.stackLabels.allowOverlap&&E(d.stacks,function(d){E(d,function(d){a.push(d.label)})})});(this.series||[]).forEach(function(d){var r=d.options.dataLabels;d.visible&&(!1!==r.enabled||d._hasPointLabels)&&d.points.forEach(function(d){d.visible&&(G(d.dataLabels)?
d.dataLabels:d.dataLabel?[d.dataLabel]:[]).forEach(function(g){var c=g.options;g.labelrank=h(c.labelrank,d.labelrank,d.shapeArgs&&d.shapeArgs.height);c.allowOverlap||a.push(g)})})});this.hideOverlappingLabels(a)});y.prototype.hideOverlappingLabels=function(a){var d=this,h=a.length,n=d.renderer,g,c,m,p,b,l,f=function(a,b,d,c,f,g,h,l){return!(f>a+d||f+h<a||g>b+c||g+l<b)};m=function(a){var b,d,c,f=a.box?0:a.padding||0;c=0;if(a&&(!a.alignAttr||a.placed))return b=a.alignAttr||{x:a.attr("x"),y:a.attr("y")},
d=a.parentGroup,a.width||(c=a.getBBox(),a.width=c.width,a.height=c.height,c=n.fontMetrics(null,a.element).h),{x:b.x+(d.translateX||0)+f,y:b.y+(d.translateY||0)+f-c,width:a.width-2*f,height:a.height-2*f}};for(c=0;c<h;c++)if(g=a[c])g.oldOpacity=g.opacity,g.newOpacity=1,g.absoluteBox=m(g);a.sort(function(a,b){return(b.labelrank||0)-(a.labelrank||0)});for(c=0;c<h;c++)for(l=(m=a[c])&&m.absoluteBox,g=c+1;g<h;++g)if(b=(p=a[g])&&p.absoluteBox,l&&b&&m!==p&&0!==m.newOpacity&&0!==p.newOpacity&&(b=f(l.x,l.y,
l.width,l.height,b.x,b.y,b.width,b.height)))(m.labelrank<p.labelrank?m:p).newOpacity=0;a.forEach(function(a){var b,c;a&&(c=a.newOpacity,a.oldOpacity!==c&&(a.alignAttr&&a.placed?(c?a.show(!0):b=function(){a.hide()},a.alignAttr.opacity=c,a[a.isOld?"animate":"attr"](a.alignAttr,null,b),r(d,"afterHideOverlappingLabels")):a.attr({opacity:c})),a.isOld=!0)})}})(J);(function(a){var y=a.addEvent,G=a.Chart,E=a.createElement,h=a.css,d=a.defaultOptions,r=a.defaultPlotOptions,u=a.extend,v=a.fireEvent,w=a.hasTouch,
n=a.isObject,g=a.Legend,c=a.merge,m=a.pick,p=a.Point,b=a.Series,l=a.seriesTypes,f=a.svg,x;x=a.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,d=b.pointer,c=function(a){var b=d.getPointFromEvent(a);void 0!==b&&(d.isDirectTouch=!0,b.onMouseOver(a))};a.points.forEach(function(a){a.graphic&&(a.graphic.element.point=a);a.dataLabel&&(a.dataLabel.div?a.dataLabel.div.point=a:a.dataLabel.element.point=a)});a._hasTracking||(a.trackerGroups.forEach(function(f){if(a[f]){a[f].addClass("highcharts-tracker").on("mouseover",
c).on("mouseout",function(a){d.onTrackerMouseOut(a)});if(w)a[f].on("touchstart",c);!b.styledMode&&a.options.cursor&&a[f].css(h).css({cursor:a.options.cursor})}}),a._hasTracking=!0);v(this,"afterDrawTracker")},drawTrackerGraph:function(){var a=this,b=a.options,d=b.trackByArea,c=[].concat(d?a.areaPath:a.graphPath),g=c.length,h=a.chart,l=h.pointer,m=h.renderer,e=h.options.tooltip.snap,q=a.tracker,p,n=function(){if(h.hoverSeries!==a)a.onMouseOver()},r="rgba(192,192,192,"+(f?.0001:.002)+")";if(g&&!d)for(p=
g+1;p--;)"M"===c[p]&&c.splice(p+1,0,c[p+1]-e,c[p+2],"L"),(p&&"M"===c[p]||p===g)&&c.splice(p,0,"L",c[p-2]+e,c[p-1]);q?q.attr({d:c}):a.graph&&(a.tracker=m.path(c).attr({visibility:a.visible?"visible":"hidden",zIndex:2}).addClass(d?"highcharts-tracker-area":"highcharts-tracker-line").add(a.group),h.styledMode||a.tracker.attr({"stroke-linejoin":"round",stroke:r,fill:d?r:"none","stroke-width":a.graph.strokeWidth()+(d?0:2*e)}),[a.tracker,a.markerGroup].forEach(function(a){a.addClass("highcharts-tracker").on("mouseover",
n).on("mouseout",function(a){l.onTrackerMouseOut(a)});b.cursor&&!h.styledMode&&a.css({cursor:b.cursor});if(w)a.on("touchstart",n)}));v(this,"afterDrawTracker")}};l.column&&(l.column.prototype.drawTracker=x.drawTrackerPoint);l.pie&&(l.pie.prototype.drawTracker=x.drawTrackerPoint);l.scatter&&(l.scatter.prototype.drawTracker=x.drawTrackerPoint);u(g.prototype,{setItemEvents:function(a,b,d){var f=this,g=f.chart.renderer.boxWrapper,h="highcharts-legend-"+(a instanceof p?"point":"series")+"-active",l=f.chart.styledMode;
(d?b:a.legendGroup).on("mouseover",function(){a.setState("hover");g.addClass(h);l||b.css(f.options.itemHoverStyle)}).on("mouseout",function(){f.styledMode||b.css(c(a.visible?f.itemStyle:f.itemHiddenStyle));g.removeClass(h);a.setState()}).on("click",function(b){var d=function(){a.setVisible&&a.setVisible()};g.removeClass(h);b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,d):v(a,"legendItemClick",b,d)})},createCheckboxForItem:function(a){a.checkbox=E("input",{type:"checkbox",
className:"highcharts-legend-checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);y(a.checkbox,"click",function(b){v(a.series||a,"checkboxClick",{checked:b.target.checked,item:a},function(){a.select()})})}});u(G.prototype,{showResetZoom:function(){function a(){b.zoomOut()}var b=this,c=d.lang,f=b.options.chart.resetZoomButton,g=f.theme,h=g.states,l="chart"===f.relativeTo?null:"plotBox";v(this,"beforeShowResetZoom",null,function(){b.resetZoomButton=
b.renderer.button(c.resetZoom,null,null,a,g,h&&h.hover).attr({align:f.position.align,title:c.resetZoomTitle}).addClass("highcharts-reset-zoom").add().align(f.position,!1,l)})},zoomOut:function(){v(this,"selection",{resetSelection:!0},this.zoom)},zoom:function(a){var b,d=this.pointer,c=!1,f;!a||a.resetSelection?(this.axes.forEach(function(a){b=a.zoom()}),d.initiated=!1):a.xAxis.concat(a.yAxis).forEach(function(a){var f=a.axis;d[f.isXAxis?"zoomX":"zoomY"]&&(b=f.zoom(a.min,a.max),f.displayBtn&&(c=!0))});
f=this.resetZoomButton;c&&!f?this.showResetZoom():!c&&n(f)&&(this.resetZoomButton=f.destroy());b&&this.redraw(m(this.options.chart.animation,a&&a.animation,100>this.pointCount))},pan:function(a,b){var c=this,d=c.hoverPoints,f;d&&d.forEach(function(a){a.setState()});("xy"===b?[1,0]:[1]).forEach(function(b){b=c[b?"xAxis":"yAxis"][0];var d=b.horiz,g=a[d?"chartX":"chartY"],d=d?"mouseDownX":"mouseDownY",e=c[d],h=(b.pointRange||0)/2,k=b.reversed&&!c.inverted||!b.reversed&&c.inverted?-1:1,l=b.getExtremes(),
m=b.toValue(e-g,!0)+h*k,k=b.toValue(e+b.len-g,!0)-h*k,p=k<m,e=p?k:m,m=p?m:k,k=Math.min(l.dataMin,h?l.min:b.toValue(b.toPixels(l.min)-b.minPixelPadding)),h=Math.max(l.dataMax,h?l.max:b.toValue(b.toPixels(l.max)+b.minPixelPadding)),p=k-e;0<p&&(m+=p,e=k);p=m-h;0<p&&(m=h,e-=p);b.series.length&&e!==l.min&&m!==l.max&&(b.setExtremes(e,m,!1,!1,{trigger:"pan"}),f=!0);c[d]=g});f&&c.redraw(!1);h(c.container,{cursor:"move"})}});u(p.prototype,{select:function(a,b){var c=this,d=c.series,f=d.chart;a=m(a,!c.selected);
c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;d.options.data[d.data.indexOf(c)]=c.options;c.setState(a&&"select");b||f.getSelectedPoints().forEach(function(a){a.selected&&a!==c&&(a.selected=a.options.selected=!1,d.options.data[d.data.indexOf(a)]=a.options,a.setState(""),a.firePointEvent("unselect"))})})},onMouseOver:function(a){var b=this.series.chart,c=b.pointer;a=a?c.normalize(a):c.getChartCoordinatesFromPoint(this,b.inverted);c.runPointActions(a,
this)},onMouseOut:function(){var a=this.series.chart;this.firePointEvent("mouseOut");(a.hoverPoints||[]).forEach(function(a){a.setState()});a.hoverPoints=a.hoverPoint=null},importEvents:function(){if(!this.hasImportedEvents){var b=this,d=c(b.series.options.point,b.options).events;b.events=d;a.objectEach(d,function(a,c){y(b,c,a)});this.hasImportedEvents=!0}},setState:function(a,b){var c=Math.floor(this.plotX),d=this.plotY,f=this.series,g=f.options.states[a||"normal"]||{},h=r[f.type].marker&&f.options.marker,
l=h&&!1===h.enabled,e=h&&h.states&&h.states[a||"normal"]||{},p=!1===e.enabled,n=f.stateMarkerGraphic,t=this.marker||{},w=f.chart,x=f.halo,y,E=h&&f.markerAttribs;a=a||"";if(!(a===this.state&&!b||this.selected&&"select"!==a||!1===g.enabled||a&&(p||l&&!1===e.enabled)||a&&t.states&&t.states[a]&&!1===t.states[a].enabled)){E&&(y=f.markerAttribs(this,a));if(this.graphic)this.state&&this.graphic.removeClass("highcharts-point-"+this.state),a&&this.graphic.addClass("highcharts-point-"+a),w.styledMode||this.graphic.animate(f.pointAttribs(this,
a),m(w.options.chart.animation,g.animation)),y&&this.graphic.animate(y,m(w.options.chart.animation,e.animation,h.animation)),n&&n.hide();else{if(a&&e){h=t.symbol||f.symbol;n&&n.currentSymbol!==h&&(n=n.destroy());if(n)n[b?"animate":"attr"]({x:y.x,y:y.y});else h&&(f.stateMarkerGraphic=n=w.renderer.symbol(h,y.x,y.y,y.width,y.height).add(f.markerGroup),n.currentSymbol=h);!w.styledMode&&n&&n.attr(f.pointAttribs(this,a))}n&&(n[a&&w.isInsidePlot(c,d,w.inverted)?"show":"hide"](),n.element.point=this)}(c=
g.halo)&&c.size?(x||(f.halo=x=w.renderer.path().add((this.graphic||n).parentGroup)),x.show()[b?"animate":"attr"]({d:this.haloPath(c.size)}),x.attr({"class":"highcharts-halo highcharts-color-"+m(this.colorIndex,f.colorIndex)+(this.className?" "+this.className:""),zIndex:-1}),x.point=this,w.styledMode||x.attr(u({fill:this.color||f.color,"fill-opacity":c.opacity},c.attributes))):x&&x.point&&x.point.haloPath&&x.animate({d:x.point.haloPath(0)},null,x.hide);this.state=a;v(this,"afterSetState")}},haloPath:function(a){return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX)-
a,this.plotY-a,2*a,2*a)}});u(b.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&v(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;b.hoverSeries=null;if(d)d.onMouseOut();this&&a.events.mouseOut&&v(this,"mouseOut");!c||this.stickyTracking||c.shared&&!this.noSharedTooltip||c.hide();this.setState()},setState:function(a){var b=this,
c=b.options,d=b.graph,f=c.states,g=c.lineWidth,c=0;a=a||"";if(b.state!==a&&([b.group,b.markerGroup,b.dataLabelsGroup].forEach(function(c){c&&(b.state&&c.removeClass("highcharts-series-"+b.state),a&&c.addClass("highcharts-series-"+a))}),b.state=a,!(b.chart.styledMode||f[a]&&!1===f[a].enabled)&&(a&&(g=f[a].lineWidth||g+(f[a].lineWidthPlus||0)),d&&!d.dashstyle)))for(g={"stroke-width":g},d.animate(g,m(f[a||"normal"]&&f[a||"normal"].animation,b.chart.options.chart.animation));b["zone-graph-"+c];)b["zone-graph-"+
c].attr(g),c+=1},setVisible:function(a,b){var c=this,d=c.chart,f=c.legendItem,g,h=d.options.chart.ignoreHiddenSeries,l=c.visible;g=(c.visible=a=c.options.visible=c.userOptions.visible=void 0===a?!l:a)?"show":"hide";["group","dataLabelsGroup","markerGroup","tracker","tt"].forEach(function(a){if(c[a])c[a][g]()});if(d.hoverSeries===c||(d.hoverPoint&&d.hoverPoint.series)===c)c.onMouseOut();f&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&d.series.forEach(function(a){a.options.stacking&&
a.visible&&(a.isDirty=!0)});c.linkedSeries.forEach(function(b){b.setVisible(a,!1)});h&&(d.isDirtyBox=!0);v(c,g);!1!==b&&d.redraw()},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=this.options.selected=void 0===a?!this.selected:a;this.checkbox&&(this.checkbox.checked=a);v(this,a?"select":"unselect")},drawTracker:x.drawTrackerGraph})})(J);(function(a){var y=a.Chart,G=a.isArray,E=a.isObject,h=a.pick,d=a.splat;y.prototype.setResponsive=function(d){var h=
this.options.responsive,r=[],w=this.currentResponsive;h&&h.rules&&h.rules.forEach(function(g){void 0===g._id&&(g._id=a.uniqueKey());this.matchResponsiveRule(g,r,d)},this);var n=a.merge.apply(0,r.map(function(d){return a.find(h.rules,function(a){return a._id===d}).chartOptions})),r=r.toString()||void 0;r!==(w&&w.ruleIds)&&(w&&this.update(w.undoOptions,d),r?(this.currentResponsive={ruleIds:r,mergedOptions:n,undoOptions:this.currentOptions(n)},this.update(n,d)):this.currentResponsive=void 0)};y.prototype.matchResponsiveRule=
function(a,d){var r=a.condition;(r.callback||function(){return this.chartWidth<=h(r.maxWidth,Number.MAX_VALUE)&&this.chartHeight<=h(r.maxHeight,Number.MAX_VALUE)&&this.chartWidth>=h(r.minWidth,0)&&this.chartHeight>=h(r.minHeight,0)}).call(this)&&d.push(a._id)};y.prototype.currentOptions=function(h){function r(h,n,g,c){var m;a.objectEach(h,function(a,b){if(!c&&-1<["series","xAxis","yAxis"].indexOf(b))for(a=d(a),g[b]=[],m=0;m<a.length;m++)n[b][m]&&(g[b][m]={},r(a[m],n[b][m],g[b][m],c+1));else E(a)?
(g[b]=G(a)?[]:{},r(a,n[b]||{},g[b],c+1)):g[b]=n[b]||null})}var v={};r(h,this.options,v,0);return v}})(J);return J});

},{}],5:[function(require,module,exports){
/*
 Highcharts JS v7.0.0 (2018-12-11)
 Exporting module

 (c) 2010-2018 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(l){"object"===typeof module&&module.exports?module.exports=l:"function"===typeof define&&define.amd?define(function(){return l}):l("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(l){(function(g){var y=g.defaultOptions,z=g.doc,l=g.Chart,q=g.addEvent,I=g.removeEvent,C=g.fireEvent,t=g.createElement,D=g.discardElement,r=g.css,p=g.merge,u=g.pick,E=g.objectEach,x=g.extend,J=g.isTouchDevice,A=g.win,G=A.navigator.userAgent,F=g.SVGRenderer,H=g.Renderer.prototype.symbols,K=/Edge\/|Trident\/|MSIE /.test(G),
L=/firefox/i.test(G);x(y.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",contextButtonTitle:"Chart context menu"});y.navigation||(y.navigation={});p(!0,y.navigation,{buttonOptions:{theme:{},symbolSize:14,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,verticalAlign:"top",width:24}});p(!0,y.navigation,{menuStyle:{border:"1px solid #999999",background:"#ffffff",
padding:"5px 0"},menuItemStyle:{padding:"0.5em 1em",color:"#333333",background:"none",fontSize:J?"14px":"11px",transition:"background 250ms, color 250ms"},menuItemHoverStyle:{background:"#335cad",color:"#ffffff"},buttonOptions:{symbolFill:"#666666",symbolStroke:"#666666",symbolStrokeWidth:3,theme:{padding:5}}});y.exporting={type:"image/png",url:"https://export.highcharts.com/",printMaxWidth:780,scale:2,buttons:{contextButton:{className:"highcharts-contextbutton",menuClassName:"highcharts-contextmenu",
symbol:"menu",titleKey:"contextButtonTitle",menuItems:"printChart separator downloadPNG downloadJPEG downloadPDF downloadSVG".split(" ")}},menuItemDefinitions:{printChart:{textKey:"printChart",onclick:function(){this.print()}},separator:{separator:!0},downloadPNG:{textKey:"downloadPNG",onclick:function(){this.exportChart()}},downloadJPEG:{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},downloadPDF:{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},
downloadSVG:{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}}};g.post=function(b,a,d){var c=t("form",p({method:"post",action:b,enctype:"multipart/form-data"},d),{display:"none"},z.body);E(a,function(a,b){t("input",{type:"hidden",name:b,value:a},null,c)});c.submit();D(c)};x(l.prototype,{sanitizeSVG:function(b,a){if(a&&a.exporting&&a.exporting.allowHTML){var d=b.match(/<\/svg>(.*?$)/);d&&d[1]&&(d='\x3cforeignObject x\x3d"0" y\x3d"0" width\x3d"'+a.chart.width+'" height\x3d"'+
a.chart.height+'"\x3e\x3cbody xmlns\x3d"http://www.w3.org/1999/xhtml"\x3e'+d[1]+"\x3c/body\x3e\x3c/foreignObject\x3e",b=b.replace("\x3c/svg\x3e",d+"\x3c/svg\x3e"))}b=b.replace(/zIndex="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g,"url($2)").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'\x3csvg xmlns:xlink\x3d"http://www.w3.org/1999/xlink" ').replace(/ (|NS[0-9]+\:)href=/g," xlink:href\x3d").replace(/\n/," ").replace(/<\/svg>.*?$/,
"\x3c/svg\x3e").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,'$1\x3d"rgb($2)" $1-opacity\x3d"$3"').replace(/&nbsp;/g,"\u00a0").replace(/&shy;/g,"\u00ad");this.ieSanitizeSVG&&(b=this.ieSanitizeSVG(b));return b},getChartHTML:function(){this.styledMode&&this.inlineStyles();return this.container.innerHTML},getSVG:function(b){var a,d,c,w,m,h=p(this.options,b);d=t("div",null,{position:"absolute",top:"-9999em",width:this.chartWidth+"px",height:this.chartHeight+"px"},z.body);c=
this.renderTo.style.width;m=this.renderTo.style.height;c=h.exporting.sourceWidth||h.chart.width||/px$/.test(c)&&parseInt(c,10)||(h.isGantt?800:600);m=h.exporting.sourceHeight||h.chart.height||/px$/.test(m)&&parseInt(m,10)||400;x(h.chart,{animation:!1,renderTo:d,forExport:!0,renderer:"SVGRenderer",width:c,height:m});h.exporting.enabled=!1;delete h.data;h.series=[];this.series.forEach(function(a){w=p(a.userOptions,{animation:!1,enableMouseTracking:!1,showCheckbox:!1,visible:a.visible});w.isInternal||
h.series.push(w)});this.axes.forEach(function(a){a.userOptions.internalKey||(a.userOptions.internalKey=g.uniqueKey())});a=new g.Chart(h,this.callback);b&&["xAxis","yAxis","series"].forEach(function(c){var d={};b[c]&&(d[c]=b[c],a.update(d))});this.axes.forEach(function(b){var c=g.find(a.axes,function(a){return a.options.internalKey===b.userOptions.internalKey}),d=b.getExtremes(),e=d.userMin,d=d.userMax;c&&(void 0!==e&&e!==c.min||void 0!==d&&d!==c.max)&&c.setExtremes(e,d,!0,!1)});c=a.getChartHTML();
C(this,"getSVG",{chartCopy:a});c=this.sanitizeSVG(c,h);h=null;a.destroy();D(d);return c},getSVGForExport:function(b,a){var d=this.options.exporting;return this.getSVG(p({chart:{borderRadius:0}},d.chartOptions,a,{exporting:{sourceWidth:b&&b.sourceWidth||d.sourceWidth,sourceHeight:b&&b.sourceHeight||d.sourceHeight}}))},getFilename:function(){var b=this.userOptions.title&&this.userOptions.title.text,a=this.options.exporting.filename;if(a)return a;"string"===typeof b&&(a=b.toLowerCase().replace(/<\/?[^>]+(>|$)/g,
"").replace(/[\s_]+/g,"-").replace(/[^a-z0-9\-]/g,"").replace(/^[\-]+/g,"").replace(/[\-]+/g,"-").substr(0,24).replace(/[\-]+$/g,""));if(!a||5>a.length)a="chart";return a},exportChart:function(b,a){a=this.getSVGForExport(b,a);b=p(this.options.exporting,b);g.post(b.url,{filename:b.filename||this.getFilename(),type:b.type,width:b.width||0,scale:b.scale,svg:a},b.formAttributes)},print:function(){function b(b){(a.fixedDiv?[a.fixedDiv,a.scrollingContainer]:[a.container]).forEach(function(a){b.appendChild(a)})}
var a=this,d=[],c=z.body,g=c.childNodes,m=a.options.exporting.printMaxWidth,h,e;if(!a.isPrinting){a.isPrinting=!0;a.pointer.reset(null,0);C(a,"beforePrint");if(e=m&&a.chartWidth>m)h=[a.options.chart.width,void 0,!1],a.setSize(m,void 0,!1);g.forEach(function(a,b){1===a.nodeType&&(d[b]=a.style.display,a.style.display="none")});b(c);setTimeout(function(){A.focus();A.print();setTimeout(function(){b(a.renderTo);g.forEach(function(a,b){1===a.nodeType&&(a.style.display=d[b])});a.isPrinting=!1;e&&a.setSize.apply(a,
h);C(a,"afterPrint")},1E3)},1)}},contextMenu:function(b,a,d,c,w,m,h){var e=this,n=e.options.navigation,k=e.chartWidth,v=e.chartHeight,l="cache-"+b,f=e[l],B=Math.max(w,m),p;f||(e.exportContextMenu=e[l]=f=t("div",{className:b},{position:"absolute",zIndex:1E3,padding:B+"px",pointerEvents:"auto"},e.fixedDiv||e.container),p=t("div",{className:"highcharts-menu"},null,f),e.styledMode||r(p,x({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},n.menuStyle)),
f.hideMenu=function(){r(f,{display:"none"});h&&h.setState(0);e.openMenu=!1;g.clearTimeout(f.hideTimer)},e.exportEvents.push(q(f,"mouseleave",function(){f.hideTimer=setTimeout(f.hideMenu,500)}),q(f,"mouseenter",function(){g.clearTimeout(f.hideTimer)}),q(z,"mouseup",function(a){e.pointer.inClass(a.target,b)||f.hideMenu()}),q(f,"click",function(){e.openMenu&&f.hideMenu()})),a.forEach(function(a){"string"===typeof a&&(a=e.options.exporting.menuItemDefinitions[a]);if(g.isObject(a,!0)){var b;a.separator?
b=t("hr",null,null,p):(b=t("div",{className:"highcharts-menu-item",onclick:function(b){b&&b.stopPropagation();f.hideMenu();a.onclick&&a.onclick.apply(e,arguments)},innerHTML:a.text||e.options.lang[a.textKey]},null,p),e.styledMode||(b.onmouseover=function(){r(this,n.menuItemHoverStyle)},b.onmouseout=function(){r(this,n.menuItemStyle)},r(b,x({cursor:"pointer"},n.menuItemStyle))));e.exportDivElements.push(b)}}),e.exportDivElements.push(p,f),e.exportMenuWidth=f.offsetWidth,e.exportMenuHeight=f.offsetHeight);
a={display:"block"};d+e.exportMenuWidth>k?a.right=k-d-w-B+"px":a.left=d-B+"px";c+m+e.exportMenuHeight>v&&"top"!==h.alignOptions.verticalAlign?a.bottom=v-c-B+"px":a.top=c+m-B+"px";r(f,a);e.openMenu=!0},addButton:function(b){var a=this,d=a.renderer,c=p(a.options.navigation.buttonOptions,b),g=c.onclick,m=c.menuItems,h,e,n=c.symbolSize||12;a.btnCount||(a.btnCount=0);a.exportDivElements||(a.exportDivElements=[],a.exportSVGElements=[]);if(!1!==c.enabled){var k=c.theme,v=k.states,l=v&&v.hover,v=v&&v.select,
f;a.styledMode||(k.fill=u(k.fill,"#ffffff"),k.stroke=u(k.stroke,"none"));delete k.states;g?f=function(b){b&&b.stopPropagation();g.call(a,b)}:m&&(f=function(b){b&&b.stopPropagation();a.contextMenu(e.menuClassName,m,e.translateX,e.translateY,e.width,e.height,e);e.setState(2)});c.text&&c.symbol?k.paddingLeft=u(k.paddingLeft,25):c.text||x(k,{width:c.width,height:c.height,padding:0});a.styledMode||(k["stroke-linecap"]="round",k.fill=u(k.fill,"#ffffff"),k.stroke=u(k.stroke,"none"));e=d.button(c.text,0,
0,f,k,l,v).addClass(b.className).attr({title:u(a.options.lang[c._titleKey||c.titleKey],"")});e.menuClassName=b.menuClassName||"highcharts-menu-"+a.btnCount++;c.symbol&&(h=d.symbol(c.symbol,c.symbolX-n/2,c.symbolY-n/2,n,n,{width:n,height:n}).addClass("highcharts-button-symbol").attr({zIndex:1}).add(e),a.styledMode||h.attr({stroke:c.symbolStroke,fill:c.symbolFill,"stroke-width":c.symbolStrokeWidth||1}));e.add(a.exportingGroup).align(x(c,{width:e.width,x:u(c.x,a.buttonOffset)}),!0,"spacingBox");a.buttonOffset+=
(e.width+c.buttonSpacing)*("right"===c.align?-1:1);a.exportSVGElements.push(e,h)}},destroyExport:function(b){var a=b?b.target:this;b=a.exportSVGElements;var d=a.exportDivElements,c=a.exportEvents,l;b&&(b.forEach(function(b,c){b&&(b.onclick=b.ontouchstart=null,l="cache-"+b.menuClassName,a[l]&&delete a[l],a.exportSVGElements[c]=b.destroy())}),b.length=0);a.exportingGroup&&(a.exportingGroup.destroy(),delete a.exportingGroup);d&&(d.forEach(function(b,c){g.clearTimeout(b.hideTimer);I(b,"mouseleave");a.exportDivElements[c]=
b.onmouseout=b.onmouseover=b.ontouchstart=b.onclick=null;D(b)}),d.length=0);c&&(c.forEach(function(a){a()}),c.length=0)}});F.prototype.inlineToAttributes="fill stroke strokeLinecap strokeLinejoin strokeWidth textAnchor x y".split(" ");F.prototype.inlineBlacklist=[/-/,/^(clipPath|cssText|d|height|width)$/,/^font$/,/[lL]ogical(Width|Height)$/,/perspective/,/TapHighlightColor/,/^transition/,/^length$/];F.prototype.unstyledElements=["clipPath","defs","desc"];l.prototype.inlineStyles=function(){function b(a){return a.replace(/([A-Z])/g,
function(a,b){return"-"+b.toLowerCase()})}function a(d){function m(a,f){q=t=!1;if(l){for(r=l.length;r--&&!t;)t=l[r].test(f);q=!t}"transform"===f&&"none"===a&&(q=!0);for(r=g.length;r--&&!q;)q=g[r].test(f)||"function"===typeof a;q||v[f]===a&&"svg"!==d.nodeName||e[d.nodeName][f]===a||(-1!==c.indexOf(f)?d.setAttribute(b(f),a):u+=b(f)+":"+a+";")}var f,v,u="",w,q,t,r;if(1===d.nodeType&&-1===h.indexOf(d.nodeName)){f=A.getComputedStyle(d,null);v="svg"===d.nodeName?{}:A.getComputedStyle(d.parentNode,null);
e[d.nodeName]||(n=k.getElementsByTagName("svg")[0],w=k.createElementNS(d.namespaceURI,d.nodeName),n.appendChild(w),e[d.nodeName]=p(A.getComputedStyle(w,null)),"text"===d.nodeName&&delete e.text.fill,n.removeChild(w));if(L||K)for(var x in f)m(f[x],x);else E(f,m);u&&(f=d.getAttribute("style"),d.setAttribute("style",(f?f+";":"")+u));"svg"===d.nodeName&&d.setAttribute("stroke-width","1px");"text"!==d.nodeName&&[].forEach.call(d.children||d.childNodes,a)}}var d=this.renderer,c=d.inlineToAttributes,g=d.inlineBlacklist,
l=d.inlineWhitelist,h=d.unstyledElements,e={},n,k,d=z.createElement("iframe");r(d,{width:"1px",height:"1px",visibility:"hidden"});z.body.appendChild(d);k=d.contentWindow.document;k.open();k.write('\x3csvg xmlns\x3d"http://www.w3.org/2000/svg"\x3e\x3c/svg\x3e');k.close();a(this.container.querySelector("svg"));n.parentNode.removeChild(n)};H.menu=function(b,a,d,c){return["M",b,a+2.5,"L",b+d,a+2.5,"M",b,a+c/2+.5,"L",b+d,a+c/2+.5,"M",b,a+c-1.5,"L",b+d,a+c-1.5]};H.menuball=function(b,a,d,c){b=[];c=c/3-
2;return b=b.concat(this.circle(d-c,a,c,c),this.circle(d-c,a+c+4,c,c),this.circle(d-c,a+2*(c+4),c,c))};l.prototype.renderExporting=function(){var b=this,a=b.options.exporting,d=a.buttons,c=b.isDirtyExporting||!b.exportSVGElements;b.buttonOffset=0;b.isDirtyExporting&&b.destroyExport();c&&!1!==a.enabled&&(b.exportEvents=[],b.exportingGroup=b.exportingGroup||b.renderer.g("exporting-group").attr({zIndex:3}).add(),E(d,function(a){b.addButton(a)}),b.isDirtyExporting=!1);q(b,"destroy",b.destroyExport)};
q(l,"init",function(){var b=this;["exporting","navigation"].forEach(function(a){b[a]={update:function(d,c){b.isDirtyExporting=!0;p(!0,b.options[a],d);u(c,!0)&&b.redraw()}}})});l.prototype.callbacks.push(function(b){b.renderExporting();q(b,"redraw",b.renderExporting)})})(l)});

},{}],6:[function(require,module,exports){
var split = require('browser-split')
var ClassList = require('class-list')

var w = typeof window === 'undefined' ? require('html-element') : window
var document = w.document
var Text = w.Text

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        // Our minimal parser doesn’t understand escaping CSS special
        // characters like `#`. Don’t use them. More reading:
        // https://mathiasbynens.be/notes/css-escapes .

        var m = split(string, /([\.#]?[^\s#.]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              (function (k, l) { // capture k, l in the closure
                if (e.addEventListener){
                  e.addEventListener(k.substring(2), l[k], false)
                  cleanupFuncs.push(function(){
                    e.removeEventListener(k.substring(2), l[k], false)
                  })
                }else{
                  e.attachEvent(k, l[k])
                  cleanupFuncs.push(function(){
                    e.detachEvent(k, l[k])
                  })
                }
              })(k, l)
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  var match = l[k][s].match(/(.*)\W+!important\W*$/);
                  if (match) {
                    e.style.setProperty(s, match[1], 'important')
                  } else {
                    e.style.setProperty(s, l[k][s])
                  }
              })(s, l[k][s])
            }
          } else if(k === 'attrs') {
            for (var v in l[k]) {
              e.setAttribute(v, l[k][v])
            }
          }
          else if (k.substr(0, 5) === "data-") {
            e.setAttribute(k, l[k])
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
    cleanupFuncs.length = 0
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}



},{"browser-split":2,"class-list":3,"html-element":1}],7:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],8:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.3.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		div.style.position = "absolute";
		scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),
		val = curCSS( elem, dimension, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox;

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth/offsetHeight provide border-box values
		valueIsBorderBox = true;
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],9:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (typeof input === 'string') {
      this.url = input
    } else {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split('\r\n').forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],10:[function(require,module,exports){
'use strict';

module.exports = {
    server: {
        url: 'http://localhost:8000'
    }
};

},{}],11:[function(require,module,exports){
'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _hyperscript = require('hyperscript');

var _hyperscript2 = _interopRequireDefault(_hyperscript);

var _polls = require('./polls');

var _polls2 = _interopRequireDefault(_polls);

var _highcharts = require('highcharts');

var _highcharts2 = _interopRequireDefault(_highcharts);

var _exporting = require('highcharts/modules/exporting');

var _exporting2 = _interopRequireDefault(_exporting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Initialize exporting module.
(0, _exporting2.default)(_highcharts2.default);

var generalPolls = [];

(0, _jquery2.default)("#graph1-select").on('change', function () {
	drawGeneralPollsFromYear(this.value);
});

(0, _jquery2.default)("#graph2-select-year").on('change', function () {
	drawSelectUniversitiesGroup(this.value);
});

var drawSelectUniversitiesGroup = function drawSelectUniversitiesGroup(year) {
	(0, _jquery2.default)('#graph2-select-university').empty();

	var generalPollYear = getPollsFromYear(year);

	var universitiesGroup = getUniversitiesGroup(generalPollYear);

	for (var universityGroup in universitiesGroup) {
		(0, _jquery2.default)('#graph2-select-university').append('<option value="' + universityGroup + '">' + universityGroup + '</option>');
	}
};

var getUniversitiesGroup = function getUniversitiesGroup(poll) {
	var universitiesGroup = [];

	poll.forEach(function (el) {
		return universitiesGroup.indexOf(el.university_group) === -1 ? universitiesGroup.push(el.university_group) : null;
	});

	return universitiesGroup;
};

var getPollsFromYear = function getPollsFromYear(year) {
	return generalPolls.map(function (poll) {
		if (poll.year == year) return { university_group: poll.university_group, y: poll.center_votes };
	}).filter(function (e) {
		return e != null;
	});
};

var drawGeneralPollsFromYear = function drawGeneralPollsFromYear(year) {
	var generalPollYear = getPollsFromYear(year);

	var groupedPollYear = groupBy(generalPollYear, 'university_group');

	drawGeneralPoll(groupedPollYear, 'Elecciones Estudiantiles ' + year, "graph1-chart");
};

var groupBy = function groupBy(arr, property) {
	var groups = {};

	arr.forEach(function (el) {
		var groupName = el[property];

		if (!groups[groupName]) groups[groupName] = 0;

		groups[groupName] += el.y;
	});

	var groupedArray = [];

	for (var groupName in groups) {
		var _groupedArray$push;

		groupedArray.push((_groupedArray$push = {}, _defineProperty(_groupedArray$push, '' + property, groupName), _defineProperty(_groupedArray$push, 'y', groups[groupName]), _groupedArray$push));
	}

	return groupedArray;
};

var drawGeneralPoll = function drawGeneralPoll(poll, title, container) {
	_highcharts2.default.chart(container, {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: title
		},
		tooltip: {
			pointFormat: '{series.university_group}: <b>{point.y:.1f} votes</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.university_group}</b>: {point.y:.1f} votes',
					style: {
						color: _highcharts2.default.theme && _highcharts2.default.theme.contrastTextColor || 'black'
					}
				}
			}
		},
		series: [{
			name: 'Brands',
			colorByPoint: true,
			data: poll
		}]
	});
};

var fetchPolls = function fetchPolls(_) {
	_polls2.default.getPolls().then(function (polls) {
		console.log(polls, 'VOTOS DESDE API');

		if (polls) {
			generalPolls = polls;
		}
	});
};

// FETCH PRODUCTS IF LIST
if (window.location.pathname == '/') {
	fetchPolls();
} else {
	// Something else
}

},{"./polls":12,"highcharts":4,"highcharts/modules/exporting":5,"hyperscript":6,"jquery":8}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('whatwg-fetch');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PollAPIClient = {
    polls: null,

    getCookie: function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === name + '=') {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    getPolls: function getPolls(_) {
        var url = '/api/polls/';

        return fetch(url, {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'x-csrftoken': PollAPIClient.getCookie('csrftoken')
            }
        }).then(function (response) {
            if (response.status === 200) return response.json();
        }).then(function (polls) {
            PollAPIClient.polls = polls;
            return polls;
        }).catch(function (e) {
            return false;
        });
    }

};

exports.default = PollAPIClient;
module.exports = exports['default'];

},{"./config":10,"whatwg-fetch":9}]},{},[11])

//# sourceMappingURL=index.js.map
