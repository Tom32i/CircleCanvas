/* AnimationFrame */

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Canvas Loop

function canvasLoop()
{
	animFrame.circleCanvas.index = window.requestAnimationFrame(animFrame.circleCanvas.loop);
	circleCanvas.update();
}

// Functions

function setMotion(on, anim)
{
    if(on)
    {
        if(!animFrame[anim].motion) 
        {
            animFrame[anim].motion = true;
            animFrame[anim].index = window.requestAnimationFrame(animFrame[anim].loop);
        }
    }
    else
    {
        if(animFrame[anim].motion)
        {
            animFrame[anim].motion = false;
            window.cancelAnimationFrame(animFrame[anim].index);
        } 
    }
}

function addEvent(obj, e, fn)
{
    if(window.addEventListener)
    {
        obj.addEventListener(e, fn, false);
    }
    else if(window.attachEvent)
    {
        obj.attachEvent(e, fn, false);
    }
}

function getPosition(obj) 
{
	var curleft = curtop = 0;

	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}

	return {left: curleft, top: curtop};
}

// Configuration 
Name.prototype.font = "Helvetica";
Circle.prototype.nameDistance = 10; // MArge entre le cercle et le texte.
Circle.prototype.mouseDetectionRange = 50; // Distance à laquelle les cercle interagissent.
Force.prototype.acceleration = 10; // Valeur élévée : les cercle s'arrete plus vite.
Force.prototype.speed = 300; // Valeur élévée : les cercles vont plus vite.

// Canvas creation
var framerate = 0.06;
var animFrame = { 
	circleCanvas: {index: 0, loop: canvasLoop, motion: false}, 
};
var circleCanvas = new CircleCanvas("myCanvas", 'circleCanvas');

/* RANDOM :

 var names = [
    "Cherche un stage !", 
    "PAO", 
    "Motion Design", 
    "Wordpress", 
    "Photo", 
    "Clarinette", 
    "Programmation Web", 
    "Audiovisuel", 
    "Mise en page",
    "Gestion de projet"
];

// Circles
for (var i = names.length - 1; i >= 0; i--) 
{
    var width = Math.floor(Math.random() * 75) + 50;
    var x = Math.floor( Math.random() * (circleCanvas.canvas.width - width * 2) + width);
    var y = Math.floor( Math.random() * (circleCanvas.canvas.height - width * 2) + width);
    var color = 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')';

    circleCanvas.addCirle( new Circle(x, y, width, color, names[i]) );
};*/



// MANUAL : new Circle(x, y, radius, color, title);

circleCanvas.addCirle( new Circle(150, 50, 80, '#bd1550', 'Je cherche un stage !') );
circleCanvas.addCirle( new Circle(340, 150, 35, '#b1bc1b', 'PAO') );
circleCanvas.addCirle( new Circle(460, 100, 20, '#e97f02', 'Motion Design') );
circleCanvas.addCirle( new Circle(660, 120, 60, '#b1bc1b', 'Wordpress') );
circleCanvas.addCirle( new Circle(610, 250, 40, '#bd1550', 'Photo') );
circleCanvas.addCirle( new Circle(640, 320, 30, '#490a3d', 'Clarinette') );
circleCanvas.addCirle( new Circle(530, 420, 60, '#b1bc1b', 'Programmation Web') );
circleCanvas.addCirle( new Circle(240, 390, 70, '#e97f02', 'Audiovisuel') );
circleCanvas.addCirle( new Circle(130, 350, 50, '#bd1550', 'Mise en page') );
circleCanvas.addCirle( new Circle(50, 230, 60, '#490a3d', 'Gestion de projet') );