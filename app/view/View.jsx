import React,{Component} from 'react';

export class View extends Component{
	constructor(props){
		super(props);
		this.props = props;
	}
	render(){
		let itemHtml = this.props.list.map(function (oCurObj,nIndex) {
		    return <li key={nIndex}>{oCurObj}</li>;
		  });
		return (
			<div>
				<ul>
					{itemHtml}
				</ul>
				<button onClick={this.props.newList.bind(this)}>新增new list</button>
			</div>
		)
	}
}