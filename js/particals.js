counter =0;

(function fairyDustCursor() {
  
  var possibleColors = ["#f3b809", "#86588f"]
  var width = window.innerWidth;
  var height = window.innerHeight;
  var cursor = {x: width/2, y: width/2};
  var particles = [];
  
  function init() {
    bindEvents();
    loop();
  }
  
  // Bind events that are needed
  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchstart', onTouchMove);
    
    window.addEventListener('resize', onWindowResize);
  }
  
  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  
  function onTouchMove(e) {
    if( e.touches.length > 0 ) {
      for( var i = 0; i < e.touches.length; i++ ) {
        addParticle( e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
      }
    }
  }
  
  function onMouseMove(e) {    
    cursor.x = e.clientX;
    cursor.y = e.clientY-5;
    
    addParticle( cursor.x, cursor.y, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
  }
  
a_count = 0;

  function addParticle(x, y, color) {
    if(++a_count%6==0){
      var particle = new Particle();
      particle.init(x, y, color);
      particles.push(particle);
    }
  }
  
  function updateParticles() {
    
    // Updated
    for( var i = 0; i < particles.length; i++ ) {
      particles[i].update();
    }
    
    // Remove dead particles
    for( var i = particles.length -1; i >= 0; i-- ) {
      if( particles[i].lifeSpan < 0 ) {
        particles[i].die();
        particles.splice(i, 1);
      }
    }
    
  }
  
  function loop() {
    requestAnimationFrame(loop);
    updateParticles();
  }
  
  /**
   * Particles
   */

  function Particle() {


    this.character = "Dominique";
    this.lifeSpan =300; //ms
    this.initialStyles ={
      "position": "absolute",
      "display": "block",
      "opacity":"0.45" ,
      "pointerEvents": "none",
      "z-index": "10000000",
      "fontSize": "27px",
      "will-change": "transform"
    };

    // Init, and set properties
    this.init = function(x, y, color) {

      this.velocity = {
        x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: 1
      };
      
      this.position = {x: x, y: y };
      this.initialStyles.color = color;

      this.element = document.createElement('span');
      if(counter>=this.character.length){
        counter=0;
      }

      this.element.innerHTML = this.character[counter++];
      applyProperties(this.element, this.initialStyles);
      this.update();
      
      document.querySelector('.container').appendChild(this.element);
    };
    
    this.update = function() {
      this.lifeSpan--;
      
      this.element.style.webkitFilter = "blur("+(3-this.lifeSpan/30)+"px)";
      this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px, 0) scale(" + (10-this.lifeSpan/40) + ")";
    }
    
    this.die = function() {
      this.element.parentNode.removeChild(this.element);
    }
    
  }
  
  /**
   * Utils
   */
  
  // Applies css `properties` to an element.
  function applyProperties( target, properties ) {
    for( var key in properties ) {
      target.style[ key ] = properties[ key ];
    }
  }
  
  init();
})();