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
    
    
    //  select on game
    $( "#move" ).selectmenu();
    // game functions
    var tiles = [];
    var img = "url(img/" + (2) + ".jpg) no-repeat";
    var num = 0;
    var emptyTile = 0;
    for (var row = 0; row < 3; row++)
    {
        for (var column = 0;column < 3; column++)
        {
            (column > 0) ? leftMargin = (column+1)*10 : leftMargin = 10;
            (row > 0) ? topMargin = (row+1)*10 : topMargin = 10;
            
            tiles.push(
            { 
                left: column * 150 + leftMargin, 
                top: row * 150 + topMargin,
                btop: -row * 150, 
                bleft: -column * 150, 
                data: num,
                current: num++,
                backgroundImage: img,
                opacity: 1,
                row: row,
                col: column
            });
        }
    }
   
    var createBoard = function()
    {
        var ul = $("#game ul").empty();
        
        $(tiles).each(function (index) 
        {
            var correct = index + 1 === this.data;
            var cssClass = (this.data === 0) ? "empty" : (correct ? "correct" : "incorrect");

            var li = $("<li id='" + tiles[index].data + "'>");
            
            if (cssClass !== "empty")
            {
                li.css(
                {
                    "background": img,
                    "background-position": (tiles[index].bleft + "px " + tiles[index].btop + "px")
                });
            }
            
            li.css({"top": tiles[index].top + "px ",
                    "left": + tiles[index].left + "px"});
            
            li.addClass(cssClass);
            ul.append(li);
        });
    }();
    
    var immovables = [];
    var getImmovables = function () 
    {
        immovables = [];
        for (var i = 0; i < tiles.length; i++) 
        {
            if (Math.abs(tiles[i].row - tiles[emptyTile].row) 
                    + Math.abs(tiles[i].col - tiles[emptyTile].col) !== 1 
                    && tiles[i].data !== tiles[emptyTile].data)
                immovables.push(tiles[i]);  
        }
    };

    var isMovable = function(index) 
    {
        return !immovables.includes(tiles[index]);
    };

    var changeOpacity = function (opacity) 
    {
        immovables.forEach(function (item, i) 
        {
            $("#" + immovables[i].data).css("opacity", opacity);

        });
    };

    $("#game ul").on("mouseenter", function () 
    {
        getImmovables();
        changeOpacity(0.5);
    }).on("mouseleave", function () 
    {   
        changeOpacity(1);
    });
    
    $("#game ul").on('click', 'li', function()
    {
        index = $(this).index();
        shiftTiles(index);
    });
    
    var shiftTiles = function(pressed)
    {
        var a = isMovable(pressed);

        if (a) 
        {
            
        }
    };
});