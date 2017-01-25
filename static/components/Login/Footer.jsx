var React = require('react');
var Link = require('react-router').Link;
export default class Footer extends React.Component {
	render() {
		return(
			<div className="navbar navbar-default navbar-fixed-bottom">
				<div className="container">
					<div className="row">
					<div className="footer-title">© 2017 Manaweb, Inc.</div>
					<div className="footer-link"><Link to="/">About</Link></div>
					<div className="footer-link"><Link to="/">Terms</Link></div>
					<div className="footer-link"><Link to="/">Privacy</Link></div>
					<div className="footer-link"><Link to="/">Cookies</Link></div>
					<div className="footer-link"><Link to="/">Status </Link></div>
					<div className="footer-link"><Link to="/">Help</Link></div>
					</div>
				</div>
			</div>
			);
	}
}