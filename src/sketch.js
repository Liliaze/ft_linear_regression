let table = null;
let img;
let datasArray;
const maxX = innerWidth - 300;
const maxY = 220;
const graphOriginX = 250;
const graphOriginY = innerHeight - 100;
const ecartY = graphOriginY - maxY;
const ecartX = maxX - graphOriginX;
let linearLineX1 = 0;
let linearLineY1 = 0;
let linearLineX2 = 0;
let linearLineY2 = 0;
let maxKm = 0;
let maxPrice = 0;
let theta0 = 0;
let theta1 = 0;
let prediction = null;
let estimateCost = null;
let inputState = false;
let inputMileage = null;
let bg = null;
let inp = null;
//let heartY = 0;

function setup() {
  //add input load file
  createCanvas(innerWidth, innerHeight);
  bg = loadImage('assets/car_background.jpg');
  input = createFileInput(handleFile);
  input.position(innerWidth / 2 - 100, 95);
  inp = createInput('Mileage');
  inp.input(myInputEvent);
  inp.position(innerWidth / 2 - 160, 130);
  let priceButton = createButton('predict a price');
  priceButton.position(innerWidth / 2 + 20, 130);
  priceButton.mousePressed(predictAPrice);
  let trainingButton = createButton('Training Program');
  trainingButton.position(innerWidth / 2 -80, 160);
  trainingButton.mousePressed(trainingProgram);
  let resetButton = createButton('Reset Data');
  resetButton.position(innerWidth - 150, 40);
  resetButton.mousePressed(resetData);
  let resetTrain = createButton('ResetTraining');
  resetTrain.position(innerWidth - 150, 70);
  resetTrain.mousePressed(resetTraining);
  let checkMyCostFunction = createButton('Check algoritm');
  checkMyCostFunction.position(innerWidth / 2 -80, 190);
  checkMyCostFunction.mousePressed(costFunction);
}

function handleFile(file) {
  img = null;
  table = null;
  print(file);  
  if (file.type === 'image') {
    img = createImg(file.data);
    img.hide();
  } else if (file.type === 'application' && file.subtype === 'vnd.ms-excel') {
    table = loadTable(file.data, loadTableOn, 'csv', 'header');
  }
}

function myInputEvent() {
  inputState = isNaN(this.value()) || parseInt(this.value()) < 0 || trim(this.value()) == "";
  inputMileage = parseInt(this.value());
  prediction = null;
}

function loadTableOn() {
  resetSubData();
  if (!table)
    return;
  else if (table.getRowCount == 0 || !table.getColumn('km')[0] || !table.getColumn('price')[0])
    return;

  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print(table.getColumn('km'));
  print(table.getColumn('price'));

  //cycle through the table
  for (let r = 0; r < table.getRowCount(); r++){
    const price = parseInt(table.getString(r, 'price'));
    const km = parseInt(table.getString(r, 'km'));
    if (isNaN(price) || isNaN(km) || price < 0 || km < 0) {
      resetData();
      console.log("ERROR : Bad data ("+ km + "," + price + ") in this file, choose another")
      return;
    }
    if (km > maxKm)
      maxKm = parseInt(table.getString(r, 'km')) *1.1;
    if (price > maxPrice)
      maxPrice = parseInt(table.getString(r, 'price')) *1.1;
    datasArray.push([km, price]);
  }
}

function draw() {

  textSize(30);
  //clean
  clear();
  //protect windows size
  if (innerWidth < 900 || innerHeight < 600) {
    fill('red');
    stroke('red');
    text('Please enlarge and reload this window', 5,40);
    return;
  }
  //draw background
  background(bg);
  stroke('black');
  fill('black');

  //display interface
  text('FT_LINEAR_REGRESSION', innerWidth / 2 - 8*28, 30);
  text('BY DBOUDY', innerWidth / 2 - 4*28, 70);
    textSize(20);
  text('THETA 0 : ' + theta0, 40, 50);
  text('THETA 1 : ' + theta1, 40, 90);

  //dislay file img
  if (img) {
    image(img, graphOriginX, maxY, ecartX , ecartY);
  }

  //dislay linear graph
  else if (table) {
    textSize(15);
    text('0', graphOriginX -16, graphOriginY + 16);
    text('price\n' + maxPrice, graphOriginX - 40, maxY);
    text('km\n' + maxKm, maxX + 10, graphOriginY);
    fill('white');
    stroke('white');
    rect(graphOriginX, maxY,ecartX, ecartY);
    stroke('black');
    fill('black');
    line(graphOriginX, graphOriginY, maxX, graphOriginY);
    line(graphOriginX,graphOriginY, graphOriginX, maxY);
    fill('red');
    stroke('red');
    for (let circleIndex in datasArray) {
      let posX = (ecartX * datasArray[circleIndex][0])/maxKm + graphOriginX;
      let posY = graphOriginY - (ecartY * datasArray[circleIndex][1]/maxPrice)
      circle(posX, posY, 5);
      textSize(11);
      text("(" + datasArray[circleIndex][1] + "," + datasArray[circleIndex][0] + ")", posX + 5, posY);
    }
    fill('green');
    stroke('green');
    //to do define theta0 et theta1
    line(linearLineX1, linearLineY1, linearLineX2, linearLineY2);
  } 
  //message error if no data
  else {
    textSize(24);
    fill('red');
    stroke('red');
    text('-- Please load a csv file with valid km and price data --', innerWidth / 2 - 280, innerHeight/2.5);
  }
  //display prediction
  if (prediction != null && !inputState) {
    textSize(17);
    fill('brown');
    stroke('brown');
    text("Estimate price is => '" + prediction + "' <3 !", innerWidth / 2 + 120, 138);
  }
  //display error message on mileage
  else if (inputState) {
    textSize(17);
    fill('red');
    stroke('red');
    text("Please enter a valid mileage", innerWidth / 2 + 120, 138);
  }
  //display result of estimation cost
  if (estimateCost != null) {
    textSize(17);
    fill('brown');
    stroke('brown');
    text("Precision of this algorithm is => '" + estimateCost + "' <3 !", innerWidth / 2 + 30, 197);
  }/*
  heartY++;
  if (heartY > innerHeight) {
    heartY = 0;
  }*/
}

function predictAPrice() {
  console.log("PREDICT !!!! " + inputMileage);
  if(!inputState && inputMileage)
    prediction = theta0 + (theta1 * parseInt(inputMileage));
  else
    prediction = null;
}

function trainingProgram() {
  if (datasArray) {
    resetTraining();
    console.log("training !!!!");
    theta0 = floor(random(100));
    theta1 = floor(random(100));
    linearLineX1 = 190;
    linearLineY1 = 200;
    linearLineX2 = 2000;
    linearLineY2 = 1200;
  }
  else
    console.log("no data array");
}

function resetData() {
  console.log("RESET !!!!");
  file = null;
  img = null;
  table = null;
  inp.value('Enter a mileage');
  input.value('');
  resetSubData();
}

function resetSubData() {
  datasArray = [];
  maxPrice = 0;
  maxKm = 0;
  prediction = null;
  inputMileage = null;
  inputState = false;
  inp.value('Enter a mileage');
  input.value('');
  linearLineX1 = 0;
  linearLineY1 = 0;
  linearLineX2 = 0;
  linearLineY2 = 0;
  estimateCost = null;
}
function resetTraining() {
  console.log("RESET THETA !!!!");
  theta0 = 0;
  theta1 = 0;
}

function costFunction()
{
  if (datasArray) {
    let sum = 0;
    for (let data in datasArray) {
      let x =  datasArray[data][0];
      let y = datasArray[data][1];
        let res = theta0 + (theta1 * x) - y;
        sum += res * res;
      }
    estimateCost = Math.round((sum / (table.getRowCount() * 2)) * 1000) / 1000;
  }
  else
    console.log('No load data');
}