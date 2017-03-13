import React,{Component} from 'react';
import {render} from 'react-dom';
import {Controller} from './view/Controller';

class Main extends Component {
	constructor(){
		super();
	}
	render(){
		return(
			<Controller />
		)
	}
}

render(<Main />,document.querySelector('#flux'));