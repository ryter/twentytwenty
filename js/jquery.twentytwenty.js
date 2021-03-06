(function($){

  $.fn.twentytwenty = function(options) {
    var options = $.extend({
      default_offset_pct: 0.5,
      default_switch_pct: 0.5,
      default_img_pct: 0,
      orientation: 'horizontal'
    }, options);
    return this.each(function() {

      var sliderPct = options.default_offset_pct;
      var switchPctBefore = options.default_switch_pct;
      var switchPctAfter = options.default_switch_pct;
      var beforePctImg = options.default_img_pct;
      var afterPctImg = options.default_img_pct;
      var container = $(this);
      var sliderOrientation = options.orientation;
      var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left';
      var afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';

      container.wrap("<div class='twentytwenty-wrapper twentytwenty-" + sliderOrientation + "'></div>");
      container.append("<div class='twentytwenty-overlay'></div>");
      var beforeImg = container.find("img:first");
      var afterImg = container.find("img:last");
      beforeImg.wrap("<div class='twentytwenty-before-wrapper'></div>");
      afterImg.wrap("<div class='twentytwenty-after-wrapper'></div>");

      var beforeImgWrapper = container.find(".twentytwenty-before-wrapper");
      var afterImgWrapper = container.find(".twentytwenty-after-wrapper");

      container.append("<div class='twentytwenty-handle'></div>");
      var slider = container.find(".twentytwenty-handle");
      slider.append("<span class='twentytwenty-" + beforeDirection + "-arrow'></span>");
      slider.append("<span class='twentytwenty-" + afterDirection + "-arrow'></span>");
      container.addClass("twentytwenty-container");
      beforeImg.addClass("twentytwenty-before");
      afterImg.addClass("twentytwenty-after");

      var overlay = container.find(".twentytwenty-overlay");
      var beforeLabel = (beforeImg.data("label")) ? beforeImg.data("label") : "Before";
      var afterLabel = (afterImg.data("label")) ? afterImg.data("label") : "After";
      overlay.append("<div class='twentytwenty-before-label twentytwenty-overlay-laber twentytwenty-overlay-laber-text' data-content='" + beforeLabel + "'><span class='twentytwenty-before-switch'></span></div>");
      overlay.append("<div class='twentytwenty-after-label twentytwenty-overlay-laber twentytwenty-overlay-laber-text'  data-content='" + afterLabel + "'><span class='twentytwenty-after-switch'></span></div>");
      var overlayLabel = overlay.find(".twentytwenty-overlay-laber");
      var beforeSwitch = container.find(".twentytwenty-before-switch");
      var afterSwitch = container.find(".twentytwenty-after-switch");

      var calcOffset = function(dimensionPct) {
        var w = beforeImg.width();
        var h = Math.max(beforeImg.height(), afterImg.height());
        var sbw = beforeSwitch.width();
        var sbh = beforeSwitch.height();
        var saw = afterSwitch.width();
        var sah = afterSwitch.height();
        return {
          w: w+"px",
          h: h+"px",
          cw: (dimensionPct*w)+"px",
          ch: (dimensionPct*h)+"px",
          sbcw: ((dimensionPct*w)-(sbw/2)),
          sbch: ((dimensionPct*h)-(sbh/2)),
          sacw: ((dimensionPct*w)-(saw/2)),
          sach: ((dimensionPct*h)-(sah/2))
        };
      };

      var adjustContainer = function(offset) {
      	if (sliderOrientation === 'vertical') {
      	  beforeImg.css("clip", "rect(0,"+offset.w+","+offset.ch+",0)");
          beforeImgWrapper.css("clip", "rect(0,"+offset.w+","+offset.ch+",0)");
      	}
      	else {
          beforeImg.css("clip", "rect(0,"+offset.cw+","+offset.h+",0)");
          beforeImgWrapper.css("clip", "rect(0,"+offset.cw+","+offset.h+",0)");
    	  }
        container.css("height", offset.h);
      };

      var adjustImgPosition = function(pct, img) {

        if(sliderOrientation === 'vertical'){
          if(img === 'beforeImg') {
            beforeImg.css("left", "" +pct+ "px");
          }

          if(img === 'afterImg') {
            afterImg.css("left", "" +pct+ "px");
          }
        } else {
          if(img === 'beforeImg') {
            beforeImg.css("top", "" +pct+ "px");
          }

          if(img === 'afterImg') {
            afterImg.css("top", "" +pct+ "px");
          }
        }
      };

      var adjustSwitchPosition = function(offset, s) {
        if(sliderOrientation === 'vertical'){
          if(s === 'beforeSwitch'){
            beforeSwitch.css("left", "" + offset.sbcw + "px");
          }

          if(s === 'afterSwitch') {
            afterSwitch.css("left", "" + offset.sacw + "px");
          }
        } else {
          if(s === 'beforeSwitch'){
            beforeSwitch.css("top", "" + offset.sbch + "px");
          }

          if(s === 'afterSwitch') {
            afterSwitch.css("top", "" + offset.sach + "px");
          }
        }
      };

      var adjustSlider = function(pct) {
        var offset = calcOffset(pct);
        slider.css((sliderOrientation==="vertical") ? "top" : "left", (sliderOrientation==="vertical") ? offset.ch : offset.cw);
        adjustContainer(offset);
      };

      var adjustSwitch = function(pct, s) {
        var offset = calcOffset(pct);
        console.log(offset);

        if(s === 'beforeSwitch'){
          beforeSwitch.css((sliderOrientation==="vertical") ? "left":"top", (sliderOrientation==="vertical") ? offset.sbcw + "px" : offset.sbch + "px");
          adjustSwitchPosition(offset, 'beforeSwitch');
        }

        if(s === 'afterSwitch') {
          afterSwitch.css((sliderOrientation==="vertical") ? "left":"top", (sliderOrientation==="vertical") ? offset.sacw + "px" : offset.sach + "px");
          adjustSwitchPosition(offset, 'afterSwitch');
        }

        if(s === 'scroll' && sliderOrientation==="horizontal"){
        }
      };

      $(window).on("resize.twentytwenty", function(e) {
        adjustSlider(sliderPct);
        adjustSwitch(switchPctBefore, 'beforeSwitch');
        adjustSwitch(switchPctAfter, 'afterSwitch');
      });

     // var sticky = fixto.fixTo(container, beforeSwitch, options);

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

        if((e.distY > e.distX && e.distX < -e.distY) && sliderOrientation !== 'vertical') {
          e.preventDefault();
        } else if ((e.distX > e.distX && e.distY < -e.distX) && sliderOrientation === 'vertical'){
          e.preventDefault();
        }

        switchBeforeWidth = beforeSwitch.width();
        switchBeforeHeight = beforeSwitch.height();
        offsetX = container.offset().left;
        offsetY = container.offset().top;
        imgWidth = beforeImg.width();
        imgHeight = beforeImg.height();
      });

      afterSwitch.on("movestart", function(e) {
        container.addClass("active-switch");

        if((e.distY > e.distX && e.distX < -e.distY) && sliderOrientation !== 'vertical') {
          e.preventDefault();
        } else if ((e.distX > e.distX && e.distY < -e.distX) && sliderOrientation === 'vertical'){
          e.preventDefault();
        }

        switchAfterWidth = afterSwitch.width();
        switchAfterHeight = afterSwitch.height();
        offsetX = container.offset().left;
        offsetY = container.offset().top;
        imgWidth = afterImg.width();
        imgHeight = afterImg.height();
      });

      beforeSwitch.on("moveend", function(e) {
        container.removeClass("active-switch");
      });

      afterSwitch.on("moveend", function(e) {
        container.removeClass("active-switch");
      });

      beforeSwitch.on("move", function(e) {
        if(container.hasClass("active-switch")){
          switchPctBefore = (sliderOrientation === 'vertical') ? (e.pageX-offsetX)/imgWidth : (e.pageY-offsetY)/imgHeight;
          beforePctImg = (sliderOrientation === 'vertical' ? e.distX : e.distY);

          if(switchPctBefore < 0){
            switchPctBefore = 0;
          }

          if(switchPctBefore > 1){
            switchPctBefore = 1;
          }
          adjustSwitch(switchPctBefore, 'beforeSwitch');
          adjustImgPosition(beforePctImg, 'afterImg');
        }
      });

      afterSwitch.on("move", function(e) {
        if(container.hasClass("active-switch")){
          switchPctAfter = (sliderOrientation === 'vertical') ? (e.pageX-offsetX)/imgWidth : (e.pageY-offsetY)/imgHeight;
          afterPctImg = (sliderOrientation === 'vertical' ? e.distX : e.distY);

          if(switchPctAfter < 0){
            switchPctAfter = 0;
          }

          if(switchPctAfter > 1){
            switchPctAfter = 1;
          }
          adjustSwitch(switchPctAfter, 'afterSwitch');
          adjustImgPosition(afterPctImg, 'beforeImg');
        }
      });

      container.find("img").on("mousedown", function(event) {
        event.preventDefault();
      });

      $(window).trigger("resize.twentytwenty");
    });
  };

})(jQuery);
