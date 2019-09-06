var farm = $('#farm'),
	animalCount = 50;

var farmNative = farm.get(0),
	clientRect = farmNative.getBoundingClientRect();

var minX = clientRect.x,
	maxX = clientRect.x + clientRect.width,
	minY = clientRect.y,
	maxY = clientRect.y + clientRect.height;

function getAnimals(locationId, callback) {
	$.getJSON('../scripts/animals.json', {
		id: locationId
	}).done(function (data) {
		var grepData = $.grep(data, function (item) {
			return locationId === 1 ? item.id > 0 && item.id <= 50 : item.id > 50;
		})
		return callback(grepData);
	});
}

// function getTargetPosition(element) {
// 	var clientRect = $(element)
// 		.get(0)
// 		.getBoundingClientRect();

// 	console.log(element);
// 	console.log(clientRect);
// 	return {
// 		x: clientRect.left,
// 		y: clientRect.top
// 	};
// }

function getPositionAtCenter(element) {
	var el = $(element).get(0);
	var parent = $(element).parent().get(0);

	var parentRect = parent.getBoundingClientRect();
	var rect = el.getBoundingClientRect();


	return {
		x: rect.x - parentRect.x,
		y: rect.y - parentRect.y
	};
}

function runActions(animalEl, actions) {
	$('#btnAnimate').on('click', function () {
		if (actions.length > 0) {
			$.each(actions, function (ai, action) {
				var x, y;

				switch (action.target) {
					case 1:
						x = action.x;
						y = action.y;
						break;
					case 2:
						var targetPosition = getPositionAtCenter(action.element);
						x = targetPosition.x;
						y = targetPosition.y;
						break;
				}

				animalEl.queue(function () {
					$(this)
						.delay(action.delay)
						.animate({
							top: y + 'px',
							left: x + 'px'
						}, {
							duration: action.duration,
							easing: 'easeOutSine'
						})
						.dequeue();
				});
			});
		}
	});
}

function addAnimals(animals) {
	$.each(animals, function (i, animal) {
		var animalEl = $('<div>', {
				class: 'animal'
			})
			.prop('id', animal.id)
			.css({
				backgroundColor: animal.id === 1 ||
					animal.id === 2 ||
					animal.id === 3 ||
					animal.id === 96 ?
					'#000' : '',
				top: animal.y,
				left: animal.x
			});
		if (i >= 0 && i < 50) {
			$('#location1').append(animalEl);
		} else if (i >= 50 && i <= 100) {
			$('#location2').append(animalEl);
		}
		runActions(animalEl, animal.actions);
	});
}


var viewModel = {
	locations: ko.observableArray([{
		id: 1,
		name: 'location-1',
		top: '15px',
		left: '15px',
		width: '1170px',
		height: '180px',
		astronauts: ko.observableArray([{
			name: 'A1',
			top: '25px',
			left: '15px',
			width: '150px',
			height: '50px',
		}]),
		animals: ko.observableArray([])
	}, {
		id: 2,
		name: 'location-2',
		top: '300px',
		left: '15px',
		width: '1170px',
		height: '180px',
		astronauts: ko.observableArray([{
			name: 'A2',
			top: '105px',
			left: '1005px',
			width: '150px',
			height: '50px'
		}]),
		animals: ko.observableArray([]),
	}]),

	getEndX: function (data) {
		return `${parseFloat(data.width) - parseFloat(data.left)}px`;
	},

	getEndY: function (data) {
		return `${parseFloat(data.height)}px`;
	},

	locateAnimal: function (animal, location) {
		var rnd = randomPosition(location),
			space = 15;

		rnd.x = (parseInt(location.width) - rnd.x) < space ? rnd.x -= space : rnd.x;
		rnd.y = (parseInt(location.height) - rnd.y) < space ? rnd.y -= space : rnd.y;
		return {
			left: rnd.x,
			top: rnd.y
		};
	},

	getLocatedObjectsLocation: function (location) {
		var arr = []
		viewModel.locations().filter(f => {
			return f == location
		}).map(l => {
			l.astronauts().map(a => {
				arr.push({
					xStart: parseInt(a.left),
					xEnd: parseInt(a.left) + parseInt(a.width),
					yStart: parseInt(a.top)-15,
					yEnd: parseInt(a.top)  + parseInt(a.height) +15
				})
			});
		})
		return arr;
	},
};

function getMatchedPosition(rnd, location) {
	var located = viewModel.getLocatedObjectsLocation(location);
	
	return ko.utils.arrayFilter(located, function (locatedEl) {
		console.log((rnd.x >= locatedEl.xStart && rnd.x <= locatedEl.xEnd) + ' --- '+ (rnd.y >= locatedEl.yStart && rnd.y <= locatedEl.yEnd))
		return (rnd.x >= locatedEl.xStart && rnd.x <= locatedEl.xEnd) && (rnd.y >= locatedEl.yStart && rnd.y <= locatedEl.yEnd)
		return false;
	}).length > 0
}


function randomPosition(location) {
	var min = 0,
		xMax = parseInt(viewModel.getEndX(location)),
		yMax = parseInt(viewModel.getEndY(location));

	var rnd = {
		x: Math.floor(Math.random() * (xMax - min + 1)) + min,
		y: Math.floor(Math.random() * (yMax - min + 1)) + min
	}

	var matched = getMatchedPosition(rnd, location);
	if (matched)
		rnd = randomPosition(location);

	return rnd;
}

$(document).ready(function () {
	ko.utils.arrayForEach(viewModel.locations(), function (location) {
		getAnimals(location.id, function (response) {
			if (response.length === 0) return;
			location.animals(ko.toJS(response));
		});
	})
	ko.applyBindings(viewModel);
});