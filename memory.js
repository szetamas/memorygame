const widths=180;

//random number generator
function rando(a)
{
	return Math.floor(Math.random()*a);
}

function reveal(where)
{
	//(if there is finded match, then those classes changed, and those not counted)
	if( $(".revealed").length < 2 )
	{
		//when the animation is going the cards are unclickable
		$("img").addClass("unclickable");
		$("img:eq("+where+")").addClass("revealed");

		//card revealing animation
		$("img:eq("+where+")").animate( {width: "0px", left: "+="+widths/2+"px"} , 100, function()
		{
			//when the animation is at half way, then the card src changes to the picture
			$(this).attr( "src", $(this).attr("src").slice( 0, $(this).attr("src").lastIndexOf("/")+1 )+cards[where]+"."+format );
			//then the rest of the animation is opposite of the first half
			$(this).animate( {width: widths+"px", left: "-="+widths/2+"px"} , 100, function()
			{
				//animation is end, pics are clickable again( except the first revealed )
				$("img").removeClass("unclickable");
				if( $(".revealed").length == 2 )
				{
					if( $(".revealed:first").attr("src") == $(".revealed:last").attr("src") )
					{
						check();
					}
				}
				else
				{
					$(this).addClass("unclickable");
				}			
			});
		});
	}
	else
	{
		//if there is 2 revealed card, then check that is there a match or not
		check();
	}
};

function check()
{
	//match: if the two card src is same 
	if( $(".revealed:first").attr("src")
	== $(".revealed:last").attr("src") )
	{
		$(".revealed").addClass("finded");
		$(".revealed").removeAttr("onclick");
		$(".revealed").removeClass("revealed");
		//if this was the last then, stop the game
		if( $("img").length == $(".finded").length )
		{
			clearInterval(timer);
			$("#timevis").text("|WIN|");
			$("#timevis").css("color","green;");
			$("#clock").css("visibility","visible");
		}
	}
	else
	{
		//when the animation is going the pics are unclickable
		$("img").addClass("unclickable");
		$(".revealed").animate( {width: "0px", left: "+="+widths/2+"px"} , 100, function()
		{
			$(this).attr("src", $(this).attr("src").slice( 0 ,  $(this).attr("src").lastIndexOf("/")+1 ) + "back."+format );
			$(this).animate( {width: widths+"px", left: "-="+widths/2+"px"} , 100, function()
			{
				//and when the animation is end pics are clickable again
				$("img").removeClass("unclickable");
				$(".revealed").removeClass("revealed");
			} );
		});
	}	
}

function deal(name ,piece)
{	
	var preload="<div>";
	
	//cards: an element's value mean wich card is and the index mean where on the "table"
	cards = []; //this use in reveal
	var lefts = [];

	//initializing the all possible(dupicated) cards number( 0.jpg, 1.jpg ...) to the lefts array
	for( var cv=0, cv2=0 ; cv2<piece ; cv2+=2 , cv++)
	{
		lefts[cv2]=cv;
		lefts[cv2+1]=cv;
		//and every turn i "make" an img with the srcs
		//(if the whole html has preload html tags in the <head> or sthing
		//then a lot of img loaded for nothing)
		preload+='<img src="'+name+'/'+cv+'.'+format+'" height="0" width="0">';
	}
	preload+='<img src="'+name+'/'+'back'+'.'+format+'" height="0" width="0"></div>';
	$("#out").append(preload);
	$("#out").empty();
	
	//make a table for the cards
	var tabletex='<table>';
	
	//make a \n for the loop
	var newline=Math.ceil(Math.sqrt(piece));
	
	for( var cv=0 ; cv < piece ; cv++ )
	{
		if( cv % newline == 0 )
		{
			if( cv!=0 )
			{
				tabletex+='</tr>';
			}
			tabletex+='<tr>';
		}
		
		//every turn needs a number randomly from the lefts
		//(every time a smaler randomnum 'cuz every turn the lefts length is smaler too)
		var r=rando(piece-cv);
		cards[cv] = lefts[r];
		//and remove the number from the lefts (every (duplicated) number needs just one)
		lefts.splice(r, 1);
		
		//and "write out" the cards with the reveal func (an img click event listener could be a solution too)
		tabletex+='<td><img onClick="reveal('+cv+');" src="'+name+
		'/back.'+format+'" width="'+widths+'px" height="'+widths+'px"></td>';
	}
	tabletex+='</tr></table>';
	$("#out").append(tabletex);
	
	//starting the timer
	var secs=0;
	timer=window.setInterval(function () { secs++; $("#clock").html("Time:"+secs); }, 1000);
}

$(document).ready(function()
{
	$("li").click(function()
	{
		format=$(this).attr("class");
		//change the back <a> "button" to reload
		$("[href='/../game.html']").attr("onclick","window.location.reload();");
		$("[href='/../game.html']").removeAttr("href");
		//every list item has a deal onlcick
		//with the name of the cards pack, piece, and the format of the pics
		deal( $(this).text() , parseInt( $(this).text().slice(
		 $(this).text().lastIndexOf("(")+1 ,  $(this).text().lastIndexOf(")") ) ) );
	});
	
	$("#timevis").click(function()
	{
		if( $(this).text()=="|HIDE|" )
		{
			$(this).text("|SHOW|");
			$("#clock").css("visibility","hidden");
		}
		else if( $(this).text()=="|SHOW|" )
		{
			$(this).text("|HIDE|");
			$("#clock").css("visibility","visible");
		}
	}); 
}); 
