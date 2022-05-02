const {origin} = window.location;

export const baseUrl = origin.includes('localhost') ? 'http://103.79.202.131:30012/prod-api' : `${origin}/prod-api`;
