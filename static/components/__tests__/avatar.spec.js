import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import expect from 'expect';
import Avatar from '../Avatar.jsx';

describe('Avatar', () => {
	it('should have an image to display avatar', () => {
		var component = ReactTestUtils.renderIntoDocument(<Avatar />);
		var img = ReactTestUtils.findRenderedDOMComponentWithTag(component, 'img');
		expect(img).toExist();
	});
})