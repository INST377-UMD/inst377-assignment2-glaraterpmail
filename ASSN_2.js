// Voice Commands with annyang
if (annyang) {
    const commands = {
        'hello': function () {
            alert("Hello World!");
        },
        'change the color to *color': function (color) {
            document.body.style.backgroundColor = color;
        },
        'navigate to *page': function (page) {
            window.location.href = `ASSN_2_${page.charAt(0).toUpperCase() + page.slice(1)}.html`;
        },
        'load dog breed *breed': function (breed) {
            const formattedBreed = breed.trim().toLowerCase();
            loadDogBreedInfo(formattedBreed);
        },
        'lookup *stock': function (stock) {
            document.getElementById('stock-ticker').value = stock.toUpperCase();
            fetchStockData();
        }
    };
    annyang.addCommands(commands);
    annyang.start();
}

// Toggle Audio Listening
function toggleAudio(state) {
    if (state === 'on') {
        annyang.start();
    } else {
        annyang.abort();
    }
}

// Fetch Quote from ZenQuotes
window.addEventListener('DOMContentLoaded', () => {
    fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"))
        .then(response => {
            if (response.ok) return response.json();
            throw new Error("Network response was not ok.");
        })
        .then(data => {
            const quoteData = JSON.parse(data.contents);
            document.getElementById("quote-text").innerText = `${quoteData[0].q} - ${quoteData[0].a}`;
        })
        .catch(error => {
            console.error("Error fetching quote:", error);
            document.getElementById("quote-text").innerText = "Could not load quote.";
        });

    fetchTopStocks();
});

// Fetch Stock Data and Display Chart
function fetchStockData() {
    const ticker = document.getElementById('stock-ticker').value.toUpperCase();
    const range = document.getElementById('days-range').value;
    const apiKey = 'XqWeGcBGYyK29CNYL6dGqiTo9EmNHS9p';

    if (!ticker) {
        alert("Please enter a stock ticker.");
        return;
    }

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().setDate(new Date().getDate() - range)).toISOString().split('T')[0];

    fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const labels = data.results.map(item => new Date(item.t).toLocaleDateString());
            const prices = data.results.map(item => item.c);

            const ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${ticker} Stock Price`,
                        data: prices,
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { text: 'Date', display: true } },
                        y: { title: { text: 'Price (USD)', display: true }, beginAtZero: false }
                    }
                }
            });
        })
        .catch(error => console.error("Error fetching stock data:", error));
}

// Fetch Top 5 Reddit Stocks
function fetchTopStocks() {
    fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#top-stocks-table tbody");
            tableBody.innerHTML = '';

            data.slice(0, 5).forEach(stock => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
                    <td>${stock.no_of_comments}</td>
                    <td>
                        ${stock.sentiment === 'Bullish' 
                            ? `<span style="color: green;">📈 Bullish</span>` 
                            : `<span style="color: red;">📉 Bearish</span>`}
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching top stocks:", error));
}
  
  // Load 10 random dog images 
  function loadRandomDogImages() {
    const carousel = document.querySelector('.simple-slider');
  
    // Fetch 10 random dog images from the Dog API
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(response => response.json())
      .then(data => {
        const images = data.message;
        images.forEach(image => {
          const imgElement = document.createElement('img');
          imgElement.src = image;
          imgElement.alt = "Random Dog Image";
          carousel.appendChild(imgElement);
        });
      })
      .catch(error => {
        console.error("Error fetching dog images:", error);
      });
  
    const slider = document.querySelector(".simple-slider");
    const prevArrow = document.getElementById("prev-arrow");
    const nextArrow = document.getElementById("next-arrow");
  
    // Scroll left when previous arrow is clicked
    prevArrow.addEventListener("click", () => {
      slider.scrollBy({
        left: -slider.offsetWidth, 
        behavior: "smooth"
      });
    });
  
    // Scroll right when next arrow is clicked
    nextArrow.addEventListener("click", () => {
      slider.scrollBy({
        left: slider.offsetWidth,
        behavior: "smooth"
      });
    });
  }
  
// Load dog breeds dynamically from the Dog API
function loadDogBreeds() {
    const breedsList = document.getElementById('breeds-list');

    // Fetch dog breeds from the API
    fetch('https://dogapi.dog/api/v2/breeds')
        .then(response => response.json())
        .then(data => {
            data.data.forEach(breed => {
                // Create buttons 
                const breedButton = document.createElement('button');
                breedButton.textContent = breed.attributes.name; 
                breedButton.setAttribute('class', 'button-74');
            
                breedButton.addEventListener('click', () => loadDogBreedInfo(breed.attributes.name));
                breedsList.appendChild(breedButton);
            });
        })
        .catch(error => console.error("Error fetching dog breeds:", error));
}

// Fetch detailed breed information from full dataset
function loadDogBreedInfo(breedName) {
    const breedInfoContainer = document.getElementById('dog-breed-info');
    const breedNameElement = document.getElementById('breed-name');
    const breedDescriptionElement = document.getElementById('breed-description');
    const breedMinLifeElement = document.getElementById('breed-min-life');
    const breedMaxLifeElement = document.getElementById('breed-max-life');

    // Fetch the full dataset and filter 
    fetch('https://dogapi.dog/api/v2/breeds')
        .then(response => response.json())
        .then(data => {
            const breed = data.data.find(item => item.attributes.name.toLowerCase() === breedName.toLowerCase());
            if (breed) {
                breedNameElement.textContent = breed.attributes.name;
                breedDescriptionElement.textContent = breed.attributes.description || "Description not available.";
                breedMinLifeElement.textContent = breed.attributes.life?.min || "N/A";
                breedMaxLifeElement.textContent = breed.attributes.life?.max || "N/A";

                breedInfoContainer.style.display = 'block';
            } else {
                console.error("Breed not found:", breedName);
            }
        })
        .catch(error => console.error("Error fetching breed info:", error));
}

 // Initialize the page
 document.addEventListener('DOMContentLoaded', () => {
    loadRandomDogImages(); 
    loadDogBreeds(); 
  });