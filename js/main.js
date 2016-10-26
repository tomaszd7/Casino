

$(document).ready(function() {

	var columnsData = [
			{
				id:'one', 	
				runTime: 180
			}, 
			{
				id:'two', 
				runTime: 120
			},
			{
				id:'three',
				runTime: 260
			}
		];

	var columns = [];

	for (var i = 0; i < columnsData.length; i++) {
		var column = new Column(columnsData[i].id, columnsData[i].runTime);
		column.createDivs();
		columns.push(column);
	}

	$('#start').click(function(event) {
		// move questions to back 
		$('.question').css('zIndex', '-100');

		for (var i = 0; i < columns.length; i++) {
			columns[i].setStartingPosition();
			columns[i].startAllDivs();
		}
	});

	$('#stop').click(function(event) {
		for (var i = 0; i < columns.length; i++) {
			columns[i].stopAllDivs();
		}		
	});


	function Column(parentId, runTime) {

		this.parentId = parentId;
		this.runTime = runTime;
		// musi byc stala predkosc v = 300p/ s = v * t		
		this.v = 300/this.runTime;

		this.colors = ['red', 'green', 'blue'];
		this.count = this.colors.length;

		this.divs = [];

		this.createDivs = function() {
			var parent = $('<div>');
			for (var i = 0; i < this.colors.length; i++) {
				var $div = $('<div>');
				$div.addClass('mover ' + this.colors[i]);
				$div.append($('<img src="img/' + (i + 1) + '.jpg" width=100/>'))
				parent.append($div);
				this.divs.push($div);
			}
			$('#' + this.parentId).append(parent.children());
		};

		this.getHighest = function() {
			var highest = 200;
			for (var i = 0; i < this.divs.length; i++) {
				var currentTop = parseFloat(this.divs[i].css('top'));
				if (currentTop < highest) {
					highest = currentTop;
				}
			}
			return highest;
		};

		this.startAllDivs = function() {
			for (var i = 0; i < this.divs.length; i++) {
				this.animateDiv(this, $(this.divs[i]), this.runTime/ this.count * i, this.runTime);
			}
		}

		this.stopAllDivs = function() {
			for (var i = 0; i < this.divs.length; i++) {
				this.divs[i].stop(true, false);
			}
			var middleDiv = this.findMiddleDiv();
			middleDiv.animate({
				top: '0px',
				zIndex: 100
				}, 50, 'linear'
			);
		}

		this.findMiddleDiv = function() {
			var middle = 100;
			var div = null;
			for (var i = 0; i < this.divs.length; i++) {
				// jezeli jego srodek jest najblizej top = 50 
				var divMiddle = parseInt(this.divs[i].css('top')) + 50;
				var absDiff = Math.abs(50 - divMiddle);
				if (absDiff < middle) {
					middle = absDiff;
					div = this.divs[i]
				}
			}			 
			return div;
		}

		this.setStartingPosition = function() {
			for (var i = 0; i < this.divs.length; i++) {
				this.divs[i].css({
					'top': '-100px',
					'zIndex': 0
					});
			}
		}
		

		this.animateDiv = function(self, $div, delayTime, baseTime) {
			$div.delay(delayTime).animate({
				top: '200px'
				}, baseTime, 'linear', function() {
					// find the highest and put it before it 
					var highest = self.getHighest();
					// added korekte o funkcje wymierna 6400/runTime 
					$(this).css('top', highest - 100 + 6400/self.runTime + 1 + 'px');
					// wylicz base bo odleglosc sie zmienia 
					var s = 200 + Math.abs(highest - 100);
					var t = s / self.v;
					self.animateDiv(self, $(this), 0, t);				
			});
		};

	}

});
