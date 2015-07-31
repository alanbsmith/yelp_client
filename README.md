# Yelp-Client

### DESCRIPTION
This is only a client application. It's designed to work with [this Rails API](https://github.com/alanbsmith/rails_yelp_api) for getting information from Yelp.

_BUT WAIT? COULDN'T IT JUST DO THAT ON ITS OWN?_

Yes. It could. But my goal was to learn to build a react client that sends and receives data from an API. The Rails API is currently hardwired to search for results in Boulder, CO. Hopefully the next iteration will add that functionality.

### UP AND RUNNING
- clone the repo
- clone the [Rails API repo](https://github.com/alanbsmith/rails_yelp_api) and follow the up and running instructions for it.
- once your API is fired up, open the index page of the client app with Firefox.
- you can do that last step (from the directory) with this line `open public/index.html -a firefox`

### THINGS TO BE DONE
- set up gulp tasks for compiling assets and deployment
- DEPLOY!
- add search by city and category
- maps!
- authentication might be interesting