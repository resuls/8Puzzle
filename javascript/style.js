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
    var tile = [];
    var img = "url(img/" + (2) + ".jpg) no-repeat";
    var num = 0;
    for (var row = 0; row < 3; row++)
    {
        for (var column = 0;column < 3; column++)
        {
            if (column > 0) leftMargin = (column+1)*10; else leftMargin = 10;
            if (row > 0) topMargin = (row+1)*10; else topMargin = 10;
            
            tile.push(
            { 
                left: column * 150 + leftMargin, 
                top: row * 150 + topMargin,
                btop: -row * 150, 
                bleft: -column * 150, 
                data: num,
                current: num++,
                backgroundImage: img,
                opacity: 1
               
            });
            
        }
        
    }
   
    var createBoard = function()
    {
        var ul = $("ul").empty();
        
        $(tile).each(function (index) 
        {
            var correct = index + 1 === this.data;
            var cssClass = (this.data === 0) ? "empty" : (correct ? "correct" : "incorrect");

            var li = $("<li>");
            
            if (cssClass !== "empty")
            {
                li.css(
                {
                    "background": img,
                    "background-position": (tile[index].bleft + "px " + tile[index].btop + "px")
                });
            }
            
            li.css({"top": tile[index].top + "px ",
                    "left": + tile[index].left + "px"});
            
            li.addClass(cssClass);
            ul.append(li);
        });
    }();
    
    $("#game ul").on('click', 'li', function()
    {
        index = $(this).index();
        shiftTiles(index);
    });
    
    var shiftTiles = function(pressed)
    {
        var newIndex = -1;
        if (pressed - 1 >= 0 && tile[pressed - 1].data === 0) 
        { 
            // check left
            newIndex = pressed - 1;
        } 
        else if (pressed + 1 < 3 && tile[pressed + 1].data === 0) 
        { 
            // check right
            newIndex = pressed + 1;
        } 
        else if (pressed - 3 >= 0 && tile[pressed - 3].data === 0) 
        { 
            //check up
            newIndex = pressed - 3;
        }
        else if (pressed + 3 < tile.length && tile[pressed + 3].data === 0) 
        { 
            // check down
            newIndex = pressed + 3;
        }

        if (newIndex !== -1) 
        {
            var li = $("li").eq(pressed);
            var temp = tile[newIndex];
            
            console.log(newIndex);
            console.log(tile);
            li.animate(
                {
                    "top": tile[newIndex].top,
                    "left": tile[newIndex].left
                }, 1000);
            
            tile[newIndex] = tile[pressed];
            tile[pressed] = temp;
            
            var correct = pressed + 1 === tile[newIndex].data;
//            var cssClass = (this.data === 0) ? "empty" : (correct ? "correct" : "incorrect");

//            li.removeClass("empty correct incorrect").addClass(cssClass);

            
        }
    };
});