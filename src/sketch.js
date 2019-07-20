let table;

function preload() {
  table = loadTable('data/data.csv', 'csv', 'header');
}

function setup() {
print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  input = createFileInput(handleFile);
  input.position(0, 0);
  print(table.getColumn('namekm,price'));
  //["Goat", "Leopard", "Zebra"]

  //cycle through the table
  for (let r = 0; r < table.getRowCount(); r++)
    for (let c = 0; c < table.getColumnCount(); c++) {
      print(table.getString(r, c));
    }
}

function draw() {
  ellipse(50, 50, 80, 80);
  background(255);
  if (img) {
    image(img, 0, 0, width, height);
  } 
}