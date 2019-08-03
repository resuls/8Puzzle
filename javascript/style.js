$(function() 
{
   //SLIDER
   $("#slider div:gt(0)").hide();
   
    setInterval(function() 
    { 
         $("#slider > div:first")
           .next()
           .fadeIn(1000)
           .end()
           .appendTo("#slider")
           .hide();
    }, 3000);
   
    //  div change for pages    
    $("body > div:gt(0)").hide();
    
    var changePage = function()
    {
        $("body > div:first")
               .fadeOut(500, function()
        {
           $(this).next()
                .fadeIn(500)
                .end()
                .appendTo("body")
                .hide();
        });
    };
    
    $(".button").click(function()
    {
        changePage();
    });
    
    //pick image
    var imageIndex = -1;
    $("#pics img").click(function()
    {
        $("#buttonHidden").addClass("button");
        
        $(this).parent().find("img").css("box-shadow", "none");
        $(this).css({"box-shadow": "0 0 20px rgba(0, 0, 0, 0.5)"}, 300);
       
        imageIndex = $(this).index() + 1;
    });
    
    //  set Image before changing page
    var img;
    $("#buttonHidden").click(function()
    {
        img = "url(img/" + imageIndex + ".jpg) no-repeat";
        changePage();
        createBoard();
    });
    
    // game functions
    //  
    //  initialize the game
    var tiles = [];
    var num = 0;
    const emptyTile = 0;
    var immovables = [];
    var movables = [];
    var solved = false;
    var shuffleAmount = 0;
    var moves = [];
    
    var topMargin = 5;
    for (var row = 0; row < 3; row++) 
    {
        var leftMargin = 5;
        for (var column = 0; column < 3; column++) 
        {
            tiles.push(
                {
                    btop: -row * 150,
                    bleft: -column * 150,
                    data: num,
                    move: 
                    {
                        left: column * 150 + leftMargin,
                        top: row * 150 + topMargin,
                        row: row,
                        col: column,
                        current: num++
                    }
                });
            leftMargin += 5;
        }
        topMargin += 5;
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
                });
            li.addClass("correct");
            ul.append(li);
        }
    };

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
    
    var resetGame = function()
    {
        solved = true;
        $("#select").show();
        $(".backdrop").hide();
        $("#popup").removeAttr("style");
        $("#game").css("opacity", 1);
        getImmovables();
        changeOpacity(1);
    };

    var shiftTiles = function (pressed) 
    {
        if (!solved)
        {
            if (isMovable(pressed)) 
            {
                $("#" + pressed).finish().animate(
                {
                    "top": tiles[emptyTile].move.top,
                    "left": tiles[emptyTile].move.left
                }, 500, function()
                {
                    if (solved)
                    {
                        $("#solveNow").hide();
                        $("#select").hide();
                        $(".backdrop").fadeTo(200, 1);
                        $("#popup").animate(
                        {
                            top: "300px",
                            "font-size": "120px"
                        }, 1000).animate({ "font-size": 100 }, 300);
                        $("#f5").show().animate(
                        {
                            top: "390px"
                        }, 1000);
                        $("#game").css("opacity", 0.5);
                    }
                });

                var temp = tiles[pressed].move;
                tiles[pressed].move = tiles[emptyTile].move;
                tiles[emptyTile].move = temp;

                setClass(pressed);
                changeOpacity(1);
                getImmovables();

                changeOpacity(0.5);
            }
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
                        
                        if (c <= 0)
                            $("#solveNow").fadeIn(1000);
                    });
                }
                else
                {
                    changeOpacity(0.5);
                }
            }
        };
        move(800 - c * 20);
    };
    
    
    
     //  select shuffle
     $("#shuffle").selectmenu(
     {
         change: function()
         {
             shuffleAmount = Number.parseInt(this.value);
             $("#play").removeClass("hideButton");
         }
     });
    
    $("body").keydown(function(e)
    {
        //  console.log(e.which);
        
        if (e.which === 116 && shuffleAmount > 0)
        {
            resetGame();
            e.preventDefault();
        }
        else if (e.which === 27)
        {
            solve();
            
            if (!solved)
                e.preventDefault();
        }
    });

    $("#solveNow span").click(function (e) 
    {
        solve();
    });
    
    $("#play").click(function()
    {
        if (solved)
        {
            $("#select").hide();
            shuffle();
            solved = false;
        }
    });

    var solve = function()
    {
        var current = [];

        for (var i = 0; i < tiles.length; i++)
            current[tiles[i].move.current] = i;
        
        var moves = solvePuzzle(current);
        
        //  console.log(moves); 
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
            else
            {
                $("#select").hide();
                $("#solveNow").hide();
                $(".backdrop").fadeTo(200, 1);
                $("#popup").hide();
                $("#game").css("opacity", 0.5);
                resetGame();
            }
        };
        if (!solved)
            move(300);
    };
});