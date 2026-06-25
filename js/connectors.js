(function () {
    var STROKE = 'rgba(139,0,0,0.45)';
    var WIDTH  = 1.5;

    // [source1, source2, target, side]
    // side L = lines exit right; side R = lines exit left
    var PAIRS = [
        ['r32-L1','r32-L2','r16-L1','L'],
        ['r32-L3','r32-L4','r16-L2','L'],
        ['r32-L5','r32-L6','r16-L3','L'],
        ['r32-L7','r32-L8','r16-L4','L'],
        ['r16-L1','r16-L2','qf-L1', 'L'],
        ['r16-L3','r16-L4','qf-L2', 'L'],
        ['qf-L1', 'qf-L2', 'sf-L',  'L'],
        ['r32-R1','r32-R2','r16-R1','R'],
        ['r32-R3','r32-R4','r16-R2','R'],
        ['r32-R5','r32-R6','r16-R3','R'],
        ['r32-R7','r32-R8','r16-R4','R'],
        ['r16-R1','r16-R2','qf-R1', 'R'],
        ['r16-R3','r16-R4','qf-R2', 'R'],
        ['qf-R1', 'qf-R2', 'sf-R',  'R'],
    ];

    function el(id) {
        return document.querySelector('[data-match-id="' + id + '"]') ||
               document.getElementById('match-' + id);
    }

    function seg(svg, x1, y1, x2, y2) {
        var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', x1.toFixed(1)); l.setAttribute('y1', y1.toFixed(1));
        l.setAttribute('x2', x2.toFixed(1)); l.setAttribute('y2', y2.toFixed(1));
        l.setAttribute('stroke', STROKE);
        l.setAttribute('stroke-width', WIDTH);
        l.setAttribute('stroke-linecap', 'round');
        svg.appendChild(l);
    }

    function draw() {
        var wrap = document.querySelector('.bracket-wrapper');
        if (!wrap) return;

        // Create SVG overlay once, clear and redraw on each call
        var svg = document.getElementById('bracket-connectors');
        if (!svg) {
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.id = 'bracket-connectors';
            svg.setAttribute('aria-hidden', 'true');
            svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
            wrap.style.position = 'relative';
            wrap.insertBefore(svg, wrap.firstChild);
        }
        svg.innerHTML = '';

        var wr = wrap.getBoundingClientRect();

        // Draw each pair → next-round connector
        PAIRS.forEach(function (p) {
            var a = el(p[0]), b = el(p[1]), n = el(p[2]), side = p[3];
            if (!a || !b || !n) return;

            var ra = a.getBoundingClientRect();
            var rb = b.getBoundingClientRect();
            var rn = n.getBoundingClientRect();

            var ya  = (ra.top + ra.bottom) / 2 - wr.top;
            var yb  = (rb.top + rb.bottom) / 2 - wr.top;
            var mid = (ya + yb) / 2;

            if (side === 'L') {
                // Exit right edge of each match, meet at vertical midpoint, enter left of next
                var xa = ra.right - wr.left;
                var xb = rb.right - wr.left;
                var xn = rn.left  - wr.left;
                var xv = (xa + xn) / 2;
                seg(svg, xa, ya, xv, ya);    // horizontal out of match A
                seg(svg, xb, yb, xv, yb);    // horizontal out of match B
                seg(svg, xv, ya, xv, yb);    // vertical bridge
                seg(svg, xv, mid, xn, mid);  // horizontal into next round
            } else {
                // Exit left edge of each match, meet at vertical midpoint, enter right of next
                var xa = ra.left  - wr.left;
                var xb = rb.left  - wr.left;
                var xn = rn.right - wr.left;
                var xv = (xa + xn) / 2;
                seg(svg, xa, ya, xv, ya);
                seg(svg, xb, yb, xv, yb);
                seg(svg, xv, ya, xv, yb);
                seg(svg, xv, mid, xn, mid);
            }
        });

        // SF → Final
        var sfL = el('sf-L'), sfR = el('sf-R'), fin = el('final');
        if (sfL && fin) {
            var rL = sfL.getBoundingClientRect();
            var rF = fin.getBoundingClientRect();
            var yL = (rL.top + rL.bottom) / 2 - wr.top;
            var yF = (rF.top + rF.bottom) / 2 - wr.top;
            var xLe = rL.right - wr.left;
            var xFl = rF.left  - wr.left;
            seg(svg, xLe, yL, xFl, yL);
            if (Math.abs(yL - yF) > 2) seg(svg, xFl, yL, xFl, yF);
        }
        if (sfR && fin) {
            var rR = sfR.getBoundingClientRect();
            var rF = fin.getBoundingClientRect();
            var yR = (rR.top + rR.bottom) / 2 - wr.top;
            var yF = (rF.top + rF.bottom) / 2 - wr.top;
            var xRe = rR.left  - wr.left;
            var xFr = rF.right - wr.left;
            seg(svg, xRe, yR, xFr, yR);
            if (Math.abs(yR - yF) > 2) seg(svg, xFr, yR, xFr, yF);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Delay slightly so flexbox finishes distributing space
        setTimeout(draw, 80);
        window.addEventListener('resize', draw);
    });
})();
