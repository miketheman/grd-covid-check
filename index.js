/*
  This is a sample JavaScript file used by `index.html`

  On page load, we perform a couple of API calls to the CDC's COVID-19 data set.
  We then filter the results by date and get the most recent data for each county.

  We then use that data to populate the HTML.

  This is all written in as simple JavaScript as possible.
  There are likely ways to improve this code.
*/

const API_URL = "https://data.cdc.gov/resource/3nnm-4jni.json";

function filterByDate(data) {
  const filtered = data.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.county === item.county)
  );
  return filtered;
}

async function getDataFromAPI(params) {
  const response = await fetch(`${API_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// create a function to construct the desired HTML elements
function createHTML(data) {
  const date = new Date(data.date_updated).toLocaleDateString();

  const div = document.createElement("div");
  div.innerHTML = `<h3 class="county">
  ${data.county}: <span class="level ${data.covid_19_community_level
    .toLowerCase()
    .replace(" ", "-")}">${data.covid_19_community_level}</span></h3>`;
  return div;
}

const nyParams = new URLSearchParams({
  $select: "county,covid_19_community_level,date_updated,state",
  state: "New York",
  $where:
    "date_diff_d(to_floating_timestamp(get_utc_date(), 'UTC'), `date_updated`) <= 7 and county in('New York County', 'Kings County', 'Queens County', 'Bronx County', 'Richmond County')",
  $order: "county,date_updated DESC",
  $limit: 50,
});

const njParams = new URLSearchParams({
  $select: "county,covid_19_community_level,date_updated,state",
  state: "New Jersey",
  $where:
    "date_diff_d(to_floating_timestamp(get_utc_date(), 'UTC'), `date_updated`) <= 7 and county in('Bergen County', 'Essex County')",
  $order: "county,date_updated DESC",
  $limit: 50,
});

/* Main logic here */

// Make the fetch calls in parallel using Promise.all
Promise.all([getDataFromAPI(nyParams), getDataFromAPI(njParams)])
  .then((data) => {
    const nyData = filterByDate(data[0]);
    const njData = filterByDate(data[1]);
    allData = nyData.concat(njData);
    console.debug(allData);
    // Now populate the HTML
    const nyDiv = document.getElementById("ny-results");
    nyData.forEach((item) => {
      const div = createHTML(item);
      nyDiv.appendChild(div);
    });
    const njDiv = document.getElementById("nj-results");
    njData.forEach((item) => {
      const div = createHTML(item);
      njDiv.appendChild(div);
    });

    // Pick out any date value for the last updated date
    const date = new Date(allData[0].date_updated).toLocaleDateString();
    const lastUpdated = document.getElementById("last-updated");
    lastUpdated.innerHTML = `Most recent CDC data: ${date}`;

    // Determine the "highest" level from [Low, Medium, High] from all the counties
    const levels = allData.map((item) => item.covid_19_community_level);
    const highestLevel = levels.reduce((a, b) => {
      return a === "High" || b === "High"
        ? "High"
        : a === "Medium" || b === "Medium"
        ? "Medium"
        : "Low";
    });
    const levelDiv = document.getElementById("level");
    // set the entire body background color based on the highest level
    document.body.className = highestLevel.toLowerCase().replace(" ", "-");
  })
  .catch((error) => console.error(error));
