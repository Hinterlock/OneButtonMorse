title = "Number Cruncher";

description = `
[Tap]  Zero
[Hold] One
`;

characters = []; // for sprites (none atm)

const G = {
	WIDTH: 100,
	HEIGHT: 100
};

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	isPlayingBgm: true,
	theme: "crt"
};

// constants
const questionTime = 600;
const maxTime = 2000;
const holdTime = 10;

// variables
let isPressing;		// checking if button is held
let held; 			// counts how long button is held, to differentiate dots and dashes
let nextQ;			// check to ask next question
let timeout;		// keeping track of time till timeout into next question
let answer; 		// player input
let correctAnswer;	// what input should match
let binaryTxt;		// display text in binary
let b10Txt;			// display text in base 10

// difficulty = digits
function binaryArrayToStr(arr) { // function for printing arrays without commas
	let s = "";
	for (let i = 0; i < arr.length; i++) {
		s = s.concat(String(arr[i]));
		s = s.concat(" ");
	}
	return s;
}
function Generator(digits){ // generates a number and saves it in str form to binaryTxt as binary and b10Txt as base 10
	let resD = 0;
	for(let x in range(digits)){
		correctAnswer[parseInt(x)] = floor(Math.random()*2);
		resD += correctAnswer[parseInt(x)] * Math.pow(2, digits - parseInt(x) - 1);
	}
	//txt = String(resD);
	binaryTxt = binaryArrayToStr(correctAnswer);
	b10Txt = String(resD);
}

function update() {
	if (!ticks) { // Initialize variables
		isPressing = false;
		held = 0;
		nextQ = true;
		timeout = 0;
		answer = [];
		correctAnswer = [];
		binaryTxt = "testing";
	}
	// Gen prompt
	if (nextQ) {
		/*timeout += questionTime; // if you want question time to carry over
		if (timeout > maxTime) {
			timeout = maxTime;
		}*/
		timeout = questionTime;
		// ask question
		Generator(5);
		console.log(b10Txt);
		console.log(binaryTxt);
		console.log(correctAnswer);
		nextQ = false;
	}

	color("red");
	line(vec(0, 10), vec(timeout*100/questionTime, 10)); // timeout bar
	text(String(floor(timeout*10/60)/10), vec(G.WIDTH/2-15, 4)); // timeout number

	color("black");
	text(b10Txt, vec(5, G.HEIGHT/4)); // question
	color("light_black");
	text(":", vec(15, G.HEIGHT/4));
	color("black");
	text(binaryTxt, vec(G.WIDTH/4, G.HEIGHT/4));
	text(binaryArrayToStr(answer), vec(G.WIDTH/4, G.HEIGHT/2 + 10)); // input so far

	color("red");
	line(vec(0, G.HEIGHT*3/4), vec(G.WIDTH, G.HEIGHT*3/4)); // separator line for cancel area
	text("Cancel", vec(G.WIDTH/2-16, G.HEIGHT*7/8)); // cancel text

	if(isPressing) { // indicator that youve held long enough
		if(input.pos.y > G.HEIGHT*3/4) {
			color("light_red");
			bar(input.pos.x, input.pos.y, 14, 3, Math.PI/4);
			bar(input.pos.x, input.pos.y, 14, 3, -Math.PI/4);
		} else {
			if (held > holdTime) {
				color("yellow");
				//box(vec(input.pos), 10);
				//arc(input.pos.x, input.pos.y, 6, 3);
				bar(input.pos.x, input.pos.y, 10, 3, Math.PI/2);
			} else {
				color("cyan");
				//box(vec(input.pos), 10);
				arc(input.pos.x, input.pos.y, 6, 3);
			}
		}
	}

	// Input Handling
	if (input.isJustPressed) {
		isPressing = true;
		held = 0;
	}
	held += 1;
	/*if (!isPressing && held > holdTime) {
		// third kind of input: pause between inputs (ie for breaks btwn morse letters)
		// note that you'll have to make a variable that makes sure it only registers the pause once
	}*/
	if (input.isJustReleased) {
		isPressing = false;
		if(input.pos.y > G.HEIGHT*3/4) { // cancel input
			console.log("canceled");
			play("coin");
			answer = [];
		} else {
			if (held > holdTime) { //held
				console.log("held");
				console.log(held);
				play("laser");
				answer.push(1);
			} else { //tapped
				play("select");
				console.log("tapped");
				console.log(held);
				answer.push(0);
			}
		}
		console.log(answer);
	}

	if (answer.length == 5) { // Check if answer correct
		let correct = true;
		// compare to correct answer
		for (let i = 0; i < answer.length; i++) {
			if (answer[i] != correctAnswer[i]) {
				correct = false;
			}
		}
		if (correct) {
			nextQ = true;
			console.log("YIPPEEE!");
			play("powerUp");
			score += timeout/100;
		} else {
			play("explosion");
			console.log("YUH OH!");
		}
		// empty answer
		answer = [];
	}
	if (timeout <= 0) { // Check if prompt timed out
		end();
		//nextQ = true;
		//answer = [];
	} else {
		timeout -= 1;
	}
}
