# react-flux

  flux是一种架构思想，和MVC类似，但是更加简单清晰，flux实现方法有很多种，本项目采用的是facebook官方实现。


## 安装flux

  ```sh
  npm install flux
  ```


## 了解flux

  在使用flux之前，首先我们要了解清楚flux到底是干什么的，只有理解了它真正的意思，才能更好的运用它。

  ```sh

  -（view）视图层，展示内容，绑定动作（action），并接收数据层（store）通知的更新显示

  -（controller）控制器，用来做告诉视图层（view）显示对应的内容；告诉动作层（action）视图层（view）做的动作；接收数据层（store）发送过来的最新消息，对视图层（view）显示的数据做更新

  -（action）动作层，通过视图层产生动作，并通知消息派发器（dispatcher）

  -（dispatcher）消息派发器，接收动作层（action）的消息，并将此消息发送到数据层（store），执行对应的回调。

  -（store）数据层，用来接收消息派发器（dispatcher）发送的消息，根据接收的消息对存储的数据做对应的更新。

  ```

  flux最大的特点，就是数据的 “单向流动”。


## flux实现

  ### view （视图层）

  ```js
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
  ```
  通过控制器传过来的值对相应的内容做渲染，并绑定事件。


  ### controller（控制器）

  ```js

    //Controller.jsx
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

  ```

  这是视图层、动作层、数据层之间的一个控制器，用来把要显示的数据告诉视图层；在视图层做某些动作的时候，通过控制器告诉动作层；接收数据层数据更新的消息。


  ### action （动作层）

  ```js

	let DispatcherObj = require('./../dispatcher/dispatcher');

	let Action = {
		addList: function(str) {
			DispatcherObj.dispatch({
				type: 'aaa',
				text: str
			})
		}
	};

	module.exports = Action;

  ```

  在视图层执行的动作，把当前的动作消息发送到数据层，通知数据层做出对应的操作。

  `Dispatcher.dispatch()`用来给消息派发器发送消息。


  ### dispatcher （消息派发器）

  ```js

	let Dispatcher = require('flux').Dispatcher;
	let AppDispatcher = new Dispatcher();
	let Store = require('./../store/store');

	AppDispatcher.register(function(action) {
		Store.addList(action.text);
		Store.emitChange();
	})

	module.exports = AppDispatcher;

  ```

  接收通过动作层发送过来的消息，并把接收到的消息派发到数据层。注意，消息派发器只能有一个，而且是全局的。

  `AppDispatcher.register()`用来通过动作层发送的消息执行对应的回调。


  ### store （数据层）

  ```js

	let EventEmitter = require('events').EventEmitter;
	let assign = require('object-assign');
	let Store = assign({}, EventEmitter.prototype, {
		list: [],
		getListAll() {
			return this.list;
		},
		addList(str) {
			this.list.push(str);
		},
		addChange(fCallback) {
			this.on('change', fCallback);
		},
		emitChange() {
			this.emit('change');
		}
	})

	module.exports = Store;

  ```

  这里有用到一个node.js中`events`对象中的`EventEmitter`方法，这个方法是用来做事件触发与事件监听器功能的封装。此处不做详细赘述。

  接收通过消息派发器发送的最新消息，进行数据更新。并执行消息派发器中调用的回调。


  ## flux的优势和困境

  ### flux的优势

	1、数据状态变得稳定同时行为可预测

	因为angular双向绑定的原因，我们永远无法知道数据在哪一刻处于稳定状态，所以我们经常会在angular中看到通过setTimeout的方式处理一些问题(其实有更优雅的解决方案，不在本次讨论之内)。同时由于双向绑定的原因，行为的流向我们也很难预测，当视图的model变多的时候，如果再加上一堆子视图依赖这些model，问题发生时定位简直是噩梦啊(这也是angular的错误信息那么不友好的原因，因为框架开发者也无法确定当前行为是谁触发的啊，绑定的人太多了...)。但是这里还是要强调一点就是，并不是说双向绑定就一定会导致不稳定的数据状态，在angular中我们通过一些手段依然可以使得数据变得稳定，只是双向绑定(mvvm)相对于flux更容易引发数据不稳定的问题。


	2、所有的数据变更都发生在store里

	flux里view是不允许直接修改store的，view能做的只是触发action，然后action通过dispatcher调度最后才会流到store。所有数据的更改都发生在store组件内部，store对外只提供get接口，set行为都发生在内部。store里包含所有相关的数据及业务逻辑。所有store相关数据处理逻辑都集中在一起，避免业务逻辑分散降低维护成本。


	3、数据的渲染是自上而下的

	view所有的数据来源只应该是从属性中传递过来的，view的所有表现由上层控制视图(controller-view)的状态决定。我们可以把controller-view理解为容器组件，这个容器组件中包含若干细小的子组件，容器组件不同的状态对应不同的数据，子组件不能有自己的状态。也就是，数据由store传递到controller-view中之后，controller-view通过setState将数据通过属性的方式自上而下传递给各个子view。


	4、view层变得很薄，真正的组件化

	由于2、3两条原因，view自身需要做的事情就变得很少了。业务逻辑被store做了，状态变更被controller-view做了，view自己需要做的只是根据交互触发不同的action，仅此而已。这样带来的好处就是，整个view层变得很薄很纯粹，完全的只关注ui层的交互，各个view组件之前完全是松耦合的，大大提高了view组件的复用性。


	5、dispatcher是单例的

	对单个应用而言dispatcher是单例的，最主要的是dispatcher是数据的分发中心，所有的数据都需要流经dispatcher，dispatcher管理不同action于store之间的关系。因为所有数据都必须在dispatcher这里留下一笔，基于此我们可以做很多有趣的事情，各种debug工具、动作回滚、日志记录甚至权限拦截之类的都是可以的。


  ### flux的困境

	1、过多的样板代码

	flux只是一个架构模式，并不是一个已实现好的框架，所以基于这个模式我们需要写很多样板代码，代码量duang的一下子上来了。。不过好在目前已经有很多好用的基于flux的第三方实现，目前最火的属redux。


	2、dispatcher是单例

	dispatcher作为flux中的事件分发中心，同时还要管理所有store中的事件。当应用中事件一多起来事件时序的管理变得复杂难以维护，没有一个统一的地方能清晰的表达出dispatcher管理了哪些store。


	3、异步处理到底写在哪里

	按flux流程，action中处理：依赖该action的组件被迫耦合进业务逻辑

	按store职责在store中处理：store状态变得不稳定，dispatcher的waitFor失效


	4、至今还没有官方实现


  ## 个人说明

  这个案例是结合阮一峰老师的[Flux 架构入门教程](http://www.ruanyifeng.com/blog/2016/01/flux.html)和kuitos的[GitHub](https://github.com/kuitos/kuitos.github.io/issues/27)还有本人的一些解释来写的，如有解释不清楚或者写错的地方，希望看这两位大神的原教程或者联系本人邮箱：`a260496725@qq.com`