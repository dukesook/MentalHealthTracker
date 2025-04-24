
export const Query = {
  async entireCollection(collection) {
    const data = {
      collection: collection
    }
    const queryString = new URLSearchParams(data).toString();
    let fetchRequest = `/query/all?${queryString}`;
    const httpResponse = await fetch(fetchRequest);
    const results = await httpResponse.json();
    return results;
  }
}

export default Query