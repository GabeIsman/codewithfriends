Square = function(canvas){
  this.canvas       = canvas;
  this.el           = document.createElement('div');
  this.el.className = "square";
  this.canvas.el.appendChild(this.el);
  this.x;
  this.y;
  this.xv = 0;
  this.yv = 0;
}

Square.prototype.placeRandom = function(){
  this.x = Math.random() * (this.canvas.el.offsetWidth - this.el.offsetWidth);
  this.y = Math.random() * (this.canvas.el.offsetHeight - this.el.offsetHeight);
  var position = {
    left: this.x,
    top: this.y
  }
  this.el.setStyle(position);
}

Square.prototype.randomColor = function(){
  return {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255)
  };
}

Square.prototype.render = function(){
  this.placeRandom();
  this.color = this.randomColor();
  this.el.setStyle({
    backgroundColor: "rgb(" + [this.color.r, this.color.g, this.color.b].join(',')  + ")"
  });
}

Square.prototype.updateVelocity = function(relatives) {
    var avgVelocity = averageVelocity(relatives);
    var center = averagePosition(relatives);
    var vectorToCenter = subtractVectors(center, this);
    var distanceToCenter = distance(center, this);
    var velocityToCenter = scaleVelocity({
      xv: vectorToCenter.x,
      yv: vectorToCenter.y
    }, repulsionFactor(center, this));
    var combinedVector = combineVectors(avgVelocity, velocityToCenter);
    var velocities = perturbVelocity(combinedVector);
    var newXv = Math.max(Math.min(velocities.xv, 5), -5);
    var newYv = Math.max(Math.min(velocities.yv, 5), -5);

    this.xv += newXv * 0.1;
    this.yv += newYv * 0.1;
  };

Square.prototype.move = function(){
  this.enforceConstraints();
  this.x = this.x + this.xv;
  this.y = this.y + this.yv;

  this.animate();
}

Square.prototype.animate = function() {
  this.el.setStyle({
    top: this.y + "px",
    left: this.x + "px"
  })
}

Square.prototype.enforceConstraints = function() {
  if (this.x > this.canvas.el.offsetWidth || this.x < 0) {
    this.xv = -this.xv;
  }
  if (this.y > this.canvas.el.offsetHeight || this.y < 0) {
    this.yv = -this.yv;
  }
  if (this.x > this.canvas.el.offsetWidth + 100) {
    this.x = this.x - this.canvas.el.offsetWidth - 200;
  }
  if (this.y > this.canvas.el.offsetWidth + 100) {
    this.y = this.y - this.canvas.el.offsetWidth - 200;
  }
  if (this.x < -100) {
    this.x = this.x + this.canvas.el.offsetWidth + 200;
  }
  if (this.y < - 100) {
    this.y = this.y + this.canvas.el.offsetWidth + 200;
  }
  if (Math.abs(this.xv) > 10) {
    this.xv = this.xv * 0.96;
  }
  if (Math.abs(this.yv) > 10) {
    this.yv = this.yv * 0.96 ;
  }
}

var averageVelocity = function(entities){
  return {
    xv: _.reduce(entities, function(memo, e) { return (e.xv || 0) + memo}, 0) / entities.length,
    yv: _.reduce(entities, function(memo, e) { return (e.yv || 0) + memo}, 0) / entities.length,
  }
}

var averagePosition = function(entities) {
  return {
    x: _.reduce(entities, function(memo, e) { return e.x + memo}, 0) / entities.length,
    y: _.reduce(entities, function(memo, e) { return e.y + memo}, 0) / entities.length,
  }
}

var perturbVelocity = function(velocities) {
  velocities.xv += (Math.random() * 10 - 5);
  velocities.yv += (Math.random() * 10 - 5);
  return velocities;
}

var combineVectors = function(a, b) {
  return {
    xv: (a.xv + b.xv) / 2,
    yv: (a.yv + b.yv) / 2
  }
}

var subtractVectors = function(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}

var scaleVelocity = function(a, scalar) {
  return {
    xv: a.xv * scalar,
    yv: a.yv * scalar
  }
}

var repulsionFactor = function(center, entity) {
  return Math.min(distance(center, entity) - 120, 1);
}
