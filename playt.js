/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="js/jquery-1.11.0.js" />
/// <reference path="js/jquery-ui-1.10.4.custom.js" />
/// <reference path="js/jQueryRotate.js" />
/// <reference path="js/jquery.ui.touch-punch.js" />
/// <reference path="playtStatic.js" />

$(function() {
    var nextZIndex = 1, urlParams, allowReroll = true, allowRotateCards = true, allowRotateDice = true;

    // Extract URL params
    (function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
           urlParams[decode(match[1])] = decode(match[2]);
    })();

    // Array shuffle function
    function shuffle(array) {
        var tmp, current, top = array.length;

        if (top) while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }

        return array;
    }

    // Parse URL params and set what to include
    (function() {
        var c, d, i;
        
        if (!$.isEmptyObject(urlParams)) {
            if (urlParams['_reroll'] === 'false') {
                allowReroll = false;
            }
            if (urlParams['_tap'] === 'false') {
                allowRotateCards = false;
            }
            if (urlParams['_rotate'] === 'false') {
                allowRotateDice = false;
            }
            for (c = 0; c < playt.cards.length; c++) {
                playt.cards[c].include = 0;
                for (i in urlParams) {
                    if (urlParams[i] && i === playt.cards[c].name) {
                        playt.cards[c].include = urlParams[i];
                    }
                }
            }
            for (d = 0; d < playt.dice.length; d++) {
                playt.dice[d].include = 0;
                for (i in urlParams) {
                    if (urlParams[i] && i === playt.dice[d].name) {
                        playt.dice[d].include = urlParams[i];
                    }
                }
            }
        }
    })();

    // Show our configuration form
    (function() {
        var c, d, h = "";
        // TODO: This can be presented nicer...
        // TODO: Separate out dice and cards, make them look different?
        h += '<form name="configForm" id="configForm" method="get">';
        h += '<table border="0" bgcolor="#6495ED" cellspacing="1" cellpadding="5">';
        for (c = 0; c < playt.cards.length; c++) {
            h += '<tr><td>';
            h += playt.cards[c].name;
            h += ': <input id="cfgform_';
            h += playt.cards[c].name;
            h += '" name="';
            h += playt.cards[c].name;
            h += '" type="text" value="';
            h += playt.cards[c].include;
            h += '">';
            h += '</tr>';
        }
        for (d = 0; d < playt.dice.length; d++) {
            h += '<tr><td>';
            h += playt.dice[d].name;
            h += ': <input id="cfgform_';
            h += playt.dice[d].name;
            h += '" name="';
            h += playt.dice[d].name;
            h += '" type="text" value="';
            h += playt.dice[d].include;
            h += '">';
            h += '</tr>';
        }
        h += '<tr><td><input id="configTap" type="checkbox" name="_tap" value="true"';
        if(allowRotateCards)
            h += ' checked';
        h += '>Allow cards to be rotated</td></tr>';
        h += '<tr><td><input id="configReroll" type="checkbox" name="_reroll" value="true"';
        if(allowReroll)
            h += ' checked';
        h += '>Allow dice to be rerolled</td></tr>';
        h += '<tr><td><input id="configRotate" type="checkbox" name="_rotate" value="true"';
        if(allowRotateDice)
            h += ' checked';
        h += '>Allow dice to be rotated</td></tr>';
        h += '<tr><td><input type="submit" value="Go"></td></tr>';
        h += '</table>';
        h += '</form>';
        $("#playtConfig").append(h);
    })();

    // Show our playing pieces
    (function() {
        var c, d, inc, i, h = "", baseX = 0, baseY = 0, x = 0, y = 0;
        // Show cards
        for (c = 0; c < playt.cards.length; c++) {
            for (inc = 0; inc < playt.cards[c].include; inc++) {
                shuffle(playt.cards[c].images);
                for (i = 0; i < playt.cards[c].images.length; i++) {
                    h += '<img alt="';
                    h += playt.cards[c].images[i]
                    h += '" src="';
                    h += playt.cards[c].cardBack;
                    h += '" class="draggable draggableCard" style="position: absolute; ';
                    h += 'left: ' + (baseX + x) + 'px; top: ' + (baseY + y) + 'px"/>';
                    x++;
                    y++;
                }
                // TODO: line wrapping, dynamic base spacing?
                baseX += 200;
                x = 0;
                y = 0;
            }
        }

        // Show dice
        for (d = 0; d < playt.dice.length; d++) {
            for (inc = 0; inc < playt.dice[d].include; inc++) {
                i = Math.floor((Math.random() * playt.dice[d].images.length));
                h += '<img src="';
                h += playt.dice[d].images[i];
                h += '" alt="';
                h += d;
                h += '"class="draggable draggableDice" style="position: absolute; ';
                h += 'left: ' + baseX + 'px; top: ' + baseY + 'px"/>';
                // TODO: line wrapping, dynamic base spacing?
                baseX += 200;
            }
        }
        
        $("#playtBoard").append(h);
    })();

    // Control form submission
    $('#configForm').submit(function(event) {
        var c, d, v, data = {}, a = [], url = window.location.href.split('?')[0];
        for (c = 0; c < playt.cards.length; c++) {
            v = $("#cfgform_" + playt.cards[c].name).val();
            if (v > 0)
                data[playt.cards[c].name] = v;
        }
        for (d = 0; d < playt.dice.length; d++) {
            v = $("#cfgform_" + playt.dice[d].name).val();
            if (v > 0)
                data[playt.dice[d].name] = v;
        }
        if (!$("#configTap").is(':checked'))
            data['_tap'] = 'false';
        if (!$("#configReroll").is(':checked'))
            data['_reroll'] = 'false';
        if (!$("#configRotate").is(':checked'))
            data['_rotate'] = 'false';
        for (d in data)
            a.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        url += "?" + a.join("&");
        window.location.href = url;
        return false;  // prevent default form submission
    });

    $("#configSection").accordion({
        collapsible: true,
        active: false
    });

    // Behavior setup for cards and dice
    $(".draggable").draggable({
        start: function() {
            $(this).css("z-index", nextZIndex);
            nextZIndex++;
        }});

    $(".draggableCard").click(function() {
        var newSrc = $(this).attr("alt");
        $(this).attr("alt", $(this).attr("src"));
        $(this).attr("src", newSrc);
        $(this).css("z-index", nextZIndex);
        nextZIndex++;
    });

    $(".draggableCard").dblclick(function() {
        if(allowRotateCards) {
            var curAngle = $(this).getRotateAngle()[0];
            if(!curAngle)
                curAngle = 0;
            $(this).rotate(curAngle + 90);
        }
    });

    $(".draggableDice").click(function() {
        if(allowRotateDice) {
            var curAngle = $(this).getRotateAngle()[0];
            if(!curAngle)
                curAngle = 0;
            $(this).rotate(curAngle + 90);
        }
    });

    $(".draggableDice").dblclick(function() {
        if(allowReroll) {
            var i, d = $(this).attr("alt");
            i = Math.floor((Math.random() * playt.dice[d].images.length));
            $(this).attr("src", playt.dice[d].images[i]);
        }
    });
});
