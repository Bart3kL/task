interface ProductData {
	inventoryQuantity: number;
}

// Function to initialize product interactions
const initProductInteractions = (): void => {
	const productSection = document.querySelector(
		'.pdpHero'
	) as HTMLElement | null;
	if (!productSection) {
		console.error('Error: .pdpHero element not found.');
		return;
	}

	// Retrieve product data from data attributes
	const inventoryQuantityData = productSection.dataset.inventoryQuantity;

	if (typeof inventoryQuantityData === 'undefined') {
		console.error('Error: Inventory quantity data attribute is missing.');
		return;
	}

	const productData: ProductData = {
		inventoryQuantity: parseInt(inventoryQuantityData, 10),
	};

	if (isNaN(productData.inventoryQuantity)) {
		console.error('Error: Invalid inventory quantity value.');
		return;
	}

	// Display stock status message
	displayStockStatus(productData.inventoryQuantity);

	// Add event listener to the "Buy Now" button if available
	const buyNowButton = document.querySelector(
		'#pdpHeroBtn'
	) as HTMLButtonElement | null;
	if (buyNowButton) {
		buyNowButton.addEventListener('click', handleBuyNowClick);
	} else {
		console.warn(
			'Buy Now button not found. The product might be out of stock.'
		);
	}
};

// Function to determine and display stock status using a switch statement
const displayStockStatus = (inventoryQuantity: number): void => {
	const stockStatusMessageElement = document.querySelector(
		'.pdpHeroStockStatus'
	) as HTMLElement | null;
	if (!stockStatusMessageElement) {
		console.error('Error: .pdpHeroStockStatus element not found.');
		return;
	}

	let stockStatusMessage = '';
	let stockStatusClass = '';

	switch (true) {
		case inventoryQuantity === 0:
			stockStatusMessage = `Sold Out`;
			stockStatusClass = 'pdpHeroStockStatusSoldOut';
			break;
		case inventoryQuantity <= 5:
			stockStatusMessage = `Last pieces (${inventoryQuantity})`;
			stockStatusClass = 'pdpHeroStockStatusLastPieces';
			break;
		case inventoryQuantity <= 10:
			stockStatusMessage = `Low stock (${inventoryQuantity})`;
			stockStatusClass = 'pdpHeroStockStatusLow';
			break;
		case inventoryQuantity <= 20:
			stockStatusMessage = `Medium stock  (${inventoryQuantity})`;
			stockStatusClass = 'pdpHeroStockStatusMedium';
			break;
		default:
			stockStatusMessage = `High stock  (${inventoryQuantity})`;
			stockStatusClass = 'pdpHeroStockStatusHigh';
			break;
	}

	stockStatusMessageElement.textContent = stockStatusMessage;
	stockStatusMessageElement.classList.add(stockStatusClass);
};

// Event handler for the "Buy Now" button click
const handleBuyNowClick = (event: Event): void => {
	event.preventDefault();
	console.log('Buy Now button clicked.');
	// Additional logic for adding to cart or checkout can be implemented here
};

// Initialize after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', initProductInteractions);
