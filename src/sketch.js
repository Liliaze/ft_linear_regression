let table;
let img;
let circlesArray;
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
let inputState = false;
let bg = null;
//let heartY = 0;

function setup() {
  //add input load file
  createCanvas(innerWidth, innerHeight);
  bg = loadImage('assets/car_background.jpg');
  input = createFileInput(handleFile);
  input.position(innerWidth / 2 - 100, 95);
  let inp = createInput('Mileage');
  inp.input(myInputEvent);
  inp.position(innerWidth / 2 - 160, 130);
  let priceButton = createButton('predict a price');
  priceButton.position(innerWidth / 2 + 20, 130);
  priceButton.mousePressed(predictAPrice);
  let trainingButton = createButton('Training Program');
  trainingButton.position(innerWidth / 2 -80, 160);
  trainingButton.mousePressed(trainingProgram);
  let resetButton = createButton('Reset Data');
  resetButton.position(innerWidth - 100, 50);
  resetButton.mousePressed(resetData);
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
  prediction = null;
}

function loadTableOn() {
  circlesArray = [];
  maxPrice = 0;
  maxKm = 0;
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
    if (parseInt(table.getString(r, 'km')) > maxKm)
      maxKm = parseInt(table.getString(r, 'km')) *1.1;
    if (parseInt(table.getString(r, 'price'))> maxPrice)
      maxPrice = parseInt(table.getString(r, 'price')) *1.1;
    circlesArray.push([table.getString(r, 'km'), table.getString(r, 'price')])
  }
}

function draw() {

  //clean
  clear();
  background(bg);
  textSize(30);
  stroke('black');
  fill('blue');
  //display interface
  text('FT_LINEAR_REGRESSION', innerWidth / 2 - 8*28, 30);
  text('BY DBOUDY', innerWidth / 2 - 4*28, 70);
  fill('black');
  line(graphOriginX, graphOriginY, maxX, graphOriginY);
  line(graphOriginX,graphOriginY, graphOriginX, maxY);
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
    fill('red');
    stroke('red');
    for (let circleIndex in circlesArray) {
      let posX = (ecartX * circlesArray[circleIndex][0])/maxKm + graphOriginX;
      let posY = graphOriginY - (ecartY * circlesArray[circleIndex][1]/maxPrice)
      circle(posX, posY, 5);
      textSize(11);
      text("(" + circlesArray[circleIndex][1] + "," + circlesArray[circleIndex][0] + ")", posX + 5, posY);
    }
    fill('green');
    stroke('green');
    //to do define theta0 et theta1
    line(linearLineX1, linearLineY1, linearLineX2, linearLineY2);
  }    
  else {
    textSize(20);
    fill('orange');
    stroke('orange');
    text('Please load a csv file with km and price data', innerWidth / 2 - 230, innerHeight/2.5);
  }
  //display prediction
  if (prediction != null && !inputState) {
    textSize(17);
    fill('brown');
    stroke('brown');
    text("Estimate price is => '" + prediction + "' <3 !", innerWidth / 2 + 120, 138);
  }
  else if (inputState) {
    textSize(17);
    fill('red');
    stroke('red');
    text("Please enter a valid mileage", innerWidth / 2 + 120, 138);
  }/*
  heartY++;
  if (heartY > innerHeight) {
    heartY = 0;
  }*/
}

function predictAPrice() {
  console.log("PREDICT !!!!");
  if(!inputState)
    prediction = 0;
  else
    prediction = null;
}

function trainingProgram() {
  console.log("training !!!!");
  linearLineX1 = 190;
  linearLineY1 = 200;
  linearLineX2 = 2000;
  linearLineY2 = 1200;
}

function resetData() {
  console.log("RESET !!!!");
  theta0 = 0;
  theta1 = 0;
  file = null;
  img = null;
  table = null;
  prediction = null;
  linearLineX1 = 0;
  linearLineY1 = 0;
  linearLineX2 = 0;
  linearLineY2 = 0;
}

function costFunction()
{
  let sum = 0;
  for (let data in trainingSet) {
    let x =  trainingSet[data][0];
    let y = trainingSet[data][1];
      let res = theta1 + (theta2 * x) - y;
      sum += res * res;
    }
  return Math.round((sum / (trainingSet.length * 2)) * 1000) / 1000;
}