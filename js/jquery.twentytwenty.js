(function($){

    $.fn.twentytwenty = function(options) {
        var options = $.extend({
            default_offset_pct: 0.5,
            default_switch_pct: 0.5,
            orientation: 'horizontal',
            switch : false
        }, options);
        return this.each(function() {

            var sliderPct = options.default_offset_pct;
            var switchPctBefore = options.default_switch_pct;
            var switchPctAfter = options.default_switch_pct;
            var container = $(this);
            var sliderOrientation = options.orientation;
            var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left';
            var afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';
            
            
            container.wrap("<div class='twentytwenty-wrapper twentytwenty-" + sliderOrientation + "'></div>");
            container.append("<div class='twentytwenty-overlay'></div>");
            var beforeImg = container.find("img:first");
            var afterImg = container.find("img:last");
            container.append("<div class='twentytwenty-handle'></div>");

            var slider = container.find(".twentytwenty-handle");
            slider.append("<span class='twentytwenty-" + beforeDirection + "-arrow'></span>");
            slider.append("<span class='twentytwenty-" + afterDirection + "-arrow'></span>");
            container.addClass("twentytwenty-container");
            beforeImg.addClass("twentytwenty-before");
            afterImg.addClass("twentytwenty-after");
            
            var overlay = container.find(".twentytwenty-overlay");
            overlay.append("<div class='twentytwenty-before-label'><span class='twentytwenty-before-switch'></span></div>");
            overlay.append("<div class='twentytwenty-after-label'><span class='twentytwenty-after-switch'></span></div>");

            var beforeSwitch = container.find(".twentytwenty-before-switch");
            var afterSwitch = container.find(".twentytwenty-after-switch");
            
            var calcOffset = function(dimensionPct) {
                var w = beforeImg.width();
                var h = beforeImg.height();
                var sw = beforeSwitch.width();
                var sh = beforeSwitch.height();
                return {
                    w: w+"px",
                    h: h+"px",
                    cw: (dimensionPct*w)+"px",
                    ch: (dimensionPct*h)+"px",
                    scw: ((dimensionPct*w)-(sw/2))+"px",
                    sch: ((dimensionPct*h)-(sh/2))+"px" 
                };
            };

            var adjustContainer = function(offset) {
      	        if (sliderOrientation === 'vertical') {
      	            beforeImg.css("clip", "rect(0,"+offset.w+","+offset.ch+",0)");
      	        } else {
                    beforeImg.css("clip", "rect(0,"+offset.cw+","+offset.h+",0)");
    	          }
                container.css("height", offset.h);
            };

            var adjustSlider = function(pct) {
                var offset = calcOffset(pct);
                slider.css((sliderOrientation==="vertical") ? "top" : "left", (sliderOrientation==="vertical") ? offset.ch : offset.cw);
                adjustContainer(offset);
                //console.log(offset);
            };

            var adjustSwitch = function name(pct) {
                var offset = calcOffset(pct);

                if(sliderOrientation==="vertical") {
                    if(beforeSwitch){
                        beforeSwitch.css("left", "" +offset.scw+ "");
                    }

                     if(afterSwitch){
                        afterSwitch.css("left", "" +offset.scw+ "");
                    }
                    
                } else {
                    if(beforeSwitch){
                        beforeSwitch.css("top", "" +offset.sch+ "");
                    }

                     if(afterSwitch){
                        afterSwitch.css("top", "" +offset.sch+ "");
                    }
                }
            };
            
            $(window).on("resize.twentytwenty", function(e) {
                adjustSlider(sliderPct);
            });

            $(window).on("resize.twentytwenty", function(e) {
                adjustSwitch(switchPctBefore); 
                adjustSwitch(switchPctAfter);
            });

            var offsetX = 0;
            var imgWidth = 0;
            
            slider.on("movestart", function(e) {
                if (((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) && sliderOrientation !== 'vertical') {
                    e.preventDefault();
                }
                else if (((e.distX < e.distY && e.distX < -e.distY) || (e.distX > e.distY && e.distX > -e.distY)) && sliderOrientation === 'vertical') {
                    e.preventDefault();
                }
                container.addClass("active");
                offsetX = container.offset().left;
                offsetY = container.offset().top;
                imgWidth = beforeImg.width(); 
                imgHeight = beforeImg.height();          
            });

            slider.on("moveend", function(e) {
                container.removeClass("active");
            });

            slider.on("move", function(e) {
                if (container.hasClass("active")) {
                    sliderPct = (sliderOrientation === 'vertical') ? (e.pageY-offsetY)/imgHeight : (e.pageX-offsetX)/imgWidth;
                    
                    if (sliderPct < 0) {
                        sliderPct = 0;
                    }
                    
                    if (sliderPct > 1) {
                        sliderPct = 1;
                    }
                    
                    adjustSlider(sliderPct);
                }
            });

            beforeSwitch.on("movestart", function(e) {
                container.addClass("active-switch");
            });

            beforeSwitch.on("moveend", function(e) {
                container.removeClass("active-switch");
            });
            
            beforeSwitch.on("move", function(e) {
                if(container.hasClass("active-switch")) {
                    adjustSwitch(switchPctBefore);
                    //beforeSwitch.css({top: e.startY + e.distY - ($(this).height()) + e.deltaY});
                }
            });

            container.find("img").on("mousedown", function(event) {
                event.preventDefault();
            });

            $(window).trigger("resize.twentytwenty");
        });
    };

})(jQuery);
