function initialize() {
	document.getElementById('open-add-product-dialog-data').style.display =
		'none';
	// document.getElementById('add-pid').style.display = 'none';
	displayProductSection();
}

function test() {
	window.alert('Chal Raha hai...');
}

function switchActive(doc1, doc2) {
	var attribute = doc1.getAttribute('class');
	attribute = attribute.split(' ');
	new_attribute = '';
	for (x in attribute)
		if (attribute[x] != 'active') new_attribute += attribute[x] + ' ';
	doc1.setAttribute('class', new_attribute);

	var attribute = doc2.getAttribute('class');
	attribute = attribute.split(' ');
	new_attribute = '';
	for (x in attribute)
		if (attribute[x] != 'active') new_attribute += attribute[x] + ' ';
	new_attribute += ' active';
	doc2.setAttribute('class', new_attribute);
}

function displayProductSection() {
	switchActive(
		document.getElementById('details-section-switch'),
		document.getElementById('product-section-switch')
	);
	document.getElementById('product-section').style.display = 'block';
	document.getElementById('details-section').style.display = 'none';
	fetchProducts();
}

function displayDetailsSection() {
	switchActive(
		document.getElementById('product-section-switch'),
		document.getElementById('details-section-switch')
	);

	document.getElementById('product-section').style.display = 'none';
	document.getElementById('details-section').style.display = 'block';

	document.getElementById('save-success').style.display = 'none';
	getDetails();
}

function openAddProductDialog() {
	var title = document.getElementById('open-add-product-dialog-title')
		.innerHTML;
	var body = document.getElementById('open-add-product-dialog-body').innerHTML;
	var footer = document.getElementById('open-add-product-dialog-footer')
		.innerHTML;

	document.getElementById('modal-title').innerHTML = title;
	document.getElementById('modal-body').innerHTML = body;
	document.getElementById('modal-footer').innerHTML = footer;
}

function addNewImageInput(value = 'Paste the GDrive Image URL here...') {
	var div = document.getElementById('imageURLs');
	var text = '';
	text += '<div class="row modal-row" id="imageURLDiv">';
	text += '  <div class="col">';
	text +=
		'		<input type="text" class="form-control imageURL" id="imageURL" onchange="updateInput(this,this.value)" value="' +
		value +
		'" />\n';
	text += '	</div>\n';
	text += '<div class="col-auto center">';
	text +=
		'	<button type="button" class="close" onclick="removeThisInput(this.parentNode.parentNode)">';
	text += '		&times;';
	text += '	</button>\n';
	text += '</div>';
	text += '</div>\n';
	div.innerHTML += text;
}

function updateInput(doc, value) {
	doc.setAttribute('value', value);
}

function removeThisInput(doc) {
	doc.remove();
}

async function addProduct() {
	if (document.getElementById('add-pid').value == '-1') {
		var pid = await makeAsyncGetRequest('/get-new-pid/');
		pid = pid.result;
		document.getElementById('add-pid').value = pid;
	}

	pid = document.getElementById('add-pid').value;
	queryObj = productQueryObject();
	query = await makeAsyncPostRequest('add-product/', queryObj);
	response = query.result;
	console.log(response);

	document.getElementById('modal-body').innerHTML =
		'<span class="highlight2">Product ' +
		pid +
		' Added Successfully...!</span>';
	document.getElementById('modal-footer').innerHTML = '';

	await fetchProducts();
}

function productQueryObject() {
	var pid = document.getElementById('add-pid').value;
	var name = document.getElementById('add-name').value;
	var specifications = document.getElementById('add-specifications').value;
	var images = document.getElementsByClassName('imageURL');
	imageURLs = [];
	for (var i = 0; i < images.length; i++)
		if (images[i].value != 'Paste the GDrive Image URL here...')
			imageURLs.push(images[i].value);

	var price = document.getElementById('add-price').value;
	if (document.getElementById('available').checked)
		var availability = 'Available';
	if (document.getElementById('not-available').checked)
		var availability = 'Not Available';

	queryObj = {
		PID: pid,
		Name: name,
		Specifications: specifications,
		Images: imageURLs,
		Price: price,
		Availability: availability,
	};
	// console.log(queryObj);
	// return;
	return queryObj;
}

async function fetchProducts() {
	response = await makeAsyncGetRequest('/get-all-products/');
	data = response.result;
	productSection = document.getElementById('product-section-div');
	text = '';
	addButtonText = '<div class="row Varela white-box center">';
	addButtonText +=
		'	<button type="button" class="btn" id="addProductBtn" data-toggle="modal" data-target="#main-modal" onclick="openAddProductDialog()">Add New Product</button>';
	addButtonText += '</div>';
	text += addButtonText;

	headingText = '<div class="row Varela white-box">';
	headingText += '<div class="col-sm-1 Pid table-elem">Product Id</div>';
	headingText += '<div class="col-sm-2 Name table-elem">Name</div>';
	headingText += '<div class="col-sm-2 Images table-elem">Images</div>';
	headingText += '<div class="col-sm-3 Specifications base2 table-elem">';
	headingText += 'Specifications	</div>';
	headingText +=
		'<div class="col-sm-1 Availability table-elem">Availability</div>';
	headingText += '<div class="col-sm-1 Price table-elem">Price</div>';
	headingText += '<div class="col-sm-1 success Edit table-elem">Edit</div>';
	headingText += '<div class="col-sm-1 error Delete table-elem">Delete</div>';
	headingText += '</div>';

	text += headingText;
	productSection.innerHTML = text;
	text = '';

	for (x in data.reverse()) {
		divtext = '';
		divtext += '<div class="row Varela white-box">';
		divtext +=
			'<div class="col-sm-1 table-elem" id ="ProductID">' +
			data[x]['ProductID'] +
			'</div>';
		divtext +=
			'<div class="col-sm-2 table-elem" id="Name">' +
			data[x]['Name'] +
			'</div>';
		divtext += '<div class="col-sm-2 table-elem" id="Images">';
		for (i in data[x]['ImageURLs']) {
			divtext +=
				'<a href="' +
				data[x]['ImageURLs'][i] +
				'">' +
				data[x]['ImageURLs'][i] +
				'</a><br>';
		}
		divtext += '</div>';
		divtext += '<div class="col-sm-3 base2 table-elem id="Specifications">';
		divtext += data[x]['Specifications'];
		divtext += '</div>';
		divtext +=
			'<div class="col-sm-1 table-elem" id="Availability">' +
			data[x]['Availability'] +
			'</div>';
		divtext +=
			'<div class="col-sm-1 table-elem" id="Price">' +
			data[x]['Price'] +
			'</div>';
		divtext += '<div class="col-sm-1 success Edit table-elem">';
		divtext +=
			'<button class="btn btn-success" onclick="editProduct(this,\'' +
			data[x]['ProductID'] +
			'\')">Edit</button>';
		divtext += '</div>';
		divtext += '<div class="col-sm-1 error Delete table-elem">';
		divtext +=
			'<button class="btn btn-danger" onclick="deleteProduct(this,\'' +
			data[x]['ProductID'] +
			'\')">Delete</button>';
		divtext += '</div>';
		divtext += '</div>';
		text += divtext;
	}
	productSection.innerHTML += text;
}

function editProduct(doc, Pid) {
	openAddProductDialog();
	document.getElementById('addProductBtn').click();

	parentDiv = doc.parentNode.parentNode;
	console.log(parentDiv.children[0].innerHTML, Pid);
	document.getElementById('add-pid').value = parentDiv.children[0].innerHTML;
	document.getElementById('add-name').value = parentDiv.children[1].innerHTML;
	document.getElementById('add-specifications').value =
		parentDiv.children[3].innerHTML;

	var imageURLs = parentDiv.children[2].getElementsByTagName('a');
	for (var i = 0; i < imageURLs.length; i++) {
		console.log(imageURLs[i].innerText);
		addNewImageInput(imageURLs[i].innerHTML);
	}
}

async function deleteProduct(doc, Pid) {
	parentDiv = doc.parentNode.parentNode;
	queryObj = { PID: Pid };
	query = await makeAsyncPostRequest('delete-product/', queryObj);
	response = query.result;
	console.log(response);
	parentDiv.remove(1);
}

async function getDetails() {
	response = await makeAsyncGetRequest('get-details/');
	response = response.result;
	console.log(response);
	document.getElementById('owner-name').value = response['Name'];
	document.getElementById('owner-address').value = response['Address'];
	document.getElementById('owner-email').value = response['Email'];
	document.getElementById('owner-number').value = response['PhoneNumber'];
}

async function saveDetails() {
	queryObj = {
		Name: document.getElementById('owner-name').value,
		Address: document.getElementById('owner-address').value,
		Email: document.getElementById('owner-email').value,
		PhoneNumber: document.getElementById('owner-number').value,
	};
	response = await makeAsyncPostRequest('/save-details/', queryObj);
	console.log(response.result);
	document.getElementById('save-success').style.display = 'block';
}
