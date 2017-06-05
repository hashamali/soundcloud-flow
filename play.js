var display;
var id;

function updatePlaybackRateDisplay() {
  if (display) display.innerHTML = getPlaybackRate(id);
}

function getPlaybackRates() {
  var rates = localStorage.getItem('playbackRates') || '';
  return rates ? JSON.parse(rates) : { };
}

function getPlaybackRate(id) {
  var rates = getPlaybackRates();
	return rates[id] || 1;
}

function setPlaybackRate(id, rate) {
  if (id) {
    var rates = getPlaybackRates();
    rates[id] = rate;
	  localStorage.setItem('playbackRates', JSON.stringify(rates));
  }
}

var proxyPlay = function(play) {
	return function() {
    id = this.id;
		this.playbackRate = getPlaybackRate(id);
    updatePlaybackRateDisplay();
		return play.apply(this, arguments);
	};
};

Audio.prototype.play = proxyPlay( Audio.prototype.play );
document.createElement = ( function(create) {
	return function() {
		var element = create.apply(this, arguments);
		if (element.tagName.toLowerCase() === "audio") {
			element.play = proxyPlay(Audio.prototype.play);
		}

		return element;
	};
} )( document.createElement );

function createSlider(control) {
  slider = document.createElement('input');
  slider.setAttribute('style', 'margin-right: 10px;');
  slider.setAttribute('class', 'playControls_elements');
  slider.setAttribute('type', 'range');
  slider.setAttribute('min', '0.5');
  slider.setAttribute('max', '1.5');
  slider.setAttribute('step', '0.05');
  slider.value = getPlaybackRate(id);
  slider.onchange = function(event) {
    setPlaybackRate(id, event.target.value);
    updatePlaybackRateDisplay();
  }

  control.insertBefore(slider, control.childNodes[0]);
}

function createDisplay() {
  display = document.createElement('span');
  display.setAttribute('class', 'playControls_elements sc-font-light sc-link-dark');
  display.setAttribute('style', 'display: flex; flex-direction: column; justify-content: center; margin-right: 10px; width: 2em;');
  updatePlaybackRateDisplay();

  control.insertBefore(display, control.childNodes[0]);
}

var controls = document.getElementsByClassName('playControls__elements');
if (controls && controls.length > 0) {
  var control = controls[0];
  createSlider(control);
  createDisplay(control);
}
