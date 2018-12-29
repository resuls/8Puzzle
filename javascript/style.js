$(function() 
{
   //SLIDER
   $("#slider > div:gt(0)").hide();
   
    setInterval(function() 
    { 
         $("#slider > div:first")
           .next()
           .fadeIn(1000)
           .end()
           .appendTo("#slider")
           .hide();
    }, 3000);
   
    changePage = function (href)
    {
        $("body").fadeOut(1000, function()
        {
            window.location = href;
        });
    }
    
    $(".button").click(function()
    {
        var href = $(this).find("a").attr("href");
        changePage(href);
    });
    
    
    
    //pick image
    var imageIndex = -1;
    $("#pics img").click(function()
    {
        if (imageIndex === -1)
        {
            $("#buttonHidden").addClass("button");
        }
        
        $(this).parent().find("img").css("box-shadow", "none");
        $(this).css({"box-shadow": "0 0 20px rgba(0, 0, 0, 0.5)"}, 300);
       
        imageIndex = $(this).index();
    });
    
    $("#buttonHidden").click(function()
    {
        var href = $(this).find("a").attr("href");

        changePage(href);
    });
    
    
    
    
    // game functions
    //  
    //  initialize the game
    var tiles = [];
    var img = "url(img/" + (2) + ".jpg) no-repeat";
    var num = 0;
    const emptyTile = 0;
    var immovables = [];
    var movables = [];
    var solved = false;
    var shuffleAmount = 0;
    var moves = [];
    
    for (var row = 0; row < 3; row++) 
    {
        for (var column = 0; column < 3; column++) 
        {
            //if (row === 0 && column === 0) continue;
            leftMargin = (column > 0) ? (column + 1) * 10 : 10;
            topMargin = (row > 0) ? (row + 1) * 10 : 10;

            tiles.push(
                {
                    btop: -row * 150,
                    bleft: -column * 150,
                    data: num,
                    backgroundImage: img,
                    move: 
                    {
                        left: column * 150 + leftMargin,
                        top: row * 150 + topMargin,
                        row: row,
                        col: column,
                        current: num++
                    }
                });
        }
    }

    var createBoard = function () 
    {
        var ul = $("ul").empty();
        
        for (var i = 1; i < tiles.length; i++)
        {
            var li = $("<li id='" + tiles[i].data + "'>");
            li.css(
                {
                    "background": img,
                    "background-position": (tiles[i].bleft + "px " + tiles[i].btop + "px"),
                    "top": tiles[i].move.top + "px ",
                    "left": + tiles[i].move.left + "px"
                }).append(i);
            
            

            li.addClass("correct");
            ul.append(li);
        }
    }();

    var getImmovables = function () 
    {
        immovables = [];
        movables = [];
        var correctTiles = 0;
        for (var i = 0; i < tiles.length; i++)
        {
            if (Math.abs(tiles[i].move.row - tiles[emptyTile].move.row) + Math.abs(tiles[i].move.col - tiles[emptyTile].move.col) !== 1)
                immovables.push(tiles[i].data);
            else
                movables.push(tiles[i].move.current);
            
            if (tiles[i].data === tiles[i].move.current)
                correctTiles++;
        }
        
        if (correctTiles === 9)
            solved = true;
        else
            solved = false;
    };

    var isMovable = function (index) 
    {
        return movables.includes(tiles[index].move.current);
    };

    var changeOpacity = function (opacity) 
    {
        immovables.forEach(function (item) 
        {
            $("#" + tiles[item].data).css("opacity", opacity);

        });
    };

    getImmovables();
            
    $("#game ul").on("mouseenter", function () 
    {
        if (!solved && !$(this).find("li").is(":animated"))
            changeOpacity(0.5);
    }).on("mouseleave", function () 
    {
        changeOpacity(1);
    });

    $("#game ul").on('click', 'li', function ()
    {
        index = $(this).index() + 1;
        shiftTiles(index);
    });

    var shiftTiles = function (pressed) 
    {
        if (isMovable(pressed)) 
        {
            $("#" + pressed).finish().animate(
            {
                "top": tiles[emptyTile].move.top,
                "left": tiles[emptyTile].move.left
            }, 1000);
            
            var temp = tiles[pressed].move;
            tiles[pressed].move = tiles[emptyTile].move;
            tiles[emptyTile].move = temp;

            setClass(pressed);
            changeOpacity(1);
            getImmovables();
            
            changeOpacity(0.5);
        }
    };
    
    var setClass = function(index)
    {
        var li = $("#" + tiles[index].data).removeClass();
        if (tiles[index].data === tiles[index].move.current)
            li.addClass("correct");
        else
            li.addClass("incorrect");
    };

    var shuffle = function()
    {
        var num = -1;
        var c = shuffleAmount;
        changeOpacity(1);

        var move = function(delay)
        {
            if (c-- > 0)
            {
                var rand;

                do
                {
                    rand = Math.floor(Math.random() * 9);
                } while (num === rand || !isMovable(rand));

                num = rand;

                if (isMovable(num)) 
                {
                    $("#" + num).animate(
                    {
                        "top": tiles[emptyTile].move.top,
                        "left": tiles[emptyTile].move.left
                    }, delay, function()
                    {
                        var temp = tiles[num].move;
                        tiles[num].move = tiles[emptyTile].move;
                        tiles[emptyTile].move = temp;

                        getImmovables();
                        setClass(num);
                        moves.push(num);
                        move(delay);
                    });
                }
                else
                {
                    changeOpacity(0.5);
                }
            }
        };
        move(1000 - c * 20);
    };
    
    var solve = function()
    {
        var current = [];

        for (var i = 0; i < tiles.length; i++)
            current[tiles[i].move.current] = i;
        
        var moves = solvePuzzle(current);
        
        console.log(moves); 
        var move = function(delay)
        {
            if (moves.length > 0)
            {
                var num = moves.pop();

                
                $("#" + num).animate(
                {
                    "top": tiles[emptyTile].move.top,
                    "left": tiles[emptyTile].move.left
                }, delay, function()
                {
                    var temp = tiles[num].move;
                    tiles[num].move = tiles[emptyTile].move;
                    tiles[emptyTile].move = temp;

                    getImmovables();
                    
                    setClass(num);
                    move(delay);
                });
            }
        };
        if (!solved)
            move(300);
    };
    
    $("h1").click(function()
    {
        solve();
    });
    
    
    
    //  select shuffle
    $("#shuffle").selectmenu(
    {
        change: function()
        {
            shuffleAmount = Number.parseInt(this.value);
            $("#play").removeClass("hideButton");
        }
    });
    
     $("#play").click(function()
    {
        if (solved)
        {
            shuffle();
            solved = false;
        }
    });
});