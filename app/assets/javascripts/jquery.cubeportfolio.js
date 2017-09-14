! function(a, b, c, d) {
    "use strict";

    function e(b, c, d) {
        var f = this;
        if (a.data(b, "cubeportfolio")) throw new Error("cubeportfolio is already initialized. Destroy it before initialize again!");
        f.obj = b, f.$obj = a(b), a.data(f.obj, "cubeportfolio", f), f.options = a.extend({}, a.fn.cubeportfolio.options, c, f.$obj.data("cbp-options")), f.isAnimating = !0, f.defaultFilter = f.options.defaultFilter, f.registeredEvents = [], f.queue = [], f.addedWrapp = !1, a.isFunction(d) && f.registerEvent("initFinish", d, !0);
        var g = f.$obj.children();
        f.$obj.addClass("cbp"), (0 === g.length || g.first().hasClass("cbp-item")) && (f.wrapInner(f.obj, "cbp-wrapper"), f.addedWrapp = !0), f.$ul = f.$obj.children().addClass("cbp-wrapper"), f.wrapInner(f.obj, "cbp-wrapper-outer"), f.wrapper = f.$obj.children(".cbp-wrapper-outer"), f.blocks = f.$ul.children(".cbp-item"), f.blocksOn = f.blocks, f.wrapInner(f.blocks, "cbp-item-wrapper"), f.plugins = {}, a.each(e.plugins, function(a, b) {
            var c = b(f);
            c && (f.plugins[a] = c)
        }), f.triggerEvent("afterPlugins"), f.removeAttrAfterStoreData = a.Deferred(), f.loadImages(f.$obj, f.display)
    }
    a.extend(e.prototype, {
        storeData: function(b, c) {
            var d = this;
            c = c || 0, b.each(function(b, e) {
                var f = a(e),
                    g = f.width(),
                    h = f.height();
                f.data("cbp", {
                    index: c + b,
                    wrapper: f.children(".cbp-item-wrapper"),
                    widthInitial: g,
                    heightInitial: h,
                    width: g,
                    height: h,
                    widthAndGap: g + d.options.gapVertical,
                    heightAndGap: h + d.options.gapHorizontal,
                    left: null,
                    leftNew: null,
                    top: null,
                    topNew: null,
                    pack: !1
                })
            }), this.removeAttrAfterStoreData.resolve()
        },
        wrapInner: function(a, b) {
            var e, f, g;
            if (b = b || "", !(a.length && a.length < 1))
                for (a.length === d && (a = [a]), f = a.length - 1; f >= 0; f--) {
                    for (e = a[f], g = c.createElement("div"), g.setAttribute("class", b); e.childNodes.length;) g.appendChild(e.childNodes[0]);
                    e.appendChild(g)
                }
        },
        removeAttrImage: function(a) {
            this.removeAttrAfterStoreData.then(function() {
                a.removeAttribute("width"), a.removeAttribute("height"), a.removeAttribute("style")
            })
        },
        loadImages: function(b, c) {
            var d = this;
            requestAnimationFrame(function() {
                var e = b.find("img").map(function(b, c) {
                        if (c.hasAttribute("width") && c.hasAttribute("height")) {
                            if (c.style.width = c.getAttribute("width") + "px", c.style.height = c.getAttribute("height") + "px", c.hasAttribute("data-cbp-src")) return null;
                            if (null === d.checkSrc(c)) d.removeAttrImage(c);
                            else {
                                var e = a("<img>");
                                e.on("load.cbp error.cbp", function() {
                                    a(this).off("load.cbp error.cbp"), d.removeAttrImage(c)
                                }), c.srcset ? (e.attr("sizes", c.sizes || "100vw"), e.attr("srcset", c.srcset)) : e.attr("src", c.src)
                            }
                            return null
                        }
                        return d.checkSrc(c)
                    }),
                    f = e.length;
                return 0 === f ? void c.call(d) : void a.each(e, function(b, e) {
                    var g = a("<img>");
                    g.on("load.cbp error.cbp", function() {
                        a(this).off("load.cbp error.cbp"), f--, 0 === f && c.call(d)
                    }), e.srcset ? (g.attr("sizes", e.sizes), g.attr("srcset", e.srcset)) : g.attr("src", e.src)
                })
            })
        },
        checkSrc: function(b) {
            var c = b.srcset,
                e = b.src;
            if ("" === e) return null;
            var f = a("<img>");
            c ? (f.attr("sizes", b.sizes || "100vw"), f.attr("srcset", c)) : f.attr("src", e);
            var g = f[0];
            return g.complete && g.naturalWidth !== d && 0 !== g.naturalWidth ? null : g
        },
        display: function() {
            var a = this;
            a.width = a.$obj.outerWidth(), a.triggerEvent("initStartRead"), a.triggerEvent("initStartWrite"), a.width > 0 && (a.storeData(a.blocks), a.layoutAndAdjustment()), a.triggerEvent("initEndRead"), a.triggerEvent("initEndWrite"), a.$obj.addClass("cbp-ready"), a.runQueue("delayFrame", a.delayFrame)
        },
        delayFrame: function() {
            var a = this;
            requestAnimationFrame(function() {
                a.resizeEvent(), a.triggerEvent("initFinish"), a.isAnimating = !1, a.$obj.trigger("initComplete.cbp")
            })
        },
        resizeEvent: function() {
            var a = this;
            e.private.resize.initEvent({
                instance: a,
                fn: function() {
                    a.triggerEvent("beforeResizeGrid");
                    var b = a.$obj.outerWidth();
                    a.width !== b && (a.width = b, "alignCenter" === a.options.gridAdjustment && (a.wrapper[0].style.maxWidth = ""), a.layoutAndAdjustment(), a.triggerEvent("resizeGrid")), a.triggerEvent("resizeWindow")
                }
            })
        },
        gridAdjust: function() {
            var b = this;
            "responsive" === b.options.gridAdjustment ? b.responsiveLayout() : (b.blocks.removeAttr("style"), b.blocks.each(function(c, d) {
                var e = a(d).data("cbp"),
                    f = d.getBoundingClientRect(),
                    g = b.columnWidthTruncate(f.right - f.left),
                    h = Math.round(f.bottom - f.top);
                e.height = h, e.heightAndGap = h + b.options.gapHorizontal, e.width = g, e.widthAndGap = g + b.options.gapVertical
            }), b.widthAvailable = b.width + b.options.gapVertical), b.triggerEvent("gridAdjust")
        },
        layoutAndAdjustment: function(a) {
            var b = this;
            a && (b.width = b.$obj.outerWidth()), b.gridAdjust(), b.layout()
        },
        layout: function() {
            var a = this;
            a.computeBlocks(a.filterConcat(a.defaultFilter)), "slider" === a.options.layoutMode ? (a.sliderLayoutReset(), a.sliderLayout()) : (a.mosaicLayoutReset(), a.mosaicLayout()), a.positionateItems(), a.resizeMainContainer()
        },
        computeFilter: function(a) {
            var b = this;
            b.computeBlocks(a), b.mosaicLayoutReset(), b.mosaicLayout(), b.filterLayout()
        },
        filterLayout: function() {
            var b = this;
            b.blocksOff.addClass("cbp-item-off"), b.blocksOn.removeClass("cbp-item-off").each(function(b, c) {
                var d = a(c).data("cbp");
                d.left = d.leftNew, d.top = d.topNew, c.style.left = d.left + "px", c.style.top = d.top + "px"
            }), b.resizeMainContainer(), b.filterFinish()
        },
        filterFinish: function() {
            var a = this;
            a.blocksAreSorted && a.sortBlocks(a.blocks, "index"), a.isAnimating = !1, a.$obj.trigger("filterComplete.cbp"), a.triggerEvent("filterFinish")
        },
        computeBlocks: function(a) {
            var b = this;
            b.blocksOnInitial = b.blocksOn, b.blocksOn = b.blocks.filter(a), b.blocksOff = b.blocks.not(a), b.triggerEvent("computeBlocksFinish", a)
        },
        responsiveLayout: function() {
            var b = this;
            b.cols = b[a.isArray(b.options.mediaQueries) ? "getColumnsBreakpoints" : "getColumnsAuto"](), b.columnWidth = b.columnWidthTruncate((b.width + b.options.gapVertical) / b.cols), b.widthAvailable = b.columnWidth * b.cols, "mosaic" === b.options.layoutMode && b.getMosaicWidthReference(), b.blocks.each(function(c, d) {
                var e, f = a(d).data("cbp"),
                    g = 1;
                "mosaic" === b.options.layoutMode && (g = b.getColsMosaic(f.widthInitial)), e = b.columnWidth * g - b.options.gapVertical, d.style.width = e + "px", f.width = e, f.widthAndGap = e + b.options.gapVertical, d.style.height = ""
            });
            var c = [];
            b.blocks.each(function(b, d) {
                a.each(a(d).find("img").filter("[width][height]"), function(b, d) {
                    var e = a(d).parent().width(),
                        f = parseInt(d.getAttribute("width"), 10),
                        g = parseInt(d.getAttribute("height"), 10),
                        h = parseFloat((f / g).toFixed(10));
                    c.push({
                        el: d,
                        width: e,
                        height: Math.round(e / h)
                    })
                })
            }), a.each(c, function(a, b) {
                b.el.width = b.width, b.el.height = b.height, b.el.style.width = b.width + "px", b.el.style.height = b.height + "px"
            }), b.blocks.each(function(c, d) {
                var e = a(d).data("cbp"),
                    f = d.getBoundingClientRect(),
                    g = Math.round(f.bottom - f.top);
                e.height = g, e.heightAndGap = g + b.options.gapHorizontal
            })
        },
        getMosaicWidthReference: function() {
            var b = this,
                c = [];
            b.blocks.each(function(b, d) {
                var e = a(d).data("cbp");
                c.push(e.widthInitial)
            }), c.sort(function(a, b) {
                return a - b
            }), c[0] ? b.mosaicWidthReference = c[0] : b.mosaicWidthReference = b.columnWidth
        },
        getColsMosaic: function(a) {
            var b = this;
            if (a === b.width) return b.cols;
            var c = a / b.mosaicWidthReference;
            return c = c % 1 >= .79 ? Math.ceil(c) : Math.floor(c), Math.min(Math.max(c, 1), b.cols)
        },
        getColumnsAuto: function() {
            var a = this;
            if (0 === a.blocks.length) return 1;
            var b = a.blocks.first().data("cbp").widthInitial + a.options.gapVertical;
            return Math.max(Math.round(a.width / b), 1)
        },
        getColumnsBreakpoints: function() {
            var b, c = this,
                d = c.width;
            return a.each(c.options.mediaQueries, function(a, c) {
                if (d >= c.width) return b = c, !1
            }), b || (b = c.options.mediaQueries[c.options.mediaQueries.length - 1]), c.triggerEvent("onMediaQueries", b.options), b.cols
        },
        columnWidthTruncate: function(a) {
            return Math.floor(a)
        },
        positionateItems: function() {
            var b, c = this;
            c.blocksOn.removeClass("cbp-item-off").each(function(c, d) {
                b = a(d).data("cbp"), b.left = b.leftNew, b.top = b.topNew, d.style.left = b.left + "px", d.style.top = b.top + "px"
            }), c.blocksOff.addClass("cbp-item-off"), c.blocksAreSorted && c.sortBlocks(c.blocks, "index")
        },
        resizeMainContainer: function() {
            var b, c = this,
                f = Math.max(c.freeSpaces.slice(-1)[0].topStart - c.options.gapHorizontal, 0);
            return "alignCenter" === c.options.gridAdjustment && (b = 0, c.blocksOn.each(function(c, d) {
                var e = a(d).data("cbp"),
                    f = e.left + e.width;
                f > b && (b = f)
            }), c.wrapper[0].style.maxWidth = b + "px"), f === c.height ? void c.triggerEvent("resizeMainContainer") : (c.obj.style.height = f + "px", c.height !== d && (e.private.modernBrowser ? c.$obj.one(e.private.transitionend, function() {
                c.$obj.trigger("pluginResize.cbp")
            }) : c.$obj.trigger("pluginResize.cbp")), c.height = f, void c.triggerEvent("resizeMainContainer"))
        },
        filterConcat: function(a) {
            return a.replace(/\|/gi, "")
        },
        pushQueue: function(a, b) {
            var c = this;
            c.queue[a] = c.queue[a] || [], c.queue[a].push(b)
        },
        runQueue: function(b, c) {
            var d = this,
                e = d.queue[b] || [];
            a.when.apply(a, e).then(a.proxy(c, d))
        },
        clearQueue: function(a) {
            var b = this;
            b.queue[a] = []
        },
        registerEvent: function(a, b, c) {
            var d = this;
            d.registeredEvents[a] || (d.registeredEvents[a] = []), d.registeredEvents[a].push({
                func: b,
                oneTime: c || !1
            })
        },
        triggerEvent: function(a, b) {
            var c, d, e = this;
            if (e.registeredEvents[a])
                for (c = 0, d = e.registeredEvents[a].length; c < d; c++) e.registeredEvents[a][c].func.call(e, b), e.registeredEvents[a][c].oneTime && (e.registeredEvents[a].splice(c, 1), c--, d--)
        },
        addItems: function(b, c, d) {
            var f = this;
            f.wrapInner(b, "cbp-item-wrapper"), f.$ul[d](b.addClass("cbp-item-loading").css({
                top: "100%",
                left: 0
            })), e.private.modernBrowser ? b.last().one(e.private.animationend, function() {
                f.addItemsFinish(b, c)
            }) : f.addItemsFinish(b, c), f.loadImages(b, function() {
                if (f.$obj.addClass("cbp-updateItems"), "append" === d) f.storeData(b, f.blocks.length), a.merge(f.blocks, b);
                else {
                    f.storeData(b);
                    var c = b.length;
                    f.blocks.each(function(b, d) {
                        a(d).data("cbp").index = c + b
                    }), f.blocks = a.merge(b, f.blocks)
                }
                f.triggerEvent("addItemsToDOM", b), f.layoutAndAdjustment(!0), f.elems && e.public.showCounter.call(f.obj, f.elems)
            })
        },
        addItemsFinish: function(b, c) {
            var d = this;
            d.isAnimating = !1, d.$obj.removeClass("cbp-updateItems"), b.removeClass("cbp-item-loading"), a.isFunction(c) && c.call(d, b), d.$obj.trigger("onAfterLoadMore.cbp", [b])
        },
        removeItems: function(b, c) {
            var d = this;
            d.$obj.addClass("cbp-updateItems"), e.private.modernBrowser ? b.last().one(e.private.animationend, function() {
                d.removeItemsFinish(b, c)
            }) : d.removeItemsFinish(b, c), b.each(function(b, c) {
                d.blocks.each(function(b, f) {
                    if (c === f) {
                        var g = a(f);
                        d.blocks.splice(b, 1), e.private.modernBrowser ? (g.one(e.private.animationend, function() {
                            g.remove()
                        }), g.addClass("cbp-removeItem")) : g.remove()
                    }
                })
            }), d.blocks.each(function(b, c) {
                a(c).data("cbp").index = b
            }), d.layoutAndAdjustment(!0), d.elems && e.public.showCounter.call(d.obj, d.elems)
        },
        removeItemsFinish: function(b, c) {
            var d = this;
            d.isAnimating = !1, d.$obj.removeClass("cbp-updateItems"), a.isFunction(c) && c.call(d, b)
        }
    }), a.fn.cubeportfolio = function(a, b, c) {
        return this.each(function() {
            if ("object" == typeof a || !a) return e.public.init.call(this, a, b);
            if (e.public[a]) return e.public[a].call(this, b, c);
            throw new Error("Method " + a + " does not exist on jquery.cubeportfolio.js")
        })
    }, e.plugins = {}, a.fn.cubeportfolio.constructor = e
}(jQuery, window, document),
function(a, b, c, d) {
    "use strict";
    var e = a.fn.cubeportfolio.constructor;
    a.extend(e.prototype, {
        mosaicLayoutReset: function() {
            var b = this;
            b.blocksAreSorted = !1, b.blocksOn.each(function(c, d) {
                a(d).data("cbp").pack = !1, b.options.sortToPreventGaps && (d.style.height = "")
            }), b.freeSpaces = [{
                leftStart: 0,
                leftEnd: b.widthAvailable,
                topStart: 0,
                topEnd: Math.pow(2, 18)
            }]
        },
        mosaicLayout: function() {
            for (var a = this, b = 0, c = a.blocksOn.length; b < c; b++) {
                var d = a.getSpaceIndexAndBlock();
                if (null === d) return a.mosaicLayoutReset(), a.sortBlocksToPreventGaps(), void a.mosaicLayout();
                a.generateF1F2(d.spaceIndex, d.dataBlock), a.generateG1G2G3G4(d.dataBlock), a.cleanFreeSpaces(), a.addHeightToBlocks()
            }
            a.blocksAreSorted && a.sortBlocks(a.blocksOn, "topNew")
        },
        getSpaceIndexAndBlock: function() {
            var b = this,
                c = null;
            return a.each(b.freeSpaces, function(d, e) {
                var f = e.leftEnd - e.leftStart,
                    g = e.topEnd - e.topStart;
                return b.blocksOn.each(function(b, h) {
                    var i = a(h).data("cbp");
                    if (i.pack !== !0) return i.widthAndGap <= f && i.heightAndGap <= g ? (i.pack = !0, c = {
                        spaceIndex: d,
                        dataBlock: i
                    }, i.leftNew = e.leftStart, i.topNew = e.topStart, !1) : void 0
                }), !b.blocksAreSorted && b.options.sortToPreventGaps && d > 0 ? (c = null, !1) : null === c && void 0
            }), c
        },
        generateF1F2: function(a, b) {
            var c = this,
                d = c.freeSpaces[a],
                e = {
                    leftStart: d.leftStart + b.widthAndGap,
                    leftEnd: d.leftEnd,
                    topStart: d.topStart,
                    topEnd: d.topEnd
                },
                f = {
                    leftStart: d.leftStart,
                    leftEnd: d.leftEnd,
                    topStart: d.topStart + b.heightAndGap,
                    topEnd: d.topEnd
                };
            c.freeSpaces.splice(a, 1), e.leftEnd > e.leftStart && e.topEnd > e.topStart && (c.freeSpaces.splice(a, 0, e), a++), f.leftEnd > f.leftStart && f.topEnd > f.topStart && c.freeSpaces.splice(a, 0, f)
        },
        generateG1G2G3G4: function(b) {
            var c = this,
                d = [];
            a.each(c.freeSpaces, function(a, e) {
                var f = c.intersectSpaces(e, b);
                return null === f ? void d.push(e) : (c.generateG1(e, f, d), c.generateG2(e, f, d), c.generateG3(e, f, d), void c.generateG4(e, f, d))
            }), c.freeSpaces = d
        },
        intersectSpaces: function(a, b) {
            var c = {
                leftStart: b.leftNew,
                leftEnd: b.leftNew + b.widthAndGap,
                topStart: b.topNew,
                topEnd: b.topNew + b.heightAndGap
            };
            if (a.leftStart === c.leftStart && a.leftEnd === c.leftEnd && a.topStart === c.topStart && a.topEnd === c.topEnd) return null;
            var d = Math.max(a.leftStart, c.leftStart),
                e = Math.min(a.leftEnd, c.leftEnd),
                f = Math.max(a.topStart, c.topStart),
                g = Math.min(a.topEnd, c.topEnd);
            return e <= d || g <= f ? null : {
                leftStart: d,
                leftEnd: e,
                topStart: f,
                topEnd: g
            }
        },
        generateG1: function(a, b, c) {
            a.topStart !== b.topStart && c.push({
                leftStart: a.leftStart,
                leftEnd: a.leftEnd,
                topStart: a.topStart,
                topEnd: b.topStart
            })
        },
        generateG2: function(a, b, c) {
            a.leftEnd !== b.leftEnd && c.push({
                leftStart: b.leftEnd,
                leftEnd: a.leftEnd,
                topStart: a.topStart,
                topEnd: a.topEnd
            })
        },
        generateG3: function(a, b, c) {
            a.topEnd !== b.topEnd && c.push({
                leftStart: a.leftStart,
                leftEnd: a.leftEnd,
                topStart: b.topEnd,
                topEnd: a.topEnd
            })
        },
        generateG4: function(a, b, c) {
            a.leftStart !== b.leftStart && c.push({
                leftStart: a.leftStart,
                leftEnd: b.leftStart,
                topStart: a.topStart,
                topEnd: a.topEnd
            })
        },
        cleanFreeSpaces: function() {
            var a = this;
            a.freeSpaces.sort(function(a, b) {
                return a.topStart > b.topStart ? 1 : a.topStart < b.topStart ? -1 : a.leftStart > b.leftStart ? 1 : a.leftStart < b.leftStart ? -1 : 0
            }), a.correctSubPixelValues(), a.removeNonMaximalFreeSpaces()
        },
        correctSubPixelValues: function() {
            var a, b, c, d, e = this;
            for (a = 0, b = e.freeSpaces.length - 1; a < b; a++) c = e.freeSpaces[a], d = e.freeSpaces[a + 1], d.topStart - c.topStart <= 1 && (d.topStart = c.topStart)
        },
        removeNonMaximalFreeSpaces: function() {
            var b = this;
            b.uniqueFreeSpaces(), b.freeSpaces = a.map(b.freeSpaces, function(c, d) {
                return a.each(b.freeSpaces, function(a, b) {
                    if (d !== a) return b.leftStart <= c.leftStart && b.leftEnd >= c.leftEnd && b.topStart <= c.topStart && b.topEnd >= c.topEnd ? (c = null, !1) : void 0
                }), c
            })
        },
        uniqueFreeSpaces: function() {
            var b = this,
                c = [];
            a.each(b.freeSpaces, function(b, d) {
                a.each(c, function(a, b) {
                    if (b.leftStart === d.leftStart && b.leftEnd === d.leftEnd && b.topStart === d.topStart && b.topEnd === d.topEnd) return d = null, !1
                }), null !== d && c.push(d)
            }), b.freeSpaces = c
        },
        addHeightToBlocks: function() {
            var b = this;
            a.each(b.freeSpaces, function(c, d) {
                b.blocksOn.each(function(c, e) {
                    var f = a(e).data("cbp");
                    if (f.pack === !0 && b.intersectSpaces(d, f)) {
                        var g = d.topStart - f.topNew - f.heightAndGap;
                        g === -1 && (e.style.height = f.height - 1 + "px")
                    }
                })
            })
        },
        sortBlocksToPreventGaps: function() {
            var b = this;
            b.blocksAreSorted = !0, b.blocksOn.sort(function(b, c) {
                var d = a(b).data("cbp"),
                    e = a(c).data("cbp");
                return d.widthAndGap < e.widthAndGap ? 1 : d.widthAndGap > e.widthAndGap ? -1 : d.heightAndGap < e.heightAndGap ? 1 : d.heightAndGap > e.heightAndGap ? -1 : d.index > e.index ? 1 : d.index < e.index ? -1 : void 0
            })
        },
        sortBlocks: function(b, c) {
            b.sort(function(b, d) {
                var e = a(b).data("cbp"),
                    f = a(d).data("cbp");
                return e[c] > f[c] ? 1 : e[c] < f[c] ? -1 : e.leftNew > f.leftNew ? 1 : e.leftNew < f.leftNew ? -1 : 0
            })
        }
    })
}(jQuery, window, document), jQuery.fn.cubeportfolio.options = {
        filters: "",
        search: "",
        layoutMode: "grid",
        sortToPreventGaps: !1,
        drag: !0,
        auto: !1,
        autoTimeout: 5e3,
        autoPauseOnHover: !0,
        showNavigation: !0,
        showPagination: !0,
        rewindNav: !0,
        scrollByPage: !1,
        defaultFilter: "*",
        filterDeeplinking: !1,
        animationType: "fadeOut",
        gridAdjustment: "responsive",
        mediaQueries: !1,
        gapHorizontal: 10,
        gapVertical: 10,
        caption: "pushTop",
        displayType: "fadeIn",
        displayTypeSpeed: 400,
        lightboxDelegate: ".cbp-lightbox",
        lightboxGallery: !0,
        lightboxTitleSrc: "data-title",
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        singlePageDelegate: ".cbp-singlePage",
        singlePageDeeplinking: !0,
        singlePageStickyNavigation: !0,
        singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',
        singlePageAnimation: "left",
        singlePageCallback: null,
        singlePageInlineDelegate: ".cbp-singlePageInline",
        singlePageInlineDeeplinking: !1,
        singlePageInlinePosition: "top",
        singlePageInlineInFocus: !0,
        singlePageInlineCallback: null,
        plugins: {}
    },
    function(a, b, c, d) {
        "use strict";
        var e = a.fn.cubeportfolio.constructor,
            f = a(b);
        e.private = {
            publicEvents: function(b, c, d) {
                var e = this;
                e.events = [], e.initEvent = function(a) {
                    0 === e.events.length && e.scrollEvent(), e.events.push(a)
                }, e.destroyEvent = function(c) {
                    e.events = a.map(e.events, function(a, b) {
                        if (a.instance !== c) return a
                    }), 0 === e.events.length && f.off(b)
                }, e.scrollEvent = function() {
                    var g;
                    f.on(b, function() {
                        clearTimeout(g), g = setTimeout(function() {
                            a.isFunction(d) && d.call(e) || a.each(e.events, function(a, b) {
                                b.fn.call(b.instance)
                            })
                        }, c)
                    })
                }
            },
            checkInstance: function(b) {
                var c = a.data(this, "cubeportfolio");
                if (!c) throw new Error("cubeportfolio is not initialized. Initialize it before calling " + b + " method!");
                return c.triggerEvent("publicMethod"), c
            },
            browserInfo: function() {
                var a, c, f, g = e.private,
                    h = navigator.appVersion;
                h.indexOf("MSIE 8.") !== -1 ? g.browser = "ie8" : h.indexOf("MSIE 9.") !== -1 ? g.browser = "ie9" : h.indexOf("MSIE 10.") !== -1 ? g.browser = "ie10" : b.ActiveXObject || "ActiveXObject" in b ? g.browser = "ie11" : /android/gi.test(h) ? g.browser = "android" : /iphone|ipad|ipod/gi.test(h) ? g.browser = "ios" : /chrome/gi.test(h) ? g.browser = "chrome" : g.browser = "", f = g.styleSupport("perspective"), typeof f !== d && (a = g.styleSupport("transition"), g.transitionend = {
                    WebkitTransition: "webkitTransitionEnd",
                    transition: "transitionend"
                }[a], c = g.styleSupport("animation"), g.animationend = {
                    WebkitAnimation: "webkitAnimationEnd",
                    animation: "animationend"
                }[c], g.animationDuration = {
                    WebkitAnimation: "webkitAnimationDuration",
                    animation: "animationDuration"
                }[c], g.animationDelay = {
                    WebkitAnimation: "webkitAnimationDelay",
                    animation: "animationDelay"
                }[c], g.transform = g.styleSupport("transform"), a && c && g.transform && (g.modernBrowser = !0))
            },
            styleSupport: function(a) {
                var b, d = "Webkit" + a.charAt(0).toUpperCase() + a.slice(1),
                    e = c.createElement("div");
                return a in e.style ? b = a : d in e.style && (b = d), e = null, b
            }
        }, e.private.browserInfo(), e.private.resize = new e.private.publicEvents("resize.cbp", 50, function() {
            if (b.innerHeight == screen.height) return !0
        })
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";
        var e = a.fn.cubeportfolio.constructor;
        e.public = {
            init: function(a, b) {
                new e(this, a, b)
            },
            destroy: function(b) {
                var c = e.private.checkInstance.call(this, "destroy");
                c.triggerEvent("beforeDestroy"), a.removeData(this, "cubeportfolio"), c.blocks.removeData("cbp"), c.$obj.removeClass("cbp-ready").removeAttr("style"), c.$ul.removeClass("cbp-wrapper"), e.private.resize.destroyEvent(c), c.$obj.off(".cbp"), c.blocks.removeClass("cbp-item-off").removeAttr("style"), c.blocks.find(".cbp-item-wrapper").each(function(b, c) {
                    var d = a(c),
                        e = d.children();
                    e.length ? e.unwrap() : d.remove()
                }), c.destroySlider && c.destroySlider(), c.$ul.unwrap(), c.addedWrapp && c.blocks.unwrap(), 0 === c.blocks.length && c.$ul.remove(), a.each(c.plugins, function(a, b) {
                    "function" == typeof b.destroy && b.destroy()
                }), a.isFunction(b) && b.call(c), c.triggerEvent("afterDestroy")
            },
            filter: function(b, c) {
                var f, g = e.private.checkInstance.call(this, "filter");
                if (!g.isAnimating) {
                    if (g.isAnimating = !0, a.isFunction(c) && g.registerEvent("filterFinish", c, !0), a.isFunction(b)) {
                        if (f = b.call(g, g.blocks), f === d) throw new Error("When you call cubeportfolio API `filter` method with a param of type function you must return the blocks that will be visible.")
                    } else {
                        if (g.options.filterDeeplinking) {
                            var h = location.href.replace(/#cbpf=(.*?)([#\?&]|$)/gi, "");
                            location.href = h + "#cbpf=" + encodeURIComponent(b), g.singlePage && g.singlePage.url && (g.singlePage.url = location.href)
                        }
                        g.defaultFilter = b, f = g.filterConcat(g.defaultFilter)
                    }
                    g.triggerEvent("filterStart", f), g.singlePageInline && g.singlePageInline.isOpen ? g.singlePageInline.close("promise", {
                        callback: function() {
                            g.computeFilter(f)
                        }
                    }) : g.computeFilter(f)
                }
            },
            showCounter: function(b, c) {
                var d = e.private.checkInstance.call(this, "showCounter");
                a.isFunction(c) && d.registerEvent("showCounterFinish", c, !0), d.elems = b, b.each(function() {
                    var b = a(this),
                        c = d.blocks.filter(b.data("filter")).length;
                    b.find(".cbp-filter-counter").text(c)
                }), d.triggerEvent("showCounterFinish", b)
            },
            appendItems: function(a, b) {
                e.public.append.call(this, a, b)
            },
            append: function(b, c) {
                var d = e.private.checkInstance.call(this, "append"),
                    f = a(b).filter(".cbp-item");
                return d.isAnimating || f.length < 1 ? void(a.isFunction(c) && c.call(d, f)) : (d.isAnimating = !0, void(d.singlePageInline && d.singlePageInline.isOpen ? d.singlePageInline.close("promise", {
                    callback: function() {
                        d.addItems(f, c, "append")
                    }
                }) : d.addItems(f, c, "append")))
            },
            prepend: function(b, c) {
                var d = e.private.checkInstance.call(this, "prepend"),
                    f = a(b).filter(".cbp-item");
                return d.isAnimating || f.length < 1 ? void(a.isFunction(c) && c.call(d, f)) : (d.isAnimating = !0, void(d.singlePageInline && d.singlePageInline.isOpen ? d.singlePageInline.close("promise", {
                    callback: function() {
                        d.addItems(f, c, "prepend")
                    }
                }) : d.addItems(f, c, "prepend")))
            },
            remove: function(b, c) {
                var d = e.private.checkInstance.call(this, "remove"),
                    f = a(b).filter(".cbp-item");
                return d.isAnimating || f.length < 1 ? void(a.isFunction(c) && c.call(d, f)) : (d.isAnimating = !0, void(d.singlePageInline && d.singlePageInline.isOpen ? d.singlePageInline.close("promise", {
                    callback: function() {
                        d.removeItems(f, c)
                    }
                }) : d.removeItems(f, c)))
            },
            layout: function(b) {
                var c = e.private.checkInstance.call(this, "layout");
                return c.width = c.$obj.outerWidth(), c.isAnimating || c.width <= 0 ? void(a.isFunction(b) && b.call(c)) : ("alignCenter" === c.options.gridAdjustment && (c.wrapper[0].style.maxWidth = ""), c.storeData(c.blocks), c.layoutAndAdjustment(), void(a.isFunction(b) && b.call(c)))
            }
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";
        var e = a.fn.cubeportfolio.constructor;
        a.extend(e.prototype, {
            updateSliderPagination: function() {
                var b, c, d = this;
                if (d.options.showPagination) {
                    for (b = Math.ceil(d.blocksOn.length / d.cols), d.navPagination.empty(), c = b - 1; c >= 0; c--) a("<div/>", {
                        class: "cbp-nav-pagination-item",
                        "data-slider-action": "jumpTo"
                    }).appendTo(d.navPagination);
                    d.navPaginationItems = d.navPagination.children()
                }
                d.enableDisableNavSlider()
            },
            destroySlider: function() {
                var b = this;
                "slider" === b.options.layoutMode && (b.$obj.removeClass("cbp-mode-slider"), b.$ul.removeAttr("style"), b.$ul.off(".cbp"), a(c).off(".cbp"), b.options.auto && b.stopSliderAuto())
            },
            nextSlider: function(a) {
                var b = this;
                if (b.isEndSlider()) {
                    if (!b.isRewindNav()) return;
                    b.sliderActive = 0
                } else b.options.scrollByPage ? b.sliderActive = Math.min(b.sliderActive + b.cols, b.blocksOn.length - b.cols) : b.sliderActive += 1;
                b.goToSlider()
            },
            prevSlider: function(a) {
                var b = this;
                if (b.isStartSlider()) {
                    if (!b.isRewindNav()) return;
                    b.sliderActive = b.blocksOn.length - b.cols
                } else b.options.scrollByPage ? b.sliderActive = Math.max(0, b.sliderActive - b.cols) : b.sliderActive -= 1;
                b.goToSlider()
            },
            jumpToSlider: function(a) {
                var b = this,
                    c = Math.min(a.index() * b.cols, b.blocksOn.length - b.cols);
                c !== b.sliderActive && (b.sliderActive = c, b.goToSlider())
            },
            jumpDragToSlider: function(a) {
                var b, c, d, e = this,
                    f = a > 0;
                e.options.scrollByPage ? (b = e.cols * e.columnWidth, c = e.cols) : (b = e.columnWidth, c = 1), a = Math.abs(a), d = Math.floor(a / b) * c, a % b > 20 && (d += c), f ? e.sliderActive = Math.min(e.sliderActive + d, e.blocksOn.length - e.cols) : e.sliderActive = Math.max(0, e.sliderActive - d), e.goToSlider()
            },
            isStartSlider: function() {
                return 0 === this.sliderActive
            },
            isEndSlider: function() {
                var a = this;
                return a.sliderActive + a.cols > a.blocksOn.length - 1
            },
            goToSlider: function() {
                var a = this;
                a.enableDisableNavSlider(), a.updateSliderPosition()
            },
            startSliderAuto: function() {
                var a = this;
                return a.isDrag ? void a.stopSliderAuto() : void(a.timeout = setTimeout(function() {
                    a.nextSlider(), a.startSliderAuto()
                }, a.options.autoTimeout))
            },
            stopSliderAuto: function() {
                clearTimeout(this.timeout)
            },
            enableDisableNavSlider: function() {
                var a, b, c = this;
                c.isRewindNav() || (b = c.isStartSlider() ? "addClass" : "removeClass", c.navPrev[b]("cbp-nav-stop"), b = c.isEndSlider() ? "addClass" : "removeClass", c.navNext[b]("cbp-nav-stop")), c.options.showPagination && (a = c.options.scrollByPage ? Math.ceil(c.sliderActive / c.cols) : c.isEndSlider() ? c.navPaginationItems.length - 1 : Math.floor(c.sliderActive / c.cols), c.navPaginationItems.removeClass("cbp-nav-pagination-active").eq(a).addClass("cbp-nav-pagination-active")), c.customPagination && (a = c.options.scrollByPage ? Math.ceil(c.sliderActive / c.cols) : c.isEndSlider() ? c.customPaginationItems.length - 1 : Math.floor(c.sliderActive / c.cols), c.customPaginationItems.removeClass(c.customPaginationClass).eq(a).addClass(c.customPaginationClass))
            },
            isRewindNav: function() {
                var a = this;
                return !a.options.showNavigation || !(a.blocksOn.length <= a.cols) && !!a.options.rewindNav
            },
            sliderItemsLength: function() {
                return this.blocksOn.length <= this.cols
            },
            sliderLayout: function() {
                var b = this;
                b.blocksOn.each(function(c, d) {
                    var e = a(d).data("cbp");
                    e.leftNew = b.columnWidth * c, e.topNew = 0, b.sliderFreeSpaces.push({
                        topStart: e.heightAndGap
                    })
                }), b.getFreeSpacesForSlider(), b.$ul.width(b.columnWidth * b.blocksOn.length - b.options.gapVertical)
            },
            getFreeSpacesForSlider: function() {
                var a = this;
                a.freeSpaces = a.sliderFreeSpaces.slice(a.sliderActive, a.sliderActive + a.cols), a.freeSpaces.sort(function(a, b) {
                    return a.topStart > b.topStart ? 1 : a.topStart < b.topStart ? -1 : void 0
                })
            },
            updateSliderPosition: function() {
                var a = this,
                    b = -a.sliderActive * a.columnWidth;
                e.private.modernBrowser ? a.$ul[0].style[e.private.transform] = "translate3d(" + b + "px, 0px, 0)" : a.$ul[0].style.left = b + "px", a.getFreeSpacesForSlider(), a.resizeMainContainer()
            },
            dragSlider: function() {
                function f(b) {
                    if (!q.sliderItemsLength()) {
                        if (u ? p = b : b.preventDefault(), q.options.auto && q.stopSliderAuto(), s) return void a(m).one("click.cbp", function() {
                            return !1
                        });
                        m = a(b.target), k = j(b).x, l = 0, n = -q.sliderActive * q.columnWidth, o = q.columnWidth * (q.blocksOn.length - q.cols), r.on(t.move, h), r.on(t.end, g), q.$obj.addClass("cbp-mode-slider-dragStart")
                    }
                }

                function g(a) {
                    q.$obj.removeClass("cbp-mode-slider-dragStart"), s = !0, 0 !== l ? (m.one("click.cbp", function(a) {
                        return !1
                    }), requestAnimationFrame(function() {
                        q.jumpDragToSlider(l), q.$ul.one(e.private.transitionend, i)
                    })) : i.call(q), r.off(t.move), r.off(t.end)
                }

                function h(a) {
                    l = k - j(a).x, (l > 8 || l < -8) && a.preventDefault(), q.isDrag = !0;
                    var b = n - l;
                    l < 0 && l < n ? b = (n - l) / 5 : l > 0 && n - l < -o && (b = -o + (o + n - l) / 5), e.private.modernBrowser ? q.$ul[0].style[e.private.transform] = "translate3d(" + b + "px, 0px, 0)" : q.$ul[0].style.left = b + "px"
                }

                function i() {
                    if (s = !1, q.isDrag = !1, q.options.auto) {
                        if (q.mouseIsEntered) return;
                        q.startSliderAuto()
                    }
                }

                function j(a) {
                    return a.originalEvent !== d && a.originalEvent.touches !== d && (a = a.originalEvent.touches[0]), {
                        x: a.pageX,
                        y: a.pageY
                    }
                }
                var k, l, m, n, o, p, q = this,
                    r = a(c),
                    s = !1,
                    t = {},
                    u = !1;
                q.isDrag = !1, "ontouchstart" in b || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? (t = {
                    start: "touchstart.cbp",
                    move: "touchmove.cbp",
                    end: "touchend.cbp"
                }, u = !0) : t = {
                    start: "mousedown.cbp",
                    move: "mousemove.cbp",
                    end: "mouseup.cbp"
                }, q.$ul.on(t.start, f)
            },
            sliderLayoutReset: function() {
                var a = this;
                a.freeSpaces = [], a.sliderFreeSpaces = []
            }
        })
    }(jQuery, window, document), "function" != typeof Object.create && (Object.create = function(a) {
        function b() {}
        return b.prototype = a, new b
    }),
    function() {
        for (var a = 0, b = ["moz", "webkit"], c = 0; c < b.length && !window.requestAnimationFrame; c++) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(b, c) {
            var d = (new Date).getTime(),
                e = Math.max(0, 16 - (d - a)),
                f = window.setTimeout(function() {
                    b(d + e)
                }, e);
            return a = d + e, f
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
            clearTimeout(a)
        })
    }(),
    function(a, b, c, d) {
        "use strict";

        function e(a) {
            var b = this;
            b.parent = a, a.filterLayout = b.filterLayout, a.registerEvent("computeBlocksFinish", function(b) {
                a.blocksOn2On = a.blocksOnInitial.filter(b), a.blocksOn2Off = a.blocksOnInitial.not(b)
            })
        }
        var f = a.fn.cubeportfolio.constructor;
        e.prototype.filterLayout = function() {
            function b() {
                c.blocks.removeClass("cbp-item-on2off cbp-item-off2on cbp-item-on2on").each(function(b, c) {
                    var d = a(c).data("cbp");
                    d.left = d.leftNew, d.top = d.topNew, c.style.left = d.left + "px", c.style.top = d.top + "px", c.style[f.private.transform] = ""
                }), c.blocksOff.addClass("cbp-item-off"), c.$obj.removeClass("cbp-animation-" + c.options.animationType), c.filterFinish()
            }
            var c = this;
            c.$obj.addClass("cbp-animation-" + c.options.animationType), c.blocksOn2On.addClass("cbp-item-on2on").each(function(b, c) {
                var d = a(c).data("cbp");
                c.style[f.private.transform] = "translate3d(" + (d.leftNew - d.left) + "px, " + (d.topNew - d.top) + "px, 0)"
            }), c.blocksOn2Off.addClass("cbp-item-on2off"), c.blocksOff2On = c.blocksOn.filter(".cbp-item-off").removeClass("cbp-item-off").addClass("cbp-item-off2on").each(function(b, c) {
                var d = a(c).data("cbp");
                c.style.left = d.leftNew + "px", c.style.top = d.topNew + "px"
            }), c.blocksOn2Off.length ? c.blocksOn2Off.last().data("cbp").wrapper.one(f.private.animationend, b) : c.blocksOff2On.length ? c.blocksOff2On.last().data("cbp").wrapper.one(f.private.animationend, b) : b(), c.resizeMainContainer()
        }, e.prototype.destroy = function() {
            var a = this.parent;
            a.$obj.removeClass("cbp-animation-" + a.options.animationType)
        }, f.plugins.animationClassic = function(b) {
            return !f.private.modernBrowser || a.inArray(b.options.animationType, ["boxShadow", "fadeOut", "flipBottom", "flipOut", "quicksand", "scaleSides", "skew"]) < 0 ? null : new e(b)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(a) {
            var b = this;
            b.parent = a, a.filterLayout = b.filterLayout
        }
        var f = a.fn.cubeportfolio.constructor;
        e.prototype.filterLayout = function() {
            function b() {
                c.wrapper[0].removeChild(d), "sequentially" === c.options.animationType && c.blocksOn.each(function(b, c) {
                    a(c).data("cbp").wrapper[0].style[f.private.animationDelay] = ""
                }), c.$obj.removeClass("cbp-animation-" + c.options.animationType), c.filterFinish()
            }
            var c = this,
                d = c.$ul[0].cloneNode(!0);
            d.setAttribute("class", "cbp-wrapper-helper"), c.wrapper[0].insertBefore(d, c.$ul[0]), requestAnimationFrame(function() {
                c.$obj.addClass("cbp-animation-" + c.options.animationType), c.blocksOff.addClass("cbp-item-off"), c.blocksOn.removeClass("cbp-item-off").each(function(b, d) {
                    var e = a(d).data("cbp");
                    e.left = e.leftNew, e.top = e.topNew, d.style.left = e.left + "px", d.style.top = e.top + "px", "sequentially" === c.options.animationType && (e.wrapper[0].style[f.private.animationDelay] = 60 * b + "ms")
                }), c.blocksOn.length ? c.blocksOn.last().data("cbp").wrapper.one(f.private.animationend, b) : c.blocksOnInitial.length ? c.blocksOnInitial.last().data("cbp").wrapper.one(f.private.animationend, b) : b(), c.resizeMainContainer()
            })
        }, e.prototype.destroy = function() {
            var a = this.parent;
            a.$obj.removeClass("cbp-animation-" + a.options.animationType)
        }, f.plugins.animationClone = function(b) {
            return !f.private.modernBrowser || a.inArray(b.options.animationType, ["fadeOutTop", "slideLeft", "sequentially"]) < 0 ? null : new e(b)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(a) {
            var b = this;
            b.parent = a, a.filterLayout = b.filterLayout
        }
        var f = a.fn.cubeportfolio.constructor;
        e.prototype.filterLayout = function() {
            function b() {
                c.wrapper[0].removeChild(d[0]), c.$obj.removeClass("cbp-animation-" + c.options.animationType), c.blocks.each(function(b, c) {
                    a(c).data("cbp").wrapper[0].style[f.private.animationDelay] = ""
                }), c.filterFinish()
            }
            var c = this,
                d = c.$ul.clone(!0, !0);
            d[0].setAttribute("class", "cbp-wrapper-helper"), c.wrapper[0].insertBefore(d[0], c.$ul[0]);
            var e = d.find(".cbp-item").not(".cbp-item-off");
            c.sortBlocks(e, "top"), e.children(".cbp-item-wrapper").each(function(a, b) {
                b.style[f.private.animationDelay] = 50 * a + "ms"
            }), requestAnimationFrame(function() {
                c.$obj.addClass("cbp-animation-" + c.options.animationType), c.blocksOff.addClass("cbp-item-off"), c.blocksOn.removeClass("cbp-item-off").each(function(b, c) {
                    var d = a(c).data("cbp");
                    d.left = d.leftNew, d.top = d.topNew, c.style.left = d.left + "px", c.style.top = d.top + "px", d.wrapper[0].style[f.private.animationDelay] = 50 * b + "ms"
                });
                var d = c.blocksOn.length,
                    g = e.length;
                0 === d && 0 === g ? b() : d < g ? e.last().children(".cbp-item-wrapper").one(f.private.animationend, b) : c.blocksOn.last().data("cbp").wrapper.one(f.private.animationend, b), c.resizeMainContainer()
            })
        }, e.prototype.destroy = function() {
            var a = this.parent;
            a.$obj.removeClass("cbp-animation-" + a.options.animationType)
        }, f.plugins.animationCloneDelay = function(b) {
            return !f.private.modernBrowser || a.inArray(b.options.animationType, ["3dflip", "flipOutDelay", "foldLeft", "frontRow", "rotateRoom", "rotateSides", "scaleDown", "slideDelay", "unfold"]) < 0 ? null : new e(b);
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(a) {
            var b = this;
            b.parent = a, a.filterLayout = b.filterLayout
        }
        var f = a.fn.cubeportfolio.constructor;
        e.prototype.filterLayout = function() {
            function b() {
                c.wrapper[0].removeChild(d), c.$obj.removeClass("cbp-animation-" + c.options.animationType), c.filterFinish()
            }
            var c = this,
                d = c.$ul[0].cloneNode(!0);
            d.setAttribute("class", "cbp-wrapper-helper"), c.wrapper[0].insertBefore(d, c.$ul[0]), requestAnimationFrame(function() {
                c.$obj.addClass("cbp-animation-" + c.options.animationType), c.blocksOff.addClass("cbp-item-off"), c.blocksOn.removeClass("cbp-item-off").each(function(b, c) {
                    var d = a(c).data("cbp");
                    d.left = d.leftNew, d.top = d.topNew, c.style.left = d.left + "px", c.style.top = d.top + "px"
                }), c.blocksOn.length ? c.$ul.one(f.private.animationend, b) : c.blocksOnInitial.length ? a(d).one(f.private.animationend, b) : b(), c.resizeMainContainer()
            })
        }, e.prototype.destroy = function() {
            var a = this.parent;
            a.$obj.removeClass("cbp-animation-" + a.options.animationType)
        }, f.plugins.animationWrapper = function(b) {
            return !f.private.modernBrowser || a.inArray(b.options.animationType, ["bounceBottom", "bounceLeft", "bounceTop", "moveLeft"]) < 0 ? null : new e(b)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(a) {
            var b = this,
                c = a.options;
            b.parent = a, b.captionOn = c.caption, a.registerEvent("onMediaQueries", function(a) {
                a && a.hasOwnProperty("caption") ? b.captionOn !== a.caption && (b.destroy(), b.captionOn = a.caption, b.init()) : b.captionOn !== c.caption && (b.destroy(), b.captionOn = c.caption, b.init())
            }), b.init()
        }
        var f = a.fn.cubeportfolio.constructor;
        e.prototype.init = function() {
            var a = this;
            "" != a.captionOn && ("expand" === a.captionOn || f.private.modernBrowser || (a.parent.options.caption = a.captionOn = "minimal"), a.parent.$obj.addClass("cbp-caption-active cbp-caption-" + a.captionOn))
        }, e.prototype.destroy = function() {
            this.parent.$obj.removeClass("cbp-caption-active cbp-caption-" + this.captionOn)
        }, f.plugins.caption = function(a) {
            return new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            var c = this;
            c.parent = b, b.registerEvent("initFinish", function() {
                b.$obj.on("click.cbp", ".cbp-caption-defaultWrap", function(c) {
                    if (c.preventDefault(), !b.isAnimating) {
                        b.isAnimating = !0;
                        var d = a(this),
                            e = d.next(),
                            f = d.parent(),
                            g = {
                                position: "relative",
                                height: e.outerHeight(!0)
                            },
                            h = {
                                position: "relative",
                                height: 0
                            };
                        if (b.$obj.addClass("cbp-caption-expand-active"), f.hasClass("cbp-caption-expand-open")) {
                            var i = h;
                            h = g, g = i, f.removeClass("cbp-caption-expand-open")
                        }
                        e.css(g), b.$obj.one("pluginResize.cbp", function() {
                            b.isAnimating = !1, b.$obj.removeClass("cbp-caption-expand-active"), 0 === g.height && (f.removeClass("cbp-caption-expand-open"), e.attr("style", ""))
                        }), b.layoutAndAdjustment(!0), e.css(h), requestAnimationFrame(function() {
                            f.addClass("cbp-caption-expand-open"), e.css(g), b.triggerEvent("gridAdjust"), b.triggerEvent("resizeGrid")
                        })
                    }
                })
            }, !0)
        }
        var f = a.fn.cubeportfolio.constructor;
        e.prototype.destroy = function() {
            this.parent.$obj.find(".cbp-caption-defaultWrap").off("click.cbp").parent().removeClass("cbp-caption-expand-active")
        }, f.plugins.captionExpand = function(a) {
            return "expand" !== a.options.caption ? null : new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            b.registerEvent("initEndWrite", function() {
                if (!(b.width <= 0)) {
                    var c = a.Deferred();
                    b.pushQueue("delayFrame", c), b.blocksOn.each(function(a, c) {
                        c.style[f.private.animationDelay] = a * b.options.displayTypeSpeed + "ms"
                    }), b.$obj.addClass("cbp-displayType-bottomToTop"), b.blocksOn.last().one(f.private.animationend, function() {
                        b.$obj.removeClass("cbp-displayType-bottomToTop"), b.blocksOn.each(function(a, b) {
                            b.style[f.private.animationDelay] = ""
                        }), c.resolve()
                    })
                }
            }, !0)
        }
        var f = a.fn.cubeportfolio.constructor;
        f.plugins.displayBottomToTop = function(a) {
            return f.private.modernBrowser && "bottomToTop" === a.options.displayType && 0 !== a.blocksOn.length ? new e(a) : null
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            b.registerEvent("initEndWrite", function() {
                if (!(b.width <= 0)) {
                    var c = a.Deferred();
                    b.pushQueue("delayFrame", c), b.obj.style[f.private.animationDuration] = b.options.displayTypeSpeed + "ms", b.$obj.addClass("cbp-displayType-fadeIn"), b.$obj.one(f.private.animationend, function() {
                        b.$obj.removeClass("cbp-displayType-fadeIn"), b.obj.style[f.private.animationDuration] = "", c.resolve()
                    })
                }
            }, !0)
        }
        var f = a.fn.cubeportfolio.constructor;
        f.plugins.displayFadeIn = function(a) {
            return !f.private.modernBrowser || "lazyLoading" !== a.options.displayType && "fadeIn" !== a.options.displayType || 0 === a.blocksOn.length ? null : new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            b.registerEvent("initEndWrite", function() {
                if (!(b.width <= 0)) {
                    var c = a.Deferred();
                    b.pushQueue("delayFrame", c), b.obj.style[f.private.animationDuration] = b.options.displayTypeSpeed + "ms", b.$obj.addClass("cbp-displayType-fadeInToTop"), b.$obj.one(f.private.animationend, function() {
                        b.$obj.removeClass("cbp-displayType-fadeInToTop"), b.obj.style[f.private.animationDuration] = "", c.resolve()
                    })
                }
            }, !0)
        }
        var f = a.fn.cubeportfolio.constructor;
        f.plugins.displayFadeInToTop = function(a) {
            return f.private.modernBrowser && "fadeInToTop" === a.options.displayType && 0 !== a.blocksOn.length ? new e(a) : null
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            b.registerEvent("initEndWrite", function() {
                if (!(b.width <= 0)) {
                    var c = a.Deferred();
                    b.pushQueue("delayFrame", c), b.blocksOn.each(function(a, c) {
                        c.style[f.private.animationDelay] = a * b.options.displayTypeSpeed + "ms"
                    }), b.$obj.addClass("cbp-displayType-sequentially"), b.blocksOn.last().one(f.private.animationend, function() {
                        b.$obj.removeClass("cbp-displayType-sequentially"), b.blocksOn.each(function(a, b) {
                            b.style[f.private.animationDelay] = ""
                        }), c.resolve()
                    })
                }
            }, !0)
        }
        var f = a.fn.cubeportfolio.constructor;
        f.plugins.displaySequentially = function(a) {
            return f.private.modernBrowser && "sequentially" === a.options.displayType && 0 !== a.blocksOn.length ? new e(a) : null
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            var c = this;
            c.parent = b, c.filters = a(b.options.filters), c.filterData = [], b.registerEvent("afterPlugins", function(a) {
                c.filterFromUrl(), c.registerFilter()
            }), b.registerEvent("resetFiltersVisual", function() {
                var d = b.options.defaultFilter.split("|");
                c.filters.each(function(b, c) {
                    var e = a(c).find(".cbp-filter-item");
                    a.each(d, function(a, b) {
                        var c = e.filter('[data-filter="' + b + '"]');
                        if (c.length) return c.addClass("cbp-filter-item-active").siblings().removeClass("cbp-filter-item-active"), d.splice(a, 1), !1
                    })
                }), b.defaultFilter = b.options.defaultFilter
            })
        }
        var f = a.fn.cubeportfolio.constructor;
        e.prototype.registerFilter = function() {
            var b = this,
                c = b.parent,
                d = c.defaultFilter.split("|");
            b.wrap = b.filters.find(".cbp-l-filters-dropdownWrap").on({
                "mouseover.cbp": function() {
                    a(this).addClass("cbp-l-filters-dropdownWrap-open")
                },
                "mouseleave.cbp": function() {
                    a(this).removeClass("cbp-l-filters-dropdownWrap-open")
                }
            }), b.filters.each(function(e, f) {
                var g = a(f),
                    h = "*",
                    i = g.find(".cbp-filter-item"),
                    j = {};
                g.hasClass("cbp-l-filters-dropdown") && (j.wrap = g.find(".cbp-l-filters-dropdownWrap"), j.header = g.find(".cbp-l-filters-dropdownHeader"), j.headerText = j.header.text()), c.$obj.cubeportfolio("showCounter", i), a.each(d, function(a, b) {
                    if (i.filter('[data-filter="' + b + '"]').length) return h = b, d.splice(a, 1), !1
                }), a.data(f, "filterName", h), b.filterData.push(f), b.filtersCallback(j, i.filter('[data-filter="' + h + '"]')), i.on("click.cbp", function() {
                    var d = a(this);
                    if (!d.hasClass("cbp-filter-item-active") && !c.isAnimating) {
                        b.filtersCallback(j, d), a.data(f, "filterName", d.data("filter"));
                        var e = a.map(b.filterData, function(b, c) {
                            var d = a.data(b, "filterName");
                            return "" !== d && "*" !== d ? d : null
                        });
                        e.length < 1 && (e = ["*"]);
                        var g = e.join("|");
                        c.defaultFilter !== g && c.$obj.cubeportfolio("filter", g)
                    }
                })
            })
        }, e.prototype.filtersCallback = function(b, c) {
            a.isEmptyObject(b) || (b.wrap.trigger("mouseleave.cbp"), b.headerText ? b.headerText = "" : b.header.html(c.html())), c.addClass("cbp-filter-item-active").siblings().removeClass("cbp-filter-item-active")
        }, e.prototype.filterFromUrl = function() {
            var a = /#cbpf=(.*?)([#\?&]|$)/gi.exec(location.href);
            null !== a && (this.parent.defaultFilter = decodeURIComponent(a[1]))
        }, e.prototype.destroy = function() {
            var a = this;
            a.filters.find(".cbp-filter-item").off(".cbp"), a.wrap.off(".cbp")
        }, f.plugins.filters = function(a) {
            return "" === a.options.filters ? null : new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            var c = b.options.gapVertical,
                d = b.options.gapHorizontal;
            b.registerEvent("onMediaQueries", function(e) {
                b.options.gapVertical = e && e.hasOwnProperty("gapVertical") ? e.gapVertical : c, b.options.gapHorizontal = e && e.hasOwnProperty("gapHorizontal") ? e.gapHorizontal : d, b.blocks.each(function(c, d) {
                    var e = a(d).data("cbp");
                    e.widthAndGap = e.width + b.options.gapVertical, e.heightAndGap = e.height + b.options.gapHorizontal
                })
            })
        }
        var f = a.fn.cubeportfolio.constructor;
        f.plugins.changeGapOnMediaQueries = function(a) {
            return new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            var c = this;
            c.parent = b, c.options = a.extend({}, g, c.parent.options.plugins.inlineSlider), c.runInit(), b.registerEvent("addItemsToDOM", function() {
                c.runInit()
            })
        }

        function f(a) {
            var b = this;
            a.hasClass("cbp-slider-inline-ready") || (a.addClass("cbp-slider-inline-ready"), b.items = a.find(".cbp-slider-wrapper").children(".cbp-slider-item"), b.active = b.items.filter(".cbp-slider-item--active").index(), b.total = b.items.length - 1, b.updateLeft(), a.find(".cbp-slider-next").on("click.cbp", function(a) {
                a.preventDefault(), b.active < b.total ? (b.active++, b.updateLeft()) : b.active === b.total && (b.active = 0, b.updateLeft())
            }), a.find(".cbp-slider-prev").on("click.cbp", function(a) {
                a.preventDefault(), b.active > 0 ? (b.active--, b.updateLeft()) : 0 === b.active && (b.active = b.total, b.updateLeft())
            }))
        }
        var g = {},
            h = a.fn.cubeportfolio.constructor;
        f.prototype.updateLeft = function() {
            var a = this;
            a.items.removeClass("cbp-slider-item--active"), a.items.eq(a.active).addClass("cbp-slider-item--active"), a.items.each(function(b, c) {
                c.style.left = b - a.active + "00%"
            })
        }, e.prototype.runInit = function() {
            var b = this;
            b.parent.$obj.find(".cbp-slider-inline").not(".cbp-slider-inline-ready").each(function(c, d) {
                var e = a(d),
                    g = e.find(".cbp-slider-item--active").find("img")[0];
                g.hasAttribute("data-cbp-src") ? b.parent.$obj.on("lazyLoad.cbp", function(a, b) {
                    b.src === g.src && new f(e)
                }) : new f(e)
            })
        }, e.prototype.destroy = function() {
            var b = this;
            b.parent.$obj.find(".cbp-slider-next").off("click.cbp"), b.parent.$obj.find(".cbp-slider-prev").off("click.cbp"), b.parent.$obj.off("lazyLoad.cbp"), b.parent.$obj.find(".cbp-slider-inline").each(function(b, c) {
                var d = a(c);
                d.removeClass("cbp-slider-inline-ready");
                var e = d.find(".cbp-slider-item");
                e.removeClass("cbp-slider-item--active"), e.removeAttr("style"), e.eq(0).addClass("cbp-slider-item--active")
            })
        }, h.plugins.inlineSlider = function(a) {
            return new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            var c = this;
            c.parent = b, c.options = a.extend({}, f, c.parent.options.plugins.lazyLoad), b.registerEvent("initFinish", function() {
                c.loadImages(), b.registerEvent("resizeMainContainer", function() {
                    c.loadImages()
                }), b.registerEvent("filterFinish", function() {
                    c.loadImages()
                }), g.private.lazyLoadScroll.initEvent({
                    instance: c,
                    fn: c.loadImages
                })
            }, !0)
        }
        var f = {
                loadingClass: "cbp-lazyload",
                threshold: 400
            },
            g = a.fn.cubeportfolio.constructor,
            h = a(b);
        g.private.lazyLoadScroll = new g.private.publicEvents("scroll.cbplazyLoad", 50), e.prototype.loadImages = function() {
            var b = this,
                c = b.parent.$obj.find("img").filter("[data-cbp-src]");
            0 !== c.length && (b.screenHeight = h.height(), c.each(function(c, d) {
                var e = a(d.parentNode);
                if (!b.isElementInScreen(d)) return void e.addClass(b.options.loadingClass);
                var f = d.getAttribute("data-cbp-src");
                null === b.parent.checkSrc(a("<img>").attr("src", f)) ? (b.removeLazyLoad(d, f), e.removeClass(b.options.loadingClass)) : (e.addClass(b.options.loadingClass), a("<img>").on("load.cbp error.cbp", function() {
                    b.removeLazyLoad(d, f, e)
                }).attr("src", f))
            }))
        }, e.prototype.removeLazyLoad = function(b, c, d) {
            var e = this;
            b.src = c, b.removeAttribute("data-cbp-src"), e.parent.removeAttrImage(b), e.parent.$obj.trigger("lazyLoad.cbp", b), d && (g.private.modernBrowser ? a(b).one(g.private.transitionend, function() {
                d.removeClass(e.options.loadingClass)
            }) : d.removeClass(e.options.loadingClass))
        }, e.prototype.isElementInScreen = function(a) {
            var b = this,
                c = a.getBoundingClientRect(),
                d = c.bottom + b.options.threshold,
                e = b.screenHeight + d - (c.top - b.options.threshold);
            return d >= 0 && d <= e
        }, e.prototype.destroy = function() {
            g.private.lazyLoadScroll.destroyEvent(this)
        }, g.plugins.lazyLoad = function(a) {
            return new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            var c = this;
            c.parent = b, c.options = a.extend({}, f, c.parent.options.plugins.loadMore), c.loadMore = a(c.options.selector).find(".cbp-l-loadMore-link"), 0 !== c.loadMore.length && (c.loadItems = c.loadMore.find(".cbp-l-loadMore-loadItems"), "0" === c.loadItems.text() && c.loadMore.addClass("cbp-l-loadMore-stop"), b.registerEvent("filterStart", function(a) {
                c.populateItems().then(function() {
                    var b = c.items.filter(a).length;
                    b > 0 ? (c.loadMore.removeClass("cbp-l-loadMore-stop"), c.loadItems.html(b)) : c.loadMore.addClass("cbp-l-loadMore-stop")
                })
            }), c[c.options.action]())
        }
        var f = {
                selector: "",
                action: "click",
                loadItems: 3
            },
            g = a.fn.cubeportfolio.constructor;
        e.prototype.populateItems = function() {
            var b = this;
            return b.items ? a.Deferred().resolve() : (b.items = a(), a.ajax({
                url: b.loadMore.attr("href"),
                type: "GET",
                dataType: "HTML"
            }).done(function(c) {
                var d = a.map(c.split(/\r?\n/), function(b, c) {
                    return a.trim(b)
                }).join("");
                0 !== d.length && a.each(a.parseHTML(d), function(c, d) {
                    a(d).hasClass("cbp-item") ? b.items = b.items.add(d) : a.each(d.children, function(c, d) {
                        a(d).hasClass("cbp-item") && (b.items = b.items.add(d))
                    })
                })
            }).fail(function() {
                b.items = null, b.loadMore.removeClass("cbp-l-loadMore-loading")
            }))
        }, e.prototype.populateInsertItems = function(b) {
            var c = this,
                d = [],
                e = c.parent.defaultFilter,
                f = 0;
            return c.items.each(function(b, g) {
                return f !== c.options.loadItems && void(e && "*" !== e ? a(g).filter(e).length && (d.push(g), c.items[b] = null, f++) : (d.push(g), c.items[b] = null, f++))
            }), c.items = c.items.map(function(a, b) {
                return b
            }), 0 === d.length ? void c.loadMore.removeClass("cbp-l-loadMore-loading").addClass("cbp-l-loadMore-stop") : void c.parent.$obj.cubeportfolio("append", d, b)
        }, e.prototype.click = function() {
            function a() {
                b.loadMore.removeClass("cbp-l-loadMore-loading");
                var a, c = b.parent.defaultFilter;
                a = c && "*" !== c ? b.items.filter(c).length : b.items.length, 0 === a ? b.loadMore.addClass("cbp-l-loadMore-stop") : b.loadItems.html(a)
            }
            var b = this;
            b.loadMore.on("click.cbp", function(c) {
                c.preventDefault(), b.parent.isAnimating || b.loadMore.hasClass("cbp-l-loadMore-stop") || (b.loadMore.addClass("cbp-l-loadMore-loading"), b.populateItems().then(function() {
                    b.populateInsertItems(a)
                }))
            })
        }, e.prototype.auto = function() {
            function c() {
                if (!h && !e.loadMore.hasClass("cbp-l-loadMore-stop")) {
                    var a = e.loadMore.offset().top - 200,
                        b = f.scrollTop() + f.height();
                    a > b || (h = !0, e.populateItems().then(function() {
                        e.populateInsertItems(d)
                    }).fail(function() {
                        h = !1
                    }))
                }
            }

            function d() {
                var a, b = e.parent.defaultFilter;
                a = b && "*" !== b ? e.items.filter(b).length : e.items.length, 0 === a ? e.loadMore.removeClass("cbp-l-loadMore-loading").addClass("cbp-l-loadMore-stop") : (e.loadItems.html(a), f.trigger("scroll.loadMore")), h = !1, 0 === e.items.length && (g.private.loadMoreScroll.destroyEvent(e), e.parent.$obj.off("filterComplete.cbp"))
            }
            var e = this,
                f = a(b),
                h = !1;
            g.private.loadMoreScroll = new g.private.publicEvents("scroll.loadMore", 100), e.parent.$obj.one("initComplete.cbp", function() {
                e.loadMore.addClass("cbp-l-loadMore-loading").on("click.cbp", function(a) {
                    a.preventDefault()
                }), g.private.loadMoreScroll.initEvent({
                    instance: e,
                    fn: function() {
                        e.parent.isAnimating || c()
                    }
                }), e.parent.$obj.on("filterComplete.cbp", function() {
                    c()
                }), c()
            })
        }, e.prototype.destroy = function() {
            this.loadMore.off(".cbp"), g.private.loadMoreScroll && g.private.loadMoreScroll.destroyEvent(this)
        }, g.plugins.loadMore = function(a) {
            var b = a.options.plugins;
            return a.options.loadMore && (b.loadMore || (b.loadMore = {}), b.loadMore.selector = a.options.loadMore), a.options.loadMoreAction && (b.loadMore || (b.loadMore = {}), b.loadMore.action = a.options.loadMoreAction), b.loadMore && b.loadMore.selector ? new e(a) : null
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(a) {
            var b = this;
            b.parent = a, a.options.lightboxShowCounter === !1 && (a.options.lightboxCounter = ""), a.options.singlePageShowCounter === !1 && (a.options.singlePageCounter = ""), a.registerEvent("initStartRead", function() {
                b.run()
            }, !0)
        }
        var f = a.fn.cubeportfolio.constructor,
            g = {
                delay: 0
            },
            h = {
                init: function(b, d) {
                    var e, f = this;
                    if (f.cubeportfolio = b, f.type = d, f.isOpen = !1, f.options = f.cubeportfolio.options, "lightbox" === d && (f.cubeportfolio.registerEvent("resizeWindow", function() {
                            f.resizeImage()
                        }), f.localOptions = a.extend({}, g, f.cubeportfolio.options.plugins.lightbox)), "singlePageInline" === d) {
                        if (f.height = 0, f.createMarkupSinglePageInline(), f.cubeportfolio.registerEvent("resizeGrid", function() {
                                f.isOpen && f.close()
                            }), f.options.singlePageInlineDeeplinking) {
                            f.url = location.href, "#" === f.url.slice(-1) && (f.url = f.url.slice(0, -1));
                            var h = f.url.split("#cbpi="),
                                i = h.shift();
                            a.each(h, function(b, c) {
                                if (f.cubeportfolio.blocksOn.each(function(b, d) {
                                        var g = a(d).find(f.options.singlePageInlineDelegate + '[href="' + c + '"]');
                                        if (g.length) return e = g, !1
                                    }), e) return !1
                            }), e && f.cubeportfolio.registerEvent("initFinish", function() {
                                f.openSinglePageInline(f.cubeportfolio.blocksOn, e[0])
                            }, !0)
                        }
                        return void(f.localOptions = a.extend({}, g, f.cubeportfolio.options.plugins.singlePageInline))
                    }
                    if (f.createMarkup(), "singlePage" === d) {
                        if (f.cubeportfolio.registerEvent("resizeWindow", function() {
                                if (f.options.singlePageStickyNavigation) {
                                    var a = f.contentWrap[0].clientWidth;
                                    a > 0 && (f.navigationWrap.width(a), f.navigation.width(a))
                                }
                            }), f.options.singlePageDeeplinking) {
                            f.url = location.href, "#" === f.url.slice(-1) && (f.url = f.url.slice(0, -1));
                            var h = f.url.split("#cbp="),
                                i = h.shift();
                            if (a.each(h, function(b, c) {
                                    if (f.cubeportfolio.blocksOn.each(function(b, d) {
                                            var g = a(d).find(f.options.singlePageDelegate + '[href="' + c + '"]');
                                            if (g.length) return e = g, !1
                                        }), e) return !1
                                }), e) {
                                f.url = i;
                                var j = e,
                                    k = j.attr("data-cbp-singlePage"),
                                    l = [];
                                k ? l = j.closest(a(".cbp-item")).find('[data-cbp-singlePage="' + k + '"]') : f.cubeportfolio.blocksOn.each(function(b, c) {
                                    var d = a(c);
                                    d.not(".cbp-item-off") && d.find(f.options.singlePageDelegate).each(function(b, c) {
                                        a(c).attr("data-cbp-singlePage") || l.push(c)
                                    })
                                }), f.openSinglePage(l, e[0])
                            } else if (h.length) {
                                var m = c.createElement("a");
                                m.setAttribute("href", h[0]), f.openSinglePage([m], m)
                            }
                        }
                        f.localOptions = a.extend({}, g, f.cubeportfolio.options.plugins.singlePage)
                    }
                },
                createMarkup: function() {
                    var b = this,
                        e = "";
                    "singlePage" === b.type && "left" !== b.options.singlePageAnimation && (e = " cbp-popup-singlePage-" + b.options.singlePageAnimation), b.wrap = a("<div/>", {
                        class: "cbp-popup-wrap cbp-popup-" + b.type + e,
                        "data-action": "lightbox" === b.type ? "close" : ""
                    }).on("click.cbp", function(c) {
                        if (!b.stopEvents) {
                            var d = a(c.target).attr("data-action");
                            b[d] && (b[d](), c.preventDefault())
                        }
                    }), "singlePage" === b.type ? (b.contentWrap = a("<div/>", {
                        class: "cbp-popup-content-wrap"
                    }).appendTo(b.wrap), "ios" === f.private.browser && b.contentWrap.css("overflow", "auto"), b.content = a("<div/>", {
                        class: "cbp-popup-content"
                    }).appendTo(b.contentWrap)) : b.content = a("<div/>", {
                        class: "cbp-popup-content"
                    }).appendTo(b.wrap), a("<div/>", {
                        class: "cbp-popup-loadingBox"
                    }).appendTo(b.wrap), "ie8" === f.private.browser && (b.bg = a("<div/>", {
                        class: "cbp-popup-ie8bg",
                        "data-action": "lightbox" === b.type ? "close" : ""
                    }).appendTo(b.wrap)), "singlePage" === b.type && b.options.singlePageStickyNavigation === !1 ? b.navigationWrap = a("<div/>", {
                        class: "cbp-popup-navigation-wrap"
                    }).appendTo(b.contentWrap) : b.navigationWrap = a("<div/>", {
                        class: "cbp-popup-navigation-wrap"
                    }).appendTo(b.wrap), b.navigation = a("<div/>", {
                        class: "cbp-popup-navigation"
                    }).appendTo(b.navigationWrap), b.closeButton = a("<div/>", {
                        class: "cbp-popup-close",
                        title: "Close (Esc arrow key)",
                        "data-action": "close"
                    }).appendTo(b.navigation), b.nextButton = a("<div/>", {
                        class: "cbp-popup-next",
                        title: "Next (Right arrow key)",
                        "data-action": "next"
                    }).appendTo(b.navigation), b.prevButton = a("<div/>", {
                        class: "cbp-popup-prev",
                        title: "Previous (Left arrow key)",
                        "data-action": "prev"
                    }).appendTo(b.navigation), "singlePage" === b.type && (b.options.singlePageCounter && (b.counter = a(b.options.singlePageCounter).appendTo(b.navigation), b.counter.text("")), b.content.on("click.cbp", b.options.singlePageDelegate, function(a) {
                        a.preventDefault();
                        var e, f, g = b.dataArray.length,
                            h = this.getAttribute("href");
                        for (e = 0; e < g; e++)
                            if (b.dataArray[e].url === h) {
                                f = e;
                                break
                            }
                        if (f === d) {
                            var i = c.createElement("a");
                            i.setAttribute("href", h), b.dataArray = [{
                                url: h,
                                element: i
                            }], b.counterTotal = 1, b.nextButton.hide(), b.prevButton.hide(), b.singlePageJumpTo(0)
                        } else b.singlePageJumpTo(f - b.current)
                    }), b.contentWrap.on("mousewheel.cbp DOMMouseScroll.cbp", function(a) {
                        a.stopImmediatePropagation()
                    })), a(c).on("keydown.cbp", function(a) {
                        b.isOpen && (b.stopEvents || (i && a.stopImmediatePropagation(), 37 === a.keyCode ? b.prev() : 39 === a.keyCode ? b.next() : 27 === a.keyCode && b.close()))
                    })
                },
                createMarkupSinglePageInline: function() {
                    var b = this;
                    b.wrap = a("<div/>", {
                        class: "cbp-popup-singlePageInline"
                    }).on("click.cbp", function(c) {
                        if (!b.stopEvents) {
                            var d = a(c.target).attr("data-action");
                            d && b[d] && (b[d](), c.preventDefault())
                        }
                    }), b.content = a("<div/>", {
                        class: "cbp-popup-content"
                    }).appendTo(b.wrap), b.navigation = a("<div/>", {
                        class: "cbp-popup-navigation"
                    }).appendTo(b.wrap), b.closeButton = a("<div/>", {
                        class: "cbp-popup-close",
                        title: "Close (Esc arrow key)",
                        "data-action": "close"
                    }).appendTo(b.navigation)
                },
                destroy: function() {
                    var b = this,
                        d = a("body");
                    a(c).off("keydown.cbp"), d.off("click.cbp", b.options.lightboxDelegate), d.off("click.cbp", b.options.singlePageDelegate), b.content.off("click.cbp", b.options.singlePageDelegate), b.cubeportfolio.$obj.off("click.cbp", b.options.singlePageInlineDelegate), b.cubeportfolio.$obj.off("click.cbp", b.options.lightboxDelegate), b.cubeportfolio.$obj.off("click.cbp", b.options.singlePageDelegate), b.cubeportfolio.$obj.removeClass("cbp-popup-isOpening"), b.cubeportfolio.$obj.find(".cbp-item").removeClass("cbp-singlePageInline-active"), b.wrap.remove()
                },
                openLightbox: function(d, e) {
                    var f, g, h = this,
                        j = 0,
                        k = [];
                    if (!h.isOpen) {
                        if (i = !0, h.isOpen = !0, h.stopEvents = !1, h.dataArray = [], h.current = null, f = e.getAttribute("href"), null === f) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                        a.each(d, function(b, c) {
                            var d, e = c.getAttribute("href"),
                                g = e,
                                i = "isImage";
                            if (a.inArray(e, k) === -1) {
                                if (f === e) h.current = j;
                                else if (!h.options.lightboxGallery) return;
                                if (/youtu\.?be/i.test(e)) {
                                    var l = e.lastIndexOf("v=") + 2;
                                    1 === l && (l = e.lastIndexOf("/") + 1), d = e.substring(l), /autoplay=/i.test(d) || (d += "&autoplay=1"), d = d.replace(/\?|&/, "?"), g = "//www.youtube.com/embed/" + d, i = "isYoutube"
                                } else /vimeo\.com/i.test(e) ? (d = e.substring(e.lastIndexOf("/") + 1), /autoplay=/i.test(d) || (d += "&autoplay=1"), d = d.replace(/\?|&/, "?"), g = "//player.vimeo.com/video/" + d, i = "isVimeo") : /www\.ted\.com/i.test(e) ? (g = "http://embed.ted.com/talks/" + e.substring(e.lastIndexOf("/") + 1) + ".html", i = "isTed") : /soundcloud\.com/i.test(e) ? (g = e, i = "isSoundCloud") : /(\.mp4)|(\.ogg)|(\.ogv)|(\.webm)/i.test(e) ? (g = e.indexOf("|") !== -1 ? e.split("|") : e.split("%7C"), i = "isSelfHostedVideo") : /\.mp3$/i.test(e) && (g = e, i = "isSelfHostedAudio");
                                h.dataArray.push({
                                    src: g,
                                    title: c.getAttribute(h.options.lightboxTitleSrc),
                                    type: i
                                }), j++
                            }
                            k.push(e)
                        }), h.counterTotal = h.dataArray.length, 1 === h.counterTotal ? (h.nextButton.hide(), h.prevButton.hide(), h.dataActionImg = "") : (h.nextButton.show(), h.prevButton.show(), h.dataActionImg = 'data-action="next"'), h.wrap.appendTo(c.body), h.scrollTop = a(b).scrollTop(), h.originalStyle = a("html").attr("style"), a("html").css({
                            overflow: "hidden",
                            marginRight: b.innerWidth - a(c).width()
                        }), h.wrap.addClass("cbp-popup-transitionend"), h.wrap.show(), g = h.dataArray[h.current], h[g.type](g)
                    }
                },
                openSinglePage: function(d, e) {
                    var g, h = this,
                        i = 0,
                        j = [];
                    if (!h.isOpen) {
                        if (h.cubeportfolio.singlePageInline && h.cubeportfolio.singlePageInline.isOpen && h.cubeportfolio.singlePageInline.close(), h.isOpen = !0, h.stopEvents = !1, h.dataArray = [], h.current = null, g = e.getAttribute("href"), null === g) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                        if (a.each(d, function(b, c) {
                                var d = c.getAttribute("href");
                                a.inArray(d, j) === -1 && (g === d && (h.current = i), h.dataArray.push({
                                    url: d,
                                    element: c
                                }), i++), j.push(d)
                            }), h.counterTotal = h.dataArray.length, 1 === h.counterTotal ? (h.nextButton.hide(), h.prevButton.hide()) : (h.nextButton.show(), h.prevButton.show()), h.wrap.appendTo(c.body), h.scrollTop = a(b).scrollTop(), h.contentWrap.scrollTop(0), h.wrap.show(), h.finishOpen = 2, h.navigationMobile = a(), h.wrap.one(f.private.transitionend, function() {
                                a("html").css({
                                    overflow: "hidden",
                                    marginRight: b.innerWidth - a(c).width()
                                }), h.wrap.addClass("cbp-popup-transitionend"), h.options.singlePageStickyNavigation && (h.wrap.addClass("cbp-popup-singlePage-sticky"), h.navigationWrap.width(h.contentWrap[0].clientWidth)), h.finishOpen--, h.finishOpen <= 0 && h.updateSinglePageIsOpen.call(h)
                            }), "ie8" !== f.private.browser && "ie9" !== f.private.browser || (a("html").css({
                                overflow: "hidden",
                                marginRight: b.innerWidth - a(c).width()
                            }), h.wrap.addClass("cbp-popup-transitionend"), h.options.singlePageStickyNavigation && (h.navigationWrap.width(h.contentWrap[0].clientWidth), setTimeout(function() {
                                h.wrap.addClass("cbp-popup-singlePage-sticky")
                            }, 1e3)), h.finishOpen--), h.wrap.addClass("cbp-popup-loading"), h.wrap.offset(), h.wrap.addClass("cbp-popup-singlePage-open"), h.options.singlePageDeeplinking && (h.url = h.url.split("#cbp=")[0], location.href = h.url + "#cbp=" + h.dataArray[h.current].url), a.isFunction(h.options.singlePageCallback) && h.options.singlePageCallback.call(h, h.dataArray[h.current].url, h.dataArray[h.current].element), "ios" === f.private.browser) {
                            var k = h.contentWrap[0];
                            k.addEventListener("touchstart", function() {
                                var a = k.scrollTop,
                                    b = k.scrollHeight,
                                    c = a + k.offsetHeight;
                                0 === a ? k.scrollTop = 1 : c === b && (k.scrollTop = a - 1)
                            })
                        }
                    }
                },
                openSinglePageInline: function(c, d, e) {
                    var f, g, h, i, j = this;
                    if (e = e || !1, j.fromOpen = e, j.storeBlocks = c, j.storeCurrentBlock = d, j.isOpen) return g = j.cubeportfolio.blocksOn.index(a(d).closest(".cbp-item")), void(j.dataArray[j.current].url !== d.getAttribute("href") || j.current !== g ? j.cubeportfolio.singlePageInline.close("open", {
                        blocks: c,
                        currentBlock: d,
                        fromOpen: !0
                    }) : j.close());
                    if (j.isOpen = !0, j.stopEvents = !1, j.dataArray = [], j.current = null, f = d.getAttribute("href"), null === f) throw new Error("HEI! Your clicked element doesn't have a href attribute.");
                    if (h = a(d).closest(".cbp-item")[0], c.each(function(a, b) {
                            h === b && (j.current = a)
                        }), j.dataArray[j.current] = {
                            url: f,
                            element: d
                        }, i = a(j.dataArray[j.current].element).parents(".cbp-item").addClass("cbp-singlePageInline-active"), j.counterTotal = c.length, j.wrap.insertBefore(j.cubeportfolio.wrapper), j.topDifference = 0, "top" === j.options.singlePageInlinePosition) j.blocksToMove = c, j.top = 0;
                    else if ("bottom" === j.options.singlePageInlinePosition) j.blocksToMove = a(), j.top = j.cubeportfolio.height;
                    else if ("above" === j.options.singlePageInlinePosition) {
                        var k = a(c[j.current]),
                            l = k.data("cbp").top,
                            m = l + k.height();
                        j.top = l, j.blocksToMove = a(), c.each(function(b, c) {
                            var d = a(c),
                                e = d.data("cbp").top,
                                f = e + d.height();
                            f <= l || (e >= l && (j.blocksToMove = j.blocksToMove.add(c)), e < l && f > l && (j.top = f + j.options.gapHorizontal, f - l > j.topDifference && (j.topDifference = f - l + j.options.gapHorizontal)))
                        }), j.top = Math.max(j.top - j.options.gapHorizontal, 0)
                    } else {
                        var k = a(c[j.current]),
                            l = k.data("cbp").top,
                            m = l + k.height();
                        j.top = m, j.blocksToMove = a(), c.each(function(b, c) {
                            var d = a(c),
                                e = d.height(),
                                f = d.data("cbp").top,
                                g = f + e;
                            if (!(g <= m)) return f >= m - e / 2 ? void(j.blocksToMove = j.blocksToMove.add(c)) : void(g > m && f < m && (g > j.top && (j.top = g), g - m > j.topDifference && (j.topDifference = g - m)))
                        })
                    }
                    if (j.wrap[0].style.height = j.wrap.outerHeight(!0) + "px", j.deferredInline = a.Deferred(), j.options.singlePageInlineInFocus) {
                        j.scrollTop = a(b).scrollTop();
                        var n = j.cubeportfolio.$obj.offset().top + j.top - 100;
                        j.scrollTop !== n ? a("html,body").animate({
                            scrollTop: n
                        }, 350).promise().then(function() {
                            j.resizeSinglePageInline(), j.deferredInline.resolve()
                        }) : (j.resizeSinglePageInline(), j.deferredInline.resolve())
                    } else j.resizeSinglePageInline(), j.deferredInline.resolve();
                    j.cubeportfolio.$obj.addClass("cbp-popup-singlePageInline-open"), j.wrap.css({
                        top: j.top
                    }), j.options.singlePageInlineDeeplinking && (j.url = j.url.split("#cbpi=")[0], location.href = j.url + "#cbpi=" + j.dataArray[j.current].url), a.isFunction(j.options.singlePageInlineCallback) && j.options.singlePageInlineCallback.call(j, j.dataArray[j.current].url, j.dataArray[j.current].element)
                },
                resizeSinglePageInline: function() {
                    var a = this;
                    a.height = 0 === a.top || a.top === a.cubeportfolio.height ? a.wrap.outerHeight(!0) : a.wrap.outerHeight(!0) - a.options.gapHorizontal, a.height += a.topDifference, a.storeBlocks.each(function(a, b) {
                        f.private.modernBrowser ? b.style[f.private.transform] = "" : b.style.marginTop = ""
                    }), a.blocksToMove.each(function(b, c) {
                        f.private.modernBrowser ? c.style[f.private.transform] = "translate3d(0px, " + a.height + "px, 0)" : c.style.marginTop = a.height + "px"
                    }), a.cubeportfolio.obj.style.height = a.cubeportfolio.height + a.height + "px"
                },
                revertResizeSinglePageInline: function() {
                    var b = this;
                    b.deferredInline = a.Deferred(), b.storeBlocks.each(function(a, b) {
                        f.private.modernBrowser ? b.style[f.private.transform] = "" : b.style.marginTop = ""
                    }), b.cubeportfolio.obj.style.height = b.cubeportfolio.height + "px"
                },
                appendScriptsToWrap: function(a) {
                    var b = this,
                        d = 0,
                        e = function(f) {
                            var g = c.createElement("script"),
                                h = f.src;
                            g.type = "text/javascript", g.readyState ? g.onreadystatechange = function() {
                                "loaded" != g.readyState && "complete" != g.readyState || (g.onreadystatechange = null, d++, a[d] && e(a[d]))
                            } : g.onload = function() {
                                d++, a[d] && e(a[d])
                            }, h ? g.src = h : g.text = f.text, b.content[0].appendChild(g)
                        };
                    e(a[0])
                },
                updateSinglePage: function(b, c, d) {
                    var e, f = this;
                    f.content.addClass("cbp-popup-content").removeClass("cbp-popup-content-basic"), d === !1 && f.content.removeClass("cbp-popup-content").addClass("cbp-popup-content-basic"), f.counter && (e = a(f.getCounterMarkup(f.options.singlePageCounter, f.current + 1, f.counterTotal)), f.counter.text(e.text())), f.fromAJAX = {
                        html: b,
                        scripts: c
                    }, f.finishOpen--, f.finishOpen <= 0 && f.updateSinglePageIsOpen.call(f)
                },
                updateSinglePageIsOpen: function() {
                    var a, b = this;
                    b.wrap.addClass("cbp-popup-ready"), b.wrap.removeClass("cbp-popup-loading"), b.content.html(b.fromAJAX.html), b.fromAJAX.scripts && b.appendScriptsToWrap(b.fromAJAX.scripts), b.fromAJAX = {}, b.cubeportfolio.$obj.trigger("updateSinglePageStart.cbp"), a = b.content.find(".cbp-slider"), a.length ? (a.find(".cbp-slider-item").addClass("cbp-item"), b.slider = a.cubeportfolio({
                        layoutMode: "slider",
                        mediaQueries: [{
                            width: 1,
                            cols: 1
                        }],
                        gapHorizontal: 0,
                        gapVertical: 0,
                        caption: "",
                        coverRatio: ""
                    })) : b.slider = null, b.checkForSocialLinks(b.content), b.cubeportfolio.$obj.trigger("updateSinglePageComplete.cbp")
                },
                checkForSocialLinks: function(a) {
                    var b = this;
                    b.createFacebookShare(a.find(".cbp-social-fb")), b.createTwitterShare(a.find(".cbp-social-twitter")), b.createGooglePlusShare(a.find(".cbp-social-googleplus")), b.createPinterestShare(a.find(".cbp-social-pinterest"))
                },
                createFacebookShare: function(a) {
                    a.length && !a.attr("onclick") && a.attr("onclick", "window.open('http://www.facebook.com/sharer.php?u=" + encodeURIComponent(b.location.href) + "', '_blank', 'top=100,left=100,toolbar=0,status=0,width=620,height=400'); return false;")
                },
                createTwitterShare: function(a) {
                    a.length && !a.attr("onclick") && a.attr("onclick", "window.open('https://twitter.com/intent/tweet?source=" + encodeURIComponent(b.location.href) + "&text=" + encodeURIComponent(c.title) + "', '_blank', 'top=100,left=100,toolbar=0,status=0,width=620,height=300'); return false;")
                },
                createGooglePlusShare: function(a) {
                    a.length && !a.attr("onclick") && a.attr("onclick", "window.open('https://plus.google.com/share?url=" + encodeURIComponent(b.location.href) + "', '_blank', 'top=100,left=100,toolbar=0,status=0,width=620,height=450'); return false;")
                },
                createPinterestShare: function(a) {
                    if (a.length && !a.attr("onclick")) {
                        var c = "",
                            d = this.content.find("img")[0];
                        d && (c = d.src), a.attr("onclick", "window.open('http://pinterest.com/pin/create/button/?url=" + encodeURIComponent(b.location.href) + "&media=" + c + "', '_blank', 'top=100,left=100,toolbar=0,status=0,width=620,height=400'); return false;")
                    }
                },
                updateSinglePageInline: function(a, b) {
                    var c = this;
                    c.content.html(a), b && c.appendScriptsToWrap(b), c.cubeportfolio.$obj.trigger("updateSinglePageInlineStart.cbp"), 0 !== c.localOptions.delay ? setTimeout(function() {
                        c.singlePageInlineIsOpen.call(c)
                    }, c.localOptions.delay) : c.singlePageInlineIsOpen.call(c)
                },
                singlePageInlineIsOpen: function() {
                    function a() {
                        b.wrap.addClass("cbp-popup-singlePageInline-ready"),
                            b.wrap[0].style.height = "", b.resizeSinglePageInline(), b.cubeportfolio.$obj.trigger("updateSinglePageInlineComplete.cbp")
                    }
                    var b = this;
                    b.cubeportfolio.loadImages(b.wrap, function() {
                        var c = b.content.find(".cbp-slider");
                        c.length ? (c.find(".cbp-slider-item").addClass("cbp-item"), c.one("initComplete.cbp", function() {
                            b.deferredInline.done(a)
                        }), c.on("pluginResize.cbp", function() {
                            b.deferredInline.done(a)
                        }), b.slider = c.cubeportfolio({
                            layoutMode: "slider",
                            displayType: "default",
                            mediaQueries: [{
                                width: 1,
                                cols: 1
                            }],
                            gapHorizontal: 0,
                            gapVertical: 0,
                            caption: "",
                            coverRatio: ""
                        })) : (b.slider = null, b.deferredInline.done(a)), b.checkForSocialLinks(b.content)
                    })
                },
                isImage: function(b) {
                    var c = this;
                    new Image;
                    c.tooggleLoading(!0), c.cubeportfolio.loadImages(a('<div><img src="' + b.src + '"></div>'), function() {
                        c.updateImagesMarkup(b.src, b.title, c.getCounterMarkup(c.options.lightboxCounter, c.current + 1, c.counterTotal)), c.tooggleLoading(!1)
                    })
                },
                isVimeo: function(a) {
                    var b = this;
                    b.updateVideoMarkup(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isYoutube: function(a) {
                    var b = this;
                    b.updateVideoMarkup(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isTed: function(a) {
                    var b = this;
                    b.updateVideoMarkup(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isSoundCloud: function(a) {
                    var b = this;
                    b.updateVideoMarkup(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isSelfHostedVideo: function(a) {
                    var b = this;
                    b.updateSelfHostedVideo(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                isSelfHostedAudio: function(a) {
                    var b = this;
                    b.updateSelfHostedAudio(a.src, a.title, b.getCounterMarkup(b.options.lightboxCounter, b.current + 1, b.counterTotal))
                },
                getCounterMarkup: function(a, b, c) {
                    if (!a.length) return "";
                    var d = {
                        current: b,
                        total: c
                    };
                    return a.replace(/\{\{current}}|\{\{total}}/gi, function(a) {
                        return d[a.slice(2, -2)]
                    })
                },
                updateSelfHostedVideo: function(a, b, c) {
                    var d, e = this;
                    e.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var f = '<div class="cbp-popup-lightbox-iframe"><video controls="controls" height="auto" style="width: 100%">';
                    for (d = 0; d < a.length; d++) /(\.mp4)/i.test(a[d]) ? f += '<source src="' + a[d] + '" type="video/mp4">' : /(\.ogg)|(\.ogv)/i.test(a[d]) ? f += '<source src="' + a[d] + '" type="video/ogg">' : /(\.webm)/i.test(a[d]) && (f += '<source src="' + a[d] + '" type="video/webm">');
                    f += 'Your browser does not support the video tag.</video><div class="cbp-popup-lightbox-bottom">' + (b ? '<div class="cbp-popup-lightbox-title">' + b + "</div>" : "") + c + "</div></div>", e.content.html(f), e.wrap.addClass("cbp-popup-ready"), e.preloadNearbyImages()
                },
                updateSelfHostedAudio: function(a, b, c) {
                    var d = this;
                    d.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var e = '<div class="cbp-popup-lightbox-iframe"><div class="cbp-misc-video"><audio controls="controls" height="auto" style="width: 75%"><source src="' + a + '" type="audio/mpeg">Your browser does not support the audio tag.</audio></div><div class="cbp-popup-lightbox-bottom">' + (b ? '<div class="cbp-popup-lightbox-title">' + b + "</div>" : "") + c + "</div></div>";
                    d.content.html(e), d.wrap.addClass("cbp-popup-ready"), d.preloadNearbyImages()
                },
                updateVideoMarkup: function(a, b, c) {
                    var d = this;
                    d.wrap.addClass("cbp-popup-lightbox-isIframe");
                    var e = '<div class="cbp-popup-lightbox-iframe"><iframe src="' + a + '" frameborder="0" allowfullscreen scrolling="no"></iframe><div class="cbp-popup-lightbox-bottom">' + (b ? '<div class="cbp-popup-lightbox-title">' + b + "</div>" : "") + c + "</div></div>";
                    d.content.html(e), d.wrap.addClass("cbp-popup-ready"), d.preloadNearbyImages()
                },
                updateImagesMarkup: function(a, b, c) {
                    var d = this;
                    d.wrap.removeClass("cbp-popup-lightbox-isIframe");
                    var e = '<div class="cbp-popup-lightbox-figure"><img src="' + a + '" class="cbp-popup-lightbox-img" ' + d.dataActionImg + ' /><div class="cbp-popup-lightbox-bottom">' + (b ? '<div class="cbp-popup-lightbox-title">' + b + "</div>" : "") + c + "</div></div>";
                    d.content.html(e), d.wrap.addClass("cbp-popup-ready"), d.resizeImage(), d.preloadNearbyImages()
                },
                next: function() {
                    var a = this;
                    a[a.type + "JumpTo"](1)
                },
                prev: function() {
                    var a = this;
                    a[a.type + "JumpTo"](-1)
                },
                lightboxJumpTo: function(a) {
                    var b, c = this;
                    c.current = c.getIndex(c.current + a), b = c.dataArray[c.current], c[b.type](b)
                },
                singlePageJumpTo: function(b) {
                    var c = this;
                    c.current = c.getIndex(c.current + b), a.isFunction(c.options.singlePageCallback) && (c.resetWrap(), c.contentWrap.scrollTop(0), c.wrap.addClass("cbp-popup-loading"), c.slider && f.private.resize.destroyEvent(a.data(c.slider[0], "cubeportfolio")), c.options.singlePageCallback.call(c, c.dataArray[c.current].url, c.dataArray[c.current].element), c.options.singlePageDeeplinking && (location.href = c.url + "#cbp=" + c.dataArray[c.current].url))
                },
                resetWrap: function() {
                    var a = this;
                    "singlePage" === a.type && a.options.singlePageDeeplinking && (location.href = a.url + "#"), "singlePageInline" === a.type && a.options.singlePageInlineDeeplinking && (location.href = a.url + "#")
                },
                getIndex: function(a) {
                    var b = this;
                    return a %= b.counterTotal, a < 0 && (a = b.counterTotal + a), a
                },
                close: function(c, d) {
                    function e() {
                        h.slider && f.private.resize.destroyEvent(a.data(h.slider[0], "cubeportfolio")), h.content.html(""), h.wrap.detach(), h.cubeportfolio.$obj.removeClass("cbp-popup-singlePageInline-open cbp-popup-singlePageInline-close"), "promise" === c && a.isFunction(d.callback) && d.callback.call(h.cubeportfolio)
                    }

                    function g() {
                        var d = a(b).scrollTop();
                        h.resetWrap(), a(b).scrollTop(d), h.options.singlePageInlineInFocus && "promise" !== c ? a("html,body").animate({
                            scrollTop: h.scrollTop
                        }, 350).promise().then(function() {
                            e()
                        }) : e()
                    }
                    var h = this;
                    h.isOpen = !1, "singlePageInline" === h.type ? "open" === c ? (h.wrap.removeClass("cbp-popup-singlePageInline-ready"), a(h.dataArray[h.current].element).closest(".cbp-item").removeClass("cbp-singlePageInline-active"), h.openSinglePageInline(d.blocks, d.currentBlock, d.fromOpen)) : (h.height = 0, h.revertResizeSinglePageInline(), h.wrap.removeClass("cbp-popup-singlePageInline-ready"), h.cubeportfolio.$obj.addClass("cbp-popup-singlePageInline-close"), h.cubeportfolio.$obj.find(".cbp-item").removeClass("cbp-singlePageInline-active"), f.private.modernBrowser ? h.wrap.one(f.private.transitionend, function() {
                        g()
                    }) : g()) : "singlePage" === h.type ? (h.resetWrap(), a(b).scrollTop(h.scrollTop), h.stopScroll = !0, h.wrap.removeClass("cbp-popup-ready cbp-popup-transitionend cbp-popup-singlePage-open cbp-popup-singlePage-sticky"), a("html").css({
                        overflow: "",
                        marginRight: "",
                        position: ""
                    }), "ie8" !== f.private.browser && "ie9" !== f.private.browser || (h.slider && f.private.resize.destroyEvent(a.data(h.slider[0], "cubeportfolio")), h.content.html(""), h.wrap.detach()), h.wrap.one(f.private.transitionend, function() {
                        h.slider && f.private.resize.destroyEvent(a.data(h.slider[0], "cubeportfolio")), h.content.html(""), h.wrap.detach()
                    })) : (i = !1, h.originalStyle ? a("html").attr("style", h.originalStyle) : a("html").css({
                        overflow: "",
                        marginRight: ""
                    }), a(b).scrollTop(h.scrollTop), h.slider && f.private.resize.destroyEvent(a.data(h.slider[0], "cubeportfolio")), h.content.html(""), h.wrap.detach())
                },
                tooggleLoading: function(a) {
                    var b = this;
                    b.stopEvents = a, b.wrap[a ? "addClass" : "removeClass"]("cbp-popup-loading")
                },
                resizeImage: function() {
                    if (this.isOpen) {
                        var c = this.content.find("img"),
                            d = c.parent(),
                            e = a(b).height() - (d.outerHeight(!0) - d.height()) - this.content.find(".cbp-popup-lightbox-bottom").outerHeight(!0);
                        c.css("max-height", e + "px")
                    }
                },
                preloadNearbyImages: function() {
                    for (var a = this, b = [a.getIndex(a.current + 1), a.getIndex(a.current + 2), a.getIndex(a.current + 3), a.getIndex(a.current - 1), a.getIndex(a.current - 2), a.getIndex(a.current - 3)], c = b.length - 1; c >= 0; c--) "isImage" === a.dataArray[b[c]].type && a.cubeportfolio.checkSrc(a.dataArray[b[c]])
                }
            },
            i = !1,
            j = !1,
            k = !1;
        e.prototype.run = function() {
            var b = this,
                d = b.parent,
                e = a(c.body);
            d.lightbox = null, d.options.lightboxDelegate && !j && (j = !0, d.lightbox = Object.create(h), d.lightbox.init(d, "lightbox"), e.on("click.cbp", d.options.lightboxDelegate, function(c) {
                c.preventDefault();
                var e = a(this),
                    f = e.attr("data-cbp-lightbox"),
                    g = b.detectScope(e),
                    h = g.data("cubeportfolio"),
                    i = [];
                h ? h.blocksOn.each(function(b, c) {
                    var e = a(c);
                    e.not(".cbp-item-off") && e.find(d.options.lightboxDelegate).each(function(b, c) {
                        f ? a(c).attr("data-cbp-lightbox") === f && i.push(c) : i.push(c)
                    })
                }) : i = f ? g.find(d.options.lightboxDelegate + "[data-cbp-lightbox=" + f + "]") : g.find(d.options.lightboxDelegate), d.lightbox.openLightbox(i, e[0])
            })), d.singlePage = null, d.options.singlePageDelegate && !k && (k = !0, d.singlePage = Object.create(h), d.singlePage.init(d, "singlePage"), e.on("click.cbp", d.options.singlePageDelegate, function(c) {
                c.preventDefault();
                var e = a(this),
                    f = e.attr("data-cbp-singlePage"),
                    g = b.detectScope(e),
                    h = g.data("cubeportfolio"),
                    i = [];
                h ? h.blocksOn.each(function(b, c) {
                    var e = a(c);
                    e.not(".cbp-item-off") && e.find(d.options.singlePageDelegate).each(function(b, c) {
                        f ? a(c).attr("data-cbp-singlePage") === f && i.push(c) : i.push(c)
                    })
                }) : i = f ? g.find(d.options.singlePageDelegate + "[data-cbp-singlePage=" + f + "]") : g.find(d.options.singlePageDelegate), d.singlePage.openSinglePage(i, e[0])
            })), d.singlePageInline = null, d.options.singlePageInlineDelegate && (d.singlePageInline = Object.create(h), d.singlePageInline.init(d, "singlePageInline"), d.$obj.on("click.cbp", d.options.singlePageInlineDelegate, function(b) {
                b.preventDefault();
                var c = a.data(this, "cbp-locked"),
                    e = a.data(this, "cbp-locked", +new Date);
                (!c || e - c > 300) && d.singlePageInline.openSinglePageInline(d.blocksOn, this)
            }))
        }, e.prototype.detectScope = function(b) {
            var d, e, f;
            return d = b.closest(".cbp-popup-singlePageInline"), d.length ? (f = b.closest(".cbp", d[0]), f.length ? f : d) : (e = b.closest(".cbp-popup-singlePage"), e.length ? (f = b.closest(".cbp", e[0]), f.length ? f : e) : (f = b.closest(".cbp"), f.length ? f : a(c.body)))
        }, e.prototype.destroy = function() {
            var b = this.parent;
            a(c.body).off("click.cbp"), j = !1, k = !1, b.lightbox && b.lightbox.destroy(), b.singlePage && b.singlePage.destroy(), b.singlePageInline && b.singlePageInline.destroy()
        }, f.plugins.popUp = function(a) {
            return new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            var c = this;
            c.parent = b, c.searchInput = a(b.options.search), c.searchInput.each(function(b, c) {
                var d = c.getAttribute("data-search");
                d || (d = "*"), a.data(c, "searchData", {
                    value: c.value,
                    el: d
                })
            });
            var d = null;
            c.searchInput.on("keyup.cbp paste.cbp", function(b) {
                b.preventDefault();
                var e = a(this);
                clearTimeout(d), d = setTimeout(function() {
                    c.runEvent.call(c, e)
                }, 350)
            }), c.searchNothing = c.searchInput.siblings(".cbp-search-nothing").detach(), c.searchNothingHeight = null, c.searchNothingHTML = c.searchNothing.html(), c.searchInput.siblings(".cbp-search-icon").on("click.cbp", function(b) {
                b.preventDefault(), c.runEvent.call(c, a(this).prev().val(""))
            })
        }
        var f = a.fn.cubeportfolio.constructor;
        e.prototype.runEvent = function(b) {
            var c = this,
                d = b.val(),
                e = b.data("searchData"),
                f = new RegExp(d, "i");
            e.value === d || c.parent.isAnimating || (e.value = d, d.length > 0 ? b.attr("value", d) : b.removeAttr("value"), c.parent.$obj.cubeportfolio("filter", function(b) {
                var g = b.filter(function(b, c) {
                    var d = a(c).find(e.el).text();
                    if (d.search(f) > -1) return !0
                });
                if (0 === g.length && c.searchNothing.length) {
                    var h = c.searchNothingHTML.replace("{{query}}", d);
                    c.searchNothing.html(h), c.searchNothing.appendTo(c.parent.$obj), null === c.searchNothingHeight && (c.searchNothingHeight = c.searchNothing.outerHeight(!0)), c.parent.registerEvent("resizeMainContainer", function() {
                        c.parent.height = c.parent.height + c.searchNothingHeight, c.parent.obj.style.height = c.parent.height + "px"
                    }, !0)
                } else c.searchNothing.detach();
                return c.parent.triggerEvent("resetFiltersVisual"), g
            }, function() {
                b.trigger("keyup.cbp")
            }))
        }, e.prototype.destroy = function() {
            var b = this;
            b.searchInput.off(".cbp"), b.searchInput.next(".cbp-search-icon").off(".cbp"), b.searchInput.each(function(b, c) {
                a.removeData(c)
            })
        }, f.plugins.search = function(a) {
            return "" === a.options.search ? null : new e(a)
        }
    }(jQuery, window, document),
    function(a, b, c, d) {
        "use strict";

        function e(b) {
            var c = this;
            c.parent = b, c.options = a.extend({}, f, c.parent.options.plugins.slider);
            var d = a(c.options.pagination);
            d.length > 0 && (c.parent.customPagination = d, c.parent.customPaginationItems = d.children(), c.parent.customPaginationClass = c.options.paginationClass, c.parent.customPaginationItems.on("click.cbp", function(b) {
                b.preventDefault(), b.stopImmediatePropagation(), b.stopPropagation(), c.parent.sliderStopEvents || c.parent.jumpToSlider(a(this))
            })), c.parent.registerEvent("gridAdjust", function() {
                c.sliderMarkup.call(c.parent), c.parent.registerEvent("gridAdjust", function() {
                    c.updateSlider.call(c.parent)
                })
            }, !0)
        }
        var f = {
                pagination: "",
                paginationClass: "cbp-pagination-active"
            },
            g = a.fn.cubeportfolio.constructor;
        e.prototype.sliderMarkup = function() {
            var b = this;
            b.sliderStopEvents = !1, b.sliderActive = 0, b.$obj.one("initComplete.cbp", function() {
                b.$obj.addClass("cbp-mode-slider")
            }), b.nav = a("<div/>", {
                class: "cbp-nav"
            }), b.nav.on("click.cbp", "[data-slider-action]", function(c) {
                if (c.preventDefault(), c.stopImmediatePropagation(), c.stopPropagation(), !b.sliderStopEvents) {
                    var d = a(this),
                        e = d.attr("data-slider-action");
                    b[e + "Slider"] && b[e + "Slider"](d)
                }
            }), b.options.showNavigation && (b.controls = a("<div/>", {
                class: "cbp-nav-controls"
            }), b.navPrev = a("<div/>", {
                class: "cbp-nav-prev",
                "data-slider-action": "prev"
            }).appendTo(b.controls), b.navNext = a("<div/>", {
                class: "cbp-nav-next",
                "data-slider-action": "next"
            }).appendTo(b.controls), b.controls.appendTo(b.nav)), b.options.showPagination && (b.navPagination = a("<div/>", {
                class: "cbp-nav-pagination"
            }).appendTo(b.nav)), (b.controls || b.navPagination) && b.nav.appendTo(b.$obj), b.updateSliderPagination(), b.options.auto && (b.options.autoPauseOnHover && (b.mouseIsEntered = !1, b.$obj.on("mouseenter.cbp", function(a) {
                b.mouseIsEntered = !0, b.stopSliderAuto()
            }).on("mouseleave.cbp", function(a) {
                b.mouseIsEntered = !1, b.startSliderAuto()
            })), b.startSliderAuto()), b.options.drag && g.private.modernBrowser && b.dragSlider()
        }, e.prototype.updateSlider = function() {
            var a = this;
            a.updateSliderPosition(), a.updateSliderPagination()
        }, e.prototype.destroy = function() {
            var a = this;
            a.parent.customPaginationItems && a.parent.customPaginationItems.off(".cbp"), (a.parent.controls || a.parent.navPagination) && (a.parent.nav.off(".cbp"), a.parent.nav.remove())
        }, g.plugins.slider = function(a) {
            return "slider" !== a.options.layoutMode ? null : new e(a)
        }
    }(jQuery, window, document);