exports.itemToJSON = (item) => {

    const jsonResponse = {};

    for (var key in item) {
        if (item.hasOwnProperty(key)) {
            jsonResponse[key] = item[key].S;
        }
    }

    return jsonResponse;

}