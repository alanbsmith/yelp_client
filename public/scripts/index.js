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
    var suggestions = this.props.info.map(function(suggestion,index) {
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
  }
});

var ResultCount = React.createClass({
  render: function() {
    if(this.props.amount === undefined || this.props.amount === 0) {
      return false;
    } else {
      return (
        <h4 id='result-count'>{this.props.amount} results found!</h4>
      )
    }
  }
});

var Content = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  handleQuerySubmit: function(data) {
    var query = this.state.data;
    this.setState({data: query}, function() {
      $.ajax({
        url: "http://127.0.0.1:3000/api/v1/search?term=" + data.query,
        type: 'get',
        dataType: 'json',
        success: function(data) {
          this.setState({data: data['businesses']});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  render: function() {
    return(
      <div>
        <Navbar/>
        <div className='jumbotron'>
          <div className='col-md-8 col-md-offset-2'>      
            <Search onSubmit={this.handleQuerySubmit}/>
            <ResultCount amount={this.state.data.length}/>
          </div>
        </div>
        <div className='container'>
          <SuggestionPanels info={this.state.data}/>
        </div>
      </div>
    )
  }
});

// tell React to render components
React.render(
    <Content/>, document.getElementById('content')
)