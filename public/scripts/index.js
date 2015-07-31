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
            <a className="navbar-brand" href="#">Yelp Client</a>
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
  getInfo: function(query) {
    $.ajax({
      url: "http://127.0.0.1:3000/api/v1/search?term=" + query,
      type: 'get',
      dataType: 'json',
      success: function(data) {
        console.log(data['businesses']);
        React.render(
          <ResultCount amount={data['businesses'].length} />, document.getElementById('result-count')
        )

        React.render(
          <SuggestionPanel info={data['businesses']} />, document.getElementById('content')
        )
      }
    });
  },
  render: function() {
    return (
      <form id='search' className="input-group">
        <input type="text" className="form-control" placeholder="Search for..."/>
        <span className="input-group-btn">
          <button className="btn btn-primary" type="button" value='submit'>Search</button>
        </span>
      </form>
    )
  }
});

var SuggestionPanel = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.info.map(function(item,index){
          return (
            <div className="panel">
              <div className="panel-heading" role="tab" id="headingOne">
                <h1 className="panel-title">
                  <a role="button" data-toggle="collapse" href={"#collapse" + index} aria-expanded="true" aria-controls="collapseOne">
                    {item.name}
                  </a>
                  <p className='pull-right'>{item.rating}</p>
                </h1>
              </div>
              <div id={"collapse" + index} className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                <div className="panel-body">
                  <strong>CONTACT INFO</strong>
                  <p>{item.display_phone}</p>
                  <p>{item.location.display_address['0']}</p>
                  <p>{item.location.display_address['1']}</p>
                  <strong>WHAT PEOPLE ARE SAYING</strong>
                  <p>"{item.snippet_text}"</p>
                  <strong><a href={item.url} target='blank' >READ MORE</a></strong>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
});

var ResultCount = React.createClass({
  render: function() {
    return (
      <div>
        <h4 id='result-count'>{this.props.amount} results found!</h4>
      </div>
    )
  }
});

// all my JQuery
$('#search').submit(function(e) {
  var search = new Search;
  search.getInfo($('input').val());
  e.preventDefault();
});

// tell React to render components
React.render(
  <Navbar/>, document.getElementById('nav')
)

React.render(
  <Search/>, document.getElementById('search')
)
