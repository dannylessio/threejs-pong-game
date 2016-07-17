var camera, scene, renderer;
var keyState = {};
var plane, player1, player2, ball;
var x_plane, y_plane;
var x_cube, y_cube;
var ball_radius;
var ball_speed = 0.1;
var player1_score = 0;
var player2_score = 0;


function setRenderer() {

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}


function setCamera() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 5;
}


function setCameraControls() {

	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;
}


function setScene() {

	scene = new THREE.Scene();
}


function setWorld() {
	/* Inside this we put all the object of our scene */
	x_plane = 5;
 	y_plane = 3;
	x_cube = 0.1;
	y_cube = 0.5;

	/* Adding the plane */
	var geometry = new THREE.BoxGeometry( x_plane, y_plane, 0.01 );
	var material = new THREE.MeshPhongMaterial( {color: 0x2222ff, side: THREE.DoubleSide} );
	plane = new THREE.Mesh( geometry, material );
	scene.add( plane );

	/* adding the vertical decoration */
	var geometry = new THREE.BoxGeometry( 0.05, y_plane, 0.1 );
	var material = new THREE.MeshBasicMaterial( {color: 0x888888, side: THREE.DoubleSide} );
	var dec1 = new THREE.Mesh( geometry, material );
	scene.add( dec1 );

	/* adding the top horizontal decoration */
	var geometry = new THREE.BoxGeometry( x_plane + 0.1, 0.05, 0.1 );
	var material = new THREE.MeshBasicMaterial( {color: 0xcccccc, side: THREE.DoubleSide} );
	var dec2 = new THREE.Mesh( geometry, material );
	dec2.position.y = y_plane/2 + 0.025;
	scene.add( dec2 );

	/* adding the low horizontal decoration */
	var geometry = new THREE.BoxGeometry( x_plane + 0.1, 0.05, 0.1 );
	var material = new THREE.MeshBasicMaterial( {color: 0xcccccc, side: THREE.DoubleSide} );
	var dec3 = new THREE.Mesh( geometry, material );
	dec3.position.y = -y_plane/2 -0.025;
	scene.add( dec3 );

	/* Adding player 1 */
	var geometry = new THREE.BoxGeometry( x_cube, y_cube, 0.1 );
	var material = new THREE.MeshPhongMaterial( {color: 0x005000} );
	player_1 = new THREE.Mesh( geometry, material );
	player_1.position.x = -x_plane / 2;
	scene.add( player_1 );

	/* Adding player 2 */
	var geometry = new THREE.BoxGeometry( x_cube, y_cube, 0.1 );
	var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
	player_2 = new THREE.Mesh( geometry, material );
	player_2.position.x = x_plane / 2;
	scene.add( player_2 );


	/* Adding the ball */
	ball_radius = 0.05;
	var geometry = new THREE.SphereGeometry( ball_radius, 32, 32 );
	var material = new THREE.MeshPhongMaterial( {color: 0xFF8C00} );
	ball = new THREE.Mesh( geometry, material );
	ball.position.z += 0.05;
	scene.add( ball );

	
}


function setCameraHelper() {
	
	var helperCamera = new THREE.CameraHelper( camera );
	scene.add( helperCamera );
}


function setDrawHelpers( size ) {

	var axisHelper = new THREE.AxisHelper( size );
	scene.add( axisHelper );
}	


function save_ball_speed(){
	if( ball_speed != 0 ){
		return ball_speed;
	}
}

var lock = 0;
function respawn_on_player1( recover_speed ){
	ball.position.copy( player_1.position );
	console.log( recover_speed )
	ball_speed = -recover_speed;
	lock = 0;
}

function respawn_on_player2( recover_speed ){
	ball.position.copy( player_2.position );
	console.log( recover_speed )
	ball_speed = -recover_speed;
	lock = 0;
}

function get_random_angle( minimum, maximum ){

	var randomnumber = Math.random() * ( maximum - minimum ) + minimum;
	
	return randomnumber;
}

var ball_angle = Math.PI;
var player2_speed = 0.05;

function animate() {

	requestAnimationFrame( animate );
	
	ball.position.x += ball_speed * Math.cos( ball_angle );
	ball.position.y += ball_speed * Math.sin( ball_angle );

	
	/* check player_1 collision */
	if( ( ball.position.x < player_1.position.x + (x_cube / 2) ) && 
		( ball.position.y < ( player_1.position.y + y_cube / 2  ) ) &&
		( ball.position.y > ( player_1.position.y - y_cube / 2  ) ) ) {

		if( lock == 0 ){
			ball.position.x = player_1.position.x + (x_cube / 2);
			ball_speed = -ball_speed;
			ball_angle = get_random_angle( -Math.PI/4, Math.PI/4 );
		}
	}

	/* check player_2 collision */
	if( ( ball.position.x > player_2.position.x - (x_cube / 2) ) && 
		( ball.position.y < ( player_2.position.y + y_cube / 2  ) ) &&
		( ball.position.y > ( player_2.position.y - y_cube / 2  ) ) ) {

		if( lock == 0 ){
			ball.position.x = player_2.position.x - (x_cube / 2);
			ball_speed = -ball_speed;
			ball_angle = get_random_angle( -Math.PI/4, Math.PI/4 );
		}
	}

	/* collision with tob barrier */
	if( ball.position.y >= (y_plane / 2)){
		ball_angle = -ball_angle;
	}

	/* collision with tob barrier */
	if( ball.position.y <= -(y_plane / 2)){
		ball_angle = -ball_angle;
	}

	/* AI of red player */
	if( player_2.position.y <= (ball.position.y - player2_speed) ){
		if( player_2.position.y < ( (y_plane / 2) - ( y_cube / 2 )) ){
				player_2.position.y += player2_speed;
		}
	}

	if( player_2.position.y > ball.position.y ){
		if( player_2.position.y > ( - (y_plane / 2) + ( y_cube / 2 )) ){
			player_2.position.y -= 0.1;
		}
	}

	/* Goal on player_1 side */
	if( ball.position.x < -x_plane/2 - 2*ball_radius ){

		var old_ball_speed = save_ball_speed();

		if( lock == 0 ){
			player2_score += 1;
			document.getElementById("player2_score").innerHTML = player2_score;
			setTimeout( respawn_on_player1, 1000, old_ball_speed );
			lock = 1;
		}

		ball_speed = 0;
	}


	/* Goal on player_2 side */
	if( ball.position.x > x_plane/2 + 2*ball_radius ){

		var old_ball_speed = save_ball_speed();

		if( lock == 0 ){
			player1_score += 1;
			document.getElementById("player1_score").innerHTML = player1_score;
			setTimeout( respawn_on_player2, 1000, old_ball_speed );
			lock = 1;
		}
		
		ball_speed = 0;
	}


	renderer.render( scene, camera );
}


function setEventListenerHandler(){
	window.addEventListener('keydown',function(e){
	    keyState[e.keyCode || e.which] = true;
	},true); 

	window.addEventListener('keyup',function(e){
	    keyState[e.keyCode || e.which] = false;
	},true);
	
	window.addEventListener( 'resize', onWindowResize, false );
}


function setKeyboardControls() {
    
    if( keyState[87] ){
    
        if( player_1.position.y < ( (y_plane / 2) - ( y_cube / 2 )) ){
			player_1.position.y += 0.1;
		}
    }

    if( keyState[83] ){
        
        if( player_1.position.y > ( - (y_plane / 2) + ( y_cube / 2 )) ){
			player_1.position.y -= 0.1;
		}
    }

    setTimeout( setKeyboardControls, 10 );
}    
	

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function setLights(){

	var light = new THREE.AmbientLight( 0xffffff );
	scene.add( light );


	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 0, 0, 2 );

	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = window.innerWidth;
	spotLight.shadow.mapSize.height = window.innerHeight;

	scene.add( spotLight );
}


function reset(){

	player1_score = 0;
	player2_score = 0;
	document.getElementById("player1_score").innerHTML = player1_score;
	document.getElementById("player2_score").innerHTML = player2_score;
	
	if( lock == 0 ){
		ball.position.x = 0;
		ball.position.y = 0;
		ball_speed = -0.1;
		ball_angle = Math.PI;	
	}
}

function main() {

	setRenderer();
	setCamera();
	setCameraControls();
	setEventListenerHandler();
	setKeyboardControls();
	setScene();
	setLights();
	//setCameraHelper()
	//setDrawHelpers( 5 )
	setWorld();
	animate();
}
