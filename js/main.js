

$(document).ready(function () {

    var columnsData = [
        {
            id: 'one',
            runTime: 180
        },
        {
            id: 'two',
            runTime: 120
        },
        {
            id: 'three',
            runTime: 260
        }
    ];

    var columns = [];

    for (var i = 0; i < columnsData.length; i++) {
        var column = new Column(columnsData[i].id, columnsData[i].runTime);
        column.createDivs();
        columns.push(column);
    }

    $('#start').click(function (event) {
        // move questions to back 
        $('.question').css('zIndex', '-100');

        for (var i = 0; i < columns.length; i++) {
            columns[i].shufflePictures();
            columns[i].prepareDivs();
            columns[i].startAllDivs();
        }
    });

    $('#stop').click(function (event) {
        for (var i = 0; i < columns.length; i++) {
            columns[i].stopAllDivs();
        }
    });


    /*
     * @info constructor running on column that creates 3 divs - pictures
     *      that spin arround with different speed and when stopped 
     *      show the middle picture
     * @param {string} parentId id attribte of column class div 
     * @param {integer} runTime abstract time for spinning speep
     */
    function Column(parentId, runTime) {

        this.parentId = parentId;
        this.runTime = runTime;
        // musi byc stala predkosc v = 300p/ s = v * t		
        this.v = 300 / this.runTime;

        this.pictures = [
            '1.jpg',
            '2.jpg',
            '3.jpg'
        ];
        this.count = this.pictures.length;

        this.shuffledPictures = [];

        /*
         * array of spinning divs mover class
         */
        this.divs = [];

        this.createDivs = function () {
            var parent = $('<div>');
            for (var i = 0; i < this.pictures.length; i++) {
                var $div = $('<div>');
                $div.addClass('mover');
                $div.append($('<img src="empty" width=100/>'));
                parent.append($div);
                this.divs.push($div);
            }
            $('#' + this.parentId).append(parent.children());
        };

        /*
         *	create new pictures array with shuffled pictures
         */
        this.shufflePictures = function () {
            // clear array first
            this.shuffledPictures = [];
            var _pictures = this.pictures.slice();
            do {
                var randIndex = Math.floor(Math.random() * _pictures.length);
                this.shuffledPictures.push(_pictures[randIndex]);
                _pictures.splice(randIndex, 1);
            } while (_pictures.length)
        }


        /*
         * move pictures to the top over window area
         * get new shuffled file names 
         */
        this.prepareDivs = function () {
            for (var i = 0; i < this.divs.length; i++) {
                this.divs[i].css({
                    'top': '-100px',
                    'zIndex': 0
                });
                this.divs[i].children()[0].setAttribute('src', 'img/' + this.shuffledPictures[i]);
            }
        }

        this.startAllDivs = function () {
            for (var i = 0; i < this.divs.length; i++) {
                this.animateDiv(this, $(this.divs[i]), this.runTime / this.count * i, this.runTime);
            }
        }

        /*
         * stop all animations
         * move the middle divs into full window view 
         */
        this.stopAllDivs = function () {
            for (var i = 0; i < this.divs.length; i++) {
                this.divs[i].stop(true, false);
            }
            var middleDiv = this.findMiddleDiv();
            middleDiv.animate({
                top: '0px',
                zIndex: 100
            }, 100, 'linear'
                    );
        }

        /*
         * helper function for better image animation
         */
        this.getHighest = function () {
            var highest = 200;
            for (var i = 0; i < this.divs.length; i++) {
                var currentTop = parseFloat(this.divs[i].css('top'));
                if (currentTop < highest) {
                    highest = currentTop;
                }
            }
            return highest;
        };

        /*
         * find the middle 'winning' div
         */
        this.findMiddleDiv = function () {
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

        this.animateDiv = function (self, $div, delayTime, baseTime) {
            $div.delay(delayTime).animate({
                top: '200px'
            }, baseTime, 'linear', function () {
                // find the highest and put it before it 
                var highest = self.getHighest();
                // added korekte o funkcje wymierna 6400/runTime 
                $(this).css('top', highest - 100 + 6400 / self.runTime + 1 + 'px');
                // wylicz base bo odleglosc sie zmienia 
                var s = 200 + Math.abs(highest - 100);
                var t = s / self.v;
                self.animateDiv(self, $(this), 0, t);
            });
        };

    }

});
