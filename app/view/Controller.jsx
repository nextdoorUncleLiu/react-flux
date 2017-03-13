import React,{Component} from 'react';
let ListStore = require('./../store/store');
let Action = require('./../action/action');
import {View} from './../view/View';

export class Controller extends Component {
	constructor(){
		super();
		this.state = {
			list:ListStore.getListAll()
		};
		this.count = 0;
		this.creactList = this.creactList.bind(this)
	}
	componentDidMount(){
		ListStore.addChange(() => {
			this.setData();
		});
	}
	setData(){
		this.setState({
			list:ListStore.getListAll()
		})
	}
	creactList(){
		++this.count;
		Action.addList(this.count);
	}
	render(){
		return (
			<View list={this.state.list} newList={this.creactList} />
		)
	}
}

