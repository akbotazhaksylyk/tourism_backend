async function loadLocations() {
    try {
        const response = await fetch('/api/search-locations?query=eiffel tower');
        const data = await response.json();
        const locations = data.data.Typeahead_autocomplete.results;
    
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = ''; // Clear previous results
    
        locations.forEach(location => {
            const name = location.detailsV2.names.name;
            const address = location.detailsV2.contact.streetAddress.street1 || 'No address provided';
            // Adjust the URL template as necessary
            const imageUrl = location.image.photo.photoSizeDynamic.urlTemplate.replace('{width}', '300').replace('{height}', '200');
    
            // Create HTML elements for each location
            const locationElement = document.createElement('div');
            locationElement.className = 'location';
            locationElement.innerHTML = `
                <img src="${imageUrl}" alt="${name}" style="width: 100%; max-width: 300px; height: auto; border-radius: 5px;">
                <h3>${name}</h3>
                <p>${address}</p>
            `;
            resultsContainer.appendChild(locationElement);
        });
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}
