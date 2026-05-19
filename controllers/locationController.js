const countries = ["India", "United States", "United Kingdom", "Australia"];

const states = {
  "India": ["Delhi", "Maharashtra", "Karnataka", "Uttar Pradesh", "Gujarat"],
  "United States": ["California", "New York", "Texas", "Florida"],
  "United Kingdom": ["England", "Scotland", "Wales"],
  "Australia": ["New South Wales", "Victoria", "Queensland"]
};

const cities = {
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Connaught Place", "Vasant Kunj"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"],
  "Uttar Pradesh": ["Noida", "Ghaziabad", "Lucknow", "Kanpur", "Varanasi", "Agra"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
  "Texas": ["Houston", "Austin", "Dallas", "San Antonio"],
  "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
  "England": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"],
  "Scotland": ["Edinburgh", "Glasgow", "Aberdeen"],
  "Wales": ["Cardiff", "Swansea", "Newport"],
  "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
  "Victoria": ["Melbourne", "Geelong", "Ballarat"],
  "Queensland": ["Brisbane", "Gold Coast", "Cairns"]
};

export const getCountries = (req, res) => {
  res.json(countries);
};

export const getStates = (req, res) => {
  const { country } = req.query;
  const countryStates = states[country] || [];
  res.json(countryStates);
};

export const getCities = (req, res) => {
  const { state } = req.query;
  const stateCities = cities[state] || [];
  res.json(stateCities);
};
