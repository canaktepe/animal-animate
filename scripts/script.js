var viewModel = {
	locations: ko.observableArray([{
			id: 1,
			name: 'location-1',
			top: '15px',
			left: '15px',
			width: '1170px',
			height: '180px',
			astronauts: ko.observableArray([{
				id: 'astronaut1',
				name: 'A1',
				top: '25px',
				left: '15px',
				width: '150px',
				height: '50px'
			}]),
			animals: ko.observableArray([])
		},
		{
			id: 2,
			name: 'location-2',
			top: '300px',
			left: '15px',
			width: '1170px',
			height: '180px',
			astronauts: ko.observableArray([{
				id: 'astronaut2',
				name: 'A2',
				top: '105px',
				left: '1005px',
				width: '150px',
				height: '50px'
			}]),
			animals: ko.observableArray([])
		}
	]),

	getEndX: function (data) {
		return `${parseFloat(data.width) - parseFloat(data.left)}px`;
	},

	getEndY: function (data) {
		return `${parseFloat(data.height)}px`;
	},

	locateAnimal: function (location) {
		var rnd = randomPosition(location),
			space = 15;

		rnd.x = parseInt(location.width) - rnd.x < space ? (rnd.x -= space) : rnd.x;
		rnd.y =
			parseInt(location.height) - rnd.y < space ? (rnd.y -= space) : rnd.y;

		return {
			transform: 'translate(' + rnd.x + 'px,' + rnd.y + 'px)'
			// left: rnd.x,
			// top: rnd.y
		};
	},

	getLocatedObjectsLocation: function (location) {
		var arr = [];
		viewModel
			.locations()
			.filter(f => {
				return f == location;
			})
			.map(l => {
				l.astronauts().map(a => {
					arr.push({
						xStart: parseInt(a.left),
						xEnd: parseInt(a.left) + parseInt(a.width),
						yStart: parseInt(a.top) - 15,
						yEnd: parseInt(a.top) + parseInt(a.height) + 15
					});
				});
			});
		return arr;
	},

	calculateDuration: function (el, targetX, targetY, callback) {
		var speed = 5,
			animalLocation = getPositionAtCenter(el),
			sourceLongAxis = Math.max(animalLocation.x, animalLocation.y),
			targetLongAxis = Math.max(targetX, targetY),
			distance = Math.abs(sourceLongAxis - targetLongAxis),
			time = distance / (speed / 100);
		callback(time);
	},

	runActions: function () {
		viewModel.locations().map(l =>
			l.animals().forEach(function (animal) {
				let animalEl = $(`div#${animal.id}`);
				$.each(animal.actions, function (ai, action) {
					let x, y;
					switch (action.target) {
						case 1:
							x = action.x;
							y = action.y;
							break;
						case 2:
							let targetPosition = getPositionAtCenter(action.element);
							x = targetPosition.x;
							y = targetPosition.y;
							break;
					}

					viewModel.calculateDuration(animalEl, x, y, function (duration) {
						var delay = action.delay;
						animalEl.stop().delay(delay).transition({
							x: x,
							y: y
						}, duration, 'linear');
					})
				});
			})
		);
	}
};

function getAnimals(locationId, callback) {
	$.getJSON('../scripts/animals.json', {
		id: locationId
	}).done(function (data) {
		var grepData = $.grep(data, function (item) {
			return locationId === 1 ? item.id > 0 && item.id <= 50 : item.id > 50;
		});
		return callback(grepData);
	});
}

function getPositionAtCenter(element) {
	var el = $(element).get(0);

	var parent = $(element)
		.parent()
		.get(0);

	var parentRect = parent.getBoundingClientRect();
	var rect = el.getBoundingClientRect();
	return {
		x: rect.x - parentRect.x + rect.width / 2,
		y: rect.y - parentRect.y + rect.height / 2
	};
}

function getMatchedPosition(rnd, location) {
	var located = viewModel.getLocatedObjectsLocation(location);
	return (
		ko.utils.arrayFilter(located, function (locatedEl) {
			return (
				rnd.x >= locatedEl.xStart &&
				rnd.x <= locatedEl.xEnd &&
				(rnd.y >= locatedEl.yStart && rnd.y <= locatedEl.yEnd)
			);
		}).length > 0
	);
}

function randomPosition(location) {
	var min = 0,
		xMax = parseInt(viewModel.getEndX(location)),
		yMax = parseInt(viewModel.getEndY(location));

	var rnd = {
		x: Math.floor(Math.random() * (xMax - min + 1)) + min,
		y: Math.floor(Math.random() * (yMax - min + 1)) + min
	};

	var matched = getMatchedPosition(rnd, location);
	if (matched) rnd = randomPosition(location);

	return rnd;
}

ko.bindingHandlers.draggable = {
	init: function (element, valueAccessor, allBindingsAccessor, vieModel, bindingContext) {
		$(element).draggable();
	}
};

ko.bindingHandlers.droppable = {
	init: function (element) {
		$(element).droppable({
			drop: function (event, ui) {
				$(this)
					.addClass("milking")
			},
			out: function (event, ui) {
				$(this)
					.removeClass("milking")
			}
		});
	}
}

$(document).ready(function () {
	ko.utils.arrayForEach(viewModel.locations(), function (location) {
		getAnimals(location.id, function (response) {
			if (response.length === 0) return;
			location.animals(ko.toJS(response));
		});
	});
	ko.applyBindings(viewModel);
});