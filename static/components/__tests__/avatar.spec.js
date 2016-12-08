import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import expect from 'expect';
import Avatar from '../Avatar.jsx';

function shallowRender(Component, props) {
  const renderer = ReactTestUtils.createRenderer();
  renderer.render(<Component {...props}/>);
  return renderer.getRenderOutput();
}

describe('Avatar', () => {
	it('should display source image', () => {
		const src = "../../default.png";
		const avatar = shallowRender(Avatar, {source : src});
		expect(avatar.props.children.props.src).toEqual("../../default.png");
	});
})