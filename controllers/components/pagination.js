async function pagination(req, res) {
  try {
    // define page and how many item are there in one page
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    // first item and last item of a page, slice method not include the last item
    const first_index = (page - 1) * limit;
    const last_index = page * limit;
    const total_page = Math.ceil(res.data.length / limit);
    const result = res.data.slice(first_index, last_index);
    res.json({
      total_item: res.data.length,
      total_page: total_page,
      result: result,
    });
  } catch (err) {
    console.log(err);
  }
}
module.exports = { pagination };
