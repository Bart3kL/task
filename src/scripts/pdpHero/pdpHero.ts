document.addEventListener('DOMContentLoaded', () => {
	const productSection = document.querySelector('.pdpHero');
	if (!productSection) return;

	const productId = productSection.getAttribute('data-product-id');
	const productScript = document.getElementById(`ProductJson-${productId}`);
	if (!productScript) return;

	const productData: Product = JSON.parse(productScript.textContent || '{}');

	const buyButtonContainer = document.getElementById('buy-button-container');
	if (!buyButtonContainer) return;

	if (productData.available) {
		const buyNowButton = document.createElement('button');
		buyNowButton.textContent = 'Buy Now';
		buyNowButton.addEventListener('click', () => {
			console.log('Buy Now button clicked!');
		});
		buyButtonContainer.appendChild(buyNowButton);
	} else {
		const outOfStockMessage = document.createElement('p');
		outOfStockMessage.textContent = 'Out of Stock - Notify Me';
		buyButtonContainer.appendChild(outOfStockMessage);
	}
});
