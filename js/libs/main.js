
	
//define('app-name', ['jquery'], function($) {
	
	//function init() {
		//do stuff
	//}
	
	//return {
		//init: init
	//}
//})

/**
 *
 */
define(['underscore', 'jquery', 'tabletop'], function (_, $, tabletop) {
	
    'use strict';
	

	// globals

	if (!Array.indexOf) {// IE fix
		Array.prototype.indexOf = function(obj) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] === obj) {
					return i;
				}
			}
			return -1;
		}
	}

	var ua = navigator.userAgent, eventDown = (ua.match(/iPad/i)) ? "touchstart" : "click", eventUp = (ua.match(/iPad/i)) ? "touchend" : "click", eventUp2 = (ua.match(/iPad/i)) ? "touchend" : "mouseup", eventDown2 = (ua.match(/iPad/i)) ? "touchstart" : "mousedown";

	var dataset, w, h, totalCells = 100, topbarHeight = 80, gridView = true, currentCellIndex;
	
	


	function loadData() {
		
		var key="0AkRR3zKqdlUHdHdiNjQ1R1Ixamk4Nk9NQlVvUHlmNUE";
		
		Tabletop.init( { key: key,
		callback: onDataLoad,
		simpleSheet: true } )

	}
	
	function onDataLoad(data) {
		
		dataset = data;
		
		buildView();
		
		addListeners();
	}

	
	function buildView() {
		
		var i, htmlString ="<ul class='FW_M100_2013_grid'>";
			
			for (i = 0; i < totalCells; i++) {
				htmlString += "<li class='FW_M100_2013_cell-wrapper'><div class='FW_M100_2013_cell' id='FW_M100_2013_cell_" + i + "'><img class='FW_M100_2013_cell-image' src='" + dataset[i].thumburl + "' alt='' /><p class='FW_M100_2013_cell-num' >" + (i+1) + "</p></div></li>";
			}
			htmlString += "</ul>";
			
			$("#FW_M100_2013_grid-layout").html(htmlString);
			
			var offset = $("#FW_M100_2013_container").offset();
		
	}


	function addListeners() {
		
		$(window).resize(function() {
			
			updateDimensions();
			
		});
		/*
		$(window).scroll(function(e) {
        var newScroll = $(document).scrollTop();
        
        checkForFixed(newScroll);
        //console.log(newScroll);
    });
    */

		$(".FW_M100_2013_cell").bind(eventDown, function(e) {
			
			var id = e.currentTarget.id;
			
			var splitArr = id.split("_");
			var index = Number(splitArr[splitArr.length-1]);
			
			currentCellIndex = index;
			
			showInfo(index);
		});
		
		$("#FW_M100_2013_close-button").bind(eventDown, function(e) {
			$("#FW_M100_2013_info-popup").hide();
			$("#FW_M100_2013_fixed-container").height(topbarHeight);
			gridView = true;
		});
		
		$(".FW_M100_2013_nav-button").bind(eventDown, function(e) {
			
			var direction, id = e.currentTarget.id;
			
			switch (id) {
				
				case "FW_M100_2013_nav-left" :
				direction = -1;
				break;
				
				default :
				direction = 1;
				break;
			
			}
			
			currentCellIndex += direction;
			
			checkNavButtons();
			
			showInfo(currentCellIndex);
		});

	}
	
	function checkNavButtons() {
		
		$(".FW_M100_2013_nav-button").show();
		
		if (currentCellIndex <= 0) {
			$("#FW_M100_2013_nav-left").hide();
			currentCellIndex = 0;
		}
		
		if (currentCellIndex >= totalCells -1) {
			$("#FW_M100_2013_nav-right").hide();
			currentCellIndex = totalCells -1;
		}
		
	}
	
	function checkForFixed(scrollTop) {
		
		var offset = $("#FW_M100_2013_container").offset();

		
		if (scrollTop > offset.top) {
			$("#FW_M100_2013_fixed-container").css("top", + (scrollTop - offset.top) + "px");
			//$("#FW_M100_2013_fixed-container").css("position", "fixed");
		}
		else
		{
			$("#FW_M100_2013_fixed-container").css("top", "0px");
			//$("#FW_M100_2013_fixed-container").css("position", "absolute");
		}
		
	}
	
	function updateDimensions() {
			w = $("#FW_M100_2013_container").width();
			h = $("#FW_M100_2013_container").height();
			if (!gridView) {
				$("#FW_M100_2013_fixed-container").height(h);
				$("#FW_M100_2013_info-popup").height(h-topbarHeight);
			}
			else {
				$("#FW_M100_2013_fixed-container").height(topbarHeight);
				$("#FW_M100_2013_info-popup").height(h-topbarHeight);
			}
	}
	
	function showInfo(index) {
		
		var htmlString = "";
		
		htmlString += "<div id='FW_M100_2013_details-header' >";
		htmlString += "<div id='FW_M100_2013_main-image-holder' ><img id='FW_M100_2013_main-image' src='" + dataset[index].imageurl + "' alt='' /></div>";
		htmlString += "<h4 class='FW_M100_2013_details-number'>" + (index + 1) + "</h4>";
		htmlString += "<h1 class='FW_M100_2013_details-name'>" + dataset[index].name + "</h1>";
		htmlString += "<h2 class='FW_M100_2013_details-company'>" + dataset[index].company + "</h2>";
		htmlString += "</div>";
		//htmlString += "<h3 class='FW_M100_2013_details-company'>" + dataset[index].category + "</h3>";
		htmlString += "<p class='FW_M100_2013_details-comment'>" + dataset[index].comment + " <a href='" + dataset[index].link + "' >Read more ...</a></p>";
		
		$("#FW_M100_2013_info-details").html(htmlString);
		
		updateDimensions();
		
		$("#FW_M100_2013_info-popup").show();
		
		$('html,body').animate({scrollTop: $("#FW_M100_2013_fixed-container").offset().top}, 1);
		
		gridView = false;
		
	}
	
	function setup(el) {
		
		
		var url =  "http://interactive.guim.co.uk/next-gen/environment/ng-interactive/2013/oct/greenpeace/data/scaffolding.jsonp";
		
		 $.ajax({
                                       url: url,
                                       jsonp:false,
                                       dataType: "jsonp",
                                       jsonpCallback:"FW_M100_2013_fn",
                                       cache:true,
                                       success:function(data) {
                                               $(el).html(data.myStr);
        									loadData();
                                       }
                               });

		
    //$.getJSON(url + "?callback=?", null, function(htmlString) {
        
        //$(el).html(htmlString);
        //loadData();
    //});
		//$(el).load('http://interactive.guim.co.uk/next-gen/environment/ng-interactive/2013/oct/greenpeace/data/scaffolding.html', function() {
//loadData();
//});
		
		
	}
	
	return {
        setup: setup
    };
    
});

