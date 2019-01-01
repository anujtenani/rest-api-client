import React from 'react';
export default function Spinner({ bgclass, width, height }) {
	let cls = [
		bgclass ? bgclass : 'bg-blue',
		width ? width : 'w-3',
		height ? height:'h-3'
	];
	const cla = cls.join(' ');
	return (<div className="spinner">
		<div className={`bounce1 ${cla}`} />
		<div className={`bounce2 ${cla}`} />
		<div className={`bounce3 ${cla}`} />
	</div>);
}
