// import jquery from '../node_modules/jquery/dist/jquery';

var viewModel = {

	simulationStarted: ko.observable(false),

	activeAction: ko.observable("1"),

	animalFilterTypes: ko.observableArray([{
			value: 1,
			text: 'Normal',
			checked: ko.observable(true)
		},
		{
			value: 2,
			text: 'Sick',
			checked: ko.observable(true)
		},
		{
			value: 3,
			text: 'Heat',
			checked: ko.observable(true)
		}
	]),

	vectors: ko.observableArray([{
		id: 1,
		name: 'Vector',
		top: '15px',
		left: '1265px',
		width: '80px',
		height: '45px'
	}]),

	feedAreas: ko.observableArray([{
		id: 1,
		name: 'Voergang',
		top: '242px',
		left: '0px',
		width: '1250px',
		height: '106px'
	}]),

	locations: ko.observableArray([{
			id: 1,
			name: 'Melkveestal',
			top: '15px',
			left: '150px',
			width: '1100px',
			height: '225px',
			feedFences: ko.observableArray([{
				id: 'fence1',
				name: 'Melkkoeien',
				top: '203px',
				left: '135px',
				width: '480px',
				height: '20px'
			}]),
			cubicles: ko.observableArray([{
					id: '1',
					name: 'cubicle1',
					top: '5px',
					left: '200px',
					cubicSize: 20,
					door: 'down'
				},
				{
					id: '2',
					name: 'cubicle2',
					top: '80px',
					left: '200px',
					cubicSize: 10,
					door: 'up'
				},
				{
					id: '3',
					name: 'cubicle3',
					top: '119px',
					left: '200px',
					cubicSize: 10,
					door: 'down'
				},
				{
					id: '4',
					name: 'cubicle4',
					top: '80px',
					left: '410px',
					cubicSize: 10,
					door: 'up'
				},
				{
					id: '5',
					name: 'cubicle5',
					top: '119px',
					left: '410px',
					cubicSize: 10,
					door: 'down'
				},
				{
					id: '6',
					name: 'cubicle6',
					top: '80px',
					left: '620px',
					cubicSize: 10,
					door: 'up'
				},
				{
					id: '7',
					name: 'cubicle7',
					top: '119px',
					left: '620px',
					cubicSize: 10,
					door: 'down'
				},
				{
					id: '8',
					name: 'cubicle8',
					top: '80px',
					left: '830px',
					cubicSize: 10,
					door: 'up'
				},
				{
					id: '9',
					name: 'cubicle9',
					top: '119px',
					left: '830px',
					cubicSize: 10,
					door: 'down'
				},
				{
					id: '10',
					name: 'cubicle10',
					top: '5px',
					left: '690px',
					cubicSize: 21,
					door: 'down'
				}
			]),
			astronauts: ko.observableArray([{
				id: 'astronaut1',
				name: 'A1',
				top: '5px',
				left: '585px',
				width: '100px',
				height: '40px'
			}, {
				id: 'astronaut3',
				name: 'A3',
				top: '25px',
				left: '10px',
				width: '40px',
				height: '80px'
			}, {
				id: 'astronaut4',
				name: 'A4',
				top: '120px',
				left: '10px',
				width: '40px',
				height: '80px'
			}]),
			animals: ko.observableArray([])
		},
		{
			id: 2,
			name: 'verse koeien',
			top: '350px',
			left: '150px',
			width: '1100px',
			height: '165px',
			feedFences: ko.observableArray([{
					id: '1',
					name: 'Droog2',
					top: '0px',
					left: '145px',
					width: '130px',
					height: '20px'
				},
				{
					id: '2',
					name: 'Verse koeien',
					top: '0px',
					left: '700px',
					width: '385px',
					height: '20px'
				}
			]),
			cubicles: ko.observableArray([{
					id: 1,
					name: 'cubicle1',
					top: '120px',
					left: '87px',
					cubicSize: 26,
					door: 'up'
				},
				{
					id: 2,
					name: 'cubicle1',
					top: '-1px',
					left: '280px',
					cubicSize: 12,
					door: 'down'
				},
				{
					id: 3,
					name: 'cubicle1',
					top: '120px',
					left: '688px',
					cubicSize: 21,
					door: 'up'
				},
				{
					id: 4,
					name: 'cubicle1',
					top: '5px',
					left: '5px',
					cubicSize: 8,
					door: 'right'
				}
			]),
			astronauts: ko.observableArray([{
				id: 'astronaut2',
				name: 'A2',
				top: '120px',
				left: '585px',
				width: '100px',
				height: '40px'
			}]),
			animals: ko.observableArray([])
		},
		{
			id: 3,
			name: 'Droog1',
			top: '400px',
			left: '1270px',
			width: '75px',
			height: '115px',
			cubicles: ko.observableArray([]),
			astronauts: ko.observableArray([]),
			animals: ko.observableArray([])
		}
	]),

	selectAll: ko.observable(true),

	selectAllFilter: function (data, event) {
		const el = $(event.target),
			active = el.prop('checked');

		viewModel.selectAll(active);

		ko.utils.arrayForEach(viewModel.animalFilterTypes(), function (filter) {
			filter.checked(active)
		})
		return true;
	},

	selectFilter: function (data, event) {
		const el = $(event.target),
			active = el.prop('checked');

		if (!active) viewModel.selectAll(false);
		else {
			let checkedFilterLength = viewModel.animalFilterTypes().filter(aft => {
				return aft.checked()
			}).length;
			if (checkedFilterLength === viewModel.animalFilterTypes().length)
				viewModel.selectAll(true);
		}
		return true;
	},

	getEndX: function (data) {
		return `${parseFloat(data.width) - parseFloat(data.left)}px`;
	},

	getEndY: function (data) {
		return `${parseFloat(data.height)}px`;
	},

	animalClassByStatus: function (animal) {
		if (!animal.status) return;

		switch (animal.status) {
			case 2:
				return 'sick';
			case 3:
				return 'heat';
		}
	},

	locateAnimal: function (location) {
		var rnd = randomPosition(location),
			space = 15;

		rnd.x = parseInt(location.width) - rnd.x < space ? (rnd.x -= space) : rnd.x;
		rnd.y =
			parseInt(location.height) - rnd.y < space ? (rnd.y -= space) : rnd.y;

		return {
			transform: 'translate(' + rnd.x + 'px,' + rnd.y + 'px)'
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
		var style = window.getComputedStyle(el.get(0));
		var matrix = new WebKitCSSMatrix(style.webkitTransform);

		var elTranslateX = matrix.m41,
			elTranslateY = matrix.m42;

		var speed = 0.5,
			animalLocation = {
				x: el.x ? el.x : elTranslateX,
				y: el.y ? el.y : elTranslateY
			},
			sourceLongAxis = Math.max(animalLocation.x, animalLocation.y),
			targetLongAxis = Math.max(targetX, targetY),
			distance = Math.abs(sourceLongAxis - targetLongAxis),
			time = distance / (speed / 100);

		callback(time);
	},

	generateRandomActions: function (location, size) {
		var actions = [];
		for (var i = 1; i <= size; i++) {

			var rnd = randomPosition(location);
			actions.push({
				"target": 1,
				"element": null,
				"x": rnd.x,
				"y": rnd.y,
				"delay": 2000
			})
		}
		return actions;
	},

	cubicDirection: function (door) {
		if (door === 'down' || door === 'up') {
			return 'list-group-horizontal'
		}
	},

	doorDirection: function (door) {
		switch (door) {
			case 'down':
				return 'border-bottom-0';
			case 'up':
				return 'border-top-0';
			case 'right':
				return 'border-right-0';
			case 'left':
				return 'border-left-0';
			default:
				return '';
		}
	},

	runActions: function () {
		viewModel.locations().map(l =>
			l.animals().forEach(function (animal) {
				let animalEl = $(`div#${animal.id}`);

				if (typeof animal.actions === 'number') {
					animal.actions = viewModel.generateRandomActions(l, animal.actions);
				}

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
						animalEl.x = x;
						animalEl.y = y;
						var delay = action.delay;
						animalEl.queue(function () {
							$(this).delay(delay).transition({
								x: x,
								y: y
							}, duration, 'linear').dequeue();
						})
					})
				});
			})
		);
		viewModel.simulationStarted(true);
	}
};

function getAnimals(locationId, callback) {
	$.getJSON('../scripts/animals.json', {
		id: locationId
	}).done(function (data) {
		var grepData = $.grep(data, function (item) {
			item.status = typeof item.status === 'undefined' ? 1 : item.status
			return locationId === item.locId;
		})
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

function filteredDisplay(element, value) {
	if (typeof value() === 'undefined') return;

	var length = viewModel.animalFilterTypes().filter(aft => {
		return value() === aft.value && aft.checked() === true
	}).length;

	if (length === 0)
		$(element).addClass('invisible');
	else
		$(element).removeClass('invisible');
}

ko.bindingHandlers.filteredDisplay = {
	init: function (element, value) {
		filteredDisplay(element, value);
	},
	update: function (element, value) {
		filteredDisplay(element, value);
	},
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