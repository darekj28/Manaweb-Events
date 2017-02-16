var React = require('react');
var browserHistory = require('react-router').browserHistory;
import {Button, Table} from 'react-bootstrap';
function createHeader(field) {
	if (field == "post") return "Reported Post";
	else if (field == "reason") return "Violation";
	else if (field == "reporter") return "Reporter ID";
	else if (field == "recipient") return "Recipient ID";
	else if (field == "description") return "Additional Comments";
	else if (field == "timeString") return "Date Reported";
	else if (field == "isComment") return "Type";
}
export default class AdminReportList extends React.Component {
	constructor(props) {
		super(props);
	}
	handleSearch(e) {
		this.props.handleSearch(e.target.value);
	}
	handleSort(e) {
		this.props.handleSort(e.target.id);
	}
	goToComment(comment_id) {
		browserHistory.push('/comment/' + comment_id);
	}
	render() {
		var icon = this.props.activeSortDirection ? "fa fa-sort-asc" : "fa fa-sort-desc";
		return(
			<div className="admin-tab-container">
				<Button className="admin-user-reset" bsStyle="info" onClick={this.props.reset}>Reset</Button>
				<input className="form-control pull-right admin-user-search" placeholder="Search" value={this.props.searchQuery}
							onChange={this.handleSearch.bind(this)}></input>
				<Table striped condensed hover>
					<thead>
						<tr>
							{this.props.fields.map(function(field) {
								if (field == "comment_id" && property != "unique_id") return;
								if (field == this.props.activeSortField)
									return <th className="admin-user-sort-header admin-user-active-sort-header"
												onClick={this.handleSort.bind(this)} id={field}>
											{createHeader(field)}<span className={"pull-right " + icon}></span></th>
								else return <th className="admin-user-sort-header" 
											onClick={this.handleSort.bind(this)} id={field}>{createHeader(field)}</th>
							}.bind(this))}
						</tr>
					</thead>
					<tbody>
						{this.props.report_list.map(function(report) {
							var vals = [];
							for (var property in report) {
								if (property != "comment_id" && property != "unique_id")
									vals.push(report[property])
							}
							return <tr className="admin-report-table-row" onClick={() => {this.goToComment(report['comment_id'])}}>
								{vals.map(function(val) {
								return <td className="admin-table-data">{val}</td>
								})}</tr>
						}.bind(this))}
					</tbody>
				</Table>
			</div>
		);
	}
}

