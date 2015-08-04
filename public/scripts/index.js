var Navbar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand">Yelp Client</a>
          </div>
          <div id="navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><a href="https://github.com/alanbsmith/yelp_client" target="blank">view the repo</a></li>
              <li><a href="https://github.com/alanbsmith/rails_yelp_api" target="blank">view the rails api</a></li>
              <li><a href="https://facebook.github.io/react/index.html" target="blank">get started with react</a></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
});

var Search = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var query = React.findDOMNode(this.refs.query).value.trim();
    if(!query) {
      return;
    }
    this.props.onSubmit({query: query})
    React.findDOMNode(this.refs.query).value = '';    
  },
  render: function() {
    return (
      <form id='search' className="input-group" onSubmit={this.handleSubmit}>
        <input type="text" className="form-control" placeholder="Search for..." ref='query'/>
        <span className="input-group-btn">
          <button className="btn btn-primary" type="submit" value='Post'>Search</button>
        </span>
      </form>
    )
  }
});

var SuggestionPanels = React.createClass({
  render: function() {
    var businesses = this.props.info.businesses;
    if(this.props.display === false && businesses !== undefined) {
      var suggestions = businesses.map(function(suggestion,index) {
        return (
          <div className="panel">
            <div className="panel-heading" role="tab" id="headingOne">
              <h1 className="panel-title">
                <a role="button" data-toggle="collapse" href={"#collapse" + index} aria-expanded="true" aria-controls="collapseOne">
                  {suggestion.name}
                </a>
                <p className='pull-right'>{suggestion.rating}</p>
              </h1>
            </div>
            <div id={"collapse" + index} className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
              <div className="panel-body">
                <strong>CONTACT INFO</strong>
                <p>{suggestion.display_phone}</p>
                <p>{suggestion.location.display_address['0']}</p>
                <p>{suggestion.location.display_address['1']}</p>
                <strong>WHAT PEOPLE ARE SAYING</strong>
                <p>"{suggestion.snippet_text}"</p>
                <strong><a href={suggestion.url} target='blank' >READ MORE</a></strong>
              </div>
            </div>
          </div>
        );
      });
      return (
        <div className="suggestionPanels">
          {suggestions}
        </div>
      );
    } else {
      return false;
    }
  }
});

var ResultCount = React.createClass({
  render: function() {
    if(this.props.data.businesses === undefined) {
      return false;
    } else {
      return (<h4 id='result-count'>{this.props.data.businesses.length} results found!</h4>)
    }
  }
});

var MapToggle = React.createClass({
  handleClick: function(event) {
    this.props.onClick({map: !this.props.mapView});
  },
  render: function() {
    var text = this.props.mapView ? 'List' : 'Map';
    if (this.props.data.businesses !== undefined) {
      return (
        <button className="btn btn-danger pull-right" onClick={this.handleClick}>
          {text} view
        </button>
      );
    } else { return false; }
  }
});

var MapView = React.createClass({
  getPoints: function() {
    var businesses = this.props.info.businesses;
    var points = businesses.map(function(business,index) {
        return({ latitude: business.location.coordinate.latitude,longitude: business.location.coordinate.longitude })
    });
    return points;
  },
  render: function() {
    var region = this.props.info.region
    if(this.props.display === true && region !== undefined) {
      var points = this.getPoints();
      var map = <Map latitude={region.center.latitude} longitude={region.center.longitude} zoom={13} width={1100} height={500} points={points} />;
      console.log('mah points: ', points)
      return (
        <div id='map'><Map latitude={region.center.latitude} longitude={region.center.longitude} zoom={13} width={1100} height={500} points={points} />;</div>
        );
    } else {
      return(false);
    }
  }
});

var Content = React.createClass({
  getInitialState: function() {
    return {data: [], map: false, points: []};
  },
  handleQuerySubmit: function(data) {
    var query = this.state.data;
    this.setState({data: query}, function() {
      $.ajax({
        url: "http://127.0.0.1:3000/api/v1/search?term=" + data.query,
        type: 'get',
        dataType: 'json',
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  toggleMap: function(data) {
    this.setState({map: data.map});
  },
  render: function() {
    return(
      <div>
        <Navbar/>
        <div className='jumbotron'>
          <div className='col-md-8 col-md-offset-2'>      
            <Search onSubmit={this.handleQuerySubmit}/>
            <ResultCount data={this.state.data}/>
          <MapToggle data={this.state.data} onClick={this.toggleMap} mapView={this.state.map}/>
          </div>
        </div>
        <div className='container'>
          <SuggestionPanels display={this.state.map} info={this.state.data}/>
          <MapView display={this.state.map} info={this.state.data} />
        </div>
      </div>
    )
  }
});

// tell React to render components
React.render(
    <Content/>, document.getElementById('content')
)