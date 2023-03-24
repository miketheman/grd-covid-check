# grd-covid-check

A website to support a easy-to-check COVID status in the counties that GRD is active.

> Gotham’s “Community” primarily includes New York, Kings, Queens, Bronx & Richmond Counties in NY and Bergen and Essex Counties in NJ

The goal is to have a single page website that displays the current COVID County status
in aggregate, as well as individual county status.

## Data Sources

We are using the CDC data API.
It is updated weekly, so we may over-fetch data and trim it down to the most recent date.

See https://dev.socrata.com/foundry/data.cdc.gov/3nnm-4jni for more information.

## Development

Open `index.html`, `index.js` in your favorite editor and go nuts!

## Helpful References

The examples from the Socrata API docs use jQuery, here's an example of theirs,
with our filters:

```js
$.ajax({
  url: "https://data.cdc.gov/resource/3nnm-4jni.json",
  type: "GET",
  data: {
    "$select": "county,covid_19_community_level,date_updated,state",
    "state": "New York",
    "$where": "date_diff_d(to_floating_timestamp(get_utc_date(), 'UTC'), `date_updated`) <= 7 and county in('New York County', 'Kings County', 'Queens County', 'Bronx County', 'Richmond County')",
    "$order": "county,date_updated DESC",
    "$limit": 50,
  }
}).done(function(data) {
  console.log(data);
});
```

However we prefer the native fetch API, so our examples have been updated to use that.

A good reference for the Socrata API date and time is here:
https://support.socrata.com/hc/en-us/articles/4403481607447-Working-with-Date-and-Time

## License

MIT License. See [LICENSE.md](LICENSE.md) for more information.

## Author

[Mike Fiedler](https://github.com/miketheman)
