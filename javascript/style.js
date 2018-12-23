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
    var tiles = [];
    var img = "url(img/" + (2) + ".jpg) no-repeat";
    var num = 0;
    var emptyTile;
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
        emptyTile = tiles[0];
    }
   
    var createBoard = function()
    {
        var ul = $("ul").empty();
        
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
            if (Math.abs(tiles[i].row - emptyTile.row) + Math.abs(tiles[i].col - emptyTile.col) !== 1 && tiles[i] !== emptyTile)
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

    $("ul").on("mouseenter", function () 
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
//        var newIndex = -1;
//        if (pressed - 1 >= 0 && tiles[pressed - 1].data === 0) 
//        { 
//            // check left
//            newIndex = pressed - 1;
//        }  
//        else if (pressed + 1 < 3 && tiles[pressed + 1].data === 0) 
//        { 
//            // check right
//            newIndex = pressed + 1;
//        } 
//        else if (pressed - 3 >= 0 && tiles[pressed - 3].data === 0) 
//        { 
//            //check up
//            newIndex = pressed - 3;
//        }
//        else if (pressed + 3 < tiles.length && tiles[pressed + 3].data === 0) 
//        { 
//            // check down
//            newIndex = pressed + 3;
//        }
        var a = isMovable(pressed);

        if (a) 
        {
            var li = $("li").eq(pressed);
            var temp = emptyTile.data;
            
            emptyTile.data = tiles[pressed].data;
            tiles[pressed].data = temp;
                
            li.animate(
                {
                    "top": emptyTile.top,
                    "left": emptyTile.left
                }, 1000);
                
//            console.log(tiles[pressed]);
//            console.log(" --> ");
//            console.log(emptyTile.data);
//            console.log(tiles);
            
            getImmovables();
            console.log(emptyTile.data);
            var correct = pressed + 1 === emptyTile.data;
//            var cssClass = (this.data === 0) ? "empty" : (correct ? "correct" : "incorrect");

//            li.removeClass("empty correct incorrect").addClass(cssClass);

            
        }
    };
});