var farm = $('#farm'),
	animalCount = 50;

var farmNative = farm.get(0),
	clientRect = farmNative.getBoundingClientRect();

var minX = clientRect.x,
	maxX = clientRect.x + clientRect.width,
	minY = clientRect.y,
	maxY = clientRect.y + clientRect.height;

function getAnimals(callback) {
	$.getJSON('../scripts/animals.json').done(function(data) {
		return callback(data);
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
    var parent =$(element).parent().get(0);

    var parentRect = parent.getBoundingClientRect();
	var rect = el.getBoundingClientRect();

  
	return {
		x: rect.x - parentRect.x,
		y: rect.y - parentRect.y
	};
}

function runActions(animalEl, actions) {
	$('#btnAnimate').on('click', function() {
		if (actions.length > 0) {
			$.each(actions, function(ai, action) {
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

				animalEl.queue(function() {
					$(this)
						.delay(action.delay)
						.animate(
							{top: y + 'px', left: x + 'px'},
							{
								duration: action.duration,
								easing: 'easeOutSine'
							}
						)
						.dequeue();
				});
			});
		}
	});
}

function addAnimals(animals) {
	$.each(animals, function(i, animal) {
		var animalEl = $('<div>', {
			class: 'animal'
		})
			.prop('id', animal.id)
			.css({
				backgroundColor:
					animal.id === 1 ||
					animal.id === 2 ||
					animal.id === 3 ||
					animal.id === 96
						? '#000'
						: '',
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

$(document).ready(function() {
	var animals = [];
	getAnimals(function(response) {
		animals = response;
		if (animals.length === 0) return;
		addAnimals(animals);
	});
});

// function getRandomPosition(min, max) {
// 	min = Math.ceil(min);
// 	max = Math.floor(max);
// 	return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function addAnimal(id) {
// 	var animalEl = $('<div>', {
// 		class: 'animal'
// 	})
// 		.prop('id', id)
// 		.css({
// 			top: getRandomPosition(minY, maxY),
// 			left: getRandomPosition(minX, maxX)
// 		})
// 		.appendTo(farm);
// }

// function generateAnimals(callback) {
// 	for (var i = 1; i <= animalCount; i++) {
// 		addAnimal(i);
// 	}
// 	callback();
// }

// var motions = [
// 	{
// 		id: 1,
// 		actions: [
// 			{
// 				target: 'astronaut1',
// 				delay: 0,
// 				duration: 0
// 			},
// 			{
// 				x: 100,
// 				y: 30,
// 				delay: 1000,
// 				duration: 3000
// 			},
// 			{
// 				x: 200,
// 				y: 250,
// 				delay: 0,
// 				duration: 3000
// 			},
// 			{
// 				x: 10,
// 				y: 150,
// 				delay: 0,
// 				duration: 3000
// 			}
// 		]
// 	}
// ];

// function animate(el, actions) {
// 	/*  $.each(actions, function(i, action) {
//     if (action.target) {

//     } else {
//       el.delay(action.delay).stop().animate({
//         top: action.y+'px',
//         left: action.x+'px'
//       }, action.duration);

//     }

//   })
//   */
// 	el.delay(actions[1].delay)
//          .stop().dequeue()
// 		.animate(
// 			{top: actions[1].y + 'px', left: actions[1].x + 'px'},
// 			actions[1].duration
// 		)
// 		.animate(
// 			{top: actions[2].y + 'px', left: actions[2].x + 'px'},
// 			actions[2].duration
//         )
//         .animate(
// 			{top: actions[3].y + 'px', left: actions[3].x + 'px'},
// 			actions[3].duration
// 		);
// }

// generateAnimals(function() {
// 	$.each(motions, function(i, motion) {
// 		var motionEl = $('#' + motion.id);
// 		motionEl.css('background-color', '#000');
// 		animate(motionEl, motion.actions);
// 	});
// });
