$(window).load(function(){
  resize_h3_backgrounds();
  init_obstacles();
  
  // Start the clock when the user fills out the form
  $("form input, form select").focus(start_clock);
  
  // Stop the clock on form submission
  $("form").submit(function(){
    stop_clock();
    return false;
  });
  
  // Scroll the page when navigation is clicked
  $("nav a").click(function(){
    var hash = this.href.match(/#.*$/)

    if (hash.length > 0) {
      $('html, body').animate({scrollTop: $(hash[0]).offset().top}, 1000, "easeOutBack");
      return false;
    }
  });
  
  // Help old browsers determine odd, even and last
  $("#prizes li:nth-child(odd), footer p:even").addClass("odd");
  $("#prizes li:last, footer p:last").addClass("last");
  
  // Polyfill input placehoders
  if (!Modernizr['input'].placeholder) {
    $("input[placeholder]").each(function(){
      this.value = $(this).attr("placeholder");
    }).focus(function() {
      if(this.value == $(this).attr("placeholder")) {
        $(this).val('');
      }
    }).blur(function(){
      if(this.value.length == 0) {
        $(this).val($(this).attr("placeholder"));
      }
    });
  }

});

$(window).resize(resize_h3_backgrounds);

// Code of obstacles functionality
var obstacle_timer = null;
function rotate_obstacles() {
  obstacle_timer = setTimeout(function(){
    $("#obstacles li:nth-child("+(current_obstacle)+")").addClass("hover");
    obstacle_timer = setInterval(next_obstacle, 3000);
  }, 200);
  
}

function stop_obstacles() {
  $("#obstacles li").removeClass("hover");
  clearInterval(obstacle_timer);
}

function init_obstacles() {
  $("#obstacles li").each(function(){
    var li = $(this);
    
    // Obstacle Template
    var obstacle = $("<div class='obstacle'><hgroup><h5></h5><h6></h6></hgroup><img></div>");

    obstacle.find("h5").text(li.text());
    obstacle.find("h6").text(li.find("img").attr("alt"));

    if ( li.find("img").attr("osrc")) { // For ie6 pngFix
      obstacle.find("img").attr("src", li.find("img").attr("osrc"))
    } else {
      obstacle.find("img").attr("src", li.find("img").attr("src"))
    }
  
    li.append(obstacle);        
  }).hover(stop_obstacles, rotate_obstacles);
  rotate_obstacles();
}

var current_obstacle = 1;
function next_obstacle() {
  current_obstacle++;
  if (current_obstacle > $("#obstacles li").length) {
    current_obstacle = 1;
  }
  $("#obstacles li").removeClass("hover");
  $("#obstacles li:nth-child("+(current_obstacle)+")").addClass("hover");
}

var triple_dare_clock_timer = null;
var triple_dare_clock_blink = null;
function  start_clock() {
  if (triple_dare_clock_timer) { return false; }
  
  triple_dare_clock_timer = setInterval(function(){
    var clock = $("#clock #seconds");
    var seconds = parseInt(clock.text());
    if (seconds > 0) {
      clock.text(seconds - 1);
    } else {
      stop_clock();
    }
  }, 1000);  
}

// Code for contestant clock functionality
function stop_clock() {
  clearInterval(triple_dare_clock_timer);
  if (triple_dare_clock_blink) { return false; }
  triple_dare_clock_blink = setInterval(function(){
    var clock = $("#clock #seconds");
    if (clock.css("visibility") == "visible") {
      clock.css({visibility: "hidden"});   
    } else {
      clock.css({visibility: "visible"});
    }
  }, 500);
}

// Make sure the checkered background on the
// section headings doesn't have partial squares
function resize_h3_backgrounds(){
  $(".content > h3").each(function(){
    var h3 = $(this);
    var content = $(this).parent(".content");

    h3.css({"display": "inline"});
    var width = parseInt(h3.width());
    var content_width = parseInt(content.width());
    h3.css({"display": "block"});
    
    var intervaled_width = width + (20 - (width % 20)) + (content_width % 20);
  
    h3.css({
      "text-indent": "-"+intervaled_width+"px", 
      "margin-left": intervaled_width+"px"
    });
  });
}