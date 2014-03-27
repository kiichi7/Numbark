#pragma strict
var WordStyle : GUIStyle;
var NormalStyle : GUIStyle;
var theNote : AudioClip[];
private var theNumber : Array = new Array();
private var numberChooser : int = 0;

private var diameter : float;
private var isStarted : boolean = false;
private var timer : float;
private var isStarting : boolean = true;
private var isEnd : boolean = false;

private var BGColor : Color;
private var WordColor : Color;
private var offsetCoefficient : float = 0.2;
private var PNChooser : boolean = true;
private var colorChangeCoefficient : Color;

private var firstStage : boolean = true;
private var posX : float;
private var posY : float;

private var goingOn : boolean = false;
private var haveInput : boolean = false;

private var score : int = 0;
private var littleScore : int = 0;
private var theGap : float = 0;

function Start() {

	BGColor = Color(Random.Range(0.2,0.8),Random.Range(0.2,0.8),Random.Range(0.2,0.8),1);
	colorChangeCoefficient = Color(Random.Range(-0.1,0.1),Random.Range(-0.1,0.1),Random.Range(-0.1,0.1),0);
	
}

function Update() {

	colorChangeCoefficient += Time.deltaTime * Color(Random.Range(-0.1,0.1),Random.Range(-0.1,0.1),Random.Range(-0.1,0.1),0);
	colorChangeCoefficient = ColorLimit(colorChangeCoefficient, -0.1, 0.1);
	BGColor += Time.deltaTime * colorChangeCoefficient;
	BGColor = ColorLimit(BGColor, 0.2, 0.8);

	ColorChangeTurn();
	
	if (PNChooser) WordColor = BGColor + offsetCoefficient * Color.white;
	else WordColor = BGColor - offsetCoefficient * Color.white;

	camera.backgroundColor = BGColor;
	WordStyle.normal.textColor = WordColor;
	NormalStyle.normal.textColor = (WordColor + BGColor) / 2;

	if (isStarted) {		
		
		if (firstStage) {
		
			theGap = Mathf.Pow(0.95, numberChooser - 20);

			WordStyle.normal.textColor.a = theGap/2 - Mathf.Abs(timer - theGap/2);
			
			if (timer < theGap) {
			
				if (timer == 0) NumberOut();
				timer += Time.deltaTime;
				if ((!haveInput)&&(Input.inputString.Length > 0)) {
					if(Input.inputString[0] == theNumber[numberChooser-1].ToString()) {
						goingOn = true;
						littleScore ++;
					}	
					haveInput = true;
				}
			
			}
			else {
			
				timer = 0;
				if (goingOn == false) { 
					firstStage = false;
					timer = 0;
				}	
				else goingOn = false;
				haveInput = false;
				
			}
			
		}
		else if (isEnd) {
	
			timer += Time.deltaTime;
			if ((timer > 3)&&(Input.anyKey)) Application.LoadLevel("Numbark");
	
		}
		else {
		
			NumberIn();
			
		}
		
		
	
	}
	else PlayStart();
	
}

function OnGUI() {

	if (isEnd) {
		WordStyle.normal.textColor.a = 1;
		NormalStyle.normal.textColor.a = 1;
		GUI.Label(Rect(Screen.width/2-4.75*WordStyle.fontSize, Screen.height/2 - WordStyle.fontSize, 20*WordStyle.fontSize, 1.5*WordStyle.fontSize), "Your Final Score: " + score.ToString() + "." + littleScore.ToString(), WordStyle);
		if (timer > 3) GUI.Label(Rect(Screen.width/2-5*NormalStyle.fontSize, Screen.height/2 + WordStyle.fontSize, 20*NormalStyle.fontSize, 1.5*NormalStyle.fontSize), "Press Anykey to Replay", NormalStyle);
	    GUI.Label(Rect(NormalStyle.fontSize, Screen.height-2*NormalStyle.fontSize, 20*NormalStyle.fontSize, 1.5*NormalStyle.fontSize), "by pengbitao@inpla.net",NormalStyle);
	}
	else if (!firstStage) {
		WordStyle.normal.textColor.a = 1;
		NormalStyle.normal.textColor.a = 1;	
		GUI.Label(Rect(Screen.width/2-3.75*WordStyle.fontSize, Screen.height/2 - WordStyle.fontSize, 20*WordStyle.fontSize, 1.5*WordStyle.fontSize), "Your Score: " + score.ToString() + "." + littleScore.ToString(), WordStyle);
	    GUI.Label(Rect(NormalStyle.fontSize, Screen.height-2*NormalStyle.fontSize, 20*NormalStyle.fontSize, 1.5*NormalStyle.fontSize), "by pengbitao@inpla.net",NormalStyle);
	}
	else if ((isStarted)&&(numberChooser > 0)) {
		GUI.Label(Rect(posX, posY, WordStyle.fontSize, WordStyle.fontSize), theNumber[numberChooser-1].ToString(), WordStyle);
	}
	else if (!isStarted){
	    GUI.Label(Rect(Screen.width/2-2*WordStyle.fontSize, Screen.height/2 - WordStyle.fontSize, 20*WordStyle.fontSize, 1.5*WordStyle.fontSize), "Numbark",WordStyle);
	    GUI.Label(Rect(NormalStyle.fontSize, Screen.height-2*NormalStyle.fontSize, 20*NormalStyle.fontSize, 1.5*NormalStyle.fontSize), "by pengbitao@inpla.net",NormalStyle);
    }
}

function PlayStart() {

		diameter = Mathf.Min(Screen.width,Screen.height);
		WordStyle.fontSize = diameter/10;
		NormalStyle.fontSize = diameter/30;
		if (isStarting) {
			if (timer<2) timer += Time.deltaTime;
			else if (Input.anyKey) isStarting = false;
		}
		else {
			if (timer>0) timer -= Time.deltaTime;
			else { 
				isStarted = true; 
				timer = 0; 
			}
		}
		WordStyle.normal.textColor.a = timer/2;
		NormalStyle.normal.textColor.a = timer/2;
	
}

function ColorLimit(theColor : Color, minValue : float, maxValue : float) {

	theColor.r = Mathf.Clamp(theColor.r,minValue,maxValue);
	theColor.g = Mathf.Clamp(theColor.g,minValue,maxValue);
	theColor.b = Mathf.Clamp(theColor.b,minValue,maxValue);
	theColor.a = Mathf.Clamp(theColor.a,0.0,1.0);
	
	return theColor;
	
}

function ColorChangeTurn() {

	if ((BGColor.r == 0.2)&&(colorChangeCoefficient.r < 0)) colorChangeCoefficient.r = -colorChangeCoefficient.r;
	if ((BGColor.g == 0.2)&&(colorChangeCoefficient.g < 0)) colorChangeCoefficient.g = -colorChangeCoefficient.g;
	if ((BGColor.b == 0.2)&&(colorChangeCoefficient.b < 0)) colorChangeCoefficient.b = -colorChangeCoefficient.b;
	if ((BGColor.r == 0.8)&&(colorChangeCoefficient.r > 0)) colorChangeCoefficient.r = -colorChangeCoefficient.r;
	if ((BGColor.g == 0.8)&&(colorChangeCoefficient.g > 0)) colorChangeCoefficient.g = -colorChangeCoefficient.g;
	if ((BGColor.b == 0.8)&&(colorChangeCoefficient.b > 0)) colorChangeCoefficient.b = -colorChangeCoefficient.b;

}

function NumberOut() {

	posX = Random.Range(0.0 , Screen.width - 0.6 * WordStyle.fontSize);
	posY = Random.Range(0.0 , Screen.height - WordStyle.fontSize);
	theNumber.Push(Random.Range(0,10));
	audio.clip = theNote[theNumber[numberChooser]];
	audio.Play();
	numberChooser ++;

}

function NumberIn() {

	posX = Random.Range(0.0 , Screen.width - 0.6 * WordStyle.fontSize);
	posY = Random.Range(0.0 , Screen.height - WordStyle.fontSize);
	timer += Time.deltaTime;
	if (numberChooser > 0) {
		if (Input.inputString.Length > 0) {
			if (Input.inputString[0] == theNumber[theNumber.length - numberChooser].ToString()) {
				score ++;
				numberChooser --;
				timer = 0;
			}	
			else { 
					isEnd = true; 
					timer = 0; 
			}
		}
	}
	else { 
		isEnd = true; 
		timer = 0; 
	}
	if (timer > 5) { 
		isEnd = true; 
		timer = 0; 
	}

}