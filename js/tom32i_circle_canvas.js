function CircleCanvas (id, animationName)
{
	this.addCirle = function (circle)
	{
		this.circles[this.circles.length] = circle;
		circle.draw();
	} 

	this.draw = function()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (var i = this.circles.length - 1; i >= 0; i--) 
		{
			this.circles[i].draw();
		}
	}

	this.update = function ()
	{
		var change = false;

		for (var i = this.circles.length - 1; i >= 0; i--) 
		{
			change = this.circles[i].update() || change;
		}

		if(change)
		{
			this.draw();
		}
		else
		{
			setMotion(false, this.animationName);
		}
	}

	this.mouseHandler = function(e)
	{
		this.mouseX = e.clientX - this.position.left;
        this.mouseY = e.clientY - this.position.top;

        for (var i = this.circles.length - 1; i >= 0; i--) 
		{
			this.circles[i].objectHandler(this.mouseX, this.mouseY);
		}
	}

	this.animationName = animationName;

	this.canvas = document.getElementById(id);
	this.context = this.canvas.getContext('2d');
	this.position = getPosition(this.canvas);
	this.circles = [];

	this.centerX = this.canvas.width / 2;
	this.centerY = this.canvas.height / 2;

	Line.prototype.canvas = this;
	Circle.prototype.canvas = this;
	Name.prototype.canvas = this;

	var canvas = this;
	addEvent(this.canvas, 'mousemove', function(e){ canvas.mouseHandler(e); });
	//setMotion(true, this.animationName);
}

function Line (x_from, y_from, x_to, y_to, width, color)
{
	// Default Values 
	if(typeof(x_from) == "undefined") { x_from = this.canvas.centerX; }
	if(typeof(y_from) == "undefined") { y_from = this.canvas.centerY; }
	if(typeof(x_to) == "undefined") { x_to = 0; }
	if(typeof(y_to) == "undefined") { y_to = 0; }
	if(typeof(width) == "undefined") { width = 1; }
	if(typeof(color) == "undefined") { color = 'white'; }


	this.setWidth = function (width)
	{
		this.width = width;
	}

	this.setColor = function (color)
	{
		this.color = color;
	}

	this.setFrom = function (x, y)
	{
		this.from = { x: x, y: y };
	}

	this.setTo = function (x, y)
	{
		this.to = { x: x, y: y };
	}

	this.draw = function ()
	{
		this.canvas.context.beginPath();

		this.canvas.context.moveTo( this.from.x, this.from.y );
		this.canvas.context.lineTo( this.to.x, this.to.y );

		this.canvas.context.lineWidth = this.width;
		this.canvas.context.strokeStyle = this.color;

		this.canvas.context.stroke();
	}

	this.setFrom(x_from, y_from);
	this.setTo(x_to, y_to);
	this.setWidth(width);
	this.setColor(color);
}

function Name (content, color, size)
{
	if(typeof(content) == "undefined") { content = ''; }
	if(typeof(color) == "undefined") { color = 'black'; }
	if(typeof(size) == "undefined") { size = 12; }

	this.setPosition = function (x, y)
	{
		this.x = x;
		this.y = y;
	}

	this.setSize = function (size)
	{
		this.size = size < 12 ? 12 : size;
	}

	this.setColor = function (color)
	{
		this.color = color;
	}

	this.setContent = function (content)
	{
		this.content = content;
	}

	this.draw = function ()
	{
		this.canvas.context.font = 'normal ' + this.size + 'px ' + this.font;
		this.canvas.context.textBaseline = 'middle';
		this.canvas.context.fillStyle = this.color;
		this.canvas.context.fillText(this.content, this.x, this.y);
	}
}

function Force(startX, startY, stopX, stopY)
{
	var d = new Date();
	this.starttime = d.getTime();
	this.acceleration = 100; // pixel per second
	this.startX = startX;
	this.startY = startY;
	this.distanceX = Math.abs( startX - stopX ) / 10;
	this.distanceY = Math.abs( startY - stopY ) / 10;
	this.signX = startX < stopX ? 1 : -1;
	this.signY = startY < stopY ? 1 : -1;

	this.update = function ()
	{
		var d = new Date();
		var time = d.getTime();
		time = time - this.starttime;

		if( this.distanceX >= this.distanceY )
		{
			var newDistanceX = this.distanceX - 0.5 * this.acceleration * Math.pow(time / 1000, 2);

			if(newDistanceX <= 0){ return false; }

			var newDistanceY = (newDistanceX * this.distanceY) / this.distanceX;
		}
		else
		{
			var newDistanceY = this.distanceY - 0.5 * this.acceleration * Math.pow(time / 1000, 2);

			if(newDistanceY <= 0){ return false; }

			var newDistanceX = (newDistanceY * this.distanceX) / this.distanceY;
		}

		this.distanceX = newDistanceX;
		this.distanceY = newDistanceY;

		//this.distance = Math.sqrt( Math.pow( distanceX , 2) + Math.pow( distanceY , 2) );
		return true;
	}
}

function Circle (x, y, width, color, content)
{
	this.line = new Line();
	this.name = new Name(content);
	this.forces = [];

	/*this.pasX = 5;
	this.pasY = 5;*/

	this.setPosition = function (x, y)
	{
		this.currentX = x;
		this.currentY = y;

		this.line.setTo(x, y);

		this.name.setPosition( x + this.radius + 10 , y );

		for (var i = this.canvas.circles.length - 1; i >= 0; i--) 
		{
			var circle = this.canvas.circles[i];

			if(circle != this)
			{
				this.canvas.circles[i].objectHandler(x, y);
			}
		}
	}

	this.setWidth = function (width)
	{
		this.radius = Math.ceil(width / 2);
		this.range = this.radius + 50; // mouse detection range

		this.name.setSize( Math.ceil( width / 5 ) );
	}

	this.setColor = function (color)
	{
		this.color = color;

		this.name.setColor(color);
	}

	this.setContent = function (content)
	{
		this.name.setContent(content);
	}

	this.draw = function ()
	{
		this.line.draw();

		this.canvas.context.beginPath();
		this.canvas.context.arc(this.currentX, this.currentY, this.radius, 0, 2 * Math.PI, false);
		this.canvas.context.fillStyle = this.color;
		this.canvas.context.fill();

		this.name.draw();
	}

	this.transferVelocity = function(XtoY)
	{
		if(XtoY)
		{
			this.velocityY += this.velocityX / 2;
			this.velocityX = 0;
		}
		else
		{
			this.velocityX += this.velocityY / 2;
			this.velocityY = 0;
		}
	}

	this.objectHandler = function(objX, objY)
	{
		var x = this.currentX - objX;
		var y = this.currentY - objY;
		var dist = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) );

		if(dist <= this.range)
		{
			this.forces[this.forces.length] = new Force(objX, objY, this.currentX, this.currentY);

			setMotion(true, this.canvas.animationName);
		}
	}

	this.update = function ()
	{
		if(this.forces.length)
		{	
			var forces = [];
			var newX = this.currentX;
			var newY = this.currentY;

			for (var i = this.forces.length - 1; i >= 0; i--) 
			{
				var force = this.forces[i];
				
				if(force.update())
				{
					forces[forces.length] = force;

					newX += force.distanceX * force.signX;
					newY += force.distanceY * force.signY;
				}
			}

			this.forces = forces;

			if(newX <= this.radius) 
			{ 
				newX = this.radius; 
			}
			if(newX >= (this.canvas.canvas.width - this.radius) ) 
			{ 
				newX = this.canvas.canvas.width - this.radius;
			}
			if(newY <= this.radius)
			{ 
				newY = this.radius;
			}
			if(newY >= (this.canvas.canvas.height - this.radius) ) 
			{ 
				newY = this.canvas.canvas.height - this.radius;
			}

			this.setPosition(newX, newY);

			return true;
		}

		return false;
	}

	this.setWidth(width);
	this.setPosition(x, y);
	//this.setNewPosition(x, y, false);
	this.setColor(color);
	this.setContent(content);
}