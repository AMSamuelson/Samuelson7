//name: Ann Samuelson
//description: Assignment 7
//proposed points: 15 out of 15.  I have fully functioning code with all necessary requirements
//					included.  I would understand however, if you took a few points off since it
//					was not turned in at the time specified.
//
// key bindings are set so that pressing 'W' will make the eye position move in z direction
//                                       'S' will make the eye position move in -z direction
//                                       'A' will rotate to the left
//                                       'D' will rotate to the right
//   The keys allow for the user to move within the environment
//    it's a bit of a hack, but works well enough for simple navigation here



"use strict";

var render, canvas, gl;

var pointsArray = [];
var textureArray= [];
var program;

var zPos = 10.0;  //position of Eye
var theta  = 0.0; //rotation for eye position
var eye;

var modelViewMatrix;
var modelViewMatrixLoc;

var projectionMatrix;
var projectionMatrixLoc;

var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var texCoordsArray = [];

function loadPoints(points,texture) {
    //load the vertex positions and texture positions here
    //Create texture - 5 points
    //Floor - 1st Poly 
    points.push(vec4(-6.0, 0 , 10, 1));
    texture.push(vec2(0,.5));
    points.push(vec4(-6.0 , 0 , 0, 1));
    texture.push(vec2(0, 1));
    points.push(vec4(6.0 , 0 , 0, 1));
    texture.push(vec2(.5, 1));
    //Floor - 2nd Poly
    points.push(vec4(-6.0, 0 , 10, 1));
    texture.push(vec2(0,.5));
    points.push(vec4(6.0 , 0 , 0, 1));
    texture.push(vec2(.5, 1));
    points.push(vec4(6.0 , 0 , 10, 1));
    texture.push(vec2(.5, .5));

    //Wall - BACK - 1st Poly
    points.push(vec4(-6.0, 0 , 0, 1));
    texture.push(vec2(0, 0));
    points.push(vec4(6.0 , 10 , 0, 1));
    texture.push(vec2(.5, .5));
    points.push(vec4(-6.0 , 10 , 0, 1));
    texture.push(vec2(0, .5));
    //Wall - BACK - 2nd Poly
    points.push(vec4(-6.0, 0 , 0, 1));
    texture.push(vec2(0, 0));
    points.push(vec4(6.0 , 10 , 0, 1));
    texture.push(vec2(.5, .5));
    points.push(vec4(6.0 , 0 , 0, 1));
    texture.push(vec2(.5, 0));

    //Wall - LHS - 1st Poly
    points.push(vec4(-6.0, 0 , 10, 1));
    texture.push(vec2(0, 0));
    points.push(vec4(-6.0 , 10 , 10, 1));
    texture.push(vec2(0, .5));
    points.push(vec4(-6.0 , 10 , 0, 1));
    texture.push(vec2(.5, .5));
    //Wall - LHS - 2nd Poly
    points.push(vec4(-6.0, 0 , 10, 1));
    texture.push(vec2(0, 0));
    points.push(vec4(-6.0 , 10 , 0, 1));
    texture.push(vec2(.5, .5));
    points.push(vec4(-6.0 , 0 , 0, 1));
    texture.push(vec2(.5, 0));

    //Wall - RHS - 1st Poly
    points.push(vec4(6.0, 10 , 0, 1));
    texture.push(vec2(0, .5));
    points.push(vec4(6.0 , 10 , 10, 1));
    texture.push(vec2(.5, .5));
    points.push(vec4(6.0 , 0 , 0, 1));
    texture.push(vec2(0, 0));
    //Wall - RHS - 2nd Poly
    points.push(vec4(6.0, 10 , 10, 1));
    texture.push(vec2(.5, .5));
    points.push(vec4(6.0 , 0 , 0, 1));
    texture.push(vec2(0, 0));
    points.push(vec4(6.0 , 0 , 10, 1));
    texture.push(vec2(.5, 0));

    //Painting 1 - 1st Poly
    points.push(vec4(5.9, 5 , 2, 1));
    texture.push(vec2(1, 1));
    points.push(vec4(5.9 , 2 , 2, 1));
    texture.push(vec2(1, .5));
    points.push(vec4(5.9 , 2 , 5, 1));
    texture.push(vec2(.5, .5));

    //Add art - 2 points
    //Painting 1 - 2nd Poly
    points.push(vec4(5.9, 5 , 2, 1));
    texture.push(vec2(1, 1));
    points.push(vec4(5.9 , 5 , 5, 1));
    texture.push(vec2(.5, 1));
    points.push(vec4(5.9 , 2 , 5, 1));
    texture.push(vec2(.5, .5));

    //Painting 2 - 1st Poly
    points.push(vec4(-5.9, 5 , 2, 1));
    texture.push(vec2(1, .5));
    points.push(vec4(-5.9 , 2 , 2, 1));
    texture.push(vec2(1, 0));
    points.push(vec4(-5.9 , 2 , 5, 1));
    texture.push(vec2(.5, 0));

    //Painting 2 - 2nd Poly
    points.push(vec4(-5.9, 5 , 2, 1));
    texture.push(vec2(1, .5));
    points.push(vec4(-5.9 , 5 , 5, 1));
    texture.push(vec2(.5, .5));
    points.push(vec4(-5.9 , 2 , 5, 1));
    texture.push(vec2(.5, 0));







}


function configureTexture(image) {
    var texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    
    //point sampling
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

}

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .9, .9, .9, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    loadPoints(pointsArray, textureArray);

    //establish buffers to send to shaders
    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(textureArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    //establish texture
    var image = document.getElementById("texImage");
    configureTexture(image);

   //Menu to alternate between point sampling and mip mapping - 3 pts.
   document.getElementById("Texture Style").onclick = function(event){
   	switch(event.target.index){
   		case 0: //Mip Mapping
   			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
   			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   			break;
   		case 1: //Point Sampling
   			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
   			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   			break;
   		};	
   	};


   // Initialize event handler (key codes)
    window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'W': //forward
            zPos -= .4
            break;
          case 'S': //back 
            zPos += .4
           break;
          case 'A': //pan to left
            theta-=.04;
            break;
          case 'D':  //pan to right
           theta+=.04;
           break;
        }
    };

    render();
}

render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT);

    eye = vec3(0, 1, zPos);
    at = vec3(zPos*Math.sin(theta), 1, 10 - 10*Math.cos(theta));

    //establish modelView and Projection matrices
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(45, 1, 1.0, 100);
 
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    //draw triangles
    gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length);
 
    requestAnimFrame(render);
}
