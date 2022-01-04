// MIT License
// Copyright (c) 2021 Luis Espino

// [ [nodoHijo , heuristica, idNodo],  [nodoHijo , heuristica, idNodo] ] ...

const MOVEMENTS = {
	UP: 0,
	DOWN: 1,
	LEFT: 2,
	RIGTH: 3
}

function heuristic(start, end, h) {
	if (h == 1) { // tiles out is sometimes encycled
		var tiles_out = 0
		for (var i = 0; i < start.length; i++) {
			if (start[i] != end[i]) tiles_out++
		}
		return tiles_out
	} else if (h == 2) { // Manhattan
		var man = 0
		for (var i = 0; i < start.length; i++) {
			man += Math.abs(i - end.indexOf(start.substring(i, i + 1)))
		}
		return man
	}
}

const moveMatrixStr = (currentMatrizStr, movement, zeroIndex, numberIndex) => {
	console.log(movement);
	const charMatrizArr = currentMatrizStr.split("");
	const charNumber = charMatrizArr[numberIndex];
	charMatrizArr[zeroIndex] = charNumber;
	charMatrizArr[numberIndex] = "0";
	return charMatrizArr.join("");
}

// n = nodoActual, matriz actual
// e = matriz final a la que se quiere llegar
// h = la heuristica que escogio
function successors(n, e, h) {
	let suc = [];
	const currentMatrixString = n[0];
	const indexZero = currentMatrixString.indexOf("0");
	let childArr = [];

	switch (indexZero) {
		// 0xx xxx xxx
		case 0:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.RIGTH, indexZero, 1));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.UP, indexZero, 3));
			break;

		// x0x xxx xxx	
		case 1:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.LEFT, indexZero, 0));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.DOWN, indexZero, 4));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.RIGTH, indexZero, 2));
			break;

		// xx0 xxx xxx	
		case 2:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.LEFT, indexZero, 1));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.DOWN, indexZero, 5));
			break;

		// xxx 0xx xxx	
		case 3:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.UP, indexZero, 0));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.DOWN, indexZero, 6));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.RIGTH, indexZero, 4));
			break;

		// xxx x0x xxx	
		case 4:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.UP, indexZero, 1));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.LEFT, indexZero, 3));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.DOWN, indexZero, 7));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.RIGTH, indexZero, 5));
			break;

		// xxx xx0 xxx	
		case 5:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.UP, indexZero, 2));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.LEFT, indexZero, 4));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.DOWN, indexZero, 8));
			break;

		// xxx xxx 0xx	
		case 6:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.UP, indexZero, 3));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.RIGTH, indexZero, 7));
			break;

		// xxx xxx x0x	
		case 7:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.UP, indexZero, 4));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.LEFT, indexZero, 6));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.RIGTH, indexZero, 8));
			break;

		// xxx xxx xx0	
		case 8:
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.UP, indexZero, 5));
			childArr.push(moveMatrixStr(currentMatrixString, MOVEMENTS.LEFT, indexZero, 7));
			break;
	}

	childArr.forEach(child => {
		suc.push([child, heuristic(child, e, h), inc()])
		//		  nodoQueEsHijo , heuristica, idNodo
	});	

	suc = suc.sort((firstCompare, secondCompare) => firstCompare[1] - secondCompare[1]);
	suc = suc.slice(0, 2);
	return suc
}

// start = matriz inicial de entrada
// end = matriz final a la que se quiere llegar
// h = heuristica elegida, 1. Casillas fuera de lugar 2. Manhatthan
function bestfirst(start, end, h) {
	var cont = 0
	var dot = '{'
	var list = [[start, heuristic(start, end, h), inc()]];
	let fila1 = list[0][0].slice(0, 3);
	let fila2 = list[0][0].slice(3, 6);
	let fila3 = list[0][0].slice(6, 9);

	// root node
	dot += list[0][2] + ' [label="' + fila1 + '\n' + fila2 + '\n' + fila3 + '"];'

	// childs nodes
	while (list.length > 0) {
		var current = list.shift();
		if (current[0] == end) {
			dot += '}'
			return dot
		}
		var temp = successors(current, end, h);
		//temp.reverse();
		temp.forEach(val => {
			let fila1 = val[0].slice(0, 3);
			let fila2 = val[0].slice(3, 6);
			let fila3 = val[0].slice(6, 9);
			dot += val[2] + ' [label="' + fila1 + '\n' + fila2 + '\n' + fila3 + '"];' + current[2] + '--' + val[2] + ' [label="' + val[1] + '"] ;'
		}
		)
		list = list.concat(temp);
		list = list.sort(function (a, b) { return a[1] - b[1] });
		cont++
		if (cont > 100) {
			alert("The search is looped!")
			dot += '}'
			return dot
		}
	}
	dot += '}'
	return dot
}

// incrementa un id para llevar el identificador de los nodos
var id = 1
function inc() {
	return id++
}

function puzzle() {
	let initialState = prompt("Ingrese estado inicial del 8 puzzle test: 120463758");
	let heuristicUse = prompt("Seleccione el # de heuristica \n 1. Casillas fuera de lugar \n 2. Manhatthan");
	const finalState = "123456780";
	if (!initialState || !heuristicUse) {
		initialState = "123456780";
		heuristicUse = "2";
		alert(`Ha ingresado un dato invalido, se utilizara un estado inicial ${initialState} y una heuristica ${heuristicUse}`)
	}
	return bestfirst(initialState, finalState, heuristicUse);
}